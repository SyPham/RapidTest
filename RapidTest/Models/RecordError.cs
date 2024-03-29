﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RapidTest.Models
{
    [Table("RecordErrors")]
    public class RecordError
    {
        public RecordError(int? employeeId, string station, string errorKind, DateTime createdTime)
        {
            EmployeeId = employeeId;
            Station = station;
            ErrorKind = errorKind;
            CreatedTime = createdTime;
        }

        public RecordError(int? employeeId, string station, string errorKind, DateTime createdTime, int createdBy) : this(employeeId, station, errorKind, createdTime)
        {
            CreatedBy = createdBy;
        }

        public RecordError(int? employeeId, string station, string errorKind, DateTime createdTime, int createdBy, DateTime? lastCheckInDateTime, DateTime? lastCheckOutDateTime, DateTime? entryFactoryExpiryTime) : this(employeeId, station, errorKind, createdTime,createdBy)
        {
            LastCheckInDateTime = lastCheckInDateTime;
            LastCheckOutDateTime = lastCheckOutDateTime;
            EntryFactoryExpiryTime = entryFactoryExpiryTime;
        }

        [Key]
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? LastCheckInDateTime { get; set; } // today check in
        public DateTime? LastCheckOutDateTime { get; set; } // today check out
        public DateTime? EntryFactoryExpiryTime { get; set; } // today check out
        [MaxLength(20)]
        public string Station { get; set; }
        [MaxLength(500)]
        public string ErrorKind { get; set; }
        public DateTime CreatedTime { get; set; }
        public int CreatedBy { get; set; }
        [ForeignKey(nameof(EmployeeId))]
        public virtual Employee Employee { get; set; }
    }
}
