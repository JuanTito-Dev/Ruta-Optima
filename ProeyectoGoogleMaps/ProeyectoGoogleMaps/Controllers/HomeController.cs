using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProeyectoGoogleMaps.Data;
using ProeyectoGoogleMaps.Models;

namespace ProeyectoGoogleMaps.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly IConfiguration _configuration;

        private readonly Datos _datos;


        public HomeController(ILogger<HomeController> logger, IConfiguration configuracion, Datos datos )
        {
            _configuration = configuracion;
            _logger = logger;
            _datos = datos;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index([Bind("NumeroPasajeros", "HoraFinal")] Restricciones _restriciones)
        {
            _restriciones.HoraFinal = DateTime.SpecifyKind(_restriciones.HoraFinal, DateTimeKind.Utc);
            if (_datos.AgregarRestriciones(_restriciones) && ModelState.IsValid)
            {
                return RedirectToAction(nameof(Mapa));
            }
            else
            {
                return View();
            }
        }
        public IActionResult Mapa()
        {
            ViewBag.Key = _configuration["GoogleMaps:Key"];
            return View();
        }

        public IActionResult Historial()
        {
            var Pasajeros = _datos.ObtenerPasajerosRecogidos();

            return View(Pasajeros);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
