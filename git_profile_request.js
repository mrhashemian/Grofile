const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
const date_options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

// add event listener for submit button
document.getElementById("submit").addEventListener("click", function () {
    let userName = document.getElementById("username").value
    document.getElementById("box-message").innerHTML = ""

    if (userName == null || userName === "") {
        showMessage("username could not be empty")
    } else {
        let profileCache = localStorage.getItem("profile:" + userName)
        console.log("profile cache", JSON.parse(profileCache))
        if (profileCache !== null) {
            document.getElementById("box-message").innerHTML += "this profile got from local storage"
            renderGitProfile(JSON.parse(profileCache))
            getUserLanguage(userName)
        } else {
            getGitProfile(userName)
        }
    }
})

// get user skills. first check local storage then request if it doesn't exist
function getUserLanguage(userName) {
    let languageCache = localStorage.getItem("language:" + userName)
    if (languageCache !== null) {
        document.getElementById("box-message").innerHTML += "<br>this skills got from local storage"
        languageCache = JSON.parse(languageCache)
        let d22 = document.getElementById("d22")
        for (let i = 0; i < languageCache.length; i++) {
            let temp = document.createElement("p")
            temp.innerHTML = languageCache[i][0] + ": " + languageCache[i][1]
            d22.appendChild(temp)
        }
    } else {
        findUserLanguages(userName)
    }
}

// find user most 3 top programming languages and save them to localStorage
function mostLanguages(array, userName) {
    let languages = new Map();
    for (let i = 0; i < array.length; i++) {
        for (let lang in array[i]) {
            if (languages.has(lang) && array[i][lang] > languages.get(lang)) {
                languages.set(lang, array[i][lang])
            } else {
                languages.set(lang, array[i][lang])
            }
        }
    }

    let sortedLanguages = new Map([...languages].sort((a, b) => b[1] - a[1]))
    sortedLanguages = Array.from(sortedLanguages).slice(0, Math.min(3, sortedLanguages.size))
    sortedLanguages = new Map(sortedLanguages)

    if (sortedLanguages.size > 0) {
        localStorage.setItem("language:" + userName, JSON.stringify(Array.from(sortedLanguages.entries())))
        let d22 = document.getElementById("d22")
        console.log(sortedLanguages, "skl")
        sortedLanguages.forEach((value, key) => {
            let temp = document.createElement("p")
            temp.innerHTML = key + ": " + value
            d22.appendChild(temp)
        });
    }
}

// fetch user repositories and loop over at most 5 of them to find their languages.
function findUserLanguages(userName) {
    const newResult = [];

    fetch(`https://api.github.com/users/${userName}/repos`, requestOptions)
        .then(response => {
            if (response.status === 403) {
                showMessage("API rate limit exceeded")
            }
            response.json().then(async res => {
                try {
                    for (let i = 0; i < 5 && i < res.length; i++) {
                        const response = await fetch(`https://api.github.com/repos/${res[i].full_name}/languages`, requestOptions)
                        if (response.status === 403) {
                            showMessage("API rate limit exceeded")
                            break
                        }
                        const result = await response.json()
                        newResult.push(result)
                    }
                } catch (err) {
                    showMessage("API rate limit exceeded")
                }

                mostLanguages(newResult, userName)
            })
        })
        .catch(error => {
            showMessage(error)
        });
}

// function to show message in profile box
function showMessage(error) {
    let messageElement = document.getElementById("message")
    messageElement.innerHTML = error
    messageElement.style.opacity = "1"
    document.getElementById("profile-information").style.opacity = "0"
}

// fetch user GitHub profile and save it to localStorage
function getGitProfile(userName) {
    fetch(`https://api.github.com/users/${userName}`, requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json().then(result => {
                    localStorage.setItem("profile:" + userName, JSON.stringify(result))
                    renderGitProfile(result)
                    getUserLanguage(userName)
                })
            } else if (response.status === 404) {
                showMessage("username not found")
            } else if (response.status === 403) {
                showMessage("API rate limit exceeded")
            }
        })
        .catch(error => {
            showMessage(error)
        });
}

// use for clear elements values
function prepareProfileCard() {
    document.getElementById("message").style.opacity = "0"
    document.getElementById("profile-information").style.opacity = "1"

    let h1Fields = document.getElementById("profile-information").getElementsByTagName("h1")
    for (let i = 0; i < h1Fields.length; i++) {
        h1Fields[i].innerHTML = ""
    }

    document.getElementById("bio").innerHTML = ""
    let d22 = document.getElementById("d22")
    let child = d22.lastElementChild
    while (child) {
        d22.removeChild(child);
        child = d22.lastElementChild;
    }
}

// append profile values to html elements
function renderGitProfile(profile) {
    prepareProfileCard()

    let updated_at = new Date(profile.updated_at).toLocaleDateString("en-US", date_options)
    let created_at = new Date(profile.created_at).toLocaleDateString("en-US", date_options)

    document.getElementById("profile").getElementsByTagName("img")[0].src = profile.avatar_url
    document.getElementById("name").innerHTML = profile.name
    document.getElementById("login").innerHTML = "username: " + profile.login
    document.getElementById("id").innerHTML = "id: " + profile.id
    document.getElementById("created_at").innerHTML = "created at: " + created_at
    document.getElementById("updated_at").innerHTML = "updated at: " + updated_at
    document.getElementById("followers").innerHTML = "followers: " + profile.followers
    document.getElementById("following").innerHTML = "following: " + profile.following
    document.getElementById("html_url").href = profile.html_url
    document.getElementById("html_url").innerHTML = "see on github"
    if (profile.company != null) {
        document.getElementById("company").innerHTML = "company: " + profile.company
    }
    if (profile.blog !== "") {
        document.getElementById("blog").innerHTML = "blog: " + profile.blog
    }
    if (profile.location != null) {
        document.getElementById("location").innerHTML = "location: " + profile.location
    }
    if (profile.email != null) {
        document.getElementById("email").innerHTML = "email: " + profile.email
    }
    if (profile.bio != null) {
        document.getElementById("bio").innerHTML = profile.bio
    }
}