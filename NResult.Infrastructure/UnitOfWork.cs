
using System;
using System.Data.Entity;
using NResult.Core.Entities;
using NResult.Core.Interfaces;

namespace NResult.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbContext _context;

        public UnitOfWork(DbContext context, ICommands<Customer> customerCommands, IQueries<Customer> customerQueries)
        {
            _context = context;
            CustomerQueries = customerQueries;
            CustomerCommands = customerCommands;
        }

        public IQueries<Customer> CustomerQueries { get; }
        public ICommands<Customer> CustomerCommands { get; }

        public bool AutoDetectChange
        {
            set { _context.Configuration.AutoDetectChangesEnabled = value; }
        }

        public bool ValidateOnSaveEnabled
        {
            set { _context.Configuration.ValidateOnSaveEnabled = value; }
        }
       
        public int Commit()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public void BulkCommit()
        {
           _context.BulkSaveChanges();
        }
    }
}
