let shifts = [];
let fromTills = [];
let from;
let till;
let currentWeekFrom;
let currentWeekTill;
let copyDropdown;

function showShift() {
    content.innerHTML = null;
    new ElementBuilder("div").parent(content).id("schichtplan-creator").build();

    const calendarEl = document.getElementById('schichtplan-creator')
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        titleFormat: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        },
        dayHeaderFormat: {
            weekday: 'long',
            month: '2-digit',
            day: '2-digit'
        },
        headerToolbar: {
            center: "title",
            left: "",
        },
        locale: 'de',
        firstDay: startDayOfShift,
        allDaySlot: false,
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
            startTime: '14:00',
            endTime: '24:00',
        },
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'full'
        },
        scrollTime: '14:00:00',

        selectable: true,
        selectMirror: true,
        buttonText: {
            today: 'Aktueller Plan',
        },
        buttonHints: {
            today: 'Aktueller Plan',
            prev: "Vorheriger Plan",
            next: "Nächster Plan",
        },

        // Create new event
        select: function (arg) {
            addShift(arg);
        },

        eventContent: function (info) {
            return {
                html: info.event.title
            };
        },
        eventClick: function (info) {
            if (info.jsEvent.detail == 2) {
                let begin = new Date(info.event.start);
                let end = new Date(info.event.end);

                shifts.forEach(shift => {
                    if (shift.getId() == info.event._def.publicId) {
                        addShiftPopup(begin, end, shift, true);
                    }
                });
            }
        },
        datesSet: (evt) => {
            from = new Date(evt.start);
            if (isEmpty(currentWeekFrom)) {
                currentWeekFrom = new Date(from);
            }
            let fromString = formatDate(new Date(evt.start));

            till = new Date(evt.end);
            till.setDate(till.getDate() - 1);
            if (isEmpty(currentWeekTill)) {
                currentWeekTill = new Date(till);
            }
            let tillString = formatDate(till);

            if (!isEmpty(document.getElementById("copyDropdown"))) {
                if (from != currentWeekFrom && from < currentWeekFrom) {
                    document.getElementById("copyDropdown").style.display = "none";
                } else {
                    document.getElementById("copyDropdown").style.display = null;
                }
            }

            if (fromTills[fromString + tillString]) {
                checkOverlap();
                return;
            }
            new xmlHttpRequestHelper("src/php/requestShift.php", "from=" + fromString + "&till=" + tillString, true, true, (shiftsRaw) => {
                shifts = Shift.marshall(shiftsRaw);
                fromTills[fromString + tillString] = true;
                shifts.forEach(shift => addEvent(shift));
            });
        },
        eventAdd: () => {
            checkOverlap();
        }
    })
    calendar.render();

    buildCopyShiftsButton();

    let date = new Date('2022/08/22');
    for (let i = 0; i <= 6; i++) {
        weekDays[i] = new Weekday(i, date.toLocaleDateString("de-DE", {
            weekday: 'long'
        }));
        date.setDate(date.getDate() + 1);
    }
    weekDays = weekDays.slice(startDayOfShift - 1).concat(weekDays.slice(0, startDayOfShift - 1));
}

function buildCopyShiftsButton() {
    let parent = document.getElementsByClassName("fc-today-button");
    if (parent.length < 1) {
        return;
    }
    parent = parent[0].parentElement;

    let weeksById = {};
    let weekFrom = new Date(new Date().setDate(from.getDate() - 7));
    let weekTill = new Date(new Date().setDate(till.getDate() - 7));

    for (let i = 0; i < 4; i++) {
        weeksById[i] = formatDateGerman(weekFrom) + " - " + formatDateGerman(weekTill);
        weekFrom.setDate(weekFrom.getDate() - 7);
        weekTill.setDate(weekTill.getDate() - 7);
    }
    copyDropdown = new Dropdown({
        data: weeksById,
        placeholder: "Schichten kopieren von..."
    }).metaName("wochen").setValue().changeListener((event, item) => {
        if (isEmpty(copyDropdown.getValue())) {
            return;
        }
        showAlert("info", "Mitarbeiter pro CM mit kopieren?", true, () => {
            let week = Object.values(weeksById)[copyDropdown.getValue()].split(" - ");
            copyShifts(week, true);
        }, () => {
            let week = Object.values(weeksById)[copyDropdown.getValue()].split(" - ");
            copyShifts(week, false);
        }, "Ja", "Nein");
    });
    let built = copyDropdown.build();
    built.id = "copyDropdown";

    parent.prepend(built);
}

