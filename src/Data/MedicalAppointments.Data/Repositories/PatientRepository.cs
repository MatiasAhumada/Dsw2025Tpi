using MedicalAppointments.Data.Context;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointments.Data.Repositories;

public class PatientRepository : BaseRepository<Patient>, IPatientRepository
{
    public PatientRepository(AppDbContext context) : base(context) { }

    public async Task<Patient?> GetByEmailAsync(string email) =>
        await _dbSet.FirstOrDefaultAsync(p => p.Email == email);
}
