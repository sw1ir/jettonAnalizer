  // Глобальные переменные
  let lang = localStorage.getItem("lang") || "eng";
  let holders_table = new Map();
  let PopUpTable = new Map();
  let contract = localStorage.getItem("contract") || null;
  let real_supply;
  let contract_id
  let dec
  let offset = 0
  let limit = 1000
  let ton_dec = 9
  let tg_usernms = "0:80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2"
let anon_numbers = "0:0e41dc1dc3c9067ed24248580e12b3359818d83dee0304fabcf80845eafafdb2"
  
let currentPage = 1;
let rowsPerPage = 1000; // будет синхронизироваться с cntRows
let totalPages = 1;

  // let allAdresses 
getContractId(contract).then(data=>{
  contract_id = data.address
  console.log(contract_id)
})
console.log(contract)
async function dec_data(){
   const supplyResponse = await fetch(`https://tonapi.io/v2/jettons/${contract}`);
    const supplyData = await supplyResponse.json();
    dec = supplyData.metadata.decimals;
}
dec_data()
  // Известные адреса
  let known_addreses = {
    "0:d36f5c354c2a2116a9cd7323ebadb6c1250740c303e7f036c2a1a4947744b94f": 'Ston.fi',
    "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad": 'Мужчина',
    "0:a99e7ce7794f81b1f8d83b748818908ead65ff809a0f54a9a8317d34690b51b9": 'Фомо',
    "0:0e7f011c7b0fc7b9fecd6e9b32a55377f2c0359e424f64c4753dff02fce6175d": 'Овер',
    "0:aa36c70bc11d3cf8b40bab399e2d1edd830d60d1ce03475ecfcdec016fc4b900": 'Юпитер',
    "0:ccd11771d519e8015862f7dba840d3e8073eb870121e2a5666f5a8d9230485c9":'Бизнес',
    "0:e2f94e049d2da7a373e9556c40c787cdba35c23d74916525f9f15d08cc9ffccc":'Робертыч1',
    "0:a569423a14e507f149f60bf848334f6f45fbfa03749dbc2aba6e1a39f42c3952": 'Робертыч2',
    "0:92478281ca452b899045ebe65f4fd63f27054be7646d9ca15d62c3ee043f4572": 'Агзи',
    "0:d00ac97847b648a69eec5e283b6437d6cd576cedcc9c2f3665c46f6bf29e9c4e": "Рейн",
    "0:ce7324e136dac3667859456971afcf2f5995f452dde1616440384ca6c840e63b": "бэбро",
    "0:e582decb3a761f7daff2d18054f0d11df55276b0c133c31d807405d7f508b975": "Маркелов" ,
    "0:d6f666cb0f1fe73fc6bef13ed7209ba8e329c3564459012197ac1a246ed482c3": "Хэш",
    "0:a934e543ec1879d6f6d0d2ea17f1c4973d475368de0509d58bf35a40045ad5f0":"Мужчина2"
    
  };

  // Форматирование чисел
  function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  }

  // Расчет доли владельца
  let logHolderPercentage = (element, index, totalSupply,  dec) => {
    let balance = element.balance / 10 ** dec;
    let percentage = (balance / totalSupply) * 100;
    let kosh = document.createElement("a");
    kosh.setAttribute("href", `https://tonviewer.com/${element.owner.address}`);
    let name = known_addreses[element.owner.address] || 
               (element.owner.name ? element.owner.name : 
               `${element.owner.address.slice(0,5)}...${element.owner.address.slice(-5)}`);
    kosh.textContent = name;
    kosh.target = '_blank';
    
    holders_table.set(holders_table.size, {
      Кошелек: kosh,
      Доля:
        balance > 0
          ? `${formatNumber(balance.toFixed(2))} (${percentage.toFixed(2)}%)`
          : "0",
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
    document.getElementById("koshel").textContent = wall;
    document.getElementById("suplay").textContent = supl;

    
    // Обработчики кнопок

  }
let cntRows = 1000;
let cntRow1 = document.getElementById("cntRow1");
let cntRow2 = document.getElementById("cntRow2");
let cntRow3 = document.getElementById("cntRow3");

cntRow1.addEventListener("click", () => {
  rowsPerPage = 250;
  cntRow1.className += " active";
  cntRow2.classList.remove("active");
  cntRow3.classList.remove("active");
  currentPage = 1; // Сбрасываем на первую страницу
  renderTable(); // renderTable вызовет updatePagination()
});

cntRow2.addEventListener("click", () => {
  rowsPerPage = 500;
  cntRow2.className += " active";
  cntRow1.classList.remove("active");
  cntRow3.classList.remove("active");
  currentPage = 1;
  renderTable();
});

cntRow3.addEventListener("click", () => {
  rowsPerPage = 1000;
  cntRow3.className += " active";
  cntRow2.classList.remove("active");
  cntRow1.classList.remove("active");
  currentPage = 1;
  renderTable();
});
  // Рендер таблицы
function renderTable() {
  let tableBody = document.getElementById("tableinsert");
  tableBody.innerHTML = "";
  let dict = [
    "1f991.png",
    "1f990.png",
    "1f433.png",
    "1f421.png",
    "1f420.png",
    "1f419.png",
  ];

  // Рассчитываем индексы для текущей страницы
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, holders_table.size);

  // Если нет данных, показываем пустую таблицу
  if (holders_table.size === 0) {
    updateUI();
    updatePagination(); // Обновляем пагинацию даже если данных нет
    return;
  }

  // Преобразуем Map в массив для удобной навигации по страницам
  const holdersArray = Array.from(holders_table.entries());

  // Отображаем только строки для текущей страницы
  for (let i = startIndex; i < endIndex; i++) {
    const [key, value] = holdersArray[i];

    let rand = Math.floor(Math.random() * 6);
    let row = document.createElement("tr");
    row.setAttribute("class", "gtr");
    row.setAttribute(
      "style",
      "opacity: 1; transform: translateY(0px); transition: opacity 0.5s, transform 0.5s;",
    );

    let idCell = document.createElement("th");
    idCell.textContent = key;
    idCell.setAttribute("class", "gth");
    row.appendChild(idCell);

    let walletCell = document.createElement("th");
    walletCell.setAttribute("class", "gth");
    let waterfish = document.createElement("img");
    waterfish.setAttribute("src", `../src/${dict[rand]}`);
    waterfish.setAttribute("width", "20");
    waterfish.setAttribute("alt", "emoji");
    walletCell.appendChild(waterfish);
    walletCell.appendChild(value.Кошелек);
    row.appendChild(walletCell);

    let shareCell = document.createElement("th");
    shareCell.textContent = value.Доля;
    shareCell.setAttribute("class", "gth");
    row.appendChild(shareCell);

    tableBody.appendChild(row);
  }

  updateUI();
  updatePagination(); // ВАЖНО: обновляем пагинацию после каждого рендера
}



// Функция обновления пагинации
function updatePagination() {
  // Пересчитываем общее количество страниц
  totalPages = Math.ceil(holders_table.size / rowsPerPage);

  // Если нет данных, показываем 1 страницу
  if (totalPages === 0) totalPages = 1;

  // Получаем контейнер пагинации
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  // Сохраняем кнопки "Предыдущая" и "Следующая"
  const prevButton = paginationContainer.querySelector(
    ".page-item:first-child",
  );
  const nextButton = paginationContainer.querySelector(".page-item:last-child");

  // Удаляем все кнопки страниц, кроме первой и последней
  while (paginationContainer.children.length > 2) {
    paginationContainer.removeChild(paginationContainer.children[1]);
  }

  // Если страниц мало, показываем все
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = createPageItem(i);
      paginationContainer.insertBefore(pageItem, nextButton);
    }
  } else {
    // Показываем с эллипсисом
    paginationContainer.insertBefore(createPageItem(1), nextButton);

    if (currentPage > 3) {
      paginationContainer.insertBefore(createEllipsis(), nextButton);
    }

    // Страницы вокруг текущей
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      paginationContainer.insertBefore(createPageItem(i), nextButton);
    }

    if (currentPage < totalPages - 2) {
      paginationContainer.insertBefore(createEllipsis(), nextButton);
    }

    // Последняя страница
    if (totalPages > 1) {
      paginationContainer.insertBefore(createPageItem(totalPages), nextButton);
    }
  }

  // Обновляем активную страницу
  document.querySelectorAll(".page-item").forEach((item) => {
    const link = item.querySelector(".page-link");
    if (link && link.textContent == currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Обновляем состояние кнопок навигации
  const prevLink = prevButton.querySelector(".page-link");
  const nextLink = nextButton.querySelector(".page-link");

  if (currentPage === 1 || totalPages === 0) {
    prevButton.classList.add("disabled");
    if (prevLink) prevLink.style.pointerEvents = "none";
  } else {
    prevButton.classList.remove("disabled");
    if (prevLink) prevLink.style.pointerEvents = "auto";
  }

  if (currentPage === totalPages || totalPages === 0) {
    nextButton.classList.add("disabled");
    if (nextLink) nextLink.style.pointerEvents = "none";
  } else {
    nextButton.classList.remove("disabled");
    if (nextLink) nextLink.style.pointerEvents = "auto";
  }
}

// Создание элемента страницы
function createPageItem(pageNum) {
  const li = document.createElement("li");
  li.className = "page-item";

  const a = document.createElement("a");
  a.className = "page-link";
  a.href = "#";
  a.textContent = pageNum;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    goToPage(pageNum);
  });

  li.appendChild(a);
  return li;
}

