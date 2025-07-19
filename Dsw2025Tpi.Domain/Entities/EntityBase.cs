namespace Dsw2025Tpi.Domain.Entities;

public abstract class EntityBase
{
    public Guid InternalCode { get; set; }= Guid.NewGuid();
}
