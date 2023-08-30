let calendar;
let weekDays = [];
let startDayOfShift = 4;
let content;
let defaultShifts = [];
let mitarbeiter = [];
let standort = 1;
let cms = [];

document.addEventListener('DOMContentLoaded', function () {
    content = document.getElementsByClassName("content")[0];

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
        }
    })
    calendar.render();

    let date = new Date('2022/08/22');
    for (let i = 0; i <= 6; i++) {
        weekDays.push(date.toLocaleDateString("de-DE", {
            weekday: 'long'
        }));
        date.setDate(date.getDate() + 1);
    }
    weekDays = weekDays.slice(startDayOfShift - 1).concat(weekDays.slice(0, startDayOfShift - 1));

    new xmlHttpRequestHelper("src/php/requestMitarbeiter.php", "standort="+standort, true, true, (mitarbeiterRaw) => {
        mitarbeiter = Mitarbeiter.marshall(mitarbeiterRaw);
        new xmlHttpRequestHelper("src/php/requestCM.php", "", true, true, (cmsRaw) => {
            cms = CM.marshall(cmsRaw);
            addShiftPopup();
        });
    });
});

function addShiftPopup() {
    let parent = new ElementBuilder("div").attribute("id", "schichtplan-neue-schicht").parent(content).cssClass("popup").build();

    new ElementBuilder("div").cssClass("popup-header").children(
        new ElementBuilder("h2").children("Schicht planen"),
        new ElementBuilder("h2").children("✖").cssClass("hover-effect-zoom").onclick(() => {
            parent.parentElement.removeChild(parent);
        }),
    ).parent(parent).build();

    let wochentagDropdown = new Dropdown({
        data: Object.assign({}, weekDays),
        placeholder: "z.B. " + weekDays[0]
    }).metaName("wochentag").setValue();

    let mitarbeiterById = {};
    mitarbeiter.forEach(arbeiter => mitarbeiterById[arbeiter.getId()] = arbeiter.resolveName());

    let mitarbeiterDropdown = new Dropdown({
        data: mitarbeiterById,
        placeholder: "z.B. Max Mustermann"
    }).metaName("mitarbeiter").setValue();

    let cmsById = {};
    cms.forEach(cm => cmsById[cm.getId()] = cm.getName());

    let cmDropdown = new Dropdown({
        data: Object.assign({}, cmsById),
        placeholder: "z.B. Kasse 1"
    }).metaName("cm").setValue();

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
                        new ElementBuilder("input").attribute("type", "time").attribute("placeholder", "z.B. 08:00")
                    )
                ),
                new ElementBuilder("tr").children(
                    new ElementBuilder("td").children(
                        "Ende"
                    ).cssClass("popup-table-caption"),
                    new ElementBuilder("td").children(
                        new ElementBuilder("input").attribute("type", "time").attribute("placeholder", "z.B. 15:30")
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
                        "Mitarbeiter"
                    ).cssClass("popup-table-caption"),
                    new ElementBuilder("td").children(
                        mitarbeiterDropdown.build()
                    )
                ),
                new ElementBuilder("tr").children(
                    new ElementBuilder("td").children(
                        "CM"
                    ).cssClass("popup-table-caption"),
                    new ElementBuilder("td").children(
                        cmDropdown.build()
                    )
                ),
            )
        )
    ).parent(parentTable).build();
    parent.appendChild(parentTable.build());
}

function addShift(addEvent) {
    console.log(new Date(addEvent.startStr));
    addShiftPopup();
    calendar.unselect();

    /*calendar.addEvent({
        title: "Test",
        start: addEvent.startStr,
        end: addEvent.endStr,
        allDay: false
    })*/
}