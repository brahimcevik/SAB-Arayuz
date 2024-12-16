using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using SABApi.Models;
using SABApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<UgvRobotSettings>(
    builder.Configuration.GetSection("UgvRobotSettings"));

builder.Services.AddSingleton<UserService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Ensure UgvRobotService is registered
builder.Services.AddScoped<UgvRobotService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll"); // Ensure CORS is used

app.UseAuthorization();
app.MapControllers();
app.Run();
