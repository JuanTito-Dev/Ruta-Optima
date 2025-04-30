using System.ComponentModel.DataAnnotations;

namespace ProeyectoGoogleMaps.Models
{
    public class Pasajero
    {
        public string Nombre { get; set; }

        [DisplayFormat(DataFormatString = "{0:HH:mm:ss dd/MM/yyyy}")]
        public DateTime Hora { get; set; }

        public Ubicacion Ubicacion { get; set; }

    }
}
