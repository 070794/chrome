var nItems = 20; // Items in a page
var pageNo = 0;

function getClosed()
{		
  var returnString = "<html><body>";
  var j = 0;

  // Drop the first (pageNo*nItems) valid items
  for(i = localStorage["closeCount"] - 1; i>=0 && j<pageNo*nItems; i--)
  {
    tabId = localStorage["ClosedTab-"+i];
    tabUrl = localStorage["TabList-"+tabId];
    if (tabUrl) j++;
  }

  for(j = 0; i>=0 && j<nItems; i --)
  {
    tabId = localStorage["ClosedTab-"+i];
    tabUrl = localStorage["TabList-"+tabId];
    if (tabUrl) {
      var stringForThisUrl = "";

      // For security concerns, only shows favicon for http pages.
      if (/^http:/.test(tabUrl))
        // Another favicon service is http://www.google.com/s2/favicons?domain=
        stringForThisUrl = "<img src=\"" + "http://getfavicon.appspot.com/" + tabUrl + "\" width=16 height=16 /> ";

      stringForThisUrl += "<a href = \"javascript:showUrl("+ tabId + ")\"" + "title = \""+ tabUrl + "\" />" + localStorage["TabTitle-"+tabId] + "</a><hr>";
      returnString += stringForThisUrl;
      j++;
    }
  }
  
  returnString += "</body></HTML>"	

  return returnString;
}

function next() {
  if (localStorage["actualCount"] > (pageNo+1) * nItems)
    pageNo++;
  loadContent();
}

function prev() {
  if (pageNo > 0)
    pageNo--;
  loadContent();
}

// Show |url| in a new tab.
function showUrl(tabId) {
  var url = localStorage["TabList-"+tabId];
  var index = parseInt(localStorage["TabIndex-"+tabId]);
  chrome.tabs.create({"url": url, "index": index});
  clear(tabId);
  localStorage["actualCount"] --;
  setBadgeText();
  loadContent();
}

function reset()
{
  for(i = localStorage["closeCount"]-1; i >= 0; i --)
  {
    tabId = localStorage["ClosedTab-"+i];
    delete localStorage["ClosedTab-"+i];
    clear(tabId);
  }
  /*
  Deep clean:
  for (x in localStorage)
    delete localStorage[x];
  */
  init();
  pageNo = 0;
  window.close();
}
