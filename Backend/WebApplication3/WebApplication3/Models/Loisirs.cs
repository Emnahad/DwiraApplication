using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.Design.Serialization;

namespace ProjP2M.Models
{
    public class Loisirs
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Idl { get; set; }
        public string? nameL { get; set; }
        public string? imageUrl { get; set; }


    }
}
