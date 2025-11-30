
using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Domain;

public class CustomerService
{
    private readonly IRepository _repository;

    public CustomerService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Customer> CreateCustomerAsync(CreateCustomerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Dni))
            throw new ArgumentException("Datos incompletos");

        var customer = new Customer(request.Email, request.Name, request.PhoneNumber, request.Dni);
        await _repository.Add(customer);
        return customer;
    }

    public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
    {
        return await _repository.GetAll<Customer>();
    }

    public async Task<Customer?> GetCustomerByIdAsync(Guid id)
    {
        return await _repository.GetById<Customer>(id);
    }
}
