let stops = [];
let times = [];

let displayData = () => {
    console.log(times);
};

let updateDate = () => {
    times = [];
    for (let stop of stops) {
        let url = "https://cors-anywhere.herokuapp.com/52.88.188.196:8080/api/api/where/schedule-for-stop/" + stop + ".json?key=TEST";
        fetch(url, {
            mode: "cors",
            headers: {
                'Content-Type': 'application/jsonp'
            }
        }).then((response) => {
            response.json().then((json) => {
                for (let route of json.data.entry.stopRouteSchedules) {
                    for (let schedules of route.stopRouteDirectionSchedules) {
                        for (let time of schedules.scheduleStopTimes) {
                            times.push(time)
                        }
                    }
                }
            })
        })
    }

    times.sort((a, b) => {
        return a.departureTime - b.departureTime
    });

    displayData()
};

let start = () => {
    /*console.log("start of start");
    let str = JSON.stringify(["STA_COW9THNN"]);
    console.log(str);
    const urlParams = new URLSearchParams(window.location.search);
    const stopsParam = urlParams.get('stops');
    console.log(stopsParam);
    JSON.parse(stopsParam, (json) => {
       stops = json
    });*/
    stops = ["STA_COW9THNN", "STA_AIRFLIWF"];

    window.setInterval(updateDate, 5000)
};

document.addEventListener("DOMContentLoaded", function () {
    start()
});