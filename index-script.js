// constant varabiles
const form = document.querySelector("form");
const url = "https://aqueous-chamber-95142.herokuapp.com/users/khulood-alharbi/posts/";

$(document).ready(function () {

    // Add a click event to <a> in order to navigate to the preview-post webpage
    $("#preview").click(function () {
        $(this).attr('href', "javascript:window.open('preview-post.html','_self')");
    });

    // Add an event listener to the form, in order to add new post to the api
    form.addEventListener("submit", e => {
        e.preventDefault()
        const formElements = e.target.elements
        const title = formElements.title.value
        const body = formElements.body.value
        let image = formElements.image.value
        if (image === "") {
            image = "https://www.pinclipart.com/picdir/big/219-2191136_white-post-it-png-clipart.png"
        }
        const newPost = {
            title: title,
            body: body,
            image: image,
        }
        console.log(newPost)
        createPost(newPost);
    })

    // a function that request a "post" to add a new data to the api
    function createPost(newPost) {
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
            .then(response => {
                if (response.ok)
                    return response.json()
                else
                    throw new Error("Something went wrong!")
            })
            .then(newPost => {
                console.log("new post:", newPost)
                // to refresh the page whitout reloading 
                location.reload(true);
            })
            .catch(err => {
                console.log(err.message)
            })
    }
}); 