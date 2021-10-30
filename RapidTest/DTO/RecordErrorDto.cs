using System;
namespace RapidTest.DTO
{
    public class RecordErrorDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Code { get; set; }
        public string FullName { get; set; }
        public string Department { get; set; }
        public string Gender { get; set; }
        public string Kind { get; set; }
        public string Station { get; set; }
        public DateTime? LastCheckInDateTime { get; set; }
        public DateTime? LastCheckOutDateTime { get; set; }
        public string ErrorKind { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
