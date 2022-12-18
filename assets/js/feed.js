
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

function generateUI(data) {
    let HTML = ""
    data.forEach(obj => {
        let post_time = timeago.format(obj.data.post_time);
        let card = ` <div class="card rounded" style="margin-top: 20px;">
                            <div class="card-header">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img class="img-xs rounded-circle p-0"
                                             src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="">
                                        <div class="p-1 mt-3">
                                            <p id="post-by" class="m-0">Mike Popescu</p>
                                            <p class="tx-11 text-muted" id="post-time">${post_time}</p>
                                        </div>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a class="dropdown-item" href="">Go to Post</a></li>
                                            <li><a class="dropdown-item" href="#">Delete</a></li>
                                            <li><a class="dropdown-item" href="#">Unfollow</a></li>
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

        HTML += card
    })
    document.getElementById("posts").innerHTML += HTML
}
