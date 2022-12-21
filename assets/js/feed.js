window.onload = async () => {
    try {
        let postData = await getFeedData()
        document.getElementById("feed-div").style.display = "block"
        document.getElementById("error-text").style.display = "none"
        console.log(postData)
        generateUI(postData)

    } catch (e) {
        document.getElementById("error-text").innerHTML = `Something went wrong`
    }

}

// FUNCTION TO MAKE CALL TO API GATEWAY TO FETCH ALL POSTS
async function getFeedData() {
    return await sdk.postsGet({}, {}, {}).then(function (res) {
        return res.data.data
    });
}

async function getUser(id){
    return await sdk.usersIdGet({id: id}, {}, {})
}

// FUNCTION TO GET FRIENDS OF USERS
async function getFriendsOfUser(id){
    return await sdk.usersIdFriendsGet({id:id},{},{})
}


function generateUI(data) {
    data.forEach(async obj => {
        let post_time = timeago.format(obj.data.post_time);
        let post_url = window.location.href.substring(0, window.location.href.indexOf("src") + 3)
        let image_url = obj.data.image === null ? "../images/event1.jpeg" : obj.data.image
        let user = await getUser(obj.data.user_id)
        user = user.data.data.first_name + " " + user.data.data.last_name
        let card = ` <div class="card rounded" style="margin-top: 20px;">
                            <div class="card-header">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img class="img-xs rounded-circle p-0"
                                             src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="">
                                        <div class="p-1 mt-3">
                                            <p id="post-by" class="m-0">${user}</p>
                                            <p class="tx-11 text-muted" id="post-time">${post_time}</p>
                                        </div>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a class="dropdown-item" href=${post_url + "/post.html?id=" + obj.data.post_id}>Go to Post</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <p id="post-desc" class="mb-3 tx-14">${obj.data.descr}</p>
                                <img class="img-fluid"  src="${image_url}" alt="">
                            </div>
                            <div class="card-footer">
                                <div class="d-flex post-actions">
                                    <a href="javascript:;" class="d-flex align-items-center text-muted mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="feather feather-heart icon-md">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        <p class="d-none d-md-block ml-2">Like</p>
                                    </a>
                                </div>
                            </div>
                        </div>`

        document.getElementById("posts").innerHTML += card

    })
    

}

