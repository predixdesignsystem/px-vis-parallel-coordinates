/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
PX Vis component that creates a parallel coordinates (aka parallel axes) chart.

### Usage - Specifying your axes manually

    <px-vis-parallel-coordinates
        width="1300"
        height="500"
        chart-data="[[chartData]]"
        axes='["Axes_1","Axes_2","Axes_n"]'
        series-key="TimeStamp"
        match-ticks
        series-config='{
            "TTXD1_1":{
              "yAxisUnit": "Hz",
              "title": "name1"
            },
            "TTXD1_12":{
              "yAxisUnit": "F",
              "title": "stout"
            }
          }'
    ></px-vis-parallel-coordinates>

### Usage - Auto-generating your axes from data

    <px-vis-parallel-coordinates
        width="1300"
        height="500"
        chart-data="[[chartData]]"
        skip-keys='{"UnitNumber":true,"DLN_MODE":true}'
        series-key="TimeStamp"
        generate-axes-from-data
        match-ticks
    ></px-vis-parallel-coordinates>

### Styling
The following custom properties are available for styling:

Custom property | Description
----------------|-------------
  `--px-vis-axis-brush-outline-color` | The stroke (border) color for the brushed box on an axis
  `--px-vis-axis-brush-fill-color` | The fill (background) color for the brushed box on an axis
  `--px-vis-axis-brush-fill-opacity` | The opacity of the brushed box on an axis
  |
  |
  |
  `--px-vis-axis-color` | The color for the axis lines, axis ticks, and axis tick labels
  `--px-vis-axis-title-color` | The color for the axis title
  `--px-vis-axis-inline-title-color` | The color for the axis title
  `--px-vis-axis-inline-type-color` | The color for the axis lines, axis ticks, and axis tick labels when using 'inline' labelPosition
  `--px-vis-axis-inline-box-color` | The color for the tick boxes when using 'inline' labelPosition
  |
  |
  |
  `--px-vis-gridlines-color` | The color for the gridlines
  |
  |
  |
  `--px-vis-register-series-name` | The color of the data series name
  `--px-vis-register-data-value` | The color of the data series value
  `--px-vis-register-box` | The color of the box around the register when a scrollbar is present
  |
  |
  |
  `--px-vis-series-color-0` | These are the colors used to represent the data series on the charts. Used in numerical order by default. Colors MUST start at 0 and cannot contain gaps between numbers.
  `--px-vis-series-color-1` |
  `--px-vis-series-color-2` |
  `--px-vis-series-color-n` |
  |
  |
  |
  `--px-tooltip-background-color` | The color of the tooltip
  `--px-tooltip-text-color` | The color of the tooltip text
  `--px-tooltip-light-background-color` | The color of the light version tooltip
  `--px-tooltip-light-text-color` | The color of the light version tooltip text
  `--px-tooltip-light-border-color`| The color of the light version tooltip border
  |
  |
  |
  `--px-vis-font-family` | The font family for all labels and text


