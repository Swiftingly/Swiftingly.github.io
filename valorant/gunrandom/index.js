"use strict";

const PRICE_LIST = {
	CLASSIC : 0,
	SHORTY  : 300,
	FRENZY  : 450,
	GHOST   : 500,
	SHERIFF : 800,
	
	STINGER : 1100,
	SPECTRE : 1600,
	
	BUCKY   : 850,
	JUDGE   : 1850,
	
	BULLDOG : 2050,
	GUARDIAN: 2250,
	PHANTOM : 2900,
	VANDAL  : 2900,
	
	MARSHAL : 950,
	OUTLAW : 2400,
	OPERATOR: 4700,
	
	ARES    : 1600,
	ODIN    : 3200
};
const GUN_LIST = {
	SIDEARMS       : ['CLASSIC', 'SHORTY', 'FRENZY', 'GHOST', 'SHERIFF'],
	SMGS           : ['STINGER', 'SPECTRE',],
	SHOTGUNS       : ['BUCKY', 'JUDGE'],
	RIFLES         : ['BULLDOG', 'GUARDIAN', 'PHANTOM', 'VANDAL'],
	'SNIPER RIFLES': ['MARSHAL', 'OUTLAW', 'OPERATOR'],
	'MACHINE GUNS' : ['ARES', 'ODIN']
};

function Clamp(a, b, c) {
    return Math.min(c, Math.max(a, b));
}

function ListIntersect(a, b) {
	return a.some(e => b.includes(e));
}
function ListAdd(a, b) {
	for (const e of b) {
		if (!a.includes(e)) a.push(e);
	}
	return a;
}
function ListRemoveList(a, b) {
	return a.filter(e => !b.includes(e));
}
function ListRemoveItem(a, b) {
	return a.filter(e => e != b);
}
function GunGetCategory(gun) {
	for (const category in GUN_LIST) {
		if (GUN_LIST[category].includes(gun)) return category;
	}
	return '';
}

const element_credits = document.getElementById('credits');
const element_button = document.getElementById('randomize');
const element_clickoff = document.getElementById('clickoff');
const element_output = document.getElementById('output');

function ClampCredits() {
    element_credits.value = Clamp(Math.round(element_credits.value / 50) * 50, 0, 9000);
}

element_credits.addEventListener('change', ClampCredits);

var shift_down = false;
document.addEventListener('keydown', (event) => shift_down = event.shiftKey);
document.addEventListener('keyup', (event) => shift_down = event.shiftKey);

element_credits.addEventListener('wheel', (e) => {
	if (shift_down) element_credits.value = element_credits.value - Math.sign(e.deltaY) * 500;
	else element_credits.value = element_credits.value - Math.sign(e.deltaY) * 50;
	ClampCredits();
	e.preventDefault();
});

var elements = {};
var selectedGuns = Object.keys(PRICE_LIST);

function SelectElement(elem) {
	elem.style.removeProperty("opacity");
}
function DeselectElement(elem) {
	elem.style.setProperty("opacity", "0.4");
}

// Loop through Category Elements in document
for (var element of document.querySelectorAll('.category h2')) {
	elements[element.innerText] = element;
	
	element.addEventListener('click', (e) => {
		var guns = GUN_LIST[e.target.innerText];
		if (ListIntersect(selectedGuns, guns)) {
			selectedGuns = ListRemoveList(selectedGuns, guns);
			for (const name of guns) {
				DeselectElement(elements[name]);
			}
			DeselectElement(e.target);
		}
		else {
			ListAdd(selectedGuns, guns);
			for (const name of guns) {
				SelectElement(elements[name]);
			}
			SelectElement(e.target);
		}
	});
	
}

// Loop through Gun Elements in document
for (var element of document.querySelectorAll('.category p')) {
	elements[element.innerText] = element;
	
	element.addEventListener('click', (e) => {
		var gun = e.target.innerText;
		
		if (!selectedGuns.includes(gun)) {
			selectedGuns.push(gun);
			SelectElement(e.target);
		}
		else {
			selectedGuns = ListRemoveItem(selectedGuns, gun);
			DeselectElement(e.target);
		}
		
		var category = GunGetCategory(gun);
		if (ListIntersect(selectedGuns, GUN_LIST[category])) {
			SelectElement(elements[category]);
		}
		else {
			DeselectElement(elements[category]);
		}
	});
}

element_button.addEventListener('click', () => {
	var guns = selectedGuns.filter(e => parseInt(element_credits.value) >= PRICE_LIST[e]);
	if (guns.length <= 0) {
		if (selectedGuns.length > 0) element_output.innerHTML = "<u>CAN'T AFFORD</u>";
		else element_output.innerHTML = "<u>NO GUNS</u>";
	}
	else {
		var gun = guns[Math.floor(Math.random() * guns.length)];
		element_output.innerText = gun;
		if (element_clickoff.checked) {
			selectedGuns = ListRemoveItem(selectedGuns, gun);
			DeselectElement(elements[gun]);
			
			var category = GunGetCategory(gun);
			if (!ListIntersect(selectedGuns, GUN_LIST[category])) {
				DeselectElement(elements[category]);
			}
		}
	}
    element_output.style.setProperty('animation', 'none');
    element_output.offsetHeight;
    element_output.style.removeProperty('animation');
});