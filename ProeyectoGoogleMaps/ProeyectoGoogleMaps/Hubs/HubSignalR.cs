using Microsoft.AspNetCore.SignalR;
using ProeyectoGoogleMaps.Data;
using ProeyectoGoogleMaps.Models;

namespace ProeyectoGoogleMaps.Hubs
{
    public class HubSignalR : Hub
    {
        private readonly Datos _datos;

        public HubSignalR(Datos datos)
        {
            _datos = datos;
        }

        public async Task RecogerPasajero(string Nombre, Ubicacion ubicacion)
        {
            Pasajero _pasajero = new Pasajero
            {
                Nombre = Nombre,
                Hora = DateTime.Now,
                Ubicacion = ubicacion
            };
            if (_datos.Agregar(_pasajero))
            {
                await Clients.Caller.SendAsync("RecogerPasajero", Nombre, ubicacion);
                Console.WriteLine($"Pasajero {Nombre} recogido correctamente");
            }
        }

        public async Task AgregarPasajero(string Nombre, Ubicacion ubicacion)
        {
            if (_datos.Agregar(Nombre, ubicacion))
            {
                await Clients.Caller.SendAsync("RecibirPasajeros", Nombre, ubicacion);
                Console.WriteLine($"Pasajero {Nombre} enviado a todos los clientes");
            }
        }
    }
}
