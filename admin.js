// ADMIN DATA
const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin")) || { name: "Administrator" };
document.getElementById("adminName").textContent = currentAdmin.name;

// LOGOUT FUNCTIONALITY
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentAdmin");
  alert("You have been logged out successfully!");
  window.location.href = "../sign in/login.html";
});

// SAMPLE INCIDENT DATA
let incidents = JSON.parse(localStorage.getItem("incidents")) || [
  { student: "Juan Dela Cruz", type: "Bullying", date: "2026-02-01", status: "Pending" },
  { student: "Maria Santos", type: "Language", date: "2026-02-03", status: "Resolved" },
  { student: "Anonymous", type: "Digital Misuse", date: "2026-02-05", status: "Pending" },
  { student: "Carlos Reyes", type: "Bullying", date: "2026-02-06", status: "Resolved" }
];

// SAMPLE ACCOUNTS DATA
let accounts = JSON.parse(localStorage.getItem("accounts")) || [
  { id: 1, name: "Juan Dela Cruz", email: "juan@example.com", type: "users", status: "active", joinDate: "2025-09-15" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", type: "users", status: "active", joinDate: "2025-10-20" },
  { id: 3, name: "Carlos Reyes", email: "carlos@example.com", type: "users", status: "inactive", joinDate: "2025-08-10" },
  { id: 4, name: "Ana Rodriguez", email: "ana@example.com", type: "teachers", status: "active", joinDate: "2025-06-05" },
  { id: 5, name: "Miguel Johnson", email: "miguel@example.com", type: "teachers", status: "active", joinDate: "2025-07-12" },
  { id: 6, name: "Sofia Mercado", email: "sofia@example.com", type: "users", status: "active", joinDate: "2025-11-03" },
  { id: 7, name: "Dr. Garcia", email: "garcia@example.com", type: "teachers", status: "inactive", joinDate: "2025-05-15" },
  { id: 8, name: "Pedro Lopez", email: "pedro@example.com", type: "users", status: "active", joinDate: "2025-12-01" }
];

let currentAccountFilter = "all";

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
  incidents.slice(-5).reverse().forEach((i)=>{
    let idx=incidents.indexOf(i);
    recent.innerHTML+=`
      <tr>
        <td>${i.student}</td>
        <td>${i.type}</td>
        <td>${i.status}</td>
        <td>${i.date}</td>
        <td>${i.status==="Pending"?'<button class="solve-btn" data-index="'+idx+'">Solve</button>':'✔'}</td>
      </tr>
    `;
  });
  document.querySelectorAll(".solve-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      let idx=parseInt(btn.getAttribute("data-index"));
      incidents[idx].status="Resolved";
      localStorage.setItem("incidents",JSON.stringify(incidents));
      updateDashboard();
      updateAnalytics();
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
      updateAnalytics();
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

// ACCOUNTS MONITORING
function renderAccountsTable(data) {
  const tableBody = document.getElementById("accountsTableBody");
  tableBody.innerHTML = "";
  data.forEach((account) => {
    const statusBadge = account.status === "active" 
      ? '<span class="status-badge status-active">Active</span>' 
      : '<span class="status-badge status-inactive">Inactive</span>';
    const accountTypeClass = account.type === "users" ? "account-type-user" : "account-type-teacher";
    const accountTypeLabel = account.type === "users" ? "User" : "Teacher";
    const actionBtn = account.status === "active"
      ? `<button class="action-btn btn-deactivate" data-id="${account.id}" data-action="deactivate">Deactivate</button>`
      : `<button class="action-btn btn-activate" data-id="${account.id}" data-action="activate">Activate</button>`;
    
    tableBody.innerHTML += `
      <tr>
        <td>${account.name}</td>
        <td>${account.email}</td>
        <td><span class="${accountTypeClass}">${accountTypeLabel}</span></td>
        <td>${statusBadge}</td>
        <td>${account.joinDate}</td>
        <td>
          ${actionBtn}
          <button class="action-btn btn-remove" data-id="${account.id}" data-action="remove">Remove</button>
        </td>
      </tr>
    `;
  });
  attachAccountActions();
  updateAccountStats();
}

function attachAccountActions() {
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      const action = btn.getAttribute("data-action");
      const account = accounts.find(a => a.id === id);
      
      if (action === "activate") {
        account.status = "active";
      } else if (action === "deactivate") {
        account.status = "inactive";
      } else if (action === "remove") {
        if (confirm("Are you sure you want to remove this account?")) {
          accounts = accounts.filter(a => a.id !== id);
        } else {
          return;
        }
      }
      localStorage.setItem("accounts", JSON.stringify(accounts));
      filterAndRenderAccounts();
    });
  });
}

function filterAndRenderAccounts() {
  let filtered = accounts;
  if (currentAccountFilter !== "all") {
    filtered = accounts.filter(a => a.type === currentAccountFilter);
  }
  renderAccountsTable(filtered);
}

function updateAccountStats() {
  const totalUsers = accounts.filter(a => a.type === "users").length;
  const totalTeachers = accounts.filter(a => a.type === "teachers").length;
  const totalActive = accounts.filter(a => a.status === "active").length;
  const totalInactive = accounts.filter(a => a.status === "inactive").length;
  
  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("totalTeachers").textContent = totalTeachers;
  document.getElementById("totalActive").textContent = totalActive;
  document.getElementById("totalInactive").textContent = totalInactive;
}

// ACCOUNTS FILTER BUTTONS
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    currentAccountFilter = e.target.getAttribute("data-filter");
    filterAndRenderAccounts();
  });
});

// ACCOUNTS SEARCH
document.getElementById("accountSearchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  let filtered = accounts.filter(a => 
    a.name.toLowerCase().includes(value) || a.email.toLowerCase().includes(value)
  );
  if (currentAccountFilter !== "all") {
    filtered = filtered.filter(a => a.type === currentAccountFilter);
  }
  renderAccountsTable(filtered);
});

// ANALYTICS SECTION
function updateAnalytics() {
  const total = incidents.length;
  const resolved = incidents.filter(i => i.status === "Resolved").length;
  const pending = incidents.filter(i => i.status === "Pending").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const activeAccounts = accounts.filter(a => a.status === "active").length;
  
  // Update analytics cards
  if (document.getElementById("totalIncidentsAnalytics")) {
    document.getElementById("totalIncidentsAnalytics").textContent = total;
    document.getElementById("resolutionRateAnalytics").textContent = resolutionRate + "%";
    document.getElementById("pendingAnalytics").textContent = pending;
    document.getElementById("activeUsersAnalytics").textContent = activeAccounts;
  }
  
  // Update insights
  const insightsList = document.getElementById("adminInsightsList");
  if (insightsList) {
    const insightItems = [
      `Total Incidents Reported: ${total}`,
      `Successfully Resolved: ${resolved} incidents`,
      `Pending Resolution: ${pending} incidents`,
      `Active Accounts: ${activeAccounts}`,
      `System Health: ${resolutionRate > 70 ? "Excellent ✅" : resolutionRate > 40 ? "Good 👍" : "Needs Attention ⚠️"}`
    ];
    insightsList.innerHTML = insightItems.map(item => `<li>${item}</li>`).join("");
  }
}

// INITIAL LOAD
updateDashboard();
renderTable(incidents);
renderAccountsTable(accounts);
updateAnalytics();
