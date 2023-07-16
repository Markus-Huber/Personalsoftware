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
        return this.weekday;
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
}