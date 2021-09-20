using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models
{
    [Table("AccountTypes")]
    public class AccountType
    {
        public AccountType(string name, string code)
        {
            Name = name;
            Code = code;
        }

        public AccountType(int id, string name, string code)
        {
            Name = name;
            Code = code;
            Id = id;
        }

        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(100)]
        public string Code { get; set; }
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
