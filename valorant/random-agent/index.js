const INITIATOR_LIST = [ "Sova", "Breach", "Skye", "KAY/O", "Fade", "Gekko", "Tejo" ].sort();
const DUELIST_LIST = [ "Phoenix", "Jett", "Reyna", "Raze", "Yoru", "Neon", "Iso", "Waylay" ].sort();
const SENTINEL_LIST = [ "Killjoy", "Cypher", "Sage", "Chamber", "Deadlock", "Vyse", "Veto" ].sort();
const CONTROLLER_LIST = [ "Brimstone", "Viper", "Omen", "Astra", "Harbor", "Clove", "Miks" ].sort();

var initiatorCategory = document.getElementById("initiator");
var duelistCategory = document.getElementById("duelist");
var sentinelCategory = document.getElementById("sentinel");
var controllerCategory = document.getElementById("controller");

var included_initiator = [...INITIATOR_LIST];
var included_duelist = [...DUELIST_LIST];
var included_sentinel = [...SENTINEL_LIST];
var included_controller = [...CONTROLLER_LIST];
var included_all = [...INITIATOR_LIST, ...DUELIST_LIST, ...SENTINEL_LIST, ...CONTROLLER_LIST];

var unincluded_all = [];

var portraitMap = new Map();     // NAME -> PORTRAIT
var agentTypeMap = new Map();    // NAME -> TYPE
var agentIncludeMap = new Map(); // NAME -> LIST
var toggleMap = new Map();       // TYPE -> TOGGLE

function ListRemove(list, item) {
	let index = list.indexOf(item);
	if (index != -1) list.splice(index, 1);
}

function GetPortraitSrc(name) {
	return `/valorant/assets/agent-portraits/${agentTypeMap.get(name)}/${name.replace(/[\.\:\/]/g, '_')}.webp`;
}

var saving = false;
function StartSave() {
	if (!saving) {
		saving = true;
		setTimeout(function() {
			saving = false;
			localStorage.setItem("valorant-random-agent-save", unincluded_all.join(','));
		}, 500);
	}
}

function ToggleInclusion(name, save = true) {
	let index = included_all.indexOf(name);
	let portrait = portraitMap.get(name);
	let included_list = agentIncludeMap.get(name);
	
	let type = agentTypeMap.get(name);
	var toggle = toggleMap.get(type);
	
	if (index == -1) {
		included_all.push(name);
		included_list.push(name);
		ListRemove(unincluded_all, name);
		portrait.classList.remove("agent-container-off");
	}
	else {
		included_all.splice(index, 1);
		included_list.splice(included_list.indexOf(name), 1);
		unincluded_all.push(name);
		portrait.classList.add("agent-container-off");
	}
	
	toggle.checked = included_list.length > 0;
	
	if (save) StartSave();
}

function CreatePortrait(name, type, included_list) {
	agentTypeMap.set(name, type);
	agentIncludeMap.set(name, included_list);
	
	var div = document.createElement('div');
	
	var img = document.createElement('img');
	img.src = GetPortraitSrc(name);
	
	var h3 = document.createElement('h3');
	h3.innerText = name;
	
	div.classList.add('agent-container');
	
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
	div.addEventListener('click', ToggleInclusion.bind(this, name));
	
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
	var list = category.querySelector('.agent-list');
	
	for (var name of name_list) {
		list.appendChild(CreatePortrait(name, type, included_list));
	}
	
	var element = document.getElementById(toggle_id);
	toggleMap.set(type, element);
	element.addEventListener('change', ToggleCategory.bind(element, included_list, name_list));
	element.addEventListener('mouseenter', ToggleHover.bind(element, name_list));
	element.addEventListener('mouseleave', ToggleUnhover.bind(element, name_list));
}

CategoryFill(initiatorCategory, INITIATOR_LIST, 'initiator', included_initiator, 'initiator-toggle');
CategoryFill(duelistCategory, DUELIST_LIST, 'duelist', included_duelist, 'duelist-toggle');
CategoryFill(sentinelCategory, SENTINEL_LIST, 'sentinel', included_sentinel, 'sentinel-toggle');
CategoryFill(controllerCategory, CONTROLLER_LIST, 'controller', included_controller, 'controller-toggle');

var save = localStorage.getItem("valorant-random-agent-save");
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
	nameElement.innerHTML = "";
}
function NameRemove() {
	var name = nameElement.innerHTML;
	
	ToggleInclusion(name);
	
	
	revealZone.classList.add('hidden');
	imgElement.src = "";
	nameElement.innerHTML = "";
}
document.getElementById("keep").addEventListener("click", NameKeep);
document.getElementById("remove").addEventListener("click", NameRemove);

var RANDOM_BUTTON_LIST = [
	["random-initiator", included_initiator],
	["random-duelist", included_duelist],
	["random-sentinel", included_sentinel],
	["random-controller", included_controller],
	["random-all-roles", included_all]
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