  // Глобальные переменные
  let lang = localStorage.getItem("lang") || "eng";
  let holders_table = new Map();
  let contract = localStorage.getItem("contract") || null;
  let real_supply;
  
  // Известные адреса
  let known_addreses = {
    "0:d36f5c354c2a2116a9cd7323ebadb6c1250740c303e7f036c2a1a4947744b94f": 'Ston.fi',
    "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad": 'Мужчина'
  };

  // Форматирование чисел
  function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  }

  // Расчет доли владельца
  let logHolderPercentage = (element, index, totalSupply, decimals = 9) => {
    let balance = element.balance / 10 ** decimals;
    let percentage = (balance / totalSupply) * 100;
    let kosh = document.createElement("a");
    kosh.setAttribute("href", `https://tonviewer.com/${element.owner.address}`);
    let name = known_addreses[element.owner.address] || 
               (element.owner.name ? element.owner.name : 
               `${element.owner.address.slice(0,5)}...${element.owner.address.slice(-5)}`);
    kosh.textContent = name;
    kosh.target = '_blank';
    
    holders_table.set(index, {
      Кошелек: kosh,
      Доля: balance > 0 
        ? `${formatNumber(balance.toFixed(2))} (${percentage.toFixed(2)}%)`
        : "0"
    });
  };

  // Получение локализованных текстов
  function getLocalizedTexts() {
    if (lang === "eng") {
      return {
        shown: "Shown on page ",
        all: "All",
        left: "New",
        otlega: "Old with afk",
        wall: "Wallet",
        supl: "share"
      };
    } else {
      return {
        shown: "Показано на странице ",
        all: "Все",
        left: "Левые",
        otlega: "Отлега",
        wall: "Кошелек",
        supl: "Доля"
      };
    }
  }

  // Обновление интерфейса
  function updateUI() {
    let { shown, all, left, otlega, wall, supl } = getLocalizedTexts();
    
    // Кнопки переключения языка
    let engbtn = document.getElementById("eng_btn");
    let rusbtn = document.getElementById("rus_btn");
    
    if (lang === "eng") {
      engbtn.className = "btn btn-success";
      rusbtn.className = "btn btn-outline-success";
    } else {
      rusbtn.className = "btn btn-success";
      engbtn.className = "btn btn-outline-success";
    }
    
    // Обновление текстов
    document.getElementById("pick").textContent = all;
    document.getElementById("koshel").textContent = wall;
    document.getElementById("suplay").textContent = supl;
    document.getElementById("all_holder").textContent = shown + holders_table.size;
    document.getElementById("btn-1").textContent = `${all} (${holders_table.size})`;
    document.getElementById("btn-2").textContent = `${left} ()`;
    document.getElementById("btn-3").textContent = `${otlega} ()`;
    
    // Обработчики кнопок
    document.getElementById("btn-1").onclick = () => document.getElementById("pick").textContent = all;
    document.getElementById("btn-2").onclick = () => document.getElementById("pick").textContent = left;
    document.getElementById("btn-3").onclick = () => document.getElementById("pick").textContent = otlega;
  }

  // Рендер таблицы
  function renderTable() {
    let tableBody = document.getElementById("tableinsert");
    tableBody.innerHTML = "";
    let dict = ["1f991.png", "1f990.png", "1f433.png", "1f421.png", "1f420.png", "1f419.png"];
    
    for (let [key, value] of holders_table) {
      let rand = Math.floor(Math.random() * 6);
      let row = document.createElement("tr");
      row.setAttribute("style", "opacity: 1; transform: translateY(0px); transition: opacity 0.5s, transform 0.5s;")
      row.setAttribute("id",`${key}tr`)
      let idCell = document.createElement("th");
      idCell.textContent = key;
      row.appendChild(idCell);

      let walletCell = document.createElement("th");
      let waterfish = document.createElement("img");
      waterfish.setAttribute("src", `../src/${dict[rand]}`);
      waterfish.setAttribute("width", "20");
      waterfish.setAttribute("alt", "emoji");
      walletCell.appendChild(waterfish);
      walletCell.appendChild(value.Кошелек);
      row.appendChild(walletCell);

      let shareCell = document.createElement("th");
      shareCell.textContent = value.Доля;
      row.appendChild(shareCell);

      tableBody.appendChild(row);
    }
    
    updateUI();
  }

  // Загрузка данных
  let fetchData = async () => {
    if (!contract) return;
    
    try {
      let supplyResponse = await fetch(`https://tonapi.io/v2/jettons/${contract}`);
      let supplyData = await supplyResponse.json();
      real_supply = supplyData.total_supply / 10 ** 9;

      let holdersResponse = await fetch(`https://tonapi.io/v2/jettons/${contract}/holders`);
      let holdersData = await holdersResponse.json();
      
      holdersData.addresses.forEach((el, i) => {
        logHolderPercentage(el, i, real_supply, 9);
      });

      renderTable();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  // Инициализация
  document.addEventListener("DOMContentLoaded", () => {
    // Обработчики кнопок языка
    document.getElementById("eng_btn").addEventListener("click", () => {
      lang = "eng";
      localStorage.setItem("lang", lang);
      updateUI();
    });
    
    document.getElementById("rus_btn").addEventListener("click", () => {
      lang = "rus";
      localStorage.setItem("lang", lang);
      updateUI();
    });
    
    // Загрузка данных
    fetchData();
  });
let cls_pop = document.getElementById("cls_pop")
let wallet_card = document.getElementById("wallet_card")
cls_pop.addEventListener("click", () => {
  wallet_card.style.display = "none"
})