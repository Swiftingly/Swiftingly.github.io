for (var element of document.querySelectorAll('.site-container img')) {
	var div = document.createElement('div');
	div.classList.add('rgb-container');
	
	var div_r = document.createElement('div');
	div_r.classList.add('r');
	div_r.appendChild(element.cloneNode(false));
	
	var div_gb = document.createElement('div');
	div_gb.classList.add('gb');
	div_gb.appendChild(element.cloneNode(false));
	
	div.appendChild(div_r);
	div.appendChild(div_gb);
	
	element.after(div);
	element.remove();
}