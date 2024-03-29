﻿using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models
{
    [Table("Settings")]
    public class Setting : IDateTracking
    {
        [Key]
        public int Id { get; set; }
        public int Day { get; set; }
        public string Name { get; set; }
        public double Mins { get; set; }
        public int CreatedBy { get; set; }
        public bool IsDefault { get; set; }
        public int? ModifiedBy { get; set; }
        [StringLength(100)]
        public string SettingType { get; set; }
        [StringLength(100)]
        public string DayOfWeek { get; set; }
        public double Hours { get; set; }
        public string Description { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
        public int? ParentId { get; set; }
    
    }
}
