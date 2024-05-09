using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProjP2M.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("First Name")]
        public string? FirstName { get; set; }

        [BsonElement("Last Name")]
        public string? LastName { get; set; }

        [BsonElement("Email")]
        public string? Email { get; set; }

        [BsonElement("Password")]
        public string? Password { get; set; }

        [BsonElement("Image")]
        public string? ImageUrl { get; set; }

    }
}
