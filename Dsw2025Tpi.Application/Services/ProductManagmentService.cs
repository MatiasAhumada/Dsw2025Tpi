using Dsw2025Tpi.Domain;
using Dsw2025Tpi.Domain.Entities;

namespace Dsw2025Tpi.Application.Services;

public class ProductsManagementService
{
    private readonly IRepository _repository;

    public ProductsManagementService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Product>?> GetProducts()
    {
        var result = await _repository.GetAll<Product>();
        if (result == null) return null;
        return result.ToList();
    }
    public async Task<Product?> GetProductById(Guid id)
    {
        if (id == Guid.Empty) throw new ArgumentException("El ID del producto no puede ser vacío", nameof(id));
        return await _repository.GetById<Product>(id);
    }

    public async Task<Product> GetProductBySku(string sku)
    {
        if (string.IsNullOrWhiteSpace(sku)) throw new ArgumentException("El SKU del producto no puede ser nulo o vacío", nameof(sku));
        return await _repository.First<Product>(p => p.Sku == sku);
    }

    public async Task<Product> Update(Product product)
    {
        if (product == null) throw new ArgumentNullException(nameof(product), "El producto no puede ser nulo");
        return await _repository.Update(product);
    }

}