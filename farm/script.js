$(document).ready(function(){

// initialize starting variables
var gameWeek = 0;
var playerMoney = 100;
var ownedPlots = 1;
var currentGridPosition = {
    top: 0,
    left: 0,
    lastSquare: 0
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
    var nextLineBreak = currentGridPosition.lastSquare +
        Math.sqrt(currentGridPosition.lastSquare);
    $("#farm-plot-" + plotNumber).css({"top" : currentGridPosition.top,
        "left" : currentGridPosition.left}).append(plotNumber);
    if (Math.sqrt(plotNumber) % 1 === 0) {
        currentGridPosition.top = 0;
        currentGridPosition.left += 55;
        currentGridPosition.lastSquare = plotNumber;
    } else if (plotNumber < nextLineBreak) {
        currentGridPosition.top += 55;
    } else if (plotNumber = nextLineBreak) {
            currentGridPosition.top += 55;
            currentGridPosition.left = 0;
    } else {
        currentGridPosition.left += 55;
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