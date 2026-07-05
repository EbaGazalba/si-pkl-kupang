const sesi = JSON.parse(localStorage.getItem("sesiPKL"));
if (!sesi || sesi.role !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("namaUser").textContent = "Halo, " + sesi.nama;
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("sesiPKL");
  window.location.href = "index.html";
});

// Ganti tab
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => (c.style.display = "none"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).style.display = "block";
  });
});

function muatUser() {
  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "getData", type: "users" }),
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#tabelUser tbody");
      tbody.innerHTML = "";
      data.data.forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${u.nama}</td><td>${u.username}</td><td>${u.role}</td>
          <td><button class="btn-hapus" onclick="hapusUser('${u.username}')">Hapus</button></td>`;
        tbody.appendChild(tr);
      });
    });
}

function muatAbsensi() {
  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "getData", type: "absensi" }),
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#tabelAbsensi tbody");
      tbody.innerHTML = "";
      data.data.forEach((a) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.nama}</td><td>${a.tanggal}</td><td>${a.jamMasuk}</td><td>${a.jamKeluar || "-"}</td><td>${a.kegiatan || "-"}</td>
          <td><button class="btn-hapus" onclick="hapusAbsensi(${a.row})">Hapus</button></td>`;
        tbody.appendChild(tr);
      });
    });
}

document.getElementById("formTambahUser").addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = document.getElementById("namaBaru").value;
  const username = document.getElementById("usernameBaru").value;
  const password = document.getElementById("passwordBaru").value;
  const role = document.getElementById("roleBaru").value;

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "addUser", nama, username, password, role }),
  })
    .then((res) => res.json())
    .then(() => {
      e.target.reset();
      muatUser();
    });
});

function hapusUser(username) {
  if (!confirm("Yakin hapus user ini?")) return;
  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "deleteUser", username }),
  })
    .then((res) => res.json())
    .then(() => muatUser());
}

function hapusAbsensi(row) {
  if (!confirm("Yakin hapus data ini?")) return;
  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "deleteAbsen", row }),
  })
    .then((res) => res.json())
    .then(() => muatAbsensi());
}

muatUser();
muatAbsensi();
