using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProjP2M.Models
{
    public class ContactMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        

    }
}
