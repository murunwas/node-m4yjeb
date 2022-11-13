const { log } = console;
Array.prototype.getFromLast = function(itemFromlast=1) {
    return this[this.length - itemFromlast];
};
Array.prototype.getLatestValues = function(period=1) {
    return [...this.slice(-period)];
};