// Создание эллипсиса
function createEllipsis() {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = '...';
    
    li.appendChild(a);
    return li;
}

// Переход на страницу
function goToPage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(); // renderTable уже вызывает updatePagination()
}
  // Загрузка данных
let fetchData = async () => {
  if (!contract) return;

  try {
    let supplyResponse = await fetch(
      `https://tonapi.io/v2/jettons/${contract}`,
    );
    let supplyData = await supplyResponse.json();

    real_supply = supplyData.total_supply / 10 ** dec;
    offset = 0;

    // Очищаем таблицу перед загрузкой
    holders_table.clear();

    // Создаем индикатор загрузки
    const tableBody = document.getElementById("tableinsert");
    let loadingRow = document.createElement("tr");
    loadingRow.id = "loading-row";
    let loadingCell = document.createElement("td");
    loadingCell.colSpan = 3;
    loadingCell.textContent = "Загрузка данных...";
    loadingCell.style.textAlign = "center";
    loadingRow.appendChild(loadingCell);
    tableBody.appendChild(loadingRow);

    while (holders_table.size < supplyData.holders_count) {
      console.log(
        `Загружено: ${holders_table.size}/${supplyData.holders_count}`,
      );

      let holdersResponse = await fetch(
        `https://tonapi.io/v2/jettons/${contract}/holders?limit=${limit}&offset=${offset}`,
      );
      holdersData = await holdersResponse.json();

      if (holdersData.addresses && holdersData.addresses.length > 0) {
        holdersData.addresses.forEach((el) => {
          logHolderPercentage(el, holders_table.size, real_supply, dec);
        });
      }

      offset += limit;

      // Показываем первые 1000 кошельков сразу
      if (holders_table.size >= 1000 || offset >= 10000) {
        // Удаляем строку загрузки
        const loadingRowEl = document.getElementById("loading-row");
        if (loadingRowEl) loadingRowEl.remove();
        renderTable(); // Это вызовет updatePagination()
      }

      // Ждем между запросами
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ограничение API
      if (offset >= 10000) break;
    }

    // Удаляем строку загрузки, если она еще есть
    const loadingRowEl = document.getElementById("loading-row");
    if (loadingRowEl) loadingRowEl.remove();

    // Финальный рендер
    renderTable(); // Финальное обновление пагинации
    console.log(
      `Загрузка завершена. Всего кошельков: ${holders_table.size}, страниц: ${totalPages}`,
    );
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    const loadingRowEl = document.getElementById("loading-row");
    if (loadingRowEl) loadingRowEl.remove();

    // Показываем ошибку
    const tableBody = document.getElementById("tableinsert");
    const errorRow = document.createElement("tr");
    const errorCell = document.createElement("td");
    errorCell.colSpan = 3;
    errorCell.textContent =
      "Ошибка загрузки данных. Пожалуйста, обновите страницу.";
    errorCell.style.textAlign = "center";
    errorCell.style.color = "red";
    errorRow.appendChild(errorCell);
    tableBody.appendChild(errorRow);
  }
};


  // Инициализация
