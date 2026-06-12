using MedicalAppointments.Domain.Entities;

namespace MedicalAppointments.Domain.Interfaces;

public interface IDoctorRepository : IRepository<Doctor>
{
    Task<IEnumerable<Doctor>> GetBySpecialtyAsync(int specialtyId);
}
