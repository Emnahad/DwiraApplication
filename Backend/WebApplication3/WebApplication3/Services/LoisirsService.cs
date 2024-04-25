using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProjP2M.Data;
using ProjP2M.Models;

namespace ProjP2M.Services
{
    public class LoisirsService
    {
        private readonly IMongoCollection<Loisirs> _LoisirsCollection;
        public LoisirsService(
            IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _LoisirsCollection = mongoDatabase.GetCollection<Loisirs>("Loisirs");

        }
        public async Task<List<Loisirs>> GetAsync() =>
        await _LoisirsCollection.Find(_ => true).ToListAsync();

        public async Task<Loisirs?> GetAsync(string Idl) =>
           await _LoisirsCollection.Find(x => x.Idl == Idl).FirstOrDefaultAsync();
        public async Task CreateAsync(Loisirs newLoisirs) =>
            await _LoisirsCollection.InsertOneAsync(newLoisirs);

        public async Task UpdateAsync(string Idl, Loisirs UpdateLoisir) =>
           await _LoisirsCollection.ReplaceOneAsync(x => x.Idl == Idl, UpdateLoisir);

        public async Task RemoveAsync(string Idl) => await _LoisirsCollection.DeleteOneAsync(x => x.Idl == Idl);


    }
}
