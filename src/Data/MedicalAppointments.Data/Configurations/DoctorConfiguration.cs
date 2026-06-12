using MedicalAppointments.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MedicalAppointments.Data.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.HasKey(d => d.Id);
        builder.Property(d => d.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(d => d.LastName).IsRequired().HasMaxLength(100);
        builder.Property(d => d.Email).IsRequired().HasMaxLength(200);
        builder.HasIndex(d => d.Email).IsUnique();
        builder.Property(d => d.LicenseNumber).IsRequired().HasMaxLength(50);
        builder.HasOne(d => d.Specialty)
               .WithMany(s => s.Doctors)
               .HasForeignKey(d => d.SpecialtyId);
    }
}
