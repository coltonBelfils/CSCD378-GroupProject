let stops = [];
let stopsTimes = [];

let displayData = () => {
    console.log(stopsTimes);
    let nextDepartureContainer = document.getElementById("nextDeparture");
    while (nextDepartureContainer.firstChild) {
        nextDepartureContainer.removeChild(nextDepartureContainer.firstChild);
    }
    stops.forEach((stopId) => {
        let nextStop = stopsTimes[stopId];
        if(nextStop != null) nextStop.routes.forEach(route => {
            let nextContainer = document.createElement("div");
            nextContainer.setAttribute("class", "container nextDepartureItem");

            let stopName = document.createElement("label");
            stopName.setAttribute("class", "stopName");
            stopName.innerText = nextStop.name;

            let routeName = document.createElement("label");
            routeName.setAttribute("class", "routeName");
            routeName.innerText = route.name;

            let bigTime = document.createElement("label");
            bigTime.setAttribute("class", "bigTime");
            bigTime.innerText = formatTime(route.times[0].departureTime);

            nextContainer.appendChild(stopName);
            nextContainer.appendChild(routeName);
            nextContainer.appendChild(bigTime);
            nextDepartureContainer.appendChild(nextContainer);
        });
    });
};

let formatTime = (milliTime) => {
    let hours = new Date(milliTime).getHours();
    let minutes = new Date(milliTime).getMinutes();
    let ampm;
    if (hours >= 12) {
        ampm = "pm"
    } else {
        ampm = "am"
    }
    hours = hours % 12;
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    return hours + ":" + minutes + " " + ampm;
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
                    routes: []
                };
                stopsTimes[stop.id] = stop;

                for (let route of json.data.entry.stopRouteSchedules) {
                    let routeName = "";
                    for (let refRoute of json.data.references.routes) {
                        if (refRoute.id === route.routeId) {
                            routeName = refRoute.longName + " - " + refRoute.shortName;
                        }
                    }
                    let currentRoute = {
                        id: route.routeId,
                        name: routeName,
                        times: []
                    };
                    for (let schedules of route.stopRouteDirectionSchedules) {
                        let currentDate = new Date().getTime();
                        for (let time of schedules.scheduleStopTimes) {
                            if (time.departureTime >= currentDate) {
                                currentRoute.times.push(time)
                            }
                        }
                    }
                    currentRoute.times.sort((a, b) => {
                        return a.departureTime - b.departureTime
                    });
                    stopsTimes[stop.id].routes.push(currentRoute);
                }
                displayData()
            });
        })
    }
};

let getTime = () => {
    document.getElementById("currentTime").innerText = formatTime(new Date().getTime());
};

let start = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const stopsParam = urlParams.get('data');
    stops = stopsParam.split(",");
    const primaryColor = urlParams.get('primary');
    const secondaryColor = urlParams.get('secondary');
    updateDate();
    getTime();
    window.setInterval(updateDate, 60000);
    window.setInterval(getTime, 4000);
};

document.addEventListener("DOMContentLoaded", function () {
    start()
});