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
            if(!isEmpty(arbeiter)){
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
            new ElementBuilder("td").attribute("colspan",4).children(
                new ElementBuilder("img").cssClass("basic-data-table-add").attribute("src", "src/img/icon/add.png")
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