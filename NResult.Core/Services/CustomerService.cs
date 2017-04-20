using System;
using System.Collections.Generic;
using System.Linq;
using NResult.Core.Entities;
using NResult.Core.Interfaces;
using System.Linq.Expressions;

namespace NResult.Core.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IUnitOfWork _unitOfWork;
        public CustomerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _unitOfWork.AutoDetectChange = false;
            _unitOfWork.ValidateOnSaveEnabled = false;
        }

        public void Dispose()
        {
            _unitOfWork.Dispose();
        }


        public void AddCustomer(Customer customer)
        {
            _unitOfWork.CustomerCommands.Add(customer);

            _unitOfWork.Commit();

        }

        public void InsertBulkCustomers(string customers)
        {
            _unitOfWork.CustomerCommands.ExecuteSqlCommand(customers);
        }

    public   void ClearData()
    {
        _unitOfWork.CustomerCommands.ExecuteSqlCommand("TRUNCATE TABLE Customer");
    }
        public IEnumerable<Customer> Qery(CustomerFilterModel customerFilterModel)
        {
            
            try
            {
                List<Expression<Func<Customer, bool>>> filters = new List<Expression<Func<Customer, bool>>>();
                Func<IQueryable<Customer>, IOrderedQueryable<Customer>> orderBy = c => c.OrderBy(d => d.Id);

                if (!string.IsNullOrEmpty(customerFilterModel.BloodType))
                {

                    filters.Add(c=>c.BloodType == customerFilterModel.BloodType);
                   
                }
                if (!string.IsNullOrEmpty(customerFilterModel.Company))
                {
    
                    filters.Add(c => c.Company == customerFilterModel.Company);
                }
                if (!string.IsNullOrEmpty(customerFilterModel.EmailAddress))
                {

                    filters.Add(c => c.EmailAddress.ToLower().Contains(customerFilterModel.EmailAddress.ToLower()));
                }
                if (!string.IsNullOrEmpty(customerFilterModel.Gender))
                {
                   
                     filters.Add(c =>  c.Gender == customerFilterModel.Gender);
                }
                if (!string.IsNullOrEmpty(customerFilterModel.GivenName))
                {

                    filters.Add(c => c.GivenName.ToLower().Contains(customerFilterModel.GivenName.ToLower()));
                }
                if (!string.IsNullOrEmpty(customerFilterModel.MiddleInitial))
                {
                   
                     filters.Add(c =>  c.MiddleInitial.ToLower().Contains(customerFilterModel.MiddleInitial.ToLower()));
                }
                if (!string.IsNullOrEmpty(customerFilterModel.Occupation))
                {
                   
                     filters.Add(c =>  c.Occupation == customerFilterModel.Occupation);
                }
                if (!string.IsNullOrEmpty(customerFilterModel.Surname))
                {
                   
                     filters.Add(c =>  c.Surname.ToLower().Contains( customerFilterModel.Surname.ToLower()));
                }
                if (!string.IsNullOrEmpty(customerFilterModel.Title))
                {
                   
                     filters.Add(c =>  c.Title == customerFilterModel.Title);
                }

                if (!string.IsNullOrEmpty(customerFilterModel.SortParameter))
                {
                    if (customerFilterModel.SortParameter == "BloodType")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.BloodType);
                        else
                            orderBy = c => c.OrderByDescending(d => d.BloodType);
                    }
                    if (customerFilterModel.SortParameter == "Company")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.Company);
                        else
                            orderBy = c => c.OrderByDescending(d => d.Company);
                    }
                    if (customerFilterModel.SortParameter == "EmailAddress")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.EmailAddress);
                        else
                            orderBy = c => c.OrderByDescending(d => d.EmailAddress);
                    }
                    if (customerFilterModel.SortParameter == "Gender")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.Gender);
                        else
                            orderBy = c => c.OrderByDescending(d => d.Gender);
                    }
                    if (customerFilterModel.SortParameter == "GivenName")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.GivenName);
                        else
                            orderBy = c => c.OrderByDescending(d => d.GivenName);
                    }
                    if (customerFilterModel.SortParameter == "MiddleInitial")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.MiddleInitial);
                        else
                            orderBy = c => c.OrderByDescending(d => d.MiddleInitial);
                    }
                    if (customerFilterModel.SortParameter == "Occupation")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.Occupation);
                        else
                            orderBy = c => c.OrderByDescending(d => d.Occupation);
                    }
                    if (customerFilterModel.SortParameter == "Surname")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.Surname);
                        else
                            orderBy = c => c.OrderByDescending(d => d.Surname);
                    }
                    if (customerFilterModel.SortParameter == "Title")
                    {
                        if (customerFilterModel.SortDirection)
                            orderBy = c => c.OrderBy(d => d.Title);
                        else
                            orderBy = c => c.OrderByDescending(d => d.Title);
                    }
                }
                long itemsCount;
                var result = _unitOfWork.CustomerQueries.GetPage(out itemsCount, customerFilterModel.PageSize, customerFilterModel.SkipRecords, filters, orderBy);

                customerFilterModel.TotalRecords = itemsCount;
                customerFilterModel.TotalPages = (customerFilterModel.TotalRecords - 1) / customerFilterModel.PageSize + 1;
                return result.AsEnumerable();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public long GetCustomersCount()
        {
            return _unitOfWork.CustomerQueries.GetAllEntityCount();
        }
    }
}
