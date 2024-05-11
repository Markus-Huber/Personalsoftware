class Shift {

    constructor(id, weekday, begin, end, cm, mitarbeiter, referenceDate) {
        this._id = id;
        this._weekday = weekday;
        this._begin = begin;
        this._end = end;
        this._cm = cm;
        this._mitarbeiter = [];
        this.setMitarbeiter(mitarbeiter);
        this._referenceDate = referenceDate;
    }

    getId() {
        return this._id;
    }

    getWeekday() {
        return this._weekday;
    }

    setWeekday(weekday) {
        this._weekday = weekday;
    }

    getBegin() {
        return this._begin;
    }

    setBegin(begin) {
        this._begin = begin;
    }

    getEnd() {
        return this._end;
    }

    setEnd(end) {
        this._end = end;
    }

    getCM() {
        return this._cm;
    }

    setCM(cm) {
        this._cm = cm;
    }

    setReferenceDate(referenceDate) {
        this._referenceDate = referenceDate;
    }

    getReferenceDate() {
        return this._referenceDate;
    }

    getMitarbeiter() {
        return this._mitarbeiter;
    }

    setMitarbeiter(mitarbeiter) {
        this._mitarbeiter = [].concatIfNotNull(mitarbeiter);
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            let mitarbeiter = element["mitarbeiter"];
            if(!isEmpty(mitarbeiter)){
                mitarbeiter = mitarbeiter.split(",");
            };
            let weekday = element["weekday"];
            if(isEmpty(weekday) && !isEmpty(element["referenceDate"])){
                weekday = new Date(element["referenceDate"]).getDay();
            }
            let begin = element["begin"];
            if(begin.length == 8 && begin.indexOf(":", begin.indexOf(":")+1) > 0){
                begin = begin.substring(0, 5);
            }
            let end = element["end"];
            if(end.length == 8 && end.indexOf(":", end.indexOf(":")+1) > 0){
                end = end.substring(0, 5);
            }

            ret[element["id"]] = new Shift(element["id"], weekday, begin, end, element["cm"], mitarbeiter, element["referenceDate"]);
        });
        return ret;
    }
}

class Weekday {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }
}

class Mitarbeiter {
    constructor(id, workingHours, firstName, lastName) {
        this._id = id;
        this._workingHours = workingHours;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    _standorte = [];

    getId() {
        return this._id;
    }

    getWorkingHours() {
        return this._workingHours;
    }

    getFirstName() {
        return this._firstName;
    }

    getLastName() {
        return this._lastName;
    }

    getStandorte() {
        return this._standorte;
    }

    resolveName() {
        if (!isEmpty(this._firstName)) {
            if (!isEmpty(this._lastName)) {
                return this._firstName + " " + this._lastName;
            }
            return this._firstName;
        }
        return this._lastName;
    }

    resolveShortName() {
        if (!isEmpty(this._lastName)) {
            return this._lastName;
        }
        return this._firstName;
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new Mitarbeiter(element["id"], element["workingHours"], element["firstName"], element["lastName"])
        });
        return ret;
    }
}

class CM {
    constructor(id, name, color) {
        this._id = id;
        this._name = name;
        this._color = color;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getColor() {
        return this._color;
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new CM(element["id"], element["name"], element["color"]);
        });
        return ret;
    }
}

class WorkingHour {
    constructor(id, name, hours) {
        this._id = id;
        this._name = name;
        this._hours = hours;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getHours() {
        return this._hours;
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new WorkingHour(element["id"], element["name"], element["hours"]);
        });
        return ret;
    }
}

class Standort {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new Standort(element["id"], element["name"]);
        });
        return ret;
    }
}