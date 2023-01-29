export function convertTimestamp(timestamp) {
    let now = new Date().getTime()/1000;
    let diff = now - timestamp;
    if (diff < 60) {
        return 'Just now';
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + ' minutes ago';
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + ' hours ago';
    } else if (diff < 604800) {
        return Math.floor(diff / 86400) + ' days ago';
    } else if (diff < 2628000) {
        return Math.floor(diff / 604800) + ' weeks ago';
    } else {
        let date = new Date(timestamp * 1000);
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayName = days[date.getUTCDay()];
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // months are zero indexed
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let strTime = dayName + ' ' + day.toString().padStart(2, '0') + '/' + month.toString().padStart(2, '0') + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ' ' + ampm;
        return strTime;
    }
}