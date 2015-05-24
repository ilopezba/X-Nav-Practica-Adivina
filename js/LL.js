jQuery(document).ready(function() {

  
  var map = L.map('map').setView([40.2838, -3.8215], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://           creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);

 /* L.marker([40.2838, -3.8215]).addTo(map)
    .bindPopup('Aulario 3')
    .openPopup();*/

/*map.on('click', function(e) {
    alert(e.lat);
});*/

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("Estas en un radio de: " + radius + " metros").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);
});
