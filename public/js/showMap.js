
mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
// container: 'map', // container ID
// style: 'mapbox://styles/mapbox/streets-v11', // style URL
// center: [-122.420679, 37.772537], // starting position [lng, lat]
// zoom: 6, // starting zoom
// });
// map.on('style.load', () => {
// map.setFog({}); // Set the default atmosphere style
// });

// new mapboxgl.Marker()
//     .setLngLat(gymlocation.geometry.coordinates)
//     .addTo(map)




mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: gymlocation.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(gymlocation.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${gymlocation.title}</h4><p>${gymlocation.location}</p>`
            )
    )
    .addTo(map)