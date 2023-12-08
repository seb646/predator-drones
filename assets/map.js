const map = L.map('map', { 
    zoomControl: false,
    minZoom: 5, 
}).setView([39, -98], 5);

var northAmericaBounds = L.latLngBounds(
    L.latLng(14.92, -169.05), // Southwest corner (bottom-left)
    L.latLng(83.14, -34.56)   // Northeast corner (top-right)
);

// Restrict the map bounds to North America
map.setMaxBounds(northAmericaBounds);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

var cbpIcon = L.icon({
    iconUrl: 'assets/images/cbp.svg',
    iconSize: [20, 20],
});
var militaryIcon = L.icon({
    iconUrl: 'assets/images/usaf.svg',
    iconSize: [30, 20],
});
var nasaIcon = L.icon({
    iconUrl: 'assets/images/nasa.svg',
    iconSize: [20, 20],
});
var surveillanceIcon = L.icon({
    iconUrl: 'assets/images/surveillance.svg',
    iconSize: [20, 20],
});
var arrestIcon = L.icon({
    iconUrl: 'assets/images/arrest.svg',
    iconSize: [20, 20],
});
var weatherIcon = L.icon({
    iconUrl: 'assets/images/weather.svg',
    iconSize: [20, 20],
});
var sarIcon = L.icon({
    iconUrl: 'assets/images/sar.svg',
    iconSize: [20, 20],
});
var crashIcon = L.icon({
    iconUrl: 'assets/images/crash.svg',
    iconSize: [20, 20],
});

var activeCircle;
var activeRoute;

for(n in locations){
    var plane_distance = false; 
    if(locations[n].icon == "cbp"){
        var marker_icon = cbpIcon
    }else if(locations[n].icon == "military"){
        var marker_icon = militaryIcon
    }else if(locations[n].icon == "nasa"){
        var marker_icon = nasaIcon
    }else if(locations[n].icon == "surveillance"){
        var marker_icon = surveillanceIcon
        var route_color = "#d00f10"
    }else if(locations[n].icon == "arrest"){
        var marker_icon = arrestIcon
        var route_color = "#000000"
    }else if(locations[n].icon == "weather"){
        var marker_icon = weatherIcon
        var route_color = "#7e4de5"
    }else if(locations[n].icon == "sar"){
        var marker_icon = sarIcon
        var route_color = "#dd3428"
    }else if(locations[n].icon == "crash"){
        var marker_icon = crashIcon
        var route_color = "#FF8000"
    }

    var popup_content = "<img class='popup-icon' src='" + marker_icon.options.iconUrl + "'> <h2>" + locations[n].name + "</h2>";

    if(locations[n].description){
        popup_content = popup_content + "<p>" + locations[n].description + "</p>";
    }
    
    if(locations[n].equipment){
        for(p in locations[n].equipment){
            if(locations[n].equipment[p].includes("MQ-9")){
                plane_distance = 1900000;
            }else if(locations[n].equipment[p].includes("MQ-1")){
                plane_distance = 1250000;
            }
        }
    }

    if(plane_distance){
        var range_km = plane_distance / 1000;
        var range_mi = Math.round(plane_distance / 1609.34);
        popup_content = popup_content + "<p><b>Drone Range:</b> " + range_mi + "mi (" + range_km + "km)</p>" ;
    }

    var marker = L.marker(locations[n].coordinates, { icon: marker_icon })
        .addTo(map)
        .bindPopup(popup_content);

    if(locations[n].from){
        console.log(locations[n].from)
        var routeStart = new L.LatLng(locations[n].from[0], locations[n].from[1]);
        var routeEnd = new L.LatLng(locations[n].coordinates[0], locations[n].coordinates[1]); 
        var routeCoods = [routeStart, routeEnd];

        var route = new L.Polyline(routeCoods, {
            color: route_color,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });

        (function (currentMarker, currentRoute) {
            currentMarker.getPopup().on('add', function() {
                if(activeRoute){
                    map.removeLayer(activeRoute);
                }
                currentRoute.addTo(map);
                activeRoute = currentRoute;
            });
        })(marker, route);
    }
    
    if(plane_distance){
        var circle = L.circle(locations[n].coordinates, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: plane_distance
        });

        (function (currentMarker, currentCircle) {
            currentMarker.getPopup().on('add', function() {
                if(activeCircle){
                    map.removeLayer(activeCircle);
                }
                currentCircle.addTo(map);
                activeCircle = currentCircle;
            });
            // currentMarker.getPopup().on('remove', function() {
            //     map.removeLayer(currentCircle);
            // });
        })(marker, circle);
    }
}

