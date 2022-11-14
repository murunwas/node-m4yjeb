
const { log, error ,clear} = console;
const Websocket = require('ws');
const socket = new Websocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_15m');

const candle=(d)=>({
    time: d.t,
    open: d.o * 1,
    high: d.h * 1,
    low: d.l* 1,
    close: d.c * 1,
    volume: d.v * 1,
  })

let data=[]
const updatePrice=(d)=>{
let current=candle(d);
const f = data[data.length-1]
log("candle height",current.close-current.open)
 log(current.close*1>current.open*1?"bull":"bear",d.o,d.c)
 //log(d)
}

const addLine= (d)=>{
    data.push(candle(d))
}
// When message received from web socket then...
socket.onmessage = function (event) {
    clear()
    // Easier and shorter.
    var data = JSON.parse(event.data);
    if (data.k.x === true) {
        addLine(data.k);
    } else {
        // Updating line with my custom function.
        updatePrice(data.k);
    }
}