using MongoDB.Bson.Serialization.Attributes;

namespace ProjP2M
{
    public class RegisterDTO
    {
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
