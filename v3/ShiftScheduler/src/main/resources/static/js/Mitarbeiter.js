function showMitarbeiter() {
    askOpenedPopupToClose(() => {
        content.innerHTML = null;
        let parent = new ElementBuilder("div").parent(content).id("mitarbeiter-overview").build();

        new ElementBuilder("div").cssClass("basic-data-header").children(
            new ElementBuilder("h2").children("Mitarbeiter")
        ).parent(parent).build();

        let dataRow = new ElementBuilder("tbody");
        mitarbeiter.forEach(arbeiter => {
            if (!isEmpty(arbeiter)) {
                new ElementBuilder("tr").children(
                    new ElementBuilder("td").children(arbeiter.getId()),
                    new ElementBuilder("td").children(arbeiter.getFirstName()),
                    new ElementBuilder("td").children(arbeiter.getLastName()),
                    new ElementBuilder("td").children(arbeiter.getWorkingHours()),
                    new ElementBuilder("td").children(""),
                ).parent(dataRow).build();
            }
        });
        new ElementBuilder("tr").children(
            new ElementBuilder("td"),
            new ElementBuilder("td").attribute("colspan", 4).children(
                new ElementBuilder("img").onclick(() => addMitarbeiterPopup()).cssClass("basic-data-table-add").attribute("src", "src/img/icon/add.png")
            )
        ).parent(dataRow).build();

        new ElementBuilder("div").cssClass("basic-data-body").children(
            new ElementBuilder("table").cssClass("basic-data-table").children(
                new ElementBuilder("tr").children(
                    new ElementBuilder("th").children("ID"),
                    new ElementBuilder("th").children("Vorname"),
                    new ElementBuilder("th").children("Nachname"),
                    new ElementBuilder("th").children("Arbeitszeiten"),
                    new ElementBuilder("th").children("Standort(e)"),
                ),
                dataRow
            )
        ).parent(parent).build();
    });
}

function addMitarbeiterPopup() {
    let parent = new ElementBuilder("div").attribute("id", "mitarbeiter-erstellen").parent(content).cssClass("popup").build();

    let mitarbeiter = new Mitarbeiter();
    let dirty = false;

    let saveFunction = () => {
        if (isEmpty(mitarbeiter.getFirstName())) {
            let message = "Die Pflichtfelder:<br>" +
                (isEmpty(mitarbeiter.getFirstName()) ? "<i>Vorname</i><br>" : "") +
                (isEmpty(mitarbeiter.getWorkingHours()) ? "<i>Arbeitszeit</i><br>" : "") +
                (mitarbeiter.getStandorte().length == 0 ? "<i>Standort(e)</i><br>" : "") +
                "dürfen nicht leer sein&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
            showAlert("warning", message, true, () => {}, () => {}, "OK", "", true);
            return;
        }
        parent.parentElement.removeChild(parent);
    }

    let closeFunction = () => closeSomething(dirty, () => {
        parent.parentElement.removeChild(parent);
        const event = new Event("popupClosed");
        parent.dispatchEvent(event);
    }, () => {
        const event = new Event("popupNotClosed");
        parent.dispatchEvent(event);
    });

    new ElementBuilder("div").cssClass("popup-header").children(
        new ElementBuilder("h2").children("Mitarbeiter hinzufügen"),
        new ElementBuilder("h2").children("✔").title("Speichern").cssProperty("padding", "0 1rem").cssClass("hover-effect-zoom").onclick(saveFunction),
        new ElementBuilder("h2").children("✖").title("Schließen").cssClass("hover-effect-zoom").onclick(closeFunction),
    ).parent(parent).build();

    let workingHoursById = {};
    workingHours.forEach(hour => workingHoursById[hour.getId()] = hour.getName() + "&emsp; - &emsp;" + hour.getHours());

    let workingHourDropdown = new Dropdown({
        data: workingHoursById,
        placeholder: "z.B. " + Object.values(workingHours)[0].getName()
    }).metaName("mitarbeiter").setValue().changeListener(() => {

    });

    let standortMultiselect = new ElementBuilder("select")
        .attribute("multiple", true)
        .attribute("multiselect-search", true)
        .attribute("multiselect-select-all", true)
        .attribute("multiselect-max-items", 5)
        .attribute("multiselect-hide-x", false);

    Object.values(standorte).forEach(standort => {
        standortMultiselect.children(
            new ElementBuilder("option").children(standort.getName()).attribute("value", standort.getId()),
        )
    });

    let parentTable = new ElementBuilder("table").cssClass("popup-table");
    new ElementBuilder("tr").children(
            new ElementBuilder("td").children(
                new ElementBuilder("table").children(
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Vorname"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("placeholder", "z.B. Max")
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Nachname"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("placeholder", "z.B. Mustermann")
                            .changeListener((event, value) => {

                            })
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Arbeitszeit"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            workingHourDropdown.build()
                        )
                    ),
                    new ElementBuilder("tr").children(
                        new ElementBuilder("td").children(
                            "Standort(e)"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            standortMultiselect
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