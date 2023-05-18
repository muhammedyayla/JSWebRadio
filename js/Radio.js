class Radio {
	constructor(){
		this.player = new Audio();
		this.playlist = [
			{name: 'Nightwave Plaza', slug: 'nightwave', src: 'https://radio.plaza.one/mp3'},
			{name: 'Classic Rock Florida HD', slug: 'classicrockflorida', src: 'https://vip2.fastcast4u.com/proxy/classicrockdoug?mp=/1'},
			{name: 'Radyo Arabesk', slug: 'radyoarabesk', src: 'https://yayin.radyoarabesk.com.tr:8000/stream'},
			{name: 'Gold FM', slug: 'gold', src: 'http://dijimedya.radyotvonline.net/goldfm'},
			{name: 'Radyo Kent', slug: 'kent', src: 'https://radyo1.radyo-dinle.tc:7060/;'},
			{name: 'Dost FM', slug: 'Dost', src: ' http://yayin.dostfm.com:8920/;'},
			{name: 'Doksanlar', slug: 'doksanlar', src: 'http://37.247.98.8/stream/166/'},
			{name: 'Zen Nostalji', slug: 'zennostalji', src: 'http://37.59.205.232:7794/;'},
			{name: 'Eksen', slug: 'eksen', src: 'http://eksenwmp.radyotvonline.com/;'},
			{name: 'Baba Radyo', slug: 'babaradyo', src: 'http://37.247.98.7/babaradyomp3'},
			{name: 'Best Fm', slug: 'bestfm', src: 'http://46.20.7.126/;stream.mp3'},
			{name: 'Pal Fm', slug: 'palfm', src: 'http://shoutcast.radyogrup.com:1030/;'}
		];
		this.player.src = this.playlist[0].src;
		this.player.preload = 'auto';
		this.player.crossOrigin = 'anonymous';
		this.canPlay = false;
	}
	
	init(){
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 1024;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.data = new Uint8Array(this.bufferLength);
		this.analyser.getByteTimeDomainData(this.data);
		this.source = this.audioContext.createMediaElementSource(this.player);
		this.source.connect(this.analyser);
		this.source.connect(this.audioContext.destination);
	}
	
	togglePlay(){
		if(!this.canPlay){
			this.init();
			this.canPlay = true;
		}
		if(this.player.paused){
			this.audioContext.resume();
			this.player.play();
		}else{
			this.player.pause();
		}
	}
	
	update(){
		this.bufferLength = this.analyser.frequencyBinCount;
		this.data = new Uint8Array(this.bufferLength);
		this.analyser.getByteTimeDomainData(this.data);
	}
}
