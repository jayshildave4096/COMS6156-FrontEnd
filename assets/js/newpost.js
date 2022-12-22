window.onload = ()=>{

    document.getElementById("submit-button").addEventListener("click",handleSubmit)
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
    console.log(tags)
    data= {
        "user_id":BigInt(window.localStorage.getItem("currentUser")),
        "type":post_type,
        "descr":post_desc,
        "image":image_url,
        "tags":tags,
        "weather":null,
        "likes":0,
        "latitude":parseInt(latitude),
        "longitude":parseInt(longitude),
        "alert_level":alert_level

    }
    data= JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
        .replace(/"(-?\d+)n"/g, (_, a) => a)
    console.log(data)
    try {
        let r = await sdk.postsPost({}, data, {"headers": {"Access-Control-Allow-Origin": "*"}})
        console.log(r)
        alert("Post added successfully")
        window.location.href=`users.html?id=${window.localStorage['currentUser']}`
    }
    catch(e){
        alert("Unable to add post.")
    }
}

