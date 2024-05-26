namespace SSD.Synopsis.Server.Core.IService;

public interface IService<T>
{
    T Add(T entity);
    T Get(string guid);
    IEnumerable<T> GetAll();
    T Edit(T entity);
    T Remove(T entity);
}