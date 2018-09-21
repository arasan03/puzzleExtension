var puzzleGrid;
var puzzleList;
var movesCounter = 0;
var moves = [];

window.onload = function() {
	puzzleGrid = document.getElementById("puzzleGrid");
	createGrid();
	prepare();
};
function createGrid() {
	for (var i=0;i<16;i++) {
		var newTile = document.createElement("div");
		newTile.classList.add("tile");
		puzzleGrid.append(newTile);
	}
}

function prepare() {
	puzzleList = createPuzzleList();
	getMovableTiles();
	shuffle();
	solvedPopup.close();

		function createPuzzleList() {
		var puzzleList = [];

		for (var i=1;i<=16;i++) {
			puzzleList.push({value: i, movable: false});
		}
		var rand = randomNumber(0,15);
		puzzleList[rand].value = -1;
		return puzzleList;
	}
	function shuffle() {
		var indexesOfMovables = [];

		for (var i=0;i<=50;i++) {
			indexesOfMovables = [];

			for (var j=0;j<puzzleList.length;j++) {
				getMovableTiles();
				if (puzzleList[j].movable === true) {
					indexesOfMovables.push(j);
				}
			}

	moveTile(puzzleList[indexesOfMovables[randomNumber(0,indexesOfMovables.length-1)]].value, false);
		}
	}
}
function checkOrder() {
	var tiles = puzzleGrid.childNodes;
	var previousTileValue = -990;

	for (var i=0;i<tiles.length;i++) {
		if (tiles[i].innerText !== "" && parseInt(tiles[i].innerText)-1 != i) {
			return false;
		}
	}

	solvedPopup.updateText();
	solvedPopup.open();

	return true;
}


function undo() {
	moveTile(moves.shift(), false);

	if (moves.length === 0) {
		document.getElementById("undoButton").disabled = true;
	}
}
function moveTile(tileValue, newMove) {
	var indexEmpty;
	var indexMoving;
	var temp;

	for (var i=0;i<puzzleList.length;i++) {
		if (puzzleList[i].value == tileValue) {
			indexMoving = i;
		}
		else if (puzzleList[i].value == -1) {
			indexEmpty = i;
		}
	}

	temp = puzzleList[indexEmpty];
	puzzleList[indexEmpty] = puzzleList[indexMoving];
	puzzleList[indexMoving] = temp;

	if (newMove) {
		movesCounter++;
		moves.unshift(tileValue);
		document.getElementById("undoButton").disabled = false;
	}

	getMovableTiles();
	updateGrid();
	checkOrder();
}
function updateGrid() {
	for (var i=0;i<puzzleList.length;i++) {
		var currentChild = puzzleGrid.childNodes[i];
		var clone = currentChild.cloneNode(true);
		currentChild.parentNode.replaceChild(clone, currentChild);
		currentChild = puzzleGrid.childNodes[i];

		if (puzzleList[i].value == -1) {
			currentChild.classList.remove("tile");
			currentChild.classList.add("empty");
			currentChild.innerText = "";
		}
		else {
			currentChild.classList.remove("empty");
			currentChild.classList.add("tile");
			currentChild.innerText = puzzleList[i].value;
		}

		if (puzzleList[i].movable === true) {
			currentChild.addEventListener("click", function (e) {moveTile(e.target.innerText, true)});
		}
	}
}
function getMovableTiles() {
	var emptyElementIndex;

	for (var i=0;i<puzzleList.length;i++) {
		if (puzzleList[i].value == -1) {
			emptyElementIndex = i;
		}

		puzzleList[i].movable = false;
	}

	var neighborNumbers = [1, -1, 4, -4];

	if (emptyElementIndex % 4 === 0) {
		neighborNumbers.splice(neighborNumbers.indexOf(-1), 1);
	}
	else if (emptyElementIndex % 4 == 3) {
		neighborNumbers.splice(neighborNumbers.indexOf(1), 1);
	}
	if (emptyElementIndex/4 < 1) {
		neighborNumbers.splice(neighborNumbers.indexOf(-4), 1);
	}
	else if (emptyElementIndex/4 >= 3) {
		neighborNumbers.splice(neighborNumbers.indexOf(4), 1);
	}
	for (var number in neighborNumbers) {
		puzzleList[emptyElementIndex + neighborNumbers[number]].movable = true;
	}
}

var solvedPopup = {
	open: function() {
		document.getElementById("solvedPopup").style.display = "block";
		document.getElementById("overlay").style.display = "block";
	},
	close: function() {
		document.getElementById("solvedPopup").style.display = "none";
		document.getElementById("overlay").style.display = "none";
	},

	updateText: function() {
		document.getElementById("requiredMovesLabel").innerText = movesCounter;
	}
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}
