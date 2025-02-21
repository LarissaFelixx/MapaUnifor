let map;
let darkMode = false; // Estado inicial do modo escuro
let markers = []; // Lista de marcadores

// Estilos para Dark Mode
const darkModeStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

function initMap() {
    const uniforLocation = { lat: -3.770733, lng: -38.478258 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: uniforLocation,
    });

    // Adicionar marcador inicial
    const initialMarker = new google.maps.Marker({
        position: uniforLocation,
        map: map,
        title: "Universidade de Fortaleza - UNIFOR",
        draggable: true // Agora o pino pode ser movido
    });

    // Evento para atualizar coordenadas quando o pino for movido
    google.maps.event.addListener(initialMarker, 'dragend', function (event) {
        updateMarkerPosition(0, event.latLng.lat(), event.latLng.lng());
    });

    markers.push({ marker: initialMarker, title: "Universidade de Fortaleza - UNIFOR" });
    updateMarkerList();

    document.getElementById("toggleMode").addEventListener("click", toggleMapMode);
}

// Alternar entre Light e Dark Mode
function toggleMapMode() {
    darkMode = !darkMode;

    map.setOptions({
        styles: darkMode ? darkModeStyle : []
    });

    document.body.classList.toggle("dark-mode");

    // Alterar o emoji do botão
    const modeButton = document.getElementById("toggleMode");
    modeButton.innerText = darkMode ? "☀️" : "🌙";
}

function addMarker() {
    const lat = parseFloat(document.getElementById("latitude").value);
    const lng = parseFloat(document.getElementById("longitude").value);
    const title = document.getElementById("title").value.trim() || "Marcador";

    if (isNaN(lat) || isNaN(lng)) {
        alert("Latitude e Longitude devem ser números válidos.");
        return;
    }

    // Criar um novo marcador ARRÁSTAVEL
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title,
        draggable: true
    });

    const markerIndex = markers.length;

    // Evento para atualizar coordenadas quando o pino for movido
    google.maps.event.addListener(marker, 'dragend', function (event) {
        updateMarkerPosition(markerIndex, event.latLng.lat(), event.latLng.lng());
    });

    markers.push({ marker, title });
    updateMarkerList();
    map.setCenter({ lat, lng });
}

// Atualiza a lista de marcadores
function updateMarkerList() {
    const markerList = document.getElementById("markerList");
    markerList.innerHTML = "";

    markers.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.title} (Lat: ${item.marker.getPosition().lat().toFixed(6)}, Lng: ${item.marker.getPosition().lng().toFixed(6)}) 
            <button onclick="removeMarker(${index})">❌</button>`;
        markerList.appendChild(li);
    });
}

// Atualiza a posição do marcador quando ele é movido
function updateMarkerPosition(index, newLat, newLng) {
    markers[index].marker.setPosition({ lat: newLat, lng: newLng });
    updateMarkerList(); // Atualiza a exibição na tela
}

// Remove um marcador da lista e do mapa
function removeMarker(index) {
    markers[index].marker.setMap(null);
    markers.splice(index, 1);
    updateMarkerList();
}
