function addShiftPopup(begin, end) {
    if(isEmpty(begin)){
        begin = new Date("2023-08-31 12:08:03");
    }
    if(isEmpty(end)){
        end = new Date();
    }
    
    let shift = new Shift();
    let dirty = false;

    let parent = new ElementBuilder("div").attribute("id", "schichtplan-neue-schicht").parent(content).cssClass("popup").build();

    new ElementBuilder("div").cssClass("popup-header").children(
        new ElementBuilder("h2").children("Schicht planen"),
        new ElementBuilder("h2").children("✔").title("Speichern").cssProperty("padding", "0 1rem").cssClass("hover-effect-zoom").onclick(() => {
            saveShift(shift);
            parent.parentElement.removeChild(parent);
        }),
        new ElementBuilder("h2").children("✖").title("Schließen").cssClass("hover-effect-zoom").onclick(() => {
            closeSomething(dirty, () => parent.parentElement.removeChild(parent));
        }),
    ).parent(parent).build();

    let wochentagDropdown = new Dropdown({
        data: Object.assign({}, weekDays),
        placeholder: "z.B. " + weekDays[0]
    }).metaName("wochentag").setValue(weekDays.indexOf(begin.toLocaleDateString("de-de", {weekday: "long"}))).changeListener((event, item) => {
        shift.setWeekday(Object.keys(item)[0]);
        dirty = true;
    });

    let mitarbeiterById = {};
    mitarbeiter.forEach(arbeiter => mitarbeiterById[arbeiter.getId()] = arbeiter.resolveName());

    let mitarbeiter1Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener((event, item) => {
        let mitarbeiter = [].concatIfNotNull(Object.keys(item)[0])
            .concatIfNotNull(mitarbeiter2Dropdown.getValue())
            .concatIfNotNull(mitarbeiter3Dropdown.getValue());
        shift.setMitarbeiter(mitarbeiter);
        dirty = true;
    });

    let mitarbeiter2Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener((event, item) => {
        let mitarbeiter = [].concatIfNotNull(mitarbeiter1Dropdown.getValue())
            .concatIfNotNull(Object.keys(item)[0])
            .concatIfNotNull(mitarbeiter3Dropdown.getValue());
        shift.setMitarbeiter(mitarbeiter);
        dirty = true;
    });

    let mitarbeiter3Dropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue().changeListener((event, item) => {
        let mitarbeiter = [].concatIfNotNull(mitarbeiter1Dropdown.getValue())
            .concatIfNotNull(mitarbeiter2Dropdown.getValue())
            .concatIfNotNull(Object.keys(item)[0]);
        shift.setMitarbeiter(mitarbeiter);
        dirty = true;
    });

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
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            wochentagDropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Anfang"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("type", "time")
                            .attribute("placeholder", "z.B. 08:00").attribute("value", formatTimeHHMM(begin))
                            .changeListener((event, value) => {
                                shift.setBegin(value);
                                dirty = true;
                            })
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Ende"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("type", "time")
                            .attribute("placeholder", "z.B. 15:30").attribute("value", formatTimeHHMM(end))
                            .changeListener((event, value) => {
                                shift.setEnd(value);
                                dirty = true;
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
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            cmDropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Mitarbeiter 1"
                        ).cssClass("popup-table-caption"),
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
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Speichern").onclick(() => {
            saveShift(shift);
            parent.parentElement.removeChild(parent);
        }),
        new ElementBuilder("button").cssClass("hover-effect-zoom").children("Abbrechen").onclick(() => closeSomething(dirty,
            () => parent.parentElement.removeChild(parent)
        ))
    ).build());
}

function saveShift(shift) {
    calendar.addEvent({
        title: "Test",
        start: shift.getBegin(),
        end: shift.getEnd(),
        allDay: false
    });
}

function addShift(addEvent) {
    console.log(addEvent);
    addShiftPopup(new Date(addEvent.startStr), new Date(addEvent.endStr));
    calendar.unselect();

    /*calendar.addEvent({
        title: "Test",
        start: addEvent.startStr,
        end: addEvent.endStr,
        allDay: false
    })*/
}