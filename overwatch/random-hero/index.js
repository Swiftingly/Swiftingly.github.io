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

var portraitMap = new Map();
var heroTypeMap = new Map();
var heroIncludeMap = new Map();

function ListRemove(list, item) {
	let index = list.indexOf(item);
	if (index != -1) list.splice(index, 1);
}

function GetPortraitSrc(name) {
	return `/overwatch/assets/hero-portraits/${heroTypeMap.get(name)}/${name.replace(/[\.\:]/g, '_')}.webp`;
}

function ToggleInclusion(name) {
	let index = included_all.indexOf(name);
	let portrait = portraitMap.get(name);
	let included_list = heroIncludeMap.get(name);
	
	if (index == -1) {
		included_all.push(name);
		included_list.push(name);
		portrait.classList.remove("hero-container-off");
	}
	else {
		included_all.splice(index, 1);
		included_list.splice(included_list.indexOf(name), 1);
		portrait.classList.add("hero-container-off");
	}
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
	
	div.appendChild(img);
	div.appendChild(h3);
	
	portraitMap.set(name, div);
	div.addEventListener('click', ToggleInclusion.bind(this, name));
	
	return div;
}

function CategoryFill(category, name_list, type, included_list) {
	var list = category.querySelector('.hero-list');
	
	for (var name of name_list) {
		list.appendChild(CreatePortrait(name, type, included_list));
	}
}

CategoryFill(tankCategory, TANK_LIST, 'tank', included_tank);
CategoryFill(damageCategory, DAMAGE_LIST, 'damage', included_damage);
CategoryFill(supportCategory, SUPPORT_LIST, 'support', included_support);

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
function NameKeep() {
	revealZone.classList.add('hidden');
	imgElement.src = "";
	nameElement.innerText = "";
}
function NameRemove() {
	var name = nameElement.innerText;
	
	var portrait = portraitMap.get(name);
	portrait.classList.add("hero-container-off");
	
	ListRemove(heroIncludeMap.get(name), name);
	ListRemove(included_all, name);
	
	
	revealZone.classList.add('hidden');
	imgElement.src = "";
	nameElement.innerText = "";
}

document.getElementById("random-tank").addEventListener("click", RandomClick.bind(this, included_tank));
document.getElementById("random-damage").addEventListener("click", RandomClick.bind(this, included_damage));
document.getElementById("random-support").addEventListener("click", RandomClick.bind(this, included_support));
document.getElementById("random-all-roles").addEventListener("click", RandomClick.bind(this, included_all));

document.getElementById("keep").addEventListener("click", NameKeep);
document.getElementById("remove").addEventListener("click", NameRemove);