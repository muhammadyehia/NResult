 (function () {
    var getStructure = function () {
        var object = [];

        var gender = {};
        gender.title = 'Gender';
        gender.name = "Gender";
        gender.template = "";
        gender.filter = { type: "text" };
        object.push(gender);

        var title = {};
        title.title = 'Title';
        title.name = "Title";
        title.template = "";
        title.filter = { type: "text" };
        object.push(title);

        var occupation = {};
        occupation.title = 'Occupation';
        occupation.name = "Occupation";
        occupation.template = "";
        occupation.filter = { type: "text" };
        object.push(occupation);

        var company = {};
        company.title = 'Company';
        company.name = "Company";
        company.template = "";
        company.filter = { type: "text" };
        object.push(company);

        var givenName = {};
        givenName.title = 'GivenName';
        givenName.name = "GivenName";
        givenName.template = "";
        givenName.filter = { type: "text" };
        object.push(givenName);

        var middleInitial = {};
        middleInitial.title = 'MiddleInitial';
        middleInitial.name = "MiddleInitial";
        middleInitial.template = "";
        middleInitial.filter = { type: "text" };
        object.push(middleInitial);

        var surname = {};
        surname.title = 'Surname';
        surname.name = "Surname";
        surname.template = "";
        surname.filter = { type: "text" };
        object.push(surname);

        var bloodType = {};
        bloodType.title = 'BloodType';
        bloodType.name = "BloodType";
        bloodType.template = "";
        bloodType.filter = { type: "text" };
        object.push(bloodType);

        var emailAddress = {};
        emailAddress.title = 'EmailAddress';
        emailAddress.name = "EmailAddress";
        emailAddress.template = "";
        emailAddress.filter = { type: "text" };
        object.push(emailAddress);

        return object;
    }

    var getData = function () {    
        var url = "/Home/Search";
        $("#TableContainer").XenoTable({
            source: url,
            filterObject: { PageSize: 20 },
            labels: { refresh: "Refresh", filter: "Filter", first: "First", last: "Last", records: "Records", recordsNoPerPage: "RecordsNoPerPage" },
            structures: getStructure(), onError: function (data) {
                if (data.Message) {

                } else {

                }
            }
        });
    }
    getData();
})();