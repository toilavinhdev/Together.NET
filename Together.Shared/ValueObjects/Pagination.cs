namespace Together.Shared.ValueObjects;

public interface IPaginationRequest
{
    public int PageIndex { get; set; }
    
    public int PageSize { get; set; }
}

public class Pagination(int pageIndex, int pageSize, long totalRecord)
{
    public int PageIndex { get; set; } = pageIndex;

    public int PageSize { get; set; } = pageSize;

    public long TotalRecord { get; set; } = totalRecord;

    public long TotalPage => (long)Math.Ceiling(TotalRecord / (double)PageSize);

    public bool HasPreviousPage => PageIndex > 1;

    public bool HasNextPage => PageIndex < TotalPage;
}

public class PaginationResult<T>(
    List<T> result, 
    int pageIndex, 
    int pageSize, 
    long totalRecord)
{
    public Pagination Pagination { get; set; } = new(pageIndex, pageSize, totalRecord);
    
    public List<T> Result { get; set; } = result;
}