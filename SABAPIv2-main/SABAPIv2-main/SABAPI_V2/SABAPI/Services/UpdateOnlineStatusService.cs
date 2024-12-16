using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

namespace SABApi.Services
{
    public class UpdateOnlineStatusService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public UpdateOnlineStatusService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Servis başlatıldığında yapılacak işlemler
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            // Servis durdurulduğunda yapılacak işlemler
            return Task.CompletedTask;
        }

        private async Task DoWork()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var ugvRobotService = scope.ServiceProvider.GetRequiredService<UgvRobotService>();
                // UgvRobotService ile yapılacak işlemler
            }
        }
    }
}
