namespace NResult.Infrastructure.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class First : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Customer",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Gender = c.String(maxLength: 50),
                        Title = c.String(maxLength: 50),
                        Occupation = c.String(maxLength: 100),
                        Company = c.String(maxLength: 100),
                        GivenName = c.String(maxLength: 100),
                        MiddleInitial = c.String(maxLength: 50),
                        Surname = c.String(maxLength: 50),
                        BloodType = c.String(maxLength: 50),
                        EmailAddress = c.String(maxLength: 100),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Customer");
        }
    }
}
