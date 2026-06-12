using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Presenter.ViewModels;

namespace MedicalAppointments.Presenter.Presenters;

public static class AppointmentPresenter
{
    public static AppointmentViewModel ToViewModel(AppointmentResponse response) => new()
    {
        Id = response.Id,
        PatientFullName = response.PatientFullName,
        DoctorFullName = response.DoctorFullName,
        ScheduledAt = response.ScheduledAt.ToString("dd/MM/yyyy HH:mm"),
        Status = response.Status.ToString(),
        Notes = response.Notes
    };

    public static IEnumerable<AppointmentViewModel> ToViewModelList(IEnumerable<AppointmentResponse> responses) =>
        responses.Select(ToViewModel);
}
