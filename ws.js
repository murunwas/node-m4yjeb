
const { log, error ,clear} = console;
const Websocket = require('ws');
const socket = new Websocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_15m');

let data=[]
const updatePrice=(d)=>{
const f = data[data.length-1]
log(f)
 log(d.o*1>d.c*1?"bull":"bear",d.o,d.c)
 //log(d)
}

const addLine= (d)=>{
    data.push(d)
}
// When message received from web socket then...
socket.onmessage = function (event) {
    clear()
    // Easier and shorter.
    var data = JSON.parse(event.data);
    if (data.k.x === true) {
        log("Add line.");

        // Adding a line with my custom function.
        addLine(data.k);
    } else {
        // Updating line with my custom function.
        updatePrice(data.k);
    }
}