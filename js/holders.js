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
let allHoldersData = [];  
let holders_array2 = []
 let bubbleArrayHolders = []
let currentPage = 1;
let rowsPerPage = 1000; // будет синхронизироваться с cntRows
let totalPages = 1;
let cnt_shown = document.getElementById("cnt_shown");
cnt_shown.textContent = rowsPerPage;
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
    "0:dae153a74d894bbc32748198cd626e4f5df4a69ad2fa56ce80fc2644b5708d20": 'Dedust',
    "0:d887d0e2d1c4fc4126e71c970d33ab1896940000eae703bb1ab6cecc830777e3": "Mexc",
    "0:1b84c5a8b28c5ea174c98bd4e5c34f4c1233d5bdd25ef63d270ba2baae8d1dd6": "amocucinare-rugger.ton",
    "0:c8b0596f090b2415fe55ef2e0785f1c576992bfde436aeac75efcec3ab1f0fac": "hashtag-on-tele-gram.ton",
    "0:779dcc815138d9500e449c5291e7f12738c23d575b5310000f6a253bd607384e": "STON.fi DEX",
    "0:1cc0180d280b5bb6be317dd0dd40dca22c52c3fc7df570d4bebc18649c8d1d5c": "0:1cc...d1d5c"
    
  };

  // Форматирование чисел
  function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  }

  // Расчет доли владельца
