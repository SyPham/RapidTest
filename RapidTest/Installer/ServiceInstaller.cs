using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RapidTest.Services;

namespace RapidTest.Installer
{
    public class ServiceInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAccountTypeService, AccountTypeService>();
            services.AddScoped<IAccountGroupService, AccountGroupService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAccountGroupAccountService, AccountGroupAccountService>();

            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IFactoryReportService, FactoryReportService>();
            services.AddScoped<ITestKindService, TestKindService >();


        }
    }
}
