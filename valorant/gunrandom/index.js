'use strict';

(() => {

Math.clamp = (a, b, c) => Math.min(c, Math.max(a, b));
function intersect(a, b) {
	return a.some(e => b.includes(e));
}
function addList(a, b) {
	for (const e of b) {
		if (!a.includes(e)) a.push(e);
	}
	return a;
}
function removeList(a, b) {
	return a.filter(e => !b.includes(e));
}
function remove(a, b) {
	return a.filter(e => e != b);
}
function getCategory(gun) {
	for (const cat in gunList) {
		if (gunList[cat].includes(gun)) return cat;
	}
	return '';
}

var credits = document.getElementById('credits');
credits.addEventListener('change', () => {
	credits.value = Math.clamp(Math.round(credits.value / 50) * 50, 0, 9000);
});

const priceList = {
	CLASSIC : 0,
	SHORTY  : 150,
	FRENZY  : 450,
	GHOST   : 500,
	SHERIFF : 800,
	
	STINGER : 950,
	SPECTRE : 1600,
	
	BUCKY   : 850,
	JUDGE   : 1850,
	
	BULLDOG : 2050,
	GUARDIAN: 2250,
	PHANTOM : 2900,
	VANDAL  : 2900,
	
	MARSHAL : 950,
	OPERATOR: 4700,
	
	ARES    : 1600,
	ODIN    : 3200
}
const gunList = {
	SIDEARMS       : ['CLASSIC', 'SHORTY', 'FRENZY', 'GHOST', 'SHERIFF'],
	SMGS           : ['STINGER', 'SPECTRE',],
	SHOTGUNS       : ['BUCKY', 'JUDGE'],
	RIFLES         : ['BULLDOG', 'GUARDIAN', 'PHANTOM', 'VANDAL'],
	'SNIPER RIFLES': ['MARSHAL', 'OPERATOR'],
	'MACHINE GUNS' : ['ARES', 'ODIN']
};

var elements = {};

var selectedGuns = Object.keys(priceList);

function select(e) {
	e.style.opacity = null;
}
function deselect(e) {
	e.style.opacity = "0.3";
}

// Category Loop
for (var element of document.querySelectorAll('.category h2')) {
	elements[element.innerText] = element;
	
	element.addEventListener('click', (e) => {
		var guns = gunList[e.target.innerText];
		if (intersect(selectedGuns, guns)) {
			selectedGuns = removeList(selectedGuns, guns);
			for (const name of guns) {
				deselect(elements[name]);
				//elements[name].style['background-color'] = '#FF000080';
				//elements[name].style['color'] = 'black';
			}
			deselect(e.target);
			//e.target.style.opacity = "0.4";
		}
		else {
			addList(selectedGuns, guns);
			for (const name of guns) {
				select(elements[name]);
				//elements[name].style['background-color'] = null;
				//elements[name].style['color'] = null;
			}
			select(e.target);
			//e.target.style.opacity = null;
		}
	});
	
}

// Gun Loop
for (var element of document.querySelectorAll('.category p')) {
	elements[element.innerText] = element;
	
	element.addEventListener('click', (e) => {
		var gun = e.target.innerText;
		
		if (!selectedGuns.includes(gun)) {
			selectedGuns.push(gun);
			select(e.target);
		}
		else {
			selectedGuns = remove(selectedGuns, gun);
			deselect(e.target);
		}
		
		var category = getCategory(gun);
		if (intersect(selectedGuns, gunList[category])) {
			select(elements[category]);
		}
		else {
			deselect(elements[category]);
		}
	});
}

var button = document.getElementById('randomize');
var clickoff = document.getElementById('clickoff');
var output = document.getElementById('output');

button.addEventListener('click', () => {
	var guns = selectedGuns.filter(e => parseInt(credits.value) >= priceList[e]);
	if (guns.length <= 0) {
		if (selectedGuns.length > 0) output.innerHTML = "<u>CAN'T AFFORD</u>";
		else output.innerHTML = "<u>NO GUNS</u>";
	}
	else {
		var gun = guns[Math.floor(Math.random() * guns.length)];
		output.innerText = gun;
		if (clickoff.checked) {
			selectedGuns = remove(selectedGuns, gun);
			deselect(elements[gun]);
			
			var category = getCategory(gun);
			if (!intersect(selectedGuns, gunList[category])) {
				deselect(elements[category]);
			}
		}
	}
	output.style.animation = 'none';
	output.offsetHeight;
	output.style.animation = null;
});

})();