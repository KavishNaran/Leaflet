// Store the endpoint Json in a variable
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  Get request to the query the endpoint
d3.json(Url).then(function (data) {
  createFeatures(data.features);
});

// Function to set colors for markers and legend
function getColor(depth) {
    return depth > 90 ? '#034e7b' :
           depth > 70 ? '#0570b0' :
           depth > 50 ? '#3690c0' :
           depth > 30 ? '#74a9cf' :
           depth > 10 ? '#a6bddb' :
           depth > -10 ? '#d0d1e6' :
           '#f1eef6';
};

function createFeatures(earthquakeData) {

  // Function which will run through each item
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.mag)}</p><hr><p>${new Date(feature.geometry.coordinates[2])}</p>`);
  }

  // GeoJSON layer that has the features array on the earthquakeData
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // To create the function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map, set the start point and zoom.
  var myMap = L.map("map", {
    center: [
      30.00, -60
    ],
    zoom: 3.3,
    layers: [street, earthquakes]
  });


  // Create the control layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Legend to the map
  var legend = L.control({position: 'bottomright'});

  // Legend details
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'legend')
    var depth = [-10, 10, 30, 50, 70, 90]
    
  
    div.innerHTML = '<i style="background:White;color:Black;margin:0;padding:10px;border-radius:10px 15px 10 10">Legend (m)</i><br>';
  
      // Loop through the intervals and generate a label with a color for each interval
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
        `<h4 style="background:${getColor(depth[i])}"> ${depth[i]} ${depth[i + 1] ? `&ndash; ${depth[i + 1]}<br>` : '+'}</h4>`;
    }
    return div
  };
  // Add the legend info to the map
  legend.addTo(myMap);
}
// Function which populates the data for the pop up
function createFeatures(eqdata) {
function onEachFeature(feature, layer) {
  layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Depth: ' + (feature.geometry.coordinates[2]) + '</h4><h4>Magnitude ' + feature.properties.mag, {maxWidth: 400})
}

// Set the detials for the bubbles
var layerToMap = L.geoJSON(eqdata, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
      let radius = feature.properties.mag * 4;
      let depth = feature.geometry.coordinates[2];

      return L.circleMarker(latlng, {
          radius: radius,
          color: 'Black',
          fillColor: getColor(depth),
          fillOpacity: 2,
          weight: 1.5
      });
  }
});
createMap(layerToMap);
}



