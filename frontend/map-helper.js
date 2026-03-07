let map;
let markers = {};

window.initMap = () => {
    map = L.map('map-container').setView([20.5937, 78.9629], 5); // Default India view?
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
};

window.addFriendMarker = (lat, lon, username) => {
    if (markers[username]) {
        map.removeLayer(markers[username]);
    }
    markers[username] = L.marker([lat, lon]).addTo(map)
        .bindPopup('<b>' + username + '</b>');
};

window.updateMyLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map)
                .bindPopup('<b>Your Location</b>').openPopup();

            // Notify server via RPC?
            // In a real project, we would used client-server callbacks
            // this.$server.locationUpdated(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
