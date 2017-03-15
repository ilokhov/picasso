window.onload = function() {
  var circles = new L.LayerGroup();

  var circleGroupOne = new L.LayerGroup({
    time: "1918",
  }).addTo(circles);

  var circleGroupTwo = new L.LayerGroup({
    time: "1920",
  }).addTo(circles);



  var circleOne = L.circle([40.415916, -3.703578], {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.5,
      radius: 50000,
      // time: "1922",
  }).addTo(circleGroupOne);

  var circleTwo = L.circle([40.715721, -74.026105], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 50000,
      // time: "1918",
  }).addTo(circleGroupOne);






  var circleThree = L.circle([40.415916, -3.703578], {
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.5,
      radius: 50000,
      // time: "1920",
  }).addTo(circleGroupTwo);

  var circleFour = L.circle([40.715721, -74.026105], {
      color: 'purple',
      fillColor: 'purple',
      fillOpacity: 0.5,
      radius: 50000,
      // time: "1920",
  }).addTo(circleGroupTwo);







  var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWxva2hvdiIsImEiOiJjajBhN2VyaTkwMDNxMndsazNhbnZxN2pjIn0.0WeQwRSqxMqNjIUSSFOy5Q';
  var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>';

  var grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});




  var map = L.map('map', {
    center: [51.505, -20.09],
    zoom: 3,
    layers: [grayscale, circles],
  });



  var sliderControl = L.control.sliderControl({
    position: "bottomleft",
    layer: circles,
    timeStrLength: 5,
    alwaysShowDate: true,
    minValue: 0,
    maxValue: 10000,
  });
  map.addControl(sliderControl);
  sliderControl.startSlider();



};


