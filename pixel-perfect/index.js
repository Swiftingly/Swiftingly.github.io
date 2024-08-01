//import * as MODD from './omggif.js';
//console.log(MODD);

"use strict";

var Canvas, Ctx;
var Width, Height;
var GetData, SetData;

function Color(R, G=R, B=R, A=255) {
	return {r:R,g:G,b:B,a:A};
}
function Mod(a, b) {
	return ((a % b) + b) % b;
}
function ColorHSV(H, S, V, A=255) {
	H = Mod(H, 360);
	
	let C = S * V;
	let X = C * (1 - Math.abs(((H / 60) % 2) - 1));
	let M = V - C;
	
	var color;
	
	if      (H < 60)  color = Color(C, X, 0, A);
	else if (H < 120) color = Color(X, C, 0, A);
	else if (H < 180) color = Color(0, C, X, A);
	else if (H < 240) color = Color(0, X, C, A);
	else if (H < 300) color = Color(X, 0, C, A);
	else              color = Color(C, 0, X, A);
	
	color.r = Byte((color.r + M) * 255);
	color.g = Byte((color.g + M) * 255);
	color.b = Byte((color.b + M) * 255);
	
	return color;
}
function GetHSV(color) {
	let r = color.r / 255;
	let g = color.g / 255;
	let b = color.b / 255;
	let Cmax = Math.max(r, g, b);
	let Cmin = Math.min(r, g, b);
	let delta = Cmax - Cmin;
	
	let H, S, V;
	
	if (delta == 0) H = 0;
	else if (Cmax == r) H = 60 * (((g - b) / delta) % 6);
	else if (Cmax == g) H = 60 * (((b - r) / delta) + 2);
	else if (Cmax == b) H = 60 * (((r - g) / delta) + 4);
	
	if (Cmax == 0) S = 0;
	else S = delta / Cmax;
	V = Cmax;
	
	return {h: H, s: S, v: V};
}

function Mix(c1, c2, a) {
	return {
		r: LerpF(c1.r, c2.r, a),
		g: LerpF(c1.g, c2.g, a),
		b: LerpF(c1.b, c2.b, a),
		a: LerpF(c1.a, c2.a, a),
	};
}
function MixHSV(c1, c2, a) {
	let hsv1 = GetHSV(c1);
	let hsv2 = GetHSV(c2);
	
	if (hsv1.h + 180 < hsv2.h) hsv1.h += 360;
	else if (hsv2.h + 180 < hsv1.h) hsv2.h += 360;
	return ColorHSV(Lerp(hsv1.h, hsv2.h, a), Lerp(hsv1.s, hsv2.s, a), Lerp(hsv1.v, hsv2.v, a), Lerp(c1.a, c2.a, a));
}
function MixGivenHSV(hsv1, hsv2, a, a1=255, a2=255) {
	if (hsv1.h + 180 < hsv2.h) hsv1.h += 360;
	else if (hsv2.h + 180 < hsv1.h) hsv2.h += 360;
	return ColorHSV(Lerp(hsv1.h, hsv2.h, a), Lerp(hsv1.s, hsv2.s, a), Lerp(hsv1.v, hsv2.v, a), Lerp(a1, a2, a));
}

function Sqr(n) {
	return n * n;
}
function Clamp(a, b, c) {
	return Math.min(Math.max(a, b), c);
}
function Byte(n) {
	return Clamp(Math.floor(n), 0, 255);
}
function Lerp(a, b, c) {
	return a + (b - a) * c;
}
function LerpF(a, b, c) {
	return a + Math.floor((b - a) * c);
}