function copyShifts(week, withEmployees) {
    new xmlHttpRequestHelper("src/php/copyShifts.php",
        "oldFrom=" + formatGermanDateToInternational(week[0]) + "&oldTill=" + formatGermanDateToInternational(week[1]) + "&withEmployees=" + withEmployees +
        "&newFrom=" + formatDateGerman(from) + "&newTill=" + formatDateGerman(till),
        true, true, () => {
            //refresh
            calendar.next();
            calendar.prev();
            copyDropdown.setValue();
        });
}

function checkOverlap() {
    let dayColumns = document.getElementById("schichtplan-creator").getElementsByClassName("fc-timegrid-col");
    for (let dayColumn of dayColumns) {
        let dates = dayColumn.getElementsByClassName("fc-timegrid-event-harness");
        if (dates.length > 1) {
            let elementsToAdjust = [];
            let width;
            let highestNumberOfOverlaps = 0;

            for (let date of dates) {
                let numberOfOverlaps = 1;
                for (let date2 of dates) {
                    if (date != date2) {
                        if (calendarDatesOverlap(date, date2)) {
                            numberOfOverlaps++;
                        }
                    }
                }
                if (numberOfOverlaps > 1) {
                    if (highestNumberOfOverlaps < numberOfOverlaps) {
                        highestNumberOfOverlaps = numberOfOverlaps;
                        width = ((100 / numberOfOverlaps) - 10) + "%";
                    }
                    elementsToAdjust.push(date);
                }
            }
            if (!isEmpty(width)) {
                for (let elemToAdjust of elementsToAdjust) {
                    elemToAdjust.style.maxWidth = width;
                    if (!isTextFitting(elemToAdjust)) {
                        elemToAdjust.classList.add("fc-timegrid-event-harness-vertical-text");
                    }
                }
            }
            setTimeout(() => {
                if (!isEmpty(width)) {
                    for (let elemToAdjust of elementsToAdjust) {
                        elemToAdjust.style.maxWidth = width;
                        if(elementsToAdjust.length > 2){
                            window.fitText(elemToAdjust.getElementsByClassName("fc-event-main")[0], 0.3);
                        }
                    }
                }    
            }, 100);
        }
    };
}

