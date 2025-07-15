namespace Dsw2025Tpi.Application.Dtos
{
    public record CreateCustomerRequest(
        string Email,
        string Name,
        string PhoneNumber
    );

    public record CustomerResponse(
        Guid InternalCode,
        string Email,
        string Name,
        string PhoneNumber
    );
}
