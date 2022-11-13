const {SMA,EMA,CrossUp,CrossDown } =require("technicalindicators")
const ccxt = require("ccxt");
const dayjs = require('dayjs')
var minMax = require('dayjs/plugin/minMax')
dayjs.extend(minMax)

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const { log } = console;

const getLatestValues=(values=[],period=0)=>values.slice(-period)
const getCrossIndices = (crosses)=>{
   return crosses.reduce((acc,curr,i)=>{
        if(curr){
         acc.push(i)
        }
         return acc;
       },[])
}

const getGoldenCross=(prices=[])=>{
  const timeOnly = prices.map(p=>p[0])
  const priceOnly = prices.map(p=>p[4])

  const sma50 = SMA.calculate({period:50 , values:priceOnly });
  const sma200 = SMA.calculate({period:200 , values:priceOnly });


  const latestSma50 = getLatestValues(sma50,sma200.length)
  const latestPricesTime = getLatestValues(timeOnly,sma200.length)


  const crosses = CrossUp.calculate({lineA:latestSma50,lineB:sma200})
  const crossesDown = CrossDown.calculate({lineA:latestSma50,lineB:sma200})


  const crossIndices = getCrossIndices(crosses)
  const crossDownIndices = getCrossIndices(crossesDown)



  const results = crossIndices.map(i=>({
    time:dayjs(latestPricesTime[i]).format("DD-MM-YYYY HH:mm"),
    now:dayjs(latestPricesTime[i]).isBetween(dayjs().subtract(5, 'm'), dayjs().add(2, 'm'), 'm')
}),
    )
  const resultsD = crossDownIndices.map(i=>({
    time:dayjs(latestPricesTime[i]).format("DD-MM-YYYY HH:mm"),
  now:dayjs(latestPricesTime[i]).isBetween(dayjs().subtract(5, 'm'), dayjs().add(2, 'm'), 'm')
}))
    log("results",results)
    log("resultsD",resultsD)

}

const getData = async()=>{
    const SYMBOL = "BTC/USDT";
    const INTERVAL = "15m";
    let binance = new ccxt.binance();
    let data = await binance.fetchOHLCV(SYMBOL, INTERVAL);
    getGoldenCross(data)
}

log("slice",getLatestValues([0,1,2,3,4,5],1))


module.exports={getData}