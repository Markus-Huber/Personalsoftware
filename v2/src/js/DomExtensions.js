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

Date.prototype.standardDate = function () {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

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
                    var response = JSON.parse(this.responseText);
                    if (!isEmpty(successCallback)) {
                        successCallback(response);
                    }
                    return xmlhttp;
                } catch (error) {
                    if (!isEmpty(successCallback)) {
                        successCallback(this.responseText);
                    }
                    return xmlhttp;
                }
            }
            if (!isEmpty(errorCallback)) {
                errorCallback(this.responseText);
            }
            return xmlhttp;
        }
    }
}

function formatDate(date) {
    var aktDate = !isEmpty(date) ? date : new Date();
    var day = (aktDate.getDate() + "0").length > 1 ? aktDate.getDate() : "0" + aktDate.getDate();
    var month = (aktDate.getMonth() + "1").length > 1 ? (aktDate.getMonth() + 1) : "0" + (aktDate.getMonth() + 1);
    var date = aktDate.getFullYear() + "-" + month + "-" + day;

    return date;
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