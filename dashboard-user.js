// INCIDENT DATA
let incidents = JSON.parse(localStorage.getItem("userIncidents")) || [];

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

  renderTable(incidents);
}
// TEACHER / GUIDANCE MESSAGES
const teacherMessages = [
  "Please make sure to report incidents as soon as possible.",
  "Remember: Respect everyone's privacy while reporting.",
  "Bullying cases are being monitored; stay safe and informed.",
  "Language and digital misuse issues are serious; follow school rules."
];

const teacherList = document.getElementById("teacherMessageList");

function renderTeacherMessages() {
  teacherList.innerHTML = "";
  teacherMessages.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg;
    teacherList.appendChild(li);
  });
}

// Call once at load
renderTeacherMessages();


// FORM SUBMISSION
const form = document.getElementById("incidentForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newIncident = {
    student: document.getElementById("studentName").value,
    grade: document.getElementById("gradeSection").value,
    type: document.getElementById("incidentType").value,
    description: document.getElementById("description").value,
    date: document.getElementById("incidentDate").value
  };
  incidents.push(newIncident);
  localStorage.setItem("userIncidents", JSON.stringify(incidents));
  form.reset();
  updateDashboard();
  alert("✅ Incident Report Submitted!");
});

// RENDER INCIDENT TABLE
function renderTable(data){
  const table = document.getElementById("incidentTable");
  table.innerHTML = "";
  data.forEach(i=>{
    table.innerHTML += `
      <tr>
        <td>${i.student}</td>
        <td>${i.grade}</td>
        <td>${i.type}</td>
        <td>${i.date}</td>
        <td>${i.description}</td>
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
const messages = [
  "Welcome! Stay alert and report incidents responsibly. ✨",
  "Tip: Be honest and detailed in your reports.",
  "Reminder: Respect privacy and report anonymously.",
  "Did you know? Reporting incidents helps create a safer environment."
];
let messageIndex = 0;
const messageElement = document.getElementById("dynamicMessage");
function rotateMessage() {
  messageIndex = (messageIndex + 1) % messages.length;
  messageElement.textContent = messages[messageIndex];
}
setInterval(rotateMessage, 6000);

// INITIAL LOAD
updateDashboard();
