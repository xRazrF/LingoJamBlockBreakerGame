"use strict";
function gameControl(e) {
	e = e || window.event;
	function moveBall() {
		function scoring() {
			gameScore += 10;
			setScore(gameScore);
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
		if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "▀" || game[ballVertical + moveVertical][ballHorizontal] === "▀") {
			if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 1] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 1] === "▀"  && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal - 2] === "▀" && game[ballVertical + moveVertical][ballHorizontal + moveHorizontal + 2] === "▀") {
				game[ballVertical ][ballHorizontal ] = "░";
				ballHorizontal += randomDirection();
				game[ballVertical ][ballHorizontal ] = "●";
			}
			moveHorizontal = randomDirection();
			moveVertical *= -1;
			if (game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] === "█") {
				moveHorizontal *= -1;
			}
		}
		if (ballVertical === barVertical) {
			clearInterval(gameInterval);
			if (gameLife === 0) {
				gameState = "stop";
				const gameOver = "Game Over!\nYour score: " + gameScore + " pts";
				alert(gameOver);
				console.log(gameOver);
			}
			else {
				gameState = "break";
				gameLife -= 1;
				setLife(gameLife);
			}
			resetGame();
			return;
		}
		game[ballVertical + moveVertical][ballHorizontal + moveHorizontal] = "●";
		game[ballVertical][ballHorizontal] = "░";
		ballVertical += moveVertical;
		ballHorizontal += moveHorizontal;
		updatePosition();
	}
	function moveBar (a, b) {
		game[barVertical][bar[a] + b] = "▀";
		game[barVertical][bar[a]] = "░";
		bar[a] += b;
	}
	function randomDirection() {
		const directions = [1, -1];
		const random = directions[Math.floor(Math.random() * directions.length)];
		return random;
	}
	if (e.keyCode === 37 && gameState !== "pause") { //←
		if (game[barVertical][bar[barFirst] - 1] !== "█") {
			if (gameState !== "play") {
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
	else if (e.keyCode === 39 && gameState !== "pause") { //→
		if (game[barVertical][bar[barLength] + 1] !== "█") {
			if (gameState !== "play") {
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
	if (e.keyCode === 32) { //SPACE
		const ballSlowness = 100;
		e.preventDefault();
		if (gameState === "stop" || gameState === "break") {
			moveVertical = -1;
			moveHorizontal = randomDirection();
			gameState = "play";
			gameInterval = window.setInterval(function(){
				moveBall();
			}, ballSlowness);
		}
		else if (gameState === "play") {
			clearInterval(gameInterval);
			$("#score").html("Paused");
			gameState = "pause";
		}
		else if  (gameState === "pause") {
			gameInterval = window.setInterval(function(){
				moveBall();
			}, ballSlowness);
			setScore(gameScore);
			gameState = "play";
		}
	}
}
function updatePosition() {
	$("#game").html(game.map(a => a.join('')).join('<br>'));
}
function setLife(gameLife) {
	let lifeString = "";
	for (let i = 0; i < gameLife; i++) {
		lifeString += "♥";
	}
	if (gameLife === 0) {
		lifeString = "<br>";
	}
	$("#life").html(lifeString);
}
function setScore(gameScore) {
	let scoreString = "Score: " + gameScore + " pts";
	$("#score").html(scoreString);
}
function resetGame() {
	if (gameState === "stop") {
		game = JSON.parse(JSON.stringify(gameBackup));
		gameScore = 0;
		gameLife = 3;
		setScore(gameScore);
		setLife(gameLife);
	}
	game[ballVertical][ballHorizontal] = "░";
	ballVertical = barVertical - 1;
	ballHorizontal = (game[ballVertical].length-1)/2;
	game[ballVertical][ballHorizontal] = "●";
	for (let i = barFirst; i <= barLength; i++) {
		game[barVertical][bar[i]] = "░";
	}
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
	for (let i = barFirst; i <= barLength; i++) {
		game[barVertical][bar[i]] = "▀";
	}
	updatePosition();
}
function initGame() {
	alert("Press 'space' to start or pause the game, press arrow buttons '←' or '→' to move, you can move the bar before the game started.");
	gameState = "stop";
	gameBackup = JSON.parse(JSON.stringify(game));
	barVertical = game.length-2;
	barHorizontal = (game[barVertical].length-1)/2;
	bar = [barHorizontal-3, barHorizontal-2, barHorizontal-1, barHorizontal , barHorizontal+1, barHorizontal+2, barHorizontal+3];
	barFirst = 0;
	barLength = bar.length - 1;
	ballVertical = barVertical-1;
	ballHorizontal = (game[ballVertical].length-1)/2;
	const initialization = '' +
	'<b id="gameArea" style="text-align: center; font-family: Courier New; line-height: 100%;">' +
		'<p id="life"><p id="score"></p><p id="game"></p>' +
	'</b>';
	$(".main-title").after(initialization);
	$(document).keydown(gameControl);
	resetGame();
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
let bar, barVertical, barHorizontal, barFirst, barLength;
let ballVertical, ballHorizontal;
let moveVertical, moveHorizontal;
let gameState, gameScore, gameLife, gameInterval, gameBackup;
initGame();
