namespace Dsw2025Tpi.Application.Dtos
{
    public record AdminAuthDto
    {
        public record RegisterRequest(string Nombre, string Dni);

        public record RegisterResponse(string Nombre, string Dni);

        public record LoginRequest(string Nombre, string Dni);

        public record LoginResponse(string Token, string DniHash);
    }
}
