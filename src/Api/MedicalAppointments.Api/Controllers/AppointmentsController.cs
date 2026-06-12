using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Presenter.Presenters;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointments.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _appointmentService.GetAllAsync();
        return Ok(AppointmentPresenter.ToViewModelList(appointments));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appointment = await _appointmentService.GetByIdAsync(id);
        if (appointment is null) return NotFound();
        return Ok(AppointmentPresenter.ToViewModel(appointment));
    }

    [HttpGet("patient/{patientId:int}")]
    public async Task<IActionResult> GetByPatient(int patientId)
    {
        var appointments = await _appointmentService.GetByPatientIdAsync(patientId);
        return Ok(AppointmentPresenter.ToViewModelList(appointments));
    }

    [HttpGet("doctor/{doctorId:int}")]
    public async Task<IActionResult> GetByDoctor(int doctorId)
    {
        var appointments = await _appointmentService.GetByDoctorIdAsync(doctorId);
        return Ok(AppointmentPresenter.ToViewModelList(appointments));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request)
    {
        var created = await _appointmentService.CreateAsync(request);
        var viewModel = AppointmentPresenter.ToViewModel(created);
        return CreatedAtAction(nameof(GetById), new { id = viewModel.Id }, viewModel);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusRequest request)
    {
        var updated = await _appointmentService.UpdateStatusAsync(id, request);
        return Ok(AppointmentPresenter.ToViewModel(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _appointmentService.DeleteAsync(id);
        return NoContent();
    }
}
