let incidents = JSON.parse(localStorage.getItem("userIncidents")) || [];
let messages = JSON.parse(localStorage.getItem("teacherMessages")) || [];

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
  localStorage.setItem("userIncidents",JSON.stringify(incidents));
  renderIncidents();
  toast("Incident resolved ✅");
}

/* STATS */
function updateStats(){
  document.getElementById("total").textContent=incidents.length;
  document.getElementById("pending").textContent=incidents.filter(i=>i.status==="Pending").length;
  document.getElementById("resolved").textContent=incidents.filter(i=>i.status==="Resolved").length;
}

/* MESSAGES */
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
        <strong>${m.to}:</strong> ${m.name}<br>
        ${m.text}<br>
        <small>${m.date}</small>
      </li>`;
  });
}

renderIncidents();
renderMessages();
