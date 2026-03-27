const TANK_LIST = [ "Mauga", "Orisa", "Roadhog", "Zarya", "D.Va", "Doomfist", "Hazard", "Winston", "Wrecking Ball", "Domina", "Junker Queen", "Ramattra", "Reinhardt", "Sigma" ].sort();
const DAMAGE_LIST = [ "Anran", "Genji", "Reaper", "Tracer", "Vendetta", "Venture", "Echo", "Freja", "Pharah", "Sombra", "Ashe", "Cassidy", "Hanzo", "Sojourn", "Widowmaker", "Bastion", "Emre", "Junkrat", "Mei", "Soldier: 76", "Symmetra", "Torbjörn" ].sort();
const SUPPORT_LIST = [ "Kiriko", "Lifeweaver", "Mercy", "Moira", "Brigitte", "Illari", "Juno", "Mizuki", "Wuyang", "Ana", "Baptiste", "Jetpack Cat", "Lúcio", "Zenyatta" ].sort();


var tankCategory = document.getElementById("tank");
var damageCategory = document.getElementById("damage");
var supportCategory = document.getElementById("support");

var included_tank = [...TANK_LIST];
var included_damage = [...DAMAGE_LIST];
var included_support = [...SUPPORT_LIST];
var included_all = [...TANK_LIST, ...DAMAGE_LIST, ...SUPPORT_LIST];

var unincluded_all = [];

var portraitMap = new Map();
var heroTypeMap = new Map();
var heroIncludeMap = new Map();
var toggleMap = new Map();

function ListRemove(list, item) {
	let index = list.indexOf(item);
	if (index != -1) list.splice(index, 1);
}

function GetPortraitSrc(name) {
	return `/overwatch/assets/hero-portraits/${heroTypeMap.get(name)}/${name.replace(/[\.\:]/g, '_')}.webp`;
}

var saving = false;
function StartSave() {
	if (!saving) {
		saving = true;
		setTimeout(function() {
			saving = false;
			localStorage.setItem("overwatch-random-hero-save", unincluded_all.join(','));
		}, 500);
	}
}

function ToggleInclusion(name, save = true) {
	let index = included_all.indexOf(name);
	let portrait = portraitMap.get(name);
	let included_list = heroIncludeMap.get(name);
	
	let type = heroTypeMap.get(name);
	var toggle = toggleMap.get(type);
	
	if (index == -1) {
		included_all.push(name);
		included_list.push(name);
		ListRemove(unincluded_all, name);
		portrait.classList.remove("hero-container-off");
	}
	else {
		included_all.splice(index, 1);
		included_list.splice(included_list.indexOf(name), 1);
		unincluded_all.push(name);
		portrait.classList.add("hero-container-off");
	}
	
	toggle.checked = included_list.length > 0;
	
	if (save) StartSave();
}

function CreatePortrait(name, type, included_list) {
	heroTypeMap.set(name, type);
	heroIncludeMap.set(name, included_list);
	
	var div = document.createElement('div');
	
	var img = document.createElement('img');
	img.src = GetPortraitSrc(name);
	
	var h3 = document.createElement('h3');
	h3.innerText = name;
	
	div.classList.add('hero-container');
	
	div.setAttribute('role', 'button');
	div.setAttribute('tabindex', '0');
	
	div.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.click();
		}
	});
	div.addEventListener("keyup", function(event) {
		if (event.key === " ") {
			event.preventDefault();
			this.click();
		}
	});
	
	div.appendChild(img);
	div.appendChild(h3);
	
	portraitMap.set(name, div);
	div.addEventListener('click', function() {
		div.classList.add("no-hover");
		ToggleInclusion(name);
	});
	div.addEventListener('mouseleave', function() {
		div.classList.remove("no-hover");
	});
	
	return div;
}

function ToggleCategory(included_list, full_list) {
	ToggleUnhover(full_list);
	if (this.checked) {
		for (var name of full_list) {
			if (!included_list.includes(name)) ToggleInclusion(name);
		}
	}
	else {
		for (var name of full_list) {
			if (included_list.includes(name)) ToggleInclusion(name);
		}
	}
}

function ToggleHover(name_list) {
	for (var name of name_list) {
		var portrait = portraitMap.get(name);
		portrait.classList.add(this.checked ? "hover-remove" : "hover-add");
	}
}
function ToggleUnhover(name_list) {
	for (var name of name_list) {
		var portrait = portraitMap.get(name);
		portrait.classList.remove("hover-add");
		portrait.classList.remove("hover-remove");
	}
}

