using MedicalAppointments.Application.DTOs.Responses;
using MedicalAppointments.Presenter.ViewModels;

namespace MedicalAppointments.Presenter.Presenters;

public static class PatientPresenter
{
    public static PatientViewModel ToViewModel(PatientResponse response) => new()
    {
        Id = response.Id,
        FullName = $"{response.FirstName} {response.LastName}",
        Email = response.Email,
        Phone = response.Phone,
        DateOfBirth = response.DateOfBirth.ToString("dd/MM/yyyy"),
        Age = CalculateAge(response.DateOfBirth)
    };

    public static IEnumerable<PatientViewModel> ToViewModelList(IEnumerable<PatientResponse> responses) =>
        responses.Select(ToViewModel);

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age)) age--;
        return age;
    }
}
