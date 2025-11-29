namespace Dsw2025Tpi.Domain.Entities;

public abstract class EntityBase
{
    public Guid GuidCode { get; set; }= Guid.NewGuid();
}
