let queryStringData = {
    data: []
};

let addStop = () => {
    let text = document.getElementById("stop_id");
    let stopId = text.value;
    if(!queryStringData.data.includes(stopId)) {
        queryStringData.data.push(stopId);
    }
    text.value = "";
};

let loadBoard = () => {
    let primary = document.getElementById("primary_color");
    let secondary = document.getElementById("secondary_color");

    if(queryStringData.data.length !== 0) {
        let stopsQueryString = new URLSearchParams(queryStringData);
        window.location.href = "readerBoard.html?" + stopsQueryString + "&primary=" + primary.value.toString().substring(1) + "&secondary=" + secondary.value.toString().substring(1);
    } else {
        alert("Please enter at least one stop first");
    }
};

let start = () => {
    let primary = document.getElementById("primary_color");
    let secondary = document.getElementById("secondary_color");

    primary.value = '#9acd32';
    secondary.value = '#00a6d6';
};

document.addEventListener("DOMContentLoaded", function () {
    start()
});