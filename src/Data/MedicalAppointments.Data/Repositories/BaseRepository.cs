using MedicalAppointments.Data.Context;
using MedicalAppointments.Domain.Entities;
using MedicalAppointments.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointments.Data.Repositories;

public abstract class BaseRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id) =>
        await _dbSet.FindAsync(id);

    public virtual async Task<IEnumerable<T>> GetAllAsync() =>
        await _dbSet.ToListAsync();

    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"{typeof(T).Name} with id {id} not found.");
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
