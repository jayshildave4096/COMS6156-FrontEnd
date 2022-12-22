async function initUser() {

    if (!window.localStorage.getItem("currentUser")) {
        window.localStorage.clear()
        window.location.href = "http://socialmaps.s3-website-us-east-1.amazonaws.com"

    }

    const user_id = get_id();
    console.log(user_id);
    if (user_id == -1) {
        alert("No User Found")
        window.localStorage.clear()
        window.location.href = "http://socialmaps.s3-website-us-east-1.amazonaws.com"
    } else {
        window.localStorage["currentUser"] = user_id
    }

    document.getElementById("user-nav-link").href = `users.html?id=${user_id}`
    // document.getElementById("logout-tab").addEventListener("click", () => {
    //     window.localStorage.clear()
    //     window.location.href = "http://socialmaps.s3-website-us-east-1.amazonaws.com"
    // })

    // FETCH THE CURRENT USER

    let userData = await getUserData(user_id);
    let userFriends = await getUserFriends(user_id);
    let userPosts = await getUserPosts(user_id);
    console.log(userData);
    console.log(userFriends);
    console.log(userPosts);
    let user_first_name = userData['first_name'];
    let user_last_name = userData['last_name'];
    let user_email = userData['email'];
    let user_address = userData['address'];
    let user_image_url = userData['img_url'] ? userData['img_url'] : `https://www.bootdey.com/img/Content/avatar/avatar${Math.floor(Math.random() * 8 + 1)}.png`
    var div_welcome = document.getElementById('Name');
    div_welcome.innerHTML += user_first_name + ' ' + user_last_name;
    var div_welcome = document.getElementById('profile_name');
    div_welcome.innerHTML += user_first_name + ' ' + user_last_name;
    var div_email = document.getElementById('Email');
    div_email.innerHTML += user_email
    var div_address = document.getElementById('Address');
    div_address.innerHTML += user_address
    let friends_list = document.getElementById("friends");
    document.getElementById("user-image").src = user_image_url
    userFriends.forEach((item) => {
        if (item.data) {
            let a = document.createElement("a");
            let friend_details = item.data.data
            console.log(friend_details);
            a.innerText = friend_details['first_name'] + ' ' + friend_details['last_name'];
            a.href = "users.html?id=" + friend_details.id;
            friends_list.appendChild(a);
        }
    })
    generatePostsUI(userPosts, user_image_url);
}


async function getUserData(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdGet(params, {}, {}).then(function (res) {
        console.log(res)
        return res.data.data
    });
}

async function getUserFriends(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdFriendsGet(params, {}, {}).then(function (res) {
        console.log(res)
        return res.data
    });
}

async function getUserPosts(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdPostsGet(params, {}, {}).then(function (res) {
        console.log(res)
        return res.data
    });
}

function get_id() {
    var currentUrl = window.location.href;
    var tagLocation = currentUrl.indexOf("=");
    console.log(tagLocation);
    if (tagLocation < 0) {
        console.warn("no id could be found");
        return -1;
    } else {
        return currentUrl.substr(tagLocation + 1);
    }
}

async function getUser(id) {
    return await sdk.usersIdGet({id: id}, {}, {})
}

function generatePostsUI(data, user_image_url) {
    data.forEach(async obj => {
        let post_time = timeago.format(obj.data.post_time);
        let post_url = window.location.href.substring(0, window.location.href.indexOf("src") + 3)
        let user = await getUser(obj.data.user_id)
        user = user.data.data.first_name + " " + user.data.data.last_name
        let card = ` <div class="card rounded" style="margin-top: 20px;">
        <div class="card-header">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img class="img-xs rounded-circle p-0"
                         src="${user_image_url}" alt="">
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
            <img class="img-fluid" src="../images/event1.jpeg" alt="">
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

window.onload = initUser;
