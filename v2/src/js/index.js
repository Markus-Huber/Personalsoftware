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
    new xmlHttpRequestHelper("src/php/requestMitarbeiter.php", "standort=" + standort, true, true, (mitarbeiterRaw) => {
        mitarbeiter = Mitarbeiter.marshall(mitarbeiterRaw);
        new xmlHttpRequestHelper("src/php/requestCM.php", "", true, true, (cmsRaw) => {
            cms = CM.marshall(cmsRaw);
            showMitarbeiter();
        });
    });
    showShift();
});

function closeSomething(dirty, yesCallback, noCallback) {
    if (dirty) {
        showAlert("warning", "Es sind bereits Daten eingegeben, <br>wollen Sie diesen Eintrag wirklich verwerfen?", true, yesCallback, noCallback, "Ja", "Nein")
        return;
    }
    yesCallback();
}