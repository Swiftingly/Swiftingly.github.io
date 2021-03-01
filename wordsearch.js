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
	ctx.font = String(size) + "px Consolas";
	
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
	
	//var grad = ctx.createLinearGradient(0, 0, 600, 0);
	//grad.addColorStop(0, "red");
	//grad.addColorStop(1, "yellow");
	//ctx.strokeStyle = grad;
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 0.5;
	
	for (let i = 0; i < positions.length; i++) {
		ctx.beginPath();
		
		var p = positions[i];
		var x = (p[0]) * xSpace + 10;
		var y = (p[1]) * ySpace + 10;
		var dx = p[2] - p[0];
		var dy = p[3] - p[1];
		var w = Math.sqrt(dx * dx + dy * dy) * xSpace - 20;
		var h = ySpace - 20;
		
		var offX = (p[0] + 0.5) * xSpace;
		var offY = (p[1] + 0.5) * ySpace;
		
		var rot = Math.atan2(dy * ySpace, dx * xSpace);
		
		var grad = ctx.createLinearGradient(x, y, x + w, y);
		grad.addColorStop(0, "red");
		grad.addColorStop(1, "blue");
		ctx.strokeStyle = grad;
		
		ctx.translate(offX, offY);
		ctx.rotate(rot);
		ctx.translate(-offX, -offY);
		
		ctx.strokeRect(x, y, w, h);
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
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
					positions.push([ x, y, x + dir[0] * (word.length), y + dir[1] * (word.length) ]);
					words.push(`${full} x${x} y${y}`);
				}
			}
		}
	}
	draw(positions);
	
	document.getElementById("words").innerHTML = words.join('<br>');
	
	return false;
}