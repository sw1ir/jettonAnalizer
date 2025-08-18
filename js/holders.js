  // Глобальные переменные
  let lang = localStorage.getItem("lang") || "eng";
  let holders_table = new Map();
  let PopUpTable = new Map();
  let contract = localStorage.getItem("contract") || null;
  let real_supply;
  let contract_id
  let dec
  let tg_usernms = "0:80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2"
  let anon_numbers = "0:0e41dc1dc3c9067ed24248580e12b3359818d83dee0304fabcf80845eafafdb2"
  let holdersData
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
      real_supply = supplyData.total_supply / 10 ** dec;
      let holdersResponse = await fetch(`https://tonapi.io/v2/jettons/${contract}/holders`);
      holdersData = await holdersResponse.json();
      
      holdersData.addresses.forEach((el, i) => {
        logHolderPercentage(el, i, real_supply, dec);
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
          
            wall_type.textContent = holderInfo.interfaces[0];
        balance.textContent = holderInfo.balance / 10**dec;
    wall_type.textContent=holderInfo.interfaces[0]
    balance.textContent = holderInfo.balance / 10**dec
    
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
    GetStonData(contract, String(amount))
  .then(result => {
    if (result === 1010) {
      console.log("Нет пула на STON.fi, пробуем DeDust...");
      GetDeDustData(contract,amount)
      .then(data => {
        swap_balance.textContent = data[0][0].amountOut / 10 ** 9;
      })
    } else {
      swap_balance.textContent = result.ask_units / 10 ** 9;

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
    let amount_ton = ton / 10 ** dec;
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
    if (data.error.code === 1010) {
      return 1010; // Возвращаем просто код ошибки
    }
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
