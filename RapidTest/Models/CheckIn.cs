using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models
{
    [Table("CheckIn")]
    public class CheckIn: IDateTracking
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Leo
        public int TestKindId { get; set; } // RapidTest
        public bool IsDelete { get; set; }

        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get; set; } // Rapid-Test date
        public DateTime? ModifiedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public virtual Employee Employee { get; set; }

        [ForeignKey(nameof(TestKindId))]
        public virtual TestKind TestKind { get; set; }
    }
}
