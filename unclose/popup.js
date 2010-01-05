var nItems = 20; // Items in a page
var pageNo = 0;

function createLink(id, url) {
  var link = document.createElement('a');
  link.href = "javascript:showUrl("+ id + ")";
  link.title = url;
  return link;
}

function loadText()
{
  // Don't popup if there's nothing to show
  var n = localStorage["actualCount"];
  if (parseInt(n) == 0)
    window.close();
  
  content = document.getElementById("contentDiv");
  // Clear
  while (content.hasChildNodes())
    content.removeChild(content.firstChild);
  
  // Drop the first (pageNo*nItems) valid items
  for (j = 0, i = localStorage["closeCount"] - 1; i>=0 && j<pageNo*nItems; i--)
  {
    tabId = localStorage["ClosedTab-"+i];
    tabUrl = localStorage["TabList-"+tabId];
    if (tabUrl) j++;
  }

  for (j = 0; i>=0 && j<nItems; i --)
  {
    tabId = localStorage["ClosedTab-"+i];
    tabUrl = localStorage["TabList-"+tabId];
    if (tabUrl) {
      // Since we are only sending domain names, favicons are not restricted to http pages only.
      if (/^http/.test(tabUrl)) {
        var img = document.createElement('img');
        // Other favicon services are http://www.google.com/s2/favicons?domain=
        // img.src = "http://getfavicon.appspot.com/" + tabUrl;

        // On load, we don't try to pull the favicons.
        img.src = "";
        // Save the url in alt
        img.alt = "http://www.getfavicon.org/?url=" + tabUrl.split('/')[2]; // slower but more powerful. This service only accepts domain names.
        img.width = 16;
        img.height = 16;
        content.appendChild(img);
      }

      // Create a link node and the anchor encapsulating it.
      var text_link = createLink(tabId, tabUrl);
      text_link.appendChild(document.createTextNode(" " + localStorage["TabTitle-"+tabId]));
      content.appendChild(text_link);

      content.appendChild(document.createElement('hr'));
      j++;
    }
  }

  if (pageNo > 0)
    document.getElementById("prev").disabled = false;
  else document.getElementById("prev").disabled = true;
  if (localStorage["actualCount"] > (pageNo+1) * nItems)
    document.getElementById("next").disabled = false;
  else document.getElementById("next").disabled = true;
}

function loadFavicon() {
  // We only handle mousemove once
  document.removeEventListener("mousemove", loadFavicon, false);

  var imgs = document.getElementsByTagName("img");
  for (i in imgs)
    imgs[i].src = imgs[i].alt;
}

function loadContent() {
  loadText();
  loadFavicon();
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
  for(i = localStorage["closeCount"]-1; i >= 0; i--)
  {
    tabId = localStorage["ClosedTab-"+i];
    delete localStorage["ClosedTab-"+i];
    clear(tabId);
  }
  init();
  pageNo = 0;
  window.close();
}
