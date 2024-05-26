namespace SSD.Synopsis.Server.Core.IRepository;

public interface IRepository<T>
{
    T Add(T entity);
    T Get(string guid);
    IEnumerable<T> GetAll();
    T Edit(T entity);
    T Remove(T entity);
}