using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Data;
using BCrypt.Net;
using Dsw2025Tpi.Domain;

namespace Dsw2025Tpi.Data.Services
{
    public class AuthService
    {
        private readonly IRepository _repository;
        private readonly IConfiguration _configuration;

        public AuthService(IRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<AdminAuthDto.RegisterResponse> RegisterAsync(AdminAuthDto.RegisterRequest dto)
        {
            var adminsConNombre = await _repository.GetFiltered<Admin>(a => a.Nombre == dto.Nombre);
            if (adminsConNombre != null && adminsConNombre.Any())
                throw new Exception("El nombre ya existe");

            var DniHash = BCrypt.Net.BCrypt.HashPassword(dto.Dni);

            var admin = new Admin(dto.Nombre, DniHash, dto.Email);

            var adminGuardado = await _repository.Add(admin);

            return new AdminAuthDto.RegisterResponse(adminGuardado.Nombre, adminGuardado.DniHash);
        }

        public async Task<AdminAuthDto.LoginResponse> LoginAsync(AdminAuthDto.LoginRequest dto)
        {
            var admin = await _repository.First<Admin>(a => a.Nombre == dto.Nombre);
            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Dni, admin.DniHash))
                throw new Exception("Credenciales inválidas");

            var token = GenerateJwtToken(admin);

            return new AdminAuthDto.LoginResponse(token);
        }



        private string GenerateJwtToken(Admin admin)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["jwt:Key"]);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, admin.GuidCode.ToString()),
                    new Claim(ClaimTypes.Name, admin.Nombre)
                }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["jwt:ExpiryMinutes"])),
                Issuer = _configuration["jwt:Issuer"],
                Audience = _configuration["jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<AdminAuthDto.LoginResponse> LoginCustomerAsync(string email, string dni)
        {
            var customer = await _repository.First<Customer>(c => c.Email == email);
            if (customer == null || customer.Dni != dni)
                throw new Exception("Credenciales inválidas");

            var token = GenerateJwtTokenForCustomer(customer);

            return new AdminAuthDto.LoginResponse(token);
        }

        private string GenerateJwtTokenForCustomer(Customer customer)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["jwt:Key"]);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.GuidCode.ToString()),
                    new Claim(ClaimTypes.Name, customer.Name),
                    new Claim(ClaimTypes.Email, customer.Email),
                    new Claim("UserType", "Customer")
                }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["jwt:ExpiryMinutes"])),
                Issuer = _configuration["jwt:Issuer"],
                Audience = _configuration["jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}