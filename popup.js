var swords = ["woo!", "huzzaah", "CONGRATULATIONS", ":)", "great success!", "\"That was easy.\""];
a = document.getElementById('DownloadLink');
var toclick = function() {
	console.log("the click happended");
	chrome.extension.sendMessage({url: a.href, file: a.download}, function(response) {
		a.style.color = "black"
		a.onclick = function() {return false;};
		a.innerText = swords[Math.floor((Math.random()*swords.length-1)+1)];
		setTimeout(function(){
			a.style.color="white";
			a.innerText = words[Math.floor((Math.random()*words.length-1)+1)];
			a.onclick = toclick;
		},5000);
	});
	return false;
};

a.onclick = toclick;

function aclick() {
	console.log(this)
}
function parseTrackData(trackData) {
	return trackData.split('\n');
}

function parseSong(psong) {
	return psong;
}

function parseArtist(partist) {
	return partist.replace('by ', '');
}

function genFileName(psong, partist) {
	var ext = '.mp3';
	var title = partist+'-'+psong+ext; 
	return title;
}

var words = ["steal this", "do illegal things", "download", "pirate", "\"file sharing\"", "transfer", "rip", "bootleg", "be cheap", "poach", "petty theft", "hijack", "swindle", "loot"];

function updateHTML(trackData, url) {
	var song   = parseSong(trackData.title);
	var artist = parseArtist(trackData.artist);

	var filename = genFileName(song, artist);

	var songTitle = document.getElementsByClassName('songTitle');
	songTitle[0].innerHTML = song;

	var artistSummary = document.getElementsByClassName('artistSummary');
	artistSummary[0].innerHTML = artist;
	document.getElementById("album_art").src = trackData.art;
	var a = document.getElementById('DownloadLink');
	a.innerText = words[Math.floor((Math.random()*words.length-1)+1)];
	a.href = url;
	a.download = filename;
}
     

chrome.extension.sendMessage({fromPopup: "hello"}, function(response) {
	updateHTML(response.trackData, response.url);
});

chrome.extension.onRequest.addListener (
	function(request, sender, sendResponse) {
		if (request.trackData && request.url) {		
			updateHTML(request.trackData, request.url);
		}
	}
);