let logHolderPercentage = (element, index, totalSupply, dec) => {
  let balance = element.balance / 10 ** dec;
  let percentage = (balance / totalSupply) * 100;
  let kosh = document.createElement("a");
  kosh.setAttribute("href", `https://tonviewer.com/${element.owner.address}`);
  let name =
    known_addreses[element.owner.address] ||
    (element.owner.name
      ? element.owner.name
      : `${element.owner.address.slice(0, 5)}...${element.owner.address.slice(-5)}`);
  kosh.textContent = name;
  kosh.target = "_blank";
  holders_array2.push({
    koshel: element.owner.address ,
    balans: balance,
    is_wallet: element.owner.is_wallet
  })
  // Сохраняем в Map для таблицы
  holders_table.set(holders_table.size, {
    Кошелек: kosh,
    Доля:
      balance > 0
        ? `${formatNumber(balance.toFixed(2))} (${percentage.toFixed(2)}%)`
        : "0",
  });

  // Сохраняем данные о балансе в отдельный массив по индексу
  allHoldersData[index] = {
    address: element.owner.address,
    balance: element.balance,
    owner: element.owner,
  };
};
  // Получение локализованных текстов
  function getLocalizedTexts() {
    if (lang === "eng") {
      return {
        wall: "Wallet",
        supl: "share"
      };
    } else {
      return {
        wall: "Кошелек",
        supl: "Доля"
      };
    }
}
  
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function findBubles() {
  // Ждем, пока holders_table заполнится
  let buuble_array = [];
  while (holders_array2.length === 0 && allHoldersData.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (let i = 0; i < 50; i++) {
    if ((holders_array2[i].koshel in known_addreses) || (holders_array2[i].is_wallet === false)) {
      continue;
    } else {
      bubbleArrayHolders.push(holders_array2[i]);
    }
  }
  let operationns = {};

  while (bubbleArrayHolders.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  for (let i = 0; i < bubbleArrayHolders.length; i++) {
    await wait(1500);
    let traks = await GetJettonTrans(bubbleArrayHolders[i].koshel);
    operationns[bubbleArrayHolders[i].koshel] = traks;

    console.log(bubbleArrayHolders)
  }
  console.log(operationns);
  console.log(operationns.length);

}

findBubles(); 
  // Обновление интерфейса
  function updateUI() {
    let {  wall, supl } = getLocalizedTexts();
    
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
  cnt_shown.textContent = 250
  currentPage = 1; // Сбрасываем на первую страницу
  renderTable(); // renderTable вызовет updatePagination()
});

cntRow2.addEventListener("click", () => {
  rowsPerPage = 500;
  cntRow2.className += " active";
  cntRow1.classList.remove("active");
  cntRow3.classList.remove("active");
  cnt_shown.textContent = 500;
  currentPage = 1;
  renderTable();
});

cntRow3.addEventListener("click", () => {
  rowsPerPage = 1000;
  cntRow3.className += " active";
  cntRow2.classList.remove("active");
  cntRow1.classList.remove("active");
  cnt_shown.textContent = 1000;
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
    
    // Очищаем данные
    holders_table.clear();
    allHoldersData = []; // Очищаем массив данных

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

    let globalIndex = 0;

    while (holders_table.size < supplyData.holders_count) {
      console.log(
        `Загружено: ${holders_table.size}/${supplyData.holders_count}`,
      );

      let holdersResponse = await fetch(
        `https://tonapi.io/v2/jettons/${contract}/holders?limit=${limit}&offset=${offset}`,
      );
      let holdersDataPage = await holdersResponse.json();

      if (holdersDataPage.addresses && holdersDataPage.addresses.length > 0) {
        holdersDataPage.addresses.forEach((el) => {
          logHolderPercentage(el, globalIndex, real_supply, dec);
          globalIndex++;
        });
      }

      offset += limit;

      // Показываем первые 1000 кошельков сразу
      if (holders_table.size >= 1000 || offset >= 10000) {
        const loadingRowEl = document.getElementById("loading-row");
        if (loadingRowEl) loadingRowEl.remove();
        renderTable();
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (offset >= 10000) break;
    }

    const loadingRowEl = document.getElementById("loading-row");
    if (loadingRowEl) loadingRowEl.remove();
    renderTable();
    console.log(`Загрузка завершена. Всего кошельков: ${holders_table.size}`);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
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
    

async function CreatePopUp(index, link, supply) {
  const preloader = document.getElementById("table-preloader");
  const table = document.querySelector(".table-container table");
  preloader.classList.remove("hidden");
  table.classList.remove("loaded");

  let wall_type = document.getElementById("wall_type");
  let usernms = document.getElementById("usernames");
  let nmbrs = document.getElementById("anons");
  let balance = document.getElementById("balance");
  let ind = document.getElementById("index");
  let lin = document.getElementById("wallet");
  let supl = document.getElementById("supl");
  let swap_balance = document.getElementById("swap_balance");

  ind.textContent = index;
  wallet = link.replace("https://tonviewer.com/", "");
  lin.textContent = wallet;
  supl.textContent = supply;

  // ПОЛУЧАЕМ ДАННЫЕ ИЗ allHoldersData ПО ИНДЕКСУ
  const holderData = allHoldersData[parseInt(index)];

  if (!holderData) {
    console.error(`Нет данных для индекса ${index}`);
    preloader.classList.add("hidden");
    table.classList.add("loaded");
    alert("Ошибка: данные о кошельке не найдены");
    return;
  }

  // Используем сохраненный баланс
  const amount = holderData.balance;
  console.log(`Баланс кошелька ${wallet}: ${amount}`);

  const holderInfo = await GetHolderInfo(wallet);

  if (
    holderInfo.is_wallet ||
    (holderInfo.interfaces &&
      holderInfo.interfaces.some((intf) => intf.includes("wallet")))
  ) {
    wallet_card.style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.body.classList.add("body-lock");

    wall_type.textContent = holderInfo.interfaces
      ? holderInfo.interfaces[0]
      : "Unknown";
    balance.textContent = (holderInfo.balance / 10 ** ton_dec).toFixed(2);

    // Получаем Telegram username
    GetTgUsernames(wallet).then((data) => {
      let usrnms = "";
      if (data.nft_items && data.nft_items.length !== 0) {
        data.nft_items.forEach((el) => {
          usrnms += el.dns + ", ";
        });
        usrnms = usrnms.slice(0, -2);
      } else {
        usrnms = "нету юзернеймов";
      }
      usernms.textContent = usrnms;
    });

    // Получаем анонимные номера
    GetAnonNumbers(wallet).then((data) => {
      let anons = "";
      if (data.nft_items && data.nft_items.length !== 0) {
        data.nft_items.forEach((el) => {
          anons += (el.metadata?.name || "Unknown") + ", ";
        });
        anons = anons.slice(0, -2);
      } else {
        anons = "нету номеров";
      }
      nmbrs.textContent = anons;
    });

    // Получаем стоимость в TON
    GetStonData(contract, String(amount))
      .then((result) => {
        if (result === "error") {
          console.log("Нет пула на STON.fi, пробуем DeDust...");
          GetDeDustData(contract, amount)
            .then((data) => {
              if (data && data[0] && data[0][0]) {
                swap_balance.textContent = (
                  data[0][0].amountOut /
                  10 ** 9
                ).toFixed(2);
              } else {
                swap_balance.textContent = "0";
              }
            })
            .catch((err) => {
              console.error("DeDust error:", err);
              swap_balance.textContent = "Ошибка";
            });
        } else if (result && result.ask_units) {
          swap_balance.textContent = (result.ask_units / 10 ** 9).toFixed(2);
        } else {
          swap_balance.textContent = "0";
        }
      })
      .catch((err) => {
        console.error("STON.fi error:", err);
        swap_balance.textContent = "Ошибка";
      });

    // Получаем историю транзакций
    const data = await GetJettonTrans(wallet);
    let operations = data.operations || [];
    let operationsWithJettonsHash = [];

    operations.forEach((el) => {
      if (
        el.jetton &&
        el.jetton.address === contract_id &&
        operationsWithJettonsHash.length < 7
      ) {
        operationsWithJettonsHash.push(el.transaction_hash);
      }
    });

    PopUpTable.clear();
    console.log("Найдено операций:", operationsWithJettonsHash.length);

    if (operationsWithJettonsHash.length === 0) {
      preloader.classList.add("hidden");
      table.classList.add("loaded");
      console.log("Ничего не нашлось");
      renderPopTable();
      return;
    }

    // Обрабатываем каждую транзакцию
    for (const hash of operationsWithJettonsHash) {
      try {
        const trData = await GetUserTrancsations(hash);
        let id, type, ton, jettton;

        if (trData.actions && trData.actions[0]) {
          if ("JettonTransfer" in trData.actions[0]) {
            id = hash;
            type = "Перевод";
            ton = 0;
            if (trData.actions[0].JettonTransfer.recipient.address === wallet) {
              jettton = `+${trData.actions[0].JettonTransfer.amount}`;
            } else {
              jettton = `-${trData.actions[0].JettonTransfer.amount}`;
            }
            PopUpTableLog(id, type, ton, jettton);
          } else if ("JettonSwap" in trData.actions[0]) {
            if ("ton_out" in trData.actions[0].JettonSwap) {
              id = hash;
              type = "Продажа";
              ton = trData.actions[0].JettonSwap.ton_out;
              jettton = trData.actions[0].JettonSwap.amount_in;
              PopUpTableLog(id, type, ton, jettton);
            } else {
              id = hash;
              type = "Покупка";
              ton = trData.actions[0].JettonSwap.ton_in;
              jettton = trData.actions[0].JettonSwap.amount_out;
              PopUpTableLog(id, type, ton, jettton);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка обработки транзакции:", hash, err);
        PopUpTableLog(hash, "-", "-", "-");
      }
    }

    preloader.classList.add("hidden");
    table.classList.add("loaded");
    renderPopTable();
  } else {
    alert("Это не кошелек холдера");
    preloader.classList.add("hidden");
    table.classList.add("loaded");
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

// ============ ФУНКЦИЯ ДЛЯ ПОСТРОЕНИЯ BUBBLE MAP ============

// Глобальная переменная для хранения данных операций
let operationsData = {};

// Функция для создания графика
function initBubbleChart() {
  const canvas = document.getElementById("myBubbleChart");
  if (!canvas) {
    console.error("Canvas элемент myBubbleChart не найден");
    return;
  }

  // Проверяем наличие contract_id
  if (!contract_id) {
    console.log("contract_id еще не загружен, ожидание...");
    setTimeout(initBubbleChart, 500);
    return;
  }

  console.log(`🎯 Фильтруем по contract_id: ${contract_id}`);

  // Проверяем наличие данных operationsData
  if (Object.keys(operationsData).length === 0) {
    console.log("Данные operationsData еще не загружены, ожидание...");
    setTimeout(initBubbleChart, 1000);
    return;
  }

  // Проверяем наличие балансов
  if (bubbleArrayHolders.length === 0) {
    console.log("Данные балансов еще не загружены, ожидание...");
    setTimeout(initBubbleChart, 1000);
    return;
  }

  // Ждем открытия аккордеона
  const checkVisibility = () => {
    if (canvas.offsetParent === null || canvas.offsetWidth === 0) {
      console.log("Canvas скрыт, ожидание открытия аккордеона...");
      setTimeout(checkVisibility, 500);
      return;
    }
    renderBubbleChart();
  };
  
  checkVisibility();
}

// Отрисовка графика
function renderBubbleChart() {
  const canvas = document.getElementById("myBubbleChart");
  const ctx = canvas.getContext("2d");
  
  console.log("🚀 Начинаем создание графика...");
  console.log(`🎯 Используем contract_id для фильтрации: ${contract_id}`);
  console.log(`📊 Загружено кошельков с операциями: ${Object.keys(operationsData).length}`);
  console.log(`💰 Загружено балансов: ${bubbleArrayHolders.length}`);
  
  // Получаем все адреса кошельков, для которых есть операции
  const walletAddressesSet = new Set(Object.keys(operationsData));
  
  // Поиск переводов между кошельками ТОЛЬКО для нужного токена
  let transfersBetweenWallets = [];
  let filteredCount = 0;
  
  for (const [walletAddress, walletData] of Object.entries(operationsData)) {
    if (!walletData?.operations) continue;
    
    walletData.operations.forEach((operation) => {
      const src = operation.source?.address;
      const dest = operation.destination?.address;
      const jettonAddr = operation.jetton?.address;
      
      // Логируем первые несколько операций для отладки
      if (filteredCount < 5 && jettonAddr) {
        console.log(`🔍 Операция: jettonAddr=${jettonAddr}, contract_id=${contract_id}, совпадение=${jettonAddr === contract_id}`);
        filteredCount++;
      }
      
      // Проверяем: оба адреса есть в нашем списке и это нужный токен
      if (src && dest && 
          walletAddressesSet.has(src) && 
          walletAddressesSet.has(dest) &&
          jettonAddr === contract_id) {
        
        transfersBetweenWallets.push({
          from: src,
          to: dest,
          amount: operation.amount,
          time: operation.utime,
          fromName: operation.source?.name || src.substring(0, 15),
          toName: operation.destination?.name || dest.substring(0, 15),
        });
      }
    });
  }
  
  console.log(`💰 Найдено переводов между кошельками для токена ${contract_id}: ${transfersBetweenWallets.length}`);
  
  // Находим все уникальные адреса, которые участвуют в переводах
  const connectedWallets = new Set();
  transfersBetweenWallets.forEach(transfer => {
    connectedWallets.add(transfer.from);
    connectedWallets.add(transfer.to);
  });
  
  console.log(`🔗 Кошельков с переводами: ${connectedWallets.size}`);
  
  if (connectedWallets.size === 0) {
    console.log("Нет связанных кошельков для отображения");
    showNoDataMessage(canvas, "Нет переводов между кошельками для этого токена");
    return;
  }
  
  // Создаем карту балансов только для связанных кошельков
  const balanceMap = new Map();
  bubbleArrayHolders.forEach(item => {
    if (connectedWallets.has(item.koshel)) {
      balanceMap.set(item.koshel, item.balans);
    }
  });
  
  console.log(`📊 Связанных кошельков с балансами: ${balanceMap.size}`);
  
  // Получаем массив связанных кошельков
  const connectedWalletsArray = Array.from(connectedWallets);
  
  if (connectedWalletsArray.length === 0) {
    showNoDataMessage(canvas, "Нет данных для отображения");
    return;
  }
  
  // Создаем позиции для кошельков (распределение по кругу)
  const positions = new Map();
  const centerX = 20;
  const centerY = 20;
  const radius = 15;
  
  // Находим максимальный баланс среди связанных кошельков
  const balancesList = connectedWalletsArray.map(addr => balanceMap.get(addr) || 0);
  const maxBalance = Math.max(...balancesList, 1);
  console.log(`💰 Максимальный баланс среди связанных: ${maxBalance.toLocaleString()}`);
  
  connectedWalletsArray.forEach((address, index) => {
    const angle = (index / connectedWalletsArray.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const balance = balanceMap.get(address) || 0;
    // Размер пузырька: от 5 до 20 в зависимости от баланса
    const scaledRadius = 5 + (balance / maxBalance) * 15;
    
    // Получаем имя кошелька
    let walletName = address.substring(0, 15);
    const transfer = transfersBetweenWallets.find(t => t.from === address || t.to === address);
    if (transfer) {
      if (transfer.from === address && transfer.fromName) walletName = transfer.fromName;
      if (transfer.to === address && transfer.toName) walletName = transfer.toName;
    }
    
    positions.set(address, {
      x: x,
      y: y,
      radius: Math.max(5, Math.min(20, scaledRadius)),
      balance: balance,
      address: address,
      name: walletName
    });
  });
  
  // Создаем данные для пузырьков
  const bubbleData = [];
  for (const [address, pos] of positions) {
    bubbleData.push({
      x: pos.x,
      y: pos.y,
      r: pos.radius,
      address: address,
      name: pos.name,
      balance: pos.balance
    });
  }
  
  // Создаем уникальные связи (без дубликатов)
  const connectionsMap = new Map();
  transfersBetweenWallets.forEach(transfer => {
    const fromPos = positions.get(transfer.from);
    const toPos = positions.get(transfer.to);
    if (fromPos && toPos) {
      const key = `${transfer.from}|${transfer.to}`;
      if (!connectionsMap.has(key)) {
        connectionsMap.set(key, {
          fromX: fromPos.x,
          fromY: fromPos.y,
          toX: toPos.x,
          toY: toPos.y,
        });
      }
    }
  });
  
  const connections = Array.from(connectionsMap.values());
  console.log(`🔗 Уникальных связей: ${connections.length}`);
  
  // Плагин для рисования линий
  const linePlugin = {
    id: "lineConnector",
    afterDatasetsDraw: (chart) => {
      const { ctx, scales } = chart;
      if (connections.length === 0) return;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1.5;
      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(scales.x.getPixelForValue(conn.fromX), scales.y.getPixelForValue(conn.fromY));
        ctx.lineTo(scales.x.getPixelForValue(conn.toX), scales.y.getPixelForValue(conn.toY));
        ctx.stroke();
      });
      ctx.restore();
    },
  };
  
  // Плагин для фона
  const backgroundPlugin = {
    id: "custom_canvas_background_color",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };
  
  // Уничтожаем старый график если есть
  let existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();
  
  // Создаем новый график
  const config = {
    type: "bubble",
    data: {
      datasets: [{
        label: `Связанные кошельки (${bubbleData.length})`,
        data: bubbleData,
        backgroundColor: (context) => {
          const value = context.raw.balance;
          if (value > 100000000) return "rgba(255, 99, 132, 0.8)";
          if (value > 50000000) return "rgba(255, 159, 64, 0.8)";
          if (value > 10000000) return "rgba(255, 205, 86, 0.8)";
          if (value > 1000000) return "rgba(75, 192, 192, 0.8)";
          return "rgba(54, 162, 235, 0.8)";
        },
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
      }]
    },
    plugins: [backgroundPlugin, linePlugin],
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        tooltip: {
  callbacks: {
    label: (context) => {
      const point = context.raw;
      const balanceFormatted = point.balance.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return [
        `Кошелек: ${point.name}`,
        `Баланс: ${balanceFormatted}`,
        `Адрес: ${point.address.substring(0, 20)}...`
      ];
    }
  }
},
        legend: {
          display: true,
          position: 'top',
          labels: { 
            color: '#fff', 
            font: { size: 12 }
          }
        }
      },
      scales: {
        x: { 
          min: 0, 
          max: 40, 
          grid: { color: "rgba(255, 255, 255, 0.1)" }, 
          ticks: { display: false } 
        },
        y: { 
          min: 0, 
          max: 40, 
          grid: { color: "rgba(255, 255, 255, 0.1)" }, 
          ticks: { display: false } 
        }
      },
      elements: { 
        point: { 
          hoverRadius: 12, 
          hoverBorderWidth: 3 
        } 
      }
    }
  };
  
  new Chart(ctx, config);
  console.log(`✅ График успешно создан! Показано ${bubbleData.length} связанных кошельков из ${connectedWallets.size}`);
}

// Функция для отображения сообщения при отсутствии данных
function showNoDataMessage(canvas, message) {
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth || 800;
  canvas.height = canvas.offsetHeight || 500;
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// Функция для запуска графика (вызывать после загрузки данных)
function startBubbleChart() {
  console.log("🚀 Запуск Bubble Chart...");
  console.log(`contract_id: ${contract_id}`);
  console.log(`operationsData: ${Object.keys(operationsData).length} кошельков`);
  console.log(`bubbleArrayHolders: ${bubbleArrayHolders.length} кошельков`);
  
  if (!contract_id) {
    console.log("⏳ contract_id еще не загружен, ожидание...");
    setTimeout(startBubbleChart, 1000);
    return;
  }
  
  if (Object.keys(operationsData).length > 0 && bubbleArrayHolders.length > 0) {
    initBubbleChart();
  } else {
    console.log("⏳ Данные не готовы, ожидание...");
    setTimeout(startBubbleChart, 2000);
  }
}

// ============ ИСПРАВЛЕННАЯ ФУНКЦИЯ findBubles ============
async function findBubles() {
  // Ждем, пока contract_id загрузится (ВАЖНО!)
  let waitCount = 0;
  while (!contract_id && waitCount < 30) {
    console.log(`⏳ Ожидание загрузки contract_id... (${waitCount + 1}/30)`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    waitCount++;
  }
  
  if (!contract_id) {
    console.error("❌ contract_id не загружен после 30 секунд ожидания!");
    const canvas = document.getElementById("myBubbleChart");
    if (canvas) {
      showNoDataMessage(canvas, "Ошибка: не удалось загрузить contract_id");
    }
    return;
  }
  
  console.log(`✅ contract_id загружен: ${contract_id}`);
  
  // Ждем, пока holders_array2 заполнится
  while (holders_array2.length === 0 && allHoldersData.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Отбираем только кошельки (is_wallet: true) и не из known_addreses
  for (let i = 0; i < holders_array2.length; i++) {
    const holder = holders_array2[i];
    const isWallet = holder.is_wallet === true;
    const isKnown = holder.koshel in known_addreses;
    
    if (isWallet && !isKnown) {
      bubbleArrayHolders.push(holder);
    }
  }
  
  // Ограничиваем количество для анализа
  bubbleArrayHolders = bubbleArrayHolders.slice(0, 45);
  console.log(`📊 Отобрано кошельков для анализа: ${bubbleArrayHolders.length}`);
  
  // Загружаем операции для каждого кошелька
  for (let i = 0; i < bubbleArrayHolders.length; i++) {
    const wallet = bubbleArrayHolders[i];
    console.log(`🔄 Загрузка операций для ${wallet.koshel.substring(0, 20)}... (${i + 1}/${bubbleArrayHolders.length})`);
    
    // Добавляем задержку между запросами
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    try {
      const response = await fetch(`https://tonapi.io/v2/accounts/${wallet.koshel}/jettons/history?limit=100`);
      
      if (response.status === 429) {
        console.log(`⚠️ Rate limit, ждем 3 секунды...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        i--; // повторяем попытку
        continue;
      }
      
      const data = await response.json();
      
      if (data && !data.error) {
        operationsData[wallet.koshel] = data;
        console.log(`✅ Загружено (${Object.keys(operationsData).length}/${bubbleArrayHolders.length})`);
      } else {
        console.log(`❌ Ошибка или нет данных для ${wallet.koshel.substring(0, 20)}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка загрузки для ${wallet.koshel.substring(0, 20)}:`, error);
    }
  }
  
  console.log(`📊 Загружено операций для ${Object.keys(operationsData).length} кошельков из ${bubbleArrayHolders.length}`);
  console.log(`🎯 Финальный contract_id: ${contract_id}`);
  
  // ВАЖНО: ЗАПУСКАЕМ ГРАФИК ПОСЛЕ ЗАГРУЗКИ ВСЕХ ДАННЫХ
  if (Object.keys(operationsData).length > 0) {
    console.log("🎯 Все данные загружены, запускаем график!");
    startBubbleChart();
  } else {
    console.error("❌ Не удалось загрузить данные ни для одного кошелька");
    const canvas = document.getElementById("myBubbleChart");
    if (canvas) {
      showNoDataMessage(canvas, "Не удалось загрузить данные. Попробуйте позже.");
    }
  }
}