// Глобальные переменные
  let lang = localStorage.getItem("lang") || "eng";
  let holders_table = new Map();
  let contract = localStorage.getItem("contract") || null;
  let real_supply;

let daay = document.createElement("span")
let hrs = document.createElement("span")
let minut = document.createElement("span")
let secnds = document.createElement("span")
daay.setAttribute("id","days")
hrs.setAttribute("id","hour")
minut.setAttribute("id","minu")
secnds.setAttribute("id","sec")

  // Форматирование чисел
  function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  }

  // Расчет доли владельца
// Измененная функция logHolderPercentage
let logHolderPercentage = (element, index, totalSupply, decimals = 9) => {
    let balance = element.initialTokens / 10 ** decimals;
    let percentage = (balance / totalSupply) * 100;
    let now = Date.now() / 1000;

    if (element.contractData.firstPayoutTime < now) {
        return;
    } else {
        let lock_date = element.lockTime * 1000;
        let unlock_date = element.contractData.firstPayoutTime;
        let udata = new Date(unlock_date * 1000);
        let ldata = new Date(lock_date);
        
        // Создаем элементы для отображения данных
        let unlock_data = document.createElement("span");
        let lock_data = document.createElement("span");
        let utime = document.createElement("span");
        
        unlock_data.textContent = udata;
        lock_data.textContent = ldata;
        
        // Функция для обновления обратного отсчета
        function updateCountdown() {
            const now = Math.floor(Date.now() / 1000);
            const diff = unlock_date - now;
            
            if (diff <= 0) {
                utime.textContent = "Разблокировано";
                return;
            }
            
            const days = Math.floor(diff / (60 * 60 * 24));
            const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((diff % (60 * 60)) / 60);
            const seconds = Math.floor(diff % 60);
            
            utime.textContent = `${days} days ${hours} hours ${minutes} min. ${seconds} sec.`;
        }
        
        // Первое обновление
        updateCountdown();
        
        // Запускаем таймер
        const timer = setInterval(updateCountdown, 1000);
        
        // Создаем ссылку на кошелек
        let kosh = document.createElement("a");
        kosh.setAttribute("href", `https://tonraffles.app/lock/${contract}/${element.address}`);
        let name = `${element.address.slice(0,5)}...${element.address.slice(-5)}`;
        kosh.textContent = name;
        kosh.target = '_blank';
        
        // Сохраняем данные в holders_table
        holders_table.set(index, {
            Кошелек: kosh,
            Доля: balance > 0 
                ? `${formatNumber(balance.toFixed(2))} (${percentage.toFixed(2)}%)`
                : "0",
            Лок: lock_data,
            Разлок: unlock_data,
            Время_Разлока: utime,
            timerId: timer // Сохраняем ID таймера для последующей очистки
        });
    }
};
  // Получение локализованных текстов
  function getLocalizedTexts() {
    if (lang === "eng") {
      return {

        wall: "Wallet",
        supl: "locked",
        stlock : "Lock date",
        unlok: "Unlock Date",
        left: "Left"
      };
    } else {
      return {
        wall: "Кошелек",
        supl: "Заблокированно",
        stlock : "Дата лока",
        unlok: "Дата разлока",
        left: "Осталось"
      };
    }
  }

  // Обновление интерфейса
  function updateUI() {
    let {wall, supl , stlock, unlok, left} = getLocalizedTexts();
    
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
    document.getElementById("koshel").textContent = wall;
    document.getElementById("suplay").textContent = supl;
    document.getElementById("start_lock").textContent = stlock
    document.getElementById("start_unlock").textContent = unlok
    document.getElementById("unlock").textContent = left
  }

  // Рендер таблицы
  function renderTable() {
    let tableBody = document.getElementById("tableinsert");
    tableBody.innerHTML = "";
    
    for (let [key, value] of holders_table) {
 
      let row = document.createElement("tr");



      let walletCell = document.createElement("th");
      walletCell.appendChild(value.Кошелек);
      row.setAttribute("style", "opacity: 1; transform: translateY(0px); transition: opacity 0.5s, transform 0.5s;")

      row.appendChild(walletCell);

      let shareCell = document.createElement("th");
      shareCell.textContent = value.Доля;
      row.appendChild(shareCell);
      
      let lock = document.createElement("th");
      lock.appendChild(value.Лок);
      row.appendChild(lock); 

      let unlock = document.createElement("th");
      unlock.appendChild(value.Разлок);
      row.appendChild(unlock);

      let unlock_time = document.createElement("th");
      unlock_time.appendChild(value.Время_Разлока);
      row.appendChild(unlock_time);

      tableBody.appendChild(row);
    }
    
    updateUI();
  }

  // Загрузка данных
  let fetchData = async () => {
    if (!contract) return;
    
    try {
      let locks = await fetch(`https://api.tonraffles.app/api/v2/lock/${contract}`)
      let allLockData = await locks.json()
    let massiv = allLockData.lockRecords

    let supplyResponse = await fetch(`https://tonapi.io/v2/jettons/${contract}`);
      let supplyData = await supplyResponse.json();
      real_supply = supplyData.total_supply / 10 ** 9;
      massiv.forEach((el, i) => {
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
