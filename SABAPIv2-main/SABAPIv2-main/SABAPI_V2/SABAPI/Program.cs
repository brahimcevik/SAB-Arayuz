using SABApi.Models;
using SABApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;


var builder = WebApplication.CreateBuilder(args);

// MongoDB Connection

builder.Services.Configure<UgvRobotSettings>(builder.Configuration.GetSection("UgvRobotMongoDB"));  // Eklenen sat�r

builder.Services.AddSingleton<UgvRobotService>();  // Eklenen sat�r



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Arka Plan hizmeti
builder.Services.AddHostedService<UpdateOnlineStatusService>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(44315, configure => configure.UseHttps()); // HTTPS için 44315 portunu dinleyin
    options.ListenAnyIP(44314); // HTTP için 44314 portunu dinleyin
});

var app = builder.Build();

// CORS Configuration
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    await next();
});

app.UseCors(builder =>
{
    builder
        .AllowAnyOrigin()  // You can use .WithOrigins("http://localhost:3000") to specify a specific origin.
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithExposedHeaders("Content-Disposition"); // You can specify additional headers if needed.
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
