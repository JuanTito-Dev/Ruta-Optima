// Variables globales
var map, BusMarker, AquiId, connection;
var marcadores = {};  //para la simulacion de pasajeros
var direccionServicio, direccionRenderizado;
var semaforo = true;
let positionHistory = [];
const HISTORY_LENGTH = 5;
const MIN_UPDATE_INTERVAL = 100; // ms
const MIN_DISTANCE_CHANGE = 2; // metros
let lastProcessedPosition = null;

function EnviarUbicacion() {
    const name = "--";
    const Location = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", name, Location);
    console.log("Ubicacion de Tito enviado");

    const name2 = "---";
    const Location2 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", name2, Location2);
    console.log("Ubicacion de Vargas enviado");

    const nombre = "----";
    const Ubicacion = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre, Ubicacion);
    console.log("Ubiacion de Juan enviado");

    const nombre2 = "----";
    const Ubicacion2 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre2, Ubicacion2);
    console.log("Ubiacion de Alex enviado");

    const nombre3 = "---";
    const Ubicacion3 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre3, Ubicacion3);
    console.log("Ubiacion de Jhosep enviado");

    const nombre4 = "----";
    const Ubicacion4 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre4, Ubicacion4);
    console.log("Ubiacion de Miguel enviado");

    const nombre5 = "---"
    const Ubicacion5 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre5, Ubicacion5);
    console.log("Ubiacion de Ivan enviado");

    const nombre6 = "----";
    const Ubicacion6 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre6, Ubicacion6);
    console.log("Ubiacion de Kevin enviado");

    const nombre7 = "----";
    const Ubicacion7 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre7, Ubicacion7);
    console.log("Ubiacion de Jorge enviado");

    const nombre8 = "---";
    const Ubicacion8 = { Latitud: 1, Longitud: 1 };
    connection.invoke("AgregarPasajero", nombre8, Ubicacion8);
    console.log("Ubiacion de Luis enviado");

    const Bton = document.getElementById("EnviarDatos");
    Bton.remove();
}

function CrearIconoBus() {
    return {
        url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20),
    };
}

function ConstruirMapa() {
    console.log("Construyendo mapa...");
    const mapDiv = document.getElementById("Map");

    if (!mapDiv) {
        console.error("No se encontró el div 'Map'");
        return;
    }

    try {

        map = new google.maps.Map(mapDiv, {
            center: { lat: -17.370700, lng: -66.136969 },
            zoom: 15,
            mapTypeId: 'roadmap'
        });

        BusMarker = new google.maps.Marker({
            position: { lat: -17.370700, lng: -66.136969 },
            map: map,
            icon: CrearIconoBus(),
            title: "Mi bus",
        });

        direccionServicio = new google.maps.DirectionsService();
        direccionRenderizado = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#FF0000",
                strokeWeight: 5
            }
        });
        IniciarSignalR();
        Buscame();
        console.log("Mapa construido correctamente");
    } catch (error) {
        console.error("Error al construir el Mapa: ", error);
    }
}

function Buscame() {
    if (navigator.geolocation) {
        AquiId = navigator.geolocation.watchPosition(ActualizarUbicacion, ErrorGeolocalizacion, {
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 5000
        });
    } else {
        console.warn("Geolocalización no soportada");
        alert("Tu navegador no soporta geolocalización");
    }
}

function checkNearbyPassengers(currentPos) {
    for (const nombre in marcadores) {
        const passengerPos = marcadores[nombre].getPosition();
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentPos.lat, currentPos.lng),
            passengerPos
        );

        if (distance < 100) {
            MostrarBotonRecoger(nombre, passengerPos);
            semaforo = true;
            break;
        }
    }
}

function ActualizarUbicacion(position) {
    const now = Date.now();
    const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: now
    };

    if (lastProcessedPosition && (now - lastProcessedPosition.timestamp < MIN_UPDATE_INTERVAL)) return;

    if (lastProcessedPosition) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(lastProcessedPosition.lat, lastProcessedPosition.lng),
            new google.maps.LatLng(newPos.lat, newPos.lng)
        );
        if (distance < MIN_DISTANCE_CHANGE) return;
    }

    positionHistory.push(newPos);
    if (positionHistory.length > HISTORY_LENGTH) positionHistory.shift();

    const smoothedPos = positionHistory.reduce((acc, pos) => ({
        lat: acc.lat + pos.lat / positionHistory.length,
        lng: acc.lng + pos.lng / positionHistory.length
    }), { lat: 0, lng: 0 });

    if (BusMarker) {
        let currentLatLng = BusMarker.getPosition();
        let currentPos = { lat: currentLatLng.lat(), lng: currentLatLng.lng() };
        animateMarker(currentPos, smoothedPos);
    }

    if (map) map.panTo(smoothedPos);

    if (semaforo) checkNearbyPassengers(smoothedPos);

    lastProcessedPosition = newPos;
}