function addShiftPopup(begin, end, shift, isEdit) {
    if (isEmpty(begin)) {
        begin = new Date();
    }
    if (isEmpty(end)) {
        end = new Date();
    }
    if (isEmpty(shift)) {
        shift = new Shift();
    }
    let dirty = false;

    // Werte aus den übergebenen Events übertragen
    shift.setBegin(formatTimeHHMM(begin));
    shift.setEnd(formatTimeHHMM(end));

    let parent = new ElementBuilder("div").attribute("id", "schichtplan-neue-schicht").parent(content).cssClass("popup").build();

    let saveFunction = () => {
        if (isEmpty(shift.getBegin()) || isEmpty(shift.getEnd()) || shift.getMitarbeiter().length < 1 || isEmpty(shift.getWeekday())) {
            let message = "Die Pflichtfelder:<br>" +
                (isEmpty(shift.getBegin()) ? "<i>Begin</i><br>" : "") +
                (isEmpty(shift.getEnd()) ? "<i>Ende</i><br>" : "") +
                (shift.getMitarbeiter().length < 1 ? "<i>Mitarbeiter eins</i><br>" : "") +
                (isEmpty(shift.getWeekday()) ? "<i>Wochentag</i><br>" : "") +
                "dürfen nicht leer sein&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
            showAlert("warning", message, true, () => {}, () => {}, "OK", "", true);
            return;
        }
        saveShift(shift, begin, end, isEdit);
        parent.parentElement.removeChild(parent);
    }

    let closeFunction = () => closeSomething(dirty, () => {
        parent.parentElement.removeChild(parent);
        const event = new Event("popupClosed");
        parent.dispatchEvent(event);
    }, () => {
        const event = new Event("popupNotClosed");
        parent.dispatchEvent(event);
    }, isEdit);

    new ElementBuilder("div").cssClass("popup-header").children(
        new ElementBuilder("h2").children("Schicht " + (isEdit ? "bearbeiten" : "planen")),
        new ElementBuilder("h2").children("✔").title("Speichern").cssProperty("padding", "0 1rem").cssClass("hover-effect-zoom").onclick(saveFunction),
        new ElementBuilder("h2").children("✖").title("Schließen").cssClass("hover-effect-zoom").onclick(closeFunction),
    ).parent(parent).build();

    let weekDaysById = {};
    weekDays.forEach(weekday => weekDaysById[weekday.getId()] = weekday.getName());

    let initialWeekday = 0;
    let dayAsString = begin.toLocaleDateString("de-de", {
        weekday: "long"
    });
    weekDays.forEach(weekday => {
        if (weekday.getName() === dayAsString) {
            initialWeekday = weekday.getId();
        }
    })

    let wochentagDropdown = new Dropdown({
        data: weekDaysById,
        placeholder: "z.B. " + weekDaysById[Object.keys(weekDaysById)[0]]
    }).metaName("wochentag").setValue(initialWeekday).changeListener((event, item) => {
        let weekDay = Object.keys(item)[0];
        let dates = resolveDateRange(from, till);
        dates.forEach(date => {
            if ((date.getDay() - 1) == weekDay) {
                date.setHours(shift.getBegin().substring(0, 2), shift.getBegin().substring(3, shift.getBegin().length));
                shift.setReferenceDate(date);
                begin = new Date(date);
                date.setHours(shift.getEnd().substring(0, 2), shift.getEnd().substring(3, shift.getEnd().length));
                end = new Date(date);
            }
        });
        shift.setWeekday(weekDay);
        dirty = true;
    });

    let mitarbeiterById = {};
    mitarbeiter.forEach(arbeiter => mitarbeiterById[arbeiter.getId()] = arbeiter.resolveName());

    let mitarbeiterValueChange = () => {
        let mitarbeiter = [].concatIfNotNull(mitarbeiter1Dropdown.getValue())
            .concatIfNotNull(mitarbeiter2Dropdown.getValue())
            .concatIfNotNull(mitarbeiter3Dropdown.getValue());

        shift.setMitarbeiter(mitarbeiter);
        dirty = true;
    };
    let mitarbeiter1Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue(shift.getMitarbeiter()[0]).changeListener(mitarbeiterValueChange);

    let mitarbeiter2Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue(shift.getMitarbeiter()[1]).changeListener(mitarbeiterValueChange);

    let mitarbeiter3Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue(shift.getMitarbeiter()[2]).changeListener(mitarbeiterValueChange);

    let cmsById = {};
    cms.forEach(cm => cmsById[cm.getId()] = cm.getName());
    let cmDropdown = new Dropdown({
        data: cmsById,
        placeholder: "z.B. Kasse 1"
    }).metaName("cm").setValue(shift.getCM()).changeListener((event, item) => {
        shift.setCM(Object.keys(item)[0]);
        dirty = true;
    });

    let parentTable = new ElementBuilder("table").cssClass("popup-table");
    new ElementBuilder("tr").children(
            new ElementBuilder("td").children(
                new ElementBuilder("table").children(
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Wochentag"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            wochentagDropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Anfang"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("type", "time")
                            .attribute("placeholder", "z.B. 08:00").attribute("value", formatTimeHHMM(begin))
                            .changeListener((event, value) => {
                                if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                                    shift.setBegin(value);
                                    begin.setHours(value.substring(0, 2), value.substring(3, value.length));
                                    dirty = true;
                                }
                            })
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Ende"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("type", "time")
                            .attribute("placeholder", "z.B. 15:30").attribute("value", formatTimeHHMM(end))
                            .changeListener((event, value) => {
                                if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                                    shift.setEnd(value);
                                    end.setHours(value.substring(0, 2), value.substring(3, value.length));
                                    dirty = true;
                                }
                            })
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "&emsp;"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td")
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "CM"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            cmDropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Mitarbeiter 1"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            mitarbeiter1Dropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Mitarbeiter 2"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            mitarbeiter2Dropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Mitarbeiter 3"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            mitarbeiter3Dropdown.build()
                        )
                    ),
                )
            ))
        .parent(parentTable).build();
    parent.appendChild(parentTable.build());

    parent.appendChild(new ElementBuilder("div").cssClass("button-bar").children(
        isEdit ? new ElementBuilder("button").cssClass("hover-effect-zoom").children("Löschen").onclick(() => {
            showAlert("warning", "Wollen Sie diese Schicht wirklich löschen?<br>Diese Aktion kann nicht rückgängig gemacht werden!", true, () => {
                new xmlHttpRequestHelper("src/php/deleteShift.php", "shift=" + shift.getId() + "&update=true", true, true, () => {
                    parent.parentElement.removeChild(parent);
                    const event = new Event("popupClosed");
                    parent.dispatchEvent(event);
                    calendar.getEventById(shift.getId()).remove();
                });
            }, () => {}, "Ja", "Nein");
        }) : undefined,
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Speichern").onclick(saveFunction),
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Abbrechen").onclick(closeFunction),
    ).build());
}

