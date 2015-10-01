;(function() {
  if (typeof ChartUtility === 'undefined') {
    window.ChartUtility = {};
  }
  var BarGraph = ChartUtility.BarGraph = function(cavnasId, objs, options) {
    this.setup(canvasId);
    this.objs = objs
  }

  BarGraph.prototype.setup = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
  }
}());
