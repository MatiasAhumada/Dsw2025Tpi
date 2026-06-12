using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;

namespace MedicalAppointments.Application.Interfaces;

public interface IDoctorService
{
    Task<IEnumerable<DoctorResponse>> GetAllAsync();
    Task<DoctorResponse?> GetByIdAsync(int id);
    Task<IEnumerable<DoctorResponse>> GetBySpecialtyAsync(int specialtyId);
    Task<DoctorResponse> CreateAsync(CreateDoctorRequest request);
    Task DeleteAsync(int id);
}
