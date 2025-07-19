using Dsw2025Tpi.Domain.Entities;

public class Admin : EntityBase
{

    public string Nombre { get; set; }
    public string DniHash { get; set; }

    public Admin()
    {

    }
    public Admin(string nombre, string dniHash)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            throw new ArgumentException("El nombre es requerido");
        if (string.IsNullOrWhiteSpace(dniHash))
            throw new ArgumentException("El DNI es requerido");

        Nombre = nombre;
        DniHash = dniHash;
    }
}
