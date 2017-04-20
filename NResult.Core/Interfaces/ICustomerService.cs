using System;
using System.Collections.Generic;
using NResult.Core.Entities;

namespace NResult.Core.Interfaces
{
    public interface ICustomerService : IDisposable
    {

        void ClearData();
        void AddCustomer(Customer customer);
        void InsertBulkCustomers(string customers);
        long GetCustomersCount();
        IEnumerable<Customer> Qery(CustomerFilterModel customerFilterModel);
    }
}