using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NResult.Core.Entities
{
    public class FilterModel
    {
        public FilterModel()
        {
            PageSize = 5;
            CurrentPage = 1;
        }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalRecords { get; set; }
        public bool SortDirection { get; set; }
        public string SortParameter { get; set; }
        public int SkipRecords
        {
            get
            {
                return (CurrentPage -1) * PageSize;
            }
        }
    }
}
