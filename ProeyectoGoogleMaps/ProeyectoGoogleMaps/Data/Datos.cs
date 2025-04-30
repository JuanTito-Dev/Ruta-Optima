
using ProeyectoGoogleMaps.Models;
using System.Collections.Concurrent;

namespace ProeyectoGoogleMaps.Data
{
    public class Datos
    {
        Restricciones _restriciones = new Restricciones();

        public bool AgregarRestriciones(Restricciones res)
        {
            try
            {
                this._restriciones.NumeroPasajeros = res.NumeroPasajeros;
                this._restriciones.HoraFinal = res.HoraFinal;
                Console.WriteLine($"Restricciones agregadas: {res.NumeroPasajeros} pasajeros y fecha {res.HoraFinal}");
                return true;
            }
            catch(Exception ex) 
            {
                Console.WriteLine($"No se pudo agregar las restriciones {res.NumeroPasajeros} y {res.HoraFinal}");
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        private bool recoger()
        {
            if (_restriciones.NumeroPasajeros > 0)
            {
                _restriciones.NumeroPasajeros--;
                return true;
            }
            else
            {
                return false;
            }
        }

        Queue<Pasajero> PasajerosRecogidos = new Queue<Pasajero>();

        public bool Agregar(Pasajero _pasajero)
        {
            try
            {
                PasajerosRecogidos.Enqueue(_pasajero);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public Queue<Pasajero> ObtenerPasajerosRecogidos()
        {
            return PasajerosRecogidos;
        }

        Dictionary<string, Ubicacion> _pasajeros = new Dictionary<string, Ubicacion>();

        public bool Agregar(string Nombre, Ubicacion ubicacion)
        {
            try
            {
                if (recoger())
                {
                    _pasajeros.Add(Nombre, ubicacion);
                    Console.WriteLine($"Pasajero {Nombre} insertado a la tabla");
                    return true;
                }
                else
                {
                    Console.WriteLine($"No se puede recoger al pasajero {Nombre} porque no hay espacio");
                    return false;
                }

            }
            catch
            {
                Console.WriteLine($"Error al insertar el pasajero {Nombre} a la tabla");
                return false;
            }    
        }

        public void LimpiarPasajeros()
        {
            _pasajeros.Clear();
            Console.WriteLine("Tabla limpiada");
        }
    }
}
