(() => {

const aSection = document.getElementById("A-section");
const bSection = document.getElementById("B-section");
const cSection = document.getElementById("C-section");

const bigimg = document.getElementById("bigimg");

document.getElementsByName('site').forEach(e => e.addEventListener('change', (e) => {
	if (e.target.id === "A-site") {
		bSection.classList.add("hidden");
		cSection.classList.add("hidden");
		aSection.classList.remove("hidden");
	}
	if (e.target.id === "B-site") {
		aSection.classList.add("hidden");
		cSection.classList.add("hidden");
		bSection.classList.remove("hidden");
	}
	if (e.target.id === "C-site") {
		aSection.classList.add("hidden");
		bSection.classList.add("hidden");
		cSection.classList.remove("hidden");
	}
}));

for (var el of document.getElementsByTagName('img')) {
	el.addEventListener('click', (ev) => {
		bigimg.style.zIndex = 1;
		bigimg.src = ev.target.src;
		bigimg.classList.remove("hidden");
	});
}

bigimg.addEventListener('click', e => {
	bigimg.classList.add("hidden");
	bigimg.style.zIndex = -1;
});

})();