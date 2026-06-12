using MedicalAppointments.Domain.Enums;

namespace MedicalAppointments.Domain.Entities;

public class Appointment : BaseEntity
{
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string Notes { get; set; } = string.Empty;

    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
}
