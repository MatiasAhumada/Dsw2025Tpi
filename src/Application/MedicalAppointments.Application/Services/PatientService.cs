using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;

namespace MedicalAppointments.Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;

    public PatientService(IPatientRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    public async Task<IEnumerable<PatientResponse>> GetAllAsync()
    {
        var patients = await _patientRepository.GetAllAsync();
        return patients.Select(ToResponse);
    }

    public async Task<PatientResponse?> GetByIdAsync(int id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        return patient is null ? null : ToResponse(patient);
    }

    public async Task<PatientResponse> CreateAsync(CreatePatientRequest request)
    {
        var patient = new Patient
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            DateOfBirth = request.DateOfBirth
        };

        var created = await _patientRepository.AddAsync(patient);
        return ToResponse(created);
    }

    public async Task DeleteAsync(int id) => await _patientRepository.DeleteAsync(id);

    private static PatientResponse ToResponse(Patient p) => new()
    {
        Id = p.Id,
        FirstName = p.FirstName,
        LastName = p.LastName,
        Email = p.Email,
        Phone = p.Phone,
        DateOfBirth = p.DateOfBirth
    };
}
