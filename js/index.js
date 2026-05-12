// index.js — только для языковой поддержки
if (!localStorage.getItem("lang") || localStorage.getItem("lang") === "null" || localStorage.getItem("lang") === "undefined") {
  localStorage.setItem("lang", "eng");
}

let engbtn = document.getElementById("eng_btn");
let rusbtn = document.getElementById("rus_btn");
let econtent = document.getElementById("en-content");
let rcontent = document.getElementById("ru_content");
let finder = document.getElementById("contractInput");
let engplc = "ca search";
let rusplc = "поиск по контракту";

function chg_lng() {
  if (localStorage.getItem("lang") == "eng") {
    rcontent?.setAttribute("class", "hidden");
    econtent?.removeAttribute("class");
    engbtn?.setAttribute("class", "btn btn-success");
    rusbtn?.setAttribute("class", "btn btn-outline-success");
    if (finder) finder.placeholder = engplc;
  }
  if (localStorage.getItem("lang") == "rus") {
    econtent?.setAttribute("class", "hidden");
    rcontent?.removeAttribute("class");
    rusbtn?.setAttribute("class", "btn btn-success");
    engbtn?.setAttribute("class", "btn btn-outline-success");
    if (finder) finder.placeholder = rusplc;
  }
}

engbtn?.addEventListener("click", () => {
  localStorage.setItem("lang", "eng");
  chg_lng();
});

rusbtn?.addEventListener("click", () => {
  localStorage.setItem("lang", "rus");
  chg_lng();
});

document.addEventListener("DOMContentLoaded", () => {
  chg_lng();
});