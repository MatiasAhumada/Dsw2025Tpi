using MedicalAppointments.Data.Context;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointments.Data.Repositories;

public class DoctorRepository : BaseRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<Doctor>> GetAllAsync() =>
        await _dbSet.Include(d => d.Specialty).ToListAsync();

    public override async Task<Doctor?> GetByIdAsync(int id) =>
        await _dbSet.Include(d => d.Specialty).FirstOrDefaultAsync(d => d.Id == id);

    public async Task<IEnumerable<Doctor>> GetBySpecialtyAsync(int specialtyId) =>
        await _dbSet.Include(d => d.Specialty)
                    .Where(d => d.SpecialtyId == specialtyId)
                    .ToListAsync();
}
