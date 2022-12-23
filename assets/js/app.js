window.onload = async () => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params)
    if (params.id !== undefined) {
        window.localStorage["currentUser"] = params.id
        window.location.href =`/src/users.html?id=${params.id}`
    } else {
        if (window.localStorage.getItem("currentUser")) {
            window.location.href = `/src/users.html?id=${window.localStorage.getItem("currentUser")}`
        } else {
            window.localStorage.clear()
            let r = await fetch("https://socialmaps.link/auth/login").then((res) => {
                console.log(res.url)
                window.location.href = res.url
            })
        }
    }
}