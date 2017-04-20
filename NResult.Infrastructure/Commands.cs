using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using NResult.Core.Interfaces;
using System.Configuration;
using System.Data;

namespace NResult.Infrastructure
{
    public class Commands<T> : ICommands<T> where T : class
    {
        private readonly DbContext _context;
        public Commands(DbContext context)
        {
            _context = context;
        }
        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);  
                   
        }
        public void BulkAdd(List<T> entitiesList)
        {
            _context.BulkInsert(entitiesList);
        }

       public void ExecuteSqlCommand(string command)
        {
            SqlConnection Con = new SqlConnection(ConfigurationManager.ConnectionStrings["CustomerContext"].ToString());
            SqlCommand Cmd = new SqlCommand(command, Con);

            if (Con.State == ConnectionState.Closed)
            {
                Con.Open();
            }
           Cmd.CommandTimeout = int.MaxValue;
            // execute the query and return number of rows affected, should be one
           Cmd.ExecuteNonQuery();

            // close connection when done
            Con.Close();
        }

    }
}
