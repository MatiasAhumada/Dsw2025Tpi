using MedicalAppointments.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MedicalAppointments.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Status).IsRequired();
        builder.Property(a => a.ScheduledAt).IsRequired();
        builder.Property(a => a.Notes).HasMaxLength(1000);
        builder.HasOne(a => a.Patient)
               .WithMany(p => p.Appointments)
               .HasForeignKey(a => a.PatientId)
               .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(a => a.Doctor)
               .WithMany(d => d.Appointments)
               .HasForeignKey(a => a.DoctorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
