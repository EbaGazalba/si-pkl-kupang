const form = document.getElementById("formLogin");
const btnLogin = document.getElementById("btnLogin");
const pesanError = document.getElementById("pesanError");

// Kalau sudah login, langsung arahkan ke halaman sesuai role
const sesiAwal = JSON.parse(localStorage.getItem("sesiPKL"));
if (sesiAwal) {
  window.location.href = sesiAwal.role === "admin" ? "admin.html" : "pkl.html";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  btnLogin.disabled = true;
  btnLogin.textContent = "Memeriksa...";
  pesanError.style.display = "none";

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "login", username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      btnLogin.disabled = false;
      btnLogin.textContent = "Masuk";

      if (data.status === "sukses") {
        localStorage.setItem(
          "sesiPKL",
          JSON.stringify({ username, role: data.role, nama: data.nama })
        );
        window.location.href = data.role === "admin" ? "admin.html" : "pkl.html";
      } else {
        pesanError.textContent = data.message || "Login gagal";
        pesanError.style.display = "block";
      }
    })
    .catch(() => {
      btnLogin.disabled = false;
      btnLogin.textContent = "Masuk";
      pesanError.textContent = "Terjadi kesalahan, coba lagi.";
      pesanError.style.display = "block";
    });
});
