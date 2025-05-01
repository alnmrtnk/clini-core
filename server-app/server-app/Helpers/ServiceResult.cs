namespace server_app.Helpers
{
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? ErrorMessage { get; set; }
        public int StatusCode { get; set; }

        public static ServiceResult<T> Ok(T data) =>
            new() { Success = true, Data = data, StatusCode = StatusCodes.Status200OK };

        public static ServiceResult<T> Fail(string message, int statusCode = StatusCodes.Status400BadRequest) =>
            new() { Success = false, ErrorMessage = message, StatusCode = statusCode };
    }
}
