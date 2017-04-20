using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using NResult.Core.Interfaces;
namespace NResult.Infrastructure
{
    public class Queries<T> : IQueries<T> where T : class
    {
        private readonly DbContext _context;
        public Queries(DbContext context)
        {
            _context = context;
        }
        public IQueryable<T> GetPage( out long count,int pageSize = 1,int skipRecords = 10, List<Expression<Func<T, bool>>> filters = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null)
        {
            var items = Query(filters, orderBy);
            count = items.Count();
            if (count == 0)
            {
                
            }
            return items.Skip(skipRecords).Take(pageSize);
        }

        public  IQueryable<T> Query(List<Expression<Func<T, bool>>> filters = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null)
        {
            IQueryable<T> query = _context.Set<T>();
            query = query.Where(p => true);
            if (filters != null )
            {
                foreach (var item in filters)
                {
                    query = query.Where(item);
                }
            }
               
            if (orderBy != null)
                query = orderBy(query);

            return query;
        }
        public long GetAllEntityCount()
        {
            return _context.Set<T>().AsNoTracking().Count();
        }
    }
}
