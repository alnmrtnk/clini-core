using Microsoft.AspNetCore.Mvc;

namespace server_app.Helpers
{
    public static class ApiResponseHelper
    {
        public static IActionResult ToActionResult<T>(this ControllerBase controller, ServiceResult<T> result)
        {
            return result.StatusCode switch
            {
                StatusCodes.Status200OK => controller.Ok(new { data = result.Data }),
                StatusCodes.Status404NotFound => controller.NotFound(new { error = result.ErrorMessage }),
                StatusCodes.Status401Unauthorized => controller.Unauthorized(),
                StatusCodes.Status503ServiceUnavailable => controller.StatusCode(503, new { error = result.ErrorMessage }),
                _ => controller.BadRequest(new { error = result.ErrorMessage })
            };
        }
    }
}
