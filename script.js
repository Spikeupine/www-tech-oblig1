const pageLimit = 15;
let page = 1
let maxPageReached = false;

function hideOtherSections(sectionID) {
    var sections = document.getElementsByTagName('section');
    for (var i = 0; i<sections.length; i++) {
        if (sections[i].id === sectionID) {
            sections[i].hidden=false
            sections[i].removeAttribute("hidden")
        } else { 
            sections[i].hidden=true
        }
    }
}



function insertPosts(posts, page) {
    const postSection = document.getElementById("posts");
    if (posts.length === 0) {
        maxPageReached = true
    }
    if(page===1) {
        postSection.innerHTML=""
        maxPageReached = false
    }
    let i = 0
    let rows = postSection.childElementCount
    for(let post of posts) {
        if (i%3 === 0) {
            rows++;
            const emptyRow = document.createElement("div");
            emptyRow.setAttribute("class", "row");
            emptyRow.setAttribute("id", "postrow" + rows);
            postSection.appendChild(emptyRow)
        }
        const currentRow = document.getElementById("postrow" + rows);
        const card = document.createElement("div")
        card.classList.add("thin-column")
        card.classList.add("outline")
        card.id = post.id
        card.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p><p>By with ID: ${post.userId}</p>`
        currentRow.appendChild(card)
        i++
    }
}


function fetchPosts() {
    hideOtherSections("posts");
    if (maxPageReached) {
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageLimit}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Errr fetching external resource: " + response.status);
        }
        return response.json();
    })
    .then(posts => insertPosts(posts, page))
    page++
}


function displayFrontPage() {
    hideOtherSections("landing-page");
}

function initPosts() {
    page = 1
    fetchPosts()
}

function callback() {
    if (document.getElementById("posts").hidden === false) {
        fetchPosts()
    }
}



window.addEventListener("scroll", callback)