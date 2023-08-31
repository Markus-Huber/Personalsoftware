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

function closeSomething(dirty, yesCallback){
    if(dirty){
        yesCallback();        
    }else{
        yesCallback();
    }
}