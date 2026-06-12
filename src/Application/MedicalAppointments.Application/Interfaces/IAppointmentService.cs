using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;

namespace MedicalAppointments.Application.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentResponse>> GetAllAsync();
    Task<AppointmentResponse?> GetByIdAsync(int id);
    Task<IEnumerable<AppointmentResponse>> GetByPatientIdAsync(int patientId);
    Task<IEnumerable<AppointmentResponse>> GetByDoctorIdAsync(int doctorId);
    Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request);
    Task<AppointmentResponse> UpdateStatusAsync(int id, UpdateAppointmentStatusRequest request);
    Task DeleteAsync(int id);
}
