function clear(tabId) {
  delete localStorage["TabList-"+tabId];
  delete localStorage["TabIndex-"+tabId];
  delete localStorage["TabTitle-"+tabId];
}
  
function setBadgeText() {
  var n = localStorage["actualCount"];
  if (parseInt(n) > 0)
      chrome.browserAction.setBadgeText({text:n});
  else
    chrome.browserAction.setBadgeText({text:""});
}

function init()
{	
  localStorage["closeCount"] = 0;
  localStorage["actualCount"] = 0;
  setBadgeText();
}
