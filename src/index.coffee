'use strict'
module = null
try
  module = angular.module 'ndx'
catch e
  module = angular.module 'ndx', []
module.directive 'dragPanel', ->
  restrict: 'AE'
  require: '?ngModel'
  link: (scope, elem, attrs, ctrl) ->
    horizontal = elem.hasClass 'horizontal'
    pageDir = 'pageY'
    elemDir = 'height'
    dividers = $(elem).children('.divider')
    if horizontal
      pageDir = 'pageX'
      elemDir = 'width'
      dividers.addClass('horizontal')
    measure = 0
    prev = null
    pagePos = 0
    setFromArr = (arr) ->
      allPanels = $(elem).children(':not(.divider)')
      for p, i in allPanels
        $(p).css
          flex: (if arr then arr[i] else 1).toString()
    if attrs.remote
      remote = 
        setHorizontal: ->
          elem.addClass 'horizontal'
          pageDir = 'pageX'
          elemDir = 'width'
          dividers.addClass 'horizontal'
          setFromArr()
        setVertical: ->
          elem.removeClass 'horizontal'
          pageDir = 'pageY'
          elemDir = 'height'
          dividers.removeClass 'horizontal'
          setFromArr()
      scope[attrs.remote] = remote
    dividers.bind 'mousedown', (e) ->
      e.preventDefault()
      $target = $(e.target)
      $target.addClass 'dragging'
      prev = $target.prev()
      next = $target.next()
      measure = prev[elemDir]()
      nextMeasure = next[elemDir]()
      pagePos = e[pageDir]
      allPanels = $(elem).children(':not(.divider)')
      measures = []
      for p in allPanels
        $p = $(p)
        measures.push $p[elemDir]()
      for p, i in allPanels
        $p = $(p)
        $p.css
          flex: measures[i].toString()
      $(document).bind 'mousemove', (e) ->
        offset = pagePos - e[pageDir]
        newPrev = measure - offset
        newNext = nextMeasure + offset
        if newPrev > 0 and newNext > 0
          prev.css
            flex: newPrev.toString()
           next.css
            flex: newNext.toString()
      end = ->
        $(document).unbind 'mousemove'
        $(document).unbind 'mouseup'
        $target.removeClass 'dragging'
        if ctrl
          sizes = []
          for p in allPanels
            sizes.push $(p)[elemDir]()
          ctrl.$setViewValue sizes
      $(document).bind 'mouseup', (e) ->
        end()
      $(document).mouseleave (e) ->
        end()
    if ctrl
      ctrl.$formatters.unshift (val) ->
        setFromArr val
        val
    else
      setFromArr()