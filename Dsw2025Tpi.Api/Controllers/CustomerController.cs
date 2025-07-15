using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using System.Linq;


namespace Dsw2025Tpi.Api.Controllers;
[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomersController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var customer = await _customerService.CreateCustomerAsync(request);

            var response = new CustomerResponse(
                InternalCode: customer.InternalCode,
                Email: customer.Email,
                Name: customer.Name,
                PhoneNumber: customer.PhoneNumber
            );

            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.InternalCode }, response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        var customers = await _customerService.GetAllCustomersAsync();

        var response = customers.Select(c => new CustomerResponse(
            InternalCode: c.InternalCode,
            Email: c.Email,
            Name: c.Name,
            PhoneNumber: c.PhoneNumber
        ));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomerById(Guid id)
    {
        var customer = await _customerService.GetCustomerByIdAsync(id);

        if (customer == null)
            return NotFound(new { error = "Cliente no encontrado" });

        var response = new CustomerResponse(
            InternalCode: customer.InternalCode,
            Email: customer.Email,
            Name: customer.Name,
            PhoneNumber: customer.PhoneNumber
        );

        return Ok(response);
    }
}
