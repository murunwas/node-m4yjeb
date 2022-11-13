const dataForge = require("data-forge");
require("data-forge-fs");
const { log } = console;

const data =[{
    name:"i1",
    date:"2020-01-01",
    power:1,
    rssi:1
},
{
    name:"i2",
    date:"2020-01-01",
    power:2,
    rssi:2
},
{
    name:"i1",
    date:"2020-01-02",
    power:1,
    rssi:44
},
{
    name:"i2",
    date:"2020-01-02",
    power:2,
    rssi:33
}
]

const df = new dataForge.DataFrame(data).setIndex("date");
log(df.toString())
let summary = df.groupBy(row => row.name) // Sort the data set into groups. This returns a series of groups.
    .select(group => {     // Transform each group into a summary.
        return {
            name: group.first().name,
            date: group.deflate(row => row.date).toArray(),
            Count: group.count(),
            rssi: group.deflate(row => row.rssi).toArray(),
            power: group.deflate(row => row.power).toArray(),
        };
    })
    .inflate();
    let heights = summary.getSeries("name");


    let transformed = df.select(row => { // Transform data.
        const clone = Object.assign({}, row);
        log(clone)
        clone["me"] = clone["rssi"] * 2;
        return clone;
    });

    const cloned = df.concat(transformed)













// log("=========summary====================")
// log(summary.toString())
// log("=============heights================")
// log(heights.toString())
// log("=============heights================")
// log(heights.toString())
// log("=============concat================")
log(cloned.toString())