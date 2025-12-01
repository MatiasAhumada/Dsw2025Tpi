namespace Dsw2025Tpi.Application.Dtos
{
    public record PaginatedResponse<T>
    {
        public IEnumerable<T> Data { get; init; } = new List<T>();
        public int CurrentPage { get; init; }
        public int PageSize { get; init; }
        public int TotalCount { get; init; }
        public int TotalPages { get; init; }
        public bool HasPrevious { get; init; }
        public bool HasNext { get; init; }

        public PaginatedResponse(IEnumerable<T> data, int currentPage, int pageSize, int totalCount)
        {
            Data = data;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            HasPrevious = currentPage > 1;
            HasNext = currentPage < TotalPages;
        }
    }
}