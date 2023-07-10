let calendar; 

document.addEventListener('DOMContentLoaded', function () {
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
        firstDay: 4,
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

        // Create new event
        select: function (arg) {
            addShift(arg);
        },

        events: [
            {
              id: 'a',
              title: 'my event',
              start: '2023-10-06'
            }
          ]
    })
    calendar.render()
});

function addShift(addEvent){
    calendar.addEvent({
        title: "Test",
        start: addEvent.startStr,
        end: addEvent.endStr,
        allDay: false
    })

    console.warn(addEvent);
}