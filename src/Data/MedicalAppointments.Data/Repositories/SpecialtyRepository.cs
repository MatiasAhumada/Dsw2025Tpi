using MedicalAppointments.Data.Context;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;

namespace MedicalAppointments.Data.Repositories;

public class SpecialtyRepository : BaseRepository<Specialty>, ISpecialtyRepository
{
    public SpecialtyRepository(AppDbContext context) : base(context) { }
}
