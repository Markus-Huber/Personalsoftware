/** Builder Pattern, um ohne viel Code zu schreiben HTML Elemente erstellen zu können.*/
class ElementBuilder {
    _timeout;

    /** 
     * Erstellt einen Builder, der benutzt werden kann um schnell und ohne viel Code zu schreiben HTML Elemente zu erstellen.
     *
     * @param {*} htmlElement das zu zeichnenden HTML Element als String, div wird default mäßig gezeichnet
     */
    constructor(htmlElement) {
        if (!isEmpty(htmlElement)) {
            this.m_HtmlElement = htmlElement;
            if (htmlElement != "checkbox") {
                this.m_ChildElement = document.createElement(htmlElement);
            } else {
                this.m_ChildElement = document.createElement("label");
                this.cssClass("checkbox");
                new ElementBuilder("input").cssClass("checkbox__input").attribute("type", "checkbox").parent(this.m_ChildElement).build();
                new ElementBuilder("span").cssClass("checkbox__label").parent(this.m_ChildElement).build();
            }
        } else {
            this.m_ChildElement = document.createElement("div");
        }
        this.m_ParentElement = null;
    }

    /**
     * Dieser Methode können alle verfügbaren Werte bereits mitgegeben werden, falls die einzelnen Methoden des Builders nicht einzeln aufgerufen werden sollen.
     * Wenn alle übergebenen Parameter gültig sind, wird ein HTML Element zurück gegeben.
     * Bei allen übergebenen Parametern wird geprüft, ob diese leer sind mittels der isEmpty() Methode. 
     * Wenn also zwei gültige und ein ungültiger Parameter übergeben wurde, wird dieser fehlertollerant nicht beachtet.
     * 
     * @param {*} htmlElement das zu zeichnenden HTML Element als String, div wird default mäßig gezeichnet
     * @param {*} _id die ID, des zu zu zeichnenden HTML Element als String
     * @param {*} _children kann ein Text sein, der in das zu zeichnenden HTML Element geschrieben wird oder ein HTML Element, dass hinzugefügt wird oder eine Instance des ElementBuilders
     * @param {*} _parent das parent Element des zeichnenden HTML Elements, kann ein gültiges HTMl Element sein oder eine Instance des ElementBuilders
     * @param {*} _icon das Icon, dass in Form eines backgroundImages dem Element hinzugefügt wird
     * @param {*} _title der Titel, den das zu zeichnende HTMl Element erhält, der Sichtbar wird, wenn mit der Maus darüber gehovert wird
     * @param {*} _function gültige HTML Funktion, die bei beim Klick auf das Element ausgeführt werden soll
     * @param  {...*} _cssClasses eine oder beliebig viele css Klassen, die dem zu zeichnenden Element hinzugefügt werden
     */
    all(htmlElement, _id, _children, _parent, _icon, _title, _function, ..._cssClasses) {
        this.m_ChildElement = document.createElement("div");
        this.m_ParentElement = null;

        this.element(htmlElement);
        this.id(_id);
        this.children(_children);
        this.parent(_parent);
        this.icon(_icon);
        this.title(_title);
        this.onclick(_function);
        this.cssClass(_cssClasses);
        return this.build();
    };

    metaname(_name) {
        if (!isEmpty(_name)) {
            if (this.m_HtmlElement != "checkbox") {
                this.m_ChildElement.setAttribute("data-attribute", _name);
            } else {
                this.m_ChildElement.children[0].setAttribute("data-attribute", _name);
            }
        }
        return this;
    }

    changeListener = function (changeListener) {
        if (!isEmpty(changeListener)) {
            if (this.m_HtmlElement == "input") {
                this.m_ChildElement.addEventListener("change", function (event) {
                    if (!isEmpty(this._timeout)) {
                        window.clearTimeout(this._timeout);
                    }
                    this._timeout = window.setTimeout(() => {
                        changeListener(event, this.value);
                    }, 100);
                });
            }
        }
        return this;
    }

