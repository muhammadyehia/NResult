using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NResult.Core.Entities;

namespace NResult.Infrastructure
{
    public class CustomerEntityConfiguration : EntityTypeConfiguration<Customer>
    {
        public CustomerEntityConfiguration()
        {
            ToTable("Customer");
            HasKey(s => s.Id);
            Property(p=>p.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(p => p.Id).HasColumnOrder(1);
            Property(p => p.Gender).HasMaxLength(50);
            Property(p => p.Gender).HasColumnOrder(2);
            Property(p => p.Title).HasMaxLength(50);
            Property(p => p.Title).HasColumnOrder(3);
            Property(p => p.Occupation).HasMaxLength(100);
            Property(p => p.Occupation).HasColumnOrder(4);
            Property(p => p.Company).HasMaxLength(100);
            Property(p => p.Company).HasColumnOrder(5);
            Property(p => p.GivenName).HasMaxLength(100);
            Property(p => p.GivenName).HasColumnOrder(6);
            Property(p => p.MiddleInitial).HasMaxLength(50);
            Property(p => p.MiddleInitial).HasColumnOrder(7);
            Property(p => p.Surname).HasMaxLength(50);
            Property(p => p.Surname).HasColumnOrder(8);
            Property(p => p.BloodType).HasMaxLength(50);
            Property(p => p.BloodType).HasColumnOrder(9);
            Property(p => p.EmailAddress).HasMaxLength(100);
            Property(p => p.EmailAddress).HasColumnOrder(10);
        }
    }
}
