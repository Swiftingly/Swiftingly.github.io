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

var portraitMap = new Map();
var agentTypeMap = new Map();
var agentIncludeMap = new Map();

function ListRemove(list, item) {
	let index = list.indexOf(item);
	if (index != -1) list.splice(index, 1);
}

function GetPortraitSrc(name) {
	return `/valorant/assets/agent-portraits/${agentTypeMap.get(name)}/${name.replace(/[\.\:\/]/g, '_')}.webp`;
}

function ToggleInclusion(name, save = true) {
	let index = included_all.indexOf(name);
	let portrait = portraitMap.get(name);
	let included_list = agentIncludeMap.get(name);
	
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
	
	if (save) {
		localStorage.setItem("save", unincluded_all.join(','));
	}
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

function CategoryFill(category, name_list, type, included_list) {
	var list = category.querySelector('.agent-list');
	
	for (var name of name_list) {
		list.appendChild(CreatePortrait(name, type, included_list));
	}
}

CategoryFill(initiatorCategory, INITIATOR_LIST, 'initiator', included_initiator);
CategoryFill(duelistCategory, DUELIST_LIST, 'duelist', included_duelist);
CategoryFill(sentinelCategory, SENTINEL_LIST, 'sentinel', included_sentinel);
CategoryFill(controllerCategory, CONTROLLER_LIST, 'controller', included_controller);

var save = localStorage.getItem("save");
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

document.getElementById("random-initiator").addEventListener("click", RandomClick.bind(this, included_initiator));
document.getElementById("random-duelist").addEventListener("click", RandomClick.bind(this, included_duelist));
document.getElementById("random-sentinel").addEventListener("click", RandomClick.bind(this, included_sentinel));
document.getElementById("random-controller").addEventListener("click", RandomClick.bind(this, included_controller));
document.getElementById("random-all-roles").addEventListener("click", RandomClick.bind(this, included_all));

document.getElementById("keep").addEventListener("click", NameKeep);
document.getElementById("remove").addEventListener("click", NameRemove);

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