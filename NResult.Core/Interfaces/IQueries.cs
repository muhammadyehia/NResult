using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace NResult.Core.Interfaces
{
    public interface IQueries<T> where T : class
    {
        long GetAllEntityCount();
        IQueryable<T> Query(List<Expression<Func<T, bool>>> filters = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null);

        IQueryable<T> GetPage(out long count, int pageSize = 1, int skipRecords = 10, List<Expression<Func<T, bool>>> filters = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null);
    }
}