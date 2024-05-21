namespace SSD.Synopsis.Server.Domain.Helpers;

public interface IDbInitialzier<T>
{
    void Initialize(T context);
}