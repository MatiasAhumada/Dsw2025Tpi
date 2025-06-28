using Microsoft.EntityFrameworkCore;
using Dsw2025Tpi.Domain.Entities;

namespace Dsw2025Tpi.Data;
public class Dsw2025TpiContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    public Dsw2025TpiContext(DbContextOptions<Dsw2025TpiContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuración de Product
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

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Sku)
            .IsUnique();

        
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.InternalCode);
            entity.Property(e => e._customerId).IsRequired();
            entity.Property(e => e._shippingAddress).IsRequired();
            entity.Property(e => e._billingAddress).IsRequired();
            entity.Property(e => e._date).IsRequired();
            entity.Property(e => e._notes);
            entity.Property(e => e._status).IsRequired();
            entity.Property(e => e._totalAmount).HasColumnType("decimal(18,2)");
        });

        
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.InternalCode);
            entity.Property(e => e._orderId).IsRequired();
            entity.Property(e => e._productId).IsRequired();
            entity.Property(e => e._quantity).IsRequired();
            entity.Property(e => e._unitPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e._subtotal).HasColumnType("decimal(18,2)");

            
            entity.HasOne<Order>()
                .WithMany(o => o._orderItems)
                .HasForeignKey(e => e._orderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        base.OnModelCreating(modelBuilder);
    }
}

  
