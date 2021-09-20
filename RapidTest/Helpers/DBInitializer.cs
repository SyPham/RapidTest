using Microsoft.EntityFrameworkCore;
using RapidTest.Data;
using RapidTest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Helpers
{
    public static class DBInitializer
    {
        public static void Seed(DataContext _context)
        {
        
            #region Loại Tài Khoản
            if (!(_context.AccountTypes.Any()))
            {
                _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.AccountTypes ON");
                _context.AccountTypes.AddRange(new List<AccountType> {
                    new AccountType(1, "System Management", "SYSTEM"),
                    new AccountType(2, "Members", "MEMBER"),
                });
                _context.SaveChanges();
                _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.AccountTypes OFF");
            }

            #endregion

            #region Tài Khoản
            if (!(_context.Accounts.Any()))
            {
                var supper = _context.AccountTypes.FirstOrDefault(x => x.Code.Equals("SYSTEM"));
                var user = _context.AccountTypes.FirstOrDefault(x => x.Code.Equals("MEMBER"));
                var account1 = new Account { Username = "admin", Password = "1", AccountTypeId = supper.Id };
                var account2 = new Account { Username = "user", Password = "1", AccountTypeId = user.Id };
                _context.Accounts.AddRange(new List<Account> {account1,
                   account2
                });
                _context.SaveChanges();
            }

            #endregion

            #region Setting

            if (!(_context.Setting.Any()))
            {
                _context.Setting.Add(new Setting
                {
                    Day = 3,
                    CreatedBy = 1,
                    CreatedTime = DateTime.Now
                });
                _context.SaveChanges();
            }
            #endregion


            #region Nhóm Tài Khoản
            //if (!(_context.AccountGroups.Any()))
            //{
            //    _context.AccountGroups.AddRange(new List<AccountGroup> {
            //        new AccountGroup { Name = "L0", Position = 1 },
            //        new AccountGroup { Name = "L1", Position = 2 },
            //        new AccountGroup { Name = "L2", Position = 3 },
            //        new AccountGroup { Name = "FHO", Position = 4 },
            //        new AccountGroup { Name = "GHM", Position = 5 },
            //        new AccountGroup { Name = "GM", Position = 6 }
            //});
            //    _context.SaveChanges();
            //}

            #endregion


        }
    }
}
