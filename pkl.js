const sesi = JSON.parse(localStorage.getItem("sesiPKL"));
if (!sesi || sesi.role !== "pkl") {
  window.location.href = "index.html";
}

document.getElementById("namaUser").textContent = "Halo, " + sesi.nama;
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("sesiPKL");
  window.location.href = "index.html";
});

const hariIni = new Date();
document.getElementById("tanggalHariIni").textContent = hariIni.toLocaleDateString("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});

const viewBelumMasuk = document.getElementById("viewBelumMasuk");
const viewSudahMasuk = document.getElementById("viewSudahMasuk");
const viewSelesai = document.getElementById("viewSelesai");
const pesanError = document.getElementById("pesanError");

function tampilkanError(msg) {
  pesanError.textContent = msg;
  pesanError.style.display = "block";
}

function sembunyikanSemuaView() {
  viewBelumMasuk.style.display = "none";
  viewSudahMasuk.style.display = "none";
  viewSelesai.style.display = "none";
  pesanError.style.display = "none";
}

// Cek status absen hari ini saat halaman dibuka
function muatStatus() {
  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "cekStatus", username: sesi.username }),
  })
    .then((res) => res.json())
    .then((data) => {
      sembunyikanSemuaView();

      if (data.kondisi === "belumMasuk") {
        viewBelumMasuk.style.display = "block";
      } else if (data.kondisi === "sudahMasuk") {
        viewSudahMasuk.style.display = "block";
        document.getElementById("jamMasukTampil").textContent = data.jamMasuk;
      } else if (data.kondisi === "selesai") {
        viewSelesai.style.display = "block";
        document.getElementById("jamMasukSelesai").textContent = data.jamMasuk;
        document.getElementById("jamKeluarSelesai").textContent = data.jamKeluar;
        document.getElementById("kegiatanSelesai").textContent = data.kegiatan;
      }
    })
    .catch(() => tampilkanError("Gagal memuat status, coba refresh halaman."));
}

// Tombol absen masuk
document.getElementById("btnAbsenMasuk").addEventListener("click", () => {
  const btn = document.getElementById("btnAbsenMasuk");
  btn.disabled = true;
  btn.textContent = "Memproses...";

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ action: "absenMasuk", username: sesi.username, nama: sesi.nama }),
  })
    .then((res) => res.json())
    .then((data) => {
      btn.disabled = false;
      btn.textContent = "Absen Masuk";
      if (data.status === "sukses") {
        muatStatus();
      } else {
        tampilkanError(data.message);
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.textContent = "Absen Masuk";
      tampilkanError("Terjadi kesalahan, coba lagi.");
    });
});

// Form absen pulang + kegiatan
document.getElementById("formPulang").addEventListener("submit", function (e) {
  e.preventDefault();
  const kegiatan = document.getElementById("kegiatan").value;
  const btn = document.getElementById("btnAbsenPulang");

  btn.disabled = true;
  btn.textContent = "Mengirim...";

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({
      action: "absenPulang",
      username: sesi.username,
      kegiatan,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      btn.disabled = false;
      btn.textContent = "Absen Pulang & Kirim Kegiatan";
      if (data.status === "sukses") {
        muatStatus();
      } else {
        tampilkanError(data.message);
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.textContent = "Absen Pulang & Kirim Kegiatan";
      tampilkanError("Terjadi kesalahan, coba lagi.");
    });
});

muatStatus();
