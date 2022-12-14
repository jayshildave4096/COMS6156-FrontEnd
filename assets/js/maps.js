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
        let marker_icon = data.type == "ALERT" ? "../images/alert.png" : "../images/marker.png"
        var marker = new google.maps.Marker({
            position: {lat: data.latitude, lng: data.longitude},
            map: window.map,
            animation: google.maps.Animation.DROP,
            icon: {
                size: new google.maps.Size(32, 32),
                scaledSize: new google.maps.Size(32, 32),
                url: marker_icon
            }
        });
        post_url = window.location.href.substring(0,window.location.href.indexOf("src")+3)
        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setContent(`<h5 id="${data.post_id}" >${data.descr}</h5><br>
                
                <a href=${post_url + "/post.html?id=" + data.post_id} >Take me to post</a>`)
            infoWindow.open(window.map, marker)
        })

        return marker
    })

    new MarkerClusterer(window.map, markers, {minimumClusterSize: 3})

}


// function to make call to API Gateway to fetch all posts
async function getFeedData() {
    return await sdk.postsGet({}, {}, {}).then(function (res) {
        return res.data.data
    });
}



window.initMap = initMap;

