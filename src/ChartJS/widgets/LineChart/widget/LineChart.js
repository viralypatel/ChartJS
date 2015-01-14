/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global mx, mendix, require, console, define, module, logger, window */
/*mendix */
(function () {
    'use strict';

    // Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
    require([

        'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', 'dojo/on', 'ChartJS/widgets/Core'

    ], function (declare, lang, domQuery, on, _core) {

        // Declare widget.
        return declare('ChartJS.widgets.LineChart.widget.LineChart', [ _core ], {

            // Overwrite functions from _core here...

            _processData : function () {
                var sets = [],
                    points = null,
                    set = {
                        points : []
                    },
                    xlabels = [],
                    xlabelsSet = false,
                    color = "",
                    label = "",
                    j = null,
                    i = null,
                    _set = null,
                    listNodes = null,
                    k = null;

                sets = this._data.datasets = this._sortArrayObj(this._data.datasets);

                for (j = 0; j < sets.length; j++) {
                    set = sets[j];
                    if (set.nopoints === true) {
                        // No points found!
                        console.log(this.id + ' - empty dataset');
                    } else {
                        points = [];
                        set.points = this._sortArrayMx(set.points, this.sortingxvalue);
                        color = set.dataset.get(this.seriescolor);
                        label = set.dataset.get(this.datasetlabel);

                        for (i = 0; i < set.points.length; i++) {
                            if (!xlabelsSet) {
                                xlabels.push(set.points[i].get(this.seriesxlabel));
                            }

                            points.push(+(set.points[i].get(this.seriesylabel))); // Convert to integer, so the stackedbar doesnt break!
                        }

                        if (!xlabelsSet) {
                            xlabelsSet = true;
                        }

                        _set = {
                            label : label,
                            fillColor: this._hexToRgb(color, "0.5"),
                            strokeColor: this._hexToRgb(color, "0.8"),
                            pointColor: this._hexToRgb(color, "0.8"),
                            highlightFill: this._hexToRgb(color, "0.75"),
                            highlightStroke: this._hexToRgb(color, "1"),
                            data : points
                        };
                        this._chartData.datasets.push(_set);
                        this._activeDatasets.push({
                            dataset : _set,
                            idx : j,
                            active : true
                        });
                    }
                }
                this._chartData.labels = xlabels;

                this._createChart(this._chartData);

                this._legendNode.innerHTML = this._chart.generateLegend();

                listNodes = domQuery("li", this._legendNode);

                if (listNodes.length > 0) {
                    for (k = 0; k < listNodes.length; k++) {
                        on(listNodes[k], "click", lang.hitch(this, this._onClickLegend, k, false)); /*Use multi series data format*/
                    }
                }
            },

            _createChart : function (data) {

                this._chart = new this._chartJS(this._ctx).Line(data, {

                    //Boolean - Whether to show labels on the scale
                    scaleShowLabels : this.scaleShowLabels,

                    ///Boolean - Whether grid lines are shown across the chart
                    scaleShowGridLines : this.scaleShowGridLines,

                    //String - Colour of the grid lines
                    scaleGridLineColor : this.scaleGridLineColor,

                    //Number - Width of the grid lines
                    scaleGridLineWidth : this.scaleGridLineWidth,

                    //Boolean - Whether to show horizontal lines (except X axis)
                    scaleShowHorizontalLines : this.scaleShowHorizontalLines,

                    //Boolean - Whether to show vertical lines (except Y axis)
                    scaleShowVerticalLines : this.scaleShowVerticalLines,

                    //Boolean - Whether the line is curved between points
                    bezierCurve : this.bezierCurve,

                    //Number - Tension of the bezier curve between points
                    bezierCurveTension : this.bezierCurveTension,

                    //Boolean - Whether to show a dot for each point
                    pointDot : this.pointDot,

                    //Number - Radius of each point dot in pixels
                    pointDotRadius : this.pointDotRadius,

                    //Number - Pixel width of point dot stroke
                    pointDotStrokeWidth : this.pointDotStrokeWidth,

                    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                    pointHitDetectionRadius : this.pointHitDetectionRadius,

                    //Boolean - Whether to show a stroke for datasets
                    datasetStroke : this.datasetStroke,

                    //Number - Pixel width of dataset stroke
                    datasetStrokeWidth : this.datasetStrokeWidth,

                    //Boolean - Whether to fill the dataset with a colour
                    datasetFill : this.datasetFill,

                    //String - A legend template
                    legendTemplate : this.legendTemplate

                });

                on(window, 'resize', lang.hitch(this, function () {
                    this._chart.resize();
                }));

                if (this.onclickmf || this.onclickmfcontext) {
                    on(this._chart.chart.canvas, "click", lang.hitch(this, this._onClickChart));
                }
            }
        });
    });

}());