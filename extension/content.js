
/* global chrome */
let url;
let instanceUrl;
let accessToken;

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  url = new URL(tabs[0].url);
  var domain = url.hostname;
  console.log("domain 1:", domain);
  var subdomain = domain.split(".")[0];

  if (domain === "force.com") {
    instanceUrl = "https://" + subdomain + ".force.com";
  } else {
    instanceUrl = "https://" + subdomain + ".my.salesforce.com";
  }
  domain = subdomain + ".my.salesforce.com";
  console.log("instance URL:", instanceUrl);
  console.log("domain 2:", domain);

  chrome.cookies.getAll({ domain: domain }, function (cookies) {
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].name === "sid") {
        accessToken = cookies[i].value;
        var domainName = cookies[i].domain;
        if (domainName === domain) {
          document.getElementById("value").innerHTML = accessToken;
          console.log("access token:", accessToken);
          console.log("domain name:", domainName);
        }
      }
    }
  });
});

// Export the instanceUrl and accessToken variables for external use
export { instanceUrl, accessToken };
