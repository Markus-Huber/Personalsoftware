class Shift {
    _mitarbeiter = [];

    constructor(id, weekday, begin, end, cm) {
        this._id = id;
        this._weekday = weekday;
        this._begin = begin;
        this._end = end;
        this._cm = cm;
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

    getCM(){
        return this._cm;
    }

    setCM(cm) {
        this._cm = cm;
    }

    getMitarbeiter(){
        return this._mitarbeiter;
    }

    setMitarbeiter(mitarbeiter){
        this._mitarbeiter = [].concat(mitarbeiter);
    }

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret.push(new Shift(element["id"], element["weekday"], element["begin"], element["end"], element["cm"]))
        });
        return ret;
    }
}

class Weekday {
    constructor(id, name){
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
    constructor(id, workingHours, firstName, lastName){
        this._id = id;
        this._workingHours = workingHours;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret[element["id"]] = new Mitarbeiter(element["id"], element["workingHours"], element["firstName"], element["lastName"])
        });
        return ret;
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

    getStandorte(){
        return this._standorte;
    }

    resolveName(){
        if(!isEmpty(this._firstName)){
            if(!isEmpty(this._lastName)){
                return this._firstName + " " + this._lastName;
            }
            return this._firstName;
        }
        return this._lastName;
    }

    resolveShortName(){
        if(!isEmpty(this._lastName)){
            return this._lastName;
        }
        return this._firstName;
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

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret.push(new CM(element["id"], element["name"], element["color"]))
        });
        return ret;
    }
}

class WorkingHour{
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

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret.push(new WorkingHour(element["id"], element["name"], element["hours"]))
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

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret.push(new Standort(element["id"], element["name"]))
        });
        return ret;
    }
}