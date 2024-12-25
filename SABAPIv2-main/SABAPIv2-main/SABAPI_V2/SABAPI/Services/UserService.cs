using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SABApi.Models;

namespace SABApi.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(IOptions<UgvRobotSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _userCollection = database.GetCollection<User>(settings.Value.UserCollectionName);
        }

        // Tüm kullanıcıları getir
        public async Task<List<User>> GetAsync() =>
            await _userCollection.Find(_ => true).ToListAsync();

        // Kullanıcı adı ile kullanıcıyı getir
        public async Task<User?> GetByUsernameAsync(string username) =>
            await _userCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

        // Kullanıcı ID ile kullanıcıyı getir
        public async Task<User?> GetByIdAsync(string userId) =>
            await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();

        // Yeni kullanıcı oluştur
        public async Task CreateAsync(User newUser)
        {
            await _userCollection.InsertOneAsync(newUser);
        }

        // Kullanıcı adı ve şifre ile kullanıcıyı doğrula
        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await GetByUsernameAsync(username);

            if (user != null && user.Password == password)
            {
                return user;
            }
            return null;
        }

        // JWT token oluştur
        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Anahtarınızı daha uzun ve güvenli bir hale getirin
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsASecretKeyForJWTThatIsLongEnough"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "YourIssuer",
                audience: "YourAudience",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Kullanıcıyı güncelle
        public async Task UpdateUserAsync(User updatedUser)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, updatedUser.Id);
            await _userCollection.ReplaceOneAsync(filter, updatedUser);
        }

        // Kullanıcıyı sil
        public async Task DeleteUserAsync(string userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            await _userCollection.DeleteOneAsync(filter);
        }
    }
}
