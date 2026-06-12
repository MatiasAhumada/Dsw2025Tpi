using MedicalAppointments.Domain.Enums;

namespace MedicalAppointments.Application.DTOs.Responses;

public class AppointmentResponse
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorFullName { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public AppointmentStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
}
