let stops = [];
let stopsTimes = [];

let displayData = () => {
    let nextDepartureContainer = document.getElementById("nextDeparture");
    for (let nextStop of stopsTimes) {
        
    }
};

let updateDate = () => {
    for (let stop of stops) {
        let url = "https://cors-anywhere.herokuapp.com/52.88.188.196:8080/api/api/where/schedule-for-stop/" + stop + ".json?key=TEST";
        fetch(url, {
            mode: "cors",
            headers: {
                'Content-Type': 'application/jsonp'
            }
        }).then((response) => {
            response.json().then((json) => {
                let stop = {
                    id: json.data.references.stops[0].id,
                    name: json.data.references.stops[0].name,
                    route: json.data.references.routes[0].shortName,
                    times: []
                };
                stopsTimes[stop.id] = stop;

                for (let route of json.data.entry.stopRouteSchedules) {
                    for (let schedules of route.stopRouteDirectionSchedules) {
                        for (let time of schedules.scheduleStopTimes) {
                            stopsTimes[stop.id].times.push(time)
                        }
                    }
                }
                stopsTimes[stop.id].times.sort((a, b) => {
                    //console.log(new Date(a.departureTime));
                    return a.departureTime - b.departureTime
                });
            });
            displayData()
        })
    }
};

let start = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const stopsParam = urlParams.get('data');
    stops = stopsParam.split(",");
    const primaryColor = urlParams.get('primary');
    const secondaryColor = urlParams.get('secondary');
    updateDate();
    window.setInterval(updateDate, 60000)
};

document.addEventListener("DOMContentLoaded", function () {
    start()
});