using NResult.Core.Entities;
using System.Data.Entity;
namespace NResult.Infrastructure
{
    public class CustomerContext : DbContext
    {
        public CustomerContext()
            : base("name=CustomerContext")
        {
            Database.SetInitializer(new CreateDatabaseIfNotExists<CustomerContext>());
        }

        public virtual DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new CustomerEntityConfiguration());
        }
    }
}
