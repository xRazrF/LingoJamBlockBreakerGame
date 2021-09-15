function checkKey(e) {
	function moveBar (a, b) {
		game[barVertical][bar[a] + b] = "▀";
		game[barVertical][bar[a]] = "░";
		bar[a] += b;
	}
	const barLength = bar.length - 1;
	const barFirst = 0;
	e = e || window.event;
	if (e.keyCode === 37 && play !== "pause") {
		if (game[barVertical][bar[barFirst] - 1] !== "█") {
			if (play !== "play") {
				game[ballVertical][ballHorizontal] = "░";
				game[ballVertical][ballHorizontal + -1] = "●";
				ballHorizontal += -1;
			}
			for (let i = barFirst; i <= barLength; i++){
				moveBar(i, -1);
			}
		}
		updatePosition ();
	}
	else if (e.keyCode === 39 && play !== "pause") {
		if (game[barVertical][bar[barLength] + 1] !== "█") {
			if (play !== "play") {
				game[ballVertical][ballHorizontal] = "░";
				game[ballVertical][ballHorizontal + 1] = "●";
				ballHorizontal += 1;
			}
			for (let i = barLength; i >= barFirst; i--){
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
	function scoring() {
		score += 10;
		setScore(score);
	}
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
	else if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▓") {
		game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "░";
		moveVertical *= -1;
		scoring();
	}
	if (game[ballVertical][ballHorizontal + moveHorizontal] === "█") {
		moveHorizontal *= -1;
	}
	if (game[ballVertical + moveVertical][ballHorizontal] === "█") {
		moveVertical *= -1;
	}
	else if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "█") {
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
					const gameOver = "Game Over!\nYour score: " + score + " pts";
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
function reset() {
	const barLength = bar.length - 1;
	game[ballVertical][ballHorizontal] = "░";
	ballVertical = barVertical - 1;
	ballHorizontal = (game[ballVertical].length/2)-(1/2);
	game[ballVertical][ballHorizontal] = "●";
	for (let i = 0; i <= barLength; i++) {
		game[barVertical][bar[i]] = "░";
	}
	moveVertical = -1;
	moveHorizontal = -1; 
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
	for (let i = 0; i <= barLength; i++) {
		game[barVertical][bar[i]] = "▀";
	}
	if (play === "stop") {
		score = 0;
		life = 3;
		setScore(score);
		setLife(life);
	}
	updatePosition();
}
function init() {
	const initialization = '' +
	'<b id="gameArea" style=\"text-align: center; font-family: Courier New; line-height: 100%;\">' +
		'<p id=\"life\"><p id=\"score\"></p><p id=\"game\"></p>' +
	'</b>';
	play = "stop";
	ballVertical = barVertical-1;
	ballHorizontal = (game[ballVertical].length/2)-(1/2);
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
	$(".main-title").after(initialization);
	$(document).keydown(checkKey);
	reset();
}
let game = [];
game.push(["█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "▓", "▓","▓", "▓","▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓", "▓","▓", "▓", "▓", "▓", "▓", "▓", "▓", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "█", "█", "█", "█", "█", "█", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "█", "█", "█", "█", "█", "█", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
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
game.push(["█", "█", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░", "░","░", "░", "░", "░", "░", "░", "░", "█", "█"]);
game.push(["█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█", "█","█", "█", "█", "█", "█", "█", "█", "█", "█"]);
const barVertical = game.length-2;
const barHorizontal = (game[barVertical].length/2)-(1/2);
let bar, ballVertical, ballHorizontal;
let play, score, life, runGame, moveVertical, moveHorizontal;
init();
