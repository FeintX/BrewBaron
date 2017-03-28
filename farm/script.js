$(document).ready(function(){

// initialize starting variables
var gameWeek = 0;
var player = {
    money: 100,
}


var farmPlotCost = 1000;
var ownedPlots = 4;

var grainBarley = {
    cost: 100,
    value: 200,
    growTime: 4,
    inventorySeeds: 0,
    inventoryHarvested: 0
}

var gridWidth = 55;
var gridHeight = 55;
var currentGridPosition = {
    top: 0,
    left: 0,
    lastSquare: 0,
    nextSquare: 1
}

var plotStatus = {};
var checkMouseStatus = false;


updateGameStats();
createFarmPlot(ownedPlots);

$(document).mousedown(function() {
    checkMouseStatus = true;
}).mouseup(function() {
    checkMouseStatus = false;
});

function updateGameStats() {
    $("#display-date").text("Year " + Math.floor(gameWeek / 52 + 1) +
        " Week " + (gameWeek % 52 + 1));
    $("#display-money").text("Money: " + player.money); 
    $("#display-seeds-barley").text("Barley Seeds " +
        grainBarley.inventorySeeds);
    $("#display-harvested-barley").text("Harvested Barley: " +
        grainBarley.inventoryHarvested);
};

function createFarmPlot(newPlots) {
    var idToAssign = ownedPlots - newPlots;
    for (newPlots; newPlots > 0; newPlots--) {
        idToAssign ++;
        var nameId = "farm-plot-" + idToAssign;
        $(".farm-grid").append('<div class="farm-plot empty" id="' + nameId +
            '"></div>');
        plotStatus[nameId] = {};
        plotStatus[nameId].grain = "Empty";
        plotStatus[nameId].timeRemaining = 0;
        maintainFarmGrid(idToAssign);
    }
};

function maintainFarmGrid(plotNumber) {
    var nextBreak = currentGridPosition.nextSquare -
        Math.sqrt(currentGridPosition.nextSquare);
    $("#farm-plot-" + plotNumber).css({"top" : currentGridPosition.top,
        "left" : currentGridPosition.left});
    if (Math.sqrt(plotNumber) % 1 === 0) {
        currentGridPosition.top = 0;
        currentGridPosition.left += gridWidth;
        currentGridPosition.nextSquare = Math.pow((Math.sqrt(plotNumber) + 1), 2);
    } else if (plotNumber === nextBreak) {
        currentGridPosition.top += gridHeight;
        currentGridPosition.left = 0;
    } else if (plotNumber < nextBreak) {
        currentGridPosition.top += gridHeight;
    } else {
        currentGridPosition.left += gridWidth;
    }
};

function updatePlotStatus(plotNumber) {
    var plotCount;
    var plotID;
    for (plotCount in plotStatus) {
        if (plotStatus[plotCount].timeRemaining > 0) {
            plotStatus[plotCount].timeRemaining -= 1;
            $("#" + plotCount).text(plotStatus[plotCount].timeRemaining);
            if (plotStatus[plotCount].timeRemaining == 0) {
                $("#" + plotCount).removeClass("planted").
                    addClass("ready-harvest").text("Ready");
            }
        }

    };
};

$("#advance-week-button").click(function() {
    gameWeek ++;
    updatePlotStatus();
    updateGameStats();
});

$("#buy-farm-plot").click(function() {
    if (player.money >= farmPlotCost) {
        player.money -= farmPlotCost;
        ownedPlots++;
        createFarmPlot(1);
        updateGameStats();
    }
});

$("#buy-grain-barley").click(function() {
    if (player.money >= grainBarley.cost) {
        player.money -= grainBarley.cost;
        grainBarley.inventorySeeds += 1;
        updateGameStats();
    }
});

$("#sell-grain-barley").click(function() {
    if (grainBarley.inventoryHarvested > 0) {
        grainBarley.inventoryHarvested -= 1;
        player.money += grainBarley.value;
        updateGameStats();
    }
})

/*$(".farm-grid").on("mouseover", ".farm-plot", function() {
    if (checkMouseStatus === true) {
        var plotID = $(this).attr("id");
        if ($(this).hasClass("empty") == true) {
            plantBarley(plotID);
        }
        if ($(this).hasClass("ready-harvest") == true) {
            harvestBarley(plotID);
        }
    }
});*/

$(".farm-grid").on("mouseover", ".farm-plot", function() {
    var plotID = $(this).attr("id");
    if (checkMouseStatus === true) {
        plotActions(plotID);
    }
    })
$(".farm-grid").on("mousedown", ".farm-plot", function() {
    var plotID = $(this).attr("id");
    plotActions(plotID);
});

function plotActions(plotToAffect) {
    if ($("#" + plotToAffect).hasClass("empty") == true) {
        plantBarley(plotToAffect);
    }
    if ($("#" + plotToAffect).hasClass("ready-harvest") == true) {
        harvestBarley(plotToAffect);
    }
};


function plantBarley(plotID) {
    if (grainBarley.inventorySeeds >= 1) {
            grainBarley.inventorySeeds -= 1;
            $("#" + plotID).removeClass("empty").addClass("planted");
            plotStatus[plotID].grain = "Barley";
            plotStatus[plotID].timeRemaining = grainBarley.growTime;
            $("#" + plotID).removeClass("empty").addClass("planted").
                text(plotStatus[plotID].timeRemaining);
            updateGameStats();  
        }
};

function harvestBarley(plotID) {
    grainBarley.inventoryHarvested += 1;
    $("#" + plotID).removeClass("ready-harvest").addClass("empty").
        text("");
    updateGameStats();
};

});