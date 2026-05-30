
let lingvistic = new Map([["price chart","График цены"],["holders","Держатели"],["price","Цена"],["mcap","Капитализация"],["Lock","Заблокировано"],["burned","Соженно"],["safety","Безопасность"],["liquidity","Ликвидность"],["trancsations","Транкзации"],["total_supply","Эмиссия"],["left","Левые"],["old with afk","Отлега"], ["socials","соц. сети"]])
let engbtn = document.getElementById("eng_btn")
let rusbtn = document.getElementById("rus_btn")
let price_chart = document.getElementById("price_chart")
let hldrs = document.getElementById("hldrs")
let pric = document.getElementById("pric")
let mmmcap = document.getElementById("mmmcap")
let loock = document.getElementById("loock")
let burn_enjer = document.getElementById("burn_enjer")
let safe = document.getElementById("safe")
let luqid = document.getElementById("liquid")
let trancsations = document.getElementById("trancsation")
let suplyy = document.getElementById("suplayy")
let left = document.getElementById("left")
let otlega = document.getElementById("otlega")
let soc_txt = document.getElementById("soc_txt")

function getSafetyColor(percent) {
    if (percent < 20) {
        return {
            text: '#ff4444',
            gradient: 'linear-gradient(135deg, #ff4444, #cc0000)',
            bg: 'rgba(255, 68, 68, 0.15)'
        };
    } else if (percent < 40) {
        return {
            text: '#ff8844',
            gradient: 'linear-gradient(135deg, #ff8844, #ff5500)',
            bg: 'rgba(255, 136, 68, 0.15)'
        };
    } else if (percent < 60) {
        return {
            text: '#ffdd44',
            gradient: 'linear-gradient(135deg, #ffdd44, #ffaa00)',
            bg: 'rgba(255, 221, 68, 0.15)'
        };
    } else if (percent < 80) {
        return {
            text: '#88ff44',
            gradient: 'linear-gradient(135deg, #88ff44, #55cc00)',
            bg: 'rgba(136, 255, 68, 0.15)'
        };
    } else {
        return {
            text: '#44ff88',
            gradient: 'linear-gradient(135deg, #44ff88, #00cc55)',
            bg: 'rgba(68, 255, 136, 0.15)'
        };
    }
}


