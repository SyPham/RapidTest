using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models
{
    [Table("AccountGroupAccount")]
    public class AccountGroupAccount
    {
        public AccountGroupAccount(int accountGroupId, int accountId)
        {
            AccountGroupId = accountGroupId;
            AccountId = accountId;
        }

        [Key]
        public int Id { get; set; }
        public int AccountGroupId { get; set; }
        public int AccountId { get; set; }
        [ForeignKey(nameof(AccountId))]
        public virtual Account Account { get; set; }
        [ForeignKey(nameof(AccountGroupId))]
        public virtual AccountGroup AccountGroup { get; set; }
    }
}
