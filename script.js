// GANTI URL DI BAWAH INI dengan URL Web App dari Google Apps Script kamu
const URL_API = "https://script.google.com/macros/s/AKfycbyvSCNBq36vEkRES_Q7pGwcBCtLXww5WwOPQY0awfptLYwlDfYTBcwrEXdmkRFU6phczw/exec";

const form = document.getElementById("formAbsen");
const btnKirim = document.getElementById("btnKirim");
const pesanSukses = document.getElementById("pesanSukses");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const kegiatan = document.getElementById("kegiatan").value;

  btnKirim.disabled = true;
  btnKirim.textContent = "Mengirim...";

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({ nama: nama, kegiatan: kegiatan }),
  })
    .then(() => {
      pesanSukses.style.display = "block";
      form.reset();
      btnKirim.disabled = false;
      btnKirim.textContent = "Kirim Absen";

      setTimeout(() => {
        pesanSukses.style.display = "none";
      }, 3000);
    })
    .catch((err) => {
      alert("Gagal mengirim, coba lagi. Error: " + err);
      btnKirim.disabled = false;
      btnKirim.textContent = "Kirim Absen";
    });
});
