namespace Dsw2025Tpi.Domain.Entities;

public abstract class EntityBase
{
    // protected EntityBase()
    // {
    //     InternalCode = Guid.NewGuid();
    // }
    public Guid InternalCode { get; set; }= Guid.NewGuid();
}
