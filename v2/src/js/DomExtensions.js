Array.prototype.remove = function () {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.concatIfNotNull = function (items) {
    if (!isEmpty(items)) {
        return this.concat(items);
    }
    return this;
}

Date.prototype.standardDate = function () {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};


Date.prototype.standardIime = function () {
    return formatTimeHHMM(this);
};

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

/**
 * Diese Methode prüft gänige HTMl Elemente, ob sie leer sind.
 * Strings, Objekte, JSON Arrays, Arrays, gültige HTML Elemente.
 * 
 * Prüft auf null, undefined und bei Strings auf die getrimmte Länge
 * 
 * @param {*} elem ein beliebiges HTML Element
 */
function isEmpty(elem) {
    if (elem != null && elem != undefined && elem != 'undefined') {
        if (typeof elem === 'string') {
            if (elem.trim().length > 0) {
                return false;
            }
            return true;
        }

        if (!isElement(elem) && elem.constructor == ({}).constructor && Object.keys(elem).length < 1) {
            return true;
        }
        return false;
    }
    return true;
}

/**
 * Diese Methode prüft für JSON Elemente, ob Parameter definiert sind.
 * 
 * Prüft auf null und undefined
 * 
 * @param {*} elem ein JSON Element
 */
function isUndefined(elem) {
    if (elem != null && elem != undefined && elem != 'undefined') {
        return false;
    }
    return true;
}

function isElement(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    } catch (e) {
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
}

const toAlpha = (num) => {
    if (num < 1 || num > 26 || typeof num !== 'number') {
        return -1;
    }
    const leveller = 64;
    return String.fromCharCode(num + leveller);
};

function getUniqueid() {
    return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
}

function xmlHttpRequestHelper(requestURL, params, isPost, isAsync, successCallback, errorCallback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(isPost ? "POST" : "GET", requestURL, isAsync);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (isEmpty(params)) {
        xmlhttp.send();
    } else {
        xmlhttp.send(params);
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (isEmpty(successCallback) && isEmpty(errorCallback)) {
                return;
            }

            if (this.responseText != "0 results" && this.responseText.indexOf("0 results") == -1) {
                try {
                    var response;
                    try {
                        response = JSON.parse(this.responseText);
                    } catch (error) {
                        response = this.responseText;
                    }
                    if (!isEmpty(successCallback)) {
                        successCallback(response);
                    }
                    return xmlhttp;
                } catch (error) {
                    if (!isEmpty(errorCallback)) {
                        console.error("Error while processing success callback");
                        errorCallback(this.responseText);
                    } else {
                        console.error(this.responseText);
                    }
                    return xmlhttp;
                }
            }
            if (!isEmpty(errorCallback)) {
                errorCallback(this.responseText);
            } else {
                console.error(this.responseText);
            }
            return xmlhttp;
        }
    }
}

function calendarDatesOverlap(el1, el2) {
    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    if (rect1.top == rect2.bottom || rect1.bottom == rect2.top) {
        // sie berühren sich nur exakt und sind untereinander
        return false;
    }

    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    );
}

function isHexColorLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}

function isTextFitting(element) {
    return element.scrollWidth > element.getBoundingClientRect().width;
}

function resolveDateRange(from, till) {
    const datesArray = [];
    for (let date = new Date(from.getTime()); date <= till; date.setDate(date.getDate() + 1)) {
        datesArray.push(new Date(date));
    }
    return datesArray;
}

/**
 * Nimmt eine Form von HTML Iterable, wie einen Dom- Childlist und wandelt sie in einen statischen Array um.
 * Diese Methode existiert da zum Beispiel eine Liste von Kind- Elementen dynamisch ist und es zu 
 * ConcurrentModificationExceptions kommt wenn diese Kinder verändert werden währen der Array durch iteriert wird
 * 
 * @param {*} original das originale Array oder eine ander Instanz von Iterable
 * @returns eine statische Liste ohne Referenzen auf das original
 */
function fromArray(original) {
    var ret = [],
        length = original.length;

    for (var i = 0; i < length; i++) {
        ret.push(original[i]);
    }
    return ret;
}

function formatTimeHHMM(date) {
    if (isEmpty(date)) {
        date = new Date();
    }
    return date.toLocaleTimeString("de-de").substring(0, date.toLocaleTimeString().length - 3)
}

function formatDate(date) {
    var aktDate = !isEmpty(date) ? date : new Date();
    var day = (aktDate.getDate() + "0").length > 2 ? aktDate.getDate() : "0" + aktDate.getDate();
    var month = (aktDate.getMonth() + "0").length > 2 ? (aktDate.getMonth() + 1) : "0" + (aktDate.getMonth() + 1);
    var date = aktDate.getFullYear() + "-" + month + "-" + day;

    return date;
}

function formatDateGerman(date) {
    var aktDate = !isEmpty(date) ? date : new Date();
    var day = (aktDate.getDate() + "0").length > 2 ? aktDate.getDate() : "0" + aktDate.getDate();
    var month = (aktDate.getMonth() + "0").length > 2 ? (aktDate.getMonth() + 1) : "0" + (aktDate.getMonth() + 1);
    var date = day + "." + month + "." + aktDate.getFullYear();

    return date;
}

function formatGermanDateToInternational(date) {
    return date.substring(6, date.length) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2);
}

function formatDateDatabaseDE(_date) {
    if (isEmpty(_date) || _date.indexOf("-") == -1) {
        return "";
    }
    var parsed = new Date(_date);
    return parsed.toLocaleDateString("de-de");
}

function formatDateDEDatabase(_date) {
    if (isEmpty(_date) || _date.split(".").length != 3) {
        return "";
    }

    var split = _date.split(".");
    var parsed = new Date(split[2], split[1] - 1, split[0]);
    return formatDate(parsed);
}

/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9) {
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);

        var bubbles = eventName == "change" ? false : true;
        event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};

function getValueFromCheckbox(node) {
    if (isEmpty(node)) {
        return false;
    }
    return node.checked;
}

function getValueFromTextField(node) {
    if (isEmpty(node)) {
        return "";
    }
    return node.value;
}

function getValueFromDropdown(node) {
    if (isEmpty(node)) {
        // nothing selected in Dropdown
        return "";
    }
    return node.id.split("ID_").join("");
}

function getValueFromDropdownMultiple(node) {
    if (isEmpty(node) || isEmpty(node.children)) {
        return [];
    }
    var selectedEntries = node.children;
    var ret = [];
    for (var i = 0; i < selectedEntries.length; i++) {
        if (!isEmpty(selectedEntries[i].getAttribute("data-value"))) {
            ret.push(selectedEntries[i].getAttribute("data-value"));
        }
    }
    return ret;
}