function isPandoraTrackDataValid(info) {
	return /[^\s]/.test(info[0]);
}

function getTrackData() {
	var site = document.location.origin;
	var artist, album, title, art, td;

	if (site.indexOf("songza") != -1) { 
		artist = document.getElementsByClassName('szi-artist')[0].innerText;
		title = document.getElementsByClassName('szi-title')[0].innerText;
		art = document.getElementsByClassName("szi-station-quilt-image")[0].children[0].src;
		td = {artist: artist, title: title, art: art};
		sendTrackData(td);
	} else if (site.indexOf("pandora") != -1) {
		var info = document.getElementsByClassName('info')[0].innerText.split('\n');
		if (isPandoraTrackDataValid(info)) {
			console.log("valid");
			title = info[0];
			artist = info[1].replace("by ", "");
			art = document.getElementsByClassName('playerBarArt')[0].src;	
			td = {artist: artist, title: title, art: art};
			console.log(td);
			sendTrackData(td);
		} else {
			console.log("ext: trying again");
			setTimeout(getTrackData,1000);
		}
	}
}

function sendTrackData(td) {
	chrome.extension.sendMessage({trackData: td}, function(response) {});
}

getTrackData();


