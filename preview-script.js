// global variables
let url = "https://aqueous-chamber-95142.herokuapp.com/users/khulood-alharbi/posts/";
const constantUrl = "https://aqueous-chamber-95142.herokuapp.com/users/khulood-alharbi/posts/"
const container = document.querySelector(".container.preview-posts");
const searchInput = document.querySelector('#search-input');
let postId;

$(document).ready(function () {

    // event listener to the srearch input field 
    searchInput.addEventListener('change', searchPosts);

    // view all posts call function
    renderPosts();

    // function that fetchs the url, to get all posts
    async function getPosts() {
        try {
            let response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.log(error.message);
        }
    }

    // function that fetchs the url, to get all comments related to specific post
    async function getComments(e) {
        try {
            postId = e;
            url = constantUrl + postId + "/comments";
            console.log(url)

            let response = await fetch(url);
            return await response.json();

        } catch (error) {
            console.log("Cannot retrieve comments");
        }
    }

    // function that views all posts
    async function renderPosts() {

        let posts = await getPosts();
        posts = posts.posts;
        let postsElements = "";
        let selectedPostId;

        posts.forEach(post => {

            postsElements += `

        <div class="row preview-posts-container" id="${post.id}">
             <div class="row preview-posts">
                  <div class="col-md">
                     <p class="creation-date">Created at: ${post.created_at}</p>
                 </div>
                  <div class="col-md">
                   <p class="update-date"> Modified at: ${post.updated_at}</p>
                </div>
             </div>
             <div class="row preview-posts">
                 <h3 id="field-id" style="display:none">${post.id}</h3>
                 <h3 class="field-title">${post.title}</h3>
             </div>
              <div class="row preview-posts">
                 <img class="field-image" width="200" src="${post.image}">
                 <input class="input-image" type="url" value="${post.image}" style="display:none">
             </div>
             <div class="row preview-posts">
                 <p class="field-body">${post.body}</p>
             </div>
             <div class="row preview-posts">
                 <div class="col-sm">
                     <button class="modify-button fa fa-edit fa-2x" value="${post.id}"></button>
                     <button class="confirm-button" value="${post.id}" style="display:none">confirm</button>
                 </div>
                 <div class="col-sm"> 
                     <button class="delete-button fa fa-close fa-2x" value="${post.id}"></button>    
                     <button class="cancel-button" value="${post.id}" style="display:none">cancel</button>      
                 </div>
            </div>
            <div class="row preview-posts">
                <button class="comment-button" value="${post.id}">Check comments</button>
            </div>
            <div class="row preview-posts comment-container" style="display:none">
                 <div class="row preview-comments">
                      <form autocomplete="off" class="comment-form">
                         <div class="row">
                            <input
                            type="text"
                            name="title"
                            class="title"
                            placeholder="type the title here*"
                            required
                            />
                          </div>
                         <div class="row">
                            <textarea
                            name="body"
                            class="body"
                            cols="30"
                            rows="5"
                            placeholder="type the body here*"
                            ></textarea>
                         </div>
                        <div class="row">
                             <input type="submit" value="Publish" class="comment-submit-button"/>
                        </div>
                    </form>
              </div>
         </div>
        </div><hr>`;

            // append the posts to the div
            container.innerHTML = postsElements;

            // click listner to each button, and call respected function for each
            $(".delete-button.fa.fa-close").click(function (e) {
                selectedPostId = e.target.value;
                deletePost(selectedPostId);
            })

            $(".modify-button.fa.fa-edit").click(function (e) {
                selectedPostId = e.target.value;
                modifyPost(selectedPostId);
            })

            $(".confirm-button").click(function (e) {
                selectedPostId = e.target.value;
                confirmUpdate(selectedPostId);
            })

            $(".cancel-button").click(function (e) {
                selectedPostId = e.target.value;
                cancelUpdate(selectedPostId);
            })

            $(".comment-button").click(function (e) {
                selectedPostId = e.target.value;
                showComments(selectedPostId);
            })
        });
    }


    // a function that delete a post when the user clicks the delete button
    function deletePost(postId) {
        url = constantUrl + postId;

        fetch(url, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok)
                    // to refresh the page whitout reloading 
                    location.reload(true);
                else
                    throw new Error("couldn't delete the post, something went wrong!")
            })
            .catch(err => console.log(err.message))
    }

    // a function that modify the post when the user clicks the modify button
    function modifyPost(postId) {
        const post = document.getElementById(postId);
        let titleInput = post.querySelector(".field-title");
        titleInput.contentEditable = "true";
        let bodyInput = post.querySelector(".field-body");
        bodyInput.contentEditable = "true";

        post.querySelector(".field-image").style.display = "none";
        post.querySelector(".modify-button").style.display = "none";
        post.querySelector(".delete-button").style.display = "none";
        post.querySelector(".input-image").style.display = "block";
        post.querySelector(".cancel-button").style.display = "block";
        post.querySelector(".confirm-button").style.display = "block";
    }

    // a function that update the post when the user clicks confirm button
    function confirmUpdate(postId) {
        const post = document.getElementById(postId)
        let title = post.querySelector(".field-title");
        title = title.textContent;
        let body = post.querySelector(".field-body");
        body = body.textContent;
        let image = post.querySelector(".input-image");
        image = image.value;

        const toBeUpdatedPost = {
            title: title,
            body: body,
            image: image
        }
        updatePost(toBeUpdatedPost, postId);
    }

    // a function that cancel the change made by the user when he/she clicks the cancel button
    function cancelUpdate(postId) {
        const post = document.getElementById(postId)
        post.querySelector(".field-image").style.display = "block";
        post.querySelector(".modify-button").style.display = "block";
        post.querySelector(".delete-button").style.display = "block";
        post.querySelector(".input-image").style.display = "none";
        post.querySelector(".cancel-button").style.display = "none";
        post.querySelector(".confirm-button").style.display = "none";
    }

    // a function that fetch the url with and post the new change of the post
    function updatePost(toBeUpdatedPost, postId) {
        url = constantUrl + postId;

        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(toBeUpdatedPost)
        })
            .then(response => {
                if (response.ok)
                    return response.json()
                else
                    throw new Error("Could not update the post, something went wrong!");
            })
            .then(updatePost => {
                // to refresh the page whitout reloading 
                location.reload(true);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // a function that search a post based on post title entered by the user
    function searchPosts(e) {
        let postTitle = e.target.value;
        // e.target.preventDefault();

        // reset the container
        container.innerHTML = "";
        url = constantUrl + "search/" + encodeURI(postTitle);

        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(posts => {

                posts = posts.posts;
                let postsElements = ""
                posts.forEach(post => {

                    postsElements += `
                <div class="row preview-posts-container" id="${post.id}">
                    <div class="row preview-posts">
                          <h3 class="field-id" style="display:none">${post.id}</h3>
                          <h3 class="field-title">${post.title}</h3>
                    </div>
                    <div class="row preview-posts">
                          <p class="field-body">${post.body}</p>
                    </div>
                    <div class="row preview-posts">
                         <img class="field-image" width="200" src="${post.image}">
                         <input class="input-image" type="url" value="${post.image}" style="display:none">
                    </div>
                    <div class="row preview-posts">
                         <p class="creation date">Created at: ${post.created_at}</p>
                         <p class="update date"> Modified at: ${post.updated_at}</p>
                   </div>
                   <div class="row preview-posts ">
                     <div class="col-sm">
                        <button class="modify-button">modify</button>
                        <button class="confirm-button" style="display:none">confirm</button>
                    </div>
                    <div class="col-sm"> 
                        <button class="delete-button">delete</button>    
                        <button class="cancel-button" style="display:none">cancel</button>      
                    </div>
                 </div>
               </div><hr>`;
                });
                // append data to the div with id "container"
                container.innerHTML += postsElements;
            })
            .catch(err => {
                console.log("Could not find the post you requested!")
            })
    }

    // function that shows all comment related to specific posts when user clicks show comments button
    async function showComments(e) {
        postId = e;
        const container = document.getElementById(postId);
        let commentDiv = container.querySelector(".row.preview-posts.comment-container");
        let html = "";
        let comments = await getComments(postId);

        comments.forEach(comment => {
            html += `
            <div class="row preview-comments" id ="${comment.id}">
            <div class="col-sm"> 
            <h4 class="comment-title">${comment.name}</h4>
            <p class="comment-body">${comment.text}</p>
            </div>
            <div class="col-sm"> 
            <p class="modify-date-comment"> Modified at: ${comment.updated_at}</p>
        </div>
            <div class="row preview-comments">
            </div>
                 <div class="row preview-comments">
                    <div class="col-sm">
                        <button class="modify-comment-button fa fa-edit fa-1x" value="${comment.id}"></button>
                        <button class="confirm-comment-button" value="${comment.id}" style="display:none">confirm</button>
                    </div>
                    <div class="col-sm"> 
                        <button class="delete-comment-button fa fa-close fa-1x" value="${comment.id}"></button>    
                        <button class="cancel-comment-button" value="${comment.id}" style="display:none">cancel</button>      
                     </div>
                </div>
        </div><hr>`;;
        });

        commentDiv.innerHTML += html;

        if (commentDiv.style.display === "none") {
            commentDiv.style.display = "block";
            document.querySelector(".comment-button").innerHTML = "Hide comments";
        }
        else if (commentDiv.style.display === "block") {
            commentDiv.style.display = "none";
            document.querySelector(".comment-button").innerHTML = "Check comments";
             // to refresh the page whitout reloading 
             location.reload(true);
        }

        let commentTitle = container.querySelector(".comment-title");
        let commentBody = container.querySelector(".comment-body");

        $(".delete-comment-button").click(function (e) {
            deleteComment(postId, (e.target.value));
        })

        $(".modify-comment-button").click(function (e) {
            modifyComment((e.target.value));
        })

        $(".cancel-comment-button").click(function (e) {
            cancelComment((e.target.value));
        })

        $(".confirm-comment-button").click(function (e) {
            conformComment(postId, (e.target.value));
        })

        const form = document.querySelectorAll(".comment-form");
        form.forEach(formE => {

       
        formE.addEventListener("submit", e => {
            e.preventDefault()
            const formElements = e.target.elements;
            const title = formElements.title.value;
            const body = formElements.body.value;

            const newComment = {
                name: title,
                text: body,
            }
            console.log(newComment)
            createAComment(newComment);
        })
    })
    }

    // a function that create a new comment
    function createAComment(newComment) {
        url = constantUrl + postId + "/comments";

        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newComment)
        })
            .then(response => {
                if (response.ok)
                    return response.json()
                else
                    throw new Error("Something went wrong!")
            })
            .then(comment => {
                console.log("new comment:", comment);
                // to refresh the page whitout reloading 
                location.reload(true);
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    function modifyComment(e) {
        const commentContainer = document.getElementById(e);
        let commentTitle = commentContainer.querySelector(".comment-title");
        let commentBody = commentContainer.querySelector(".comment-body");
        commentTitle.contentEditable = "true";
        commentBody.contentEditable = "true";

        commentContainer.querySelector(".delete-comment-button").style.display = "none";
        commentContainer.querySelector(".modify-comment-button").style.display = "none";
        commentContainer.querySelector(".cancel-comment-button").style.display = "block";
        commentContainer.querySelector(".confirm-comment-button").style.display = "block";

    }
    function deleteComment(postId, e) {
        url = constantUrl + postId + "/comments/" + e;

        fetch(url, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok)
                    // to refresh the page whitout reloading 
                    location.reload(true);
                else
                    throw new Error("couldn't delete the post, something went wrong")
            })
            .catch(err => console.log(err.message))

    }

    function cancelComment(e) {
        const commentContainer = document.getElementById(e);
        commentContainer.querySelector(".delete-comment-button").style.display = "block";
        commentContainer.querySelector(".modify-comment-button").style.display = "block";
        commentContainer.querySelector(".cancel-comment-button").style.display = "none";
        commentContainer.querySelector(".confirm-comment-button").style.display = "none";
    }

    function conformComment(postId, e) {
        const commentContainer = document.getElementById(e);
        let commentTitle = commentContainer.querySelector(".comment-title");
        let commentBody = commentContainer.querySelector(".comment-body");
        commentTitle = commentTitle.textContent;
        commentBody = commentBody.textContent;

        const toBeUpdatedComment = {
            name: commentTitle,
            text: commentBody,
        }
        url = constantUrl + postId + "/comments/" + e;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(toBeUpdatedComment)
        })
            .then(response => {
                if (response.ok)
                    return response.json()
                else
                    throw new Error("error!!!!")
            })
            .then(updateComment => {
                console.log("updated post:", updateComment)
                // to refresh the page whitout reloading 
                location.reload(true);
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    //end
});