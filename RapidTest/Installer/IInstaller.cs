using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RapidTest.Installer
{
    public interface IInstaller
    {
        void InstallServices(IServiceCollection services, IConfiguration configuration);
    }
}
