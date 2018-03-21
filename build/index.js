(function() {
  'use strict';
  var e, module;

  module = null;

  try {
    module = angular.module('ndx');
  } catch (error) {
    e = error;
    module = angular.module('ndx', []);
  }

  module.directive('dragPanel', function($timeout) {
    return {
      restrict: 'AE',
      require: '?ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var dividers, elemDir, horizontal, measure, pageDir, pagePos, prev, setFromArr;
        horizontal = elem.hasClass('horizontal');
        pageDir = 'pageY';
        elemDir = 'height';
        dividers = $(elem).children('.divider');
        if (horizontal) {
          pageDir = 'pageX';
          elemDir = 'width';
          dividers.addClass('horizontal');
        }
        measure = 0;
        prev = null;
        pagePos = 0;
        setFromArr = function(arr) {
          var allPanels, i, j, len, p, results;
          allPanels = $(elem).children(':not(.divider)');
          results = [];
          for (i = j = 0, len = allPanels.length; j < len; i = ++j) {
            p = allPanels[i];
            results.push($(p).css({
              flex: (ctrl ? ctrl.$modelValue[i] : 1).toString()
            }));
          }
          return results;
        };
        dividers.bind('mousedown', function(e) {
          var $target, allPanels, end, j, len, next, nextMeasure, p, setOrig;
          e.preventDefault();
          $target = $(e.target);
          $target.addClass('dragging');
          prev = $target.prev();
          next = $target.next();
          measure = prev[elemDir]();
          nextMeasure = next[elemDir]();
          pagePos = e[pageDir];
          allPanels = $(elem).children(':not(.divider)');
          setOrig = function(p) {
            var $p, mymeasure;
            $p = $(p);
            mymeasure = $p[elemDir]();
            return $timeout(function() {
              return $p.css({
                flex: mymeasure.toString()
              });
            });
          };
          for (j = 0, len = allPanels.length; j < len; j++) {
            p = allPanels[j];
            setOrig(p);
          }
          $(document).bind('mousemove', function(e) {
            var newNext, newPrev, offset;
            offset = pagePos - e[pageDir];
            newPrev = measure - offset;
            newNext = nextMeasure + offset;
            if (newPrev > 0 && newNext > 0) {
              prev.css({
                flex: newPrev.toString()
              });
              return next.css({
                flex: newNext.toString()
              });
            }
          });
          end = function() {
            var k, len1, sizes;
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            $target.removeClass('dragging');
            if (ctrl) {
              sizes = [];
              for (k = 0, len1 = allPanels.length; k < len1; k++) {
                p = allPanels[k];
                sizes.push($(p)[elemDir]());
              }
              return ctrl.$setViewValue(sizes);
            }
          };
          $(document).bind('mouseup', function(e) {
            return end();
          });
          return $(document).mouseleave(function(e) {
            return end();
          });
        });
        if (ctrl) {
          console.log('unshifting');
          return ctrl.$formatters.unshift(function(val) {
            setFromArr(val);
            return val;
          });
        } else {
          return setFromArr();
        }
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
