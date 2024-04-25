using MongoDB.Bson.Serialization.Attributes;

namespace ProjP2M
{
    public class GuestHouseDTO
    {
        public string? Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<string> keywords { get; set; } = new List<string>();
        public List<DateOnly> AvailableDates { get; set; } = new List<DateOnly>();
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
