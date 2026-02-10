const accounts = {
  admin: {
    email: "admin@school.com",
    password: "admin123",
    redirect: "../admin-dashboard/admin.html"
  },
  teacher: {
    email: "teacher@school.com",
    password: "teacher123",
    redirect: "../teacher-dashboard/teacher-dashboard.html"
  },
  student: {
    email: "student@school.com",
    password: "student123",
    redirect: "../user-dashboard/dashboard-user.html"
  }
};

function login(){
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  if(!role || !email || !password){
    error.textContent = "Please fill in all fields";
    return;
  }

  const account = accounts[role];

  if(email === account.email && password === account.password){
    localStorage.setItem("loggedInRole", role);
    localStorage.setItem("loggedInEmail", email);

    error.style.color = "green";
    error.textContent = "Login successful ✔";

    setTimeout(()=>{
      window.location.href = account.redirect;
    },800);
  }else{
    error.textContent = "Invalid login credentials";
  }
}
