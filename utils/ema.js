const { SMA, EMA, CrossUp, CrossDown } = require("technicalindicators");
const ccxt = require("ccxt");
const { last, map } = require("lodash");
require("./ex");
const dayjs = require("dayjs");
var minMax = require("dayjs/plugin/minMax");
dayjs.extend(minMax);

var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const { log } = console;

class Bot {
  constructor(data = []) {
    this.data = data;
    this.closePrices = map(this.data, "close");
    this.low = map(this.data, "low");
    this.high = map(this.data, "high");
    this.time = map(this.data, "time");
    this.open = map(this.data, "open");
  }

  #calcEma(period = 20) {
    return EMA.calculate({ period, values: this.closePrices });
  }

  execute() {
    let ema20 = this.#calcEma(20);
    let ema50 = this.#calcEma(50);
    let ema100 = this.#calcEma(100);
    let ema200 = this.#calcEma(200);

    const ema200Length=ema200.length;

    const latestEma20 = ema20.getLatestValues(ema200Length);
    const latestEma50 = ema50.getLatestValues(ema200Length);
    const latestEma100 = ema100.getLatestValues(ema200Length);
    const latestTime = this.time.getLatestValues(ema200Length);

    latestTime.forEach((d,i)=>{
        log(latestEma50[i].toFixed(0)==ema200[i].toFixed(0))
    })
  }

  test(){
    let m =this.data.reduce((acc,curr)=>{
      if(curr.close-curr.open>300){
        acc.push({
          date:dayjs(curr.time).format("DD-MM-YYYY HH:mm"),
          price:curr.close-curr.open
        })
      }
      return acc;
    },[])
    log(m)
  }
}

const getData = async () => {
  const SYMBOL = "BTC/USDT";
  const INTERVAL = "15m";
  let binance = new ccxt.binance();
  let data = await binance.fetchOHLCV(SYMBOL, INTERVAL);
  let formattedData = data.map((d) => ({
    time: d[0],
    open: d[1] * 1,
    high: d[2] * 1,
    low: d[3] * 1,
    close: d[4] * 1,
    volume: d[5] * 1,
  }));
  new Bot(formattedData).test();
};
getData()
// let arr=[1,2,3,4];
// log(arr.getFromLast(2))
// log(arr.getFromLast(2))
// log(arr.getLatestValues(10))
// log(arr)
