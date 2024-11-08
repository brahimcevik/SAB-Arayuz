using SABApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace SABApi.Services
{
    public class UgvRobotService
    {
        private readonly IMongoCollection<UgvRobot> _ugvRobotCollection;

        public UgvRobotService(
            IOptions<UgvRobotSettings> ugvRobotSettings)
        {
            var mongoClient = new MongoClient(
                ugvRobotSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ugvRobotSettings.Value.DatabaseName);

            _ugvRobotCollection = mongoDatabase.GetCollection<UgvRobot>(
                ugvRobotSettings.Value.UgvRobotName);
        }

        public async Task<List<UgvRobot>> GetAsync() =>
            await _ugvRobotCollection.Find(_ => true).ToListAsync();

        public async Task<UgvRobot?> GetAsync(string id) =>
            await _ugvRobotCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(UgvRobot newUgvRobot)
        {
            newUgvRobot.Status = false;
            newUgvRobot.ManuelStatus = false;
            newUgvRobot.OnlineStatus = "false,false,false,false";

            var highestNo = await _ugvRobotCollection.Find(_ => true)
                .SortByDescending(x => x.No)
                .Limit(1)
                .FirstOrDefaultAsync();

            newUgvRobot.No = highestNo != null ? highestNo.No + 1 : 0;

            await _ugvRobotCollection.InsertOneAsync(newUgvRobot);
        }

        public async Task UpdateAsync(string id, UgvRobot updatedUgvRobot)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ugvName, updatedUgvRobot.ugvName)
                .Set(x => x.ugvColor, updatedUgvRobot.ugvColor)
                .Set(x => x.ugvDistance, updatedUgvRobot.ugvDistance)
                .Set(x => x.ugvHerbicide, updatedUgvRobot.ugvHerbicide)
                .Set(x => x.carLat, updatedUgvRobot.carLat)
                .Set(x => x.carLong, updatedUgvRobot.carLong)
                .Set(x => x.carLoc, updatedUgvRobot.carLoc)
                .Set(x => x.ugvMission, updatedUgvRobot.ugvMission)
                .Set(x => x.ugvSpeed, updatedUgvRobot.ugvSpeed)
                .Set(x => x.InfoDate, updatedUgvRobot.InfoDate);

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.Id == id,
                updateDefinition);
        }

        public async Task RemoveAsync(string id) =>
            await _ugvRobotCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<UgvRobot?> GetByNoAsync(int no) =>
            await _ugvRobotCollection.Find(x => x.No == no).FirstOrDefaultAsync();

        public async Task<UgvRobot?> GetByIdAsync(string id) =>
            await _ugvRobotCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task UpdateDistanceAsync(int no, double newDistance)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ugvDistance, newDistance);

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }
        public async Task UpdateHerbicideAsync(int no, double newHerbicide)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ugvHerbicide, newHerbicide);

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }
        public async Task UpdateUgvSpeedAsync(int no, double newSpeed)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ugvSpeed, newSpeed);

            await _ugvRobotCollection.UpdateManyAsync(
                x => x.No == no,
                updateDefinition);
        }

        public async Task UpdateUgvMissionAsync(int no, string newMission)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ugvMission, newMission);

            await _ugvRobotCollection.UpdateManyAsync(
                x => x.No == no,
                updateDefinition);
        }
        public async Task UpdateLocationAsync(int no, LocationUpdateRequest request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.carLoc, request.CarLoc)
                .Set(x => x.carLat, request.CarLat)
                .Set(x => x.carLong, request.CarLong);

            await _ugvRobotCollection.UpdateManyAsync(
                x => x.No == no,
                updateDefinition);
        }

        public async Task UpdateInfoDateAsync(int no, DateTime newInfoDate)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.InfoDate, newInfoDate);

            await _ugvRobotCollection.UpdateManyAsync(
                x => x.No == no,
                updateDefinition);
        }

        public async Task UpdateModAsync(int no, ModUpdateRequest request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.SiraUzunlugu, request.SiraUzunlugu)
                .Set(x => x.IkiSiraArasiMesafe, request.IkiSiraArasiMesafe)
                .Set(x => x.ToplamSiraSayisi, request.ToplamSiraSayisi)
                .Set(x => x.DonusDerecesi, request.DonusDerecesi)
                .Set(x => x.IlkDonusAcisi, request.IlkDonusAcisi)
                .Set(x => x.lastActiveMod, "mod1")
                .Set(x => x.Status, true);

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }

        public async Task<UgvRobot?> GetModAsync(int no) =>
            await _ugvRobotCollection.Find(x => x.No == no).FirstOrDefaultAsync();


        public async Task UpdateMod2Async(int no, ModUpdateRequest request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.Mod2, request.Mod2)
                .Set(x => x.lastActiveMod, "mod2")
                .Set(x => x.Status, true);

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }


        public async Task UpdateStatusAsync(int no, ModUpdateRequest request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.Status, request.Status);
            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }


        public async Task UpdateOnlineStatusAsync(int no, ModUpdateRequest request)
        {
            if (string.IsNullOrEmpty(request.OnlineStatus) || request.OnlineStatus == "string")
            {
                request.OnlineStatus = "false,false,false,false";
            }

            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.OnlineStatus, request.OnlineStatus);

            var statuses = request.OnlineStatus.Split(',');
            if (statuses.Length > 0 && statuses[0] == "true")
            {
                updateDefinition = updateDefinition.Set(x => x.LastRunTime, DateTime.UtcNow);
            }

            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }


        public async Task UpdateDirectionAsync(string id, DirectionUpdateRequest request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.Direction, request.Direction);
            await _ugvRobotCollection.UpdateOneAsync(
                x => x.Id == id,
                updateDefinition);
        }


        public async Task UpdateManuelStatusAsync(int no, ManuelStatusUpdateRequests request)
        {
            var updateDefinition = Builders<UgvRobot>.Update
                .Set(x => x.ManuelStatus, request.ManuelStatus);
            await _ugvRobotCollection.UpdateOneAsync(
                x => x.No == no,
                updateDefinition);
        }



    }
}