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
        if (string.IsNullOrWhiteSpace(request.Sku)||
            string.IsNullOrWhiteSpace(request.Name)||
            request.CurrentUnitPrice < 0)
        {
            throw new ArgumentException("Valores para el producto no válidos");
        }

        var exist = await _repository.First<Product>(p => p.Sku == request.Sku);
        if (exist != null) throw new DuplicatedEntityException($"Ya existe un producto con el Sku {request.Sku}");

        var product = new Product(request.Sku, request.Name, request.Description, request.CurrentUnitPrice, request.StockQuantity);
        await _repository.Add(product);
        return new ModeloProducto.Response(product.InternalCode, product.Sku, product.Name, product.Description, product.CurrentUnitPrice, product.StockQuantity);
    }

}