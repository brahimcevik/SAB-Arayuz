namespace SABApi.Models
{
    public class ModUpdateRequest
    {
        public int SiraUzunlugu { get; set; }
        public double IkiSiraArasiMesafe { get; set; }
        public int ToplamSiraSayisi { get; set; }
        public double DonusDerecesi { get; set; }
        public string IlkDonusAcisi { get; set; }
        public string Mod2 { get; set; }
        public Boolean Status { get; set; }
        public string OnlineStatus { get; set; } = "false,false,false,false";

    }
}