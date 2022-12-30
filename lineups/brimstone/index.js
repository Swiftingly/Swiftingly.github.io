(() => {

const aSite = document.querySelector('#A-site + label');
const bSite = document.querySelector('#B-site + label');
const cSite = document.querySelector('#C-site + label');

const aSection = document.getElementById('A-section');
const bSection = document.getElementById('B-section');
const cSection = document.getElementById('C-section');

const bigimg = document.getElementById("bigimg");

const MAPS = {
	Ascent: [
		[['Default','Attack','Heaven','Hell','Stairs'], ['Generator','Attack','Close','Stairs'], ['Box','Attack','Heaven','Hell','Stairs','Wine']],
		[['Default','Attack','Boat1','Boat2','Left','Mid','Right','Spawn']]
	],
	Bind: [
		[['Default','Attack','Showers','Lamps','Heaven'],['Box','Attack','Showers','Lamps']],
		[['Left','Garden','Hookah1','Hookah2'],['Edge','Garden'],['Right','Mid','Hookah']]
	],
	Breeze: [
		[['1','Attack'],['2','Attack'],['3','Attack','Close','Mid1','Mid2'],['4','Attack','Mid'],['5','Attack'],['6','Attack']],
		[['Default','Attack','Mid','CT','Back','Window'],['Side','Window','Spawn']]
	],
	Fracture: [
		[['Default','Attack','Drop','Top1','Top2'],['Under','Attack','Drop'],['Front','Top'],['Hidden','Top']],
		[['Default','Attack','Generator','Mid','Ramp','Tower'],['Open','Attack','Generator','Tower'],['Corner','Mid']]
	],
	Haven: [
		[['1','Long','CT','Heaven','Sewer'], ['2','Long','CT','Heaven'], ['3','CT','Long','Heaven'],['Close','Sewer','Ramps','CT']],
		[['Left','Back'],['Mid','Back','Cubby'],['Right','Back','Cubby'],['Close','Site']],
		[['Default','Attack','Cubby','Close'],['Open','Attack','Cubby'],['Long','Site'],['Cubby','Lift']]
	],
	Icebox: [
		[['Default','Nest','Close','CT','Rafters','Rafters2'],['Open','Nest','Close','CT','Rafters'],['Top','Nest','Rafters']],
		[['Default','Attack','Cubby1','Cubby2','Site'],['Side','Attack'],['Top','Mid'],['Corner','Close']]
	],
	Pearl: [
		[['Default','Attack','Dugout','Mid'],['Corner','Attack','Dugout','Mid']],
		[['Default','Attack','CT','Close','Heaven','Mid'],['Open','Attack','CT','Long','Heaven']]
	]
}

// Select a map
document.getElementById('map-select').addEventListener('change', (e) => {
	var back = null;
	switch (e.target.value) {
		case 'Ascent':   back = 'linear-gradient(#cb4b16, #66240B) fixed'; break;
		case 'Bind':     back = 'linear-gradient(#b58900, #594200) fixed'; break;
		case 'Breeze':   back = 'linear-gradient(#2aa198, #16514C) fixed'; break;
		case 'Fracture': back = 'linear-gradient(0.25turn, #859900, #b58900) fixed'; break;
		case 'Haven':    back = 'linear-gradient(#859900, #434C00) fixed'; break;
		case 'Icebox':   back = 'linear-gradient(#268bd2, #134668) fixed'; break;
		case 'Pearl':    back = 'linear-gradient(#6c71c4, #363960) fixed'; break;
	}
	document.body.style.background = back;
	document.body.parentElement.style.background = back;
	
	for (var el of document.querySelectorAll('.flex, hr')) el.remove();
	
	aSite.classList.add('hidden');
	bSite.classList.add('hidden');
	cSite.classList.add('hidden');
	
	if (e.target.value == '') return;
	
	
	const map = MAPS[e.target.value];
	if (!map) return;
	
	aSite.classList.remove('hidden');
	bSite.classList.remove('hidden');
	if (e.target.value === 'Haven') cSite.classList.remove('hidden');
	else cSite.classList.add('hidden');
	
	for (var site = 0; site < map.length; site++) {
		var letter = ['A','B','C'][site];
		var spikes = map[site];
		for (var i = 0; i < spikes.length; i++) {
			var flex = document.createElement('div');
			flex.classList.add('flex');
			
			var spike = spikes[i];
			var first = spike[0];
			for (var j = 1; j < spike.length; j++) {
				var div = document.createElement('div');
				div.innerHTML = '<p>' + first + ' from ' + spike[j] + '</p>';
				var img = new Image();
				img.src = e.target.value + '/' + letter + first + '_' + spike[j] + '.png';
				img.addEventListener('click', enlarge);
				div.append(img);
				flex.append(div);
			}
			
			var section;
			if (site == 0) section = aSection;
			if (site == 1) section = bSection;
			if (site == 2) section = cSection;
			
			section.append(flex);
			section.append(document.createElement('hr'));
		}
	}
	
	bSection.classList.add('hidden');
	cSection.classList.add('hidden');
	aSection.classList.add('hidden');
	
	document.getElementsByName('site').forEach(e => e.checked = false);
});

// Select a site
document.getElementsByName('site').forEach(e => e.addEventListener('change', (e) => {
	if (e.target.id === "A-site") {
		bSection.classList.add('hidden');
		cSection.classList.add('hidden');
		aSection.classList.remove('hidden');
	}
	if (e.target.id === "B-site") {
		aSection.classList.add('hidden');
		cSection.classList.add('hidden');
		bSection.classList.remove('hidden');
	}
	if (e.target.id === "C-site") {
		aSection.classList.add('hidden');
		bSection.classList.add('hidden');
		cSection.classList.remove('hidden');
	}
}));


function enlarge(ev) {
	bigimg.style.zIndex = 1;
	bigimg.src = ev.target.src;
	bigimg.classList.remove('hidden');
}

bigimg.addEventListener('click', e => {
	bigimg.classList.add('hidden');
	bigimg.style.zIndex = -1;
});

})();