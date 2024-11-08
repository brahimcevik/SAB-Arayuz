using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SABApi.Models;
using SABApi.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

public class UpdateOnlineStatusService : BackgroundService
{
    private readonly UgvRobotService _ugvRobotService;
    private readonly ILogger<UpdateOnlineStatusService> _logger;

    public UpdateOnlineStatusService(UgvRobotService ugvRobotService, ILogger<UpdateOnlineStatusService> logger)
    {
        _ugvRobotService = ugvRobotService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateRobotStatusesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Robot durumlarını güncellerken bir hata oluştu.");
            }

            await Task.Delay(TimeSpan.FromMinutes(0.1), stoppingToken);
        }
    }

    private async Task UpdateRobotStatusesAsync()
    {
        var robotlar = await _ugvRobotService.GetAsync();
        var simdikiZaman = DateTime.UtcNow;

        foreach (var robot in robotlar)
        {
            try
            {
                if (robot.LastRunTime.HasValue && (simdikiZaman - robot.LastRunTime.Value).TotalMinutes > 0.25)
                {
                    var currentStatuses = (robot.OnlineStatus ?? "false,false,false,false").Split(',').ToList();

                    // Array'i 4 elemana tamamla
                    while (currentStatuses.Count < 4)
                    {
                        currentStatuses.Add("false");
                    }

                    // Sadece ilk elemanı false yap, diğerlerini koru
                    currentStatuses[0] = "true";
                    var newStatus = string.Join(",", currentStatuses);

                    await _ugvRobotService.UpdateOnlineStatusAsync(robot.No, new ModUpdateRequest
                    {
                        OnlineStatus = newStatus
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Robot {robot.No} durumu güncellenirken hata oluştu.");
            }
        }
    }
}
