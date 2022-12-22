window.onload = async () => {
    // // window.localStorage["currentUser"]=6
    // window.localStorage.clear()

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params)
    if (params.id !== undefined ) {
        window.localStorage["currentUser"]=params.id
        window.location.href = window.location.href.substring(0, window.location.href.indexOf("com") + 3) + `/src/users.html?id=${params.id}`
    } else {
        if (window.localStorage.getItem("currentUser")) {
            window.location.href = `users.html?id=${window.localStorage.getItem("currentUser")}`
        } else {
            let r = await fetch("https://socialmaps.link/auth/login").then((res) => {
                window.location.href= res.url
            })

        }
    }
}