function CategoryFill(category, name_list, type, included_list, toggle_id) {
	var list = category.querySelector('.hero-list');
	
	for (var name of name_list) {
		list.appendChild(CreatePortrait(name, type, included_list));
	}
	
	var element = document.getElementById(toggle_id);
	toggleMap.set(type, element);
	element.addEventListener('change', ToggleCategory.bind(element, included_list, name_list));
	element.addEventListener('mouseenter', ToggleHover.bind(element, name_list));
	element.addEventListener('mouseleave', ToggleUnhover.bind(element, name_list));
}

CategoryFill(tankCategory, TANK_LIST, 'tank', included_tank, 'tank-toggle');
CategoryFill(damageCategory, DAMAGE_LIST, 'damage', included_damage, 'damage-toggle');
CategoryFill(supportCategory, SUPPORT_LIST, 'support', included_support, 'support-toggle');

var save = localStorage.getItem("overwatch-random-hero-save");
if (save != null && save.length > 0) {
	for (name of save.split(',')) {
		ToggleInclusion(name, false);
	}
}

const revealZone = document.querySelector("#reveal-zone");

const imgElement = document.querySelector("#info img");
const nameElement = document.querySelector("#info h2");

function RandomClick(included_list) {
	if (included_list.length > 0) {
		var name = included_list[Math.floor(Math.random() * included_list.length)];
		
		nameElement.innerText = name;
		imgElement.src = GetPortraitSrc(name);
		
		revealZone.classList.remove('hidden');
	}
}
var last_interval = 0;
var last_name = "";
function RandomHoverStart(included_list) {
	if (included_list.length > 0) {
		last_interval = setInterval(function() {
			/*console.log(included_list[0]);*/
			if (last_name.length > 0) {
				var last_portrait = portraitMap.get(last_name);
				last_portrait.classList.remove("random-hover");
			}
			last_name = included_list[Math.floor(Math.random() * included_list.length)];
			var portrait = portraitMap.get(last_name);
			portrait.classList.add("random-hover");
			//console.log(portrait);
			
		}, 100);
	}
	else last_interval = 0;
}

function RandomHoverEnd(included_list) {
	clearInterval(last_interval);
	if (last_name.length > 0) {
		var last_portrait = portraitMap.get(last_name);
		last_portrait.classList.remove("random-hover");
	}
	last_interval = 0;
}

function NameKeep() {
	revealZone.classList.add('hidden');
	imgElement.src = "";
	nameElement.innerText = "";
}
function NameRemove() {
	var name = nameElement.innerText;
	
	ToggleInclusion(name);
	
	
	revealZone.classList.add('hidden');
	imgElement.src = "";
	nameElement.innerText = "";
}
document.getElementById("keep").addEventListener("click", NameKeep);
document.getElementById("remove").addEventListener("click", NameRemove);

var RANDOM_BUTTON_LIST = [
	["random-tank", included_tank],
	["random-damage", included_damage],
	["random-support", included_support],
	["random-all-roles", included_all],
];

for (let items of RANDOM_BUTTON_LIST) {
	var element = document.getElementById(items[0]);
	element.addEventListener("click", RandomClick.bind(element, items[1]));
	element.addEventListener("mouseenter", RandomHoverStart.bind(element, items[1]));
	element.addEventListener("mouseleave", RandomHoverEnd.bind(element, items[1]));
}

document.getElementById("add-all").addEventListener("click", function() {
	while (unincluded_all.length > 0) {
		ToggleInclusion(unincluded_all[unincluded_all.length - 1]);
	}
});
document.getElementById("remove-all").addEventListener("click", function() {
	while (included_all.length > 0) {
		ToggleInclusion(included_all[included_all.length - 1]);
	}
});

document.getElementById("add-all").addEventListener("mouseenter", function() {
	for (portrait of portraitMap.values()) {
		portrait.classList.add("hover-add");
	}
});
document.getElementById("add-all").addEventListener("mouseleave", function() {
	for (portrait of portraitMap.values()) {
		portrait.classList.remove("hover-add");
	}
});
document.getElementById("remove-all").addEventListener("mouseenter", function() {
	for (portrait of portraitMap.values()) {
		portrait.classList.add("hover-remove");
	}
});
document.getElementById("remove-all").addEventListener("mouseleave", function() {
	for (portrait of portraitMap.values()) {
		portrait.classList.remove("hover-remove");
	}
});