function chg_lng(){
if(localStorage.getItem("lang")=="eng"){
  engbtn.removeAttribute("class")
engbtn.setAttribute("class","btn btn-success")
rusbtn.removeAttribute("class")
rusbtn.setAttribute("class","btn btn-outline-success")
price_chart.textContent = "price chart"
hldrs.textContent = "holders"
pric.textContent = "price"
mmmcap.textContent = "mcap"
loock.textContent = "Lock"
burn_enjer.textContent = "burned"
safe.textContent = "safety"
luqid.textContent = "liquidity"
trancsations.textContent="trancsations"
suplyy.textContent="total_supply"
left.textContent = "left"
otlega.textContent = "old with afk" 
soc_txt.textContent=" socials"   
}
if(localStorage.getItem("lang")=="rus"){
rusbtn.removeAttribute("class")
rusbtn.setAttribute("class","btn btn-success")
    engbtn.removeAttribute("class")
    engbtn.setAttribute("class","btn btn-outline-success")
    price_chart.textContent = lingvistic.get("price chart");
    hldrs.textContent = lingvistic.get("holders");
    pric.textContent = lingvistic.get("price");
    mmmcap.textContent = lingvistic.get("mcap");
    loock.textContent = lingvistic.get("Lock");
    burn_enjer.textContent = lingvistic.get("burned");
    safe.textContent = lingvistic.get("safety");
    luqid.textContent = lingvistic.get("liquidity")
    trancsations.textContent= lingvistic.get("trancsations")
    suplyy.textContent=lingvistic.get("total_supply")
    left.textContent = lingvistic.get("left");
    otlega.textContent = lingvistic.get("old with afk");
    soc_txt.textContent = lingvistic.get("socials");
    }
    }
    function initLanguage() {
  chg_lng();
}
    engbtn.addEventListener("click", function(){
      language="eng"
      localStorage.removeItem("lang")
      localStorage.setItem("lang", language);
      chg_lng()
    })
    
    rusbtn.addEventListener("click", function(){
      language = "rus"
      localStorage.removeItem("lang")
      localStorage.setItem("lang", language);
      chg_lng()
    })

      document.addEventListener("DOMContentLoaded", initLanguage);

      let contract = null;
      if (localStorage.getItem("contract")) {
        contract = localStorage.getItem("contract");
      }
      //основная инфа по монете
    async function getJettonInfo(){
        let responce = await fetch(`https://tonapi.io/v2/jettons/${contract}`)
        let data = await responce.json()
        return data
    }
        let buy_volume = document.getElementById("buy-volume")
        let sell_volume = document.getElementById("sell-volume")
        let likva = document.getElementById("liquidity")

      //запрос к гекотерминалу
    async function getGeckoData(){
        const poolResponse = await fetch(`https://api.geckoterminal.com/api/v2/search/pools?query=${contract}&page=1`);
        if (!poolResponse.ok) throw new Error('Ошибка при получении пула');
        const poolData = await poolResponse.json();
        
        const pool = poolData.data[0].attributes.address;
        let responce = await fetch(`https://api.geckoterminal.com/api/v2/networks/ton/pools/${pool}`)
        let geckoData = await responce.json()
        return geckoData
    }
        //инфа с декскринера
    getGeckoData().then(geckoData =>{
        let liquidity = geckoData.data.attributes.reserve_in_usd
        let buyValue = geckoData.data.attributes.transactions.h24.buys;
        let sellValue = geckoData.data.attributes.transactions.h24.sells;
        let all_trans = buyValue + sellValue
        let buy_perc = (buyValue/all_trans) * 100
        let sell_perc = (sellValue/all_trans) * 100

        let price =  geckoData.data.attributes.base_token_price_usd
        price = parseFloat(price);
        price = price.toFixed(8)
        let fdv = geckoData.data.attributes.fdv_usd
        let mcapImg = document.getElementById("mcapImg")
        let priceChange = geckoData.data.attributes.price_change_percentage.h24
        let chartImg = document.getElementById("chartImg")
        document.getElementById("price").textContent = `${price}$`;
        document.getElementById("mcap").textContent = `${formatNumber(fdv)}$`;
        buy_volume.setAttribute("style" , `width: ${buy_perc}%;`)
        sell_volume.setAttribute("style" , `width: ${sell_perc}%;`)
        buys.textContent = buyValue
        sells.textContent = sellValue
        likva.textContent = `${formatNumber(liquidity)} $`
        if (priceChange > 0){
          chartImg.src = "../src/chart_up.gif"
          mcapImg.src = "../src/mcap.gif"
        }else{
          chartImg.src = "../src/chart_down.gif"
          mcapImg.src = "../src/chart_down.gif"
          }

          window.currentLiquidityUSD = liquidity;
          window.buyVolume24h = buyValue;
          window.sellVolume24h = sellValue;
    })
      function formatNumber(num) {
        if (num >= 1000000000) {
          return (num / 1000000000).toFixed(2) + "B";
        }
        if (num >= 1000000) {
          return (num / 1000000).toFixed(2) + "M";
        }
        if (num >= 1000) {
          return (num / 1000).toFixed(2) + "K";
        }
        return num.toString();
      }
      async function getLockData(){
        let responce = await fetch(`https://api.tonraffles.app/api/v2/lock/${contract}`)
        let data = await responce.json()
        console.log(data)
        return data.totalLockedTokens
      }
      
// Инициализация графика
const chartElement = document.getElementById('candleChart');
const chart = LightweightCharts.createChart(chartElement, {
    layout: {
        background: { color: '#1e1e2e' },
        textColor: '#a1a1aa',
    },
    grid: {
        vertLines: { color: '#2d2d3d' },
        horzLines: { color: '#2d2d3d' },
    },
    width: chartElement.clientWidth,
    height: 250,
    timeScale: {
        timeVisible: true,
        rightOffset: 6,
    },
    
});

// Обработчик изменения размера
function handleResize() {
    chart.applyOptions({ 
        width: chartElement.clientWidth,
        height: chartElement.clientHeight
    });
}
window.addEventListener('resize', handleResize);
handleResize();

// Добавление свечной серии
const candleSeries = chart.addCandlestickSeries({
    upColor: '#00FF00',
    downColor: '#FF0000',
    borderDownColor: '#FF0000',
    borderUpColor: '#00FF00',
    wickDownColor: '#FF0000',
    wickUpColor: '#00FF00',
});

