using System.Security.Cryptography.X509Certificates;
namespace Dsw2025Tpi.Domain.Entities;

using Dsw2025Tpi.Domain.Entities;

public class Product : EntityBase
{
    public string Sku { get; set; }
    public string InternalCode { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal CurrentUnitPrice { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }

    public Product()
    {

    }
    public Product(string sku, string internalCode, string name, string desc, decimal price, int stock)
    : base()
    {
        if (string.IsNullOrWhiteSpace(sku)) throw new ArgumentException("SKU es requerido");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Nombre es requerido");
        if (price <= 0) throw new ArgumentException("Precio inválido");
        if (stock < 0) throw new ArgumentException("Stock no puede ser negativo");
        GuidCode = Guid.NewGuid();
        Sku = sku;
        InternalCode = internalCode;
        Name = name;
        Description = desc;
        CurrentUnitPrice = price;
        StockQuantity = stock;
        IsActive = true;
    }

}