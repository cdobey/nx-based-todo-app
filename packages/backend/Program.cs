using backend.Extensions;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddDynamoDb(builder.Configuration);

var app = builder.Build();

// Initialize database table
await app.EnsureTodoTableExists();

// Make OpenAPI and Scalar available in all environments
app.MapOpenApi();
app.MapScalarApiReference();

// HTTPS redirection handled by reverse proxy (Coolify)
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();