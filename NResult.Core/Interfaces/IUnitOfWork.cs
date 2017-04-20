using System;
using NResult.Core.Entities;

namespace NResult.Core.Interfaces
{
    public interface IUnitOfWork:IDisposable
    {
        IQueries<Customer> CustomerQueries { get; }
        ICommands<Customer> CustomerCommands { get; }
        bool AutoDetectChange { set; }
        bool ValidateOnSaveEnabled { set; }
        int Commit();
        void BulkCommit();
      
    }
}