
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v11', 
  center: campground.geometry.coordinates,
  zoom: 10, 
  projection: 'globe'
  });

  map.addControl(new mapboxgl.NavigationControl());
//   map.on('style.load', () => {
//   map.setFog({});
//   });

  new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
        .setHTML (
            `<h3> ${campground.title}</h3><P>${campground.location}</p>`
        )
    )
    .addTo(map)