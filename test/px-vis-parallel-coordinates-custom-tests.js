document.addEventListener("WebComponentsReady", function() {
  runCustomTests();
});

// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  suite('px-vis-parallel-coordindates basic setup works', function() {
    var basic;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        dim = ['y','y1','y2','y3'],
        w = 500,
        h = 460;

      async.until(
        ()=> {
          return basic = document.getElementById('basic');;
        },
        (callback)=> {
          setTimeout(callback, 50);
        },
        ()=> {
          var rendered = function() {
            basic.removeEventListener('px-vis-chart-canvas-rendering-ended', rendered);
            setTimeout(function() { done(); }, 2000);
          };

          basic.addEventListener('px-vis-chart-canvas-rendering-ended', rendered);

          basic.set('width',w);
          basic.set('height',h);
          basic.set('seriesKey',"x");
          basic.set('axes',dim);
          basic.set('chartData',d);
        }
      );
    });

    test('basic fixture is created', function() {
      assert.isTrue(basic !== null);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y2','y3']);
    });

    test('basic svg', function() {
      var re = /translate\((\d+\.?\d*)\s?,?(\d+\.?\d*)\)/,
          translate = re.exec(basic.svg.attr('transform'));

      assert.equal(basic.svg.node().tagName, 'g');
      assert.equal(Number(translate[1]), 15);
      assert.equal(Number(translate[2]), 10);
    });

    test('basic pxSvgElem', function() {
      assert.equal(basic.pxSvgElem.tagName, 'svg');
      assert.equal(basic.pxSvgElem.width.baseVal.value, 500);
      assert.equal(basic.pxSvgElem.height.baseVal.value, 460);
    });

    test('basic canvasContext', function() {
      assert.equal(basic.canvasContext._translation[0], 15);
      assert.equal(basic.canvasContext._translation[1], 10);
      assert.equal(basic.canvasContext.canvas.width, 500);
      assert.equal(basic.canvasContext.canvas.height, 460);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y2','y3']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [1,10]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

    test('basic mutedSeriesBrush', function() {
      assert.deepEqual(basic.mutedSeriesBrush, {});
    });

    test('basic mutedSeriesDomain', function() {
      assert.deepEqual(basic.mutedSeriesDomain, {});
    });

    test('basic truncationLength', function() {
      assert.equal(basic.truncationLength, 10);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

    test('basic _tooltipConfig', function() {
      assert.deepEqual(basic._tooltipSeriesConfig, {});
    });

  }); //suite

  suite('px-vis-parallel-coordindates with seriesConfig', function() {
    var basic;

    suiteSetup(function(done){
      var seriesConfig = {
          "x": {
            "color": "rgb(255,0,0)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        };
        basic = document.getElementById('basic');
      basic.set('seriesConfig',seriesConfig);

      setTimeout(function(){ done(); }, 500);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(255,0,0)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3']);

      assert.isObject(basic.completeSeriesConfig.y1);
      assert.equal(basic.completeSeriesConfig.y1.title, '2nd Title');

      assert.isObject(basic.completeSeriesConfig.y2);
      assert.equal(basic.completeSeriesConfig.y2.title, 'Third Title');
      assert.equal(basic.completeSeriesConfig.y2.yAxisUnit, 'bofs');

      assert.isObject(basic.completeSeriesConfig.y3);
      assert.equal(basic.completeSeriesConfig.y3.title, 'New Title');
      assert.equal(basic.completeSeriesConfig.y3.yAxisUnit, 'bofs');
    });

    test('basic dislplayed Titles', function() {
      var t = basic.$$('#multiAxis').displayedValues;

      assert.equal(t.y, 'y');
      assert.equal(t.y1, '2nd Title');
      assert.equal(t.y2, 'Third...Title [bofs]');
      assert.equal(t.y3, 'New Title [bofs]');
    });

  }); //suite


  suite('px-vis-parallel-coordindates muting an axis works', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      var muted = {
        'y': true
      };
      basic = document.getElementById('basic');
      delete basic.seriesConfig.x;

      basic.set('mutedAxes',muted);

      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y1','y2','y3']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y1','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y1','y2','y3']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y1','y2','y3']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [1,10]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

  }); //suite

  suite('px-vis-parallel-coordindates unmuting an axis works', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      var muted = {
        'y': false
      };
      basic = document.getElementById('basic');
      basic.set('mutedAxes',muted);

      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y2','y3']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y2','y3']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [1,10]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

  }); //suite

  suite('px-vis-parallel-coordindates muting with addToMutedAxes works', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      basic = document.getElementById('basic');
      basic.addToMutedAxes('y1');
      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y2','y3']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y2','y3']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y2','y3']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [1,10]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

  }); //suite

  suite('px-vis-parallel-coordindates unmuting with removeFromMutedAxes works', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      basic = document.getElementById('basic');
      basic.removeFromMutedAxes('y1');

      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y2','y3']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y2','y3']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [1,10]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

  }); //suite

  suite('px-vis-parallel-coordindates change domains', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      basic = document.getElementById('basic');
      basic.set('chartExtents', {"y": [-20,50]});

      setTimeout(function(){done()},250);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [-20,50]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
    });

  }); //suite

  suite('px-vis-parallel-coordindates adding an axis', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5,
            'y4': 35
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10,
            'y4': 35
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15,
            'y4': 35
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55,
            'y4': 35
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75,
            'y4': 35
          }
        ],
        dim = ['y','y1','y2','y3','y4'];

      basic = document.getElementById('basic');

      basic.set('chartData',d);
      basic.set('axes',dim);

      setTimeout(function(){done()},500);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3','y4']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3','y4']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y2','y3','y4']);
    });


    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y2','y3','y4']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [-20,50]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
      assert.deepEqual(basic.y.y4.domain(), [34.5,35.5]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 5);
    });

  }); //suite

  suite('px-vis-parallel-coordindates muting with addToMutedAxes works  with an array', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      basic = document.getElementById('basic');
      basic.addToMutedAxes(['y1','y3']);
      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3','y4']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y2','y4']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y2','y4']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y2','y4']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y2','y4']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [-20,50]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
      assert.deepEqual(basic.y.y4.domain(), [34.5,35.5]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

  }); //suite

  suite('px-vis-parallel-coordindates unmuting with removeFromMutedAxes works with an array', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      basic = document.getElementById('basic');
      basic.removeFromMutedAxes(['y1','y3']);

      setTimeout(function(){done()},250);
    });

    test('basic axes', function() {
      assert.deepEqual(basic.axes, ['y','y1','y2','y3','y4']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y2','y3','y4']);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y2','y3','y4']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y2','y3','y4']);
    });

    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y2','y3','y4']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [-20,50]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.deepEqual(basic.y.y2.domain(), [0,28]);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
      assert.deepEqual(basic.y.y4.domain(), [34.5,35.5]);
    });

    test('basic axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 5);
    });

  }); //suite

  suite('px-vis-parallel-coordindates delete an axis', function() {
    var basic = document.getElementById('basic');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            'y3': 5,
            'y4': 35
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            'y3': 10,
            'y4': 35
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            'y3': 15,
            'y4': 35
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            'y3': 55,
            'y4': 35
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            'y3': 75,
            'y4': 35
          }
        ],
        dim = ['y','y1','y3','y4'];

      var rendered = function() {
        basic.removeEventListener('px-vis-chart-canvas-rendering-ended', rendered);
        done();
      };
      basic = document.getElementById('basic');
      basic.addEventListener('px-vis-chart-canvas-rendering-ended', rendered);

      basic.set('chartData',d);
      basic.set('axes',dim);
    });

    test('basic completeSeriesConfig', function() {
      assert.isObject(basic.completeSeriesConfig.x);
      assert.equal(basic.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(basic.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(basic.completeSeriesConfig.x.x, ['y','y1','y3','y4']);
      assert.deepEqual(basic.completeSeriesConfig.x.y, ['y','y1','y3','y4']);
    });

    test('basic dimensions', function() {
      assert.deepEqual(basic.dimensions, ['y','y1','y3','y4']);
    });


    test('basic x', function() {
      assert.deepEqual(basic.x.range(), [0,470]);
      assert.deepEqual(basic.x.domain(), ['y','y1','y3','y4']);
    });

    test('basic y', function() {
      assert.deepEqual(basic.y.y.range(), [428, 0]);

      assert.deepEqual(basic.y.y.domain(), [-20,50]);
      assert.deepEqual(basic.y.y1.domain(), [0,20]);
      assert.isUndefined(basic.y.y2);
      assert.deepEqual(basic.y.y3.domain(), [5,75]);
      assert.deepEqual(basic.y.y4.domain(), [34.5,35.5]);
    });

    test('basic axisGroups', function() {
      var ia =  Polymer.dom(Polymer.dom(basic.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });
  }); //suite


  // ###########################################################################################


  suite('px-vis-parallel-coordindates generateAxesFromData works', function() {
    var fromData = document.getElementById('fromData');


    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        seriesConfig = {
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        },
        w = 500,
        h = 460;

      var rendered = function() {
        fromData.removeEventListener('px-vis-chart-canvas-rendering-ended', rendered);
        setTimeout(function() { done(); }, 2000);

      };
      fromData = document.getElementById('fromData');

      fromData.addEventListener('px-vis-chart-canvas-rendering-ended', rendered);

      fromData.set('width',w);
      fromData.set('height',h);
      fromData.set('seriesKey',"x");
      fromData.set('chartData',d);
    });

    test('fromData fixture is created', function() {
      assert.isTrue(fromData !== null);
    });

    test('fromData completeSeriesConfig', function() {
      assert.isObject(fromData.completeSeriesConfig.x);
      assert.equal(fromData.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(fromData.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(fromData.completeSeriesConfig.x.x, ['y','y1','y2','y3']);
      assert.deepEqual(fromData.completeSeriesConfig.x.y, ['y','y1','y2','y3']);
    });

    test('fromData dimensions', function() {
      assert.deepEqual(fromData.dimensions, ['y','y1','y2','y3']);
    });

    test('fromData svg', function() {
      var re = /translate\((\d+\.?\d*)\s?,?(\d+\.?\d*)\)/,
          translate = re.exec(fromData.svg.attr('transform'));

      assert.equal(fromData.svg.node().tagName, 'g');
      assert.equal(Number(translate[1]), 15);
      assert.equal(Number(translate[2]), 10);
    });

    test('fromData pxSvgElem', function() {
      assert.equal(fromData.pxSvgElem.tagName, 'svg');
      assert.equal(fromData.pxSvgElem.width.baseVal.value, 500);
      assert.equal(fromData.pxSvgElem.height.baseVal.value, 460);
    });

    test('fromData canvasContext', function() {
      assert.equal(fromData.canvasContext._translation[0], 15);
      assert.equal(fromData.canvasContext._translation[1], 10);
      assert.equal(fromData.canvasContext.canvas.width, 500);
      assert.equal(fromData.canvasContext.canvas.height, 460);
    });

    test('fromData x', function() {
      assert.deepEqual(fromData.x.range(), [0,470]);
      assert.deepEqual(fromData.x.domain(), ['y','y1','y2','y3']);
    });

    test('fromData y', function() {
      assert.deepEqual(fromData.y.y.range(), [428, 0]);

      assert.deepEqual(fromData.y.y.domain(), [1,10]);
      assert.deepEqual(fromData.y.y1.domain(), [0,20]);
      assert.deepEqual(fromData.y.y2.domain(), [0,28]);
      assert.deepEqual(fromData.y.y3.domain(), [5,75]);
    });

    test('fromData mutedSeriesBrush', function() {
      assert.deepEqual(fromData.mutedSeriesBrush, {});
    });

    test('fromData mutedSeriesDomain', function() {
      assert.deepEqual(fromData.mutedSeriesDomain, {});
    });

    test('fromData truncationLength', function() {
      assert.equal(fromData.truncationLength, 10);
    });

    test('fromData axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(fromData.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

    test('fromData _tooltipConfig', function() {
      assert.deepEqual(fromData._tooltipSeriesConfig, {});
    });

  }); //suite

  suite('px-vis-parallel-coordindates adding to data', function() {
    var fromData = document.getElementById('fromData');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5,
            'y4': 35
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10,
            'y4': 35
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15,
            'y4': 35
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55,
            'y4': 35
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75,
            'y4': 35
          }
        ],
        dim = ['y','y1','y2','y3','y4'];

      fromData = document.getElementById('fromData');
      fromData.set('chartData',d);

      setTimeout(function(){done()}, 1000);
      // done();
    });

    test('fromData completeSeriesConfig', function() {
      assert.isObject(fromData.completeSeriesConfig.x);
      assert.equal(fromData.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(fromData.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(fromData.completeSeriesConfig.x.x, ['y','y1','y2','y3','y4']);
      assert.deepEqual(fromData.completeSeriesConfig.x.y, ['y','y1','y2','y3','y4']);
    });

    test('fromData dimensions', function() {
      assert.deepEqual(fromData.dimensions, ['y','y1','y2','y3','y4']);
    });


    test('fromData x', function() {
      assert.deepEqual(fromData.x.range(), [0,470]);
      assert.deepEqual(fromData.x.domain(), ['y','y1','y2','y3','y4']);
    });

    test('fromData y', function() {
      assert.deepEqual(fromData.y.y.range(), [428, 0]);

      assert.deepEqual(fromData.y.y.domain(), [1,10]);
      assert.deepEqual(fromData.y.y1.domain(), [0,20]);
      assert.deepEqual(fromData.y.y2.domain(), [0,28]);
      assert.deepEqual(fromData.y.y3.domain(), [5,75]);
      assert.deepEqual(fromData.y.y4.domain(), [34.5,35.5]);
    });

    test('fromData axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(fromData.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 5);
    });
  }); //suite

  suite('px-vis-parallel-coordindates delete data ', function() {
    var fromData = document.getElementById('fromData');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            'y4': 35
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            'y4': 35
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            'y4': 35
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            'y4': 35
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            'y4': 35
          }
        ];
        fromData = document.getElementById('fromData');
      fromData.set('chartData',d);

      setTimeout(function() { done(); }, 1000);
    });

    test('fromData completeSeriesConfig', function() {
      assert.isObject(fromData.completeSeriesConfig.x);
      assert.equal(fromData.completeSeriesConfig.x.color, 'rgb(90,191,248)');
      assert.equal(fromData.completeSeriesConfig.x.name, 'x');
      assert.deepEqual(fromData.completeSeriesConfig.x.x, ['y','y1','y4']);
      assert.deepEqual(fromData.completeSeriesConfig.x.y, ['y','y1','y4']);
    });

    test('fromData dimensions', function() {
      assert.deepEqual(fromData.dimensions, ['y','y1','y4']);
    });


    test('fromData x', function() {
      assert.deepEqual(fromData.x.range(), [0,470]);
      assert.deepEqual(fromData.x.domain(), ['y','y1','y4']);
    });

    test('fromData y', function() {
      assert.deepEqual(fromData.y.y.range(), [428, 0]);

      assert.deepEqual(fromData.y.y.domain(), [1,10]);
      assert.deepEqual(fromData.y.y1.domain(), [0,20]);
      assert.isUndefined(fromData.y.y2);
      assert.isUndefined(fromData.y.y3);
      assert.deepEqual(fromData.y.y4.domain(), [34.5,35.5]);
    });

    test('fromData axisGroups', function() {
      var ia = Polymer.dom(Polymer.dom(fromData.root).querySelector('px-vis-multi-axis').root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });
  }); //suite
}
