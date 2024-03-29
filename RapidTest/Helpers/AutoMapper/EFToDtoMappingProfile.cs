﻿using AutoMapper;
using RapidTest.Constants;
using RapidTest.DTO;
using RapidTest.DTO.auth;
using RapidTest.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Helpers.AutoMapper
{
    public class EFToDtoMappingProfile : Profile
    {
        public EFToDtoMappingProfile()
        {

            CreateMap<Account, AccountDto>().ForMember(d => d.AccountTypeName, o => o.MapFrom(s => s.AccountType.Name));
            CreateMap<AccountType, AccountTypeDto>();
            CreateMap<AccountGroup, AccountGroupDto>();
            CreateMap<Account, UserForDetailDto>();
            CreateMap<AccountGroupAccount, AccountGroupAccountDto>();
            CreateMap<Account, UserForDetailDto > ().ForMember(d => d.AccountType, o => o.MapFrom(s => s.AccountType.Code));

            CreateMap<Setting, SettingDto>();

            CreateMap<Employee, EmployeeDto>()
                 .ForMember(d => d.Gender, o => o.MapFrom(s => s.Gender == true ? "NAM" : "NỮ"))
                 .ForMember(d => d.IsPrint, o => o.MapFrom(s => s.IsPrint == true ? "ON" : "OFF"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Department.Code))
                .ForMember(d => d.BirthDay, o => o.MapFrom(s => s.BirthDate))
                .ForMember(d => d.FactoryName, o => o.MapFrom(s => s.Factory.Name))
                  .ForMember(d => d.Kind, o => o.MapFrom(s =>
                s.SettingId != null ?
                s.Setting.Name : "N/A")
                );
            CreateMap<Report, ReportDto>()
                .ForMember(d => d.Result, o => o.MapFrom(s => s.Result == 2 ? "Âm tính" : "Dương tính"))
                .ForMember(d => d.TestKindId, o => o.MapFrom(s => s.TestKind.Name))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName))
                .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM" : "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate))
                .ForMember(d => d.ExpiryTime, o => o.MapFrom(s => s.ExpiryTime))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime))
                .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => s.CreatedTime))
                .ForMember(d => d.CheckInTime, o => o.MapFrom(s => s.Employee.CheckIns.OrderByDescending(x=> x.Id).Select(x=> (DateTime?)x.CreatedTime).FirstOrDefault(x=> x.Value.Date == s.CreatedTime.Date)) )
                .ForMember(d => d.FactoryEntryTime, o => o.MapFrom(s => s.Employee.FactoryReports.OrderByDescending(x => x.Id).Select(x => (DateTime?) x.CreatedTime).FirstOrDefault(x => x.Value.Date == s.CreatedTime.Date) ))
                .ForMember(d => d.KindName, o => o.MapFrom(s => s.Employee.SettingId != null ? s.Employee.Setting.Name : "N/A") );
            CreateMap<FactoryReport, FactoryReportDto>()
                .ForMember(d => d.Result, o => o.MapFrom(s => s.Result == 2 ? "Âm tính" : "Dương tính"))
                .ForMember(d => d.TestKindId, o => o.MapFrom(s => s.TestKind.Name))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM" : "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName))
                .ForMember(d => d.ExpiryTime, o => o.MapFrom(s => s.ExpiryTime.ToString("MM/dd/yyyy HH:mm:ss")))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.RapidTestTime, o => o.MapFrom(s => s.RapidTestTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.FactoryEntryTime, o => o.MapFrom(s => s.FactoryEntryTime.ToString("MM/dd/yyyy HH:mm:ss")))
                .ForMember(d => d.KindName, o => o.MapFrom(s => s.Employee.SettingId != null ? s.Employee.Setting.Name : "N/A") );
            CreateMap<Models.TestKind, TestKindDto>();
            CreateMap<Models.CheckIn, CheckInDto>()
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM" : "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy HH:mm:ss")))
                .ForMember(d => d.CheckInTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy HH:mm:ss")))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName))
                .ForMember(d => d.CheckOutTime, o => o.MapFrom(s =>
                s.Employee.Reports.Any(x => x.CreatedTime.Date == s.CreatedTime.Date) ?
                s.Employee.Reports.OrderByDescending(x => x.Id).FirstOrDefault(x => x.CreatedTime.Date == s.CreatedTime.Date).CreatedTime.ToString("MM/dd/yyyy HH:mm:ss") : "N/A")
                )
                .ForMember(d => d.KindName, o => o.MapFrom(s => s.Employee.SettingId != null ? s.Employee.Setting.Name : "N/A") );
            CreateMap<BlackList, BlackListDto>()
            .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
            .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
            .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName));
            //.ForMember(d => d.FirstWorkDate, o => o.MapFrom(s =>s.Employee.FactoryReports.OrderBy(x=> x.FactoryEntryTime).Select(x=> (DateTime?)x.FactoryEntryTime).FirstOrDefault())
            //)
            //.ForMember(d => d.LastCheckInDateTime, o => o.MapFrom(s => s.Employee.CheckIns.OrderByDescending(x => x.CreatedTime).Select(x => (DateTime?) x.CreatedTime).FirstOrDefault() ))
            //.ForMember(d => d.LastCheckOutDateTime, o => o.MapFrom(s => s.Employee.Reports.OrderByDescending(x => x.CreatedTime).Select(x => (DateTime?) x.CreatedTime).FirstOrDefault() ))
            //.ForMember(d => d.LastAccessControlDateTime, o => o.MapFrom(s => s.Employee.FactoryReports.OrderByDescending(x => x.FactoryEntryTime).Select(x => (DateTime?) x.FactoryEntryTime).FirstOrDefault() ));

            CreateMap<RecordError, RecordErrorDto>()
              .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
              .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName))
              .ForMember(d => d.Gender, o => o.MapFrom(s => s.EmployeeId.HasValue && s.Employee.Gender == true ? "NAM" : s.EmployeeId.HasValue && s.Employee.Gender == false ?"NỮ" : ""))
              .ForMember(d => d.Department, o => o.MapFrom(s => s.EmployeeId.HasValue ? s.Employee.Department.Code : ""))
              .ForMember(d => d.Kind, o => o.MapFrom(s => s.EmployeeId.HasValue ? s.Employee.Setting.Name : ""));
            
        }
    }
}
