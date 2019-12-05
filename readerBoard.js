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
            let hours = new Date(route.times[0].departureTime).getHours();
            let minutes = new Date(route.times[0].departureTime).getMinutes();
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
            bigTime.innerText = hours + ":" + minutes + " " + ampm;

            nextContainer.appendChild(stopName);
            nextContainer.appendChild(routeName);
            nextContainer.appendChild(bigTime);
            nextDepartureContainer.appendChild(nextContainer);
        });
    });
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