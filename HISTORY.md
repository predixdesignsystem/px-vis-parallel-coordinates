v2.0.0
==================
* Upgrade to vis 2.0.0
* Adds highlight components for optional crosshair
* Add cursor component
* Categories colorscan now be configured through seriesConfig
* Ensure category and axis register gets category color
* Add toolbar control over the axis actions
* Toolbar now controls axis actions
* Internationalization support
* Breaking changes:
  * Implement toolbar to control interactions. You can no longer have multiple interactions on the same mouse event (IE drag and brush)

v1.2.0 && v1.2.1
==================
* clearfix PR

v1.1.4
==================
* removed console logs

v1.1.3
==================
* fixed tooltip positioning on IE

v1.1.2
==================
* removed cleanOnDetached

v1.1.1
==================
* fixed register not muted with mutedAxes on start

v1.1.0
==================
* upgraded to vis 1.1.0
* progressive rendering now can be customized through progressiveRenderingPointsPerFrame (16000 by default for lines, 2000 byy default for scatter) and progressiveRenderingMinimumFrames. Increase progressiveRenderingPointsPerFrame for better performance and decrease for smoother drawing. When at the right value no performance cost incurs and drawing is smooth but if value is too small can incur a performance cost (i.e the drawing will take longer but will still start at the same time, also the UI won't be frozen)
* added cleanOnDetached to allow reuse of the chart after detaching it from the dom. This is aimed at applications creating charts dynamically so that they can keep a pool of charts (simple array of charts) when removing them from the dom and reusing them later on with new data and config, improving performance . Turning cleanOnDetached on will make sure the chart will clear everything needed so that it draws properly with any new config. If using this strategy one thing to keep in mind is making sure the chart is re-appended in the dom *before* changing its properties to their new values. In most cases it would work even if appending it after, but some edge cases scenarios might fail to clean some visual artifact (for example switching from canvas to svg while deleting a few series at the same time). When moving the chart around the dom do not turn it on for performance boost and making sure you don't need the chart to force redrawing. This can be changed dynamically
* added debounceResizeTiming to control the debounce timing on auto resize, changed default from 100ms to 250ms

v1.0.2
==================
* API doc update

v1.0.1
==================
* Fixing dark theme demo

v1.0.0
==================
* Added tooltipConfig
* Tooltip doesn't show timestamp by default anymore. To enable it use forecDateTimeDisplay in tooltipConfig
* added PxVisBehaviorChart.chartCommonMethods
* associated changes to use those methods
* Added layers
* Added lower svg
* Changed demo to use iron-ajax
* Changed line to line-svg
* Added axis register (on the right) and category register (on top, only if using categories).
Can be hidden respectively with hideAxisRegister and hideCategoryRegister. Can be configured respectively with axisRegisterConfig and categoryRegisterConfig
* Axis register can have dynamic menus
* Tooltip is now off by default. Enable with showTooltip
* Added toolbar, configurable through toolbarConfig
* changing ghp.sh to account for Alpha releases

v0.4.3
==================
* Fix bower dependencies

v0.4.2
==================
* Fix color dependency

v0.4.1
==================
* Themeable

v0.4.0
==================
* Updated dependencies

v0.3.10
==================
* updating slider dependency

v0.3.9
==================
* changing all devDeps to ^

v0.3.8
==================
* Update px-theme to 2.0.1 and update test fixtures

v0.3.7
==================
* update dependencies for dropdown

v0.3.6
==================
* removing px-theme style call

v0.3.5
==================
* changing Gruntfile.js to gulpfile.js

v0.3.4
==================
* bower updating px-demo-snippet

v0.3.3
==================
* removed chartExtents from demo to fix codepen

v0.3.2
==================
* Updated dependencies

v0.3.1
==================
* demo
* associated changes to make more dynamic
* delay loading until attached

v0.3.0
==================
* move to px-vis 0.6.0

v0.2.2
==================
* fixed muting to now use opacity. fixed multi path issue

v0.2.1
==================
* Upgrade to px-vis 0.5.0 and associated change to line

v0.2.0
==================
* Gulp upgrade

v0.1.20
==================
* fixed errors when muting all axes

v0.1.19
==================
* added deleteAllBrushes method

v0.1.18
==================
* fixed tooltip positioning

v0.1.17
==================
* fixed muted series bug where brushes dont work if axes are specified before chartdata
* fixed margins so they can still be dev set

v0.1.16
==================
* fixed grid bug where starting with an empty chart would then delete the new grid

v0.1.15
==================
* changed tooltip target

v0.1.14
==================
* added tooltip

v0.1.13
==================
* added check if all data is one value

v0.1.12
==================
* added default grid when no valid axes can be displayed

v0.1.11
==================
* fixed bug where adding to skipKeys did not remove an existing key

v0.1.10
==================
* fixed bug on muting first axis causes grid to disappear

v0.1.9
==================
* added axis brush update on domainchange

v0.1.8
==================
* merged

v0.1.7
==================
* update to px-vis 2.0 which incorporates many timing fixes

v0.1.6
==================
* small bug fixes with bottom margin for labels and console error when changing selected domain with no data set

v0.1.5
==================
* fixed muting edge case where axis id has a '.'

v0.1.4
==================
* added imperative mute / unmute of axes

v0.1.3
==================
* Fix bug when removing axis through data

v0.1.2
==================
* enforce label update

v0.1.1
==================
* documentation updates
* demo updates

v0.1.0
==================
* Added ability to mute / unmute axes

v0.0.12
==================
* Added support for units in axis labels

v0.0.11
==================
* Adding truncation for labels

v0.0.10
==================
* Added preventResize and preventCanvasProgressiveRendering

v0.0.9
==================
* Updated demo dataset timerange

v0.0.8
==================
* import chart behavior

v0.0.7
==================
* adding support for exporting chart to image

v0.0.6
==================
* Rangepicker compatibility

v0.0.5
==================
* Fix demo navigator

v0.0.4
==================
* Fix path for demo data

v0.0.3
==================
* added auto github pages build

v0.0.2
==================
* Improved demo

v0.0.1
==================
* Initial release
