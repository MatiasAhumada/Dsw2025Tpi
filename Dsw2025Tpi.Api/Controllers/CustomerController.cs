using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomersController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> RegisterCustomer([FromBody] CreateCustomerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var customer = await _customerService.CreateCustomerAsync(request);

            var response = new CustomerResponse(
                GuidCode: customer.GuidCode,
                Email: customer.Email,
                Name: customer.Name,
                PhoneNumber: customer.PhoneNumber,
                Dni: customer.Dni
            );

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
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
                GuidCode: customer.GuidCode,
                Email: customer.Email,
                Name: customer.Name,
                PhoneNumber: customer.PhoneNumber,
                Dni: customer.Dni
            );

            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.GuidCode }, response);
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
            GuidCode: c.GuidCode,
            Email: c.Email,
            Name: c.Name,
            PhoneNumber: c.PhoneNumber,
            Dni: c.Dni
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
            GuidCode: customer.GuidCode,
            Email: customer.Email,
            Name: customer.Name,
            PhoneNumber: customer.PhoneNumber,
            Dni: customer.Dni
        );

        return Ok(response);
    }
}
