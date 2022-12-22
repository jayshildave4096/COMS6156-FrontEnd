window.onload = async () => {
    try {

        if (!window.localStorage.getItem("currentUser")) {
            window.localStorage.clear()
            window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net"
        }
        document.getElementById("user-nav-link").href = `users.html?id=${window.localStorage.getItem("currentUser")}`
        document.getElementById("logout-tab").addEventListener("click", () => {
            window.localStorage.clear()
            window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net"
        })
        let postData = await getFeedData()
        let currentUserID = window.localStorage.getItem("currentUser")
        document.getElementById("feed-div").style.display = "block"
        document.getElementById("error-text").style.display = "none"
        console.log("POSTS", postData)
        generateUI(postData)
        let friendsData = await getFriendsOfUser(currentUserID)
        console.log("FRIENDS", friendsData)
        let allUsers = await getAllUsers()
        console.log("USERS", allUsers)
        generateFriendsUI(friendsData, allUsers)

    } catch (e) {
        console.log(e)
        document.getElementById("error-text").innerHTML = `Something went wrong`
    }

}

// FUNCTION TO MAKE CALL TO API GATEWAY TO FETCH ALL POSTS
async function getFeedData() {
    return await sdk.postsGet({}, {}, {}).then(function (res) {

        return res.data.data
    });
}

// FUNCTION TO GET FRIENDS OF USERS
async function getFriendsOfUser(id) {
    // TODO : add dynamic ID
    return await sdk.usersIdFriendsGet({id: id}, {}, {}).then(function (res) {
        return res.data
    });
}

// FUNCTION TO MAKE CALL TO API GATEWAY TO FETCH ALL USERS
async function getAllUsers() {
    return await sdk.usersGet({}, {}, {}).then(function (res) {
        return res.data
    });
}

//FUNCTION TO GET USER DETAILS
async function getUser(id) {
    return await sdk.usersIdGet({id: id}, {}, {})
}

//FUNCTION FOLLOW FRIEND
window.followFriend = async (event) => {
    if (event.target.id.startsWith("user")) {
        let currentUser = window.localStorage.getItem("currentUser")
        let id = event.target.id.substring(5, event.target.id.length)

        try {
            await sdk.usersIdFriendsPost({id: currentUser}, {id: id}, {})
            alert("Friend added Successfully")
            window.location.reload()
        } catch (e) {
            alert("Something went wrong")
        }


    }
}

function generateUI(data) {
    data.forEach(async obj => {
        let post_time = timeago.format(obj.data.post_time);
        let post_url = window.location.href.substring(0, window.location.href.indexOf("src") + 3)

        let user = await getUser(obj.data.user_id)
        let user_image_url = user.data.data.img_url ? user.data.data.img_url : `https://www.bootdey.com/img/Content/avatar/avatar${Math.floor(Math.random() * 8 + 1)}.png`
        userName = user.data.data.first_name + " " + user.data.data.last_name

        let post_image_url = obj.data.image === null ? obj.data.type === "USER_POST" ? "../images/event1.jpeg" : "../images/event2.jpeg" : obj.data.image
        let card = ` <div class="card rounded" style="margin-top: 20px;">
                            <div class="card-header">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img class="img-xs rounded-circle p-0"
                                             src="${user_image_url}" alt="">
                                        <div class="p-1 mt-3">
                                            <p id="post-by" class="m-0"><a href="${post_url + "/users.html?id=" + user.data.data.id}">${userName}</a></p>
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
                                <img class="img-fluid" src="${post_image_url}" alt="">
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

function generateFriendsUI(friends, users) {
    let friendIds = []
    let cards = []
    friends.forEach(obj => {
        friendIds.push(obj.data.data.id)
    })
    users.forEach(obj => {
        if (!friendIds.includes(obj.data.id) && obj.data.id !== window.localStorage.getItem("currentUser")) {
            let user_url = window.location.href.substring(0, window.location.href.indexOf("src") + 3) + "/users.html?id=" + obj.data.id
            let image_url = obj.data.img_url ? obj.data.img_url : `https://www.bootdey.com/img/Content/avatar/avatar${Math.floor(Math.random() * 8 + 1)}.png`
            let body = `<div  id="friends" class="d-flex justify-content-between mb-2 pb-2 border-bottom"><div class="d-flex align-items-center hover-pointer">
                                        <img class="img-xs rounded-circle"
                                             src="${image_url}" alt="">
                                        <div class="ml-2 p-1 mt-3">
                                            <p><a href="${user_url}">${obj.data.first_name + " " + obj.data.last_name}</a></p>

                                        </div>
                                    </div>
                                    <button id="user-${obj.data.id}"  class="btn btn-icon">
                                        <svg  id="user-${obj.data.id}" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="feather feather-user-plus" data-toggle="tooltip" title=""
                                             data-original-title="Connect">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <line x1="20" y1="8" x2="20" y2="14"></line>
                                            <line x1="23" y1="11" x2="17" y2="11"></line>
                                        </svg>
                                    </button></div>`
            cards.push(body)
            document.body.addEventListener("click", followFriend)

        }

    })
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    cards = shuffled.slice(0, 5);

    document.getElementById("friends").innerHTML += cards.join(" ")
    return cards
}



