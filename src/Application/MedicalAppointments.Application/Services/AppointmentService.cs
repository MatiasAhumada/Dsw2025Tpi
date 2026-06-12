using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;

namespace MedicalAppointments.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;

    public AppointmentService(IAppointmentRepository appointmentRepository)
    {
        _appointmentRepository = appointmentRepository;
    }

    public async Task<IEnumerable<AppointmentResponse>> GetAllAsync()
    {
        var appointments = await _appointmentRepository.GetAllAsync();
        return appointments.Select(ToResponse);
    }

    public async Task<AppointmentResponse?> GetByIdAsync(int id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        return appointment is null ? null : ToResponse(appointment);
    }

    public async Task<IEnumerable<AppointmentResponse>> GetByPatientIdAsync(int patientId)
    {
        var appointments = await _appointmentRepository.GetByPatientIdAsync(patientId);
        return appointments.Select(ToResponse);
    }

    public async Task<IEnumerable<AppointmentResponse>> GetByDoctorIdAsync(int doctorId)
    {
        var appointments = await _appointmentRepository.GetByDoctorIdAsync(doctorId);
        return appointments.Select(ToResponse);
    }

    public async Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request)
    {
        var appointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            ScheduledAt = request.ScheduledAt,
            Notes = request.Notes
        };

        var created = await _appointmentRepository.AddAsync(appointment);
        return ToResponse(created);
    }

    public async Task<AppointmentResponse> UpdateStatusAsync(int id, UpdateAppointmentStatusRequest request)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Appointment {id} not found.");

        appointment.Status = request.Status;
        appointment.UpdatedAt = DateTime.UtcNow;

        var updated = await _appointmentRepository.UpdateAsync(appointment);
        return ToResponse(updated);
    }

    public async Task DeleteAsync(int id) => await _appointmentRepository.DeleteAsync(id);

    private static AppointmentResponse ToResponse(Appointment a) => new()
    {
        Id = a.Id,
        PatientId = a.PatientId,
        PatientFullName = a.Patient is not null ? $"{a.Patient.FirstName} {a.Patient.LastName}" : string.Empty,
        DoctorId = a.DoctorId,
        DoctorFullName = a.Doctor is not null ? $"{a.Doctor.FirstName} {a.Doctor.LastName}" : string.Empty,
        ScheduledAt = a.ScheduledAt,
        Status = a.Status,
        Notes = a.Notes
    };
}
