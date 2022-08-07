'use strict';
(() => {

var workerLoaded = false;

// Image input elements
const progress = document.getElementById("progress");

const imageInput = document.getElementById("image");
const loadButton = document.getElementById("load");

// Input elements
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const boardInput = document.getElementById("board-input");

var solveMode = 0;

const solveModeInput = document.getElementsByName("solve-mode");

const wordInput = document.getElementById("word-input");


for (const element of solveModeInput) {
	element.addEventListener('click', (e) => {
		solveMode = e.target.value;
		console.log(solveMode);
		
		if (solveMode == 0) {
			wordInput.classList.add('hidden');
			
		}
		else {
			wordInput.classList.remove('hidden');
		}
	});
}

// Output elements
const solveButton = document.getElementById("solve");
const board = document.getElementById("board");
const boardAnswers = document.getElementById("board-answers");

const ctx = board.getContext('2d', { alpha: false });
const overCtx = board.getContext('2d');

const worker = Tesseract.createWorker({
	logger: m => {
		console.log(m);
		if (m.status === 'recognizing text' && m.progress) {
			progress.style.width = m.progress * 100 + '%';
		}
	}
});

(async() => {
	await worker.load();
	
	await worker.loadLanguage('eng');
	await worker.initialize('eng');
	await worker.setParameters({
		tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	});
	workerLoaded = true;
})();

window.onbeforeunload = (e) => {
	if (workerLoaded) worker.terminate();
	return null;
}

window.addEventListener('paste', (e) => {
	imageInput.files = e.clipboardData.files;
});

loadButton.addEventListener('click', () => {
	if (imageInput.files[0]) {
		worker.recognize(imageInput.files[0]).then((output) => {
			console.log("done");
			var text = [];
			for (const line of output.data.lines) {
				text.push(line.text.slice(0, widthInput.value));
			}
			boardInput.value = text.join('\n');
			changeInput();
		});
	}
});

function changeInput() {
	boardInput.value = boardInput.value.split('')
		.filter(c => /[A-Za-z\n]/.test(c)).join('')
		.toUpperCase();
}

widthInput.addEventListener('change', () => {
	boardInput.cols = widthInput.value;
	changeInput();
});
heightInput.addEventListener('change', () => {
	boardInput.rows = heightInput.value;
	changeInput();
});

boardInput.addEventListener('input', () => {
	changeInput();
});
wordInput.addEventListener('input', () => {
	wordInput.value = wordInput.value.split('')
		.filter(c => /[A-Za-z\n]/.test(c)).join('');
});

function drawBoard(grid) {
	const margin = 30;
	const cellSize = 60;
	
	board.width = cellSize * widthInput.value + margin * 2;
	board.height = cellSize * heightInput.value + margin * 2;
	boardAnswers.width = board.width;
	boardAnswers.height = board.height;
	
	ctx.fillStyle = "#7FBDFF";
	ctx.fillRect(0, 0, board.width, board.height);
	
	ctx.filter = 'blur(6px)';
	ctx.fillStyle = "white";
	ctx.fillRect(margin, margin, board.width - margin * 2, board.height - margin * 2);
	ctx.filter = 'none';
	ctx.fillRect(margin, margin, board.width - margin * 2, board.height - margin * 2);
	
	ctx.fillStyle = "black";
	ctx.font = '48px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	for (var y = 0; y < heightInput.value; y++) {
		for (var x = 0; x < widthInput.value; x++) {
			ctx.fillText(grid[y][x], margin + cellSize * (x + 0.5), margin + cellSize * (y + 0.5));
		}
	}
	
	board.classList.remove('hidden');
	boardAnswers.classList.remove('hidden');
}
function drawAnswers(answers) {
	const margin = 30;
	const cellSize = 60;
	
	overCtx.globalAlpha = 0.5;
	overCtx.strokeStyle = "#FF00FF";
	overCtx.lineWidth = 8;
	
	overCtx.beginPath();
	for (var answer of answers) {
		var x = margin + cellSize * (answer[0] + 0.5);
		var y = margin + cellSize * (answer[1] + 0.5);
		var angle = angles[answer[2]];
		//console.log(answer[2]);
		overCtx.moveTo(x, y);
		overCtx.lineTo(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30);
		overCtx.moveTo(x + 30, y);
		overCtx.arc(x, y, 26, 0, Math.PI * 2);
	}
	overCtx.stroke();
}

const dirs = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
var angles = [];
for (var i = 0; i < 8; i++) {
	angles[i] = Math.atan2(dirs[i][1], dirs[i][0]);
}

solveButton.addEventListener('click', async () => {
	var words;
	if (solveMode == 0) {
		words = await fetch('./corncob_words.txt',
		{ headers: {
			'Content-Type': 'text/plain'
		}
		}).then(response => response.text());
	}
	else {
		words = wordInput.value.toUpperCase();
	}
	words = words.split(/\r?\n/).filter(w => w.length >= 3);
	var grid = boardInput.value.split('\n');
	
	if (words < 1) {
		alert("No words selected");
		return;
	}
	if (grid.length != heightInput.value || grid.some(e => !new RegExp(`[A-Z]{${widthInput.value}}`).test(e))) {
		alert("Invalid grid");
		return;
	}
	var answers = wordSearch(grid, words);
	
	drawBoard(grid);
	drawAnswers(answers);
});

function contWord (grid,word,wordPos,x,y,dir) {
	const gridWidth = grid[0].length;
	const gridHeight = grid.length;
	x += dir[0];
	y += dir[1];
	if (!(x >= 0 && x < gridWidth && y >= 0 && y < gridHeight)) return false;
	if (word[wordPos] === grid[y][x]) {
		if (word.length-1 === wordPos) return true;
		return contWord(grid,word,wordPos+1,x,y,dir);
	}
	return false;
}

function wordSearch(grid,words) {
	var answers = [];
	const gridWidth = grid[0].length;
	const gridHeight = grid.length;
	for (let x = 0; x < gridWidth; x++) {
		for (let y = 0; y < gridHeight; y++) {
			for (let w = 0; w < words.length; w++) {
				let word = words[w];
				if (word[0] === grid[y][x]) {
					for (let d = 0; d < dirs.length; d++) {
						if (contWord(grid,word,1,x,y,dirs[d]))
							answers.push([x, y, d]);
							//console.log(`${word} - (${String(x+1)}, ${String(y+1)}, ${d})`);
					}
				}
			}
		}
	}
	
	return answers;
}

})();