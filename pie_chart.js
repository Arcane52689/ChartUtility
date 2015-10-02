;(function() {
  if (typeof ChartUtility === 'undefined') {
    window.ChartUtility = {}
  }

  var PieChart = ChartUtility.PieChart = function(canvasId, objs, options) {
    this.setUp(canvasId)
    this.radius = options.radius || this.estimateRadius();
    this.key = options.key || 'key';
    this.value = options.value || 'value';
    this.objs = objs;
    this.total = options.total
    if (options.total) {
      this.budgeted = true;
    }
    this.default = options.default
    this.calculateOrigin();
  };

  PieChart.prototype.setUp = function(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d');
  };


  PieChart.prototype.sumTotal = function() {
    var total = 0;
    this.objs.forEach(function(obj) {
      total += obj[this.value];
    }.bind(this))
    return total;
  };

  PieChart.prototype.estimateRadius = function() {
    var smallest = Math.min(this.canvas.height, this.canvas.width);
    return Math.floor(.7 * smallest / 2);
  }

  PieChart.prototype.calculatePercentages = function() {
    var total = this.total || this.sumTotal();
    this.objs.forEach(function(obj) {

      obj.percentage = obj[this.value] / total
    }.bind(this));
  };

  PieChart.prototype.calculateOrigin = function() {
    var x = Math.floor(this.canvas.width / 2);
    var y = Math.floor(this.canvas.height / 2 );
    this.origin = [x, y]
  }

  PieChart.prototype.drawCirlce = function() {
    this.ctx.beginPath();
    this.drawArc(0, Math.PI * 2, '#fff')
    if (this.budgeted) {
      this.ctx.fillStyle = this.default;
      this.ctx.fill();    
    }
  }

  PieChart.prototype.drawArcs = function() {
    var start = 0;
    var end = 0;
    this.calculatePercentages();
    var draw = function(obj) {
      end = start + obj.percentage * Math.PI * 2;

      this.drawWedge(start, end, obj.color);
      start = end;
    }
    this.objs.forEach(draw.bind(this));

  }

  PieChart.prototype.drawWedge = function(start, end, color) {
    this.ctx.beginPath();
    this.drawArc(start, end);
    this.ctx.lineTo(this.origin[0], this.origin[1]);
    this.ctx.lineTo(this.convertToCoordinates(start)[0], this.convertToCoordinates(start)[1])
    this.ctx.closePath();
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  PieChart.prototype.convertToCoordinates = function(radians) {

    var x = Math.floor(Math.cos(radians) * this.radius) + this.origin[0];
    var y = Math.floor(Math.sin(radians) * this.radius) + this.origin[1];
    return [x, y];
  }



  PieChart.prototype.drawArc = function(start, end) {
    this.ctx.arc(
      this.origin[0],
      this.origin[1],
      this.radius,
      start,
      end
    )
  }

  PieChart.prototype.drawLegend = function() {
    var side = Math.floor(this.canvas.width * .025);
    var start = [10, 10];
    this.ctx.strokeStyle = "black";


    var drawLine = function(obj) {
      this.drawSquare(start, side, obj.color);
      var text = this.textOf(obj);
      this.ctx.font = "12px serif"
      this.ctx.fillText(text, start[0] + (2 * side), start[1] + side);
    }.bind(this);

    this.objs.forEach(function(obj) {
      drawLine(obj);
      start[1] = start[1] + Math.floor(side * 1.5);
    })
  }

  PieChart.prototype.textOf = function(obj) {
    var percent = Math.floor(10000*obj.percentage) / 100 ;
    return obj[this.key] +" : " + percent + "%";
  }

  PieChart.prototype.drawSquare = function(point, length, color) {
    this.ctx.beginPath();
    this.ctx.rect(point[0], point[1], length, length);
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }



  PieChart.prototype.execute = function() {
    this.drawCirlce();
    this.drawArcs();
    this.drawLegend();
  }





}());
