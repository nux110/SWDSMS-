// SAMPLE INCIDENT DATA
let incidents = JSON.parse(localStorage.getItem("incidents")) || [
  { student: "Juan Dela Cruz", type: "Bullying", date: "2026-02-01", status: "Pending" },
  { student: "Maria Santos", type: "Language", date: "2026-02-03", status: "Resolved" },
  { student: "Anonymous", type: "Digital Misuse", date: "2026-02-05", status: "Pending" },
  { student: "Carlos Reyes", type: "Bullying", date: "2026-02-06", status: "Resolved" }
];

// SIDEBAR NAVIGATION
const navLinks = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll("section");
navLinks.forEach(link=>{
  link.addEventListener("click", ()=>{
    navLinks.forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    const target=link.getAttribute("href").substring(1);
    sections.forEach(sec=>sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// ANIMATED COUNTER
function animateValue(id, end) {
  let obj = document.getElementById(id);
  let start = 0;
  let duration = 800;
  let stepTime = Math.abs(Math.floor(duration / end));
  let timer = setInterval(()=>{
    start += 1;
    obj.textContent=start;
    if(start>=end){clearInterval(timer);}
  }, stepTime);
}

// DASHBOARD STATS
function updateDashboard() {
  animateValue("adminTotal", incidents.length);
  animateValue("resolvedCount", incidents.filter(i=>i.status==="Resolved").length);
  animateValue("pendingCount", incidents.filter(i=>i.status==="Pending").length);
  animateValue("todayCount", incidents.filter(i=>i.date===new Date().toISOString().split('T')[0]).length);

  // PROGRESS BARS
  let total=incidents.length;
  let resolved=incidents.filter(i=>i.status==="Resolved").length;
  let pending=incidents.filter(i=>i.status==="Pending").length;
  document.getElementById("totalBar").style.width="100%";
  document.getElementById("resolvedBar").style.width=(resolved/total*100)+"%";
  document.getElementById("pendingBar").style.width=(pending/total*100)+"%";
  document.getElementById("todayBar").style.width=(incidents.filter(i=>i.date===new Date().toISOString().split('T')[0]).length/total*100)+"%";

  renderRecent();
  updateProfile();
}

// RENDER RECENT REPORTS WITH SOLVE BUTTON
function renderRecent(){
  const recent=document.getElementById("recentIncidents");
  recent.innerHTML="";
  incidents.slice(-5).reverse().forEach((i,index)=>{
    recent.innerHTML+=`
      <tr>
        <td>${i.student}</td>
        <td>${i.type}</td>
        <td>${i.status}</td>
        <td>${i.date}</td>
        <td>${i.status==="Pending"?'<button class="solve-btn" data-index="'+index+'">Solve</button>':'✔'}</td>
      </tr>
    `;
  });
  document.querySelectorAll(".solve-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      let idx=parseInt(btn.getAttribute("data-index"));
      incidents[idx].status="Resolved";
      localStorage.setItem("incidents",JSON.stringify(incidents));
      updateDashboard();
      renderTable(incidents);
    });
  });
}

// INCIDENT TABLE
function renderTable(data){
  const table=document.getElementById("incidentTable");
  table.innerHTML="";
  data.forEach((i,index)=>{
    table.innerHTML+=`
      <tr>
        <td>${i.student}</td>
        <td>${i.type}</td>
        <td>${i.status}</td>
        <td>${i.date}</td>
        <td>${i.status==="Pending"?'<button class="solve-btn" data-index="'+index+'">Solve</button>':'✔'}</td>
      </tr>
    `;
  });
  document.querySelectorAll(".solve-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      let idx=parseInt(btn.getAttribute("data-index"));
      incidents[idx].status="Resolved";
      localStorage.setItem("incidents",JSON.stringify(incidents));
      updateDashboard();
      renderTable(incidents);
    });
  });
}

// PROFILE STATS
function updateProfile(){
  document.getElementById("solvedCount").textContent=incidents.filter(i=>i.status==="Resolved").length;
  document.getElementById("pendingProfileCount").textContent=incidents.filter(i=>i.status==="Pending").length;
}

// SEARCH FUNCTIONALITY
document.getElementById("searchInput").addEventListener("input", e=>{
  const value=e.target.value.toLowerCase();
  renderTable(incidents.filter(i=>i.student.toLowerCase().includes(value)));
});

// INITIAL LOAD
updateDashboard();
renderTable(incidents);
