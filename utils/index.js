const dataForge = require("data-forge");
require("data-forge-fs");
const Enumerable = require("linq");
const ccxt = require("ccxt");
const EMA = require("technicalindicators").EMA;
require('data-forge-plot'); // Extends Data-Forge with the 'plot' function.
require('@plotex/render-image'); // Extends Data-Forge Plot with the 'renderImage' function.

const { log } = console;

class Bot {
  constructor() {}

  async getData() {
    const SYMBOL = "BTC/USDT";
    const INTERVAL = "15m";
    let binance = new ccxt.binance();
    let data = await binance.fetchOHLCV(SYMBOL, INTERVAL);
    const df = data.map((d) => ({
      time: d[0] / 1000,
      open: d[1] * 1,
      high: d[2] * 1,
      low: d[3] * 1,
      close: d[4] * 1,
      volume: d[5] * 1,
    }));
    return new dataForge.DataFrame(df).setIndex("time");
  }

  async dd() {
    let df = await this.getData();
    df.plot().renderImage("my-chart.png");
    //df = this.calcEma(df, 20);
    //console.log(df.tail(12).toString());
    //log(this.df.getSeries('name').toArray())
    //this.df.plot().renderImage("my-chart.png");
    //     var subsetToPlot = this.df.subset(["name", "sex"]);
    //     var data = Enumerable.from(subsetToPlot.toArray()) // Assume first column is date, second column is value to plot.
    //       .select(function (entry) {
    //         return [entry.name, entry.sex];
    //       })
    //       .toArray();

    //     log(data);
  }

  sma(dataFrame, period) {
    var movingAvg = dataFrame
      .getSeries("close")
      .rollingWindow(period)
      .select((window) => [window.getIndex().last(), window.average()])
      .withIndex((pair) => pair[0])
      .select((pair) => pair[1]);

    // Create a new data frame with the new column, doesn't modify original data frame.
    //console.log(movingAvg.getIndex().toArray());
    return dataFrame.withSeries("SMA", movingAvg);
  }

  calcEma(dataFrame,period=20){
    const values=dataFrame.getSeries("close").toArray()
    const ema = EMA.calculate({period , values });
   return dataFrame.withSeries(`ema${period}`, ema);
  }
}

module.exports = new Bot();
