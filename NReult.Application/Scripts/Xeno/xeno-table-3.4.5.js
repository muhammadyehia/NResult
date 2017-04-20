var XenoTableMethods=  (function ($) {
    var pluginName = "XenoTable";
    var methods = {
        init: function (options) {
            var o = $.extend({
                enableExportingExcel: false,
                enableFiltering: true,
                enableSorting: true,
                enablePaging: true,
                enableRefreshing: true,
                enableMenu: true,
                enableCheckBox: false,
                enableCheckAllData: false,
                enableLoader: true,
                enableHide: false,
                enableDragging: true,
                isResponsive: true,
                title: "",
                mode: "full",
                culture: "en-gb",
                templateRegExp: new RegExp(/<#=(.*?)#>/g),
                dateRegExp: new RegExp(/\/Date\((\d+)\)\//gi),
                source: "",//url
                excelSource: "", //Excel URL
                data: [],
                key: "Key",
                pagedData: [],
                pagingOptions: { list: [5, 10, 20, 50, 100] },
                dataStructure: { success: "Success", list: "List", totalPages: "TotalPages", totalRecords: "TotalRecords" },//if empty string the data will be taken directly from the returned object                
                structures: [],//[{title:"",name:"",subName:"",template:"",filter:{type}]none,date,text,array
                sortObject: { direction: false, value: "" },
                filterObject: {},
                totalRecords: 1,
                totalPages: 1,
                maxPages: 5,
                excelIcon: "icon icon-excel",
                refreshIcon: "glyphicon glyphicon-refresh",
                filterIcon: "glyphicon glyphicon-filter",
                checkAllDataIcon: "glyphicon glyphicon-ok",
                closeIcon: "glyphicon glyphicon-remove",
                labels: {refresh: "Refresh", filter: "Filter", first: "First", last: "Last", records: "Total Records", recordsNoPerPage: "Records number per page" },
                pager: undefined,
                onInit: function () { },
                onHide: function () { },
                onShow: function () { },
                onHeaderBinding: function (cell) { },
                onRowBinding: function (row) { },
                onRowClick: function (item) { },
                onRowCheck: function (row) { },
                onCellBinding: function (cell, row) { },
                onTemplateClick: function (item) { },
                onSuccess: function () { },
                onError: function () { },
                onComplete: function () { },
                onLoading: function () { },
                onLoaded: function () { },
                onFilterClick: function () { },
                onRefreshClick: function () { },
                onSortClick: function () { }
            }, options || {});

            var self = this;
            var tagName = (typeof self.prop === 'function') ? self.prop('tagName') : self.attr('tagName');
            if (tagName === 'DIV') {

            } else if (tagName === "TABLE") {
                var table = self;
                var div = $(self).replaceTagName('div', true);
                div.append(table.removeAttr("id").removeAttr("name"));
                self = div;
            } else {
                self = $(self).replaceTagName('div', true);
            }
            this.each(function () {
                self.addClass(' xeno-table').data(pluginName, o);
                methods._draw.call(self);
            });
            o.onInit();

            return self;
        },
        show: function () {
            this.each(function () {
                var self = $(this), o = self.data(pluginName);
                if (o) {
                    self.fadeIn();
                    o.onShow();
                    return self;
                }
                return self;
            });
        },
        hide: function () {
            this.each(function () {
                var self = $(this), o = self.data(pluginName);
                if (o) {
                    self.hide();
                    o.onHide();
                    return self;
                }
                return self;
            });
        },
        getData: function () {
            var o = this.data(pluginName);
            if (o) {
                return o.data;
            }
            return null;
        },
        checkItem: function (item) {
            if (this.data(pluginName)) {
                var o = this.data(pluginName), itemKey = item[o.key];
                var $row = this.find("[data-key='" + itemKey + "']");
                var $checkbox = $row.find("input[type=checkbox]").prop("checked", true);
                $checkbox.change();
            }
        },
        selectItem: function (element) {
            if (this.data(pluginName)) {
                var $row = element.parent();
                var $checkbox = $row.find("input[type=checkbox]").prop("checked", true);
                $checkbox.change();
            }
        },
        refresh: function (options) {
            if (this.data(pluginName)) {
                var o = this.data(pluginName);
                o.pagedData = [];
                methods._refresh.call(this, options);
            }
        },
        toggleCompact: function (minify) {
            if (this.data(pluginName)) {
                methods._toggleCompact.call(this, minify);
            }
        },
        getCheckedItems: function () {
            if (this.data(pluginName)) {
                var o = this.data(pluginName), checkedItems = [];
                for (var i = 0, item; item = o.data[i]; i++) {
                    if (item.isChecked) {
                        checkedItems.push(item);
                    }
                }
                return checkedItems;
            }
            return [];
        },
        unCheckAll: function () {
            this.each(function () {
                var self = $(this), o = self.data(pluginName);
                if (o) {
                    self.find(":checkbox").prop("checked", false);
                    return self;
                }
                return self;
            });
        },
        _refresh: function (options) {
            options = options || {};
            this.each(function () {
                methods._createBody.call($(this), options);
            });
            return this;
        },
        _destroy: function () {
            this.empty();
            return this;
        },
        _showLoader: function () {
            var $loader = this.find('div.loader');
            if ($loader.length <= 0) {
                $loader = $("<div class='loader' style='display:none'><i></i></div>");
                this.append($loader);
            }
            $loader.width(this.width());
            $loader.height(this.height());
            $loader.css({ top: this.position().top, left: this.position().left });
            $loader.fadeIn();
        },
        _hideLoader: function () {
            var $loader = this.find('div.loader');
            if ($loader.length > 0) {
                $loader.width(this.width());
                $loader.height(this.height());
                $loader.css({ top: this.position().top, left: this.position().left });
                $loader.fadeOut();
            }
        },
        _lazyLoad: function (callback) {
            var self = this, o = this.data(pluginName), pager = o.pager, dataStructure = o.dataStructure;
            var currentPage = (pager) ? $(pager).XenoPager('getCurrentPage') : 1;
            o.filterObject.SortDirection = o.sortObject.direction;
            o.filterObject.SortParameter = o.sortObject.value;
            o.filterObject.CurrentPage = currentPage;
            var filterObjectDto = {
                'filterModel': o.filterObject,
                'SortDirection': o.sortObject.direction,
                'SortParameter': o.sortObject.value,
                'CurrentPage': currentPage,
            };
            filterObjectDto = JSON.stringify(filterObjectDto);
            $.ajax({
                url: o.source,
                dataType: "json",
                type: "POST",
                data: o.filterObject,
                beforeSend: function () {
                    if (typeof o.onLoading == 'function') {
                        o.onLoading();
                    }
                    if (o.enableLoader) {
                        methods._showLoader.call(self);
                    }
                },
                complete: function () {
                },
                success: function (data) {
                    if (dataStructure.hasOwnProperty("success")) {
                        if (data[dataStructure.success]) {
                            handleData();
                        } else {
                            if (typeof o.onError == 'function') {
                                o.onError(data);
                            }
                        }
                    } else {
                        handleData();
                    }
                    function handleData() {
                        if (dataStructure.hasOwnProperty("list")) {
                            o.data = data[dataStructure.list];
                            o.totalRecords = data[dataStructure.totalRecords];
                            o.totalPages = data[dataStructure.totalPages];
                        } else {
                            o.data = data;
                        }
                        o.pagedData[currentPage] = o.data;
                        if (pager) {
                            $(pager).XenoPager('changePagingOptions', o.totalRecords, o.totalPages);
                        }
                        callback();
                        if (o.enableLoader) {
                            methods._hideLoader.call(self);
                        }
                        if (typeof o.onSuccess == 'function') {
                            o.onSuccess(data);
                        }
                    }
                },
                error: function (data, status) {
                    if (typeof o.onError == 'function') {
                        o.onError({ status: status.capitalize(), statusCode: data.status, message: data.statusText, response: data.responseJSON });
                    }

                },
            });
        },
        _draw: function () {
            if (this.data(pluginName)) {
                methods._destroy.call(this);
                var self = this, o = this.data(pluginName), templatesMatches = {}, $table = self.find('table').first(),
                    $tbody = $('<tbody class="xeno-table-body"></tbody>'), $tfoot = $('<tfoot></tfoot>'), $thead = $('<thead></thead>');

                if ($table.length == 0) {
                    $table = $('<table></table>');
                    self.append($table);
                }
                if ($table.find('tbody').length <= 0) {
                    $table.append($thead);
                    $table.append($tbody);
                    $table.append($tfoot);
                    if (o.enableMenu) {
                        self.prepend(methods._drawMenu.call(this));
                    }
                    if (o.enableFiltering) {
                        $thead.append(methods._drawFilter.call(this));
                    }
                    $thead.append(methods._drawHeader.call(this));

                    for (var i = 0, structure; structure = o.structures[i]; i++) {
                        if (methods._isString(structure.template) && structure.template.length > 0) {
                            templatesMatches[structure.name] = methods._getMatches(structure.template, o.templateRegExp);
                        }
                    }
                    o.templatesMatches = templatesMatches;
                } else {
                    $tfoot = self.find('tfoot');
                }
                if (o.isResponsive) {
                    methods._responsive.call(self);
                }
                if (o.enableDragging) {
                    methods._draggable.call(self);
                }
                methods._createBody.call(self, {
                    callback: function () {
                        if (o.enablePaging) {
                            $tfoot.empty();
                            $tfoot.append(methods._drawPager.call(self));
                        }
                        if (typeof o.onComplete == 'function') {
                            o.onComplete();
                        }
                    }
                }
        );
            }

        },
        _createBody: function (options) {
            var self = this, o = self.data(pluginName), $tbody = self.find('tbody.xeno-table-body'), structures = o.structures,
                templatesMatches = o.templatesMatches, dateRegExp = o.dateRegExp, itemKey = o.key || "key";
            var callback = options.callback || function () { };
            if (o.source) {
                var currentPage, currentPageSize, filterPageSize = o.filterObject.PageSize, getNewData;
                if (o.pager) {
                    currentPage = $(o.pager).XenoPager('getCurrentPage');
                    currentPageSize = $(o.pager).XenoPager('getCurrentPageSize');

                }
                if (filterPageSize == undefined || currentPage == undefined) {
                    if (filterPageSize == undefined) {
                        o.filterObject.PageSize = 20;
                    }
                    getNewData = true;
                } else {
                    if (o.pagedData[currentPage] && o.pagedData[currentPage].length > 0 && currentPageSize == filterPageSize) {
                        getNewData = false;
                    } else {
                        getNewData = true;
                    }
                }
                if (!getNewData) {
                    o.data = o.pagedData[currentPage];
                    createBody(o.data);
                    callback(o.data);
                } else {

                    if (currentPageSize) {
                        o.filterObject.PageSize = currentPageSize;
                    }
                    methods._lazyLoad.call(self, function () {
                        createBody(o.data);
                        callback(o.data);
                    });
                }
            } else {
                callback();
                //TODO Data without lazy loading
            }
            function createBody(data) {
                $tbody.empty();
                (self.find("tr.header :checkbox").prop("checked", false));

                for (var i = 0, dataItem ; dataItem = data[i]; i++) {
                    var $row = $('<tr data-key="' + dataItem[itemKey] + '"></tr>');
                    if (o.enableCheckBox) {
                        var $cell = $('<td></td>');
                        var $checkBox = $('<input type="checkbox"/>').prop('checked', dataItem.isChecked);
                        $cell.append($checkBox);
                        (function (item) {
                            $checkBox.change(function (event) {
                                event.stopPropagation();
                                item.isChecked = this.checked;
                                var oneItem = [item];
                                o.onRowCheck(oneItem);
                            });
                        })(dataItem);
                        $row.append($cell);
                    }
                    var row = { element: $row, item: dataItem };
                    (function (item) {
                        $row.click(function () {
                            var row = { element: $(this), item: item };
                            o.onRowClick(row);
                        });
                    })(dataItem);
                    if (typeof o.onRowBinding == 'function') {
                        o.onRowBinding(row);
                    }
                    dataItem.template = {};
                    for (var j = 0, structure; structure = structures[j]; j++) {
                        var itemPropertyValue = dataItem[structure.name];
                        if (templatesMatches) {
                            var templateMatches = templatesMatches[structure.name];
                            if (templateMatches) {
                                dataItem.template[structure.name] = structure.template;
                                for (var k = 0, templateMatch; templateMatch = templateMatches[k]; k++) {
                                    var dataKey = dataItem[templateMatch.value];
                                    if (methods._isString(dataKey) || typeof dataKey === 'number' || typeof dataKey === 'boolean') {
                                        dataItem.template[structure.name] = (dataItem.template[structure.name].replace(templateMatch.expression, dataKey));
                                    }
                                }
                            }
                        }
                        if (methods._isString(itemPropertyValue) && hasString(itemPropertyValue, "Date")) {
                            var dateMatches = methods._getMatches(itemPropertyValue, dateRegExp);
                            if (dateMatches && dateMatches[0]) {
                                var newDate = new Date(parseInt(dateMatches[0].value));
                                var dateUtc = new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(), newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds());
                                itemPropertyValue = methods._formateDate.call(self, dateUtc);
                            }
                        }
                        if (structure.subName && itemPropertyValue instanceof Array) {
                            var temp = "";
                            for (var l = 0; l < itemPropertyValue.length; l++) {
                                var arrayItem = itemPropertyValue[l];
                                if (l > 0) {
                                    temp += "-";
                                }
                                temp += arrayItem[structure[j].subName];
                            }
                            dataItem[structure[j].name] = temp;
                        }
                        var cellHtml = (((itemPropertyValue != undefined) ? itemPropertyValue : "") + ((dataItem.template[structure.name]) ? dataItem.template[structure.name] : ""));
                        var $cell = $('<td></td>');
                        var cell = { element: $cell, structure: structure, value: cellHtml, item: dataItem };
                        $cell.html(cell.value);

                        if (typeof o.onCellBinding == 'function') {
                            o.onCellBinding(cell, row);
                        }
                        if (structure.title == "Actions") {
                            (function (item) {
                                $cell.find("a,button").click(function (event) {
                                    event.stopPropagation();
                                    if (typeof o.onTemplateClick == 'function') {
                                        var template = { item: item, element: $(this) };
                                        o.onTemplateClick(template);
                                    }
                                });
                            })(dataItem);
                        }
                        /*Minification*/
                        if (!structure.isPrimary && o.mode == "minified") {
                            $cell.hide();
                        }
                        $row.append($cell);
                    }
                    $tbody.append($row);

                }
                if (typeof o.onLoaded == 'function') {
                    o.onLoaded({ totalRecords: o.totalRecords });
                }
            }
            function hasString(source, target) {
                return source.indexOf(target) >= 0;
            }
        },
        _drawMenu: function () {
            var self = this, o = this.data(pluginName), filterObject = o.filterObject, pager = o.pager,
                $menu = $('<div class="menu">' + o.title + '</div>');

            if (o.enableHide) {
                var $hideButton = $('<a><i class="' + o.closeIcon + '"></i></a>');
                $hideButton.click(function () {
                    methods.hide.call(self);
                });
                $menu.append($hideButton);
            }
            if (o.enableRefreshing) {
                var $refreshButton = $('<a title= "' + o.labels.refresh + '"><i class="' + o.refreshIcon + '"></i></a>');
                $refreshButton.click(function () {
                    var $filterRow = self.find("tr.filter");
                    var $filters = $filterRow.find('input,select');
                    for (var i = 0, $filter; $filter = $filters[i]; i++) {
                        $filter.value = "";
                        filterObject[$filter.getAttribute("name")] = "";
                    }
                    o.pagedData = [];

                    if (pager) {
                        pager.XenoPager('changePage', 1);
                    } else {
                        methods._refresh.call(self);
                    }
                    if (typeof o.onRefreshClick == 'function') {
                        o.onRefreshClick();
                    }
                });
                $menu.append($refreshButton);
            }

            if (o.enableFiltering) {
                var $filterButton = $('<a title= "' + o.labels.filter + '"><i class="' + o.filterIcon + '"></i></a>');
                $filterButton.click(function () {
                    var $filterRow = self.find("tr.filter");
                    $filterRow.fadeToggle();
                });
                $menu.append($filterButton);
            }
            if (o.enableExportingExcel) {
                var $exportingExcelButton = $('<a><i class="' + o.excelIcon + '" style="font-size: 21px;"></i></a>');

                $exportingExcelButton.click(function () {
                    var $form = $("<form></form>")
                        .attr("action", o.excelSource)
                        .attr("method", "post");

                    var $filterRow = self.find("tr.filter");
                    var $filters = $filterRow.find("input,select");
                    for (var i = 0, $filter; $filter = $filters[i]; i++) {
                        (function ($filter) {
                            var $hidden = $("<input/>")
                            .attr("type", "hidden")
                            .attr("name", $filter.getAttribute("name"))
                            .val($filter.value);
                            $form.append($hidden);
                        })($filter);
                    }
                    (function () {
                        var $hidden = $("<input/>")
                        .attr("type", "hidden")
                        .attr("name", "PageSize")
                        .val(0);
                        $form.append($hidden);
                    })();
                    (function () {
                        var $hidden = $("<input/>")
                        .attr("type", "hidden")
                        .attr("name", "CurrentPage")
                        .val(0);
                        $form.append($hidden);
                    })();
                    $("body").append($form);

                    $form.submit();

                    $form.remove();
                });
                $menu.append($exportingExcelButton);
            }

            if (o.enableCheckAllData) {
                var $checkAllDataButton = $('<a><i class="' + o.checkAllDataIcon + '"></i></a>');
                $checkAllDataButton.click(function () {

                });
                $menu.append($checkAllDataButton);
            }

            return $menu;
        },
        _drawHeader: function () {
            var self = this, o = this.data(pluginName), structures = o.structures, sortObject = o.sortObject;
            var $row = $('<tr class="header"></tr>');
            if (o.enableCheckBox && o.enableCheckAllData) {
                var $cell = $('<td ></td>');
                var $link = $('<a class="xeno-sort-btn"></a>');
                var $checkBox = $('<input type="checkbox"/>');
                $cell.width("40px");

                $link.append($checkBox);
                $cell.append($link);
                $checkBox.click(function () {
                    var allCheckBoxes = self.find('tr input[type=checkbox]').prop("checked", this.checked);
                    for (var i = 0, item; item = o.data[i]; i++) {
                        item.isChecked = this.checked;
                    }
                    o.onRowCheck(o.data);
                });
                $row.append($cell);
            }
            else if(o.enableCheckBox){
                var $cell = $('<td ></td>');
                var $link = $('<a class="xeno-sort-btn" style="height:33px"></a>');
                $cell.append($link);
                $cell.width("40px");

                $row.append($cell);
            }
            for (var i = 0, structure ; structure = structures[i]; i++) {
                var $cell = $('<td></td>');
                var $link = $('<a class="xeno-sort-btn">' + structure.title + '<span></span></a>');
                if (structure.style) {
                    $cell.attr("style", structure.style);
                }
                $cell.append($link);
                if (structure.name && structure.sort != false && o.enableSorting) {
                    $link.attr('data-sort', structure.name);
                    $link.click(function (event) {
                        sortObject.direction = !sortObject.direction;
                        sortObject.value = $(this).attr('data-sort');
                        var $allSpans = $row.find('span');
                        if ($allSpans) {
                            $allSpans.removeClass();
                        }
                        var $span = $(this).find('span');
                        if ($span) {
                            $span.addClass((sortObject.direction) ? "caret-ascending" : "caret-descending");
                        }
                        methods.refresh.call(self);
                        if (typeof o.onSortClick == 'function') {
                            o.onSortClick();
                        }
                    });
                }
                var cell = { element: $cell, structure: structure, sorter: $link };
                o.onHeaderBinding(cell);

                $row.append($cell);

            }
            return $row;
        },
        _drawFilter: function () {
            var self = this, o = this.data(pluginName), structures = o.structures, filterObject = o.filterObject, pager = o.pager;
            var $row = $('<tr class="filter" ' + ((o.enableMenu) ? 'style="display:none' : '') + '"></tr>');
            if (o.enableCheckBox) {
                var $cell = $('<td></td>');
                $row.append($cell);
            }

            for (var i = 0, structure; structure = structures[i]; i++) {
                var filterBy = (structure.filter && structure.filter.name) ? structure.filter.name : structure.name;
                var $cell = $('<td></td>'), $filter;
                if (structure.name) {
                    if (structure.filter && structure.filter.type) {
                        switch (structure.filter.type) {
                            case "none":
                                $filter = $('<input type="text" disabled="disabled"/>');
                                break;
                            case "date":
                                $filter = $('<input type="text" placeholder="' + structure.title + '" name="' + filterBy + '"/>');
                                if (typeof jQuery().XenoPicker == 'function') {
                                    $filter = $filter.XenoPicker({});
                                } else {
                                    console.log("XenoPicker not loaded");
                                }

                                break;
                            case "list":
                                $filter = $('<select name="' + filterBy + '"></select>');
                                if (structure.filter.list && structure.filter.list instanceof Array) {
                                    for (var j = 0, option; option = structure.filter.list[j]; j++) {
                                        var $option = ('<option value="' + option.Id + '">' + option.Name + '</option>');
                                        $filter.append($option);
                                    }
                                }
                                break;
                            case "text":
                            default: $filter = $('<input type="text" placeholder="' + structure.title + '" name="' + filterBy + '"/>');
                                break;

                        }
                        $cell.append($filter);

                    } else {

                    }
                    $row.append($cell);
                } else {

                }
            }
            var $cell = $('<td></td>');
            var $filterbutton = $('<a class="filter">' + o.labels.filter + '</a>');
            function filter() {
                var $filters = $row.find('input,select');
                for (var i = 0, filterFieldsCount = $filters.length; i < filterFieldsCount; i++) {
                    filterObject[$filters[i].getAttribute("name")] = $filters[i].value;
                }
                o.pagedData = [];
                if (o.pager) {

                    o.pager.XenoPager('changePage', 1);
                } else {
                    methods.refresh.call(self);
                }
                if (typeof o.onFilterClick == 'function') {
                    o.onFilterClick();
                }
            }
            $row.keyup(function (event) {
                if (event.keyCode === 13) {
                    filter();
                }
            });
            $filterbutton.click(function () {
                filter();
            });
            $cell.append($filterbutton);
            $row.append($cell);
            return $row;
        },
        _toggleCompact: function (minify) {
            if (this.data(pluginName)) {
                var self = this, o = this.data(pluginName), structures = o.structures;
                if (minify && o.mode == "full") {
                    var $rows = self.find('table tr');
                    for (var i = 0, structure; structure = structures[i]; i++) {
                        for (var j = 0, row; row = $rows[j]; j++) {
                            if (!structure.isPrimary) {
                                var cell = row.cells[i];
                                $(cell).hide();
                            }
                        }
                    }
                    o.mode = "minified";
                } else if (!minify && o.mode == "minified") {
                    self.find('table tr td').show();
                    o.mode = "full";
                }
            }
        },
        _drawPager: function () {
            var self = this, o = this.data(pluginName), currentpageSize = o.filterObject.PageSize || 10;
            var $row = $('<tr></tr>');
            var $cell = $('<td colspan="100%"></td>');
            o.pager = $cell.XenoPager({
                totalRecords: o.totalRecords,
                totalPages: o.totalPages,
                maxPages: o.maxPages,
                currentPageSize: currentpageSize,
                pagesOptions: o.pagingOptions.list,
                firstText: o.labels.first,
                prevText: '<',
                nextText: '>',
                lastText: o.labels.last,
                recordsText: o.labels.records,
                recordsNoPerPage: o.labels.recordsNoPerPage,
                onPageChange: function (page) {
                    methods._refresh.call(self);
                },
                onPageSizeChange: function (pageSize) {
                    o.pagedData = [];
                    methods._refresh.call(self);
                }

            });
            $row.append($cell);
            return $row;
        },
        _responsive: function () {
            var self = this, o = this.data(pluginName);
            $(window).ready(function () {
                var width = $(window).width();
                if (o.maxWidth == null) {
                    o.maxWidth = self.width() + 10;
                }
                if (width <= 767) {
                    methods._toggleCompact.call(self, true);
                } else if (width > 767) {
                    methods._toggleCompact.call(self, false);
                }
                $(window).resize(function () {
                    width = $(window).width();
                    if (width <= 767) {
                        methods._toggleCompact.call(self, true);

                    } else if (width > 767) {
                        methods._toggleCompact.call(self, false);
                    }
                });
            });
        },
        _draggable: function () {
            var self = this, o = this.data(pluginName);
            var menu = self.find(".menu");
            menu.mousedown(function (event) {
                console.log("drag");
                move(event);
                //      self.css('position', 'fixed');
            });
            function move(e) {
                var mouseX = document.all ? window.event.clientX : e.pageX;
                var mouseY = document.all ? window.event.clientY : e.pageY;
                console.log(mouseX, mouseY)
                var dialogX = mouseX - self.offset().left;
                var dialogY = mouseY - self.offset().top;

                var x = mouseX - dialogX;
                var y = mouseY - dialogY;

                var documentHeight = $(document).height() - self.height();
                var documentWidth = $(document).width() - self.width();

                if (x > 0 && x < documentWidth) {
                    self.css('left', x);
                }
                if (y > 0 && y < documentHeight) {
                    self.css('top', y);
                }

            }
        },
        _isString: function (value) {
            if (value && typeof value == 'string' || value instanceof String) {
                return true;
            }
            return false;
        },
        _getMatches: function (string, regex, index) {
            index || (index = 1); // default to the first capturing group
            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push({ expression: match[0], value: match[1].replace(/ /g, '') });
            }
            return matches;
        },
        _formateDate: function (date) {
            var self = this, o = self.data(pluginName);
            var formattedDate = date.toLocaleDateString(o.culture) + " " + date.toLocaleTimeString(o.culture);
            return formattedDate;
        }
    };
    $.fn[pluginName] = function (method) {
        if (methods[method] && method.charAt(0) != '_') {
            return methods[method].apply($(this), Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply($(this), arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.XenoTable');
        }
    };
    return {methods:methods};

})(jQuery);
(function ($) {
    var pluginName = "XenoPager";
    var methods = {
        init: function (options) {
            var o = $.extend({
                bootstrapStyle: false,
                maxPages: 5,
                totalRecords: 1,
                totalPages: 1,
                currentPage: 1,
                currentPageSize: 10,
                pagesOptions: [10, 20, 50, 100],
                firstText: 'First',
                prevText: '<',
                nextText: '>',
                lastText: 'Last',
                recordsText: 'Total Records',
                recordsNoPerPage: 'Records No PerPage',
                onPageChange: function () { },
                onPageSizeChange: function () { },
                onInit: function () { }
            }, options || {});
            var tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');

            var $ul = tagName === 'UL' ? this : $('<ul></ul>').appendTo(this);
            var self = $ul;

            this.each(function () {
                self.addClass(' xeno-pager').data(pluginName, o);
                methods._draw.call(self);
            });

            o.onInit();

            return self;
        },

        changePage: function (page) {
            var o = this.data(pluginName);
            if (page >= 1 && page <= o.totalPages) {
                o.currentPage = page;
                o.onPageChange(page);
                methods._draw.call(this);
            }
        },
        changePageSize: function (pageSize) {
            var o = this.data(pluginName);
            o.currentPageSize = pageSize;
            o.currentPage = 1;
            o.onPageSizeChange(pageSize);
            methods._draw.call(this);

        },
        changePagingOptions: function (totalRecords, totalPages) {
            var o = this.data(pluginName);
            o.totalRecords = totalRecords;
            o.totalPages = totalPages;
            methods._draw.call(this);
        },
        getPagesCount: function () {
            return this.data(pluginName).totalPages;
        },

        getCurrentPage: function () {
            return this.data(pluginName).currentPage;
        },
        getCurrentPageSize: function () {
            return this.data(pluginName).currentPageSize;
        },
        destroy: function () {
            this.empty();
            return this;
        },
        _draw: function () {
            var self = this, o = self.data(pluginName), counter = 1, maxCounter = o.totalPages, pagingOptionsList = o.pagesOptions;
            methods.destroy.call(this);
            if (maxCounter > 1) {
                // Generate First link
                if (o.firstText) {
                    self.append(methods._appendItem.call(this, 1, o.firstText));
                }
                // Generate Prev link
                if (o.prevText) {
                    self.append(methods._appendItem.call(this, ((o.currentPage > 1) ? o.currentPage - 1 : 1), o.prevText));
                }
                //caclulate paging
                if (maxCounter > o.maxPages) {
                    counter = o.currentPage - Math.ceil(o.maxPages / 2);
                    if (counter < 1) {
                        counter = 1;
                    } else if (counter > maxCounter - o.maxPages) {
                        counter = maxCounter - o.maxPages;
                    }
                    maxCounter = counter + o.maxPages;
                }
                if (counter > 1) {
                    self.append("<li style='padding:2px 5px'>...</li>");
                }
                //Generate numbered links
                for (var i = counter; i <= maxCounter; i++) {
                    self.append(methods._appendItem.call(self, i, i));
                }
                if (maxCounter < o.totalPages) {
                    self.append("<li style='padding:2px 5px'>...</li>");
                }
                // Generate Next link
                if (o.nextText) {
                    self.append(methods._appendItem.call(self, ((o.currentPage < o.totalPages) ? o.currentPage + 1 : o.totalPages), o.nextText));
                }
                // Generate Last link
                if (o.lastText) {
                    self.append(methods._appendItem.call(self, o.totalPages, o.lastText));
                }

                var $pagingOptionsList = $('<select class="pager-list"></select>');

                var length = pagingOptionsList.length;
                for (var i = 0; i < length; i++) {
                    var item = pagingOptionsList[i];
                    var $options;
                    if (item === 0) {
                        $options = $("<option value=" + item + ">" + "All" + "</option>");
                    } else {
                        $options = $("<option value=" + item + ">" + item + "</option>");
                    }
                    $pagingOptionsList.append($options);
                }
                $pagingOptionsList.change(function () {
                    methods.changePageSize.call(self, $pagingOptionsList.val());
                });
                this.append([$("<span>").css({'padding': "0 5px"}).html(o.recordsNoPerPage), $pagingOptionsList]);
                $pagingOptionsList.val(o.currentPageSize);

            }
            this.append('<li class="records">' + o.recordsText + ' : ' + o.totalRecords + '</li>');
        },
        _appendItem: function (pageIndex, text) {
            var self = this, o = self.data(pluginName), $link, $linkWrapper = $('<li></li>');
            $link = $('<a ' + ((pageIndex == o.currentPage) ? 'class="active"' : '') + '>' + text + '</a>');
            if (pageIndex != o.currentPage) {
                $link.click(function () {
                    methods.changePage.call(self, pageIndex);
                });
            }
            $linkWrapper.append($link);
            return $linkWrapper;
        },
    };

    $.fn[pluginName] = function (method) {
        // Method calling logic
        if (methods[method] && method.charAt(0) != '_') {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.XenoPager');
        }

    };

})(jQuery);
