using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers;

[Authorize]
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
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _service.GetProducts();
        var activeProducts = products?.Where(p => p.IsActive).ToList() ?? new List<Product>();
        return Ok(activeProducts);
    }

    [HttpGet]
    [Route("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _service.GetProducts();
        return Ok(products ?? new List<Product>());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PostProducts([FromBody] ModeloProducto.Request request)
    {
        try
        {
            var product = await _service.AddProduct(request);
            return CreatedAtAction(nameof(GetProductById), new { id = product.GuidCode }, product);
        }
        catch (ArgumentException ae)
        {
            return BadRequest(ae.Message);
        }
        catch (DuplicatedEntityException de)
        {
            return Conflict(de.Message);
        }
        catch (Exception)
        {
            return Problem("Se produjo un error al guardar el producto");
        }
    }

    [HttpGet]
    [Route("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var producto = await _service.GetProductById(id);

        if (producto == null)
        {
            return NotFound("No se encontró el producto.");
        }

        return Ok(producto);
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ModeloProductoAct.RequestMod request)
    {
        var products = await _service.GetProductById(id);
        var existingProduct = await _service.GetProductBySku(request.Sku);
        if (products == null)
        {
            return NotFound("No se encontró el producto.");
        }
        if (request.CurrentUnitPrice < 0)
        {
            return BadRequest("El precio ingresado no es valido");
        }
        if (existingProduct != null && existingProduct.GuidCode != id)
        {
            return Conflict("Ya existe un producto con el mismo SKU.");
        }

        products.Sku = request.Sku;
        products.Name = request.Name;
        products.Description = request.Description;
        products.CurrentUnitPrice = request.CurrentUnitPrice;
        products.StockQuantity = request.StockQuantity;

        await _service.Update(products);
        return NoContent();
    }

    [HttpPatch]
    [Route("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleProductStatus(Guid id)
    {
        var producto = await _service.GetProductById(id);
        if (producto == null)
        {
            return NotFound("No se encontró el producto.");
        }

        producto.IsActive = !producto.IsActive;
        await _service.Update(producto);
        return NoContent();
    }
}