// Основная функция загрузки данных
async function loadChartData() {
    try {
        // 1. Получаем адрес пула
        const poolResponse = await fetch(`https://api.geckoterminal.com/api/v2/search/pools?query=${contract}&page=1`);
        if (!poolResponse.ok) throw new Error('Ошибка при получении пула');
        const poolData = await poolResponse.json();
        
        const pool = poolData.data[0].attributes.address;
        
        // 2. Получаем данные OHLCV
        const ohlcvResponse = await fetch(`https://api.geckoterminal.com/api/v2/networks/ton/pools/${pool}/ohlcv/minute?aggregate=5&currency=usd&limit=1000`);
        if (!ohlcvResponse.ok) throw new Error('Ошибка при получении данных графика');
        const ohlcvData = await ohlcvResponse.json();
        // 4. Обработка данных
        const ohlcvList = ohlcvData.data?.attributes?.ohlcv_list || [];
        if (ohlcvList.length === 0) throw new Error('Нет данных для отображения');

        const chartData = ohlcvList
            .map(i => ({
                time: i[0],
                open: i[1],
                high: i[2],
                low: i[3],
                close: i[4]
            }))
            .filter(i => [i.time, i.open, i.high, i.low, i.close].every(
                val => val !== null && !isNaN(val)
            ))
            .sort((a, b) => a.time - b.time);

        if (chartData.length === 0) throw new Error('Все данные некорректны');

        // 5. Настройка и отображение графика
        chart.applyOptions({
            localization: {
                priceFormatter: price => price.toFixed(8)
            },
        });
        
        candleSeries.setData(chartData);
        
    } catch (error) {
        console.error('Ошибка:', error);
        // Здесь можно добавить уведомление для пользователя
        chartElement.innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

// Запускаем загрузку данных
loadChartData();
    //async burn
      async function getBurnInfo(){
        let responce = await fetch(`https://tonapi.io/v2/accounts/UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ/jettons/${contract}?currencies=ton,usd,rub&supported_extensions=custom_payload`)
        let responce2 = await fetch(`https://tonapi.io/v2/accounts/UQDYzZmfsrGzhObKJUw4gzdeIxEai3jAFbiGKGwxvxHinf4K/jettons/${contract}?currencies=ton,usd,rub&supported_extensions=custom_payload`);
        let data = await responce.json() 
        let data2 = await responce2.json()
        return Number(data.balance) + Number(data2.balance);
    }
        //lock async vivod
        lock = document.getElementById("lock");
        getLockData().then( data => {
          window.lockedTokensCount = data / 10**9;
          lock.textContent = formatNumber( data/ 10 ** 9);

        })
        //основная инфа о монете
    getJettonInfo().then(data =>{

       //async burn
      let burn = document.getElementById("burn");
      
    getBurnInfo().then(burned_amount => {
        burn.textContent = formatNumber(burned_amount / 10 ** 9);
         window.burnedAmount = burned_amount / 10 ** 9;
      let supply = data.total_supply;
      console.log(supply);
      console.log(data.total_supply)
      real_supply = supply / 10 ** 9;
      console.log(real_supply)
        let img = data.metadata.image;
        document.getElementById("logo").src = img;
        let name = data.metadata.name;
        let simbol = data.metadata.symbol;
        let token = name + "($" + simbol + ")";
        document.getElementById("token_name").innerHTML = token;
        let holders = data.holders_count;
        document.getElementById("holders").innerHTML = holders;
        window.holdersCount = holders;
        document.getElementById("description").innerHTML =data.metadata.description;
      let emision = document.getElementById("total_suplly");
      
        if (isNaN(burned_amount)){
          emision.textContent = formatNumber(real_supply)
        }else{
          emision.textContent = formatNumber(real_supply-(burned_amount/ 10 ** 9))
        }
        })
        let socials = data.metadata.social
        let sites = data.metadata.websites
        
        
        button = document.getElementById("socials")
        let soc_drp = document.getElementById("socials_drop")
      if (socials === undefined || sites === undefined ){
        button.style.display ="none"          
      }else{
        if (socials.length >0 || sites.length >0){
          window.hasSocials = socials.length > 0;
          window.hasWebsite = sites.length > 0;
          button.disabled = false
          if (socials.length >0){
            let soc_img = new Map([["t.me","../src/teleg.png"],["discord.gg","../src/discord.png"],
            ["twitter.com","../src/twitter.png"],["instagram.com","../src/instagram.png"],
            ["dexscreener.com","../src/dexscreener.png"],["app.ston.fi","../src/stonfi.png"]])
            // текст к соцсетям
            let soc_txt = new Map([["t.me","tg"],["discord.gg","disc."],
            ["twitter.com","X"],["instagram.com","Insta"],
            ["dexscreener.com","dex"],["app.ston.fi","ston  "],["app.ston.fi","ston  "]])
            socials.forEach(element => {
              for (let [key , value] of soc_img){
                if (element.includes(key)) {
                  let newDiv = document.createElement("div")
                  let newImg = document.createElement("img")
                  newImg.setAttribute("class","soc_img")
                  newImg.src = value
                  let newA = document.createElement("a")
                  newA.href = element
                  newA.setAttribute("target","_blank")
                  newA.textContent = soc_txt.get(key)
                  newDiv.appendChild(newImg)
                  newDiv.appendChild(newA)
                  
                  soc_drp.appendChild(newDiv)
                }
              }
            });
          }
          if (sites.length >0){
            sites.forEach(element => {
              var newDiv = document.createElement("div")
              var newImg = document.createElement("img")
              newImg.setAttribute("class","soc_img")
              newImg.src = "../src/site.png"
              let newA = document.createElement("a")
              newA.href = element
              newA.setAttribute("target","_blank")
              newA.textContent = "site"
              newDiv.appendChild(newImg)
              newDiv.appendChild(newA)
              
              soc_drp.appendChild(newDiv)
            })
        }
        else{
          button.style.display ="none"            
        }
    }
  }
    })
  
      function back(){
        let path = document.getElementById("copy");
        path.setAttribute("d","M104.6 48L64 48C28.7 48 0 76.7 0 112L0 384c0 35.3 28.7 64 64 64l96 0 0-48-96 0c-8.8 0-16-7.2-16-16l0-272c0-8.8 7.2-16 16-16l16 0c0 17.7 14.3 32 32 32l72.4 0C202 108.4 227.6 96 256 96l62 0c-7.1-27.6-32.2-48-62-48l-40.6 0C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L464 243.9 464 448c0 8.8-7.2 16-16 16zM256 512l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1L256 128c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64z")
      }
      document.querySelector("#copy_ca").addEventListener("click", () => {
        navigator.clipboard
          .writeText(contract)
          .then(() => {
            let path = document.getElementById("copy");
            path.setAttribute(
              "d",
              "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
            );
          })
          
          .catch((error) => {
            let path = document.getElementById("copy");
            path.setAttribute(
              "d",
              "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            );
          });
          setTimeout(back , 5000)
      });
      ca = document.getElementById("ca").innerHTML = `${contract.slice(
        0,
        5
      )}...${contract.slice(-5)}`;
      document.querySelector("#socials").addEventListener("click" , () => {
      let socials_drop = document.getElementById("socials_drop")
      if (socials_drop.style.display === "inline-block"){
        socials_drop.style.display ="none"
      }else{
        socials_drop.style.display ="inline-block"
      }
      })
// ========== РАСШИРЕННЫЙ РАСЧЁТ БЕЗОПАСНОСТИ (СКРЫТЫЕ БОНУСЫ) ==========

async function getTop10HoldersShare() {
    if (!contract) return 0;
    try {
        const response = await fetch(`https://tonapi.io/v2/jettons/${contract}/holders?limit=10&offset=0`);
        const data = await response.json();
        if (!data.addresses) return 0;
        
        let top10Balance = 0;
        data.addresses.forEach(holder => {
            top10Balance += holder.balance / 10**9;
        });
        
        return top10Balance;
    } catch (error) {
        console.error('Ошибка топ-10:', error);
        return 0;
    }
}


    
async function updateSafety() {
    if (!window.real_supply) {
        setTimeout(updateSafety, 500);
        return;
    }
    
    // ===== 1. Данные =====
    const totalSupply = window.real_supply;
    const liquidity = window.currentLiquidityUSD || 0;
    const lockedTokens = window.lockedTokensCount || 0;
    const buyVol = window.buyVolume24h || 0;
    const sellVol = window.sellVolume24h || 0;
    const totalVolume = buyVol + sellVol;
    const burnedAmount = window.burnedAmount || 0;
    const holdersCount = window.holdersCount || 0;
    const hasSocials = window.hasSocials || false;
    const hasWebsite = window.hasWebsite || false;
    
    // ===== 2. Штрафы по 4 факторам (в сумме не более 90) =====
    const top10BalanceRaw = await getTop10HoldersShare();
    const top10Share = (top10BalanceRaw / totalSupply) * 100;
    let penaltyConcentration = 0;
    if (top10Share > 60) penaltyConcentration = 30;
    else if (top10Share > 40) penaltyConcentration = 22;
    else if (top10Share > 20) penaltyConcentration = 15;
    else if (top10Share > 10) penaltyConcentration = 8;
    
    let penaltyLiquidity = 0;
    if (liquidity < 5000) penaltyLiquidity = 25;
    else if (liquidity < 25000) penaltyLiquidity = 18;
    else if (liquidity < 100000) penaltyLiquidity = 12;
    else if (liquidity < 500000) penaltyLiquidity = 6;
    
    // Локи: если нет локов — высокий штраф, если есть — маленький или 0
    const lockedShare = totalSupply ? (lockedTokens / totalSupply) * 100 : 0;
    let penaltyLock = 0;
    if (lockedShare === 0) penaltyLock = 20;
    else if (lockedShare < 5) penaltyLock = 15;
    else if (lockedShare < 15) penaltyLock = 8;
    else if (lockedShare < 30) penaltyLock = 3;
    // если локов много (>30%) — штрафа нет
    
    let penaltyActivity = 0;
    if (totalVolume < 50) penaltyActivity = 15;
    else if (totalVolume < 300) penaltyActivity = 10;
    else if (totalVolume < 1000) penaltyActivity = 5;
    
    let totalPenalty = penaltyConcentration + penaltyLiquidity + penaltyLock + penaltyActivity;
    if (totalPenalty > 90) totalPenalty = 90;
    
    // ===== 3. Бонусы (скрытые, не более 10) =====
    const burnedShare = totalSupply ? (burnedAmount / totalSupply) * 100 : 0;
    let bonusBurned = 0;
    if (burnedShare > 20) bonusBurned = 4;
    else if (burnedShare > 10) bonusBurned = 3;
    else if (burnedShare > 2) bonusBurned = 2;
    else if (burnedShare > 0.1) bonusBurned = 1;
    
    let bonusHolders = 0;
    if (holdersCount > 10000) bonusHolders = 3;
    else if (holdersCount > 5000) bonusHolders = 2;
    else if (holdersCount > 1000) bonusHolders = 1.5;
    else if (holdersCount > 100) bonusHolders = 0.5;
    
    let bonusSocial = 0;
    if (hasSocials) bonusSocial += 2;
    if (hasWebsite) bonusSocial += 1;
    
    let totalBonus = bonusBurned + bonusHolders + bonusSocial;
    if (totalBonus > 10) totalBonus = 10;
    
    // ===== 4. Итог =====
    let safetyPercent = 90 - totalPenalty + totalBonus;
    safetyPercent = Math.max(0, Math.min(100, safetyPercent));
    
    // ===== 5. Обновляем интерфейс с цветом =====
    const safetyDiv = document.getElementById('safety');
    if (safetyDiv) {
        const safePercent = Math.round(safetyPercent);
        const colors = getSafetyColor(safePercent);
        
        safetyDiv.innerHTML = `
            <span style="font-size:24px;font-weight:bold;color:${colors.text};">${safePercent}%</span>
            <div class="safety-tooltip">
                <span class="question-icon" style="background:${colors.text};">?</span>
                <div class="tooltip-text">
                    <div style="font-weight:bold;margin-bottom:8px;color:#ff8888;">⚠️ Факторы риска:</div>
                    <div>• Концентрация топ-10: <strong>${top10Share.toFixed(1)}%</strong></div>
                    <div>• Ликвидность: <strong>$${formatNumber(liquidity)}</strong></div>
                    <div>• Заблокированно: <strong>${formatNumber(lockedTokens)}</strong> токенов (${lockedShare.toFixed(1)}%)</div>
                    <div>• Торговая активность: <strong>${totalVolume}</strong> сделок/24ч</div>
                </div>
            </div>
        `;
    }
    
    console.log(`Безопасность: ${Math.round(safetyPercent)}% | Штрафы: конц=${penaltyConcentration}, ликв=${penaltyLiquidity}, лок=${penaltyLock}, актив=${penaltyActivity} | Бонусы: ${totalBonus}`);
}

setTimeout(updateSafety, 5000);
