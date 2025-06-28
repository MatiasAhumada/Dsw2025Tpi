using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
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

    public async Task<ModeloProducto.Response> AddProduct(ModeloProducto.Request request)
    {
        if (string.IsNullOrWhiteSpace(request.Sku) ||
            string.IsNullOrWhiteSpace(request.Name) ||
            request.CurrentUnitPrice < 0)
        {
            throw new ArgumentException("Valores para el producto no v�lidos");
        }

        var exist = await _repository.First<Product>(p => p.Sku == request.Sku);
        if (exist != null) throw new DuplicatedEntityException($"Ya existe un producto con el Sku {request.Sku}");

        var product = new Product(request.Sku, request.Name, request.Description, request.CurrentUnitPrice, request.StockQuantity);
        await _repository.Add(product);
        return new ModeloProducto.Response(product.InternalCode, product.Sku, product.Name, product.Description, product.CurrentUnitPrice, product.StockQuantity);
    }

    public async Task<Product?> GetProductById(Guid id)
    {
        if (id == Guid.Empty) throw new ArgumentException("El ID del producto no puede ser vacío", nameof(id));
        return await _repository.GetById<Product>(id);
    }
    public async Task<Product?> GetProductBySku(string sku)
    {
        if (string.IsNullOrWhiteSpace(sku)) throw new ArgumentException("El SKU del producto no puede ser nulo o vacío", nameof(sku));
        return await _repository.GetBySku<Product>(sku);
    }

    public async Task<Product> Update(Product product)
    {
        if (product == null) throw new ArgumentNullException(nameof(product), "El producto no puede ser nulo");
        return await _repository.Update(product);

    }

}
