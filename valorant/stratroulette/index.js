'use strict';

(() => {

const strats = [
	'Kill yourself',
	'End it',
	'Stop living'
];

const output = document.getElementById('output');

output.addEventListener('click', () => {
	output.style.animation = 'none';
	output.offsetHeight;
	output.style.animation = null;
	
	output.innerText = strats[Math.floor(Math.random() * strats.length)];
});

})();