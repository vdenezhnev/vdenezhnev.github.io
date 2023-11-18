const ctx = document.getElementById('mychart')

const pluginCustomCanvasBackgroundColor = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#99ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{
            data: [60000, 90000, 130000, 160000, 200000, 240000, 270000, 300000, 340000, 390000],
            backgroundColor: [
                "#F8F8F8"
            ],

            borderColor: [
                '#800080',

            ],
            borderWidth: 4,
            pointStyle: false
        }],
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            customCanvasBackgroundColor: {
                color: '#F8F8F8',
            }
        },
    },
    plugins: [pluginCustomCanvasBackgroundColor]
});

