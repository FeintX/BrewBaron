$(document).ready(function(){

// initialize starting variables
var gameWeek = 0;
var playerMoney = 100;
var ownedPlots = 1;
var gridWidth = 55;
var gridHeight = 55;
var currentGridPosition = {
    top: 0,
    left: 0,
    lastSquare: 0,
    nextSquare: 1
}

updateGameStats();
createFarmPlot(ownedPlots);

function updateGameStats() {
    $("#display-date").text("Year " + Math.floor(gameWeek / 12 + 1) +
        " Week " + (gameWeek % 12 + 1));
    $("#display-money").text("Money: " + playerMoney); 
};

function createFarmPlot(newPlots) {
    var idToAssign = ownedPlots - newPlots;
    for (newPlots; newPlots > 0; newPlots--) {
        idToAssign ++;
        $(".farm-grid").append('<div class="farm-plot" id="farm-plot-' +
            idToAssign +'"></div>');
        maintainFarmGrid(idToAssign);
    }
};

function maintainFarmGrid(plotNumber) {
    var nextBreak = currentGridPosition.nextSquare -
        Math.sqrt(currentGridPosition.nextSquare);
    $("#farm-plot-" + plotNumber).css({"top" : currentGridPosition.top,
        "left" : currentGridPosition.left}).append(plotNumber);
    if (Math.sqrt(plotNumber) % 1 === 0) {
        currentGridPosition.top = 0;
        currentGridPosition.left += gridWidth;
        currentGridPosition.lastSquare = plotNumber;
        currentGridPosition.nextSquare = Math.pow((Math.sqrt(plotNumber) + 1), 2);
    } else if (plotNumber === nextBreak) {
        currentGridPosition.top += gridHeight;
        currentGridPosition.left = 0;
    } else if (plotNumber < currentGridPosition.lastSquare + Math.sqrt(currentGridPosition.lastSquare)) {
        currentGridPosition.top += gridHeight;
    } else {
        currentGridPosition.left += gridWidth;
    }
};

$("#advance-week-button").click(function() {
    gameWeek ++;
    updateGameStats();
});

$("#buy-farm-plot").click(function() {
    ownedPlots++;
    createFarmPlot(1);
});

});