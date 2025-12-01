using Dsw2025Tpi.Domain.Entities;

public class Admin : EntityBase
{

    public string Nombre { get; set; }
    public string DniHash { get; set; }
    public string Email { get; set; }

    

    public Admin()
    {

    }
    public Admin(string nombre, string dniHash, string email)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            throw new ArgumentException("El nombre es requerido");
        if (string.IsNullOrWhiteSpace(dniHash))
            throw new ArgumentException("El DNI es requerido");
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("El email es requerido");

        Nombre = nombre;
        DniHash = dniHash;
        Email = email;
    }
}
