using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NReult.Application.Startup))]
namespace NReult.Application
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           // ConfigureAuth(app);
        }
    }
}
