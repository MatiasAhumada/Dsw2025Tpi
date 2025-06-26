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


}