using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;

namespace MedicalAppointments.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;

    public DoctorService(IDoctorRepository doctorRepository)
    {
        _doctorRepository = doctorRepository;
    }

    public async Task<IEnumerable<DoctorResponse>> GetAllAsync()
    {
        var doctors = await _doctorRepository.GetAllAsync();
        return doctors.Select(ToResponse);
    }

    public async Task<DoctorResponse?> GetByIdAsync(int id)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);
        return doctor is null ? null : ToResponse(doctor);
    }

    public async Task<IEnumerable<DoctorResponse>> GetBySpecialtyAsync(int specialtyId)
    {
        var doctors = await _doctorRepository.GetBySpecialtyAsync(specialtyId);
        return doctors.Select(ToResponse);
    }

    public async Task<DoctorResponse> CreateAsync(CreateDoctorRequest request)
    {
        var doctor = new Doctor
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            LicenseNumber = request.LicenseNumber,
            SpecialtyId = request.SpecialtyId
        };

        var created = await _doctorRepository.AddAsync(doctor);
        return ToResponse(created);
    }

    public async Task DeleteAsync(int id) => await _doctorRepository.DeleteAsync(id);

    private static DoctorResponse ToResponse(Doctor d) => new()
    {
        Id = d.Id,
        FirstName = d.FirstName,
        LastName = d.LastName,
        Email = d.Email,
        LicenseNumber = d.LicenseNumber,
        SpecialtyName = d.Specialty?.Name ?? string.Empty
    };
}
