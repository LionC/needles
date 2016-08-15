var needles = {
    length: 3,
    amount: 1000000
};

var curNeedles = [];

var lines = {
    distance: 5,
    firstOffset: 0
};

var area = {
    width: 2000,
    height: 4000
};

function getValue(id) {
    return document.getElementById(id).value;
}

function copyValues() {
    needles.length = parseInt(getValue("length"));
    needles.amount = parseInt(getValue("amount"));

    lines.distance = parseInt(getValue("distance"));
}

function randomNumberInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomAngle() {
    return randomNumberInRange(0, 2*Math.PI);
}

function getRandomPoint() {
    return {
        x: randomNumberInRange(0, area.width),
        y: randomNumberInRange(0, area.height)
    };
}

function generateRandomNeedle() {
    var needle = {};

    do {
        needle.first = getRandomPoint();
        var angle = getRandomAngle();
        needle.second = {
            x: needle.first.x + (needles.length * Math.cos(angle)),
            y: needle.first.y + (needles.length * Math.sin(angle))
        }
    } while(!isNeedleInArea(needle))

    return needle;
}

function throwNeedles() {
    curNeedles.splice(0, curNeedles.length);

    for(var i = 0; i < needles.amount; i++) {
        curNeedles.push(generateRandomNeedle());
    }
}

function getLength(needle) {
    return Math.sqrt(
        Math.pow(needle.second.x - needle.first.x, 2) +
        Math.pow(needle.second.y - needle.first.y, 2)
    );
}

function isPointInArea(point) {
    return point.x >= 0 && point.x <= area.width && point.y >= 0 && point.y <= area.height;
}

function isNeedleInArea(needle) {
    return isPointInArea(needle.first) && isPointInArea(needle.second);
}

function findCrossings() {
    var count = 0;

    console.log("Finding crossings in " + curNeedles.length + " needles...");

    curNeedles.forEach(function(needle) {
        for(var a = lines.firstOffset; a <= area.height; a += lines.distance) {
            if(!(needle.first.y > a && needle.second.y > a) && !(needle.first.y < a && needle.second.y < a)) {
                count++;
            }
        }
    });

    return count;
}

function simulate() {
    copyValues();

    document.getElementById("result").innerHTML = "Simuliert...";

    console.log("Simulating " + needles.amount + " needles of length " + needles.length + " with d = " + lines.distance);

    throwNeedles();

    var k = findCrossings();

    console.log(k);

    document.getElementById("result").innerHTML = "N = " + k;
}

document.getElementById("distance").value = lines.distance;
document.getElementById("amount").value = needles.amount;
document.getElementById("length").value = needles.length;
