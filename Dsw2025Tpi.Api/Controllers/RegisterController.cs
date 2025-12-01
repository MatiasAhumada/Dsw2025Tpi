using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Dsw2025Tpi.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/register")]
public class RegisterController : ControllerBase
{
    private readonly CustomerService _customerService;

    public RegisterController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost("customer")]
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
}