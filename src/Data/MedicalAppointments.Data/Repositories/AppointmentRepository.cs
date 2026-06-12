using MedicalAppointments.Data.Context;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointments.Data.Repositories;

public class AppointmentRepository : BaseRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(AppDbContext context) : base(context) { }

    public override async Task<IEnumerable<Appointment>> GetAllAsync() =>
        await _dbSet.Include(a => a.Patient).Include(a => a.Doctor).ToListAsync();

    public override async Task<Appointment?> GetByIdAsync(int id) =>
        await _dbSet.Include(a => a.Patient).Include(a => a.Doctor)
                    .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId) =>
        await _dbSet.Include(a => a.Patient).Include(a => a.Doctor)
                    .Where(a => a.PatientId == patientId).ToListAsync();

    public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(int doctorId) =>
        await _dbSet.Include(a => a.Patient).Include(a => a.Doctor)
                    .Where(a => a.DoctorId == doctorId).ToListAsync();
}