map.on('click', function () {
    // Remove the active circle if it exists
    if (activeCircle) {
        map.removeLayer(activeCircle);
        activeCircle = null; // Reset the active circle
    }
    if (activeRoute) {
        map.removeLayer(activeRoute);
        activeRoute = null; // Reset the active circle
    }
});

var patrolContent = "<p>This is an <em>approximated</em> patrol route of U.S. Customs & Border Enforcement MQ-9 Predator drones. It is based on flight path data collected from various CBP drones between 2019-2020, which was aggregated in a <a href='https://gizmodo.com/we-mapped-where-customs-and-border-protection-drones-ar-1843928454'>Gizmodo article</a> by Tom McKay and Dhruv Mehrotra.<br><br>An <a href='https://dhruvmehrotra3.users.earthengine.app/view/drones'>interactive map</a> produced by Tom McKay and Dhruv Mehrotra allows a direct examination of actual CBP drone flight paths.</p>";

var southA = new L.LatLng(33.934245, -118.223877);
var southB = new L.LatLng(31.587894, -110.346937);
var southC = new L.LatLng(31.356092, -100.499496);
var southD = new L.LatLng(27.692154, -97.288527);
var southE = new L.LatLng(26.076521, -96.503906);
var southF = new L.LatLng(26.70636, -98.964844);
var southG = new L.LatLng(28.285033, -100.074463);
var southH = new L.LatLng(29.802518, -101.162109);
var southI = new L.LatLng(29.831114, -102.678223);
var southJ = new L.LatLng(29.104177, -103.19458);
var southK = new L.LatLng(30.595366, -104.699707);
var southBorder = [southA, southB, southC, southD, southE, southF, southG, southH, southI, southJ, southK, southC, southI, southH, southC, southG, southC, southF, southD, southG, southD, southH];

var southBorderPatrol = new L.Polyline(southBorder, {
    color: '#226633',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
}).addTo(map).bindPopup(
    "<img class='popup-icon' src='assets/images/cbp.svg'> <h2>Patrol Route: US-Mexico border</h2>" + patrolContent
);

var northA = new L.LatLng(47.958376, -97.400923);
var northB = new L.LatLng(48.927462, -106.304741);
var northC = new L.LatLng(48.847547, -102.722168);
var northD = new L.LatLng(48.847547, -99.997559);
var northE = new L.LatLng(48.847547, -98.547363);
var northF = new L.LatLng(48.847547, -97.218018);
var northG = new L.LatLng(48.847547, -95.769196);
var northH = new L.LatLng(48.603858, -94.54834)
var northI = new L.LatLng(47.768868, -90.32959);
var northJ = new L.LatLng(48.188979, -93.795776); 
var northK = new L.LatLng(47.888723, -94.336853);
var northBorder = [northA, northB, northC, northD, northE, northF, northG, northH, northI, northJ, northA, northB, northA, northC, northA, northD, northA, northE, northA, northF, northA, northG, northA, northH, northA, northK, northJ];

var northBorderPatrol = new L.Polyline(northBorder, {
    color: '#226633',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
}).addTo(map).bindPopup(
    "<img class='popup-icon' src='assets/images/cbp.svg'> <h2>Patrol Route: US-Canada border</h2>" + patrolContent
);

// function onMapClick(e) {
// 	L.popup()
// 		.setLatLng(e.latlng)
// 		.setContent(`You clicked the map at ${e.latlng.toString()}`)
// 		.openOn(map);
// }

// map.on('click', onMapClick);