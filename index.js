const fs = require('fs');
const months = ["jan", "feb", "mar", "apr", "may", "jun", "july", "aug", "sep", "oct", "nov", "dec"];

const filePath = 'dataset.txt';

// Reading data line by line
let lines = fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(Boolean);

// Segregrating data into array of objects    
let dataset = [];
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line = line.split(',');

    if (i > 0) {
        let obj = {
            date: line[0],
            sku: line[1],
            unit_price: line[2],
            quantity: line[3],
            total_price: line[4].trim()
        };
        dataset.push(obj);
    }
}
let totalSales = 0;
let monthWiseSales = {
    "jan": {
    },
    "feb": {
    },
    "mar": {
    },
    "apr": {
    },
    "may": {
    },
    "jun": {
    },
    "july": {
    },
    "aug": {
    },
    "sep": {
    },
    "oct": {
    },
    "nov": {
    },
    "dec": {
    }
};
for (let i = 0; i < dataset.length; i++) {
    let item = dataset[i];

    // Total Sales
    totalSales += parseInt(item.total_price);

    // Month Wise Sales
    let date = new Date(item.date);
    let monthIndex = date.getMonth();
    let month = months[monthIndex];
    if (!monthWiseSales[month].totalSales) {
        monthWiseSales[month].totalSales = parseInt(item.total_price);
        monthWiseSales[month]['most_popular'] = {}
        monthWiseSales[month]['most_revenue'] = {}
        monthWiseSales[month].min = Infinity;
        monthWiseSales[month].max = 0;
        monthWiseSales[month].count = 0;
    } else {
        monthWiseSales[month].totalSales += parseInt(item.total_price);
    }

    // Most Popular Item
    if (!monthWiseSales[month]['most_popular'][item.sku]) {
        monthWiseSales[month]['most_popular'][item.sku] = parseInt(item.quantity);
    } else {
        monthWiseSales[month]['most_popular'][item.sku] += parseInt(item.quantity);
    }

    // Most Popular Item
    if (!monthWiseSales[month]['most_revenue'][item.total_price]) {
        monthWiseSales[month]['most_revenue'][item.sku] = parseInt(item.total_price);
    } else {
        monthWiseSales[month]['most_revenue'][item.sku] += parseInt(item.total_price);
    }

}

// Most Popular Item
Object.keys(monthWiseSales).map(function (x) {
    if (monthWiseSales[x].hasOwnProperty('most_popular')) {
        let maxValue = Math.max.apply(null, Object.keys(monthWiseSales[x]['most_popular']).map(function (y) { return monthWiseSales[x]['most_popular'][y] }));
        let maxKey = Object.keys(monthWiseSales[x]['most_popular']).filter(function (z) { return monthWiseSales[x]['most_popular'][z] == maxValue; })[0];
        monthWiseSales[x]['most_popular'] = {};
        monthWiseSales[x]['most_popular'][maxKey] = maxValue;
    }

    if (monthWiseSales[x].hasOwnProperty('most_revenue')) {
        let maxValue = Math.max.apply(null, Object.keys(monthWiseSales[x]['most_revenue']).map(function (y) { return monthWiseSales[x]['most_revenue'][y] }));
        let maxKey = Object.keys(monthWiseSales[x]['most_revenue']).filter(function (z) { return monthWiseSales[x]['most_revenue'][z] == maxValue; })[0];
        monthWiseSales[x]['most_revenue'] = {};
        monthWiseSales[x]['most_revenue'][maxKey] = maxValue;
    }
    return monthWiseSales[x]
});


for (let i = 0; i < dataset.length; i++) {
    let item = dataset[i];

    // Month Wise Sales
    let date = new Date(item.date);
    let monthIndex = date.getMonth();
    let month = months[monthIndex];
    if (monthWiseSales[month]) {
        let sku = Object.keys(monthWiseSales[month]['most_popular']);
        if (item.sku === sku[0]) {
            monthWiseSales[month].min = Math.min(monthWiseSales[month].min, item.quantity);
            monthWiseSales[month].max = Math.max(monthWiseSales[month].max, item.quantity);
            monthWiseSales[month].count++;
        }

    }
}

Object.keys(monthWiseSales).map(function (x) {
    if (monthWiseSales[x]['most_popular']) {
        let total = Object.values(monthWiseSales[x]['most_popular']);
        monthWiseSales[x]['avg'] = total[0] / monthWiseSales[x]['count'];
        delete monthWiseSales[x]['count'];
    }
    return monthWiseSales[x]

});

console.log('totalSales', totalSales);
console.log('monthWiseSales', monthWiseSales);