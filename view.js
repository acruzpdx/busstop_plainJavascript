var view = (function() {
    //---------------- Variables ----------------
    var myController = null;
    // UI variables - used to communicate with the browser's DOM elements.
    var arrivalsTab,
        tripTab,
        getTripButton,
        resetTripButton,
        getArrivalsButton,
        resetArrivalsButton,
        arrivalsMain,   // section that contains the arrivals form
        tripMain,       // section that contains the trip form
        arrivalsData,    // section that contains arrival data
        tripData,       // section that contains trip data
        stopID,
        startAddress,
        endAddress;

    // Set up tab (anchor links) event listeners
        arrivalsTab = document.getElementById("arrivals");
        arrivalsTab.addEventListener("click",_arrivalsTabHandler);

        tripTab = document.getElementById("trip");
        tripTab.addEventListener("click",_tripTabHandler);
        
        // Set up form button event listeners
        getTripButton =  document.getElementById("getTripButton");
        getTripButton.addEventListener("click",_getTripButtonHandler);

        resetTripButton =  document.getElementById("tripResetButton");
        resetTripButton.addEventListener("click",_resetTripButtonHandler);

        getArrivalsButton =  document.getElementById("getArrivalsButton");
        getArrivalsButton.addEventListener("click",_getArrivalsButtonHandler);

        resetArrivalsButton =  document.getElementById("arrivalsResetButton");
        resetArrivalsButton.addEventListener("click",_resetArrivalsButtonHandler);

    // Set up for form switching
        arrivalsMain = document.getElementById("arrivals-main");
        arrivalsData = document.getElementById("arrival_data");

        tripMain = document.getElementById("trip-main");
        tripData = document.getElementById("trip_data");

    // Reference to the form input fields
        stopID = document.getElementById("stopID");
        startAddress = document.getElementById("start_address");
        endAddress = document.getElementById("end_address");

    //-------------- Private Methods -------------
    function _arrivalsTabHandler(evt) {
        
        evt.preventDefault();

        stopID.value = "";
        removeAllChildrenOf(arrivalsData);
        arrivalsMain.classList.remove("not_shown");
        arrivalsMain.classList.add("shown");
        arrivalsTab.classList.remove("back");
        arrivalsTab.classList.add("fore");
        
        tripMain.classList.remove("shown");
        tripMain.classList.add("not_shown");
        tripTab.classList.remove("fore");
        tripTab.classList.add("back");
    }
    function _tripTabHandler(evt) {
        
        evt.preventDefault();
        startAddress.value = "";
        endAddress.value = "";
        removeAllChildrenOf(tripData);
        tripMain.classList.remove("not_shown");
        tripMain.classList.add("shown");
        tripTab.classList.remove("back");
        tripTab.classList.add("fore");
        
        arrivalsMain.classList.remove("shown");
        arrivalsMain.classList.add("not_shown");
        arrivalsTab.classList.remove("fore");
        arrivals.classList.add("back");
    }
    function _getTripButtonHandler(evt) {
        evt.preventDefault();
        var timeString, fromString, toString;
        var now = null;

        if ((startAddress.value === "") || (endAddress.value === "")) {
            return;
        } else {
            // Get the time
            now = new Date();
            timeString = now.toLocaleTimeString();

            // Get the start address
            fromString = startAddress.value;

            // Get the end address
            toString = endAddress.value;

            myController.requestTripData(timeString, fromString, toString); 
        }
    }
    function _resetTripButtonHandler(evt) {
        evt.preventDefault();
        removeAllChildrenOf(tripData);
        startAddress.value = "";
        endAddress.value = "";
    }
    function _getArrivalsButtonHandler(evt) {
        evt.preventDefault();
        // Get stop entered by User in the Arrivals form
        var stopIDString = stopID.value;
        if (stopID.value ==="") {
            return;
        } else {
            myController.requestArrivalsData(stopIDString);
        }
    }
    function _resetArrivalsButtonHandler(evt) {
        evt.preventDefault();
        stopID.value = "";
        removeAllChildrenOf(arrivalsData);
    }
    function removeAllChildrenOf(someElement) {
        while(someElement.hasChildNodes()) {
            someElement.removeChild(someElement.firstChild);
        }
    }
    //-------------- Public Methods -------------
    function setController(ctrl) {
        if (ctrl != null) {
            myController = ctrl;
        }
    }
    function updateWithJSONData(jsonObj) {
        var bus = jsonObj.resultSet;
        if (typeof(bus.arrival) === "undefined") {
            arrivalsData.innerHTML = "No upcoming arrivals found for this stop";
        } else {
            removeAllChildrenOf(arrivalsData);
            ul = document.createElement('ul');
            for(i=0;i<bus.arrival.length;i+=1){
                liEl = document.createElement('li');
                //parse the hour and format it
                hr = parseInt(bus.arrival[i].scheduled.slice(11,13));
                if (hr < 12) {
                    ampm = "AM";
                } else if (hr>=12) {
                    ampm= "PM";
                }
                if (hr==0) {
                    hr=12;
                } else if (hr>12) {
                    hr = hr-12;
                }
                if (hr<10) {
                    hrStr = "0"+hr;
                } else {
                    hrStr = hr.toString();
                }
                //parse the minute and format it
                min = parseInt(bus.arrival[i].scheduled.slice(14,16));
                if (min<10) {
                    minStr = "0"+min;
                } else {
                    minStr = min.toString();
                }
                liEl.innerHTML = "["+ hrStr +":"+ minStr+ ampm+ "] " + bus.arrival[i].fullSign;
                ul.appendChild(liEl);				
                }
                arrivalsData.appendChild(ul);
        }
    }
    function _getXMLNodeValue(el,tag) {
        //returns value of first node of type 'tag' in XML element 'el'
        //basically used when we are sure there is only one node
        var temp;
        temp = el[0].getElementsByTagName(tag);
        if (temp.length != 0) {
                return temp[0].firstChild.nodeValue;
        } else {
            return "";
        }
    }
    function updateWithXMLData(xmlData) {
        var success,
            itineraries,
            legs,
            tempEl,
            ulEl,
            liEl,
            RouteName,
            i,
            j,
            desc,
            mode,
            toEl,
            fromEl,
            routeEl,
            endpoint,
            msg,
            stop,
            startTime,
            timeDistanceEl;


        success = xmlData.firstChild.getAttribute("success");
        if ( success !="true")
        {
                tempEl = document.createElement('p');
                tempEl.innerHTML = "Trimet has determined that your trip is not possible. Please try a different set of starting and ending addresses.";
                tripData.appendChild(tempEl);
        } else {
            removeAllChildrenOf(tripData);
            itineraries = xmlData.getElementsByTagName("itinerary");
            for (var i = 0; i < itineraries.length; i++)
            {
                tempEl = document.createElement('p');
                tempEl.innerHTML = "Plan: " + itineraries[i].getAttribute("id")
                                    +" Bus: "+itineraries[i].getAttribute("viaRoute");
                tripData.appendChild(tempEl);
                legs = itineraries[i].getElementsByTagName("leg");
                ulEl = document.createElement('ol');
                tripData.appendChild(ulEl);
                for(j=0; j< legs.length; j+=1) {
                    mode = legs[j].getAttribute("mode");

                    desc = legs[j].getElementsByTagName("description");
                    toEl = legs[j].getElementsByTagName("to");
                    routeEl = legs[j].getElementsByTagName("route");

                    liEl = document.createElement('li');
                    if ( mode === "Walk") {
                    msg	 = "Walk to " + desc[1].firstChild.nodeValue;
                            if ((stop = _getXMLNodeValue(toEl,"stopId")) != "" ) {
                                msg = msg + " (stop:" + stop + ")";
                            }
                    liEl.innerHTML = msg;
                    } else if (mode ==="Bus") {
                        timeDistanceEl = legs[j].getElementsByTagName("time-distance");
                        startTime = _getXMLNodeValue(timeDistanceEl,"startTime");
                        liEl.innerHTML = "["+startTime+"] " + _getXMLNodeValue(routeEl,"name") +" to " +desc[1].firstChild.nodeValue;
                    } else if (mode==="Light Rail") {
                        timeDistanceEl = legs[j].getElementsByTagName("time-distance");
                        startTime = _getXMLNodeValue(timeDistanceEl,"startTime");
                        liEl.innerHTML = "["+startTime+"] " + _getXMLNodeValue(routeEl,"name") +" to " +desc[1].firstChild.nodeValue;
                    } else {
                        liEl.innerHTML = "Take " + mode  + " to " +desc[1].firstChild.nodeValue;
                    }
                    ulEl.appendChild(liEl);
                } // end of legs for loop
            } // end of itineraries for loop	
        } // end of if else block (success === true)
    }

    // Expose Public Methods
    return {
        setController: setController,
        updateWithJSONData: updateWithJSONData,
        updateWithXMLData: updateWithXMLData
    }
})();
