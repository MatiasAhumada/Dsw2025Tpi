namespace MedicalAppointments.Presenter.ViewModels;

public class AppointmentViewModel
{
    public int Id { get; set; }
    public string PatientFullName { get; set; } = string.Empty;
    public string DoctorFullName { get; set; } = string.Empty;
    public string ScheduledAt { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
