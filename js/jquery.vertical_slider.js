(function ($) {
  $.fn.vertical_slider = function (options_or_key, value) {
    var self = this;
    var initialize = function initialize(options) {
      options = $.extend({
        height: this.height() || 100,
        step: .1,
        button: true,
        onchange: function (pos) {}
      }, options);

      var sliderHeight = options.height;
      var step = options.step;

      var plus, minus, vbar, hbar;

      var cont  = $('<div/>', {class: "jquery-vertical-slider"})
        .append(plus  = $('<div/>', {class: (options.button) ? "jquery-vertical-slider-plus" : "jquery-vertical-slider-cover-top"}))
        .append(minus = $('<div/>', {class: (options.button) ? "jquery-vertical-slider-minus" : "jquery-vertical-slider-cover-bottom"}))
        .append(vbar  = $('<div/>', {class:"jquery-vertical-slider-vbar"}))
        .append(hbar  = $('<div/>', {class:"jquery-vertical-slider-hbar"}));

      this.append(cont);

      var zoomRatioMin = 0.5;
      var zoomRatioMax = 2.2;
      var hbarMoving = false;
      var minusHeight = minus.height();
      var plusHeight = plus.height();
      var hbarPositionOffset = plusHeight - 8;
      var hbarPositionMax = sliderHeight - plusHeight - minusHeight - 4;
      var lastMouseY = 0;
      var hbarPosition = 0;
      var lastHbarPosition = 0;

      vbar.css({
        'height': (sliderHeight - plusHeight / 2 - minusHeight / 2) + 'px',
        'top': plusHeight / 2 + 'px'
      });
      minus.css('top', (sliderHeight - minusHeight) + 'px');

      var onChanged = function(fn) {
        if (fn !== void(0)) options.onchange = fn;
        return options.onchange;
      };

      var normalizedPosition = function normalizedPosition(pos, disableCallback) {
        if (pos === void(0))
          return 1 - hbarPosition / hbarPositionMax;
        else
          setPositionHbar((1 - pos) * hbarPositionMax, disableCallback);
      }

      var setPositionHbar = function setPositionHbar(pos, disableCallback) {
        pos = Math.min(Math.max(pos, 0), hbarPositionMax);
        hbar.css('top', pos + hbarPositionOffset + 'px');
        if (hbarPosition != pos) {
          hbarPosition = pos;
          if (!disableCallback)
            options.onchange.call(self, normalizedPosition());
        }
        return pos;
      }

      var moveHandler = function moveHandler(e) {
        if (hbarMoving) {
          var dist = e.pageY - lastMouseY;
          setPositionHbar(lastHbarPosition + dist);
        }
        return false;
      }

      var upHandler = function upHandler(e) {
        hbarMoving = false;
        $(document).unbind("mousemove", moveHandler);
        $(document).unbind("mouseup", upHandler);
        return false;
      }

      hbar.mousedown(function(e) {
        hbarMoving = true;
        lastHbarPosition = hbarPosition;
        lastMouseY = e.pageY;
        $(document).mousemove(moveHandler);
        $(document).mouseup(upHandler);
        return false;
      });
      vbar.click(function(e) {
        setPositionHbar(e.offsetY);
        lastMouseY = e.pageY;
      });
      if (options.button) {
        plus.click(function(e) {
          setPositionHbar(hbarPosition - step * hbarPositionMax);
        });
        minus.click(function(e) {
          setPositionHbar(hbarPosition + step * hbarPositionMax);
        });
      }

      this.data('vertical_slider', { position: normalizedPosition, change: onChanged });

      setPositionHbar(hbarPositionMax);
    }

    var accessor = function accessor(key, value) {
      var data = this.data('vertical_slider');
      return data[key](value);
    }

    if (options_or_key === void(0))
      options_or_key = {};

    if (typeof options_or_key == 'object') {
      initialize.call(this, options_or_key);
      return this.data('vertical_slider');
    } else if (typeof options_or_key == 'string' || options_or_key instanceof String) {
      return accessor.call(this, options_or_key, value);
    }
  };
})(jQuery);

/*
 * vim: sts=2 sw=2 ts=2 et
 */
