document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");
  const domainBtn = document.getElementById("domainBtn");
  const wildcardBtn = document.getElementById("wildcardBtn");
  const specificBtn = document.getElementById("specificBtn");
  const extensionsBtn = document.getElementById("extensionsBtn");

  // Set current tab URL by default
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      urlInput.value = currentTab.url;
    }
  });

  function openWaybackURL(type) {
    const urlToInsert = urlInput.value.trim();
    if (!urlToInsert) return;

    let finalURL = "";

    try {
      const parsedURL = new URL(urlToInsert);
      const hostname = parsedURL.hostname;
      const fullURL = parsedURL.origin + parsedURL.pathname;

      if (type === "wildcard") {
        // *.domain.com/*
        finalURL = `https://web.archive.org/cdx/search/cdx?url=*.${hostname}/*&collapse=urlkey&output=text&fl=original`;
      } else if (type === "domain") {
        // domain.com/*
        finalURL = `https://web.archive.org/cdx/search/cdx?url=${hostname}/*&collapse=urlkey&output=text&fl=original`;
      } else if (type === "specific") {
        // full path
        finalURL = `https://web.archive.org/cdx/search/cdx?url=${fullURL}/*&collapse=urlkey&output=text&fl=original`;
      } else if (type === "extensions") {
        // Files with specific extensions
        finalURL = `https://web.archive.org/cdx/search/cdx?url=*.${hostname}/*&collapse=urlkey&output=text&fl=original&filter=original:.*\.(xls|xml|xlsx|json|pdf|sql|doc|docx|pptx|txt|zip|tar\.gz|tgz|bak|7z|rar|log|cache|secret|db|backup|yml|gz|git|config|csv|yaml|md|md5|exe|dll|bin|ini|bat|sh|tar|deb|rpm|iso|img|apk|msi|env|dmg|tmp|crt|pem|key|pub|asc)$`;
      }
    } catch {
      alert("Invalid URL format. Please enter a valid URL.");
      return;
    }

    chrome.tabs.create({ url: finalURL });
  }

  domainBtn.addEventListener("click", () => openWaybackURL("domain"));
  wildcardBtn.addEventListener("click", () => openWaybackURL("wildcard"));
  specificBtn.addEventListener("click", () => openWaybackURL("specific"));
  extensionsBtn.addEventListener("click", () => openWaybackURL("extensions"));
});