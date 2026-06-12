namespace MedicalAppointments.Application.DTOs.Requests;

public class CreateAppointmentRequest
{
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Notes { get; set; } = string.Empty;
}
