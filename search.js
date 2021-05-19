// some cache'll be useful

function isId(s) {
    return /^\s*[1-9][0-9]*\s*$/.test(s);
}

function searchBySeiyuu() {
    let seiyuuInputValue = document.getElementById("seiyuu_input").value;
    let xhttpState = 0;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        xhttpState++;
        if (xhttpState == 4) {
            showResults(xhttp.response);
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
}

function showResults(response) {
    let responseObj = JSON.parse(response);
    alert(response);

    seiyuuImgElem = document.getElementById("seiyuu_img");
    seiyuuNameElem = document.getElementById("seiyuu_name");
    seiyuuIdElem = document.getElementById("seiyuu_id");
    
    seiyuuImgElem.src = responseObj.image_url;
    seiyuuNameElem.innerHTML = responseObj.name;
    seiyuuIdElem.innerHTML = String(responseObj.mal_id);

}