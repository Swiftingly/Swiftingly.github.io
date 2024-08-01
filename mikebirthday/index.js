'use strict';
(() => {

console.log("mike!");

const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const img = document.getElementById("img");
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const word = "25dollarvalorantgiftcard".toUpperCase();

function resize(w, h) {
	const s = Math.min(w, h);
	
	canvas1.width = s;
	canvas1.height = s;
	canvas2.width = s;
	canvas2.height = s;
	
	margin = s * 0.05;
	tile = s * 0.9 / 24;
	tileHalf = tile * 0.5;
	
	ctx1.fillStyle = "black";
	ctx1.font = "bold " + (tile * 0.7) + "px Arial";
	ctx1.textAlign = "center";
	ctx1.textBaseline = "middle";
	
	ctx2.fillStyle = "#00ffff80";
	ctx2.strokeStyle = "#00ffff80";
	ctx2.lineWidth = tile;
	ctx2.lineCap = "round";
	
	
}

var click = false;
var startClick = false;
var startX = 0;
var startY = 0;

var margin = canvas1.width * 0.05;
var tile = canvas1.width * 0.9 / 24;
var tileHalf = tile * 0.5;

var grid = [];

function draw() {
	for (var y = 0; y < 24; y++) {
		if (grid[y] == undefined) grid[y] = [];
		for (var x = 0; x < 24; x++) {
			if (grid[y][x] == undefined) grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
			
			if (y != 5) ctx1.fillText(grid[y][x], margin + x * tile, margin + y * tile);
			else {
				ctx1.fillText(word[x], margin + x * tile, margin + y * tile);
			}
		}
	}
}

resize(window.innerWidth, window.innerHeight);
draw();

addEventListener('resize', () => {
	resize(window.innerWidth, window.innerHeight);
	draw();
});

canvas1.addEventListener("pointerdown", (e) => {
	if (e.button != 0) return;
	
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	
	click = true;
	if (x > margin - tileHalf && x < margin + tileHalf && y > margin - tileHalf + 5 * tile && y < margin + tileHalf + 5 * tile) {
		startClick = true;
	}
	startX = x;
	startY = y;
	e.preventDefault();
});
canvas1.addEventListener("pointermove", (e) => {
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	
	ctx2.clearRect(0, 0, 1000, 1000);
	if (click) {
		ctx2.beginPath();
		ctx2.moveTo(startX, startY);
		ctx2.lineTo(x, y);
		ctx2.stroke();
	}
	e.preventDefault();
});
canvas1.addEventListener("pointerup", (e) => {
	if (e.button != 0) return;
	
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	
	click = false;
	if (startClick && x > margin  - tileHalf + tile * 23 && x < margin + tileHalf + tile * 23 && y > margin - tileHalf + 5 * tile && y < margin + tileHalf + 5 * tile) {
		img.style["z-index"] = 3;
		img.style.opacity = "1";
		img.style.animation = "appear 2s";
		var audio = new Audio("birthday.mp3");
		audio.loop = true;
		audio.play();
	}
	else {
		startClick = false;
		
	}
	e.preventDefault();
});

})();