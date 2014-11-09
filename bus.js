/*------------------------------------------------------------------*
 * File: 		bus.js
 * Author: 		Agapito Cruz (agapito.cruz@gmail.com)
 * Comments:	This file was written to demonstrate proficiency
 * 				in the Javascript language and in the use of 
 * 				various techniques and design patterns common
 * 				in web app construction, including use of AJAX,XML,
 * 				and JSON techniques.
 * 				This is one of three files needed to access Trimet
 * 				data. The other three are: index.html and
 * 				bus.css.
 ------------------------------------------------------------------*/

var bus=(function() {
		var arrivals_xhr = new XMLHttpRequest();
		var trip_xhr = new XMLHttpRequest();

		/*------------------------------------------------------------------*
		 * Function: 	init()
		 * Contents:	Set up the event listeners for the form buttons.
		 * 				Set up the onreadystatechange listeners for both
		 * 				XMLHTTPRequest objects.
		 ------------------------------------------------------------------*/
		function init() {
			var btn,
				tab;

			// Set up tab (anchor links) event listeners
			tab = document.getElementById("arrivals");
			tab.addEventListener("click",function(evt) {
				var divEl,
					displayEl,
					tripTab;
				
				evt.preventDefault();
				displayEl = document.getElementById("arrival_data");
				clearDiv(displayEl);
				divEl = document.getElementById("arrivals-main");
				divEl.classList.remove("not_shown");
				divEl.classList.add("shown");
				this.classList.remove("back");
				this.classList.add("fore");
				
				divEl = document.getElementById("trip-main");
				divEl.classList.remove("shown");
				divEl.classList.add("not_shown");
				tripTab =document.getElementById("trip");
				tripTab.classList.remove("fore");
				tripTab.classList.add("back");
				
			});

			tab = document.getElementById("trip");
			tab.addEventListener("click",function(evt) {
				var divEl,
					displayEl,
					arrivalsTab;
				
				evt.preventDefault();
				displayEl = document.getElementById("trip_data");
				clearDiv(displayEl);
				divEl = document.getElementById("trip-main");
				divEl.classList.remove("not_shown");
				divEl.classList.add("shown");
				this.classList.remove("back");
				this.classList.add("fore");
				
				divEl = document.getElementById("arrivals-main");
				divEl.classList.remove("shown");
				divEl.classList.add("not_shown");
				arrivalsTab = document.getElementById("arrivals");
				arrivalsTab.classList.remove("fore");
				arrivals.classList.add("back");
				
			});

			// Set up form button event listeners
			btn =  document.getElementById("getTripButton");
			btn.addEventListener("click",function(evt) {
				evt.preventDefault();
				getTripData();
			});

			btn =  document.getElementById("tripResetButton");
			btn.addEventListener("click",function(evt) {
				var displayEl;
				
				evt.preventDefault();
				displayEl = document.getElementById("trip_data");
				clearDiv(displayEl);
			});

			btn =  document.getElementById("getArrivalsButton");
			btn.addEventListener("click",function(evt) {
				evt.preventDefault();
				getArrivalsData();
			});

			btn =  document.getElementById("arrivalsResetButton");
			btn.addEventListener("click",function(evt) {
				var displayEl;
				
				evt.preventDefault();
				displayEl = document.getElementById("arrival_data");
				clearDiv(displayEl);
			});

			trip_xhr.onreadystatechange = function() {
				if (trip_xhr.readyState === 4) {
					if (trip_xhr.status >=200 && trip_xhr.status <=209) {
						processXML();
					} // end of status check
				} // end of readStatecheck
			};//end of onreadystatechange callback

			arrivals_xhr.onreadystatechange = function() {
				if (arrivals_xhr.readyState === 4) {
					if (arrivals_xhr.status >=200 && arrivals_xhr.status <=209) {
						processJSON();
					} // end of status check
				} // end of readStatecheck
			};//end of onreadystatechange callback
		}

		/*------------------------------------------------------------------*
		 * Function: 	processJSON()
		 * Contents:	Takes the arrivals_xhr responseText and parses out
		 * 				the time and bus data, then adds it to the page 	
		 ------------------------------------------------------------------*/
		function processJSON(){
			var arrivalDiv,
				bus,
				i,
				ulEl,
				liEl,
				time,
				min,
				hr,
				hrStr,
				minStr,
				ampm,
				jsonObj;

			arrivalDiv = document.getElementById("arrival_data");
			// Clear the old data
			clearDiv(arrivalDiv);
			jsonObj = JSON.parse(arrivals_xhr.responseText);
			bus = jsonObj.resultSet;
			if (typeof(bus.arrival)!= "undefined") {
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
					arrivalDiv.appendChild(ul);
			} else {
				arrivalDiv.innerHTML = "No upcoming arrivals found for this stop";
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	processXML()
		 * Contents:	Takes the trip_xhr responseXML and parses out
		 * 				the trip data, then adds it to the page 	
		 ------------------------------------------------------------------*/
		function processXML(){
			var xmlData = trip_xhr.responseXML,
				success,
				itineraries,
				itineraries_length,
				legs,
				legs_length,
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


			busDiv = document.getElementById("trip_data");
			// Clear the old data
			clearDiv(busDiv);
			success = xmlData.firstChild.getAttribute("success");
			if ( success ==="true")
			{
				itineraries = xmlData.getElementsByTagName("itinerary");
				itineraries_length=itineraries.length;
				for (var i = 0; i < itineraries_length; i+=1)
				{
					tempEl = document.createElement('p');
					tempEl.innerHTML = "Plan: " + itineraries[i].getAttribute("id")
										+" Bus: "+itineraries[i].getAttribute("viaRoute");
					busDiv.appendChild(tempEl);
					legs= itineraries[i].getElementsByTagName("leg");
					legs_length = legs.length;
					ulEl = document.createElement('ol');
					busDiv.appendChild(ulEl);
					for(j=0; j< legs_length; j+=1) {
						mode = legs[j].getAttribute("mode");

						desc = legs[j].getElementsByTagName("description");
						toEl = legs[j].getElementsByTagName("to");
						routeEl = legs[j].getElementsByTagName("route");

						liEl = document.createElement('li');
						if ( mode === "Walk") {
						msg	 = "Walk to " + desc[1].firstChild.nodeValue;
								if ((stop = getXMLNodeValue(toEl,"stopId")) != "" ) {
									msg = msg + " (stop:" + stop + ")";
								}
						liEl.innerHTML = msg;
						} else if (mode ==="Bus") {
							timeDistanceEl = legs[j].getElementsByTagName("time-distance");
							startTime = getXMLNodeValue(timeDistanceEl,"startTime");
							liEl.innerHTML = "["+startTime+"] " + getXMLNodeValue(routeEl,"name") +" to " +desc[1].firstChild.nodeValue;
						} else if (mode==="Light Rail") {
							timeDistanceEl = legs[j].getElementsByTagName("time-distance");
							startTime = getXMLNodeValue(timeDistanceEl,"startTime");
							liEl.innerHTML = "["+startTime+"] " + getXMLNodeValue(routeEl,"name") +" to " +desc[1].firstChild.nodeValue;
						} else {
							liEl.innerHTML = "Take " + mode  + " to " +desc[1].firstChild.nodeValue;
						}
						ulEl.appendChild(liEl);
					}
				}	
			} else {
				
					tempEl = document.createElement('p');
					tempEl.innerHTML = "Trimet has determined that your trip is not possible. Please try a different set of starting and ending addresses.";
					busDiv.appendChild(tempEl);
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	clearDiv()
		 * Contents:	Utility function that removes all the children of 
		 * 				the div that will display the returned data
		 ------------------------------------------------------------------*/
		function clearDiv(el) {
			while(el.hasChildNodes()) {
			el.removeChild(el.firstChild);
			}
		}

		/*------------------------------------------------------------------*
		 * Function: 	getXMLNodeValue(el,tag)
		 * Contents:	Utility function that returns the value held by the
		 * 				first 'tag' element child of the 'el'element
		 ------------------------------------------------------------------*/
		function getXMLNodeValue(el,tag) {
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

		/*------------------------------------------------------------------*
		 * Function: 	getArrivalsData()
		 * Contents:	Sets up url used to request Bus Arrival data
		 ------------------------------------------------------------------*/
		function getArrivalsData() {
			var url = "http://developer.trimet.org/ws/V1/arrivals/json/true",
			

			stopIDStr = "/locIDs/",
			stopEl=null,
			appID = "7B1823A54547CEA231EB6D333",

			stopEl = document.getElementById("stopID");
			stopIDStr=stopIDStr+encodeURIComponent(stopEl.value);
			url = url+stopIDStr+"/appID/"+appID;
			arrivals_xhr.open("GET",url);
			arrivals_xhr.send();
			stopEl.value="";
		}

		/*------------------------------------------------------------------*
		 * Function: 	getTripData()
		 * Contents:	Sets up url used to request Trip Plan data
		 ------------------------------------------------------------------*/
		function getTripData() {
			var url = "http://developer.trimet.org/ws/V1/trips/tripplanner/maxIntineraries/6/format/xml/mode/A/min/T",
			

			fromPlaceStr = "/fromPlace/",
			fromEl=null,
			toPlaceStr = "/toPlace/",
			toEl = null,
			appID = "7B1823A54547CEA231EB6D333",
			t = new Date();

			tStr = "/time/"+encodeURIComponent(t.toLocaleTimeString());
			fromEl = document.getElementById("start_address");
			fromPlaceStr=fromPlaceStr+encodeURIComponent(fromEl.value);
			toEl = document.getElementById("end_address");
			toPlaceStr=toPlaceStr+encodeURIComponent(toEl.value);
			url = url+tStr+fromPlaceStr+toPlaceStr+"/appID/"+appID;
			trip_xhr.open("GET",url);
			trip_xhr.send();
			fromEl.value="";
			toEl.value="";
		}
		//return the bus object interface
		return {
				init:init
		}
	})();

/*------------------------------------------------------------------*
 * Function: 	
 * Contents:	After page loads, initialize the XMLHTTPRequest 
 * 				objects and set up the event listeners for the
 * 				form buttons.
 ------------------------------------------------------------------*/
window.addEventListener("load",function(){

	bus.init();
});
