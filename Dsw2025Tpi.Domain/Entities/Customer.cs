using Dsw2025Tpi.Domain.Entities;

public class Customer : EntityBase
{
    public Customer()
    {
    }

    public Customer(string email, string name, string phoneNumber)
        : base()
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("El nombre es requerido");
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("El correo electrónico es requerido");
        if (string.IsNullOrWhiteSpace(phoneNumber)) throw new ArgumentException("El número de teléfono es requerido");

        _eMail = email;
        _name = name;
        _phoneNumber = phoneNumber;
    }

    public string _eMail { get; set; }
    public string _name { get; set; }
    public string _phoneNumber { get; set; }
}