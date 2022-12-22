window.onload = async () => {
    if (!window.localStorage.getItem("currentUser")) {
        window.localStorage.clear()
        window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net"

    }
    document.getElementById("user-nav-link").href = `users.html?id=${window.localStorage.getItem("currentUser")}`
    document.getElementById("logout-tab").addEventListener("click", () => {
        window.localStorage.clear()
        window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net"
    })
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    try {
        let postData = await getPostData(params['id'])
        console.log(postData)
        document.getElementById("post-div").style.display = "inline"
        document.getElementById("error-text").style.display = "none"
        generateUI(postData)
    } catch (e) {
        document.getElementById("error-text").innerHTML = `<h3 style="text-align: center">POST NOT FOUND : 404</h3>`
    }


}

// FUNCTION TO MAKE CALL TO API GATEWAY TO FETCH ALL POSTS
async function getPostData(id) {
    return await sdk.postsIdGet({id: parseInt(id)}, {}, {}).then(function (res) {
        return res.data.data
    });
}

function generateUI(data) {

    let title = document.getElementById("post-title")
    title.innerHTML = data.descr

    let postData = document.getElementById("post-date")
    postData.innerHTML = `Posted on ${data.post_time}`

    let tags = document.getElementById("post-tags")
    if (data.tags) {
        data.tags = data.tags.split("#")
        let tagHTML = ""
        data.tags.forEach(tag => {
            if (tag !== "")
                tagHTML += `<span class="badge badge-pill bg-primary badge-primary">#${tag}</span>   `
        })
        tags.innerHTML = tagHTML
    }

    let description = document.getElementById("post-desc")
    description.innerHTML = `<p>${data.descr}</p>`

    let image_url = document.getElementById("post-img")

    image_url.src = data.image === null ? (data.type === "USER_POST" ? "../images/event1.jpeg" : "../images/event2.jpeg") : data.image

}

