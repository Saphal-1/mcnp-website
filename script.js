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

// Initialize Firebase (ONLY ONCE)
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();

// ================= AUTH =================
const adminEmail = "gamersaphal8@gmail.com";
let currentUser = null;

const loginBtn = document.getElementById("loginBtn");

loginBtn?.addEventListener("click", () => {
  if (currentUser) {
    auth.signOut();
  } else {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
});

auth.onAuthStateChanged(user => {
  currentUser = user;

  if (loginBtn) {
    loginBtn.innerText = user ? "Logout" : "Login";
  }

  if (user && user.email === adminEmail) {
    const adminStatus = document.getElementById("adminStatus");
    if (adminStatus) {
      adminStatus.innerText = "Logged in as Admin (gamersaphal8)";
    }
  }

  loadReviews();
});

// ================= REVIEW SYSTEM =================
const reviewForm = document.getElementById("reviewForm");

reviewForm?.addEventListener("submit", e => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login to submit a review");
    return;
  }

  const newReview = {
    name: document.getElementById("reviewName").value,
    rating: Number(document.getElementById("reviewRating").value),
    message: document.getElementById("reviewMessage").value,
    date: new Date().toLocaleDateString(),
    email: currentUser.email
  };

  database.ref("reviews").push(newReview);
  reviewForm.reset();
});

// ================= LOAD REVIEWS =================
function loadReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  database.ref("reviews").off(); // prevent duplicate listeners
  database.ref("reviews").on("value", snapshot => {
    container.innerHTML = "";

    snapshot.forEach(child => {
      const r = child.val();
      const card = document.createElement("div");
      card.className = "card";

      const deleteBtn =
        currentUser && currentUser.email === adminEmail
          ? `<button onclick="deleteReview('${child.key}')"
              style="background:red;color:white;border:none;
              border-radius:4px;cursor:pointer;margin-top:10px;padding:5px 10px;">
              Delete Post
            </button>`
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

// ================= DELETE REVIEW =================
function deleteReview(id) {
  if (!currentUser || currentUser.email !== adminEmail) return;

  if (confirm("Delete this review?")) {
    database.ref("reviews/" + id).remove();
  }
}
