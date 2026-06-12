using MedicalAppointments.Application.DTOs.Requests;
using MedicalAppointments.Application.Interfaces;
using MedicalAppointments.Presenter.Presenters;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointments.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorsController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var doctors = await _doctorService.GetAllAsync();
        return Ok(DoctorPresenter.ToViewModelList(doctors));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _doctorService.GetByIdAsync(id);
        if (doctor is null) return NotFound();
        return Ok(DoctorPresenter.ToViewModel(doctor));
    }

    [HttpGet("specialty/{specialtyId:int}")]
    public async Task<IActionResult> GetBySpecialty(int specialtyId)
    {
        var doctors = await _doctorService.GetBySpecialtyAsync(specialtyId);
        return Ok(DoctorPresenter.ToViewModelList(doctors));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDoctorRequest request)
    {
        var created = await _doctorService.CreateAsync(request);
        var viewModel = DoctorPresenter.ToViewModel(created);
        return CreatedAtAction(nameof(GetById), new { id = viewModel.Id }, viewModel);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _doctorService.DeleteAsync(id);
        return NoContent();
    }
}
