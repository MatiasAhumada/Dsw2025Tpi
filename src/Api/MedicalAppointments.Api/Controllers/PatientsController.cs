using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Presenter.Presenters;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointments.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientsController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var patients = await _patientService.GetAllAsync();
        return Ok(PatientPresenter.ToViewModelList(patients));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _patientService.GetByIdAsync(id);
        if (patient is null) return NotFound();
        return Ok(PatientPresenter.ToViewModel(patient));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientRequest request)
    {
        var created = await _patientService.CreateAsync(request);
        var viewModel = PatientPresenter.ToViewModel(created);
        return CreatedAtAction(nameof(GetById), new { id = viewModel.Id }, viewModel);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _patientService.DeleteAsync(id);
        return NoContent();
    }
}
