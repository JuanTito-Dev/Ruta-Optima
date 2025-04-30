using Newtonsoft.Json;

namespace ProeyectoGoogleMaps.Models
{
    public class Ubicacion
    {
        [JsonProperty("latitud")]
        public double Latitud { get; set; }

        [JsonProperty("longitud")]
        public double Longitud { get; set; }
    }
}
