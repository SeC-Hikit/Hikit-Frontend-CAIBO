import { Chart, ChartOptions } from 'chart.js';

export class ChartUtils {

    static clearChart(chart: Chart) {
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }

    public static getChartOptions(): ChartOptions {
        return {
            tooltips: {
                enabled: true,
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: false,
                onHover: function (e, item) {
                    if (item.length) {
                        // TODO
                        console.log(item, "");
                    }
                }
            },
            maintainAspectRatio: true,
            spanGaps: false,
            elements: {
                line: {
                    tension: 0.000001,
                },
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Distanza (m)",

                        }, ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5
                        },
                    },
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Altitudine (m)",
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5
                        }
                    },
                ],
            },
            plugins: {
                filler: {
                    propagate: false,
                },
                "samples-filler-analyser": {
                    target: "chart-analyser",
                },
            },
        };
    }
}