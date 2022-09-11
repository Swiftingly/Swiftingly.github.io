console.log("mike!");

const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const img = document.getElementById("img");
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

ctx1.fillStyle = "black";
ctx2.fillStyle = "#00ffff80";

ctx2.strokeStyle = "#00ffff80";
ctx2.lineWidth = 40;

var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var word = "25dollarvalorantgiftcard".toUpperCase();

ctx1.font = "bold 24px Arial";
ctx1.textAlign = "center";

var tile = 900 / 24;

for (var y = 0; y < 24; y++) {
	for (var x = 0; x < 24; x++) {
		if (y != 5) ctx1.fillText(letters[Math.floor(Math.random() * letters.length)], 50 + x * tile, 50 + y * tile);
		else {
			ctx1.fillText(word[x], 50 + x * tile, 50 + y * tile);
		}
	}
}

var click = false;
var startClick = false;
var startX = 0;
var startY = 0;

canvas1.addEventListener("pointerdown", (e) => {
	click = true;
	if (e.clientX > 30 && e.clientX < 70 && e.clientY > 30 + 5 * tile && e.clientY < 70 + 5 * tile) {
		startClick = true;
	}
	startX = e.clientX;
	startY = e.clientY;
	e.preventDefault();
});
canvas1.addEventListener("pointermove", (e) => {
	if (e.clientX > 30 && e.clientX < 70 && e.clientY > 30 + 5 * tile && e.clientY < 70 + 5 * tile) {
		ctx2.fillRect(30, 30 + 5 * tile, 40, 40);
		startClick = true;
	}
	ctx2.clearRect(0, 0, 1000, 1000);
	if (click) {
		ctx2.beginPath();
		ctx2.moveTo(startX, startY);
		ctx2.lineTo(e.clientX, e.clientY);
		ctx2.stroke();
	}
	e.preventDefault();
});
canvas1.addEventListener("pointerup", (e) => {
	click = false;
	if (startClick && e.clientX > 30 + tile * 23 && e.clientX < 70 + tile * 23 && e.clientY > 30 + 5 * tile && e.clientY < 70 + 5 * tile) {
		ctx2.fillRect(30 + tile * 23, 30 + 5 * tile, 40, 40);
		img.style["z-index"] = 3;
		img.style.opacity = "1";
		img.style.animation = "appear 2s";
		var audio = new Audio("birthday.mp3");
		audio.play();
	}
	else {
		startClick = false;
		
	}
	e.preventDefault();
});