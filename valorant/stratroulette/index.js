'use strict';

(() => {

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
	
	return array;
}

const allStrats = [
	'SUICIDE:Kill yourself',
	'FORFEIT:End it',
	'GULP:Stop breathing',
	'CULT MOMENT:All alive players kill themselves',
	'PEER PRESSURE:All dead players pressure the alive players to kill themselves'
];

var strats = shuffle([...allStrats]);
//const currentStrats

const outputTitle = document.getElementById('output-title');
const output = document.getElementById('output');

function reanimate(e) {
	e.style.animation = 'none';
	e.offsetHeight;
	e.style.animation = null;
}

function roll() {
	reanimate(output);
	
	if (strats.length <= 0) strats = shuffle([...allStrats]);
	const strat = strats.pop().split(':');
	outputTitle.innerText = strat[0];
	output.innerText = strat[1];
}

outputTitle.addEventListener('click', roll);
output.addEventListener('click', roll);

})();