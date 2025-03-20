mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  zoom: 9,
  center: listing.geometry.coordinates,
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>Welcome to ${listing.title}</h5> `
    )
  )
  .addTo(map);
