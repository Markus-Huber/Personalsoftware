function showMitarbeiter() {
    askOpenedPopupToClose(() => {
        console.log(mitarbeiter);
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
                    new ElementBuilder("th").children("Standort"),
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
            let message = "Das Pflichtfeld:<br>" +
                (isEmpty(shift.getBegin()) ? "<i>Vorname</i><br>" : "") +
                "darf nicht leer sein&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
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
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input").attribute("placeholder", "z.B. Mustermann")
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
                            "Arbeitszeiten"
                        ).attribute("required", true).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("input")
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
                            "Standort"
                        ).cssClass("popup-table-caption"),
                        new ElementBuilder("td").children(
                            new ElementBuilder("select")
                            .attribute("multiple", true)
                            .attribute("multiselect-search", true)
                            .attribute("multiselect-select-all", true)
                            .attribute("multiselect-max-items", 5)
                            .attribute("multiselect-hide-x", false)
                            .children(
                                new ElementBuilder("option").children("Dingolfing").attribute("value", "1"),
                                new ElementBuilder("option").children("Landau").attribute("value", "2"),
                            )
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