document.addEventListener("DOMContentLoaded", () => {
  // ... существующие обработчики языка ...

  // Добавляем обработчики для кнопок пагинации
  const paginationContainer = document.querySelector(".pagination");
  if (paginationContainer) {
    const prevButton = paginationContainer.querySelector(
      ".page-item:first-child",
    );
    const nextButton = paginationContainer.querySelector(
      ".page-item:last-child",
    );

    if (prevButton) {
      prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
          goToPage(currentPage - 1);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
          goToPage(currentPage + 1);
        }
      });
    }
  }

  // Загрузка данных
  fetchData();
});
let cls_pop = document.getElementById("cls_pop")
let wallet_card = document.getElementById("wallet_card")
cls_pop.addEventListener("click", () => {
  wallet_card.style.display = "none"
  document.getElementById('overlay').style.display = 'none';
  document.body.classList.remove('body-lock');

  
})
const tableBody = document.getElementById('tableinsert');

tableBody.addEventListener('click', function(event) {
    const tr = event.target.closest('tr');
    if (tr) {

        const cells = tr.getElementsByTagName('th');
        const rowData = {
            index: cells[0].innerText,
            link: cells[1].getElementsByTagName('a')[0]?.href,
            supply: cells[2].innerText
        };
        let index = rowData.index
        let link = rowData.link
        let supply = rowData.supply
        CreatePopUp(index,link,supply)
    }
});
    