@element px-vis-parallel-coordinates
@blurb PX Vis component that creates a parallel coordinates (aka parallel axes) chart.
@homepage index.html
@demo demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-vis/px-vis-behavior-common.js';
import 'px-vis/px-vis-behavior-d3.js';
import 'px-vis/px-vis-behavior-chart.js';
import 'px-vis/px-vis-behavior-renderer.js';
import 'px-vis/px-vis-svg-canvas.js';
import 'px-vis/px-vis-line-svg.js';
import 'px-vis/px-vis-line-canvas.js';
import 'px-vis/px-vis-clip-path.js';
import 'px-vis/px-vis-multi-axis.js';
import 'px-vis/px-vis-behavior-scale-multi-axis.js';
import 'px-vis/px-vis-gridlines.js';
import 'px-vis/px-vis-tooltip.js';
import 'px-vis/px-vis-toolbar.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import 'px-vis/px-vis-cursor-line.js';
import 'px-vis/px-vis-highlight-line.js';
import 'px-vis/px-vis-highlight-line-canvas.js';
import 'px-vis/px-vis-central-tooltip-content.js';
import 'px-tooltip/px-tooltip.js';
import './css/px-vis-parallel-coordinates-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
Polymer({
  _template: html`
    <style include="px-vis-parallel-coordinates-styles" is="custom-style"></style>

    <div id="wrapper" class\$="{{_chartWrapperClass}}">
      <div class="flex flex--col safari-flex-fix">
        <px-vis-register id="categoryRegister" x-axis-type="linear" y-axis-type="linear" class\$="{{_getHideClass(_hideCategoryRegister)}}" tooltip-data="[[_categoryRegisterTooltipData]]" complete-series-config="[[_categoryRegisterConfig]]" muted-series="{{mutedSeriesCategories}}" hide-pagination-controls="" type="horizontal">
        </px-vis-register>
        <div class="flex flex--row--rev">
          <px-vis-register id="axisRegister" x-axis-type="linear" y-axis-type="linear" class\$="{{_getHideClass(hideAxisRegister)}}" dynamic-menu-config="[[dynamicMenuConfig]]" tooltip-data="[[_axisRegisterTooltipData]]" complete-series-config="[[_axisRegisterConfig]]" muted-series="[[mutedAxes]]" type="vertical" height="[[_registerHeight]]" display-y-values-only="" icon-color="[[_axisRegisterIconColor]]" current-page="[[_registerCurrentPage]]" total-pages="[[_registerTotalPages]]" display-page-arrows="[[_registerDisplayPageArrows]]">
          </px-vis-register>
          <div class="flex flex--col">
            <px-vis-toolbar id="toolbar" current-sub-config="[[toolbarSubConfig]]" action-config="{{actionConfig}}" within-chart="" chart-margin="[[margin]]" show-tooltip="{{_internalShowTooltip}}" config="{&quot;axisMuteSeries&quot;: true, &quot;axisDrag&quot;: true, &quot;bareZoom&quot;: true, &quot;pan&quot;: true, &quot;tooltip&quot;: true }">
            </px-vis-toolbar>
            <px-vis-svg-canvas id="svgCanvas" canvas-context="{{canvasContext}}" canvas-layers="{{canvasLayers}}" canvas-layers-config="[[canvasLayersConfig]]" svg="{{svg}}" px-svg-elem="{{pxSvgElem}}" svg-lower="{{svgLower}}" px-svg-elem-lower="{{pxSvgElemLower}}" width="[[width]]" height="[[height]]" margin="[[margin]]">
                <px-vis-annotations id="annotations" slot="4" svg="[[svg]]" x="[[x]]" y="[[y]]" margin="[[margin]]" domain-changed="[[domainChanged]]" complete-series-config="[[completeSeriesConfig]]" annotation-data="[[annotationData]]" show-strong-icon="[[showStrongIcon]]">
                </px-vis-annotations>
            </px-vis-svg-canvas>
          </div>
          <template is="dom-if" if="[[!renderToSvg]]" restamp="">
            <px-vis-line-canvas id="lineCanvas" gradient-line="" canvas-context="[[canvasContext]]" clip-path="" width="[[width]]" height="[[height]]" margin="[[margin]]" parallel-coordinates="" multi-path="" muted-opacity="0" series-id="[[seriesKey]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" time-domain="[[timeDomain]]" muted-series="[[_combinedMutedSeries]]" prevent-initial-drawing="[[_preventInitialDrawing]]">
            </px-vis-line-canvas>
          </template>
          <template is="dom-if" if="[[renderToSvg]]" restamp="">
            <px-vis-line-svg id="lineSVG" gradient-line="" svg="[[layer.0]]" parallel-coordinates="" multi-path="" muted-opacity="0" series-id="[[seriesKey]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[chartData]]" complete-series-config="[[completeSeriesConfig]]" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" time-domain="[[timeDomain]]" muted-series="[[_combinedMutedSeries]]" prevent-initial-drawing="[[_preventInitialDrawing]]" clip-path="[[seriesClipPath]]">
            </px-vis-line-svg>
          </template>
          <px-vis-clip-path svg="[[layer.0]]" x="[[x]]" y="[[y]]" width="[[width]]" height="[[height]]" margin="[[margin]]" series-clip-path="{{seriesClipPath}}">
          </px-vis-clip-path>
          <px-vis-multi-axis id="multiAxis" svg="[[layer.2]]" width="[[width]]" height="[[height]]" margin="[[margin]]" title-location="[[titleLocation]]" x="[[x]]" y="[[y]]" prevent-series-bar="" combined-muted-series="[[_combinedMutedSeries]]" hard-mute="[[hardMute]]" complete-series-config="{{completeSeriesConfig}}" series-key="[[seriesKey]]" chart-data="[[chartData]]" dimensions="[[dimensions]]" axes="[[axes]]" redraw-series="true" stroke-width="2" match-ticks="[[matchTicks]]" grid-ticks="{{gridTicks}}" grid-axis="{{gridAxis}}" common-axis="[[commonAxis]]" outer-tick-size="6" label-type-size="10" title-type-size="12" truncation-length="[[truncationLength]]" tick-values="[[tickVals]]" displayed-values="{{displayedValues}}" append-unit-in-title="" domain-changed="[[domainChanged]]" axis-groups="{{axisGroups}}" brush-domains="[[brushDomains]]" brush-to-remove="[[brushToRemove]]" category-key="[[categoryKey]]" prevent-initial-drawing="[[preventInitialDrawing]]" action-config="[[actionConfig]]" interaction-space-config="[[interactionSpaceConfig]]" time-domain="[[timeDomain]]">
          </px-vis-multi-axis>
          <template is="dom-if" if="[[matchTicks]]">
            <px-vis-gridlines svg="[[_calcGridSvg(domainChanged, svgLower)]]" tick-values="[[gridTicks]]" axis="[[gridAxis]]" margin="[[margin]]" length="[[_calcGridWidth(domainChanged)]]" orientation="left" domain-changed="[[domainChanged]]">
            </px-vis-gridlines>
          </template>
          <template is="dom-if" if="[[_showFakeGrid]]" restamp="">
            <px-vis-gridlines svg="[[svgLower]]" axis="[[_fakeGrids(height, margin)]]" margin="[[margin]]" length="[[width]]" orientation="left" domain-changed="true">
            </px-vis-gridlines>
          </template>
          <px-vis-tooltip id="tooltip" x-axis-type="linear" y-axis-type="linear" mouse-position="[[mousePosition]]" chart-data="[[chartData]]" tooltip-data="[[tooltipData]]" complete-series-config="[[_tooltipSeriesConfig]]" display-y-values-only="">
          </px-vis-tooltip>

          <template id="highlighterDomIf" is="dom-if" if="[[!renderToSvg]]" restamp="" on-dom-change="_highlighterConfigChanged">
            <px-vis-highlight-line-canvas id="highlighterCanvas" width="[[width]]" height="[[height]]" margin="[[margin]]" canvas-context="[[canvasLayers.highlighter]]" canvas-layers-config="{{canvasLayersConfig}}" layers-to-mask="[[canvasContext]]" x="[[x]]" y="[[y]]" clip-path="" parallel-coordinates="" dimensions="[[dimensions]]" domain-changed="[[domainChanged]]" time-data="[[seriesKey]]" complete-series-config="[[completeSeriesConfig]]" series-id="[[seriesKey]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[chartData]]" generating-crosshair-data="[[generatingCrosshairData]]" crosshair-data="[[crosshairData]]" default-empty-data="{{defaultEmptyData}}" muted-series="[[_combinedMutedSeries]]" hard-mute="[[hardMute]]">
            </px-vis-highlight-line-canvas>
          </template>
          <template is="dom-if" if="[[renderToSvg]]" restamp="" on-dom-change="_highlighterConfigChanged">
            <px-vis-highlight-line id="highlighter" margin="[[margin]]" svg="[[layer.1]]" layers-to-mask="[[layer.0]]" x="[[x]]" y="[[y]]" parallel-coordinates="" dimensions="[[dimensions]]" domain-changed="[[domainChanged]]" time-data="[[seriesKey]]" complete-series-config="[[completeSeriesConfig]]" series-id="[[seriesKey]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[chartData]]" generating-crosshair-data="[[generatingCrosshairData]]" crosshair-data="[[crosshairData]]" default-empty-data="{{defaultEmptyData}}" clip-path="[[seriesClipPath]]" muted-series="[[_combinedMutedSeries]]" hard-mute="[[hardMute]]">
            </px-vis-highlight-line>
          </template>

          <px-vis-cursor-line id="lineCursor" svg="[[layer.2]]" svg-data-layer="[[layer.0]]" svg-overlay-layer="[[layer.1]]" canvas-data-layer="[[canvasContext]]" canvas-overlay-layer="[[canvasLayers.highlighter]]" x="[[x]]" y="[[y]]" parallel-coordinates="" dimensions="[[dimensions]]" domain-changed="[[domainChanged]]" series-id="[[seriesKey]]" time-domain="[[timeDomain]]" complete-series-config="[[completeSeriesConfig]]" category-key="[[categoryKey]]" categories="[[categories]]" tooltip-data="[[_axisRegisterTooltipData.dataset]]" clip-path="[[seriesClipPath]]" muted-series="[[_combinedMutedSeries]]">
          </px-vis-cursor-line>
        </div>
      </div>
    </div>

    <px-tooltip id="centralTooltip" smart-orientation="" ignore-target-events="" orientation="[[tooltipOrientation]]">
      <px-vis-central-tooltip-content resources="[[resources]]" use-key-if-missing="[[useKeyIfMissing]]" language="[[language]]" first-date-time-format="[[firstDateTimeFormat]]" second-date-time-format="[[secondDateTimeFormat]]" separator="[[separator]]" timezone="[[timezone]]">
      </px-vis-central-tooltip-content>
    </px-tooltip>
`,

  is: 'px-vis-parallel-coordinates',

  behaviors: [
    PxVisBehavior.observerCheck,
    PxVisBehavior.sizing,
    PxVisBehaviorD3.svg,
    PxVisBehaviorD3.svgLower,
    PxVisBehaviorD3.canvas,
    PxVisBehaviorD3.axes,
    PxVisBehavior.dataset,
    PxVisBehavior.dimensions,
    PxVisBehavior.commonMethods,
    PxVisBehaviorScale.scaleMultiAxis,
    PxVisBehavior.chartExtents,
    PxVisBehavior.dataExtents,
    PxVisBehavior.completeSeriesConfig,
    PxVisBehaviorD3.labelTypeSize,
    PxVisBehavior.mutedSeries,
    PxVisBehaviorD3.dynamicRedraw,
    IronResizableBehavior,
    PxVisBehavior.categories,
    PxVisBehavior.commonAxis,
    PxVisBehaviorD3.selectedTimeDomain,
    PxVisBehaviorChart.saveImage,
    PxVisBehaviorChart.chartAutoResize,
    PxVisBehavior.truncating,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehavior.tooltipData,
    PxVisBehaviorD3.selectedDomain,
    PxVisBehaviorChart.waitForAttach,
    PxVisBehaviorChart.subConfiguration,
    PxVisBehaviorChart.chartCommonMethods,
    PxVisBehaviorChart.layers,
    PxColorsBehavior.dataVisColorTheming,
    PxColorsBehavior.getSeriesColors,
    PxVisBehaviorChart.axisRegister,
    PxVisBehaviorChart.categoryRegister,
    PxVisBehaviorChart.categoryAndAxisRegisterConfigs,
    PxVisBehavior.dynamicMenuConfig,
    PxVisBehaviorChart.actionRequest,
    PxVisBehaviorChart.toolbarSubConfig,
    PxVisBehaviorChart.chartToolbarConfig,
    PxVisBehaviorChart.highlighterConfigs,
    PxVisBehavior.crosshairData,
    AppLocalizeBehavior,
    PxVisBehavior.interactionSpaceConfigGeneric,
    PxVisBehaviorRenderer.base,
    PxVisBehaviorChart.combineMutes,
    PxVisBehavior.updateStylesOverride,
    PxVisBehavior.timeDomain,
    PxVisBehavior.axesDomain,
    PxVisBehaviorChart.multiAxisMuting,
    PxVisBehaviorChart.multiAxisZoom,
    PxVisBehavior.brushDomains,
    PxVisBehaviorChart.useCategoryInTooltip,
    PxVisBehaviorChart.tooltipSizing,
    PxVisBehavior.annotationData,
    PxVisBehaviorChart.interactionSpaceConfig,
    PxVisBehaviorChart.multiAxisLasso,
    PxVisBehaviorChart.sizeVerticalRegister,
    PxVisBehaviorChart.registerPagnationMultiAxis,
    PxVisBehaviorChart.centralTooltip

  ],

  /**
   * Properties block, expose attribute values to the DOM via 'notify'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * A dev set Object of which keys in the chart data should not be used as axes.
     *
     * `Required` if axes is not specified.
     *
     * ```
     *    {
     *        "Axes_to_skip_1":true,
     *        "Axes_to_skip_2":true
     *    }
     * ```
     */
    skipKeys: {
      type: Object,
      notify: true,
      value: function() { return {}; }
    },
    /**
     * A `Required` dev set string which defines which data key to use for the series lines
     *
     *  This depends on your data and could be *x*, *Timestamp*, ect.
     *
     */
    seriesKey: {
      type: String,
      notify: true
    },
    /**
     * A boolean to specify if the axis ticks should align (which affects their individual range). Default (false) is for each have their own ranges and tick marks may not align
     *
     */
    matchTicks: {
      type: Boolean,
      value: false
    },
    /**
     * A boolean to specify if axes are developer set or should be generated from the chart data
     *
     */
    generateAxesFromData: {
      type: Boolean,
      value: false
    },
    /**
    * A developer set configuration file to specify a vareity of options.
    *
    * The seriesKey can be specified to set the color for the lines.
    *
    *```
    *  {
    *     "mySeriesKey": {                  //seriesKey is a unique identifier for the configuration
    *         "color": "rgb(0,0,0)"        //color of the series lines
    *     }
    *  }
    *```
    *
    * The axes can be specified to set the title and units.
    *
    *```
    *  {
    *     "myAxis1": {
    *         "title": "My awesome title",
    *         "yAxisUnit": "Oranges"
    *     }
    *  }
    *```
    *
    *
    * The category color can also be specified if using categories.
    *
    *```
    *  {
    *     "cat1": {
    *         "color": "rgb(0,0,0)"
    *     },
    *     "cat2": {
    *         "color": "rgb(0,255,0)"
    *     }
    *  }
    *```
    */
    seriesConfig: {
      type: Object,
      notify: true,
      value: function() { return {} }
    },
    /**
     * Object representing the actual displayed titles for each axis
     */
    displayedValues: {
      type: Object
    },
    /**
     * The current bottom margin used for the label, usually changing when label rotation changes
     */
    _currentLabelRotation: {
      type: String,
      value: ''
    },
    /**
     * Boolean to check that we have chartData. Holds off observers until we do
     */
    _haveChartData: {
      type: Boolean,
      computed: '_doWeHaveChartData(chartData)'
    },
    /**
     * Whether the chart should show a fake grid until it gets data
     */
    _showFakeGrid: {
      type: Boolean,
      value: true,
      computed: '_calcShowFakeGrid(_haveChartData, y, domainChanged)'
    },
    /**
     * A seriesConfig object specifically for the tooltip
     */
    _tooltipSeriesConfig: {
      type: Object,
      value: function() { return {}; }
    },
    /**
     * Configuration object used to customize the tooltip.
     * Please refer to px-vis-tooltip (https://github.com/PredixDev/px-vis) for a list of supported properties.
     * Most interesting properties include:
     * - width
     * - height
     * - tooltipStyle
     * - forceDateTimeDisplay
     */
    tooltipConfig: {
      type: Object
    },

    margin:{
      type:Object,
      notify: true,
      value: function() {
        return {
          left: 15,
          right: 15,
          top: 10,
          bottom: 0
        };
      }
    },
    /**
     * Specifies which seriesColorOrder color to start with for assigning the series color
     */
    startColorIndex: {
      type: Number,
      value: 0
    },

     /*
     * List of key/values to be included for translating this component
     */
    resources: {
      type: Object,
      value: function() {
        return {};
      }
    },
    /**
    * set a default for localizing
    */
    language: {
      type: String,
      value: 'en'
    },
    /**
    * Use the key for localization if value for  language is missing. Should
    * always be true for  our components
    */
    useKeyIfMissing: {
      type: Boolean,
      value: true
    },
    /**
    * blocks initial drawings of axis until set to false
    */
    preventInitialDrawing: {
      type: Boolean,
      value: true
    },

    tickVals: {
      type: Object,
      value: function() {
        return {};
      }
    },

    _tickStack: {
      type: Object,
      value: function() {
        return {};
      }
    },

    _axisRegisterIconColor: {
      type: String,
      value: 'transparent'
    }
  },

  observers: [
    '_generateSeriesConfig(dimensions, seriesConfig, categories.*, seriesKey, _haveChartData, seriesColorList.*)',
    '_computeAxes(chartData.*,skipKeys.*)',
    '_computeDimensions(axes.*, mutedAxes.*)',
    '_setMutedSeriesDomain(timeDomain.x)',
    '_calcTitleLocation(svg, height, width, displayedValues.*)',

    '_tooltipConfigChanged(tooltipConfig)',
    '_toolbarConfigChanged(toolbarConfig)',
    '_highlighterConfigChanged(highlighterConfig.*)',
    '_langChanged(language)',

    '_setXScale(width,margin)',
    '_setYScale(height,margin,axes)',
    // FIXME since this doesnt fire on chartData, chartData must be updated before axes or else it doesnt work...
    '_generateDataExtents(dimensions, commonAxis, _haveChartData)', //NOTE: can remove this obs in polymer 2 since chartExtents undefined will still fire the obs
    '_generateDataExtents(dimensions, commonAxis, _haveChartData, chartExtents)',
    '_setDomain(x, y, dataExtents)',
    '_updateDomain(axesDomain.*)',
    '_calcTickVals(domainChanged)',
    '_updateTicks(axesDomain.*)',
    '_mutedCategoriesChanged(mutedSeriesCategories.*, hardMute)',

    //renderer
    '_renderChartData(domainChanged, canvasContext, chartData.*, mutedSeries.*, completeSeriesConfig.*, preventInitialDrawing, renderToSvg, _combinedMutedSeries)',
    '_renderHighlight(domainChanged, canvasLayers.highlighter, completeSeriesConfig.*, preventInitialDrawing)',

    // temporary shim to maintain backawards compatibility
    '_setTimeDomain(selectedDomain.*)',
    //similar but not temporary
    '_setTimeKey(seriesKey)'
  ],

  listeners: {
    'px-vis-axis-interaction-space-tooltip-data': '_calcTooltip',
    'px-vis-axis-interaction-space-reset-tooltip': '_hideTooltip',
    'px-vis-axis-interaction-space-crosshair-data': '_calcCrosshair',
    'px-vis-axis-interaction-space-reset-crosshair': '_hideCrosshair',
    'px-vis-muted-series-updated': '_muteUnmute',
    "px-data-vis-colors-applied" : '_generateSeriesConfig',
    'px-vis-axis-interaction-space-extents-data': '_setExtentsData',
    'px-vis-drag-dimension-swapped' : '_axisDragged'
  },

  detached: function() {
    this.set('preventInitialDrawing', true);
  },

  attached: function() {

    //we probably are re-attaching. if nothing has changed (neither series nor size) we might
    //still need to kick this in order for preventInitialDrawing to go false
    if(this.displayedValues) {
      window.requestAnimationFrame(function() {
        this._calcTitleLocation();
      }.bind(this));
    }
  },

  ready: function() {
    this.set('numberOfLayers', 3);
    this.set('_verticalRegisterDrawingCanvasId', 'svgCanvas');
    this.set('_verticalRegisterHeightDeductions', ['toolbar']);
  },

  _doWeHaveChartData: function(cD) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    if(this.chartData && this.chartData.length > 0) {
      return true;
    }
  },

  _tooltipConfigChanged: function(conf) {
     if(this.hasUndefinedArguments(arguments)) {
       return;
     }

     this._applyConfigToElement(this.tooltipConfig, this.$.tooltip);
   },

  _toolbarConfigChanged: function(conf) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    this._applyConfigToElement(this.toolbarConfig, this.$.toolbar);
  },

  _highlighterConfigChanged: function(conf) {

    var elem = this.renderToSvg ? this.$$('#highlighter') : this.$$('#highlighterCanvas');
    if(elem && this._doesObjHaveValues(this.highlighterConfig)) {
      this._applyConfigToElement(this.highlighterConfig, elem);
    }
  },

  /**
   * At ready, set the margin and titleLocation objects
   *
   */
  _calcTitleLocation: function(svg, height, width, displayedValues) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    this.debounce('calcTitleLocation', function() {

      var textWidth = 0,
          _this = this,
          keys = Object.keys(this.displayedValues),
          values = [];

      for(var i=0; i<keys.length; i++) {
        values.push(this.displayedValues[keys[i]]);
      }

      // append and remove the dimensions text so we can measure how long
      var labels = this.svg.selectAll('.dummyText')
        .data(values);
        labels.enter()
        .append("text")
        .attr('class',"dummyText")
        .attr('font-size', this.labelTypeSize + 'px')
        .attr('font-style','GE Inspira Sans')
        .text(function(d) {
          return d;
        })
        .each(function(d,i) {
          var w = this.getComputedTextLength();
          textWidth = Math.max(w,textWidth);
          this.remove(); // remove them just after displaying them
        });

      // add a bit for a margin between text labels
      textWidth += 10;

      var isVertical = this.width / values.length < textWidth,
          newRotation = isVertical ? 'vertical' : 'horizontal',
          newBottomMargin = isVertical ? textWidth : (this.labelTypeSize + 10),
          rotation = isVertical ? '-90' : '0',
          yPos = isVertical ? (this.height - newBottomMargin) : this.height + 10 - newBottomMargin,
          anchor = isVertical ? 'end' : 'middle';

        //update size if needed
        if(this.margin.bottom !== newBottomMargin) {
          var m = this.margin;
          this.set('margin', { "top": m.top, "right": m.right, "left": m.left, "bottom": newBottomMargin});
        }

        //set title location if rotation or y has changed
        if(newRotation !== this._currentLabelRotation ||
            yPos !== this.titleLocation.y) {

          this.set('titleLocation', {
            'x': '3',
            'y': yPos,
            'r': rotation,
            'anchor': anchor
          });
        }

        this.set('preventInitialDrawing', false);

    }.bind(this), 5);
  },

  /**
   * Method to compute the axes to use. It will use all the keys in the data except those specified in skipKeys
   *
   */
  _computeAxes: function(cD, sK) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this._doesObjHaveValues(this.chartData)) {
      var axes;
      // add series and category key to skipKeys
      this.skipKeys[this.seriesKey] = true;
      if(this.categoryKey) {
        this.skipKeys[this.categoryKey] = true;
      }

      if(this.generateAxesFromData) {
        if(typeof(this.axes) === 'undefined') {
          // TODO what if the first object doesnt have all the dimensions?
          axes = Object.keys(this.chartData[0]).filter(function(d) {
            return !this.skipKeys[d];
          }.bind(this));
        } else {
          var newAxes = Object.keys(this.chartData[0]).filter(function(d) {
            // what if they add data but dont want all axes, only the ones previously specified?
            return !this.skipKeys[d] && this.axes.indexOf(d) === -1;
          }.bind(this));
          //make sure we remove axis that are not there anymore
          var oldAxes = this.axes.filter(function (d) {
            return Object.keys(this.chartData[0]).indexOf(d) !== -1 && !this.skipKeys[d];
          }.bind(this));
          axes = oldAxes.concat(newAxes);
        }

        this.set('axes',axes);
      }
    }
  },

  /**
   * Method to compute the dimensions to use by using axes and mutedAxes.
   *
   */
  _computeDimensions: function(axes, muted) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this._doesObjHaveValues(this.axes)) {
      if(this._doesObjHaveValues(this.mutedAxes)) {
        var dims = this.axes.filter(function(d) {
          //only get dims that are not in dims, not supposed to be skiped, and not muted
          return !this.mutedAxes[d];
        }.bind(this));
        this.set('dimensions',dims);
      } else {
        this.set('dimensions',this.axes);
      }
    } else if(this.dimensions && this.dimensions.length > 0) {
      this.set('dimensions',[]);
    }
  },

  /**
   * Creates the series configuration file
   *
   */
  _generateSeriesConfig: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    this.debounce('_generateSeriesConfig', function() {

      //wait for colors design to have finished processing...
      if(this.seriesColorList.length && this._haveChartData && this._doesObjHaveValues(this.dimensions)) {
        var config = (this.seriesConfig) ? this.clone(this.seriesConfig) : {};

        // add a seriesConfig with seriesKey as default
        if(!config[this.seriesKey]) {
          config[this.seriesKey] = {};
        }

        if(!config[this.seriesKey]['name']) {
          config[this.seriesKey]['name'] = this.seriesKey;
        }

        if(!config[this.seriesKey]['x']) {
          config[this.seriesKey]['x'] = this.dimensions;
        }

        if(!config[this.seriesKey]['y']) {
          config[this.seriesKey]['y'] = this.dimensions;
        }

        if(!config[this.seriesKey]['color']) {
          config[this.seriesKey]['color'] = this._getColor(this.startColorIndex);
        }

        // if categories are specified, use them
        if(typeof(this.categoryKey) !== 'undefined') {

          for(var i = 0; i < this.categories.length; i ++) {
            if(!config[this.categories[i]]) {

              //no config, create one
              config[this.categories[i]] = {
                "color": this._getColor(this.startColorIndex + i),
                "name": this.categories[i],
                "x": this.dimensions,
                "y": this.dimensions
              }
            } else {

              //there's a config, make sure it has everything
              config[this.categories[i]].color = config[this.categories[i]].color ? config[this.categories[i]].color : this._getColor(this.startColorIndex + i);
              config[this.categories[i]].name = config[this.categories[i]].name ? config[this.categories[i]].name : this.categories[i];
              config[this.categories[i]].x = config[this.categories[i]].x ? config[this.categories[i]].x : this.dimensions;
              config[this.categories[i]].y = config[this.categories[i]].y ? config[this.categories[i]].y : this.dimensions;
            }
          }
        }

        this.set('completeSeriesConfig',config);
      }
    }.bind(this), 20);
},

  /**
   * Adds data to a muted series based on the selected domain
   *
   */
  _setMutedSeriesDomain: function(sd) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    this.debounce('muted_series_domain',function() {
      if(!sd || !sd.length) { return; }

      if(this.chartData && this.chartData.length > 0) {
        var muted = {};
        for(var i = 0; i < this.chartData.length; i++) {
          if(this.chartData[i][this.seriesKey] < sd[0] || this.chartData[i][this.seriesKey] > sd[1]) {
            muted[this.chartData[i][this.seriesKey]] = true;
          }
        }
        this.set('mutedSeriesDomain',muted);
      }
    },200);
  },

  /**
   * Forces the chart to resize and redraw
   */
  resizeChart: function() {
    this._onIronResize();
  },

  /**
   * Resizes the chart based on a container resize if prevent-resize is false (default)
   *
   * Can also be called manually to force a chart resize to container.
   */
  _resizeCalculations: function() {

    var wrapperRect = this.$.wrapper.getBoundingClientRect(),
        axisRegisterWidth = this.hideAxisRegister ? 0 : this.$.axisRegister.getBoundingClientRect().width,
        categoryRegisterHeight = this._hideCategoryRegister ? 0 : this.$.categoryRegister.getBoundingClientRect().height,
        toolbarRect = this.$.toolbar.getBoundingClientRect(),
        widthDeduct = 0,
        heightDeduct = 0,
        w,h;

    heightDeduct += categoryRegisterHeight;
    heightDeduct += toolbarRect.height;
    widthDeduct += axisRegisterWidth;

    w = Math.max(wrapperRect.width - widthDeduct, 0);
    h = Math.max(wrapperRect.height - heightDeduct, 0);

    if(this.width !== w) {
      this.set('preventInitialDrawing', true);
      this.set('width', w);
    }
    if(this.height !== h) {
      this.set('preventInitialDrawing', true);
      this.set('height', h);
      this._computeVerticalRegisterHeight([toolbarRect.height]);
    }
  },

  /**
   * Returns the width for the gridlines
   *
   */
  _calcGridWidth: function() {
    if(this.domainChanged) {
      // overall width minus the inset for the axes
      return this.width - this.x(this.dimensions[0]) * 2;
    }
  },

  /**
   * Retruns a g elem for the grid to draw to
   *
   */
  _calcGridSvg: function() {
    if(this.domainChanged && this.svgLower) {
      // create a g and move it so it lines up with the first axis
      var currentG = this.svgLower.select('.gridGroup');

      if(!currentG.node()) {
        return this.svgLower.append('g')
          .attr("class", "gridGroup")
          .attr("transform", "translate(" + this.x(this.dimensions[0]) + ",0)");
      } else {
        return currentG.attr("transform", "translate(" + this.x(this.dimensions[0]) + ",0)");
      }
    }
  },

  /**
   * Imperatively mute an axis or group of axes.
   *
   * This function both addes the axes to the mutedAxes list and fires a notifyPath
   *
   * Can pass a single axis id or an array of axes ids
   */
  addToMutedAxes: function(a) {
    this._changeMutedAxes(a,true);
  },

  /**
   * Imperatively mute an axis or group of axes.
   *
   * This function both addes the axes to the mutedAxes list and fires a notifyPath
   *
   * Can pass a single axis id or an array of axes ids
   */
  removeFromMutedAxes: function(a) {
    this._changeMutedAxes(a,false);
  },

  /**
   * Helper function to imperatively mute/unmute an axis or group of axes.
   *
   */
  _changeMutedAxes: function(a,bool) {
    var mA = {},
        keys = Object.keys(this.mutedAxes);

    //copy object
    for(var i=0; i<keys.length; i++) {
      mA[keys[i]] = this.mutedAxes[keys[i]];
    }

    if(typeof(a) === 'string') {

      mA[a] = bool;
      this.set('mutedAxes', mA);
    } else if(Array.isArray(a)) {

      for(var i = 0; i < a.length; i++) {
        mA[ a[i] ] = bool;
      }
      this.set('mutedAxes', mA);
    } else {
      console.error("Cannot add/remove axis. Improper axis type")
    }
  },

  _calcTooltip: function(evt) {

   var d = evt.detail;

   //Our d.series only has one series since each axis only knows about itself.
   // So, to display in register, create a copy with data for the associated axes
   this._buildAxisTooltipData(d.dataset, d.time);
   this.set('_axisRegisterIconColor', d.color);

   if(this.showTooltip && d.tooltipConfig) {
     this._doTooltipCalcs(d);
   }

   this.set('tooltipData', d);
   this._resetPages();
 },

  _hideTooltip: function(evt) {
    if(this.defaultEmptyData && this.defaultEmptyData.dataset) {
      this._calcTooltip({"detail": this.defaultEmptyData});
      return;
    }

    //hide tooltip
    this.set('tooltipData', evt.detail);
    this.set('mousePosition', [-1000,-1000]);

    //clear axis register
    this._buildAxisTooltipData();
    this.set('_axisRegisterIconColor', 'transparent');

    this._resetPages();
  },

  _doTooltipCalcs: function(d) {
    if(this.useCategoryInTooltip) {
      //try to fetch category name
      var key = Object.keys(d.tooltipConfig)[0],
          cat = d.dataset[this.categoryKey],
          title;

      if(cat) {
        // we have a category, use name if it has been defined,
        // create one otherwise
        if(this.completeSeriesConfig[cat] && this.completeSeriesConfig[cat].name.toString() !== cat) {
          title = this.completeSeriesConfig[cat].name;
        } else {
          title = this.categoryKey + ' - ' + cat;
        }

        d.tooltipConfig[key].name = title;
      }
    }

    if(!this._svgClientRect || !this._canvasClientRect) {
      this._getImmediateSizing();
    }

    //calc the screen positions for the tooltip
    var screenX = this.x(d.axis) + this._svgClientRect.left + this._winX + 15,
        screenY = this.y[d.axis](d.yVal) + this.margin.top + this._svgClientRect.top + this._winY;

    this.set('mousePosition', [screenX, screenY]);
    this.set('_tooltipSeriesConfig', d.tooltipConfig);
  },

  _calcCrosshair: function(evt) {
    this.generatingCrosshairData = true;
    this.set('crosshairData', evt.detail);
  },

  _hideCrosshair: function(evt) {
    this.generatingCrosshairData = false;
    this.set('crosshairData', evt.detail);
  },

  _fakeGrids: function(height, margin) {
    var h = height - margin.top - margin.bottom;
    return Px.d3.scaleLinear().nice().range([h, 0]);
  },

  _calcShowFakeGrid: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    var draw = false;
    if(this._haveChartData && Object.keys(this.y).length > 0) {
      var k = Object.keys(this.y)[0];
      draw = this.y[k].domain().length > 0 ? false : true;
    }
    return draw;
  },

  deleteAllBrushes: function() {
    this.$.multiAxis.deleteAllBrushes();
  },

  /**
   * Mute/unmute axis on register requests
   */
  _muteUnmute: function(evt) {

    //only care if it's an axis and it comes from a register
    if(evt.detail.fromRegister && this.axes.indexOf(evt.detail.name) !== -1) {
      if(evt.detail.value) {
        this.addToMutedAxes(evt.detail.name);
      } else {
        this.removeFromMutedAxes(evt.detail.name);
      }
    }
  },

  _langChanged: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    //recreate X and Y in case d3 locale changed
    this._recreateScales();
  },

  // shim to maintain backwards compatibility
  // REMOVE on next Major
  _setTimeDomain: function() {
    if(this.selectedDomain && this.selectedDomain.x && this.selectedDomain.x.length) {
      this.set('timeDomain', this.selectedDomain);
    }
  },

  _setTimeKey: function() {
    if(this.seriesKey) {
      this.set('timeKey', this.seriesKey);
    }
  },

  _setExtentsData: function(e) {
    if(!e.detail.extents) { return; }

    this.extentsAction = e.detail.action;

    var extentsData = {};
    extentsData.dimension = e.detail.dimension;
    extentsData.extents = e.detail.extents;

    this.set('extentsData', extentsData);
  },

  /**
   * In order to make the ticks align, we iterate through and generate some round numbers for each axis
   *
   */
  _calcTickVals: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }

    if(this._isObjEmpty(this.y) ||
        this._doesObjHaveValues(this.axesDomain)) { return; }

    if(this.commonAxis) {
      var key = Object.keys(this.y)[0];
      this.set('gridAxis', this.y[key]);
      this.set('tickVals', null);
      this.set('gridTicks', null);

      return;
    }

    var tickVals = {};

    if(this.matchTicks && !this.singleDomain) {
      var keys = Object.keys(this.y),
          vals = [],
          d,
          min,
          max,
          diff,
          key;

      for(var i=0; i < keys.length; i++) {
        key = keys[i];
        d = this.y[key].domain();
        min = Math.floor(d[0]/10)*10;
        max = Math.ceil(d[1]/10)*10;
        diff = (max - min) / 10;
        vals = [];

        for(var j = 0; j < 11; j++){
          vals.push(min + diff * j);
        }
        tickVals[key] = vals;
      }

      this.set('gridTicks', tickVals[keys[0]]);
      this.set('gridAxis', this.y[keys[0]]);
    }

    this.set('tickVals', tickVals);
  },

  _updateTicks: function(axesDomain) {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    if(!this.matchTicks || this.commonAxis) { return; }

    var dims = Object.keys(axesDomain.value);

    // if a zoom and we have not stored ticks, store them
    if(dims.length === 1 && !this._tickStack[dims[0]]) {
      this._saveTicks(dims[0]);

    // otherwise it is some kind of reset
    } else {
      for(var i = 0; i < dims.length; i++) {
        this._checkIfTickVals(dims[i]);
      }
    }
  },

  _saveTicks: function(dim) {
    this._tickStack[dim] = this.tickVals[dim];
    this.set('tickVals.' + dim, null);
  },

  _checkIfTickVals: function(dim) {
    if(this._tickStack[dim]) {
      var d = this.y[dim].domain(),
          l = this._tickStack[dim].length - 1;

      // are we resetting?
      if(this._tickStack[dim][0] === d[0] && this._tickStack[dim][l] === d[1]) {
        this.set('tickVals.' + dim, this._tickStack[dim]);
        delete this._tickStack[dim];
      }
    }
  },

  _mutedCategoriesChanged: function() {
    if(this.hasUndefinedArguments(arguments)) {
      return;
    }
    if(this.hardMute === true) {
      this._generateDataExtents();
    }
  },

  _axisDragged: function() {
    this.$.annotations.set('forceRecalc', !this.$.annotations.forceRecalc);
  }
});