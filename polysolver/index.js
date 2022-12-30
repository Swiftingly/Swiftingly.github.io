'use strict';
(() => {

function getSelection() {
	return document.getSelection().toString();
}

var output = document.getElementById("poly");
output.addEventListener('copy', (e) => {
	//if (desmos)
	//	e.clipboardData.setData('text/plain', getSelection().replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}").replace(/x(\d+)/g, "x^{$1}"));
	e.clipboardData.setData('text/plain', getSelection().replace(/x(\d+)/g, "x^$1"));
	
	e.preventDefault();
});

const regNum = /^-?\d+$/;
const regFrac = /^-?(\d+)\/(\d+)$/;
const regFloat = /^-?(\d+)\.(\d+)$/;

const table = document.getElementById('points');

const format = document.getElementById('format');

const xinput = document.getElementById('xinput');
const yinput = document.getElementById('yinput');

const useButton = document.getElementById('use');

const copy = document.getElementById('copy');

var selectedRow = null;

function selectRow() {
	for (const cell of selectedRow.children) {
		cell.style.setProperty('background-color', '#FFFF80');
	}
	xinput.value = selectedRow.children[0].innerHTML;
	yinput.value = selectedRow.children[1].innerHTML;
	useButton.innerText = 'Save';
}
function deselectRow() {
	for (const cell of selectedRow.children) {
		cell.style.removeProperty('background-color');
	}
	xinput.value = '';
	yinput.value = '';
	useButton.innerText = 'Add';
}

function newEditButton() {
	var button = document.createElement('button');
	button.classList.add('edit');
	button.addEventListener('click', (e) => {
		if (selectedRow) {
			deselectRow();
			if (selectedRow != e.target.parentElement.parentElement) {
				selectedRow = e.target.parentElement.parentElement;
				selectRow();
			}
			else selectedRow = null;
		}
		else {
			selectedRow = e.target.parentElement.parentElement;
			selectRow();
		}
		//e.target.parentElement.parentElement.parentElement.deleteRow(e.target.parentElement.parentElement.rowIndex);
	});
	return button;
}
function newDeleteButton() {
	var button = document.createElement('button');
	button.classList.add('delete');
	button.addEventListener('click', (e) => {
		if (selectedRow == e.target.parentElement.parentElement) {
			deselectRow();
			selectedRow = null;
		}
		
		e.target.parentElement.parentElement.parentElement.deleteRow(e.target.parentElement.parentElement.rowIndex);
	});
	return button;
}

useButton.addEventListener('click', () => {
	if (!(
		(regNum.test(xinput.value) || regFrac.test(xinput.value) || regFloat.test(xinput.value)) &&
		(regNum.test(yinput.value) || regFrac.test(yinput.value) || regFloat.test(yinput.value))
		)) return;
	
	if (selectedRow) {
		selectedRow.children[0].innerHTML = xinput.value;
		selectedRow.children[1].innerHTML = yinput.value;
		
		deselectRow();
		selectedRow = null;
		
		useButton.innerText = 'Add';
	}
	else {
		var row = table.insertRow(table.rows.length - 1);
		row.classList.add('point');
		
		var cellX = row.insertCell();
		var cellY = row.insertCell();
		var cellModify = row.insertCell();
		
		cellX.innerHTML = xinput.value;
		cellY.innerHTML = yinput.value;
		xinput.value = '';
		yinput.value = '';
		cellModify.appendChild(newEditButton());
		cellModify.appendChild(newDeleteButton());
	}
});

function getFrac(str) {
	if (regNum.test(str)) {
		return new Frac(parseInt(str));
	}
	
	var match = str.match(regFrac);
	if (match != null) {
		return new Frac(parseInt(match[1]), parseInt(match[2]));
	}
	
	match = str.match(regFloat);
	if (match != null) {
		return new Frac(parseInt(match[1] + match[2]), 10 ** parseInt(match[2].length));
	}
	
	return null;
}

document.getElementById('solve').addEventListener('click', () => {
	var pointList = [];
	
	for (const row of document.getElementsByClassName('point')) {
		var x = getFrac(row.children[0].innerText);
		var y = getFrac(row.children[1].innerText);
		if (x != null && y != null) pointList.push([x,y]);
	}
	
	var poly = solve(pointList);
	output.innerHTML = polyOutput(poly);
	
	copy.style.display = null;
});
document.getElementById('copy').addEventListener('click', () => {
	var copyText = output.innerText.replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}").replace(/x(\d+)/g, "x^{$1}");
	navigator.clipboard.writeText(copyText);
});

function gcd(a, b) {
	return (b == 0) ? a : gcd(b, a % b);
}
function lcm(a, b) {
	return (a * b) / gcd(a, b);
}

class Frac {
	constructor(n, d = 1) {
		if (n == 0n) {
			this.num = 0n;
			this.den = 1n;
		}
		else if (d >= 0n) {
			this.num = BigInt(n);
			this.den = BigInt(d);
		}
		else {
			this.num = BigInt(-n);
			this.den = BigInt(-d);
		}
		
		this.reduce();
	}
	equals(f) {
		return this.num == f.num && this.den == f.den;
	}
	neg() {
		return new Frac(-this.num, this.den);
	}
	add(f) {
		return new Frac(this.num * f.den + f.num * this.den, this.den * f.den);
	}
	subtract(f) {
		return new Frac(this.num * f.den - f.num * this.den, this.den * f.den);
	}
	multiply(f) {
		return new Frac(this.num * f.num, this.den * f.den);
	}
	divide(f) {
		return new Frac(this.num * f.den, this.den * f.num);
	}
	pow(v) {
		return new Frac(this.num ** v, this.den ** v);
	}
	reduce() {
		var d = gcd(this.num, this.den);
		if (d < 0) d = -d;
		this.num /= d;
		this.den /= d;
	}
	toString() {
		if (this.den == 1) return this.num.toString();
		return this.num.toString() + '/' + this.den.toString();
	}
}

const zeroFrac = new Frac(0n);
const oneFrac = new Frac(1n);
const negFrac = new Frac(-1n);

function shrink(poly) {
	for (var i = poly.length; i >= 1; i--) {
		if (!poly[i - 1].equals(zeroFrac)) {
			poly.splice(i);
			break;
		}
	}
}

function polyAdd(poly1, poly2) {
	var size = Math.max(poly1.length, poly2.length);
	
	var newPoly = new Array(size);
	for (var i = 0; i < size; i++) {
		newPoly[i] = (poly1[i] || zeroFrac).add(poly2[i] || zeroFrac);
	}
	shrink(newPoly);
	
	return newPoly;
}

function polyMultiply(poly1, poly2) {
	var size = poly1.length + poly2.length - 1;
	
	var newPoly = new Array(size).fill(zeroFrac);
	for (var i = 0; i < poly1.length; i++) {
		for (var j = 0; j < poly2.length; j++) {
			newPoly[i + j] = newPoly[i + j].add(poly1[i].multiply(poly2[j]));
		}
	}
	
	return newPoly;
}

function polyZero(values) {
	var poly = [oneFrac];
	for (const v of values) {
		poly = polyMultiply(poly, [v.neg(), oneFrac]);
	}
	return poly;
}

function getValue(poly, x) {
	var v = zeroFrac;
	var p = oneFrac;
	for (var i = 0; i < poly.length; i++) {
		v = v.add(poly[i].multiply(p));
		p = p.multiply(x);
	}
	
	return v;
}

function polyOutput(poly) {
	var out = [];
	
	if (format.checked) {
		var m = poly[0].den;
		for (var i = 1; i < poly.length; i++) {
			m = lcm(m, poly[i].den);
		}
		
		for (var i = poly.length - 1; i >= 0; i--) {
			if (poly[i].equals(zeroFrac)) continue;
			if (i == 0) out.push(poly[i].num * m / poly[i].den);
			else {
				var co = poly[i].num * m / poly[i].den;
				if (co == 1n) co = '';
				else if (co == -1n) co = '-';
				if (i == 1) out.push(co + "x");
				else out.push(co + "x<sup>" + i + "</sup>");
			}
		}
		return '(' + out.join(' + ').replaceAll('+ -', '- ') + ') / ' + m;
	}
	else {
		for (var i = poly.length - 1; i >= 0; i--) {
			if (poly[i].equals(zeroFrac)) continue;
			if (i == 0) out.push(poly[i]);
			else {
				var co;
				if (poly[i].equals(oneFrac)) co = '';
				else if (poly[i].equals(negFrac)) co = '-';
				else co = poly[i].toString();
				if (i == 1) out.push(co + "x");
				else out.push(co + "x<sup>" + i + "</sup>");
			}
		}
		return out.join(' + ').replaceAll('+ -', '- ');
	}
}

function solve(points) {
	var poly = [];
	
	for (var i = 0; i < points.length; i++) {
		var xList = points.map(p => p[0]);
		var x = xList.splice(i, 1)[0];
		var newPoly = polyZero(xList);
		var value = getValue(newPoly, x);
		newPoly = newPoly.map(e => e.multiply(points[i][1]).divide(value));
		
		poly = polyAdd(poly, newPoly);
	}
	
	return poly;
}

})();