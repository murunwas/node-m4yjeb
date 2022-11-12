const dataForge = require('data-forge');
require('data-forge-fs');
// require('data-forge-plot');
// require('@data-forge-plot/render');
const {log} = console;

class Bot{
    constructor(){

    }

    get df(){
        return new dataForge.DataFrame({
            columnNames:["id","name","sex","age"],
            rows:[
                [1,"Jesse","male",25],
                [2,"Jane","female",25],
                [3,"Mark","male",20],
                [4,"Peter","male",55],
                [5,"Paula","female",35],
        
            ]
        }).setIndex("id")
        .dropSeries("id");
    }

    dd(){
        log(this.df.head(2).toString())
        log(this.df.getSeries('name').toArray())
        //this.df.plot().renderImage("my-chart.png");
    }
}

module.exports = new Bot();