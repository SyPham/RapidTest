﻿using AutoMapper;
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
            CreateMap<EmployeeDto, Employee>();

            CreateMap<ReportDto, Report>();
            CreateMap<FactoryReportDto, FactoryReport>();
            CreateMap<EmployeeImportExcelDto, Employee>();
            CreateMap<TestKindDto, TestKind>();

        }
    }
}
