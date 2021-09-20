using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace RapidTest.Models
{
    [Table("Reports")]
    public class Report : IDateTracking
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Leo
        public int TestKindId { get; set; } // RapidTest
        public int Result { get; set; } // Negative

        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime ExpiryTime { get; set; } // Enter factory exp. date
        public DateTime CreatedTime { get; set; } // Rapid-Test date
        public DateTime? ModifiedTime { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public virtual Employee Employee { get; set; }
    }
}
