;(function() {
  if (typeof ChartUtility === 'undefined') {
    window.ChartUtility = {};
  }
  var BarGraph = ChartUtility.BarGraph = function(canvasId, objs, options) {
    this.setup(canvasId);
    this.objs = objs;
    this.key = options.key || "key";
    this.value = options.value || "value";
    this.height = options.height || this.estimateHeight();
    this.width = options.width || Math.floor(this.canvas.width * .8);
    this.verticalSpaces = options.verticalSpaces || this.setSpacing()
    this.horizontalLines = options.horizontalLines || false;
  }

  BarGraph.prototype.setup = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.calculateOrigin();
  }

  BarGraph.prototype.setSpacing = function() {
    var increment = this.height / 10;
    var spaces = [0];
    while (spaces[spaces.length - 1] < this.height ) {
      spaces.push(spaces[spaces.length - 1] + increment);
    }
    return spaces;
  }

  BarGraph.prototype.estimateHeight = function() {
    var sum = 0;
    var max = -1;
    this.objs.forEach(function(obj){
      if (max < obj[this.value]) {
        max = obj[this.value];
      }
      sum += obj[this.value];
    }.bind(this))
    var height = sum * 1.25 / this.objs.length
    return Math.max(height, max);
  }


  BarGraph.prototype.calculateOrigin = function() {
    var x = Math.floor(this.canvas.width * .1);
    var y = Math.floor(this.canvas.height * .9);
    this.origin = [x, y];
  }

  BarGraph.prototype.drawAxes = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.origin[0], this.origin[1]);
    this.ctx.lineTo(this.origin[0], this.origin[1] - this.canvas.height * .8);
    this.ctx.stroke();
    this.ctx.moveTo(this.origin[0], this.origin[1]);
    this.ctx.lineTo(this.origin[0] + this.width, this.origin[1]);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
  }

  BarGraph.prototype.percentOf = function(space){
    return Math.floor(space / this.height * .8 * this.canvas.height)
  }

  BarGraph.prototype.markAxes = function() {

    if (this.horizontalLines) {
      end[0] = end[0] + this.width;
    }
    var markAxis = function(space) {
      var start = [this.origin[0] - 25, this.origin[1] - this.percentOf(space)];
      var end = [this.origin[0], this.origin[1] - this.percentOf(space)]
      debugger
      this.ctx.moveTo(start[0], start[1])
      this.ctx.lineTo(end[0], end[1])
      this.ctx.fillText(space + "", 0, start[1])
    }.bind(this);

    this.ctx.beginPath();
    this.verticalSpaces.forEach(markAxis.bind(this));
    this.ctx.stroke();

  }



  BarGraph.prototype.execute = function() {
    this.drawAxes();
    this.markAxes();
  }
}());
