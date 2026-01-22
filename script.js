const serverIP = "play.mineleaf.org";

// Fetch player count
fetch(`https://api.mcsrvstat.us/2/${serverIP}`)
  .then(response => response.json())
  .then(data => {
    const el = document.getElementById("players");
    if (data.online) {
      el.innerText = `${data.players.online} / ${data.players.max} Players Online`;
    } else {
      el.innerText = "Server Offline";
    }
  })
  .catch(() => {
    document.getElementById("players").innerText = "Mineleaf Network";
  });

// Copy Function
function copyIP(ip, element) {
    navigator.clipboard.writeText(ip);
    const originalText = element.innerText;
    element.innerText = "COPIED!";
    element.style.borderColor = "#ffffff";
    
    setTimeout(() => {
        element.innerText = originalText;
        element.style.borderColor = "";
    }, 2000);
}
