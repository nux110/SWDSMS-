let incidents = JSON.parse(localStorage.getItem("incidents")) || [];
let messages = JSON.parse(localStorage.getItem("teacherMessages")) || [];

// TEACHER DATA
const currentTeacher = JSON.parse(localStorage.getItem("currentTeacher")) || { name: "Teacher Name" };
document.getElementById("teacherName").textContent = currentTeacher.name;

// LOGOUT FUNCTIONALITY
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentTeacher");
  alert("You have been logged out successfully!");
  window.location.href = "../sign in/login.html";
});

/* SIDEBAR NAV – FIXED */
document.querySelectorAll(".sidebar button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".sidebar button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(sec=>sec.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

/* TOAST */
function toast(msg){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2500);
}

/* INCIDENTS */
function renderIncidents(){
  const table=document.getElementById("incidentTable");
  table.innerHTML="";
  incidents.forEach((i,index)=>{
    if(!i.status)i.status="Pending";
    table.innerHTML+=`
      <tr>
        <td>${i.student}</td>
        <td>${i.grade}</td>
        <td>${i.type}</td>
        <td>${i.date}</td>
        <td><span class="status ${i.status==="Pending"?"pending":"resolved"}">${i.status}</span></td>
        <td>
          ${i.status==="Pending"
            ? `<button onclick="resolve(${index})">Solve</button>`
            : "✔"}
        </td>
      </tr>`;
  });
  updateStats();
}

function resolve(i){
  incidents[i].status="Resolved";
  localStorage.setItem("incidents",JSON.stringify(incidents));
  renderIncidents();
  updateAnalytics();
  toast("Incident resolved ✅");
}

/* STATS */
function updateStats(){
  document.getElementById("total").textContent=incidents.length;
  document.getElementById("pending").textContent=incidents.filter(i=>i.status==="Pending").length;
  document.getElementById("resolved").textContent=incidents.filter(i=>i.status==="Resolved").length;
}

/* MESSAGES */
function handleSendMessage(event){
  event.preventDefault();
  const type=document.getElementById("recipientType").value;
  const name=document.getElementById("recipientName").value;
  const text=document.getElementById("messageText").value;
  if(!type || !name || !text) return;

  messages.push({
    to:type,
    name:name,
    text:text,
    date:new Date().toLocaleString()
  });

  localStorage.setItem("teacherMessages",JSON.stringify(messages));
  document.getElementById("messageText").value="";
  document.getElementById("recipientName").value="";
  document.getElementById("recipientType").value="";
  renderMessages();
  toast("Message sent 📩");
}

function sendMessage(){
  const type=document.getElementById("recipientType").value;
  const name=document.getElementById("recipientName").value;
  const text=document.getElementById("messageText").value;
  if(!type || !name || !text) return;

  messages.push({
    to:type,
    name:name,
    text:text,
    date:new Date().toLocaleString()
  });

  localStorage.setItem("teacherMessages",JSON.stringify(messages));
  document.getElementById("messageText").value="";
  document.getElementById("recipientName").value="";
  document.getElementById("recipientType").value="";
  renderMessages();
  toast("Message sent 📩");
}

function renderMessages(){
  const list=document.getElementById("sentList");
  list.innerHTML="";
  messages.forEach(m=>{
    list.innerHTML+=`
      <li>
        <strong>📨 ${m.to}</strong>
        <span class="recipient-info">To: ${m.name}</span>
        <div class="message-text">${m.text}</div>
        <span class="message-time">${m.date}</span>
      </li>`;
  });
}

/* ANALYTICS SECTION */
function updateAnalytics() {
  const total = incidents.length;
  const resolved = incidents.filter(i => i.status === "Resolved").length;
  const pending = incidents.filter(i => i.status === "Pending").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const uniqueStudents = new Set(incidents.map(i => i.student)).size;
  
  // Update analytics cards
  if (document.getElementById("totalIncidentsAnalytics")) {
    document.getElementById("totalIncidentsAnalytics").textContent = total;
    document.getElementById("resolutionRateAnalytics").textContent = resolutionRate + "%";
    document.getElementById("pendingAnalytics").textContent = pending;
    document.getElementById("studentReportsAnalytics").textContent = uniqueStudents;
  }
  
  // Update insights
  const insightsList = document.getElementById("teacherInsightsList");
  if (insightsList) {
    const insightItems = [
      `Total Reports: ${total} incidents`,
      `Resolution Rate: ${resolutionRate}%`,
      `Pending Issues: ${pending}`,
      `Students Reporting: ${uniqueStudents}`,
      `Status: ${resolutionRate > 70 ? "Keep it up! 🌟" : resolutionRate > 40 ? "Good progress 👍" : "Needs attention ⚠️"}`
    ];
    insightsList.innerHTML = insightItems.map(item => `<li>${item}</li>`).join("");
  }
}

renderIncidents();
renderMessages();
updateAnalytics();
