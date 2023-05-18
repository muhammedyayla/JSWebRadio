let canvas, c, canvasgl, gl, radio, animation, w, h, w2, h2, txt, pos, ini, fin, iAnim, u, listAnimations, lastAnim, lastCtx, time, pause;

function init(){

	iAnim = 0;
	count = 0;

	radio = new Radio();

	canvas = document.createElement('canvas');
	canvas.width = w = innerWidth;
	canvas.height = h = innerHeight;
	
	canvasgl = canvas.cloneNode(false);
	canvasgl.style.display = 'none';
	
	c = canvas.getContext('2d');
	gl = canvasgl.getContext('webgl') || canvasgl.getContext("experimental-webgl");

	w2 = w>>1;
	h2 = h>>1;

	document.body.appendChild(canvas);
	document.body.appendChild(canvasgl);
	
	listAnimations = [
		{index: 0, anim: Animation01},
		{index: 1, anim: Animation02},
		{index: 2, anim: Animation03},
		{index: 3, anim: Animation05},
		{index: 4, anim: Animation06}
	];
	
	const iframe = window.frameElement;
	
	if(gl && !iframe){
		/* I got the permission from BigWIngs(shadertoy.com/user/BigWIngs) on 2019-03-14 as seen here https://www.shadertoy.com/view/MdfBRX */
		listAnimations.push( {index: 5, anim: Animation07 } );
	}
	
	createUI();
	addEvents();
	update();
}

function createUI() {
    pause = document.createElement('div');
    pause.id = 'pause';
    let select = document.createElement('select');
    select.id = 'playlist';
    let slug = getParameter();
    for (let i = 0; i < radio.playlist.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = radio.playlist[i].name;
        if (radio.playlist[i].slug === slug) {
            opt.selected = true;
            radio.player.src = radio.playlist[i].src;
        }
        select.appendChild(opt);
    }
    select.addEventListener('change', function () {
        radio.player.src = radio.playlist[this.value].src;
    });

    let btnPrev = document.createElement('button');
    btnPrev.id = 'btnPrev';
    btnPrev.innerText = 'Previous';
    btnPrev.addEventListener('click', () => { playPrevious() });
    btnPrev.style.marginRight = '10px'; // Add margin-right for spacing
    btnPrev.style.backgroundColor = 'lightgray'; // Set background color
    btnPrev.style.height = '30px'; // Set height
    btnPrev.style.width = '80px'; // Set width
    btnPrev.style.border = 'none'; // Remove border
    btnPrev.style.borderRadius = '4px'; // Add border radius
    btnPrev.style.cursor = 'pointer'; // Add cursor style

    let btnNext = document.createElement('button');
    btnNext.id = 'btnNext';
    btnNext.innerText = 'Next';
    btnNext.addEventListener('click', () => { playNext() });
    btnNext.style.marginRight = '10px'; // Add margin-right for spacing
    btnNext.style.backgroundColor = 'lightgray'; // Set background color
    btnNext.style.height = '30px'; // Set height
    btnNext.style.width = '80px'; // Set width
    btnNext.style.border = 'none'; // Remove border
    btnNext.style.borderRadius = '4px'; // Add border radius
    btnNext.style.cursor = 'pointer'; // Add cursor style

    let btnPlay = document.createElement('button');
    btnPlay.id = 'btnPlay';
    btnPlay.innerText = 'Play';
    btnPlay.addEventListener('click', (e) => { togglePlay(e) });
    btnPlay.style.backgroundColor = 'lightgray'; // Set background color
    btnPlay.style.height = '30px'; // Set height
    btnPlay.style.width = '80px'; // Set width
    btnPlay.style.border = 'none'; // Remove border
    btnPlay.style.borderRadius = '4px'; // Add border radius
    btnPlay.style.cursor = 'pointer'; // Add cursor style
	
	let volumeBar = document.createElement('input');
    volumeBar.type = 'range';
    volumeBar.id = 'volumeBar';
    volumeBar.min = '0';
    volumeBar.max = '1';
    volumeBar.step = '0.01';
    volumeBar.value = '1';
    volumeBar.addEventListener('input', (e) => { adjustVolume(e.target.value) });

    pause.appendChild(select);
    pause.appendChild(btnPrev);
    pause.appendChild(btnNext);
    pause.appendChild(btnPlay);
	pause.appendChild(volumeBar);
    document.body.appendChild(pause);
}

function adjustVolume(volume) {
    radio.player.volume = volume;
}

function playPrevious() {
    let currentIndex = parseInt(document.getElementById('playlist').value);
    let previousIndex = (currentIndex - 1 + radio.playlist.length) % radio.playlist.length;
    document.getElementById('playlist').value = previousIndex;
    radio.player.src = radio.playlist[previousIndex].src;
}

function playNext() {
    let currentIndex = parseInt(document.getElementById('playlist').value);
    let nextIndex = (currentIndex + 1) % radio.playlist.length;
    document.getElementById('playlist').value = nextIndex;
    radio.player.src = radio.playlist[nextIndex].src;
}


function selectAnimation(){
	time = (Math.random() * 7000) + 7000;
	let currentAnimation = listAnimations[Math.floor(Math.random()*listAnimations.length)];
	if( lastAnim !== currentAnimation.index){
		lastAnim = currentAnimation.index;
		let anim = new currentAnimation.anim();
		if( lastCtx !== anim.context ){
			changeCanvas( anim.context );
			lastCtx = anim.context;
		}
		animation = anim;
	}
}

function changeCanvas(ctx){
	switch(ctx){
		case 'pause' :
				pause.style.display = 'flex';
				canvas.style.display = 'none';
				canvasgl.style.display = 'none';
			break;
		case '2d' :
				pause.style.display = 'none';
				canvas.style.display = 'block';
				canvasgl.style.display = 'none';
			break;
		case 'webgl' :
				pause.style.display = 'none';
				canvasgl.style.display = 'block';
				canvas.style.display = 'none';
				c.clearRect(0,0,w,h);
			break;
	}
}

function showPaused(){
	changeCanvas('pause');
}

function update(t){

	if( radio.player.paused ){
		showPaused();
		return;
	}
		
	u = requestAnimationFrame(update);

	radio.analyser.getByteTimeDomainData(radio.data);


	animation.show(t);

	if(!ini)
		ini = Date.now();
	fin = Date.now();
	
	
	if( fin - ini > time ){
		iAnim = (iAnim + 1) % listAnimations.length;
		selectAnimation();
		ini = null;
	}	

}

function togglePlay(e){
	e.preventDefault();
	radio.togglePlay();
	if(!animation)
		selectAnimation();
	changeCanvas(animation.context);
	cancelAnimationFrame(u);
	update();
}

function addEvents(){

	canvas.addEventListener('click', (e)=>{ togglePlay(e) } );
		
	canvasgl.addEventListener('click', (e)=>{ togglePlay(e) } );
	
	window.addEventListener('resize', ()=>{
		canvas.width = w = innerWidth;
		canvas.height = h = innerHeight;
		w2 = w>>1;
		h2 = h>>1;
		cancelAnimationFrame(u);
		update();
	});

}

function getParameter() {
	let url = window.location.pathname;
	return url.replace(/\/radio\//,'').replace(/[\W_]+/g,'');
}

window.onload = ()=>{	init(); };
