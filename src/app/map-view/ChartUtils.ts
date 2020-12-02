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
                            labelString: "Distanza",

                        }, ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
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
                            maxTicksLimit: 20
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