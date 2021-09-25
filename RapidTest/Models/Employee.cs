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
        public DateTime BirthDate { get; set; }

        public int DepartmentId { get; set; }
        public int CreatedBy { get; set; }


        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get ; set ; }
        public DateTime? ModifiedTime { get ; set ; }
        [ForeignKey(nameof(FactoryId))]
        public virtual Factory Factory { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public virtual Department Department { get; set; }
        public virtual ICollection<FactoryReport> FactoryReports { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
        public virtual ICollection<CheckIn> CheckIns { get; set; }

    }
}
