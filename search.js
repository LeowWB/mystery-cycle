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
           alert(xhttp.response);
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
