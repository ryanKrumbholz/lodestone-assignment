//to be used when writing JSON file
var data = {
    table: []
};

//getDate returns string formatted as a date with random day between and including 1 - 30.
const getDate = () => {
    let day = Math.floor(Math.random() * (Math.floor(31) - Math.ceil(1)) + 1) //Math.floor is set to 31 because it is not inclusive. Math.ceil is inclusive
    const date = `10/${day}/05`; //Only the day needs to be randomly generated as they are all in the same month and year.
    return date;

}

//Returns a random char between letters A - E.
const getRaterID = () => {
    const randNum =  Math.floor(Math.random() * Math.floor(5));
    switch (randNum) {
        case 0: 
            return 'A';
        case 1: 
            return 'B';
        case 2: 
            return 'C';
        case 3: 
            return 'D';
        case 4: 
            return 'E';
    }
}

//Returns a random string of the following: 'Low', 'Average', 'High'.
const getAnsw3 = () => {
    const randNum =  Math.floor(Math.random() * Math.floor(3));
    switch (randNum) {
        case 0: 
            return 'Low';
        case 1: 
            return 'Average';
        case 2: 
            return 'High';
    }

}

//Returns a random string of the following: 'Bad', 'Okay', 'Intermediate', 'Great', 'Exceptional'.
const getAnsw5 = () => {
    const randNum =  Math.floor(Math.random() * Math.floor(5));
    switch (randNum) {
        case 0: 
            return 'Bad';
        case 1: 
            return 'Okay';
        case 2: 
            return 'Intermediate';
        case 3: 
            return 'Great';
        case 4: 
            return 'Exceptional';
    }

}

//Returns a boolean from whether two given params match
const compareAnsw = (ans1, ans2) => {
    const result = (ans1 === ans2) ? "match" : "!match";
    return result;
}

//Generates 10000 random entries of data using previously defined functions.
const populateData = () => {
    for (let i = 0; i < 10000; i++) {
        const id = i + 1;
        const date = getDate();
        const raterID = getRaterID();
        const correctAnsw3 = getAnsw3();
        const correctAnsw5 = getAnsw5();
        const raterAnsw3 = getAnsw3();
        const raterAnsw5 = getAnsw5();
        const compare3 = compareAnsw(correctAnsw3, raterAnsw3);
        const compare5 = compareAnsw(correctAnsw5, raterAnsw5);

        let row = {
            "ID": id,
            "date":date,
            "raterID": raterID,
            "correctAnsw3": correctAnsw3,
            "correctAnsw5": correctAnsw5,
            "raterAnsw3": raterAnsw3,
            "raterAnsw5": raterAnsw5,
            "compare3": compare3,
            "compare5": compare5
        }
        data.table.push(row); //pushing to JSON data structure
    }
}

const fileWrite = () => {
var json = JSON.stringify(data);
var fs = require('fs');
const callback = (err) => {
        if (err) throw err;
        console.log('complete');
}
fs.writeFile('../assets/data.json', json, 'utf8', callback);
}

const run = () => {
    populateData();
    fileWrite();
}

run();