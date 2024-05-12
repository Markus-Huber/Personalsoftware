class Shift {

    constructor(id, weekday, begin, end, cm, mitarbeiter, referenceDate) {
        this.id = id;
        this.weekday = weekday;
        this.begin = begin;
        this.end = end;
        this.cm = cm;
        this.mitarbeiter = [];
        this.setMitarbeiter(mitarbeiter);
        this.referenceDate = referenceDate;
    }

    getId() {
        return this.id;
    }

    getWeekday() {
        return this.weekday;
    }

    setWeekday(weekday) {
        this.weekday = weekday;
    }

    getBegin() {
        return this.begin;
    }

    setBegin(begin) {
        this.begin = begin;
    }

    getEnd() {
        return this.end;
    }

    setEnd(end) {
        this.end = end;
    }

    getCM() {
        return this.cm;
    }

    setCM(cm) {
        this.cm = cm;
    }

    setReferenceDate(referenceDate) {
        this.referenceDate = referenceDate;
    }

    getReferenceDate() {
        return this.referenceDate;
    }

    getMitarbeiter() {
        return this.mitarbeiter;
    }

    setMitarbeiter(mitarbeiter) {
        this.mitarbeiter = [].concatIfNotNull(mitarbeiter);
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            let mitarbeiter = element["mitarbeiter"];
            mitarbeiter = Mitarbeiter.marshall(mitarbeiter);
            mitarbeiter = mitarbeiter.filter(mitarbeiter => mitarbeiter);
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
            let cm = [];
            cm.push(element["cm"]);
            cm = CM.marshall(cm)
            cm = cm.filter(elem => elem);
            cm = cm[0];

            ret[element["id"]] = new Shift(element["id"], weekday, begin, end, cm, mitarbeiter, element["referenceDate"]);    
        });
        return ret;
    }
}

class Weekday {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
}

class Mitarbeiter {
    constructor(id, workingHours, firstName, lastName) {
        this.id = id;
        this.workingHours = workingHours;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    standorte = [];

    getId() {
        return this.id;
    }

    getWorkingHours() {
        return this.workingHours;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getStandorte() {
        return this.standorte;
    }

    resolveName() {
        if (!isEmpty(this.firstName)) {
            if (!isEmpty(this.lastName)) {
                return this.firstName + " " + this.lastName;
            }
            return this.firstName;
        }
        return this.lastName;
    }

    resolveShortName() {
        if (!isEmpty(this.lastName)) {
            return this.lastName;
        }
        return this.firstName;
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
        this.id = id;
        this.name = name;
        this.color = color;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getColor() {
        return this.color;
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
        this.id = id;
        this.name = name;
        this.hours = hours;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getHours() {
        return this.hours;
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
        this.id = id;
        this.name = name;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    static marshall(data) {
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new Standort(element["id"], element["name"]);
        });
        return ret;
    }
}