using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models
{
    [Table("Employees")]
    public class Employee : IDateTracking
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }

        public string Code { get; set; }
        public int FactoryId { get; set; }
        public bool SEAInform { get; set; }
        public bool? Gender { get; set; }
        public bool IsPrint { get; set; }

        public DateTime BirthDate { get; set; }

        public DateTime? LatestPrintTime { get; set; }
        public int? PrintBy { get; set; }

        public int DepartmentId { get; set; }
        public int? SettingId { get; set; }
        public int CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get ; set ; }
        public DateTime? ModifiedTime { get ; set ; }
        [ForeignKey(nameof(FactoryId))]
        public virtual Factory Factory { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public virtual Department Department { get; set; }
        [ForeignKey(nameof(SettingId))]
        public virtual Setting Setting { get; set; }
        public virtual ICollection<FactoryReport> FactoryReports { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
        public virtual ICollection<CheckIn> CheckIns { get; set; }

    }
}
