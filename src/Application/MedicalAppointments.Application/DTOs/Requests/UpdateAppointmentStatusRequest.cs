using MedicalAppointments.Domain.Enums;

namespace MedicalAppointments.Application.DTOs.Requests;

public class UpdateAppointmentStatusRequest
{
    public AppointmentStatus Status { get; set; }
}
