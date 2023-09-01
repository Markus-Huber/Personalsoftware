let shifts = [];

function addShiftPopup(begin, end) {
    if (isEmpty(begin)) {
        begin = new Date("2023-08-31 12:08:03");
    }
    if (isEmpty(end)) {
        end = new Date();
    }

    let shift = new Shift();
    let dirty = false;

    // Werte aus den übergebenen Events übertragen
    shift.setWeekday(begin.getDate());
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
            showAlert("warning", message, () => {}, () => {}, "OK", "", true);
            return;
        }
        saveShift(shift, begin, end);
        parent.parentElement.removeChild(parent);
    }

    let closeFunction = () => closeSomething(dirty, () => parent.parentElement.removeChild(parent));

    new ElementBuilder("div").cssClass("popup-header").children(
        new ElementBuilder("h2").children("Schicht planen"),
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
        shift.setWeekday(Object.keys(item)[0]);
        dirty = true;
    });

    let mitarbeiterById = {};
    mitarbeiter.forEach(arbeiter => mitarbeiterById[arbeiter.getId()] = arbeiter.resolveName());

    let mitarbeiterValueChange = () => {
        let mitarbeiter = [].concatIfNotNull(mitarbeiter1Dropdown.getValue())
            .concatIfNotNull(mitarbeiter2Dropdown.getValue())
            .concatIfNotNull(mitarbeiter3Dropdown.getValue());

        console.log(mitarbeiter1Dropdown.getValue(), mitarbeiter2Dropdown.getValue(), mitarbeiter3Dropdown.getValue())

        shift.setMitarbeiter(mitarbeiter);
        dirty = true;
    };

    let mitarbeiter1Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener(mitarbeiterValueChange);

    let mitarbeiter2Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener(mitarbeiterValueChange);

    let mitarbeiter3Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener(mitarbeiterValueChange);

    let cmsById = {};
    cms.forEach(cm => cmsById[cm.getId()] = cm.getName());

    let cmDropdown = new Dropdown({
        data: Object.assign({}, cmsById),
        placeholder: "z.B. Kasse 1"
    }).metaName("cm").setValue().changeListener((event, item) => {
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
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Speichern").onclick(saveFunction),
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Abbrechen").onclick(closeFunction)
    ).build());
}

function saveShift(shift, begin, end) {
    shifts.push(shift);
    //new xmlHttpRequestHelper("src/php/saveShift.php", "shift=" + JSON.stringify(shift), true, true, (message) => console.log(message));

    let mtbs = [];
    console.log(shift.getMitarbeiter());
    shift.getMitarbeiter().forEach(id => {
        mtbs.push(mitarbeiter[id].resolveShortName());
    });

    calendar.addEvent({
        title: Object.values(cms)[shift.getCM()].getName() + "<br />" + mtbs.join(", "),
        start: begin,
        end: end,
        allDay: false
    });
}

function addShift(addEvent) {
    console.log(addEvent);
    addShiftPopup(new Date(addEvent.startStr), new Date(addEvent.endStr));
    calendar.unselect();
}