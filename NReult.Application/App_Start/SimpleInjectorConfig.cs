using System.Data.Entity;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using NResult.Core.Entities;
using NResult.Core.Interfaces;
using NResult.Core.Services;
using NResult.Infrastructure;
using SimpleInjector;
using SimpleInjector.Integration.Web;
using SimpleInjector.Integration.Web.Mvc;

namespace NReult.Application
{
    public static class SimpleInjectorConfig
    {
        public static void RegisterComponents()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();
            container.Register<DbContext, CustomerContext>(Lifestyle.Singleton);
            container.Register<IUnitOfWork, UnitOfWork>(Lifestyle.Transient);
            container.Register<ICommands<Customer>, Commands<Customer>>(Lifestyle.Transient);
            container.Register<IQueries<Customer>, Queries<Customer>>(Lifestyle.Transient);
            container.Register<ICustomerService, CustomerService>(Lifestyle.Transient);          
            container.RegisterMvcControllers(Assembly.GetExecutingAssembly());
            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));

        }
    }
}