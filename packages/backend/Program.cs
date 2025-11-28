using backend.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        // Force HTTPS in the OpenAPI spec when behind reverse proxy
        document.Servers = 
        [
            new() { Url = "https://backend.dobey.dev" }
        ];
        return Task.CompletedTask;
    });
});

builder.Services.AddDynamoDb(builder.Configuration);

var app = builder.Build();

// Configure forwarded headers for reverse proxy (Coolify)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedFor
});

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