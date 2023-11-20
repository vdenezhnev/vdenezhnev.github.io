const ctx = document.getElementById('mychart')
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [],
    },
    options: {
        layout:{
            padding: {
                top: 28,
                right: 28
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                    tickLength: 5,
                },
                border: {
                    color: '#000000',
                },
                ticks: {
                    padding: 2,
                    color: '#000000',
                    font: {
                        size: 9,
                    },
                    major: {
                        enabled: true,
                    },
                    backdropColor: '#000000',
                },
            },
            y: {
                border: {
                    color: '#000000',
                },
                ticks: {
                    stepSize: 100000,
                    padding: 2,
                    color: '#000000',
                    font: {
                        size: 9,
                    },
                    major: {
                        enabled: true,
                    },
                    backdropColor: '#000000',  
                },
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
    }
});