function GetXYColor(x, y, data=GetData) {
	let p = (y * Width + x) * 4;
	return Color(data[p + 0], data[p + 1], data[p + 2], data[p + 3]);
}
function SetXYColor(x, y, c, data=SetData) {
	let p = (y * Width + x) * 4;
	data[p + 0] = c.r;
	data[p + 1] = c.g;
	data[p + 2] = c.b;
	data[p + 3] = c.a;
}
function SetXYRGB(x, y, r, g, b, a=255, data=SetData) {
	let p = (y * Width + x) * 4;
	data[p + 0] = r;
	data[p + 1] = g;
	data[p + 2] = b;
	data[p + 3] = a;
}
function SetXYfRGB(x, y, r, g, b, a, data=SetData) {
	let p = (y * Width + x) * 4;
	data[p + 0] = r * 255;
	data[p + 1] = g * 255;
	data[p + 2] = b * 255;
	data[p + 3] = a * 255;
}

function CreateData() {
	return new Uint8ClampedArray(Width * Height * 4);
}
function DupeData(data=GetData) {
	return new Uint8ClampedArray(data);
}
function BeginDirect(data=GetData) {
	Canvas = document.createElement('canvas');
	Canvas.width = Width;
	Canvas.height = Height;
	Ctx = Canvas.getContext('2d');
	Ctx.putImageData(new ImageData(data, Width, Height), 0, 0);
}
function EndDirect() {
	SetData = Ctx.getImageData(0, 0, Width, Height).data;
	Canvas.remove();
}

(()=>{
const eCodeSelect = document.getElementById('code-select');

const eInputWidth = document.getElementById('width');
const eInputHeight = document.getElementById('height');
const eInputViewScale = document.getElementById('view-scale');

const eButtonGenerate = document.getElementById('generate');
const eButtonDownload = document.getElementById('download');

const canvas = document.getElementById('output-image');
const ctx = canvas.getContext('2d');

const code = document.getElementById('code');

var scripts = [];
var custom_script = localStorage.getItem('custom-script') ?? "";

function SetScript(index) {
	if (index >= scripts.length) {
		code.value = custom_script;
	}
	else code.value = scripts[index];
}

fetch("scripts.txt")
	.then((res) => res.text())
	.then((text) => {
		scripts = text.split(/\$\$\$\$\r?\n/g);
		SetScript(eCodeSelect.selectedIndex);
	})
	.catch((e) => console.error(e));

setInterval(() => {
	localStorage.setItem('custom-script', custom_script);
}, 5000);

function SetImage() {
	canvas.width = eInputWidth.value;
	canvas.height = eInputHeight.value;
	
	var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	Width = canvas.width;
	Height = canvas.height;
	GetData = DupeData(image_data.data);
	SetData = CreateData();
	
	var generate_function = new Function(code.value);
	generate_function();
	ctx.putImageData(new ImageData(SetData, Width, Height), 0, 0);
}

function ResizeCanvas() {
	canvas.style.transform = `translateY(-50%) scale(${eInputViewScale.value}) translateY(50%)`;
}
ResizeCanvas();

eCodeSelect.addEventListener('change', (event) => {
	SetScript(event.target.selectedIndex);
});
code.addEventListener('change', (event) => {
	if (eCodeSelect.value === 'custom-script') {
		custom_script = code.value;
	}
});
eInputViewScale.addEventListener('change', (event) => {
	ResizeCanvas();
});

code.addEventListener('keydown', (event) => {
	if (event.key === 'Tab') {
		event.preventDefault();
		document.execCommand("insertText", false, '  ');
	}
	else if (event.key === 'Backspace') {
		
		if (code.selectionStart == code.selectionEnd && code.value.substring(code.selectionStart - 2, code.selectionStart) == '  ') {
			event.preventDefault();
			document.execCommand("delete", false);
			document.execCommand("delete", false);
		}
	}
});
eButtonGenerate.addEventListener('click', () => {
	SetImage();
	eButtonDownload.classList.remove('download-off');
});
eButtonDownload.addEventListener('click', () => {
	if (!eButtonDownload.classList.contains('download-off')) {
		var image = canvas.toDataURL();
		
		var aDownloadLink = document.createElement('a');
		
		aDownloadLink.href = image;
		aDownloadLink.download = 'image.png';
		aDownloadLink.click();
		
		aDownloadLink.remove();
	}
});

})();