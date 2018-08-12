import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import results from './results.js'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

const normalize = (value, min, max) => (value - min) / (max - min)

const renderMap = (google) => {
  // const sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
  const shoreditch = new google.maps.LatLng(51.5253594,-0.0928388);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: shoreditch,
    zoom: 15,
  });

  const prices = results.map(result => result.Price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  console.log("prices=", prices, maxPrice, minPrice)

  const heatmapData = results.map(result =>  ({
    location: new google.maps.LatLng(result.Lat, result.Lng),
    weight: 100 * normalize(result.Price, minPrice, maxPrice)
  }))

  console.log("heatmapData=", heatmapData)

  const markers = results.map(result => {
    const title = result.Name + " – " + result.Price + " GBP"
    const content = "<span>" + title + "</span>";
    const infowindow = new google.maps.InfoWindow({
        content: content
    })

    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(result.Lat, result.Lng),
        map: map,
        title: title
    })

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker)
    })
    return marker
  })

  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  })
  heatmap.setMap(map)
  heatmap.set('radius', 40)
}

window.renderMap = renderMap