async function CreatePopUp(index,link,supply) {
  

    const preloader = document.getElementById('table-preloader');
  const table = document.querySelector('.table-container table');
  preloader.classList.remove('hidden');
  table.classList.remove('loaded');
  let wall_type = document.getElementById("wall_type")
    let usernms = document.getElementById("usernames")
    let nmbrs = document.getElementById("anons")
    let balance = document.getElementById("balance")
    let ind = document.getElementById("index")
    let lin = document.getElementById("wallet")
    let supl = document.getElementById("supl")
    let swap_balance=document.getElementById("swap_balance")
    
    ind.textContent = index
    wallet = link.replace("https://tonviewer.com/","")
    lin.textContent = wallet
    supl.textContent = supply
    const holderInfo = await GetHolderInfo(wallet);
    if(holderInfo.is_wallet || (holderInfo.interfaces && holderInfo.interfaces.some(intf => intf.includes("wallet")))){  
          wallet_card.style.display = "block"
            const body = document.body;
            document.getElementById('overlay').style.display = 'block';
            document.body.classList.add('body-lock');
            wall_type.textContent = holderInfo.interfaces[0];
        balance.textContent = holderInfo.balance / 10**ton_dec;
    wall_type.textContent=holderInfo.interfaces[0]
    balance.textContent = holderInfo.balance / 10**ton_dec
    
    GetTgUsernames(wallet).then(data => {
      let usrnms = ""
      if (data.nft_items.length !== 0){
        data.nft_items.forEach(el=>{
          usrnms+=el.dns
          usrnms +=", "
        })
      }else{
        usrnms = "нету юзернеймов"
      }
      usernms.textContent = usrnms
      usernms = ""
    })
    GetAnonNumbers(wallet).then(data => {
      let anons = ""
      if (data.nft_items.length !== 0){
        data.nft_items.forEach(el=>{
          anons+=el.metadata.name
          anons +=", "
        })
      }else{
        anons = "нету номеров"
      }
      nmbrs.textContent = anons 
      anons = ""
    })
      amount = holdersData.addresses[index].balance 
      console.log(holdersData);
    GetStonData(contract, String(amount))
  .then(result => {
    if (result === "error") {
      console.log("Нет пула на STON.fi, пробуем DeDust...");
      GetDeDustData(contract,amount)
      .then(data => {
        swap_balance.textContent = (data[0][0].amountOut / 10 ** 9).toFixed(2);
      })
    } else {
      swap_balance.textContent = (result.ask_units / 10 ** 9).toFixed(2);

    }
  })

    const data = await GetJettonTrans(wallet);
      let operations = data.operations
          let operationsWithJettonsHash = []
          abc123 = contract_id
          operations.forEach((el)=>{
        if ((el.jetton.address === contract_id && operationsWithJettonsHash.length < 7) ){
          operationsWithJettonsHash.push(el.transaction_hash)
        } 
      }
    )
      PopUpTable.clear();
      console.log(operationsWithJettonsHash)
      if (operationsWithJettonsHash.length === 0) {
        preloader.classList.add("hidden");
        console.log("Ничего не нашлось");
      }
      for (const hash of operationsWithJettonsHash) {
      const trData = await GetUserTrancsations(hash);
      let id
      let type
      let ton
      let jettton
        try {
          if ('JettonTransfer' in trData.actions[0] || 'JettonSwap' in trData.actions[0]) {
            if ('JettonTransfer' in trData.actions[0]) {
              id = hash
              type = "Перевод"
              ton = 0
              if (trData.actions[0].JettonTransfer.recipient.address === wallet) {
                jettton = `+${trData.actions[0].JettonTransfer.amount}`
              } else {
                jettton = `-${trData.actions[0].JettonTransfer.amount}`
              }
              PopUpTableLog(id, type, ton, jettton)
            }
            if ('JettonSwap' in trData.actions[0]) {
              if ("ton_out" in trData.actions[0].JettonSwap) {
                id = hash
                type = "Продажа"
                ton = trData.actions[0].JettonSwap.ton_out
                jettton = trData.actions[0].JettonSwap.amount_in
                PopUpTableLog(id, type, ton, jettton)
              } else {
                id = hash
                type = "Покупка"
                ton = trData.actions[0].JettonSwap.ton_in
                jettton = trData.actions[0].JettonSwap.amount_out
                PopUpTableLog(id, type, ton, jettton)
              }
            }
          } else {
          }
        } catch {
          id = hash;
          type = "-"
          ton = "-"
          jettton = "-"
        }
        finally {
    // Скрываем прелоадер после загрузки
    preloader.classList.add('hidden');
          table.classList.add('loaded');
        }
        
          }
          renderPopTable();

        }else{
          alert("Это не кошелек холдера")
        }
        }
      
  async function GetJettonTrans(wallet){
    let responce = await fetch(`https://tonapi.io/v2/accounts/${wallet}/jettons/history?limit=100`)
    let data = await responce.json()
    return data
  }

  async function getContractId(contra) {
    let responce = await fetch(`https://tonapi.io/v2/accounts/${contra}`)
    let data = await responce.json()
    return data
  }

  async function GetUserTrancsations(hash) {
    let responce = await fetch(`https://tonapi.io/v2/events/${hash}`)
    let data = await responce.json()
    return data
  }

  async function GetTgUsernames(wallet) {
    let responce = await fetch(`https://tonapi.io/v2/accounts/${wallet}/nfts?collection=${tg_usernms}&limit=1000&offset=0&indirect_ownership=false`)
    let data = await responce.json()
    return data
  }
  async function GetAnonNumbers(wallet) {
    let responce = await fetch(`https://tonapi.io/v2/accounts/${wallet}/nfts?collection=${anon_numbers}&limit=1000&offset=0&indirect_ownership=false`)
    let data = await responce.json()
    return data
  }
  async  function GetHolderInfo(wallet) {
    let responce = await fetch(`https://tonapi.io/v2/accounts/${wallet}`)
    let data = await responce.json()
    return data
  }

  let PopUpTableLog = (id, type, ton,jetton ) => {
    let amount_ton = ton / 10 ** ton_dec;
    let amount_jetton = jetton / 10 ** dec;
    let trans_id = document.createElement("a");
    let tton = document.createElement("span")
    let jettton = document.createElement("span")
    let ttype = document.createElement("span")
    trans_id.setAttribute("href", `https://tonviewer.com/transaction/${id}`);
    trans_id.textContent = "Транза";
    trans_id.target = '_blank';
    if (type == "Покупка"){
      tton.textContent = amount_ton.toFixed(2)
      tton.className = "red"
      ttype.className = "green"
      ttype.textContent = type
      jettton.className = "green"
      jettton.textContent = amount_jetton.toFixed(2)
    }
    else if(type == "Продажа"){
      ttype.className = "red"
      ttype.textContent = type
      jettton.className = "red"
      jettton.textContent = amount_jetton.toFixed(2)
      tton.textContent = amount_ton.toFixed(2)
      tton.className = "green"
    }
    else if(type == "Перевод"){
      if (jetton > 0){
        jettton.className = "green"
        jettton.textContent = amount_jetton.toFixed(2)
        tton.textContent = amount_ton.toFixed(2)
        ttype.className = "green"
        ttype.textContent = type
      }else{
        jettton.className = "red"
        jettton.textContent = amount_jetton.toFixed(2)
        tton.textContent = amount_ton.toFixed(2)
        ttype.className = "red"
        ttype.textContent = type
      }
    }
      PopUpTable.set(id, {
    trans_id: trans_id,
    type: ttype,
    ton: tton,
    jetton: jettton
      });
  };



