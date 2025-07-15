using Dsw2025Tpi.Domain.Entities;

public class Customer : EntityBase
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public List<Order> Orders { get; set; } = new();

    public Customer()
    {
    }

    public Customer(string email, string name, string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre es requerido");
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("El correo electrónico es requerido");
        if (string.IsNullOrWhiteSpace(phoneNumber))
            throw new ArgumentException("El número de teléfono es requerido");

        Email = email;
        Name = name;
        PhoneNumber = phoneNumber;
    }


}