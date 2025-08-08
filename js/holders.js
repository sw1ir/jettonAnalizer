  // Глобальные переменные
  let lang = localStorage.getItem("lang") || "eng";
  let holders_table = new Map();
  let PopUpTable = new Map();
  let contract = localStorage.getItem("contract") || null;
  let real_supply;
  let contract_id
  let tg_usernms = "0:80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2"
  let anon_numbers = "0:0e41dc1dc3c9067ed24248580e12b3359818d83dee0304fabcf80845eafafdb2"
getContractId(contract).then(data=>{
  contract_id = data.address
})
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
      row.setAttribute("class","gtr")
      row.setAttribute("style", "opacity: 1; transform: translateY(0px); transition: opacity 0.5s, transform 0.5s;")
      let idCell = document.createElement("th");
      idCell.textContent = key;
      idCell.setAttribute("class","gth")
      row.appendChild(idCell);

      let walletCell = document.createElement("th");
      walletCell.setAttribute("class","gth")
      let waterfish = document.createElement("img");
      waterfish.setAttribute("src", `../src/${dict[rand]}`);
      waterfish.setAttribute("width", "20");
      waterfish.setAttribute("alt", "emoji");
      walletCell.appendChild(waterfish);
      walletCell.appendChild(value.Кошелек);
      row.appendChild(walletCell);

      let shareCell = document.createElement("th");
      
      shareCell.textContent = value.Доля;
      shareCell.setAttribute("class","gth")
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
    let wall_type = document.getElementById("wall_type")
    let usernms = document.getElementById("usernames")
    let nmbrs = document.getElementById("anons")
    let balance = document.getElementById("balance")
    wallet_card.style.display = "block"
    let ind = document.getElementById("index")
    let lin = document.getElementById("wallet")
    let supl = document.getElementById("supl")
    ind.textContent = index
    wallet = link.replace("https://tonviewer.com/","")
    lin.textContent = wallet
    supl.textContent = supply
    GetTgUsernames(wallet).then(data => {
      let usrnms = ""
      if (data.nft_items.length !== 0){
        data.nft_items.forEach(el=>{
          usrnms+=el.dns
          usrnms +=", "
        })
      }else{
        usrnms = "нету ююзернеймов"
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
    GetHolderInfo(wallet).then(data=>{
      wall_type.textContent=data.interfaces[0]
      balance.textContent = data.balance / 10**9
    })

    const data = await GetJettonTrans(wallet);
      let operations = data.operations
          let operationsWithJettonsHash = []
      operations.forEach((el)=>{
        if ((el.jetton.address === contract_id && operationsWithJettonsHash.length < 7) ){
          operationsWithJettonsHash.push(el.transaction_hash)
        }
      })
      PopUpTable.clear();
      console.log(operationsWithJettonsHash)
      for (const hash of operationsWithJettonsHash) {
      const trData = await GetUserTrancsations(hash);
      let id
      let type
      let ton
      let jettton
            if ('JettonTransfer' in trData.actions[0] || 'JettonSwap' in trData.actions[0]) {
              if ('JettonTransfer' in trData.actions[0]){
                id = hash
                type = "Перевод"
                ton = 0
                if (trData.actions[0].JettonTransfer.sender === wallet){
                  jettton = `+${trData.actions[0].JettonTransfer.amount}`
                }else{
                  jettton = `-${trData.actions[0].JettonTransfer.amount}`
                }
                PopUpTableLog(id,type,ton,jettton)
              }
              if ('JettonSwap' in trData.actions[0]){
                if ("ton_out" in trData.actions[0].JettonSwap){
                  id = hash
                  type = "Продажа"
                  ton = trData.actions[0].JettonSwap.ton_out 
                  jettton = trData.actions[0].JettonSwap.amount_in
                  PopUpTableLog(id,type,ton,jettton)
                }else{
                  id = hash
                  type = "Покупка"
                  ton = trData.actions[0].JettonSwap.ton_in 
                  jettton = trData.actions[0].JettonSwap.amount_out
                  PopUpTableLog(id,type,ton,jettton)
                }
              }
            }else{
            }
          }
          renderPopTable();
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
    let amount_ton = ton / 10 ** 9;
    let amount_jetton = jetton / 10 ** 9;
    let trans_id = document.createElement("a");
    trans_id.setAttribute("href", `https://tonviewer.com/transaction/${id}`);

    trans_id.textContent = "Транза";
    trans_id.target = '_blank';
    
      PopUpTable.set(id, {
    trans_id: trans_id,
    type: type,
    ton: amount_ton,
    jetton: amount_jetton
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
      txn_type.textContent = value.type
      row.appendChild(txn_type)

      let txn_ton = document.createElement("th");
      txn_ton.textContent=value.ton.toFixed(2)
      row.appendChild(txn_ton)

      let txn_jetton = document.createElement("th");
      txn_jetton.textContent = value.jetton.toFixed(2)
      row.appendChild(txn_jetton)

      table.appendChild(row)
    }
  });
}
 





    
   