


export default function timePassedBy(date){
    let currentTime = new Date();
    let passedTime = Math.floor(currentTime.getTime()/1000) - date;
    if (passedTime < 60){
        return passedTime + " sec";
    }
    let min = Math.floor(passedTime / 60);
    if (min < 60){
        return min + " min";
    }
    let hours = Math.floor(min / 60);
    if (hours < 24){
        return hours + " h";
    }
    let days = Math.floor(hours / 24);
    if (days < 30){
        return days + " d";
    }
    let months = Math.floor(days/30);
    if(months < 12){
        return months + " month";
    }
    let years = Math.floor(months/12);
    return years + " year";
    
}