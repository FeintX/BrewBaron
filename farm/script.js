$(document).ready(function(){


// initialize starting variables
var gameWeek = 0;
var player = {
    money: 100,
}


var farmPlotCost = 1000;
var ownedPlots = 4;

var gridWidth = 55;
var gridHeight = 55;
var currentGridPosition = {
    top: 0,
    left: 0,
    lastSquare: 0,
    nextSquare: 1
}

var grainInfo = {};
    grainInfo.corn = {
        name: "Corn",
        keyName: "corn",
        cost: 40,
        value: 60,
        growTime: 3,
        farmInventory: 0
    };
    grainInfo.oats = {
        name: "Oats",
        keyName: "oats",
        cost: 50,
        value: 150,
        growTime: 6,
        farmInventory: 0
    };
    grainInfo.barley = {
        name: "Barley",
        keyName: "barley",
        cost: 100,
        value: 200,
        growTime: 4,
        farmInventory: 0
    };
    grainInfo.wheat = {
        name: "Wheat",
        keyName: "wheat",
        cost: 150,
        value: 400,
        growTime: 8,
        farmInventory: 0
    };
    grainInfo.rye = {
        name: "Rye",
        keyName: "rye",
        cost: 300,
        value: 500,
        growTime: 3,
        farmInventory: 0
    };

var plotStatus = {};
var checkMouseStatus = false;

createGrainCounters();
createGrainButtons();
createGrainSelectBox();
updateGameStats();
createFarmPlot(ownedPlots);

$(document).mousedown(function() {
    checkMouseStatus = true;
}).mouseup(function() {
    checkMouseStatus = false;
});

function createGrainCounters () {
    for (var grainCountToCreate in grainInfo) {
        $("#grain-count-contain").
            append('<div class="player-stat" id="display-harvested-' +
            grainInfo[grainCountToCreate].keyName +'"></div>')
    }
}

function createGrainButtons () {
    for (var grainButtonToCreate in grainInfo) {
        $("#grain-button-contain").
            append('<button type="button" class="sell-one" id="sell-' +
            grainInfo[grainButtonToCreate].keyName + '">Sell ' +
            grainInfo[grainButtonToCreate].keyName + ' - $' +
            grainInfo[grainButtonToCreate].value +
            '</button><button type="button" class="sell-all" id="sell-all-' +
            grainInfo[grainButtonToCreate].keyName + '">Sell All ' +
            grainInfo[grainButtonToCreate].keyName + '</button><br />');
    }
}

function createGrainSelectBox () {
    for (var grainSelectToCreate in grainInfo) {
        $(".grain-selector").append('<option value="' +
            grainInfo[grainSelectToCreate].keyName + '">' +
            grainInfo[grainSelectToCreate].name + ' $' +
            grainInfo[grainSelectToCreate].cost + '</option>')
    }
}

function updateGameStats() {
    $("#display-date").text("Year " + Math.floor(gameWeek / 52 + 1) +
        " Week " + (gameWeek % 52 + 1));
    $("#display-money").text("Money: " + player.money); 
    for (var grainUpdateCount in grainInfo) {
        updateCropStats(grainUpdateCount);
    }
};

function updateCropStats(cropToUpdate) {
    var statDisplayID = "#display-harvested-" + 
        grainInfo[cropToUpdate].keyName;
    $(statDisplayID).text("Harvested " + grainInfo[cropToUpdate].name +
    ": " + grainInfo[cropToUpdate].farmInventory);
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
    for (plotCount in plotStatus) {
        if (plotStatus[plotCount].timeRemaining > 0) {
            plotStatus[plotCount].timeRemaining -= 1;
            $("#" + plotCount).html(percentComplete(plotCount));
            if (plotStatus[plotCount].timeRemaining == 0) {
                $("#" + plotCount).removeClass("planted").
                    addClass("ready-harvest").text("Ready");
            }
        }

    };
};

$("#advance-week-button").click(function() {
    advanceWeek();
});

// window.setInterval(advanceWeek, 5000);

function advanceWeek() {
    gameWeek ++;
    updatePlotStatus();
    updateGameStats();
}

$("#buy-farm-plot").click(function() {
    if (player.money >= farmPlotCost) {
        player.money -= farmPlotCost;
        ownedPlots++;
        createFarmPlot(1);
        updateGameStats();
    };
});

$("#grain-button-contain").on("click", ".sell-one", function() {
    var sellOneButton = $(this).attr("id").substring(5);
    if (grainInfo[sellOneButton].farmInventory > 0) {
        grainInfo[sellOneButton].farmInventory -= 1;
        player.money += grainInfo[sellOneButton].value;
        updateGameStats();
    };
});

$("#grain-button-contain").on("click", ".sell-all", function() {
    var sellAllButton = $(this).attr("id").substring(9);
    player.money += (grainInfo[sellAllButton].farmInventory *
        grainInfo[sellAllButton].value);
    grainInfo[sellAllButton].farmInventory = 0;
    updateGameStats();
});

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
        plantGrain(plotToAffect);
    }
    if ($("#" + plotToAffect).hasClass("ready-harvest") == true) {
        harvestGrain(plotToAffect);
    }
};


function plantGrain(plantPlotID) {
    var grainToPlant = $(".grain-selector").val();
    if (player.money >= grainInfo[grainToPlant].cost) {
            player.money -= grainInfo[grainToPlant].cost;
            $("#" + plantPlotID).removeClass("empty").addClass("planted");
            plotStatus[plantPlotID].grain = grainInfo[grainToPlant].name;
            plotStatus[plantPlotID].timeRemaining = grainInfo[grainToPlant].growTime;
            $("#" + plantPlotID).removeClass("empty").addClass("planted").
                html(percentComplete(plantPlotID));
            updateGameStats();  
        }
};

function harvestGrain(harvestPlotID) {
    var grainToHarvest = $(".grain-selector").val();
    grainInfo[grainToHarvest].farmInventory += 1;
    $("#" + harvestPlotID).removeClass("ready-harvest").addClass("empty").
        text("");
    updateGameStats();
};

function percentComplete(plot) {
    var grainPctToUpdate = plotStatus[plot].grain.toLowerCase();
    if (plotStatus[plot].timeRemaining == grainInfo[grainPctToUpdate].growTime) {
        return plotStatus[plot].grain + "<br />0%";
    } else {
    return plotStatus[plot].grain + "<br />" +
        Math.trunc(100 * (grainInfo[grainPctToUpdate].growTime -
        plotStatus[plot].timeRemaining) / grainInfo[grainPctToUpdate].growTime) + "%";
    }
}

});