document.addEventListener('DOMContentLoaded', () => {
    calculateExitTimes();
    document.querySelectorAll('#workTimeForm input').forEach(input => {
        input.addEventListener('input', calculateExitTimes);
    });
});

function parseTime(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function calculateExitTimes() {
    const arrivalTime = parseTime(document.getElementById('arrivalTime').value);
    if (arrivalTime === null) return;

    const lunchStartTime = parseTime(document.getElementById('lunchStartTime').value);
    const lunchEndTime = parseTime(document.getElementById('lunchEndTime').value);
    let lunchDuration = (lunchStartTime !== null && lunchEndTime !== null) ? (lunchEndTime - lunchStartTime) : 30;

    let totalBreaksDuration = lunchDuration;
    document.querySelectorAll('.shortBreakStartTime').forEach((start, index) => {
        const end = document.querySelectorAll('.shortBreakEndTime')[index];
        if (start.value && end.value) {
            totalBreaksDuration += parseTime(end.value) - parseTime(start.value);
        }
    });

    const mealVoucherExitTime = arrivalTime + 6 * 60 + totalBreaksDuration;
    const sevenTwelveExitTime = arrivalTime + 7 * 60 + 12 + totalBreaksDuration;

    document.getElementById('mealVoucherTime').innerText = formatTime(mealVoucherExitTime);
    document.getElementById('sevenHoursTwelveMinutesTime').innerText = formatTime(sevenTwelveExitTime);
}

function deleteBreak(element) {
    element.parentElement.remove();
    calculateExitTimes();
}

function addBreak() {
    const breaksContainer = document.getElementById('breaks-wrapper');
    const newBreak = document.createElement('div');
    newBreak.className = 'break-container';
    
    newBreak.innerHTML = `
        <button type="button" class="delete-break" onclick="deleteBreak(this)">×</button>
        <label>Inizio uscita breve (hh:mm):</label>
        <input type="time" class="shortBreakStartTime">
        <label>Fine uscita breve (hh:mm):</label>
        <input type="time" class="shortBreakEndTime">
    `;
    breaksContainer.appendChild(newBreak);
    newBreak.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateExitTimes));
}
