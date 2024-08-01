'use strict';

var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

function resize() {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}
resize();
addEventListener('resize', resize);

var confetti = [];

function randRange(a, b) {
	return Math.random() * (b - a) + a;
}
function irandRange(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}
function randSign() {
	return (Math.random() < 0.5) ? 1 : -1;
}

function randConfetti() {
	var rgb = [randRange(0, 255), randRange(0, 255), randRange(0, 255)];
	let rand = Math.floor(Math.random() * 6);
	rgb[rand % 3] = 255;
	rgb[((rand % 3) + (rand % 2) + 1) % 3] = 0;
	return {x:randRange(-20, canvas.width + 20), y:-2, w:4,h:2,rot: randRange(0, Math.PI * 2),
		dx: randRange(-1, 1), dy: randRange(0.5, 1.5), dr: randRange(0.04, 0.08)*randSign(),
		rOff: randRange(0, Math.PI * 2), rMOff: randRange(1, 1.5),
		color:`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`};
}

function rotate(x, y, rot) {
	let c = Math.cos(rot);
	let s = Math.sin(rot);
	return [x*c + y*s, y*c - x*s];
}

var frame = 0;

function main(delta) {
	requestAnimationFrame(main);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	frame++;
	
	var size = Math.min(canvas.width, canvas.height) * 0.9 * 0.5;
	
	const CX = canvas.width * 0.5;
	const CY = canvas.height * 0.5;
	
	// Clock
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	
	ctx.beginPath();
	ctx.arc(CX, CY, size, 0, Math.PI * 2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(CX, CY, size * 0.02, 0, Math.PI * 2);
	ctx.fill();
	
	
	
	for (var i = 0; i < 60; i++) {
		ctx.beginPath();
		let a = i / 60 * Math.PI * 2;
		let c = Math.cos(a) * size;
		let s = Math.sin(a) * size;
		
		let scale = (i % 5 == 0) ? 0.94 : 0.97;
		ctx.lineWidth = (i % 5 == 0) ? 4 : 2;
		
		ctx.moveTo(CX + c * scale, CY + s * scale);
		ctx.lineTo(CX + c, CY + s);
		ctx.stroke();
	}
	
	//ctx.lineWidth = size * 0.02;
	//ctx.moveTo(CX, CY);
	//ctx.lineTo();
	//ctx.fillRect(0, 0, canvas.width, canvas.height);
	confetti.push(randConfetti());
	
	var confettiTemp;
	if (frame % 150 == 0) confettiTemp = [];
	
	for (var i = 0; i < confetti.length; i++) {
		var c = confetti[i];
		
		
		if (c == null) continue;
		if (frame % 150 == 0) {
			confettiTemp.push(c);
		}
		
		ctx.fillStyle = c.color;
		ctx.beginPath();
		
		var p1 = rotate(c.w, c.h, c.rot);
		var p2 = rotate(-c.w, c.h, c.rot);
		
		ctx.moveTo(c.x + p1[0], c.y + p1[1]);
		ctx.lineTo(c.x + p2[0], c.y + p2[1]);
		ctx.lineTo(c.x - p1[0], c.y - p1[1]);
		ctx.lineTo(c.x - p2[0], c.y - p2[1]);
		
		ctx.closePath();
		ctx.fill();
		c.x += (Math.sin(delta / 1000 * c.rMOff + c.rOff) + c.dx);
		c.y += c.dy * 2;
		c.rot += c.dr;
		if (c.y > canvas.height + 20) confetti[i] = null;
	}
	
	if (frame % 150 == 0) {
		//console.log('XX ' + confetti.length);
		confetti = confettiTemp;
		//console.log(confetti.length);
	}
}
requestAnimationFrame(main);