function renderPopTable() {
  const table = document.getElementById("sss");

  table.innerHTML = "";
  
  PopUpTable.forEach((value, key) => {
    let table = document.getElementById("sss");
    
    table.innerHTML = "";
     for (let [key, value] of PopUpTable) {
      let row = document.createElement("tr");
      row.setAttribute("class","gtr")
      row.setAttribute("style", "opacity: 1; transform: translateY(0px); transition: opacity 0.5s, transform 0.5s;")
      
      let txn_id = document.createElement("th");
      txn_id.appendChild(value.trans_id)
      row.appendChild(txn_id)

      let txn_type = document.createElement("th");
      txn_type.appendChild(value.type)
      row.appendChild(txn_type)

      let txn_ton = document.createElement("th");
      txn_ton.appendChild(value.ton)
      row.appendChild(txn_ton)

      let txn_jetton = document.createElement("th");
      txn_jetton.appendChild(value.jetton)
      row.appendChild(txn_jetton)

      table.appendChild(row)
    }
  });
}
 



async function GetStonData(contract, amount) {
  const rpcUrl = "https://rpc.ston.fi/";
  const requestPayload = {
    jsonrpc: "2.0",
    id: 8,
    method: "dex.simulate_swap",
    params: {
      offer_address: contract,
      offer_units: String(amount),
      ask_address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
      slippage_tolerance: "0.01"
    }
  };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload)
  });

  const data = await response.json();

  // Если есть ошибка в ответе (но HTTP статус 200)
  if (data.error) {
    // Проверяем код ошибки 1010 (нет пула ликвидности)
      return "error"; // Возвращаем просто код ошибки
    
    // Для других ошибок бросаем исключение
    throw new Error(data.error.message || 'Unknown STON.fi error');
  }

  // Если ошибок нет - возвращаем результат напрямую
  return data.result;
}


  async function GetDeDustData(contract,amount) {
  const cntId = await getContractId(contract).then(data=>{
  return data.address
})
   const url = 'https://old-api.dedust.io/v2/routing/plan';
  
  const requestData = {
    from: `jetton:${cntId}`,
    to: "native",
    amount: String(amount)
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
              'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}


            const ctx = document
              .getElementById("myBubbleChart")
              .getContext("2d");

            // Плагин для фона
            const backgroundPlugin = {
              id: "custom_canvas_background_color",
              beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "#8a2be2";
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
              },
            };

            // Плагин для рисования линий между пузырьками
            const linePlugin = {
              id: "lineConnector",
              afterDatasetsDraw: (chart) => {
                const { ctx, data, chartArea } = chart;
                const { top, bottom, left, right } = chartArea;

                // Координаты пузырьков
                const points = [];
                const dataset = data.datasets[0];

                // Получаем позиции каждого пузырька
                dataset.data.forEach((item, index) => {
                  const x = chart.scales.x.getPixelForValue(item.x);
                  const y = chart.scales.y.getPixelForValue(item.y);
                  points.push({ x, y, radius: item.r });
                });

                // Рисуем линии между точками
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
                ctx.lineWidth = 2;

                // Пример: соединяем точки по порядку
                for (let i = 0; i < points.length - 1; i++) {
                  ctx.beginPath();
                  ctx.moveTo(points[i].x, points[i].y);
                  ctx.lineTo(points[i + 1].x, points[i + 1].y);
                  ctx.stroke();
                }

                // Или соединяем конкретные пары (например, 0-1, 0-2)
                // ctx.beginPath();
                // ctx.moveTo(points[0].x, points[0].y);
                // ctx.lineTo(points[1].x, points[1].y);
                // ctx.stroke();
                //
                // ctx.beginPath();
                // ctx.moveTo(points[0].x, points[0].y);
                // ctx.lineTo(points[2].x, points[2].y);
                // ctx.stroke();

                ctx.restore();
              },
            };

            const data = {
              datasets: [
                {
                  label: "sosal",
                  data: [
                    loddBubbleData()
                  ],
                  backgroundColor: "rgb(0, 255, 0)",
                  borderColor: "rgb(0, 255, 0)",
                },
              ],
            };

            const config = {
              type: "bubble",
              data: data,
              plugins: [backgroundPlugin, linePlugin], // Добавляем оба плагина
              options: {
                responsive: true,
                scales: {
                  x: {
                    title: { display: false },
                    min: 0,
                    max: 40,
                  },
                  y: {
                    title: { display: false },
                    min: 0,
                    max: 40,
                  },
                },
              },
            };

            new Chart(ctx, config);

// это перевод где получатель я https://tonviewer.com/transaction/234afdfdb6da8c14a77750cc63214807e154a7914829242d72d7cecbe3372fb6
//{
    //   "operation": "transfer",
    //   "utime": 1703792367,
    //   "lt": 43533701000004,
    //   "transaction_hash": "234afdfdb6da8c14a77750cc63214807e154a7914829242d72d7cecbe3372fb6",
    //   "source": {
    //     "address": "0:92ff44695cf6d130d0f27d2f7bdf5eb88d8317907cd9e4941052e663ed76842c",
    //     "is_scam": false,
    //     "is_wallet": true
    //   },
    //   "destination": {
    //     "address": "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad",
    //     "name": "zxc-sperma.ton",
    //     "is_scam": false,
    //     "is_wallet": true
    //   },
    //   "amount": "1000000000",
    //   "jetton": {
    //     "address": "0:f6eb371de82aa9cfb5b22ca547f31fdc0fa0fbb41ae89ba84a73272ff0bf2157",
    //     "name": "DeFinder Capital",
    //     "symbol": "DFC",
    //     "decimals": 9,
    //     "image": "https://cache.tonapi.io/imgproxy/TENmVD1ZlCwI7F4dyM9k6PPyLzMrd7rZHIAyeom79SA/rs:fill:200:200:1/g:no/aHR0cHM6Ly90YW4tdG91Z2gtc2x1Zy0zNTEubXlwaW5hdGEuY2xvdWQvaXBmcy9RbVhRb2pKVVB2a0dDQ2VSOVF1OFd3bWNaRjFnTERZMjhlcExMaFBZdkR5OFRr.webp",
    //     "verification": "whitelist",
    //     "score": 0
    //   },
    //   "trace_id": "b06081be4efe8b7fae2d404469f6540ef03e2107d26869923f52ff0a1d791127",
    //   "query_id": "",
    //   "payload": {}
// }
    


// это свап https://tonviewer.com/transaction/54b098c4e6cbc039fc4fb5518e67f29806437961d3b729ff9ffea31dcddf5959
//  {
//       "operation": "transfer",
//       "utime": 1760131770,
//       "lt": 62428565000004,
//       "transaction_hash": "54b098c4e6cbc039fc4fb5518e67f29806437961d3b729ff9ffea31dcddf5959",
//       "source": {
//         "address": "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad",
//         "name": "zxc-sperma.ton",
//         "is_scam": false,
//         "is_wallet": true
//       },
//       "destination": {
//         "address": "0:70a4118401bf8d823531a66011020565f02e05ff91ac5f1677769b00d6acd07a",
//         "name": "STON.fi DEX",
//         "is_scam": false,
//         "is_wallet": false
//       },
//       "amount": "3123182281433211",
//       "jetton": {
//         "address": "0:6c4e969dd07aa1fad6733bc2c9a2693ee06c403838d9b9a38b11eff4907b81c7",
//         "name": "ZACKERMANBANK",
//         "symbol": "ZMBANK",
//         "decimals": 9,
//         "image": "https://cache.tonapi.io/imgproxy/Dg712NwkBhOcnsRxNLevRTaEfgUbe4OOX-ozGKC6TcU/rs:fill:200:200:1/g:no/aHR0cDovL3phY2tlcm1hbmJhbmsuY29tL2xvZ28yMDgucG5n.webp",
//         "verification": "whitelist",
//         "score": 0,
//         "description": "Be at the top of the financial chain! The bank makes money - you make money"
//       },
//       "trace_id": "9b93932c0054b621becaa4707a61bb12f5f06c37c8e1905b90cc99cf7c10ca2f",
//       "query_id": "",
//       "payload": {
//         "SumType": "StonfiSwapV2",
//         "OpCode": 1717886506,
//         "Value": {
//           "TokenWallet1": "0:728da3a36bafa9af10eb9e2188cecfa50663673fe9ecbc6c47d57db2e0cdcce6",
//           "RefundAddress": "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad",
//           "ExcessesAddress": "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad",
//           "TxDeadline": 1760132638,
//           "CrossSwapBody": {
//             "MinOut": "6348906922",
//             "Receiver": "0:b2a4b620fec475845372f9cd27755e7c1dda04f96088259e3ccb9f11b66c72ad",
//             "FwdGas": "0",
//             "CustomPayload": null,
//             "RefundFwdGas": "0",
//             "RefundPayload": null,
//             "RefFee": 10,
//             "RefAddress": ""
//           }
//         }
//       }
//     },

// для бабл мапы нужно создать массив кошельков у которых основная эмиссия и проверять их адреса(убирать не кошельки холдеров) на присутствие их адресов в source или destination 