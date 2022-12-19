async function initUser() {
    const user_id = 6;
    console.log(user_id);

    // FETCH THE CURRENT USER
    let userData = await getUserData(user_id);
    let userFriends = await getUserFriends(user_id);
    console.log(userData);
    console.log(userFriends);
    let user_first_name = userData['first_name'];
    let user_last_name = userData['last_name'];
    let user_email = userData['email'];
    let user_address = userData['address'];
    var div_welcome = document.getElementById('Name');
    div_welcome.innerHTML += user_first_name + ' ' + user_last_name;
    var div_welcome = document.getElementById('profile_name');
    div_welcome.innerHTML += user_first_name + ' ' + user_last_name;
    var div_email = document.getElementById('Email');
    div_email.innerHTML += user_email
    var div_address = document.getElementById('Address');
    div_address.innerHTML += user_address
    let friends_list = document.getElementById("friends");
    userFriends.forEach((item)=>{
        if(item.data) {
            let a = document.createElement("a");
            let friend_details = item.data.data
            console.log(friend_details);
            a.innerText = friend_details['first_name'] + ' ' + friend_details['last_name'];
            a.href = "#";
            friends_list.appendChild(a);
        }
      })

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

window.onload = initUser;
