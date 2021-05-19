// some cache'll be useful
//Have a nicer display for if there is no role

// link the table texts to the mal entries for chars n anime
// u shld cache the user's anime list so dunnid to keep fetching. but dun cache for too long cuz user might update list halfway.
// rmb to pbulish to github pages.
// controls to indicate what's been fetched
// disable controls after u enter or click search until the results r in.

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
    seiyuuRoleList = null;
    animeList = null;
}

function endSearch() {
}

function handleSeiyuuResponse(response) {
    let responseObj = JSON.parse(response);

    let seiyuuImgElem = document.getElementById("seiyuu_img");
    let seiyuuNameElem = document.getElementById("seiyuu_name");
    let seiyuuIdElem = document.getElementById("seiyuu_id");
    
    seiyuuImgElem.src = responseObj.image_url;
    seiyuuNameElem.innerHTML = responseObj.name;
    seiyuuIdElem.innerHTML = String(responseObj.mal_id);

    seiyuuRoleList = responseObj.voice_acting_roles;
    tryShowResults();
}

function searchBySeiyuu() {
    beginSearch();
    
    let seiyuuInputValue = document.getElementById("seiyuu_input").value;
    let xhttpState = 0;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        xhttpState++;
        if (xhttpState == 4) {
            handleSeiyuuResponse(xhttp.response);
        }
    };

    let getPath = "";

    if (isId(seiyuuInputValue)) {
        getPath = "https://api.jikan.moe/v3/person/" + seiyuuInputValue.trim();
    } else {
        return;
    }

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
                rolesInner += `<td>${role.anime.name}</td>`;
                rolesInner += `<td><img src="${role.anime.image_url}"></img></td>`;
                rolesInner += `<td>${role.character.name}</td>`;
                rolesInner += `<td><img src="${role.character.image_url}"></img></td>`;
                rolesInner += "</tr>";
            }
        }
    )

    rolesTable.innerHTML = rolesInner;
    endSearch();
}