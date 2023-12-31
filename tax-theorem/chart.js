const ctx = document.getElementById('mychart')
const ctx_percent = document.getElementById('mychart_percent')

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

var chart_percent = new Chart(ctx_percent, {
    type: 'line',
    data: {
        labels: [],
        datasets: [],
    },
    options: {
        layout:{
            padding: {
                top: 48,
                right: 48
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                    tickLength: 10,
                    color: '#000000',
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
                grid: {
                    drawOnChartArea: false,
                    tickLength: 10,
                    color: '#000000',
                },
                border: {
                    color: '#000000',
                },
                ticks: {
                    stepSize: 1,
                    padding: 2,
                    color: '#000000',
                    font: {
                        size: 9,
                    },
                    backdropColor: '#000000',  
                    major: {
                        enabled: true,
                    },
                    callback: function(value, index, ticks) {
                        let chart_percent_progress_dataset = [];

                        for (item = 0; item < 5; item++) {
                            chart_percent_progress_dataset.push(parseInt($('.calculator__inpit.progress__system').eq([item]).val()));
                        }
                        
                        if (chart_percent_progress_dataset.includes(value) || value == parseInt($('.calculator__inpit.proportional_system_value').val())) {
                            return value + '%';
                        }
                    }
                },
                beginAtZero: true,
            }
        },
        elements: {
            point: {
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '0000000',
                pointBorderWidth: 1,
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