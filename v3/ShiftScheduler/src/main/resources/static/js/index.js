let calendar;
let weekDays = [];
let startDayOfShift = 4;
let content;
let defaultShifts = [];
let mitarbeiter = [];
let standort = 1;
let cms = [];
let workingHours = [];
let standorte = [];

document.addEventListener('DOMContentLoaded', function () {
    content = document.getElementsByClassName("content")[0];
    new xmlHttpRequestHelper("./api/admin/employee", "standort=" + standort, true, true, (mitarbeiterRaw) => {
        mitarbeiter = Mitarbeiter.marshall(mitarbeiterRaw);
        console.log(mitarbeiter);
        new xmlHttpRequestHelper("./api/cm", "", true, true, (cmsRaw) => {
            cms = CM.marshall(cmsRaw);
            // Wir brauchen die CMS, um die Schichten zu laden und zu rendern
            showShift();

            new xmlHttpRequestHelper("./api/admin/workingHours", "", true, true, (wHsRaw) => {
                workingHours = WorkingHour.marshall(wHsRaw);
                new xmlHttpRequestHelper("src/php/requestStandorte.php", "", true, true, (standortRaw) => {
                    standorte = Standort.marshall(standortRaw);
                });
            });
        });
    });
});

function closeSomething(dirty, yesCallback, noCallback, isEdit) {
    if (dirty) {
        showAlert("warning",isEdit ? "Sie haben bereits Daten verändert<br> Wollen Sie ihre Änderrungen wirklich verwerfen?" :"Es sind bereits Daten eingegeben, <br>wollen Sie diesen Eintrag wirklich verwerfen?", true, yesCallback, noCallback, "Ja", "Nein")
        return;
    }
    yesCallback();
}