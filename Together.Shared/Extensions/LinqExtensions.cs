using System.Linq.Expressions;

namespace Together.Shared.Extensions;

public static class LinqExtensions
{
    public static IQueryable<T> Paging<T>(this IQueryable<T> query, int pageIndex, int pageSize)
    {
        return query.Skip(pageSize * (pageIndex - 1)).Take(pageSize);
    }
    
    public static IOrderedQueryable<T> SortBy<T>(this IQueryable<T> query, Expression<Func<T, object>> selector, bool asc = true)
    {
        return asc ? query.OrderBy(selector) : query.OrderByDescending(selector);
    }
}