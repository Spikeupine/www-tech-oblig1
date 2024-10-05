const pageLimit = 15;
let page = 1
let maxPageReached = false;
let continuesPoling = true
let cities = {
    "Oslo": {
        latitude: "59.91273",
        longitude:"10.74609",
    },
    "Stockholm": {
        latitude: "59.32938", 
        longitude:"18.06871",
    },
    "Helsinki": {
        latitude: "60.16952",
        longitude:"24.93545",}
    ,
    "Copenhagen": {
        latitude: "55.67594",
        longitude:"12.56553",
    },
    "Reykjavik": {
        latitude: "64.13548",
        longitude:"-21.89541",
    }
}


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

function scrollCallback() {
    if (document.getElementById("posts").hidden === false) {
        fetchPosts()
    }
}

function displayWeatherData(city, weatherData) {
    const parentNode = document.getElementById("weatherData");
    let weatherCard = parentNode.querySelector(`#${city}`);
    if (weatherCard === null) {
        let parentRow = document.createElement("div")
        parentRow.classList.add("row")
        parentRow.classList.add("center")
        parentNode.appendChild(parentRow)

        weatherCard = document.createElement("div")
        weatherCard.id = city
        weatherCard.classList.add("thick-column")
        parentRow.appendChild(weatherCard)
    } else {
        weatherCard.innerHTML ="";
    }

    const title = document.createElement("h4")
    title.innerText = city
    weatherCard.appendChild(title)
    

    const temperature = document.createElement("p")
    temperature.innerText = `Temp: ${weatherData.current_weather.temperature}${weatherData.current_weather_units.temperature}`
    weatherCard.appendChild(temperature)

    const windSpeed = document.createElement("p")
    windSpeed.innerText = `Windspeed: ${weatherData.current_weather.windspeed}${weatherData.current_weather_units.windspeed}`
    weatherCard.appendChild(windSpeed)


    const timeStamp = document.createElement("p")
    timeStamp.innerText = weatherData.current_weather.time
    weatherCard.appendChild(timeStamp)
}


function weatherData() {
    if (document.getElementById("weather").hidden) {
        return
    }
    for (const [city, coordinates] of Object.entries(cities)) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Errr fetching external resource: " + response.status);
        }
        return response.json();
    })
    .then(weatherData => displayWeatherData(city, weatherData))
    }
    setTimeout(weatherData, 5000)
}


function weatherPage() {
    hideOtherSections("weather")
    weatherData()
}

// ::TODO:: Replace this Intersection Observer API
window.addEventListener("scroll", scrollCallback)