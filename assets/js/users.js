

async function initUser() {

    const user_id = get_id();
    let URL_user;
    console.log(user_id);
    if (user_id == -1) {
        alert("No User Found")
        window.localStorage.clear()
        window.location.href = "https://d1kit0w7dgvwzq.cloudfront.net/index.html"
    }
    else{
        if(!window.localStorage.getItem('currentUser')){
            window.localStorage['currentUser']=user_id
        }
        URL_user=user_id
    }


    document.getElementById("user-nav-link").href = `users.html?id=${user_id}`

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
            let friend_details = item.data.data
            let card = ` 
                                        <li  class="p-2 list-group-item list-group-item-action">
                                        <div class="row">
<div class="col-11"><a href="${"users.html?id=" + friend_details.id}">${friend_details['first_name'] + ' ' + friend_details['last_name']}</a>
</div>
<div class="col-1">
<span class="pull-right">${URL_user===window.localStorage['currentUser']?`<button id="friend_id-${friend_details.id}" class="unfollow-button btn btn-warning mr-2 ">Unfollow</button>`: ""}</span>
</div>
</div>
                </li>
                                    `
            friends_list.innerHTML += card;
        }
    })
    generatePostsUI(userPosts, user_image_url);
    document.getElementById("newpost-button").addEventListener("click", () => {
        window.location.href = "newpost.html"
    })
    document.body.addEventListener("click", handleUnfollow)
}


async function getUserData(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdGet(params, {}, {}).then(function (res) {
        return res.data.data
    });
}

async function getUserFriends(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdFriendsGet(params, {}, {}).then(function (res) {
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

async function handleUnfollow(event) {
    if (URL_user === window.localStorage['currentUser']) {
        if (event.target.id.startsWith("friend_id")) {
            let currentUser = window.localStorage['currentUser']
            let id = event.target.id.substring(10)
            try {
                let r = await sdk.usersIdFriendsDelete({id: currentUser}, {id: id}, {})
                alert("Friend Unfollowed Successfully")
                location.reload()
            } catch (e) {
                alert("Could not Unfollow Friend")
            }

        }
    }
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
