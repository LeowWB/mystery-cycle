let searching = false;
let animeList = null;
let seiyuuRoleList = null;

function isId(s) {
    return /^\s*[1-9][0-9]*\s*$/.test(s);
}

function getUserAnimeList() {
    let username = document.getElementById("username_input").value;
    getUserAnimeListPage(username, 1, []);
}

function getUserAnimeListPage(username, page, listSoFar) {
    getPath = `https://api.jikan.moe/v3/user/${username.trim()}/animelist/completed/${String(page)}`

    let xhttpState = 0;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        xhttpState++;
        if (xhttpState == 4) {
            let curPage = JSON.parse(xhttp.response).anime;

            if (curPage.length) {
                getUserAnimeListPage(username, page+1, listSoFar.concat(curPage));
            } else {
                animeList = listSoFar;
                tryShowResults();
            }
        }
    };
    xhttp.open("GET", getPath);
    xhttp.send();
}

function beginSearch() {
    searching = true;
    document.getElementById("seiyuu_search_button").disabled = true;
    document.getElementById("seiyuu_input").disabled = true;

    seiyuuRoleList = null;
    animeList = null;
}

function endSearch() {
    searching = false;
    document.getElementById("seiyuu_search_button").disabled = false;
    document.getElementById("seiyuu_input").disabled = false;
    document.getElementById("seiyuu_input").focus();
}

function handleSeiyuuResponse(response) {
    let responseObj = JSON.parse(response);

    let seiyuuImgElem = document.getElementById("seiyuu_img");
    let seiyuuNameElem = document.getElementById("seiyuu_name");
    let seiyuuIdElem = document.getElementById("seiyuu_id");
    
    let seiyuuNameText = "";

    if (responseObj.family_name && responseObj.given_name) {
        seiyuuNameText = `${responseObj.family_name} ${responseObj.given_name} (${responseObj.name})`;
    } else {
        seiyuuNameText = responseObj.name;
    }

    seiyuuImgElem.src = responseObj.image_url;
    seiyuuNameElem.innerHTML = seiyuuNameText;
    seiyuuIdElem.innerHTML = `<a href="${responseObj.url}">${responseObj.mal_id}</a>`;

    seiyuuRoleList = responseObj.voice_acting_roles;
    tryShowResults();
}

function searchBySeiyuu() {
    if (searching) {
        return;
    }

    let seiyuuInputValue = document.getElementById("seiyuu_input").value;
    let getPath = "";

    if (isId(seiyuuInputValue)) {
        getPath = "https://api.jikan.moe/v3/person/" + seiyuuInputValue.trim();
    } else {
        alert("please enter a numeric id");
        return;
    }

    beginSearch();
    
    let xhttpState = 0;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        xhttpState++;
        if (xhttpState == 4) {
            if (xhttp.status == 200 || xhttp.status == 0) {
                handleSeiyuuResponse(xhttp.response);
            } else {
                alert(xhttp.status);
                endSearch();
            }
        }
    };

    xhttp.open("GET", getPath);
    xhttp.send();

    getUserAnimeList();
}

function tryShowResults() {
    if (!(seiyuuRoleList && animeList)) {
        return;
    }

    let animeSet = new Set(animeList.map(anime => anime.mal_id));

    let rolesTable = document.getElementById("roles_table");
    let rolesInner = "";
    seiyuuRoleList.forEach(
        (role) => {
            if (animeSet.has(role.anime.mal_id)) {
                rolesInner += "<tr>";
                rolesInner += `<td>${role.role}</td>`;
                rolesInner += `<td><a href="${role.anime.url}">${role.anime.name}</a></td>`;
                rolesInner += `<td><img src="${role.anime.image_url}"></img></td>`;
                rolesInner += `<td><a href="${role.character.url}">${role.character.name}</a></td>`;
                rolesInner += `<td><img src="${role.character.image_url}"></img></td>`;
                rolesInner += "</tr>";
            }
        }
    )

    rolesTable.innerHTML = rolesInner;
    document.getElementById("empty_search_text").hidden = (rolesInner != "");
    endSearch();
}
