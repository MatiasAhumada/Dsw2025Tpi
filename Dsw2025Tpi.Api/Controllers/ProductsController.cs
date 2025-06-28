using Dsw2025Tpi.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ProductsManagementService _service;

    public ProductsController(ProductsManagementService service)
    {
        _service = service;
    }



    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _service.GetProducts();
        if (products == null || !products.Any())
        {
            return NoContent();
        }
        return Ok(products);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var producto = await _service.GetProductById(id);

        if (producto == null)
        {
            return NotFound("No se encontró el producto.");
        }

        return Ok(producto);

    }


    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> DisableProduct(Guid id)
    {
        var producto = await _service.GetProductById(id);
        if (producto == null)
        {
            return NotFound("No se encontró el producto.");
        }

        producto.IsActive = false;
        await _service.Update(producto);
        return NoContent();
    }
}