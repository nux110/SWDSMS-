// INCIDENT DATA
let incidents = JSON.parse(localStorage.getItem("incidents")) || [];

// USER DATA
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "Student User" };
document.getElementById("userName").textContent = currentUser.name;

// LOGOUT FUNCTIONALITY
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("You have been logged out successfully!");
  window.location.href = "../sign in/login.html";
});

// SIDEBAR NAVIGATION
const navLinks = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    
    const target = link.getAttribute("href").substring(1);
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// ANIMATED COUNTER
function animateValue(id, end) {
  let obj = document.getElementById(id);
  let start = 0;
  let duration = 800;
  let stepTime = Math.abs(Math.floor(duration / (end || 1)));
  let timer = setInterval(() => {
    start += 1;
    obj.textContent = start;
    if(start >= end) clearInterval(timer);
  }, stepTime);
}

// UPDATE DASHBOARD
function updateDashboard() {
  animateValue("totalIncidents", incidents.length);
  animateValue("bullyingCount", incidents.filter(i => i.type === "Bullying").length);
  animateValue("languageCount", incidents.filter(i => i.type === "Language").length);
  animateValue("digitalCount", incidents.filter(i => i.type === "Digital Misuse").length);

  // Update progress bars
  let total = incidents.length || 1;
  document.getElementById("bullyingBar").style.width = (incidents.filter(i => i.type==="Bullying").length/total*100)+"%";
  document.getElementById("languageBar").style.width = (incidents.filter(i => i.type==="Language").length/total*100)+"%";
  document.getElementById("digitalBar").style.width = (incidents.filter(i => i.type==="Digital Misuse").length/total*100)+"%";

  // Update analytics
  updateAnalytics();
  renderTable(incidents);
}

// ANALYTICS CALCULATIONS
function updateAnalytics() {
  const total = incidents.length || 1;
  const pending = incidents.filter(i => i.status === "Pending").length;
  const resolved = incidents.filter(i => i.status === "Resolved").length;
  const pendingRate = Math.round((pending / total) * 100);
  const resolutionRate = Math.round((resolved / total) * 100);
  
  // Get this month's reports
  const currentDate = new Date();
  const monthlyReports = incidents.filter(i => {
    const reportDate = new Date(i.date);
    return reportDate.getMonth() === currentDate.getMonth() && reportDate.getFullYear() === currentDate.getFullYear();
  }).length;
  
  // Determine safety status
  let safetyStatus = "Good";
  if (pendingRate > 50) safetyStatus = "Needs Attention";
  if (pendingRate > 70) safetyStatus = "Critical";
  
  document.getElementById("pendingRate").textContent = pendingRate + "%";
  document.getElementById("resolutionRate").textContent = resolutionRate + "%";
  document.getElementById("monthlyReports").textContent = monthlyReports;
  document.getElementById("safetyStatus").textContent = safetyStatus;
}
// MESSAGING SYSTEM
let messages = JSON.parse(localStorage.getItem("teacherMessages")) || [];

const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = {
    to: "Teacher",
    name: document.getElementById("studentNameMsg").value,
    text: document.getElementById("messageText").value,
    date: new Date().toLocaleString()
  };
  messages.push(newMessage);
  localStorage.setItem("teacherMessages", JSON.stringify(messages));
  messageForm.reset();
  alert("✅ Message sent to teacher!");
  renderTeacherMessages();
  renderUserMessages();
});

const teacherList = document.getElementById("teacherMessageList");

function renderTeacherMessages() {
  teacherList.innerHTML = "";
  messages.forEach(msg => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>📨 ${msg.name}:</strong> ${msg.text}<span class="message-time">${msg.date}</span>`;
    teacherList.appendChild(li);
  });
}

function renderUserMessages() {
  const userMessagesList = document.getElementById("userMessagesList");
  const userMessagesDisplay = document.getElementById("userMessagesDisplay");
  userMessagesList.innerHTML = "";
  
  if (messages.length === 0) {
    userMessagesDisplay.style.display = "none";
    return;
  }
  
  userMessagesDisplay.style.display = "block";
  messages.forEach(msg => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "user-message-item";
    messageDiv.innerHTML = `
      <strong>✓ You (${msg.name})</strong>
      <div class="message-text">${msg.text}</div>
      <div class="message-time">${msg.date}</div>
    `;
    userMessagesList.appendChild(messageDiv);
  });
}

// Call once at load
renderTeacherMessages();
renderUserMessages();


// FORM SUBMISSION
const form = document.getElementById("incidentForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newIncident = {
    student: document.getElementById("studentName").value,
    grade: document.getElementById("gradeSection").value,
    type: document.getElementById("incidentType").value,
    description: document.getElementById("description").value,
    date: document.getElementById("incidentDate").value,
    status: "Pending"
  };
  incidents.push(newIncident);
  localStorage.setItem("incidents", JSON.stringify(incidents));
  form.reset();
  updateDashboard();
  alert("✅ Incident Report Submitted!");
});

// RENDER INCIDENT TABLE
function renderTable(data){
  const table = document.getElementById("incidentTable");
  table.innerHTML = "";
  data.forEach((i, idx)=>{
    const statusClass = i.status === "Resolved" ? "solved" : "pending";
    const statusText = i.status === "Resolved" ? "✓ Solved" : "Pending";
    
    table.innerHTML += `
      <tr>
        <td>${i.student}</td>
        <td>${i.grade}</td>
        <td>${i.type}</td>
        <td>${i.date}</td>
        <td>${i.description}</td>
        <td>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
      </tr>
    `;
  });
}

// SEARCH FUNCTION
document.getElementById("searchInput").addEventListener("input", e=>{
  const value = e.target.value.toLowerCase();
  renderTable(incidents.filter(i => i.student.toLowerCase().includes(value)));
});

// DYNAMIC MESSAGES
const dynamicMessages = [
  "Welcome! Stay alert and report incidents responsibly. ✨",
  "Tip: Be honest and detailed in your reports.",
  "Reminder: Respect privacy and report anonymously.",
  "Did you know? Reporting incidents helps create a safer environment."
];
let messageIndex = 0;
const messageElement = document.getElementById("dynamicMessage");
function rotateMessage() {
  messageIndex = (messageIndex + 1) % dynamicMessages.length;
  messageElement.textContent = dynamicMessages[messageIndex];
}
setInterval(rotateMessage, 6000);

// INITIAL LOAD
updateDashboard();
