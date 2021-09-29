using AutoMapper;
using RapidTest.Constants;
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
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.FactoryName, o => o.MapFrom(s => s.Factory.Name));
            CreateMap<Report, ReportDto>()
                .ForMember(d => d.Result, o => o.MapFrom(s => s.Result == 2 ? "Âm tính" : "Dương tính"))
                .ForMember(d => d.TestKindId, o => o.MapFrom(s => s.TestKind.Name))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                 .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM" : "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.ExpiryTime, o => o.MapFrom(s => s.ExpiryTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy HH:mm tt")))
                .ForMember(d => d.CheckInTime, o => o.MapFrom(s =>
                s.Employee.CheckIns.Any(x => x.CreatedTime.Date == s.CreatedTime.Date) ?
                s.Employee.CheckIns.OrderByDescending(x=> x.Id).FirstOrDefault(x=> x.CreatedTime.Date == s.CreatedTime.Date).CreatedTime.ToString("MM/dd/yyyy HH:mm tt") : "")
                )
                  .ForMember(d => d.LastestCheckInDate, o => o.MapFrom(s =>
                s.Employee.CheckIns.Any(x => x.CreatedTime.Date == s.CreatedTime.Date) ?
                s.Employee.CheckIns.OrderByDescending(x => x.Id).FirstOrDefault(x => x.CreatedTime.Date == s.CreatedTime.Date).CreatedTime : DateTime.MinValue)
                )
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName));
            CreateMap<FactoryReport, FactoryReportDto>()
                .ForMember(d => d.Result, o => o.MapFrom(s => s.Result == 2 ? "Âm tính" : "Dương tính"))
                .ForMember(d => d.TestKindId, o => o.MapFrom(s => s.TestKind.Name))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM": "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                .ForMember(d => d.ExpiryTime, o => o.MapFrom(s => s.ExpiryTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.RapidTestTime, o => o.MapFrom(s => s.RapidTestTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.FactoryEntryTime, o => o.MapFrom(s => s.FactoryEntryTime.ToString("MM/dd/yyyy HH:mm tt")))
                .ForMember(d => d.LastestCheckInDate, o => o.MapFrom(s =>
                s.Employee.CheckIns.Any() ?
                s.Employee.CheckIns.OrderByDescending(x => x.Id).FirstOrDefault().CreatedTime : DateTime.MinValue)
                )
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName));
            CreateMap<Models.TestKind, TestKindDto>();
            CreateMap<Models.CheckIn, CheckInDto>()
                .ForMember(d => d.Code, o => o.MapFrom(s => s.Employee.Code))
                 .ForMember(d => d.Gender, o => o.MapFrom(s => s.Employee.Gender == true ? "NAM" : "NỮ"))
                .ForMember(d => d.Department, o => o.MapFrom(s => s.Employee.Department.Code))
                .ForMember(d => d.BirthDate, o => o.MapFrom(s => s.Employee.BirthDate.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CreatedTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy")))
                .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy HH:mm tt")))
                .ForMember(d => d.CheckInTime, o => o.MapFrom(s => s.CreatedTime.ToString("MM/dd/yyyy HH:mm tt")))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.Employee.FullName))
              .ForMember(d => d.CheckOutTime, o => o.MapFrom(s =>
                s.Employee.Reports.Any(x => x.CreatedTime.Date == s.CreatedTime.Date) ?
                s.Employee.Reports.OrderByDescending(x => x.Id).FirstOrDefault(x => x.CreatedTime.Date == s.CreatedTime.Date).CreatedTime.ToString("MM/dd/yyyy HH:mm tt") : "N/A")
                );

        }
    }
}
