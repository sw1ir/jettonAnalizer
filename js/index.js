if (!localStorage.getItem("lang") || localStorage.getItem("lang") === "null" || localStorage.getItem("lang") === "undefined") {
    localStorage.setItem("lang", "eng");
}

// Получаем элементы DOM
let engbtn = document.getElementById("eng_btn");
let rusbtn = document.getElementById("rus_btn");
let econtent = document.getElementById("en-content");
let rcontent = document.getElementById("ru_content");
let finder = document.getElementById("contractInput");
let engplc = "ca search";
let rusplc = "поиск по контракту";

function chg_lng() {
    if (localStorage.getItem("lang") == "eng") {
        rcontent.setAttribute("class", "hidden");
        econtent.removeAttribute("class");
        engbtn.removeAttribute("class");
        engbtn.setAttribute("class", "btn btn-success");
        rusbtn.removeAttribute("class");
        rusbtn.setAttribute("class", "btn btn-outline-success");
        finder.placeholder = engplc;
    }
    if (localStorage.getItem("lang") == "rus") {
        econtent.setAttribute("class", "hidden");
        rcontent.removeAttribute("class");
        rusbtn.removeAttribute("class");
        rusbtn.setAttribute("class", "btn btn-success");
        engbtn.removeAttribute("class");
        engbtn.setAttribute("class", "btn btn-outline-success");
        finder.placeholder = rusplc;
    }
}

function initLanguage() {
    chg_lng();
}

// Обработчики кнопок смены языка
engbtn.addEventListener("click", function() {
    localStorage.setItem("lang", "eng");
    chg_lng();
});

rusbtn.addEventListener("click", function() {
    localStorage.setItem("lang", "rus");
    chg_lng();
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    localStorage.removeItem("contract"); // Очищаем предыдущий контракт
    initLanguage();
});

// Функция вставки из буфера
document.getElementById("pasteButton").addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        const input = document.getElementById("contractInput");
        input.value = text;
        input.focus();
        input.select();
    } catch (err) {
        console.error("Ошибка доступа к буферу:", err);
        alert("Разрешите доступ к буферу или введите адрес вручную");
    }
});

document.getElementById("search").addEventListener("click", () => {
    const contractAddress = document.getElementById("contractInput").value;
    if (contractAddress) {
        console.log("Ищем контракт:", contractAddress);
        localStorage.setItem("contract", contractAddress);
        window.location.href = "./token.html";
    }
});