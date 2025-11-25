using Amazon.DynamoDBv2.DataModel;

namespace backend.Models;

public enum TodoStatus
{
    Todo,
    InProgress,
    Completed
}

[DynamoDBTable("TodoCollection")]
public class Todo
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();    
    public required string Title { get; set; }
    
    public string? Details { get; set; }

    [DynamoDBProperty]
    public TodoStatus Status { get; set; } = TodoStatus.Todo;
}