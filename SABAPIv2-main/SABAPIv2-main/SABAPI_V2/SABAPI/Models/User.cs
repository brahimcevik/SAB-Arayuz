using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SABApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("password")]
        public string Password { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("roles")]
        public List<string> Roles { get; set; } = new List<string> { "User" };

        [BsonElement("city")]
        public string City { get; set; } = null!; // Kullanýcýya atanmýþ þehir bilgisi
    }
}
