using AutoMapper;
using RapidTest.DTO;
using RapidTest.DTO.auth;
using RapidTest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Helpers.AutoMapper
{
    public class EFToDtoMappingProfile : Profile
    {
        public EFToDtoMappingProfile()
        {

            CreateMap<Account, AccountDto>();
            CreateMap<AccountType, AccountTypeDto>();
            CreateMap<AccountGroup, AccountGroupDto>();
            CreateMap<Account, UserForDetailDto>();
            CreateMap<AccountGroupAccount, AccountGroupAccountDto>();

            CreateMap<Setting, SettingDto>();
            CreateMap<Employee, EmployeeDto>().ForMember(d => d.FactoryName, o => o.MapFrom(s => s.Factory.Name));
            CreateMap<Report, ReportDto>();
            CreateMap<FactoryReport, FactoryReportDto>();


        }
    }
}
