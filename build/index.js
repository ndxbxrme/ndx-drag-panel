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

  module.directive('dragPanel', function() {
    return {
      restrict: 'AE',
      require: '?ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var dividers, elemDir, horizontal, measure, pageDir, pagePos, prev, remote, setFromArr;
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
              flex: (arr ? arr[i] : 1).toString()
            }));
          }
          return results;
        };
        if (attrs.remote) {
          remote = {
            setHorizontal: function() {
              elem.addClass('horizontal');
              pageDir = 'pageX';
              elemDir = 'width';
              dividers.addClass('horizontal');
              return setFromArr();
            },
            setVertical: function() {
              elem.removeClass('horizontal');
              pageDir = 'pageY';
              elemDir = 'height';
              dividers.removeClass('horizontal');
              return setFromArr();
            }
          };
          scope[attrs.remote] = remote;
        }
        dividers.bind('mousedown', function(e) {
          var $p, $target, allPanels, end, i, j, k, len, len1, measures, next, nextMeasure, p;
          e.preventDefault();
          $target = $(e.target);
          $target.addClass('dragging');
          prev = $target.prev();
          next = $target.next();
          measure = prev[elemDir]();
          nextMeasure = next[elemDir]();
          pagePos = e[pageDir];
          allPanels = $(elem).children(':not(.divider)');
          measures = [];
          for (j = 0, len = allPanels.length; j < len; j++) {
            p = allPanels[j];
            $p = $(p);
            measures.push($p[elemDir]());
          }
          for (i = k = 0, len1 = allPanels.length; k < len1; i = ++k) {
            p = allPanels[i];
            $p = $(p);
            $p.css({
              flex: measures[i].toString()
            });
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
            var l, len2, sizes;
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            $target.removeClass('dragging');
            if (ctrl) {
              sizes = [];
              for (l = 0, len2 = allPanels.length; l < len2; l++) {
                p = allPanels[l];
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
