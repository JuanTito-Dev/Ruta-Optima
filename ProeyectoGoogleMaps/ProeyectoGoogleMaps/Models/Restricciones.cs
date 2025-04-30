using System.ComponentModel.DataAnnotations;

namespace ProeyectoGoogleMaps.Models
{
    public class Restricciones
    {
        [Required (ErrorMessage = "El campo es obligatorio")]
        [Range(1, 40, ErrorMessage = "Numero de pasajeros fuera de rango" )]
        public int NumeroPasajeros { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio")]
        public DateTime HoraFinal { get; set; }
    }
}
