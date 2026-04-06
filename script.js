const serverIP = "play.mcnpnetwork.com";

// Fetch player count
fetch(`https://api.mcsrvstat.us/2/${serverIP}`)
  .then(response => response.json())
  .then(data => {
    const el = document.getElementById("players");
    if (el) {
      el.innerText = data.online ? `${data.players.online} / ${data.players.max} Players Online` : "Server Offline";
    }
  })
  .catch(() => {
    const el = document.getElementById("players");
    if (el) el.innerText = "Mineleaf Network";
  });

// Copy Function
function copyIP(ip, element) {
    navigator.clipboard.writeText(ip);
    const originalText = element.innerText;
    element.innerText = "COPIED!";
    setTimeout(() => { element.innerText = originalText; }, 2000);
}

// Loading Screen
window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    if (loader) setTimeout(() => loader.classList.add("loader-hidden"), 1000);
});

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDTXWQgxYxeeAkzP2LJyg_rGs3sYN40dGo",
  authDomain: "mineleafxyz.firebaseapp.com",
  databaseURL: "https://mineleafxyz-default-rtdb.firebaseio.com",
  projectId: "mineleafxyz",
  storageBucket: "mineleafxyz.appspot.com",
  messagingSenderId: "478826882242",
  appId: "1:478826882242:web:f127e7436bfe08355a875b"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ================= REVIEW SYSTEM =================
const reviewForm = document.getElementById("reviewForm");
const container = document.getElementById("reviewsContainer");
const SECRET_CODE = "mineleaf-on-top";

// 1. Listen for new reviews from Firebase (Shared Storage)
database.ref("reviews").on("value", (snapshot) => {
    container.innerHTML = ""; // Clear current list
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const id = childSnapshot.key;
        renderReview(id, data);
    });
});

// 2. Function to create the Review Card UI
function renderReview(id, data) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.position = "relative";

    card.innerHTML = `
        <div style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 20px;" onclick="toggleMenu('${id}')">⋮</div>
        <div id="menu-${id}" style="display: none; position: absolute; top: 35px; right: 10px; background: #1a1a1a; border: 1px solid var(--primary); border-radius: 5px; z-index: 10;">
            <button onclick="promptDelete('${id}')" style="background: none; border: none; color: #ff4d4d; padding: 8px 15px; cursor: pointer; font-weight: bold;">Delete Post</button>
        </div>
        <h3 style="color:var(--primary)">${"★".repeat(data.rating)}</h3>
        <p style="margin: 15px 0;">"${data.message}"</p>
        <small style="opacity: 0.6;">- ${data.name} (${data.date})</small>
    `;
    container.prepend(card); // Newest reviews at the top
}

// 3. Handle Form Submission
reviewForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newReview = {
        name: document.getElementById("reviewName").value,
        rating: document.getElementById("reviewRating").value,
        message: document.getElementById("reviewMessage").value,
        date: new Date().toLocaleDateString()
    };

    // Push to Firebase (This saves it for EVERYONE to see)
    database.ref("reviews").push(newReview)
        .then(() => {
            reviewForm.reset();
        })
        .catch((error) => alert("Error: " + error.message));
});

// 4. Admin Menu Logic
window.toggleMenu = function(id) {
    const menu = document.getElementById(`menu-${id}`);
    menu.style.display = menu.style.display === "none" ? "block" : "none";
};

// 5. Delete Logic with Secret Code
window.promptDelete = function(id) {
    const userInput = prompt("Enter Admin Code to delete:");
    if (userInput === SECRET_CODE) {
        database.ref("reviews/" + id).remove()
            .then(() => console.log("Deleted"))
            .catch((err) => alert("Delete failed: " + err.message));
    } else if (userInput !== null) {
        alert("Incorrect Code!");
    }
};

// Close menus when clicking elsewhere
window.onclick = function(event) {
    if (!event.target.matches('div')) {
        const menus = document.querySelectorAll('[id^="menu-"]');
        menus.forEach(m => m.style.display = "none");
    }
};

function buyNow() {
    const btn = event.target;
    btn.innerText = "Redirecting...";
    btn.style.opacity = "0.7";

    setTimeout(() => {
        window.open("https://discord.gg/mcnp", "_blank");
    }, 800);
}
