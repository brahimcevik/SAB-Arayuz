using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SABApi.Models
{
    public class UgvRobot
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("ugvName")]
        public string ugvName { get; set; } = null!;

        [BsonElement("ugvColor")]
        public string ugvColor { get; set; } = null!;

        [BsonElement("ugvDistance")]
        public double ugvDistance { get; set; }


        [BsonElement("ugvHerbicide")]
        public double ugvHerbicide { get; set; }


        [BsonElement("carLat")]
        public double carLat { get; set; }

        [BsonElement("carLong")]
        public double carLong { get; set; }

        [BsonElement("carLoc")]
        public string carLoc { get; set; } = null!;

        [BsonElement("ugvMission")]
        public string ugvMission { get; set; } = null!;

        [BsonElement("ugvSpeed")]
        public double ugvSpeed { get; set; }

        [BsonElement("InfoDate")]
        public DateTime InfoDate { get; set; }

        [BsonElement("no")]
        public int No { get; set; }

        [BsonElement("siraUzunlugu")]
        public int? SiraUzunlugu { get; set; }

        [BsonElement("ikiSiraArasiMesafe")]
        public double? IkiSiraArasiMesafe { get; set; }

        [BsonElement("toplamSiraSayisi")]
        public int? ToplamSiraSayisi { get; set; }

        [BsonElement("donusDerecesi")]
        public double? DonusDerecesi { get; set; }

        [BsonElement("ilkDonusAcisi")]
        public string IlkDonusAcisi { get; set; }

        [BsonElement("mod2")]
        public string Mod2 { get; set; }

        [BsonElement("lastActiveMod")]
        public string lastActiveMod { get; set; }

        [BsonElement("status")]
        public Boolean Status { get; set; }

        [BsonElement("OnlineStatus")]
        public Boolean OnlineStatus { get; set; }

        [BsonElement("LastRunTime")]
        public DateTime? LastRunTime { get; set; }

        [BsonElement("direction")]
        public string Direction { get; set; }

        [BsonElement("manuelStatus")]
        public Boolean ManuelStatus { get; set; }

    }
}