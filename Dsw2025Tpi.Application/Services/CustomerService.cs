
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

        var customers = await _repository.GetAll<Customer>();
        
        if (customers.Any(c => c.Email == request.Email))
            throw new ArgumentException("Ya existe un cliente con este email");
            
        if (customers.Any(c => c.Name == request.Name))
            throw new ArgumentException("Ya existe un cliente con este usuario");

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

    public async Task<Customer?> AuthenticateCustomerAsync(string name, string dni)
    {
        var customers = await _repository.GetAll<Customer>();
        return customers.FirstOrDefault(c => c.Name == name && c.Dni == dni);
    }
}
