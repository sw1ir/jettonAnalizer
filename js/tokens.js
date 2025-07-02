
      let lingvistic = new Map([["price chart","График цены"],["holders","Холдеры"],["price","Цена"],["mcap","Капитализация"],["Lock","Заблокированно"],["burned","Соженно"],["safety","Безопасность"],["liquidity","Ликвидность"],["trancsations","Транкзации"],["total_supply","Эмиссия"],["left","Левые"],["old with afk","Отлега"]])
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

      //запрос к декскринеру
          async function getDexScreneerData(){
        let responce = await fetch(`https://api.dexscreener.com/tokens/v1/ton/${contract}`)
        let data = await responce.json()
        console.log(data)
        console.log(data + "dsdsadasfdef")
        return data
    }
        //инфа с декскринера
            getDexScreneerData().then(data =>{
        let liquidity = data["0"].liquidity.usd
        let buyValue = data["0"].txns.h24.buys;
        let sellValue = data["0"].txns.h24.sells;
        let all_trans = buyValue + sellValue
        let buy_perc = (buyValue/all_trans) * 100
        let sell_perc = (sellValue/all_trans) * 100

        let price = data["0"]["priceUsd"]
        let fdv = data["0"]["fdv"]

        let mcapImg = document.getElementById("mcapImg")
          let priceChange = data["0"]["priceChange"]["h1"]
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
        const poolResponse = await fetch(`https://api.geckoterminal.com/api/v2/networks/ton/tokens/${contract}/pools?page=1`);
        if (!poolResponse.ok) throw new Error('Ошибка при получении пула');
        const poolData = await poolResponse.json();
        
        const pool = poolData.data[0].attributes.address;
        
        // 2. Получаем данные OHLCV
        const ohlcvResponse = await fetch(`https://api.geckoterminal.com/api/v2/networks/ton/pools/${pool}/ohlcv/minute?aggregate=5&currency=usd&limit=1000`);
        if (!ohlcvResponse.ok) throw new Error('Ошибка при получении данных графика');
        const ohlcvData = await ohlcvResponse.json();

        // 3. Обработка данных
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

        // 4. Настройка и отображение графика
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
        let data = await responce.json()
        return data.balance
    }
        //lock async vivod
        lock = document.getElementById("lock");
        getLockData().then( data => {
          lock.textContent = formatNumber( data/ 10 ** 9);
        })
        //основная инфа о монете
        getJettonInfo().then(data =>{
        let supply = data.total_supply;
        real_supply = supply / 10 ** 9;
        let img = data.metadata.image;
        document.getElementById("logo").src = img;
        let name = data.metadata.name;
        let simbol = data.metadata.symbol;
        let token = name + "(" + simbol + ")";
        document.getElementById("token_name").innerHTML = token;
        let holders = data.holders_count;
        document.getElementById("holders").innerHTML = holders;
        document.getElementById("description").innerHTML =data.metadata.description;
        let emision = document.getElementById("total_suplly")
        emision.textContent = formatNumber(real_supply)

    }
    )
    //async burn
      let burn = document.getElementById("burn");
    getBurnInfo().then(burned_amount => {
        burn.textContent = formatNumber(burned_amount / 10 ** 9);
        console.log(burned_amount)
    })
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
      });
      ca = document.getElementById("ca").innerHTML = `${contract.slice(
        0,
        5
      )}...${contract.slice(-5)}`;
 