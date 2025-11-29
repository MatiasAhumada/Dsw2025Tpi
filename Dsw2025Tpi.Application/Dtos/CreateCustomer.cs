namespace Dsw2025Tpi.Application.Dtos
{
    public record CreateCustomerRequest(
        string Email,
        string Name,
        string PhoneNumber
    );

    public record CustomerResponse(
        Guid GuidCode,
        string Email,
        string Name,
        string PhoneNumber
    );
}