    /**
     * Mit dieser Methode wird dem zu zeichnenden Element eine feste ID gesetzt.
     * Bei dem übergebenen Parametern wird geprüft, ob dieser leer ost mittels der isEmpty() Methode. 
     * Wenn dieser also ungültig übergeben wurde, wird dieser fehlertollerant nicht beachtet und das Element bekommt dann KEINE ID.
     * 
     * @param {*} _id die ID, des zu zu zeichnenden HTML Element als String
     */
    id(_id) {
        if (!isEmpty(_id)) {
            this.m_ChildElement.id = _id;
        }
        return this;
    };

    /**
     * Dieser Methode können beliebig viele Kinder übergeben werden. Diese Kinder können entweder vollwertige HTML Elemente, Strings oder Instanzen des ElementBuilders sein.
     * Bei allen übergebenen Parametern wird geprüft, ob diese leer sind mittels der isEmpty() Methode. 
     * Wenn also zwei gültige und ein ungültiger Parameter übergeben wurde, wird dieser fehlertollerant nicht beachtet.
     * 
     * @param  {...*} _children können Texte sein, die in das zu zeichnenden HTML Element geschrieben wird oder HTML Elemente, die hinzugefügt werde oder Instancec des ElementBuilders
     */
    children(..._children) {
        if (!isEmpty(_children)) {
            if (this.m_HtmlElement.toLowerCase() == "checkbox") {
                _children.forEach(child => {
                    if (!isEmpty(child)) {
                        if (child) {
                            this.m_ChildElement.children[0].checked = true;
                        } else {
                            this.m_ChildElement.children[0].checked = false;
                        }
                    }
                });
            } else {
                _children.forEach(child => {
                    if (!isEmpty(child)) {
                        try {
                            if (child.m_ChildElement != undefined) {
                                this.m_ChildElement.appendChild(child.m_ChildElement);
                            } else {
                                this.m_ChildElement.appendChild(child);
                            }
                        } catch (error) {
                            if (!isEmpty(child)) {
                                if (this.m_ChildElement instanceof HTMLInputElement) {
                                    if (this._isDateField) {
                                        this.m_ChildElement.value = formatDateDatabaseDE(child);
                                    } else {
                                        this.m_ChildElement.value += child;
                                    }
                                }
                                this.m_ChildElement.innerHTML += child;
                            } else {
                                if (this.m_ChildElement instanceof HTMLInputElement) {
                                    child = "2021-11-27";
                                    if (this._isDateField) {
                                        this.m_ChildElement.value = formatDateDatabaseDE(child);
                                    } else {
                                        this.m_ChildElement.value += child;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            return this;
        }
    }

    /**
     * Setzt das Parent Element des zu zeichnenden HTML Elements. Kann ein vollwertiges HTML Element sein oder eine Instanz des ElementBuilders sein.
     * Bei dem übergebenen Parameter wird geprüft, ob dieser leer ist mittels der isEmpty() Methode. 
     * Ist das Element nicht nach der oberen Logik leer sondern ungültig, wird eine Exception geworfen.
     * 
     * Das Element wird dem Parent aber erst hinzugefügt, wenn die Methode build() aufgerufen wird!
     * 
     * @param {*} _parent das parent Element des zeichnenden HTML Elements, kann ein gültiges HTMl Element sein oder eine Instance des ElementBuilders
     */
    parent(_parent) {
        if (!isEmpty(_parent)) {
            if (_parent.m_ChildElement != undefined) {
                this.m_ParentElement = _parent.m_ChildElement;
            } else {
                this.m_ParentElement = _parent;
            }
        }
        return this;
    };

    /**
     * Setzt ein Icon dem zu hinzufügenden Element in Form eines CSS BackgroundImages.
     * Bei dem übergebenen Parameter wird geprüft, ob dieser leer ist mittels der isEmpty() Methode. 
     * Ist das Element nicht nach der oberen Logik leer sondern ungültig, wird eine Exception geworfen.
     * Es kann auch eine Exception auftreten, wenn das Bild nicht gefunden wird.
     * 
     * @param {*} _icon das Icon, dass in Form eines backgroundImages dem Element hinzugefügt wird
     */
    icon(_icon) {
        if (!isEmpty(_icon)) {
            this.m_ChildElement.style.backgroundImage = "url('./img/" + _icon + "')";
        }
        return this;
    }

    /**
     * Fügt dem zu zeichnenden HTMl Element einen Titel hinzu, darf nur ein String sein!
     * Bei dem übergebenen Parameter wird geprüft, ob dieser leer ist mittels der isEmpty() Methode.
     * Ist er leer, bekommt dieses Element keinen Titel. 
     * 
     * @param {*} _title der Titel, den das zu zeichnenden HTMl Element erhält, der Sichtbar wird, wenn mit der Maus darüber gehovert wird
     */
    title(_title) {
        if (!isEmpty(_title)) {
            var wrapperDiv = document.createElement("div");
            wrapperDiv.innerHTML = _title;
            this.m_ChildElement.title = wrapperDiv.innerHTML;
        }
        return this;
    }

    /**
     * Fügt dem zu zeichnenden HTMl Element ein Klick-Event hinzu. Muss eine gültige function sein, sonst führt sie bei der Ausführung zu Fehler.
     * Wird nicht evaluiert!
     * Die aufgerufene Methode bekommt immer die This Referenz auf das Objekt mit.
     * 
     * Bei dem übergebenen Parameter wird geprüft, ob dieser leer ist mittels der isEmpty() Methode.
     * Ist er leer, bekommt dieses Element kein Klick-Event
     * 
     * @param {*} _function gültige HTML Funktion, die bei beim Klick auf das Element ausgeführt werden soll
     */
    onclick(_function) {
        if (!isEmpty(_function)) {
            this.m_ChildElement.onclick = function () {
                _function(this);
            }
        }
        return this;
    }

    /**
     * Fügt dem zu zeichnenden HTMl Element ein Keyup-Event hinzu. Muss eine gültige function sein, sonst führt sie bei der Ausführung zu Fehler.
     * Wird nicht evaluiert!
     * Die aufgerufene Methode bekommt immer die This Referenz auf das Objekt mit.
     * 
     * Bei dem übergebenen Parameter wird geprüft, ob dieser leer ist mittels der isEmpty() Methode.
     * Ist er leer, bekommt dieses Element kein Klick-Event
     * 
     * @param {*} _function gültige HTML Funktion, die bei beim Klick auf das Element ausgeführt werden soll
     */
    onkeyup(_function) {
        if (!isEmpty(_function)) {
            this.m_ChildElement.onkeyup = function () {
                _function(this);
            }
        }
        return this;
    }

    attribute(_property, _value, _isRestriced = true) {
        if (!isEmpty(_property)) {
            if (_property == "type" && _value == "date" && this.m_HtmlElement == "input") {
                this._isDateField = true;
                var options = new TheDatepicker.Options();
                options.showDeselectButton_ = true;
                options.showCloseButton_ = false;
                options.inputFormat_ = "d.m.Y";
                options.daysOutOfMonthVisible_ = true;
                if (_isRestriced) {
                    options.minDate_ = new Date("1900-01-01");
                    options.maxDate_ = new Date((new Date().getFullYear() + 1) + "-12-31");
                }
                var datepicker = new TheDatepicker.Datepicker(this.m_ChildElement, null, options);
                this._applyAfterAttach = function () {
                    datepicker.render();
                }
            } else if (_property == "type" && _value == "time" && this.m_HtmlElement == "input") {
                this.m_ChildElement.onkeydown = (event) => {
                    if (event.altKey || event.ctrlKey || event.metaKey ||
                        event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowUp" || event.code == "ArrowDown" ||
                        event.code == "Backspace" || event.code == "Delete" || event.code == "Home" || event.code == "End") {
                        return;
                    }
                    let newValue = this.m_ChildElement.value + event.key;
                    if (!(/^[0-9:]+$/.test(newValue)) || newValue.split(":").length > 2) {
                        event.preventDefault();
                    }
                }
                this.m_ChildElement.onblur = (event) => {
                    let value = this.m_ChildElement.value;
                    if (isEmpty(value)) {
                        return;
                    }

                    let regex = new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/);
                    if (regex.test(value)) {
                        return;
                    }

                    // trying to fix it
                    if (value.length > 4) {
                        let howMuch = value.indexOf(":") != -1 ? 5 : 4;
                        value = value.substring(0, howMuch);
                    }
                    if (value.split(":").join("").length == 4) {
                        value = value.split(":").join("");
                        value = value.substring(0, 2) + ":" + value.substring(2);
                    }

                    if (!regex.test(value)) {
                        if (value.indexOf(":") == -1) {
                            if (value.length == 2) {
                                value = value + ":00";
                            } else {
                                value = value.substring(0, 2) + ":" + value.substring(2);
                            }
                        }

                        let parts = value.split(":");
                        if (parts[1] > 59) {
                            parts[0] = (new Number(parts[0]) + 1) + "";
                            if (parts[0].length == 1) {
                                parts[0] = "0" + parts[0];
                            }
                            parts[1] = (new Number(parts[1]) - 60) + "";
                            if (parts[1].length == 1) {
                                parts[1] = "0" + parts[1];
                            }
                        }
                        if (parts[0] > 24) {
                            parts[0] = "00";
                        }
                        if (parts[0].length == 0) {
                            parts[0] = "00";
                        }
                        if (parts[1].length == 0) {
                            parts[1] = "00";
                        }

                        if (parts[0].length == 1) {
                            parts[0] = "0" + parts[0];
                        }
                        if (parts[1].length == 1) {
                            parts[1] = parts[1] + "0";
                        }

                        value = parts.join(":");
                    }

                    let isRepairable = regex.test(value);
                    if (!isRepairable) {
                        value = "00:00";
                    }

                    showAlert("warning", "Der eingegebene Wert [" + this.m_ChildElement.value + "] ist ungültig.<br>" +
                        "Korrigierten Wert " + value + " übernehmen?", true, () => {
                            this.m_ChildElement.value = value;
                            this.m_ChildElement.dispatchEvent(new Event('change'));
                        }, () => {
                            this.m_ChildElement.focus();
                        });
                }

            } else if (_property == "required" && _value) {
                this.m_ChildElement.innerHTML = this.m_ChildElement.innerHTML + "<font class='required'>&nbsp;*</font>";
            } else {
                this.m_ChildElement.setAttribute(_property, isEmpty(_value) ? "" : _value);
            }
        }
        return this;
    }

    /**
     * Überschreibt eine spezifische CSS Property 
     * 
     * @param {String} _property der Wert, der überschrieben werden soll
     * @param {String} _value der neue Wert der übergebenen Property
     * @param {Boolean} _important legt fest ob der neue Wert mit "!important" gesetzt werden soll
     */
    cssProperty(_property, _value, _important) {
        if (!isEmpty(_property)) {
            this.m_ChildElement.style.setProperty(_property, isEmpty(_value) ? "" : _value, _important ? "important" : "");
        }
        return this;
    }

    /**
     * Fügt eine oder mehrere css Klassen zu dem zu zeichnenden HTML Element hinzu.
     * Bei allen übergebenen Parametern wird geprüft, ob diese leer sind mittels der isEmpty() Methode. 
     * Wenn also zwei gültige und ein ungültiger Parameter übergeben wurde, wird dieser fehlertollerant nicht beachtet.
     * 
     * @param  {...*} _cssClasses _cssClasses eine oder beliebig viele css Klassen, die dem zu zeichnenden Element hinzugefügt werden
     */
    cssClass(..._cssClasses) {
        if (!isEmpty(_cssClasses)) {
            _cssClasses.forEach(cssClass => {
                if (!isEmpty(cssClass)) {
                    this.m_ChildElement.classList.add(cssClass);
                }
            });
        }
        return this;
    };

    /** Liefert das valide, zusammengebaute HTMl Element, keine Instanz des ElementBuilders mehr. 
     * Wenn das zuvor übergebene Parent Element valide war, wird auch das zu zeichnende Element dem Parent angehängt.
     */
    build() {
        if (!isEmpty(this.m_ParentElement)) {
            this.m_ParentElement.appendChild(this.m_ChildElement);
        }
        if (!isEmpty(this._applyAfterAttach)) {
            setTimeout(() => {
                this._applyAfterAttach(this.m_ChildElement);
            }, 100);
        }
        return this.m_ChildElement;
    }
}

function showAlert(type, message, modal, okCallback, abortCallback, okMessage = "Akzeptieren", abortMessage = "Abbrechen", onlyOneButton) {
    for (let i = 0; i < document.getElementsByClassName("alert").length; i++) {
        document.getElementsByClassName("alert")[0].parentElement.removeChild(document.getElementsByClassName("alert")[0]);
    }

    let popup = new ElementBuilder("div").cssClass("alert").parent(content);
    let popupContent = new ElementBuilder("div").cssClass("alert-content").parent(popup).build();
    let contentWrapper = new ElementBuilder("div").cssClass("content-wrapper").parent(popupContent)
    let image = new ElementBuilder("img").cssClass("type");
    if (type == "warning") {
        image.attribute("src", "./img/icon/warning.PNG");
    }
    contentWrapper.children(image, new ElementBuilder("div").cssClass("message-wrapper").children(
        new ElementBuilder("div").cssClass("message").children(message)
    ));
    contentWrapper.build();

    //TODO: Wenn modal dann alles im Hintergrund blockieren..
    new ElementBuilder("div").cssClass("buttons").children(
        new ElementBuilder("button").children(okMessage).onclick(() => {
            if (okCallback) {
                okCallback();
                for (let i = 0; i < document.getElementsByClassName("alert").length; i++) {
                    document.getElementsByClassName("alert")[0].parentElement.removeChild(document.getElementsByClassName("alert")[0]);
                }
            }
        }),
        onlyOneButton ? null : new ElementBuilder("button").children(abortMessage).onclick(() => {
            if (abortCallback) {
                abortCallback();
                for (let i = 0; i < document.getElementsByClassName("alert").length; i++) {
                    document.getElementsByClassName("alert")[0].parentElement.removeChild(document.getElementsByClassName("alert")[0]);
                }
            }
        }),
    ).parent(popupContent).build();
    popup.build();
}

function askOpenedPopupToClose(successCallback) {
    var openWindows = document.getElementsByClassName("popup");
    switch (openWindows.length) {
        case 0:
            if(!isEmpty(successCallback)){
                successCallback();
            }
            break;
        case 1:
            let successListener = () => {
                if(!isEmpty(successCallback)){
                    successCallback();
                }
            };
            let noSuccessListener = () => {
                openWindows[0].removeEventListener("popupClosed", successListener);                
                openWindows[0].removeEventListener("popupClosed", noSuccessListener);                
            };

            openWindows[0].addEventListener("popupClosed", successListener);
            openWindows[0].addEventListener("popupNotClosed", noSuccessListener);
            
            for (let elem of openWindows[0].getElementsByClassName("hover-effect-zoom")) {
                if (elem.innerHTML === "Abbrechen" || elem.innerHTML === "Schließen" || elem.innerHTML === "✖") {
                    elem.click();
                    break;
                }
            }
            break;
        default:
            console.error("Zu viele Fenster sind offen, welches soll wann wie geschlossen werden?")
    }
}

// Object.values nachrüsten. 
// Sorgt dafür das die Methode Object.values(...) aufgerufen werden kann
if (!Object.values) Object.values = o => Object.keys(o).map(k => o[k]);

/**
 * Methode um HTML Elemente zu erstellen
 * 
 * @deprecated #ElementBuilder nutzen
 * 
 * @param {String} type type of HTML element, e.g. "div" or "DIV", case insensitive
 * @param {String} id the new id of the element
 * @param {HTML Element} children the child element of this new to be created element
 * @param {HTML Elements} parent the parent element of this new to be created element (no appendChild necesarry)
 * @param {...String} classList die CSS Klassen für das Objekt
 */
function createElement(type, id, children, parent, ...classList) {
    if (type == "combobox") {
        if (children == null || children == undefined || children == "") {
            children = {};
        }
        var select = document.createElement("select");
        if (id != null && classList != undefined) {
            select.id = id;
        }

        Object.entries(children).forEach(elem => {
            select.add(new Option(elem[1], elem[0]));
        });
        select.selectedIndex = -1;
        if (parent != null && parent != undefined) {
            try {
                parent.appendChild(select);
            } catch (error) {
                parent.innerHTML = select;
            }
        }
        if (classList != null && classList != undefined) {
            classList.forEach(arg => select.classList.add(arg));
        }

        return select;
    }
    var ret = document.createElement(type);
    if (id != null) {
        ret.id = id;
    }
    if (classList != null && classList != undefined) {
        classList.forEach(arg => ret.classList.add(arg));
    }
    if (children != null && classList != undefined) {
        if (type != "img" && type != "video") {
            try {
                ret.appendChild(children);
            } catch (error) {
                if (ret.innerText) {
                    ret.innerText = children;
                } else {
                    if (type == "input") {
                        ret.value = children;
                    } else {
                        ret.innerHTML = children;
                    }
                }
            }
        } else {
            ret.src = children;
            if (type == "video") {
                ret.controls = true;
                ret.preload = "auto";
                ret.classList.add("academyPicture");
            }
        }
    }
    if (parent != null && parent != undefined) {
        try {
            parent.appendChild(ret);
        } catch (error) {
            parent.innerHTML = ret;
        }
    }
    return ret;
}

/**
 * Methode um HTML Elemente zu erstellen
 * 
 * @deprecated #ElementBuilder nutzen
 * 
 * @param {String} type type of HTML element, e.g. "div" or "DIV", case insensitive
 * @param {String} id the new id of the element
 * @param {HTML Element} children the child element of this new to be created element
 * @param {HTML Elements} parent the parent element of this new to be created element (no appendChild necesarry)
 * @param {*} adjuster json object with additional styles, click events, etc.
 * Syntaxt for adjuster:
 * [
 *      {"type":"style","property":"height","value":"30px"}
 * ]
 * property can be empty
 * @param {...String} classList die CSS Klassen für das Objekt
 */
function createElementEx(type, id, children, parent, adjuster, ...classList) {
    var ret = createElement(type, id, children, parent, ...classList);
    if (adjuster != undefined && adjuster != null) {
        if (adjuster.type == undefined) {
            //more than one row
            for (var i = 0; i < Object.keys(adjuster).length; i++) {
                var currentAttr = adjuster[i];
                var attribute = currentAttr.type;
                var value = currentAttr.value;
                var property = currentAttr.property;
                applyAttributeToElem(attribute, property, value)
            }
        } else {
            var attribute = adjuster.type;
            var value = adjuster.value;
            var property = adjuster.property;
            applyAttributeToElem(attribute, property, value)
        }
    }

    function applyAttributeToElem(attribute, property, value) {
        if (attribute == "style") {
            var styleVal = property + ":" + value;
            ret.setAttribute(attribute, styleVal);
        } else if (attribute == "click") {
            ret.onclick = new Function(value);
        } else {
            if (attribute == null || attribute == undefined || attribute.trim() == "") {
                console.warn("----------------------------------------")
                console.warn("handed adjuster is invalid, attribute cannot be empty or null");
                console.warn(adjuster);
                console.warn("----------------------------------------");
                return ret;
            }
            if (value == null || value == undefined) {
                console.warn("----------------------------------------")
                console.warn("handed adjuster is invalid, value cannot be null");
                console.warn(adjuster);
                console.warn("----------------------------------------")
                return ret;
            }
            ret.setAttribute(attribute, value);
        }
    }

    return ret;
}