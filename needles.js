var needles = {
    length: 50,
    amount: 200
};

var curNeedles = [];

var lines = {
    distance: 200,
    firstOffset: 0
};

var area = {
    width: 700,
    height: 1400
};

var canvas = document.getElementById("canvas");
canvas.width = area.width;
canvas.height = area.height;
var ctx = canvas.getContext("2d");

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
                drawCrossingPoint(getCrossingPoint(needle, a));
            }
        }
    });

    return count;
}

function getCrossingPoint(needle, height) {
    //y = ax + b
    var a = (needle.first.y - needle.second.y) / (needle.first.x - needle.second.x);
    var b = needle.first.y - a * needle.first.x;

    var x = (height - b) / a;

    return {
        x: x,
        y: height
    };
}

function simulate() {
    copyValues();

    document.getElementById("result").innerHTML = "Simuliert...";

    console.log("Simulating " + needles.amount + " needles of length " + needles.length + " with d = " + lines.distance);

    throwNeedles();

    clearCanvas();
    drawLines();
    drawNeedles();

    var k = findCrossings();

    console.log(k);

    document.getElementById("result").innerHTML = "N = " + k;
}

function clearCanvas() {
    ctx.clearRect(0, 0, area.width, area.height);
    ctx.beginPath();
}

function drawLines() {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#555555";

    for(var a = lines.firstOffset; a <= area.height; a += lines.distance) {
        ctx.moveTo(0, a);
        ctx.lineTo(area.width, a);
    }

    ctx.stroke();
}

function drawNeedles() {
    ctx.beginPath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

    curNeedles.forEach(function(needle) {
        ctx.moveTo(needle.first.x, needle.first.y);
        ctx.lineTo(needle.second.x, needle.second.y);
    });

    ctx.stroke();
}

function drawCrossingPoint(point) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#AA0000";

    ctx.arc(point.x, point.y, 8, 0, 2*Math.PI);

    ctx.stroke();
}

document.getElementById("distance").value = lines.distance;
document.getElementById("amount").value = needles.amount;
document.getElementById("length").value = needles.length;
