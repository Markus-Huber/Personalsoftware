class Shift {
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

    getBegin() {
        return this._begin;
    }

    getEnd() {
        return this._end;
    }

    getCM(){
        return this._cm;
    }

    static marshall(data){
        let ret = [];
        Object.values(data).forEach(element => {
            ret.push(new Shift(element["id"], element["weekday"], element["begin"], element["end"], element["cm"]))
        });
        return ret;
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
            ret.push(new Mitarbeiter(element["id"], element["workingHours"], element["firstName"], element["lastName"]))
        });
        return ret;
    }

    standorte = [];
    
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

    resolveName(){
        if(!isEmpty(this._firstName)){
            if(!isEmpty(this._lastName)){
                return this._firstName + " " + this._lastName;
            }
            return this._firstName;
        }
        return this._lastName;
    }
}

class CM {
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
            ret.push(new CM(element["id"], element["name"]))
        });
        return ret;
    }
}
