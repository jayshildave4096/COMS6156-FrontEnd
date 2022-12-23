// INITIALIZE AND ADD THE MAP
let POST_MODE = false

async function initMap() {
    if (!window.localStorage.getItem("currentUser")) {
        window.localStorage.clear()
        window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net/index.html"
    }
    document.getElementById("user-nav-link").href = `users.html?id=${window.localStorage.getItem("currentUser")}`
    document.getElementById("logout-tab").addEventListener("click", async () => {
        window.localStorage.clear()
        let r = await fetch("https://socialmaps.link/auth/logout").then(res => {
            window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net/index.html"
        })
    })

    // THE MAP, CENTERED AT NEW YORK
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
    console.log(feedData)
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
        post_url = window.location.href.substring(0, window.location.href.indexOf("src") + 3)
        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setContent(`<h5 id="${data.post_id}" >${data.descr}</h5><br>
                
                <a href=${post_url + "/post.html?id=" + data.post_id} >Take me to post</a>`)
            infoWindow.open(window.map, marker)
        })

        return marker
    })

    new MarkerClusterer(window.map, markers, {minimumClusterSize: 3})

    var controlMarkerUI = document.createElement('DIV');
    controlMarkerUI.style.cursor = 'pointer';
    controlMarkerUI.style.backgroundImage = "https://thenounproject.com/api/private/icons/3874122/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0&token=gAAAAABjpNVjPemQp83-PPcIxCNT0rC-ANZKl4jxSiciUDS2U7WwfGWy5agFFOaP5293EG1aUfFaLv-Evx6pIIFRE7yeCQlnXA%3D%3D";
    controlMarkerUI.style.height = '35px';
    controlMarkerUI.style.width = '50';
    controlMarkerUI.style.top = '11px';
    controlMarkerUI.style.left = '120px';
    controlMarkerUI.title = 'Click to add new post';
    controlMarkerUI.innerHTML = `<button id="newpost" style="margin-top:10px;" class="btn btn-danger">New Post</button>`
    //myLocationControlDiv.appendChild(controlUI);
    document.body.addEventListener("click", handleButtonClick)
    google.maps.event.addListener(window.map, 'click', function (event) {
        if (POST_MODE) {
            let lat = event.latLng.lat()
            let lng = event.latLng.lng()
            window.location.href = `newpost.html?lat=${lat}&lng=${lng}`
        }
    });

    window.map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlMarkerUI);

}

function handleButtonClick(event) {
    if (event.target.id == "newpost") {
        POST_MODE = !POST_MODE
        document.getElementById("newpost").className = POST_MODE ? "btn btn-success" : "btn btn-danger"
        if (POST_MODE) {
            alert("You can now click on the map to start adding a new post")
        }
    }
}

// FUNCTION TO MAKE CALL TO API GATEWAY TO FETCH ALL POSTS
async function getFeedData() {
    return await sdk.postsGet({pagination_flag:"False"}, {pagination_flag:"False"}, {"headers":{"Access-Control-Allow-Origin":"*"}}).then(function (res) {
        return res.data.data
    });
}


window.initMap = initMap;



