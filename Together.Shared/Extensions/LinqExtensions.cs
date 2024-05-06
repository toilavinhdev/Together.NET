using System.Linq.Expressions;

namespace Together.Shared.Extensions;

public static class LinqExtensions
{
    public static IOrderedQueryable<T> SortBy<T>(this IQueryable<T> query, Expression<Func<T, object>> selector, bool asc = true)
    {
        return asc ? query.OrderBy(selector) : query.OrderByDescending(selector);
    }
}