using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Runtime;

namespace backend.Extensions;

public static class DynamoDbExtensions
{
    public static IServiceCollection AddDynamoDb(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IAmazonDynamoDB>(_ =>
        {
            var config = new AmazonDynamoDBConfig
            {
                ServiceURL = configuration["AWS:ServiceURL"]
            };
            
            // Use basic AWS credentials for local development
            var accessKey = configuration["AWS:AccessKeyId"] ?? "dummy";
            var secretKey = configuration["AWS:SecretAccessKey"] ?? "dummy";
            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            
            return new AmazonDynamoDBClient(credentials, config);
        });

        services.AddSingleton<IDynamoDBContext>(sp =>
        {
            var client = sp.GetRequiredService<IAmazonDynamoDB>();
            return new DynamoDBContextBuilder()
                .WithDynamoDBClient(() => client)
                .Build();
        });

        return services;
    }

    public static async Task EnsureTodoTableExists(this WebApplication app)
    {
        var client = app.Services.GetRequiredService<IAmazonDynamoDB>();
        var tableName = "TodoCollection";
    
        var tables = await client.ListTablesAsync();
        if (!tables.TableNames.Contains(tableName))
        {
            await client.CreateTableAsync(new Amazon.DynamoDBv2.Model.CreateTableRequest
            {
                TableName = tableName,
                KeySchema =
                [
                    new Amazon.DynamoDBv2.Model.KeySchemaElement("Id", KeyType.HASH)
                ],
                AttributeDefinitions =
                [
                    new Amazon.DynamoDBv2.Model.AttributeDefinition("Id", ScalarAttributeType.S)
                ],
                BillingMode = BillingMode.PAY_PER_REQUEST
            });
        }
    }
}
