using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Presenter.ViewModels;

namespace MedicalAppointments.Presenter.Presenters;

public static class DoctorPresenter
{
    public static DoctorViewModel ToViewModel(DoctorResponse response) => new()
    {
        Id = response.Id,
        FullName = $"{response.FirstName} {response.LastName}",
        Email = response.Email,
        LicenseNumber = response.LicenseNumber,
        Specialty = response.SpecialtyName
    };

    public static IEnumerable<DoctorViewModel> ToViewModelList(IEnumerable<DoctorResponse> responses) =>
        responses.Select(ToViewModel);
}
