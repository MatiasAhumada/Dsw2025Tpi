using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;

namespace MedicalAppointments.Application.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientResponse>> GetAllAsync();
    Task<PatientResponse?> GetByIdAsync(int id);
    Task<PatientResponse> CreateAsync(CreatePatientRequest request);
    Task DeleteAsync(int id);
}
