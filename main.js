function checkKey(e) {
	function moveBar (a, b) {
		game[barVertical][bar[a] + b] = "▀";
		game[barVertical][bar[a]] = "░";
		bar[a] += b;
	}
	e = e || window.event;
	if (e.keyCode === 37 && play === "play") {
		if (bar[0] != 2) {
			for (let i = 0; i <= 6; i++){
				moveBar(i, -1);
			}
		}
		updatePosition ();
	}
	else if (e.keyCode === 39 && play === "play") {
		if (bar[6] != game[barVertical].length-3) {
			for (let i = 6; i >= 0; i--){
				moveBar(i, 1);
			}
		}
		updatePosition ();
	}
	if (e.keyCode === 32) {
		const ballSlow = 100;
		e.preventDefault();
		if (play === "stop" || play === "break") {
			const randomHorizontal = [1, -1];
			const random = randomHorizontal[Math.floor(Math.random() * randomHorizontal.length)];
			moveHorizontal = random;
			play = "play";
			runGame = window.setInterval(function(){
				ballMove ();
			}, ballSlow);
		}
		else if (play === "play") {
			clearInterval(runGame);
			$("#score").html("Paused");
			play = "pause";
		}
		else if  (play === "pause") {
			runGame = window.setInterval(function(){
				ballMove ();
			}, ballSlow);
			setScore(score);
			play = "play";
		}
	}
}
function ballMove () {
	if (game[ballVertical][ballHorizontal + moveHorizontal] === "▓") {
		game[ballVertical][ballHorizontal + moveHorizontal] = "░";
		moveHorizontal *= -1;
		scoring();
	}
	if (game[ballVertical + moveVertical][ballHorizontal] === "▓") {
		game[ballVertical + moveVertical][ballHorizontal] = "░";
		moveVertical *= -1;
		 scoring();
	}
	if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▓") {
		game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "░";
		moveVertical *= -1;
		scoring();
	}
	if (ballVertical === 1) {
		moveVertical *= -1;
	}
	if (ballVertical === barVertical-1) {
		if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▀") {
			if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 1] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 1] === "▀"  && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 2] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 2] === "▀") {
				game[ballVertical ][ballHorizontal ] = "░";
				ballHorizontal += randomDirection();
				game[ballVertical ][ballHorizontal ] = "●";
			}
			if (game[ballVertical][ballHorizontal - 1] === "█") {
				moveHorizontal = 1;
			}
			else if (game[ballVertical][ballHorizontal + 1] === "█") {
				moveHorizontal = -1;
			}
			else {
				moveHorizontal = randomDirection();
			}
			moveVertical *= -1;
		}
		else if  (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "█") {
			moveVertical *= -1;
		}
		else if (moveVertical === 1) {
			const resetDelay = 100;
			if (life === 0) {
				play = "stop";
				clearInterval(runGame);
				setTimeout(function () {
					const gameOver = "Game Over!\nYour score: " + score + " pts"
					alert(gameOver);
					console.log(gameOver);
					reset();
					}, resetDelay);
			}
			else {
				clearInterval(runGame);
				setTimeout(function () {
					play = "break";
					life -= 1;
					setLife(life);
					reset();
					}, resetDelay);
			}
		}
	}
	if (ballHorizontal === 2) {
		moveHorizontal *= -1;
	}
	if (ballHorizontal === game[barVertical].length - 3) {
		moveHorizontal *= -1;
	}
	game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "●";
	game[ballVertical][ballHorizontal] = "░";
	ballVertical += moveVertical;
	ballHorizontal += moveHorizontal;
	updatePosition();
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
	score += 10;
	setScore(score);
}
function reset() {
	game[ballVertical][ballHorizontal] = "░";
	ballVertical = barVertical-1;
	ballHorizontal = (game[ballVertical].length/2)-(1/2);
	game[ballVertical][ballHorizontal] = "●";
	for (let i = 0; i <=6; i++) {
		game[barVertical][bar[i]] = "░";
	}
	moveVertical = -1;
	moveHorizontal = -1; 
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
	for (let i = 0; i <=6; i++) {
		game[barVertical][bar[i]] = "▀";
	}
	if (play === "stop") {
		score = 0;
		life = 3;
		setScore(score);
		setLife(life);
		game = JSON.parse(JSON.stringify(resetGame));
	}
	updatePosition();
}
function init() {
	const initialization = '' +
	'<b id="gameArea" style=\"text-align: center; font-family: monospace; zoom: 135%; line-height: normal;\">' +
		'<p id=\"life\"><p id=\"score\"></p><p id=\"game\"></p>' +
	'</b>';
	$(".main-title").after(initialization);
	resetGame = JSON.parse(JSON.stringify(game));
	play = "stop";
	ballVertical = barVertical-1;
	ballHorizontal = (game[ballVertical].length/2)-(1/2);
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
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
const barVertical = game.length-2;
const barHorizontal = (game[barVertical].length/2)-(1/2);
let bar, ballVertical, ballHorizontal;
let play, resetGame, score, life, runGame, moveVertical, moveHorizontal;
$(document).keydown(checkKey);
init();
reset();
