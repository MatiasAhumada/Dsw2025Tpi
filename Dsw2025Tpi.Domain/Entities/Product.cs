using System.Security.Cryptography.X509Certificates;
namespace Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Entities;

public class Product : EntityBase
{

    public Product()
    {

    }
    public Product(string sku, string name, string desc, decimal price, int stock)
    : base()
    {
        if (string.IsNullOrWhiteSpace(sku)) throw new ArgumentException("SKU es requerido");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Nombre es requerido");
        if (price <= 0) throw new ArgumentException("Precio inválido");
        if (stock < 0) throw new ArgumentException("Stock no puede ser negativo");
        Sku = sku;
        Name = name;
        Description = desc;
        CurrentUnitPrice = price;
        StockQuantity = stock;
        IsActive = true;
    }
    public required string Sku { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; }
    public required decimal CurrentUnitPrice { get; set; }
    public required int StockQuantity { get; set; }
    public bool IsActive { get; set; }

}