namespace MedicalAppointments.Application.DTOs.Responses;

public class DoctorResponse
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string SpecialtyName { get; set; } = string.Empty;
}
