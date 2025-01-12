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
        public async Task UpdateUserAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);

            var updateDefinition = new List<UpdateDefinition<User>>();

            // Değiştirilen alanları kontrol et
            if (!string.IsNullOrEmpty(user.Username))
            {
                updateDefinition.Add(Builders<User>.Update.Set(u => u.Username, user.Username));
            }
            if (!string.IsNullOrEmpty(user.Password))
            {
                updateDefinition.Add(Builders<User>.Update.Set(u => u.Password, user.Password));
            }
            if (!string.IsNullOrEmpty(user.City))
            {
                updateDefinition.Add(Builders<User>.Update.Set(u => u.City, user.City));
            }
            if (user.Roles != null && user.Roles.Any())
            {
                updateDefinition.Add(Builders<User>.Update.Set(u => u.Roles, user.Roles));
            }

            // Profil bilgilerini kontrol et
            if (user.Profile != null)
            {
                if (!string.IsNullOrEmpty(user.Profile.FirstName))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.FirstName, user.Profile.FirstName));
                }
                if (!string.IsNullOrEmpty(user.Profile.LastName))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.LastName, user.Profile.LastName));
                }
                if (!string.IsNullOrEmpty(user.Profile.Email))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.Email, user.Profile.Email));
                }
                if (!string.IsNullOrEmpty(user.Profile.Phone))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.Phone, user.Profile.Phone));
                }
                if (!string.IsNullOrEmpty(user.Profile.ProfilePicture))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.ProfilePicture, user.Profile.ProfilePicture));
                }
                if (!string.IsNullOrEmpty(user.Profile.Ulke))
                {
                    updateDefinition.Add(Builders<User>.Update.Set(u => u.Profile.Ulke, user.Profile.Ulke));
                }
            }

            // Eğer herhangi bir güncelleme varsa, update işlemini yap
            if (updateDefinition.Any())
            {
                var update = Builders<User>.Update.Combine(updateDefinition);
                await _userCollection.UpdateOneAsync(filter, update);
            }
        }



        // Kullanıcıyı sil
        public async Task DeleteUserAsync(string userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            await _userCollection.DeleteOneAsync(filter);
        }
       

    }
}