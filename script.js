const serverIP = "play.mcnpnetwork.com";

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
window.addEventListener("load", function() {
    const loader = document.getElementById("loading-screen");
    // Small timeout to ensure the transition is smooth
    setTimeout(() => {
        loader.classList.add("loader-hidden");
    }, 1000); 
});
// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDTXWQgxYxeeAkzP2LJyg_rGs3sYN40dGo",
  authDomain: "mineleafxyz.firebaseapp.com",
  projectId: "mineleafxyz",
  storageBucket: "mineleafxyz.firebasestorage.app",
  messagingSenderId: "478826882242",
  appId: "1:478826882242:web:f127e7436bfe08355a875b",
  measurementId: "G-97RZR5D1W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

const adminEmail = "gamersaphal8@gmail.com";
let currentUser = null;

// --- LOGIN SYSTEM ---
const loginBtn = document.getElementById('loginBtn');
loginBtn?.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
});

auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        loginBtn.innerText = "Logout";
        if (user.email === adminEmail) {
            document.getElementById('adminStatus').innerText = "Logged in as Admin (gamersaphal8)";
        }
    } else {
        loginBtn.innerText = "Login";
    }
    loadReviews();
});

// --- REVIEW SYSTEM ---
const reviewForm = document.getElementById("reviewForm");

reviewForm?.addEventListener("submit", e => {
    e.preventDefault();
    const newReview = {
        name: document.getElementById("reviewName").value,
        rating: document.getElementById("reviewRating").value,
        message: document.getElementById("reviewMessage").value,
        date: new Date().toLocaleDateString(),
        email: currentUser ? currentUser.email : "anonymous"
    };
    database.ref('reviews').push(newReview);
    reviewForm.reset();
});

function loadReviews() {
    database.ref('reviews').on('value', (snapshot) => {
        const container = document.getElementById("reviewsContainer");
        container.innerHTML = "";
        snapshot.forEach((child) => {
            const r = child.val();
            const card = document.createElement("div");
            card.className = "card";
            
            // Show Delete button only if user is the Admin
            const deleteBtn = (currentUser && currentUser.email === adminEmail) 
                ? `<button onclick="deleteReview('${child.key}')" style="background:red; color:white; border:none; border-radius:4px; cursor:pointer; margin-top:10px; padding:5px 10px;">Delete Post</button>` 
                : "";

            card.innerHTML = `
                <h3 style="color:var(--primary)">${"★".repeat(r.rating)}</h3>
                <p>"${r.message}"</p>
                <small>- ${r.name} (${r.date})</small>
                ${deleteBtn}
            `;
            container.appendChild(card);
        });
    });
}

function deleteReview(id) {
    if(confirm("Delete this review?")) {
        database.ref('reviews/' + id).remove();
    }
        }
