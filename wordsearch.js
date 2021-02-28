const dirs = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
var rows = [];
var width = 0, height = 0;
function draw(positions) {
	var canvas = document.getElementById("wordSearch");
	var ctx = canvas.getContext('2d');
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	ctx.lineWidth = 6;
	
	let xSpace = 600 / width;
	let ySpace = 600 / height;
	var size = Math.floor(Math.min(xSpace, ySpace));
	ctx.font = String(size) + "px Courier New";
	
	ctx.beginPath();
	for (let i = 0; i <= width; i++) {
		ctx.moveTo(i * xSpace, 0);
		ctx.lineTo(i * xSpace, 600);
	}
	for (let i = 0; i <= height; i++) {
		ctx.moveTo(0, i * ySpace);
		ctx.lineTo(600, i * ySpace);
	}
	ctx.stroke();
	
	
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 0.5;
	for (let i = 0; i < positions.length; i++) {
		ctx.beginPath();
		ctx.strokeStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.5)`;
		
		var w = positions[i];
		var xStart = (w.x1 + 0.5) * xSpace;
		var yStart = (w.y1 + 0.5) * ySpace;
		var xEnd = (w.x2 + 0.5) * xSpace;
		var yEnd = (w.y2 + 0.5) * ySpace;
		var xMid = (xStart + xEnd) / 2;
		var yMid = (yStart + yEnd) / 2;
		var dx = xEnd - xStart;
		var dy = yEnd - yStart;
		var dist = Math.sqrt(dx * dx + dy * dy);
		ctx.ellipse(xMid, yMid, (dist / 2 + xSpace / 2) - 10, (size / 2) - 10, Math.atan2(dy, dx), 0, Math.PI * 2);
		ctx.stroke();
		
		//ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	ctx.globalAlpha = 1;
	
	for (let y = 0; y < height; y++) {
		var row = rows[y];
		for (let x = 0; x < width; x++) {
			ctx.fillText(row[x], (x + 0.5) * xSpace, (y + 0.5) * ySpace);
		}
	}
	ctx.strokeStyle = "black";
}
function findWord(x, y, word, dir, pos, full) {
	if (pos === word.length) return full;
	if (x < 0 || x >= width || y < 0 || y >= height) return "";
	if (rows[y][x] === word[pos] || word[pos] === '?') return findWord(x + dir[0], y + dir[1], word, dir, pos + 1, full + rows[y][x]);
	return "";
}
function solve() {
	var grid = document.getElementById("grid").value.toUpperCase();
	rows = grid.split(/[\r\n]/g);
	height = rows.length;
	width = rows[0].length;
	var element = document.getElementById("word");
	var word = element.value.toUpperCase();
	element.value = "";
	
	var words = [];
	positions = [];
	for (let y = 0; y < height; y++) {
		var row = rows[y];
		for (let x = 0; x < width; x++) {
			if (row[x] !== word[0] && word[0] !== '?') continue;
			for (let d = 0; d < dirs.length; d++) {
				var dir = dirs[d];
				var full = findWord(x + dir[0], y + dir[1], word, dir, 1, row[x]);
				if (full !== "") {
					positions.push({ x1: x, y1: y, x2: x + dir[0] * (word.length - 1), y2: y + dir[1] * (word.length - 1)});
					words.push(`${full} x${x} y${y}`);
				}
			}
		}
	}
	draw(positions);
	
	document.getElementById("words").innerHTML = words.join('<br>');
	
	return false;
}