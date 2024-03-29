﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO
{
    public class SettingDto
    {
        public int Id { get; set; }
        public int Day { get; set; }
        public string Name { get; set; }
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public bool IsDefault { get; set; }
        public string SettingType { get; set; }
        public string DayOfWeek { get; set; }
        public double Hours { get; set; }


        public string Description { get; set; }
        public double Mins { get; set; }
        public DateTime CreatedTime { get; set; }
        public string DateTime { get; set; }
        public int? ParentId { get; set; }
        public DateTime? ModifiedTime { get; set; }
        public string ExpiryTime { get; set; }

    }
    public class UpdateDescriptionRequestDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
   
    }
    public class CurrentWeekDto
    {
        public string DayOfWeek { get; set; }
        public DateTime DateTime { get; set; }

    }
}
