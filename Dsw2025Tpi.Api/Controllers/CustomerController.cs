using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Dsw2025Tpi.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;
    private readonly IConfiguration _configuration;

    public CustomersController(CustomerService customerService, IConfiguration configuration)
    {
        _customerService = customerService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginCustomer([FromBody] CustomerAuthRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var customer = await _customerService.AuthenticateCustomerAsync(request.Name, request.Dni);
            if (customer == null)
                return Unauthorized(new { error = "Usuario o contraseña incorrectos" });

            var token = GenerateJwtToken(customer.GuidCode.ToString(), "Customer");
            return Ok(new { token, customer = new CustomerResponse(
                GuidCode: customer.GuidCode,
                Email: customer.Email,
                Name: customer.Name,
                PhoneNumber: customer.PhoneNumber,
                Dni: customer.Dni
            ) });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
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

    private string GenerateJwtToken(string userId, string role)
    {
        var jwtSettings = _configuration.GetSection("jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
