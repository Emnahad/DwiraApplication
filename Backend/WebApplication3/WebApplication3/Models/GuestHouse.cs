using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProjP2M.Models
{
    public class GuestHouse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<string> keywords { get; set; } = new List<string>();
        public List<DateOnly> AvailableDates { get; set; }=new List<DateOnly>();
        public string? City { get; set; }
        public string? Location { get; set; }
        public double PricePerday { get; set; }
        public int RatingGlobal { get; set; }
        public int Nb_person { get; set; }

        public int Nb_room { get; set; }
        public int Nb_bed { get; set; }
        public int Nb_bed_bayby { get; set; }


        public List<string> ImageUrls { get; set; } = new List<string>();


    }
}
