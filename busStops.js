let stops = {
    data: []
};

let addStop = () => {
    let text = document.getElementById("stop_id");
    let stopId = text.value;
    if(!stops.data.includes(stopId)) {
        stops.data.push(stopId);
    }
    text.value = "";
    console.log(stops)
};

let loadBoard = () => {
    let queryString = new URLSearchParams(stops);
    window.location.href = "readerBoard.html?" + queryString
};