using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RapidTest.Models;
using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RapidTest.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountGroupAccount> AccountGroupAccount { get; set; }
        public DbSet<AccountGroup> AccountGroups { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<FactoryReport> FactoryReports { get; set; }
        public DbSet<Setting> Setting { get; set; }
        public DbSet<Factory> Factory { get; set; }
        public DbSet<CheckIn> CheckIn { get; set; }
        public DbSet<TestKind> TestKinds { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<BlackList> BlackList { get; set; }
        public DbSet<RecordError> RecordError { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Xóa user1 trong bảng account thì những accountId của user1 trong bảng Performance không bị xóa theo
            //modelBuilder.Entity<Performance>()
            //    .HasOne(s => s.Account)
            //    .WithMany(ta => ta.Performances)
            //    .HasForeignKey(u => u.UploadBy)
            //    .OnDelete(DeleteBehavior.NoAction);


        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            IEnumerable<EntityEntry> modified = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Modified || e.State == EntityState.Added);
            foreach (EntityEntry item in modified)
            {
                if (item.Entity is IDateTracking changedOrAddedItem)
                {
                    if (item.State == EntityState.Added)
                    {
                        var check = item.Metadata.DisplayName() == nameof(BlackList);
                        if (check == false)
                            changedOrAddedItem.CreatedTime = DateTime.Now;
                    }
                    else
                    {
                        var check = item.Metadata.DisplayName() == nameof(BlackList);
                        if (check == false)
                            changedOrAddedItem.ModifiedTime = DateTime.Now;
                    }
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //=> optionsBuilder.LogTo(Console.WriteLine);
    }
}
