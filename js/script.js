window.onload = function() {
  var circles = new L.LayerGroup();


  var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50000
  }).addTo(circles);

  var circleTwo = L.circle([51.508, -10.11], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 50000
  }).addTo(circles);



  var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWxva2hvdiIsImEiOiJjajBhN2VyaTkwMDNxMndsazNhbnZxN2pjIn0.0WeQwRSqxMqNjIUSSFOy5Q';
  var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>';

  var grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});




  var map = L.map('map', {
    center: [51.505, -20.09],
    zoom: 3,
    layers: [grayscale, circles]
  });



};


