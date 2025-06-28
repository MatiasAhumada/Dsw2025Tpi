using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
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


    [HttpPost]
    public async Task<IActionResult> PostProducts([FromBody] ModeloProducto.Request request)
    {
        try
        {
            var product = await _service.AddProduct(request);
            return Ok(product);
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
