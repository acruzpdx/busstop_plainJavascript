function Model() {
    console.log ("Creating Model");
    // Controller varable - used to communicate with the controller
    // by invoking the controller's methods.
    var controller = null;

    // XMLHttpRequest objects to retrieve the trip and arrival
    // data
    var arrivalsXHR = new XMLHttpRequest();
    var tripXHR = new XMLHttpRequest();

    // Constants
    var HTTP_OK = 200;
    var RESPONSE_READY = 4;

    // set up the XHR objects
    arrivalsXHR.onreadystatechange = _arrivalsXHRInit;
    tripXHR.onreadystatechange = _tripXHRInit;

    // Private methods
    function _arrivalsXHRInit() {
        console.log("in _arrivalsXHRInit. arrivalsXHR.readyState = ",arrivalsXHR.readyState);
        if (arrivalsXHR.readyState === RESPONSE_READY) {
        console.log("in _arrivalsXHRInit. arrivalsXHR.status = ",arrivalsXHR.status);
            if( arrivalsXHR.status === HTTP_OK) {
                //controller.setJSONData(arrivalsXHR.responseText);
                //console.log("i am here");
                //alert(arrivalsXHR);
                console.log("in _arrivalsXHRInit. arrivalsXHR.responseText = ",arrivalsXHR.responseText);
                //controller.processJSONData(arrivalsXHR.responseText);
                //console.log(arrivalsXHR.responseText);
            }
        }
    }
    function _tripXHRInit() {
        if (tripXHR.readyState === RESPONSE_READY) {
            if( tripXHR.status === HTTP_OK {
                controller.processXMLData(tripXHR.responseXML);
                //console.log(tripXHR.responsXML);
            }
        }
    }

    // Public methods
    function setController(c) {
        if (c != null) {
            controller = c;
            console.log("Model: controller set");
        }
    }
    function sendArrivalsRequest(url) {
        arrivalsXHR.open("GET", url);
        arrivalsXHR.send();
    }
    function sendTripRequest(url) {
        tripXHR.open("GET", url);
        tripXHR.send();
    }
}
