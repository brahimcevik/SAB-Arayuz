
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using SABApi.Models;
using SABApi.Services;
using SABApi.Services; // WeatherService'i dahil ettiðiniz namespace

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<UgvRobotSettings>(
    builder.Configuration.GetSection("UgvRobotSettings"));

builder.Services.AddSingleton<UserService>();
builder.Services.AddScoped<UgvRobotService>();


// WeatherService için HttpClient ekliyoruz
builder.Services.AddHttpClient<WeatherService>();

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