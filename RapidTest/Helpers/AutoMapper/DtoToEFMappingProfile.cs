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
    public class DtoToEFMappingProfile : Profile
    {
        public DtoToEFMappingProfile()
        {
            CreateMap<AccountDto, Account>()
                .ForMember(d => d.AccountType, o => o.Ignore());
            CreateMap<AccountTypeDto, AccountType>()
                .ForMember(d => d.Accounts, o => o.Ignore());
            CreateMap<AccountGroupDto, AccountGroup>();
            CreateMap<UserForDetailDto, Account>();
            CreateMap<AccountGroupAccountDto, AccountGroupAccount>();

            CreateMap<SettingDto, Setting>();
            CreateMap<EmployeeDto, Employee>()
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.BirthDay))
                .ForMember(d => d.Department, o => o.Ignore())
                .ForMember(d => d.IsPrint, o => o.Ignore())
                .ForMember(d => d.Gender, o => o.Ignore());

            CreateMap<ReportDto, Report>();
            CreateMap<FactoryReportDto, FactoryReport>();
            CreateMap<EmployeeImportExcelDto, Employee>();
            CreateMap<TestKindDto, TestKind>();
            CreateMap<Models.CheckInDto, CheckIn>();

        }
    }
}
