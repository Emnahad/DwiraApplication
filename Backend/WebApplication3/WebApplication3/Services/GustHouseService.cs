using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProjP2M.Data;
using ProjP2M.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjP2M.Services
{
    public interface IGuestHouseService
    {
        Task<List<GuestHouse>> GetAsync();
        Task<GuestHouse?> GetAsync(string id);
        Task CreateAsync(GuestHouse newGuestHouse);
        Task UpdateAsync(string id, GuestHouse updatedGuestHouse);
        Task RemoveAsync(string id);
    }
    public class GuestHouseService : IGuestHouseService
    {
        private readonly IMongoCollection<GuestHouse> _guestHouseCollection;

        public GuestHouseService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _guestHouseCollection = mongoDatabase.GetCollection<GuestHouse>("GuestHouse");
        }

        public async Task<List<GuestHouse>> GetAsync() =>
            await _guestHouseCollection.Find(_ => true).ToListAsync();

        public async Task<GuestHouse?> GetAsync(string id) =>
            await _guestHouseCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(GuestHouse newGuestHouse) =>
            await _guestHouseCollection.InsertOneAsync(newGuestHouse);

        public async Task UpdateAsync(string id, GuestHouse updatedGuestHouse) =>
            await _guestHouseCollection.ReplaceOneAsync(x => x.Id == id, updatedGuestHouse);

        public async Task RemoveAsync(string id) =>
            await _guestHouseCollection.DeleteOneAsync(x => x.Id == id);
    }
}
