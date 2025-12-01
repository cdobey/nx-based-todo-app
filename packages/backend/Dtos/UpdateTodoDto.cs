using backend.Models;

namespace backend.Dtos;

public class UpdateTodoDto
{
    public required string Title { get; set; }
    
    public string? Details { get; set; }
    
    public TodoStatus? Status { get; set; }
}
