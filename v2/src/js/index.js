let calendar;
let weekDays = [];
let startDayOfShift = 4;
let content;

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

    createShiftTable();
});

function createShiftTable() {
    let parent = document.getElementById("schichtplan-neue-schicht");

    var dropdown = new Dropdown({
        data: Object.assign({}, weekDays),
        placeholder: "z.B. " + weekDays[0]
    }).metaName("gender").setValue();


    let parentTable = new ElementBuilder("table").cssClass("popup-table");

    new ElementBuilder("tr").children(
        new ElementBuilder("td").children(
            new ElementBuilder("table").children(
                new ElementBuilder("tr").children(
                    new ElementBuilder("td").children(
                        "Wochentag"
                    ).cssClass("popup-table-caption"),
                    new ElementBuilder("td").children(
                        dropdown.build()
                    )
                ),
                new ElementBuilder("tr").children(
                    new ElementBuilder("td").children(
                        "Beginn"
                    ).cssClass("popup-table-caption"),
                    new ElementBuilder("td").children(
                        new ElementBuilder("input").attribute("type", "time").attribute("placeholder", "z.B. 08:00 Uhr")
                    )
                )
            )
        )
    ).parent(parentTable).build();

    parent.appendChild(parentTable.build());
}

function addShift(addEvent) {
    console.log(new Date(addEvent.startStr));

    calendar.unselect()
    /*calendar.addEvent({
        title: "Test",
        start: addEvent.startStr,
        end: addEvent.endStr,
        allDay: false
    })*/
}