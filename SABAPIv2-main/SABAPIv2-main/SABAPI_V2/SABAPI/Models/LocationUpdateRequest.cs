namespace SABApi.Models
{
    public class LocationUpdateRequest
    {
        public string CarLoc { get; set; } = null!;
        public double CarLat { get; set; }
        public double CarLong { get; set; }
    }
}
