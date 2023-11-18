const ctx = document.getElementById('mychart')
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
                    display: false,
                },
                border: {
                    color: '#000000',
                },
                ticks: {
                    color: '#000000',
                    font: {
                        size: 10,
                    },
                    major: {
                        enabled: true,
                    },
                },
            }
        },
    }
});