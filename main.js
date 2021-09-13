const initialization = '' +
'<div id="gameArea" class="white-section-area-thing" style=\"text-align: center; font-family: monospace; zoom: 135%; line-height: normal;\">' +
'<b>' +
	'<p id=\"life\"><p id=\"score\"></p><p id=\"game\"></p>' +
'</b>' +
'</div>';
$(".main-title").after(initialization);
function checkKey(e) {
	function moveBar (a, b) {
		game[barLocation][bar[a] + b] = "▀";
		game[barLocation][bar[a]] = "░";
		bar[a] += b;
	}
	e = e || window.event;
	if (e.keyCode === 37 && play === 1) {
		if (bar[0] != 2) {
			for (let i = 0; i <= 6; i++){
				moveBar(i, -1);
			}
		}
		updatePosition ();
	}
	else if (e.keyCode === 39 && play === 1) {
		if (bar[6] != game[barLocation].length-3) {
			for (let i = 6; i >= 0; i--){
				moveBar(i, 1);
			}
		}
		updatePosition ();
	}
	if (e.keyCode === 32) {
		e.preventDefault();
		if (play === 0 || play === 2) {
			const randomHorizontal = [1, -1];
			const random = randomHorizontal[Math.floor(Math.random() * randomHorizontal.length)];
			moveHorizontal = random;
			play = 1;
			runGame = window.setInterval(function(){
				ballMove ();
			}, 100);
		}
	}
}
function ballMove () {
	if (game[ballVertical][ballHorizontal + moveHorizontal] === "▓") {
		game[ballVertical][ballHorizontal + moveHorizontal] = "░";
		scoring();
	}
	if (game[ballVertical + moveVertical][ballHorizontal] === "▓") {
		game[ballVertical + moveVertical][ballHorizontal] = "░";
		 scoring();
	}
	if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▓") {
		game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "░";
		scoring();
	}
	if (ballVertical === 1) {
		moveVertical *= -1;
	}
	if (ballVertical === barLocation-1) {
		if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▀") {
			if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 1] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 1] === "▀"  && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 2] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 2] === "▀") {
				game[ballVertical ][ballHorizontal ] = "░";
				ballHorizontal += randomDirection();
				game[ballVertical ][ballHorizontal ] = "●";
			}
			moveHorizontal = randomDirection();
			moveVertical *= -1;
		}
		else if  (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "█") {
			moveVertical *= -1;
		}
		else if (moveVertical === 1) {
			if (life === 0) {
				play = 0;
			}
			else {
				clearInterval(runGame);
				setTimeout(function () {
					play = 2;
					life -= 1;
					setLife(life);
					reset();
					}, 100);
			}
		}
	}
	if (ballHorizontal === 2) {
		moveHorizontal *= -1;
	}
	if (ballHorizontal === game[barLocation].length - 3) {
		moveHorizontal *= -1;
	}
	game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "●";
	game[ballVertical][ballHorizontal] = "░";
	ballVertical += moveVertical;
	ballHorizontal += moveHorizontal;
	updatePosition();
	if (play === 0) {
		clearInterval(runGame);
		setTimeout(function () {
			const gameOver = "Game Over!\nYour score: " + score + " pts"
			alert(gameOver);
			console.log(gameOver);
			reset();
			}, 100);
	}
}
function updatePosition() {
	$("#game").html(game.map(a => a.join('')).join('<br>'));
}
function randomDirection() {
	const directions = [1, -1];
	const random = directions[Math.floor(Math.random() * directions.length)];
	return random;
}
function setLife(life) {
	let lifeString = " ";
	for (let i = 0; i < life; i++) {
		lifeString += "♥";
	}
	if (life === 0) {
		lifeString = "<br>";
	}
	$("#life").html(lifeString);
}
function setScore(score) {
	let lifeScore = "Score: " + score + " pts";
	$("#score").html(lifeScore);
}
function scoring() {
	moveVertical *= -1;
	score += 10;
	setScore(score);
}
function reset() {
	game[ballVertical][ballHorizontal] = "░";
	ballVertical = barLocation-1;
	ballHorizontal = (game[ballVertical].length/2)-(1/2);
	game[ballVertical][ballHorizontal] = "●";
	for (let i = 0; i <=6; i++) {
		game[barLocation][bar[i]] = "░";
	}
	moveVertical = -1;
	moveHorizontal = -1; 
	bar = [barMiddle-3, barMiddle-2, barMiddle-1, barMiddle , barMiddle+1, barMiddle+2, barMiddle+3];
	for (let i = 0; i <=6; i++) {
		game[barLocation][bar[i]] = "▀";
	}
	if (play === 0) {
		score = 0;
		life = 3;
		setScore(score);
		setLife(life);
		game = JSON.parse(JSON.stringify(resetGame));
	}
	updatePosition();
}
let game = [];
game.push(["█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "●", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","▀", "▀", "▀", "▀", "▀", "▀", "▀", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█"]);
let resetGame = JSON.parse(JSON.stringify(game));
let play = 0;
const barLocation = game.length-2;
let ballVertical = barLocation-1;
let ballHorizontal = (game[ballVertical].length/2)-(1/2);
const barMiddle = (game[barLocation].length/2)-(1/2);
let bar = [barMiddle-3, barMiddle-2, barMiddle-1, barMiddle , barMiddle+1, barMiddle+2, barMiddle+3];
let score, life, runGame, moveVertical, moveHorizontal;
$(document).keydown(checkKey);
reset();
