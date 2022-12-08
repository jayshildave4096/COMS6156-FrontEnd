// Initialize and add the map
async function initMap() {
    // The map, centered at New York
    const initial_coords = {lat: 40.7128, lng: -74.0060};
    const infoWindow = new google.maps.InfoWindow()
    window.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        mapId: "78f59b7981aa934e",
        center: initial_coords,

    });

    // FETCH THE CURRENT LOCATION OF USER
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            map.setCenter(initialLocation)
        });
    }

    // FETCH ALL POSTS
    let feedData = await getFeedData();

    // GENERATE MARKERS FOR POSTS
    const markers = feedData.map(post => {
        let data = post.data

        var marker = new google.maps.Marker({
            position: {lat: data.latitude, lng: data.longitude},
            map: window.map,
            icon: {
                url: data.type == "ALERT" ? "http://maps.google.com/mapfiles/kml/pal3/icon33.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
        });

        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setContent(`<a href='/post/${data.post_id}'>${data.descr}</a>`)
            infoWindow.open(window.map, marker)
        })
        return marker
    })


}


// function to make call to API Gateway to fetch all posts
async function getFeedData() {
    return await sdk.postsGet({}, {}, {}).then(function (res) {
        return res.data.data
    });
}

window.initMap = initMap;