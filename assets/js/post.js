
window.onload = async ()=>{
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    try{
        let postData = await getPostData(params['id'])
        console.log(postData.status)
        document.getElementById("post-div").style.display="inline"
        document.getElementById("error-text").style.display="none"
        generateUI(postData)
    }
    catch(e){
        document.getElementById("error-text").innerHTML= `<h3 style="text-align: center">POST NOT FOUND : 404</h3>`
    }


}

// function to make call to API Gateway to fetch all posts
async function getPostData(id) {
    return await sdk.postsIdGet({id:parseInt(id)}, {}, {}).then(function (res) {
        return res.data.data
    });
}

function generateUI(data){

    let title = document.getElementById("post-title")
    title.innerHTML = data.descr

    let postData= document.getElementById("post-date")
    postData.innerHTML = `Posted on ${data.post_time}`

    let tags = document.getElementById("post-tags")
    data.tags= data.tags.split("#")
    let tagHTML = ""
    data.tags.forEach(tag => {
        if(tag !== "")
         tagHTML += `<span class="badge badge-pill bg-primary badge-primary">#${tag}</span>   `
    })
    tags.innerHTML=tagHTML

    let description = document.getElementById("post-desc")
    description.innerHTML= `<p>${data.descr}</p>`

}