function saveShift(shift, begin, end, isEdit) {
    shift.setReferenceDate(formatDate(begin));
    if (isEdit) {
        new xmlHttpRequestHelper("src/php/saveShift.php", "shift=" + JSON.stringify(shift) + "&update=true", true, true, (shift) => {
            shift = Shift.marshall([].concat(shift));
            if (Object.values(shift).length != 1) {
                console.error(shift);
                return;
            }
            shift = Object.values(shift)[0];
            shifts[shift.getId()] = shift;

            let event = calendar.getEventById(shift.getId());
            event.remove();
            addEvent(shift, begin, end);
        }, (error) => showAlert("error", error, true, () => {}, () => {}, "OK", "", true));
    } else {
        new xmlHttpRequestHelper("src/php/saveShift.php", "shift=" + JSON.stringify(shift), true, true, (shift) => {
            shift = Shift.marshall([].concat(shift));
            if (Object.values(shift).length != 1) {
                console.error(shift);
                return;
            }
            shift = Object.values(shift)[0];
            shifts.push(shift);
            addEvent(shift, begin, end);
        }, (error) => showAlert("error", error, true, () => {}, () => {}, "OK", "", true));
    }
}

function addEvent(shift, begin = new Date(shift.getReferenceDate() + "T" + shift.getBegin()), end = new Date(shift.getReferenceDate() + "T" + shift.getEnd())) {
    let mtbs = [];
    shift.getMitarbeiter().forEach(id => {
        mtbs.push(mitarbeiter[id].resolveName());
    });
    let cm = cms[shift.getCM()];
    calendar.addEvent({
        id: shift.getId(),
        title: cm.getName() + " (" + shift.getBegin() + " - " + shift.getEnd() + ")<br />" + mtbs.join(", "),
        backgroundColor: cm.getColor(),
        textColor: isHexColorLight(cm.getColor()) ? "black" : "white",
        start: begin,
        end: end,
        allDay: false
    });
}

function addShift(addEvent) {
    addShiftPopup(new Date(addEvent.startStr), new Date(addEvent.endStr));
    calendar.unselect();
}