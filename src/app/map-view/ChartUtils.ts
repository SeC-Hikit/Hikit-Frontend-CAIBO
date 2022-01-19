import { Chart, ChartOptions } from 'chart.js';

export class ChartUtils {

    private static DEBOUNCE_TIME = 300;
    private static interval : ReturnType<typeof setTimeout> = null;


    static clearChart(chart: Chart) {
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }

    public static getChartOptions( onHoverCallback: (index: number) => void ): ChartOptions {
        return {
            tooltips: {
                enabled: true,
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: false,
                onHover: function (e, item: any[]) {
                    if(ChartUtils.interval) {
                        clearTimeout(ChartUtils.interval);
                    }

                    ChartUtils.interval = setTimeout(
                        ()=> {
                            if (item.length) {
                                console.log(item);
                                onHoverCallback(item[0]._index)
                            }
                        },
                        ChartUtils.DEBOUNCE_TIME);
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