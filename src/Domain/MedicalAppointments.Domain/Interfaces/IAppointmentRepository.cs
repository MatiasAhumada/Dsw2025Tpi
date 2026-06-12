using MedicalAppointments.Domain.Entities;

namespace MedicalAppointments.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId);
    Task<IEnumerable<Appointment>> GetByDoctorIdAsync(int doctorId);
}
