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

/*const allStrats = [
	'SUICIDE:Kill yourself',
	'FORFEIT:End it',
	'GULP:Stop breathing',
	'CULT MOMENT:All alive players kill themselves',
	'PEER PRESSURE:All dead players pressure the alive players to kill themselves'
];*/
/*const defendStrats = [
	'Ratty Angle:Hold ratty angles with shotguns',
	'Hide and seek:Stop moving when the round starts, you can move when you get a kill',
	'Bomb Squad:You cannot shoot your gun until the enemy team has planted'
];
const attackStrats = [
	'Team roulette:Send one player at a time to attack. When they die someone new takes their place',
	'Rush B:',
	'Bomber:One person is the bomber, and they cannot shoot until they plant the spike, no one else is allowed to plant the spike. '
];
const bothStrats = [
	'Quiet as an elephant:You can\'t slow walk',
	'Radio Silence:No one is allowed to communicate on the team. (this includes pings)',
	'Reloadn’t:No reloading',
	'Is that a Classic?:Only classic',
	'Big J-Walk:No walking forward',
	'Spray and Pray:When you see someone you have to spray your entire magazine'
];*/
const defendStrats = [
	'Bomb Squad:Your team waits at spawn until the enemy team plants the spike. You are then allowed to leave spawn and play normally',
	'Coach:The bottom frag on your team must hide at spawn and give callouts, no one else is allowed to talk',
	'I call shotgun:Everyone must buy either Judge, Bucky, or Shorty if they can afford it in that order, and hold close angles on a site',
	'Gambling:Your entire team must stay at 1 site and hope they picked the right one. After contact or spike planted they are allowed to leave'
];
const attackStrats = [
	'Fakeout:Everyone rushes site using all their abilities, then retreat and plant at a different site',
	'Protect the president:The bottom frag is the President, and they are the only one allowed to plant the spike and they cannot use guns. '+
	'The team must surround the President and protect them for the entire around',
	'Odin Rush:Everyone must buy either Odin, Ares, or Frenzy if they can afford it, in that order'
];
const bothStrats = [
	'Motivational speech:One player on your team must give a speech at the beginning of the round. No one can leave spawn until they finish',
	'Knives Out: You can only move when you are holding your knife',
	'Evasive Maneuvers:You must jump every time you peak a corner',
	'Focused:No one is allowed to communicate on the team (this includes pings)',
	'Spray and Pray:When you see someone you have to unload your entire magazine',
	'Follow the leader:The top frag is the leader, everyone must follow them in a single file line. '+
	'When they die, the next person becomes leader',
	'Wild Wild West:Everyone buys sheriffs and speaks in a western accent',
	'I am Confusion:Use callouts that aren\'t in the game, being as confusing as possible',
	'Swap Meet:Every time you get a kill, you must take their gun and use it for the next kill',
	'How low can you go:Play the entire game crouched',
	'O/KAY:No one on your team is allowed to use abilities',
	'Casters:Every dead player must narrate the alive players actions like a caster. Alive players can\'t talk',
	'Peace Keeper:You can\'t shoot first'
];

var side = '';

var strats = [];

const outputTitle = document.getElementById('output-title');
const output = document.getElementById('output');

function reanimate(e) {
	e.style.animation = 'none';
	e.offsetHeight;
	e.style.animation = null;
}

function roll() {
	reanimate(output);
	
	if (strats.length <= 0) {
		if (side == 'attack')
			strats = shuffle(bothStrats.concat(attackStrats));
		else if (side == 'defend')
			strats = shuffle(bothStrats.concat(defendStrats));
		else return;
	}
	const strat = strats.pop().split(':');
	outputTitle.innerText = strat[0];
	output.innerText = strat[1];
}

document.getElementById('random').addEventListener('click', (e) => {
	
	roll();
});

document.getElementsByName('side').forEach(e => e.addEventListener('change', (e) => {
	side = e.target.id;
	strats = [];
	console.log('change');
}));

//outputTitle.addEventListener('click', roll);
//output.addEventListener('click', roll);

})();