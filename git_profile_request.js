const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
const date_options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

document.getElementById("submit").addEventListener("click", function () {
    let userName = document.getElementById("username").value
    // let result;
    if (userName == null || userName === "") {
        showMessage("username coudnt be empty")
    } else {
        findUserLanguages(userName)
    }
    //     let cache = localStorage.getItem(userName)
    //     console.log("cache", cache)
    //     if (cache !== null) {
    //         renderGitProfile(cache)
    //     } else {
    //         try {
    //             result = getGitProfile(userName).then(result => result.json())
    //         } catch (err) {
    //             showMessage(err)
    //             // showMessage("failed to request github for profile")
    //         }
    //         // result = getGitProfile(userName)
    //         findUserLanguages(userName)
    //         console.log("res", result)
    //         if (result != null) {
    //             renderGitProfile(result)
    //         }
    //     }
    //
    // }
});


function findMostLanguages(resultmm) {
    // let languages = new Map();
    console.log("this is r", resultmm, resultmm[1])
    // for (let i = 0; i < resultmm.length; i++) {
    //     for (let lang in resultmm[i]) {
    //         if (languages.has(lang) && resultmm[i][lang] > languages.get(lang)) {
    //             languages.set(lang, resultmm[i][lang])
    //         } else {
    //             languages.set(lang, resultmm[i][lang])
    //         }
    //     }
    // }
    //
    // for (let langs in result) {
    //
    // }

    // console.log("array", languages)
    // let sortedLanguages = new Map([...languages].sort((a, b) => b[1] - a[1]))
    // console.log("sortedmap", sortedLanguages)
    // sortedLanguages = Array.from(sortedLanguages).slice(0, 3)
    // sortedLanguages = new Map(sortedLanguages)
    // console.log("sorted", sortedLanguages)
}

function findUserLanguages(userName) {
    fetch(`https://api.github.com/users/${userName}/repos`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const mresult = result.slice(0, 5)
            mresult.forEach(findRepoLanguages)
            findMostLanguages(mresult)
            console.log(mresult, "result")
        })
        .catch(error => console.log('error', error));
}

function findRepoLanguages(value, index, array) {
    // let repoName = array[index].full_name
    fetch(`https://api.github.com/repos/${value.full_name}/languages`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            array[index] = result
            // renderGitProfile(result)
        })
        .catch(error => console.log('error', error));
}

function showMessage(error) {
    let messageElement = document.getElementById("message")
    messageElement.innerHTML = error
    messageElement.style.opacity = "1"
    document.getElementById("profile-information").style.opacity = "0"
}

function getGitProfile(userName) {
    return new Promise((resolve, reject) => (
        fetch(`https://api.github.com/users/${userName}`, requestOptions)
            .then(data => {
                if (data.ok) {
                    data.json().then(res => {
                        resolve(res)
                    })
                } else if (data.status === 404) {
                    showMessage("username not found")
                } else if (data.status === 403) {
                    showMessage("API rate limit exceeded")
                }
            })
            .catch(err => reject(err))
    ))


    // return fetchData
    // async function getData() {
    //     const data = await fetchData()
    //     console.log(data);
    // }
    //
    // getData()
    // fetch(`https://api.github.com/users/${userName}`, requestOptions)
    //     .then((response) => {
    //         if (response.ok) {
    //             response.json().then(result => {
    //                 console.log(result)
    //                 return result
    //             })
    //         } else if (response.status === 404) {
    //             showMessage("username not found")
    //         } else if (response.status === 403) {
    //             showMessage("API rate limit exceeded")
    //         }
    //     })
    //     .catch(error => {
    //         showMessage(error)
    //     });

}

function renderGitProfile(profile) {
    let updated_at = new Date(profile.updated_at).toLocaleDateString("en-US", date_options)
    let created_at = new Date(profile.created_at).toLocaleDateString("en-US", date_options)

    document.getElementById("message").style.opacity = "0"
    document.getElementById("profile-information").style.opacity = "1"

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
    if (profile.twitter_username != null) {
        document.getElementById("profile-social-links").style.display = `block`
        document.getElementById("profile-social-links").href = `https://twitter.com/${profile.twitter_username}`
    }
}