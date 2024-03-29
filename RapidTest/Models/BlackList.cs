﻿using RapidTest.Models;
using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace RapidTest.Models
{ 
    [Table("BlackList")]
    public class BlackList: IDateTracking
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; } 
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public int? DeletedBy { get; set; }
        public bool IsDelete { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime SystemDateTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        public DateTime? FirstWorkDate { get; set; }
        public DateTime? LastCheckInDateTime { get; set; }
        public DateTime? LastCheckOutDateTime { get; set; }
        public DateTime? LastAccessControlDateTime { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public virtual Employee Employee { get; set; }
    }
}
