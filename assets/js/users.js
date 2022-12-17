async function initUser() {
    const user_id = 6;
    console.log(user_id);

    // FETCH THE CURRENT USER
    let userData = await getUserData(user_id);
    console.log(userData);
    let user_first_name = userData['first_name'];
    let user_email = userData['email'];
    let user_address = userData['address'];
    var div_welcome = document.getElementById('welcome');
    div_welcome.innerHTML += 'Hello ' + user_first_name
    var div_email = document.getElementById('email');
    div_email.innerHTML += 'Email: ' + user_email
    var div_address = document.getElementById('address');
    div_address.innerHTML += 'Address: ' + user_address
}


// function to make call to API Gateway to fetch all posts
async function getUserData(user_id) {
    var params = {id: user_id}
    return await sdk.usersIdGet(params, {}, {}).then(function (res) {
        console.log(res)
        return res.data.data
    });
}

window.onload = initUser;