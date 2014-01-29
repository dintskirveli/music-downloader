
chrome.browserAction.disable();

function requestTrackData() {
	var musictabs = [];
	chrome.tabs.query({}, function(tabs){
		var url;
		for (i=0; i<tabs.length; i++) {
			url = tabs[i].url;
			if (url.indexOf("songza") != -1) {
				musictabs.push(tabs[i]);
			} else if (url.indexOf("pandora") != -1) {
				musictabs.push(tabs[i]);
			}
 		}
		if (musictabs.length == 1) {
			chrome.tabs.executeScript (
				musictabs[0].id, {file: "content_script.js"});
		} else if (musictabs.length == 0) {
			alert("No musical tabs");
		} else if (musictabs.length > 1) {
			alert("Multiple musical tabs, close some");
		}
	});
}

function isTdValid(pTrackData) {
	if (previous_track_data == pTrackData)
		return false;
	return true;
}

var previous_url = null;
var latest_url = null;
var previous_track_data = null;
var latest_track_data = null;

function download(url, filename) {
	chrome.downloads.download( {
		url: url,
	    saveAs: false,
	    filename: filename
	    },
	    function(res){});
}

function requestMatcher(details){
	var url = details.url;
	if (url.indexOf('musicnet') != -1 && url.indexOf('mp3') != -1 && details.type == "other") {
		return true;
	} else if (url.indexOf('access') != -1) {
		return true;
	} else {
		return false;
	}
}

chrome.webRequest.onBeforeRequest.addListener(function(details) { 
	var new_url = details.url;
	if (requestMatcher(details)) {
		console.log(details); 
		previous_url = latest_url;
		latest_url = new_url;
		if (previous_url != latest_url) {
			previous_track_data = latest_track_data;
			latest_track_data = null;
			chrome.browserAction.disable();
			requestTrackData();
		}
	} 
},{urls:["<all_urls>"]});

function sendToPopup(td, url) {
	var message = {trackData: td, url: url};
	chrome.extension.sendRequest(message);
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.trackData != null) {
			var td = request.trackData;
			sendResponse({farewell: latest_url});
			if (isTdValid(td) == true) {
				latest_track_data = td;
				chrome.browserAction.enable();
				sendToPopup(latest_track_data, latest_url);
			} else {
				setTimeout(requestTrackData,1000);
			}
		} else if (request.fromPopup != null){
			var resp = {url: latest_url, trackData: latest_track_data};
			sendResponse(resp);
		} else if (request.url != null) {
			download(request.url, request.file);
			sendResponse();
		}
});


chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	chrome.tabs.query({url:"http://*.songza.com/listen/*"}, function(tabs){
		if (tabs.length == 0) {
			chrome.browserAction.disable();
		}
	});
});