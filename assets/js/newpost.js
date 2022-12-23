window.onload = ()=>{
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params)
    if (!window.localStorage.getItem("currentUser")) {
        window.localStorage.clear()
        window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net/index.html"
    }
    document.getElementById("latitude").value=params.lat
    document.getElementById("longitude").value=params.lng
    document.getElementById("user-nav-link").href = `users.html?id=${window.localStorage.getItem("currentUser")}`
    document.getElementById("submit-button").addEventListener("click",handleSubmit)
    document.getElementById("logout-tab").addEventListener("click", async () => {
        window.localStorage.clear()
        let r = await fetch("https://socialmaps.link/auth/logout").then(res=>{
            window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net/index.html"
        })
    })
}
handleSubmit = async ()=>{
    let post_type = document.getElementById("post-type").value
    let post_desc = document.getElementById("desc").value
    let alert_level = document.getElementById("alert-level").value
    let latitude = document.getElementById("latitude").value
    let longitude = document.getElementById("longitude").value
    let image_url = document.getElementById("image-url").value
    let tags = document.getElementById("tags").value
    tags = "#" + tags.split(",").join(" #")

    data= {
        "user_id":BigInt(window.localStorage.getItem("currentUser")),
        "type":post_type,
        "descr":post_desc,
        "image":image_url,
        "tags":tags,
        "weather":null,
        "likes":0,
        "latitude":parseFloat(latitude),
        "longitude":parseFloat(longitude),
        "alert_level":alert_level

    }
    data= JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
        .replace(/"(-?\d+)n"/g, (_, a) => a)
    console.log(data)
    try {
        let r = await sdk.postsPost({}, data, {"headers": {"Access-Control-Allow-Origin": "*"}})
        console.log(r)
        alert("Post added successfully")
        window.location.href=`map.html`
    }
    catch(e){
        alert("Unable to add post.")
    }
}

