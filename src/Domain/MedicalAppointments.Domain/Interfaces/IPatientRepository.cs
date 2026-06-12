using MedicalAppointments.Domain.Entities;

namespace MedicalAppointments.Domain.Interfaces;

public interface IPatientRepository : IRepository<Patient>
{
    Task<Patient?> GetByEmailAsync(string email);
}