function animateMarker(fromPos, toPos) {
    const duration = 300;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const lat = fromPos.lat + (toPos.lat - fromPos.lat) * progress;
        const lng = fromPos.lng + (toPos.lng - fromPos.lng) * progress;

        BusMarker.setPosition({ lat, lng });

        if (progress < 1) requestAnimationFrame(animate);
    }

    animate();
}

function MostrarBotonRecoger(nombrePasajero, ubicacion) {
    const boton = document.getElementById("Boton-recoger");
    if (!boton) return console.warn("No se encontró el botón de recoger");

    boton.style.display = "block";
    boton.textContent = `Recoger a ${nombrePasajero}`;
    boton.onclick = () => {
        connection.invoke("RecogerPasajero", nombrePasajero, {
            Latitud: ubicacion.lat(),
            Longitud: ubicacion.lng()
        });
        console.log(`Recogiendo a: ${nombrePasajero}`);
        alert(`Pasajero ${nombrePasajero} recogido`);
        OcultarBotonRecoger();
        semaforo = true;
    };
}

function OcultarBotonRecoger() {
    const boton = document.getElementById("Boton-recoger");
    if (boton) {
        boton.style.display = "none";
        console.log("Botón de recoger ocultado");
    }
}

function ErrorGeolocalizacion(error) {
    console.error("Error en geolocalización: ", error.message);
    alert("Error en tu ubicación: " + error.message);
}

window.onbeforeunload = function () {
    if (AquiId) navigator.geolocation.clearWatch(AquiId);
    if (connection) connection.stop();
    console.log("Conexiones cerradas correctamente");
};

function IniciarSignalR() {
    console.log("Iniciando SignalR...");
    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7210/Conexion/SignalR", {
            withCredentials: true,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("RecibirPasajeros", (nombre, ubicacion) => {
        console.log(`Pasajero recibido: ${nombre}`, ubicacion);
        marcadores[nombre] = new google.maps.Marker({
            position: { lat: ubicacion.latitud, lng: ubicacion.longitud },
            map: map,
            title: nombre,
            icon: "https://maps.google.com/mapfiles/kml/paddle/red-stars.png"
        });
    });

    connection.on("RecogerPasajero", (Nombre, Ubicacion) => {
        console.log("Recogiendo a: ", Nombre, "Ubicacion: ", Ubicacion);

        if (marcadores[Nombre]) {
            marcadores[Nombre].setMap(null);
            delete marcadores[Nombre];
            console.log("Pasajero recogido: ", Nombre);

            if (Object.keys(marcadores).length === 0) {
                console.log("Todos los pasajeros an sido recogidos")

                alert("Todos los pasajeros han sido recogidos");

                const historial = document.getElementById("Div_Historial");
                historial.style.display = "block";
                console.log("Estilo aplicado:", historial.style.display);
            }
        }

        OcultarBotonRecoger();
    });

    connection.start()
        .then(() => console.log("Conexión SignalR establecida"))
        .catch(err => console.error("Error en SignalR:", err.toString()));
}

function CalcularRuta() {
    //Obtener la ubicación del bus
    const busPos = BusMarker.getPosition();

    const puntos = [];

    //obtener ubiaciones de los pasajeros

    for (const nombre in marcadores) {
        const pos = marcadores[nombre].getPosition();
        puntos.push({
            location: pos,
            stopover: true
        });
    }
    //Configurar solicitud de direcciones
    const solicitud = {
        origin: busPos, //Inicio
        destination: busPos, //Final
        waypoints: puntos, //Paradas
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
    };

    //Calcular la ruta
    direccionServicio.route(solicitud, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            //mostrar ruta
            direccionRenderizado.setDirections(response);
            direccionRenderizado.setOptions({
                polylineOptions: {
                    strokeColor: '#4285F4',  // Color azul de Google
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            strokeColor: '#000000',
                            fillColor: '#FFFFFF',
                            fillOpacity: 1,
                            scale: 3
                        },
                        offset: '100%',
                        repeat: '100px'
                    }]
                }
            });
            console.log("Ruta calculada correctamente");

            //obtener la ruta
            const ruta = response.routes[0];
            const distanciaTotal = ruta.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000;
            const tiempoTotal = ruta.legs.reduce((total, leg) => total + leg.duration.value, 0) / 60;

            console.log("Ruta optima: ", distanciaTotal.toFixed(1), "km, ", tiempoTotal.toFixed(1), "minutos");

            const tiempo = document.getElementById("Dato_tiempo");
            tiempo.textContent = `Tiempo estimado: ${tiempoTotal.toFixed(1)} minutos`;
            const distancia = document.getElementById("Dato_distancia");
            distancia.textContent = `Distancia total: ${distanciaTotal.toFixed(1)} km`;
        }
        else {
            console.error('Error al calcular ruta:', status);
            alert('No se pudo calcular la ruta. Error: ' + status);
        }
    });

    semaforo = true;

    const Boton = document.getElementById("BotonCalcular");
    Boton.remove();
}
