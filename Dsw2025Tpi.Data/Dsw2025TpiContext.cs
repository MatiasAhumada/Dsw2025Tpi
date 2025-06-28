using Microsoft.EntityFrameworkCore;
using Dsw2025Tpi.Domain.Entities;

namespace Dsw2025Tpi.Data;

public class Dsw2025TpiContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public Dsw2025TpiContext(DbContextOptions<Dsw2025TpiContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure your entities here
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.InternalCode);
            entity.Property(e => e.Sku).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CurrentUnitPrice).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.StockQuantity).IsRequired();
            entity.Property(e => e.IsActive).IsRequired();
        });
        modelBuilder.Entity<Product>()      //
            .HasIndex(p => p.Sku)           //Estas lineas son para garantizar que el SKU sea unico
            .IsUnique();                    //

        base.OnModelCreating(modelBuilder);
    }

  
}
