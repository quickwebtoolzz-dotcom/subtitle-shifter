function processSubtitle() {
    const fileInput = document.getElementById('fileInput').files[0];
    const timeShift = parseFloat(document.getElementById('timeInput').value);

    if (!fileInput || isNaN(timeShift)) {
        alert("Please upload a file and enter a valid number of seconds.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const shiftedText = shiftTime(text, timeShift);
        downloadFile(shiftedText, "synced_" + fileInput.name);
    };
    reader.readAsText(fileInput);
}

function shiftTime(text, shiftSeconds) {
    // This regex finds the timestamps in the SRT file
    const regex = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/g;
    
    return text.replace(regex, (match, h, m, s, ms) => {
        let totalMilliseconds = (parseInt(h) * 3600000) + (parseInt(m) * 60000) + (parseInt(s) * 1000) + parseInt(ms);
        totalMilliseconds += (shiftSeconds * 1000);
        
        if (totalMilliseconds < 0) totalMilliseconds = 0;

        let newH = Math.floor(totalMilliseconds / 3600000).toString().padStart(2, '0');
        let newM = Math.floor((totalMilliseconds % 3600000) / 60000).toString().padStart(2, '0');
        let newS = Math.floor((totalMilliseconds % 60000) / 1000).toString().padStart(2, '0');
        let newMs = Math.floor(totalMilliseconds % 1000).toString().padStart(3, '0');

        return `${newH}:${newM}:${newS},${newMs}`;
    });
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
