using System.Collections.Generic;
using System.Linq;

namespace NResult.Core.Interfaces
{
    public interface ICommands<T> where T : class
    {
        void Add(T entity);
        void BulkAdd(List<T> entitiesList);
        void ExecuteSqlCommand(string command);
    }
}