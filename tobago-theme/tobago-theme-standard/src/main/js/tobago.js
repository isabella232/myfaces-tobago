(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // XXX remove me, for cleanup
  class DomUtils {
      /**
       * Find all elements (and also self) which have the attribute "attributeName".
       * @param element Starting element in DOM to collect.
       * @param selectors Name of the attribute of the elements to find.
       */
      // todo: may return NodeListOf<HTMLElementTagNameMap[K]> or something like that.
      static selfOrQuerySelectorAll(element, selectors) {
          const result = new Array();
          if (!element) {
              element = document.documentElement;
          }
          if (element.matches(selectors)) {
              result.push(element);
          }
          for (const found of element.querySelectorAll(selectors)) {
              result.push(found);
          }
          return result;
      }
      /**
       * @param element with transition
       * @return transition time in milliseconds
       */
      static getTransitionTime(element) {
          const style = window.getComputedStyle(element);
          const delay = Number.parseFloat(style.transitionDelay);
          const duration = Number.parseFloat(style.transitionDuration);
          return (delay + duration) * 1000;
      }
  }

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Bar extends HTMLElement {
      constructor() {
          super();
          this.CssClass = {
              SHOW: "show",
              COLLAPSE: "collapse",
              COLLAPSING: "collapsing"
          };
          this.toggleButton.addEventListener("click", this.toggleCollapse.bind(this));
      }
      connectedCallback() {
          this.expanded = this.toggleButton.ariaExpanded === "true";
      }
      toggleCollapse(event) {
          window.clearTimeout(this.timeout);
          if (this.expanded) {
              this.expanded = false;
              this.navbarContent.style.height = `${this.navbarContent.scrollHeight}px`;
              this.navbarContent.offsetHeight; //force reflow, to make sure height is set
              this.navbarContent.classList.add(this.CssClass.COLLAPSING);
              this.navbarContent.classList.remove(this.CssClass.COLLAPSE);
              this.navbarContent.classList.remove(this.CssClass.SHOW);
              this.navbarContent.style.height = null;
              this.timeout = window.setTimeout(() => {
                  this.navbarContent.classList.remove(this.CssClass.COLLAPSING);
                  this.navbarContent.classList.add(this.CssClass.COLLAPSE);
                  this.toggleButton.ariaExpanded = "false";
              }, DomUtils.getTransitionTime(this.navbarContent));
          }
          else {
              this.expanded = true;
              this.navbarContent.classList.remove(this.CssClass.COLLAPSE);
              this.navbarContent.classList.add(this.CssClass.COLLAPSING);
              this.navbarContent.style.height = `${this.navbarContent.scrollHeight}px`;
              this.timeout = window.setTimeout(() => {
                  this.navbarContent.classList.remove(this.CssClass.COLLAPSING);
                  this.navbarContent.classList.add(this.CssClass.COLLAPSE);
                  this.navbarContent.classList.add(this.CssClass.SHOW);
                  this.navbarContent.style.height = null;
                  this.toggleButton.ariaExpanded = "true";
              }, DomUtils.getTransitionTime(this.navbarContent));
          }
      }
      get toggleButton() {
          return this.querySelector(".navbar-toggler");
      }
      get navbarContent() {
          return this.querySelector(".navbar-collapse");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-bar") == null) {
          window.customElements.define("tobago-bar", Bar);
      }
  });

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement$1(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  var applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  // import { isHTMLElement } from './instanceOf';
  function getBoundingClientRect(element, // eslint-disable-next-line unused-imports/no-unused-vars
  includeScale) {

    var rect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1; // FIXME:
    // `offsetWidth` returns an integer while `getBoundingClientRect`
    // returns a float. This results in `scaleX` or `scaleY` being
    // non-1 when it should be for elements that aren't a full pixel in
    // width or height.
    // if (isHTMLElement(element) && includeScale) {
    //   const offsetHeight = element.offsetHeight;
    //   const offsetWidth = element.offsetWidth;
    //   // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    //   // Fallback to 1 in case both values are `0`
    //   if (offsetWidth > 0) {
    //     scaleX = rect.width / offsetWidth || 1;
    //   }
    //   if (offsetHeight > 0) {
    //     scaleY = rect.height / offsetHeight || 1;
    //   }
    // }

    return {
      width: rect.width / scaleX,
      height: rect.height / scaleY,
      top: rect.top / scaleY,
      right: rect.right / scaleX,
      bottom: rect.bottom / scaleY,
      left: rect.left / scaleX,
      x: rect.left / scaleX,
      y: rect.top / scaleY
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement$1(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle$1(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {

      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  var arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref) {
    var x = _ref.x,
        y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(round(x * dpr) / dpr) || 0,
      y: round(round(y * dpr) / dpr) || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        variation = _ref2.variation,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets;

    var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
        _ref3$x = _ref3.x,
        x = _ref3$x === void 0 ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === void 0 ? 0 : _ref3$y;

    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom; // $FlowFixMe[prop-missing]

        y -= offsetParent[heightProp] - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right; // $FlowFixMe[prop-missing]

        x -= offsetParent[widthProp] - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref4) {
    var state = _ref4.state,
        options = _ref4.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  var passive = {
    passive: true
  };

  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  var eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getViewportRect(element) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
      // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
      // errors due to floating point numbers, so we need to check precision.
      // Safari returns a number <= 0, usually < -1 when pinch-zoomed
      // Feature detection fails in mobile emulation mode in Chrome.
      // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
      // 0.001
      // Fallback here: "Not Safari" userAgent

      if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle$1(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement$1(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  var flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  var hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis || checkAltAxis) {
      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
      var max$1 = popperOffsets[mainAxis] - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
      var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

      if (checkMainAxis) {
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = rect.width / element.offsetWidth || 1;
    var scaleY = rect.height / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.


  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce$1(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(setOptionsAction) {
          var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          }); // Validate the provided modifiers so that the consumer will get warned

          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {

            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {

            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce$1(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {

        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref3) {
          var name = _ref3.name,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options,
              effect = _ref3.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }
  var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers$1
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  var Popper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    popperGenerator: popperGenerator,
    detectOverflow: detectOverflow,
    createPopperBase: createPopper$2,
    createPopper: createPopper,
    createPopperLite: createPopper$1,
    top: top,
    bottom: bottom,
    right: right,
    left: left,
    auto: auto,
    basePlacements: basePlacements,
    start: start,
    end: end,
    clippingParents: clippingParents,
    viewport: viewport,
    popper: popper,
    reference: reference,
    variationPlacements: variationPlacements,
    placements: placements,
    beforeRead: beforeRead,
    read: read,
    afterRead: afterRead,
    beforeMain: beforeMain,
    main: main,
    afterMain: afterMain,
    beforeWrite: beforeWrite,
    write: write,
    afterWrite: afterWrite,
    modifierPhases: modifierPhases,
    applyStyles: applyStyles$1,
    arrow: arrow$1,
    computeStyles: computeStyles$1,
    eventListeners: eventListeners,
    flip: flip$1,
    hide: hide$1,
    offset: offset$1,
    popperOffsets: popperOffsets$1,
    preventOverflow: preventOverflow$1
  });

  /*!
    * Bootstrap v5.1.3 (https://getbootstrap.com/)
    * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    */

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]}`;
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return document.querySelector(obj);
    }

    return null;
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
    }

    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  };

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  const noop = () => {};
  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */


  const reflow = element => {
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
  };

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const DOMContentLoadedCallbacks = [];

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          DOMContentLoadedCallbacks.forEach(callback => callback());
        });
      }

      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }

    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;

    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }

      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };

    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };
  /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */


  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

    if (index === -1) {
      return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
    }

    const listLength = list.length;
    index += shouldGetNext ? 1 : -1;

    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }

    return list[Math.max(0, Math.min(index, listLength - 1))];
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  const Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.1.3';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    /** Static */


    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      const target = getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

      instance[method]();
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$d = 'alert';
  const DATA_KEY$c = 'bs.alert';
  const EVENT_KEY$c = `.${DATA_KEY$c}`;
  const EVENT_CLOSE = `close${EVENT_KEY$c}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$8 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$d;
    } // Public


    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

      if (closeEvent.defaultPrevented) {
        return;
      }

      this._element.classList.remove(CLASS_NAME_SHOW$8);

      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    } // Private


    _destroyElement() {
      this._element.remove();

      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Alert.getOrCreateInstance(this);

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  enableDismissTrigger(Alert, 'close');
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'button';
  const DATA_KEY$b = 'bs.button';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
    } // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Button.getOrCreateInstance(this);

        if (config === 'toggle') {
          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    },

    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'carousel';
  const DATA_KEY$a = 'bs.carousel';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$a = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$a = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY]: DIRECTION_LEFT
  };
  const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
  const EVENT_SLID = `slid${EVENT_KEY$a}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$a;
    }

    static get NAME() {
      return NAME$b;
    } // Public


    next() {
      this._slide(ORDER_NEXT);
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }

    prev() {
      this._slide(ORDER_PREV);
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
    } // Private


    _getConfig(config) {
      config = { ...Default$a,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$b, config, DefaultType$a);
      return config;
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
      }

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      const hasPointerPenTouch = event => {
        return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
      };

      const start = event => {
        if (hasPointerPenTouch(event)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
      };

      const end = event => {
        if (hasPointerPenTouch(event)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
        }

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
      });

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      const direction = KEY_TO_DIRECTION[event.key];

      if (direction) {
        event.preventDefault();

        this._slide(direction);
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
    }

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
          }
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
      }

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }

      if (this._isSliding) {
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });
      };

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
        };

        this._queueCallback(completeCallBack, activeElement, true);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
      }

      if (isCycling) {
        this.cycle();
      }
    }

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
      }

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } // Static


    static carouselInterface(element, config) {
      const data = Carousel.getOrCreateInstance(element, config);
      let {
        _config
      } = data;

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
        };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    }

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
      };
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Carousel.getInstance(target).to(slideIndex);
      }

      event.preventDefault();
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'collapse';
  const DATA_KEY$9 = 'bs.collapse';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$9 = {
    toggle: true,
    parent: null
  };
  const DefaultType$9 = {
    toggle: 'boolean',
    parent: '(null|element)'
  };
  const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse$1 extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._initializeChildren();

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    static get Default() {
      return Default$9;
    }

    static get NAME() {
      return NAME$a;
    } // Public


    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }

      let actives = [];
      let activesData;

      if (this._config.parent) {
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
      }

      const container = SelectorEngine.findOne(this._selector);

      if (actives.length) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Collapse$1.getInstance(tempActiveData) : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse$1.getOrCreateInstance(elemActive, {
            toggle: false
          }).hide();
        }

        if (!activesData) {
          Data.set(elemActive, DATA_KEY$9, null);
        }
      });

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      this._addAriaAndCollapsedClass(this._triggerArray, true);

      this._isTransitioning = true;

      const complete = () => {
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      const triggerArrayLength = this._triggerArray.length;

      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i];
        const elem = getElementFromSelector(trigger);

        if (elem && !this._isShown(elem)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }

      this._isTransitioning = true;

      const complete = () => {
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
      };

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
    }

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
    } // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values

      config.parent = getElement(config.parent);
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
    }

    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }

    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }

      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
        const selected = getElementFromSelector(element);

        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      });
    }

    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }

      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const _config = {};

        if (typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        const data = Collapse$1.getOrCreateInstance(this, _config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }

    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      Collapse$1.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse$1);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'dropdown';
  const DATA_KEY$8 = 'bs.dropdown';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$8 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  };
  const DefaultType$8 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown$1 extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();
    } // Getters


    static get Default() {
      return Default$8;
    }

    static get DefaultType() {
      return DefaultType$8;
    }

    static get NAME() {
      return NAME$9;
    } // Public


    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }

    show() {
      if (isDisabled(this._element) || this._isShown(this._menu)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
      }

      const parent = Dropdown$1.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

      if (this._inNavbar) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        this._createPopper(parent);
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.add(CLASS_NAME_SHOW$6);

      this._element.classList.add(CLASS_NAME_SHOW$6);

      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }

    hide() {
      if (isDisabled(this._element) || !this._isShown(this._menu)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };

      this._completeHide(relatedTarget);
    }

    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    } // Private


    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.remove(CLASS_NAME_SHOW$6);

      this._element.classList.remove(CLASS_NAME_SHOW$6);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _createPopper(parent) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
      }

      let referenceElement = this._element;

      if (this._config.reference === 'parent') {
        referenceElement = parent;
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }

      const popperConfig = this._getPopperConfig();

      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
      this._popper = createPopper(referenceElement, this._menu, popperConfig);

      if (isDisplayStatic) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'static');
      }
    }

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$6);
    }

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
    }

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _selectMenuItem({
      key,
      target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
      } // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY


      getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Dropdown$1.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
        return;
      }

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Dropdown$1.getInstance(toggles[i]);

        if (!context || context._config.autoClose === false) {
          continue;
        }

        if (!context._isShown()) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
      }

      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
      const instance = Dropdown$1.getOrCreateInstance(getToggleButton);

      if (event.key === ESCAPE_KEY$2) {
        instance.hide();
        return;
      }

      if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
        if (!isActive) {
          instance.show();
        }

        instance._selectMenuItem(event);

        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown$1.clearMenus();
      }
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown$1.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown$1.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown$1.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown$1.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown$1.getOrCreateInstance(this).toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown$1);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }

    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }

    hide() {
      const width = this.getWidth();

      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
    }

    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');

      this._element.style.overflow = 'hidden';
    }

    _setElementAttributes(selector, styleProp, callback) {
      const scrollbarWidth = this.getWidth();

      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }

        this._saveInitialAttribute(element, styleProp);

        const calculatedValue = window.getComputedStyle(element)[styleProp];
        element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
      };

      this._applyManipulationCallback(selector, manipulationCallBack);
    }

    reset() {
      this._resetElementAttributes(this._element, 'overflow');

      this._resetElementAttributes(this._element, 'paddingRight');

      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
    }

    _saveInitialAttribute(element, styleProp) {
      const actualValue = element.style[styleProp];

      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProp, actualValue);
      }
    }

    _resetElementAttributes(selector, styleProp) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProp);

        if (typeof value === 'undefined') {
          element.style.removeProperty(styleProp);
        } else {
          Manipulator.removeDataAttribute(element, styleProp);
          element.style[styleProp] = value;
        }
      };

      this._applyManipulationCallback(selector, manipulationCallBack);
    }

    _applyManipulationCallback(selector, callBack) {
      if (isElement(selector)) {
        callBack(selector);
      } else {
        SelectorEngine.find(selector, this._element).forEach(callBack);
      }
    }

    isOverflowing() {
      return this.getWidth() > 0;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$7 = {
    className: 'modal-backdrop',
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: 'body',
    // give the choice to place backdrop under different elements
    clickCallback: null
  };
  const DefaultType$7 = {
    className: 'string',
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: '(element|string)',
    clickCallback: '(function|null)'
  };
  const NAME$8 = 'backdrop';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
      }

      this._getElement().classList.add(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        execute(callback);
      });
    }

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._getElement().classList.remove(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    } // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
        }

        this._element = backdrop;
      }

      return this._element;
    }

    _getConfig(config) {
      config = { ...Default$7,
        ...(typeof config === 'object' ? config : {})
      }; // use getElement() with the default "body" to get a fresh Element on each instantiation

      config.rootElement = getElement(config.rootElement);
      typeCheckConfig(NAME$8, config, DefaultType$7);
      return config;
    }

    _append() {
      if (this._isAppended) {
        return;
      }

      this._config.rootElement.append(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }

    dispose() {
      if (!this._isAppended) {
        return;
      }

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._element.remove();

      this._isAppended = false;
    }

    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    trapElement: null,
    // The element to trap focus inside of
    autofocus: true
  };
  const DefaultType$6 = {
    trapElement: 'element',
    autofocus: 'boolean'
  };
  const NAME$7 = 'focustrap';
  const DATA_KEY$7 = 'bs.focustrap';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';

  class FocusTrap {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }

    activate() {
      const {
        trapElement,
        autofocus
      } = this._config;

      if (this._isActive) {
        return;
      }

      if (autofocus) {
        trapElement.focus();
      }

      EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }

    deactivate() {
      if (!this._isActive) {
        return;
      }

      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$7);
    } // Private


    _handleFocusin(event) {
      const {
        target
      } = event;
      const {
        trapElement
      } = this._config;

      if (target === document || target === trapElement || trapElement.contains(target)) {
        return;
      }

      const elements = SelectorEngine.focusableChildren(trapElement);

      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }

    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }

      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    }

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const OPEN_SELECTOR$1 = '.modal.show';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }

      this._scrollBar.hide();

      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._isShown = false;

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      this._focustrap.deactivate();

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
    }

    handleUpdate() {
      this._adjustDialog();
    } // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
      });
    }

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.append(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      if (isAnimated) {
        reflow(this._element);
      }

      this._element.classList.add(CLASS_NAME_SHOW$4);

      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
        }

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            this._triggerBackdropTransition();
          }
        });
      } else {
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
      } else {
        EventHandler.off(window, EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        this._scrollBar.reset();

        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      });
    }

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === true) {
          this.hide();
        } else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        }
      });

      this._backdrop.show(callback);
    }

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
    }

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const {
        classList,
        scrollHeight,
        style
      } = this._element;
      const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

      if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
        return;
      }

      if (!isModalOverflowing) {
        style.overflowY = 'hidden';
      }

      classList.add(CLASS_NAME_STATIC);

      this._queueCallback(() => {
        classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          this._queueCallback(() => {
            style.overflowY = '';
          }, this._dialog);
        }
      }, this._dialog);

      this._element.focus();
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      const scrollbarWidth = this._scrollBar.getWidth();

      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    }); // avoid conflict when clicking moddal toggler while another one is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);

    if (allReadyOpen) {
      Modal.getInstance(allReadyOpen).hide();
    }

    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  });
  enableDismissTrigger(Modal);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  };
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();

      this._addEventListeners();
    } // Getters


    static get NAME() {
      return NAME$5;
    }

    static get Default() {
      return Default$4;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
      }

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$3);

      const completeCallBack = () => {
        if (!this._config.scroll) {
          this._focustrap.activate();
        }

        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
        });
      };

      this._queueCallback(completeCallBack, this._element, true);
    }

    hide() {
      if (!this._isShown) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._focustrap.deactivate();

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$3);

      this._backdrop.hide();

      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
      };

      this._queueCallback(completeCallback, this._element, true);
    }

    dispose() {
      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }

    _initializeBackDrop() {
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
        }
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Offcanvas.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
    }

    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
  enableDismissTrigger(Offcanvas);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
      }

      return true;
    }

    const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attributeName)) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const element = elements[i];
      const elementName = element.nodeName.toLowerCase();

      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }

      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
      attributeList.forEach(attribute => {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default$3;
    }

    static get NAME() {
      return NAME$4;
    }

    static get Event() {
      return Event$2;
    }

    static get DefaultType() {
      return DefaultType$3;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this.tip) {
        this.tip.remove();
      }

      this._disposePopper();

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
      // This will be removed later in favor of a `setContent` method


      if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
        this._disposePopper();

        this.tip.remove();
        this.tip = null;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        this._popper = createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW$2);

      const customClass = this._resolvePossibleFunction(this._config.customClass);

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
        });
      }

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW) {
          tip.remove();
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        this._disposePopper();
      };

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      const tip = element.children[0];
      this.setContent(tip);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      this.tip = tip;
      return this.tip;
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
    }

    _sanitizeAndSetContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);

      if (!content && templateElement) {
        templateElement.remove();
        return;
      } // we use append for html objects to maintain js events


      this.setElementContent(templateElement, content);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.append(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }

    getTitle() {
      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

      return this._resolvePossibleFunction(title);
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _resolvePossibleFunction(content) {
      return typeof content === 'function' ? content.call(this._element) : content;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };

      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      for (const key in this._config) {
        if (this.constructor.Default[key] !== this._config[key]) {
          config[key] = this._config[key];
        }
      } // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`


      return config;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX$1;
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    }

    _disposePopper() {
      if (this._popper) {
        this._popper.destroy();

        this._popper = null;
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }

    static get NAME() {
      return NAME$3;
    }

    static get Event() {
      return Event$1;
    }

    static get DefaultType() {
      return DefaultType$2;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

      this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
    } // Private


    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default$1;
    }

    static get NAME() {
      return NAME$2;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      config.target = getElement(config.target) || document.documentElement;
      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
      const link = SelectorEngine.findOne(queries.join(','), this._config.target);
      link.classList.add(CLASS_NAME_ACTIVE$1);

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      }

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab$1 extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
    } // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
      }) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
      }

      this._activate(this._element, listElement);

      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    } // Private


    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tab$1.getOrCreateInstance(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Tab$1.getOrCreateInstance(this);
    data.show();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab$1);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    } // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOW);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.remove(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    }

    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Toast.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }

  enableDismissTrigger(Toast);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Toast);

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var BehaviorMode;
  (function (BehaviorMode) {
      BehaviorMode[BehaviorMode["none"] = 0] = "none";
      BehaviorMode[BehaviorMode["client"] = 1] = "client";
      BehaviorMode[BehaviorMode["ajax"] = 2] = "ajax";
      BehaviorMode[BehaviorMode["full"] = 3] = "full";
  })(BehaviorMode || (BehaviorMode = {}));

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var CollapseOperation;
  (function (CollapseOperation) {
      CollapseOperation[CollapseOperation["none"] = 0] = "none";
      CollapseOperation[CollapseOperation["show"] = 1] = "show";
      CollapseOperation[CollapseOperation["hide"] = 2] = "hide";
      CollapseOperation[CollapseOperation["toggle"] = 3] = "toggle";
  })(CollapseOperation || (CollapseOperation = {}));

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Popup extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          const options = {};
          this.modal = new Modal(this, options);
          if (!this.collapsed) {
              this.show();
          }
      }
      disconnectedCallback() {
          this.hide();
          // dispose seems to make trouble here: Scrolling is out or order after this call.
          // this.modal.dispose();
      }
      show(behaviorMode) {
          console.log("show");
          console.log("behaviorMode", behaviorMode, BehaviorMode.client);
          if (behaviorMode == null || behaviorMode == BehaviorMode.client) {
              this.modal.show();
          }
      }
      hide(behaviorMode) {
          console.log("hide");
          console.log("behaviorMode", behaviorMode, BehaviorMode.client);
          if (behaviorMode == null || behaviorMode == BehaviorMode.client) {
              this.modal.hide();
          }
      }
      get collapsed() {
          return JSON.parse(Collapse.findHidden(this).value);
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-popup") == null) {
          window.customElements.define("tobago-popup", Popup);
      }
  });
  class Collapse {
      static findHidden(element) {
          const rootNode = element.getRootNode();
          return rootNode.getElementById(element.id + "::collapse");
      }
  }
  Collapse.execute = function (operation, target, behaviorMode) {
      const hidden = Collapse.findHidden(target);
      let newCollapsed;
      switch (operation) {
          case CollapseOperation.hide:
              newCollapsed = true;
              break;
          case CollapseOperation.show:
              newCollapsed = false;
              break;
          default:
              console.error("unknown operation: '%s'", operation);
      }
      if (newCollapsed) {
          if (target instanceof Popup) {
              target.hide(behaviorMode);
          }
          else {
              target.classList.add("tobago-collapsed");
          }
      }
      else {
          if (target instanceof Popup) {
              target.show(behaviorMode);
          }
          else {
              target.classList.remove("tobago-collapsed");
          }
      }
      hidden.value = newCollapsed;
  };

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Page extends HTMLElement {
      constructor() {
          super();
          this.submitActive = false;
      }
      /**
       * The Tobago root element
       */
      static page(element) {
          const rootNode = element.getRootNode();
          const pages = rootNode.querySelectorAll("tobago-page");
          if (pages.length > 0) {
              if (pages.length >= 2) {
                  console.warn("Found more than one tobago-page element!");
              }
              return pages.item(0);
          }
          console.warn("Found no tobago page!");
          return null;
      }
      /**
       * "a:b" -> "a"
       * "a:b:c" -> "a:b"
       * "a" -> null
       * null -> null
       * "a:b::sub-component" -> "a"
       * "a::sub-component:b" -> "a::sub-component" // should currently not happen in Tobago
       *
       * @param clientId The clientId of a component.
       * @return The clientId of the naming container.
       */
      static getNamingContainerId(clientId) {
          if (clientId == null || clientId.lastIndexOf(":") === -1) {
              return null;
          }
          let id = clientId;
          while (true) {
              const sub = id.lastIndexOf("::");
              if (sub == -1) {
                  break;
              }
              if (sub + 1 == id.lastIndexOf(":")) {
                  id = id.substring(0, sub);
              }
              else {
                  break;
              }
          }
          return id.substring(0, id.lastIndexOf(":"));
      }
      connectedCallback() {
          this.registerAjaxListener();
          this.form.addEventListener("submit", this.beforeSubmit.bind(this));
          window.addEventListener("unload", this.beforeUnload.bind(this));
          this.addEventListener("keypress", (event) => {
              let code = event.which; // XXX deprecated
              if (code === 0) {
                  code = event.keyCode;
              }
              if (code === 13) {
                  const target = event.target;
                  if (target.tagName === "A" || target.tagName === "BUTTON") {
                      return;
                  }
                  if (target.tagName === "TEXTAREA") {
                      if (!event.metaKey && !event.ctrlKey) {
                          return;
                      }
                  }
                  const name = target.getAttribute("name");
                  let id = name ? name : target.id;
                  while (id != null) {
                      const command = document.querySelector(`[data-tobago-default='${id}']`);
                      if (command) {
                          command.dispatchEvent(new MouseEvent("click"));
                          break;
                      }
                      id = Page.getNamingContainerId(id);
                  }
                  return false;
              }
          });
      }
      beforeSubmit(event, decoupled = false) {
          this.submitActive = true;
          if (!decoupled) {
              this.body.insertAdjacentHTML("beforeend", `<tobago-overlay for='${this.id}'></tobago-overlay>`);
          }
          console.debug(this.body.querySelector("tobago-overlay"));
      }
      /**
       * Wrapper function to call application generated onunload function
       */
      beforeUnload() {
          console.debug("unload");
          // todo: here me may check, if user will loose its edit state on the page
      }
      registerAjaxListener() {
          jsf.ajax.addOnEvent(this.jsfResponse.bind(this));
      }
      jsfResponse(event) {
          console.timeEnd("[tobago-jsf] jsf-ajax");
          console.time("[tobago-jsf] jsf-ajax");
          console.debug("[tobago-jsf] JSF event status: '%s'", event.status);
          if (event.status === "success") {
              event.responseXML.querySelectorAll("update").forEach(this.jsfResponseSuccess.bind(this));
          }
          else if (event.status === "complete") {
              event.responseXML.querySelectorAll("update").forEach(this.jsfResponseComplete.bind(this));
          }
      }
      jsfResponseSuccess(update) {
          const id = update.id;
          let rootNode = this.getRootNode();
          // XXX in case of "this" is tobago-page (e.g. ajax exception handling) rootNode is not set correctly???
          if (!rootNode.getElementById) {
              rootNode = document;
          }
          console.debug("[tobago-jsf] Update after jsf.ajax success: %s", id);
      }
      jsfResponseComplete(update) {
          const id = update.id;
          if (JsfParameter.isJsfId(id)) {
              console.debug("[tobago-jsf] Update after jsf.ajax complete: #", id);
              const overlay = this.querySelector(`tobago-overlay[for='${id}']`);
              if (overlay) {
                  overlay.remove();
              }
              else {
                  console.warn("Didn't found overlay for id", id);
              }
          }
      }
      get form() {
          return this.querySelector("form");
      }
      get body() {
          return this.closest("body");
      }
      get locale() {
          let locale = this.getAttribute("locale");
          if (!locale) {
              locale = document.documentElement.lang;
          }
          return locale;
      }
  }
  document.addEventListener("tobago.init", (event) => {
      if (window.customElements.get("tobago-page") == null) {
          window.customElements.define("tobago-page", Page);
      }
  });
  class JsfParameter {
      static isJsfId(id) {
          switch (id) {
              case JsfParameter.VIEW_STATE:
              case JsfParameter.CLIENT_WINDOW:
              case JsfParameter.VIEW_ROOT:
              case JsfParameter.VIEW_HEAD:
              case JsfParameter.VIEW_BODY:
              case JsfParameter.RESOURCE:
                  return false;
              default:
                  return true;
          }
      }
      static isJsfBody(id) {
          switch (id) {
              case JsfParameter.VIEW_ROOT:
              case JsfParameter.VIEW_BODY:
                  return true;
              default:
                  return false;
          }
      }
  }
  JsfParameter.VIEW_STATE = "javax.faces.ViewState";
  JsfParameter.CLIENT_WINDOW = "javax.faces.ClientWindow";
  JsfParameter.VIEW_ROOT = "javax.faces.ViewRoot";
  JsfParameter.VIEW_HEAD = "javax.faces.ViewHead";
  JsfParameter.VIEW_BODY = "javax.faces.ViewBody";
  JsfParameter.RESOURCE = "javax.faces.Resource";

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Behavior extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          switch (this.event) {
              case "load": // this is a special case, because the "load" is too late now.
                  this.callback();
                  break;
              case "resize":
                  document.body.addEventListener(this.event, this.callback.bind(this));
                  break;
              default:
                  const eventElement = this.eventElement;
                  if (eventElement) {
                      eventElement.addEventListener(this.event, this.callback.bind(this));
                  }
                  else {
                      // if the clientId doesn't exists in DOM, it's probably the id of tobago-behavior custom element
                      this.parentElement.addEventListener(this.event, this.callback.bind(this));
                      // todo: not sure if this warning can be removed;
                      console.warn("Can't find an element for the event. Use parentElement instead.", this);
                  }
          }
      }
      callback(event) {
          if (this.confirmation) {
              if (!window.confirm(this.confirmation)) {
                  event === null || event === void 0 ? void 0 : event.preventDefault();
                  return;
              }
          }
          if (this.collapseOperation && this.collapseTarget) {
              const rootNode = this.getRootNode();
              Collapse.execute(this.collapseOperation, rootNode.getElementById(this.collapseTarget), this.mode);
          }
          switch (this.mode) {
              case BehaviorMode.ajax:
                  if (this.render) {
                      // prepare overlay for all by AJAX reloaded elements
                      const partialIds = this.render.split(" ");
                      for (let i = 0; i < partialIds.length; i++) {
                          const partialId = partialIds[i];
                          const partialElement = document.getElementById(partialId);
                          if (partialElement) {
                              partialElement.insertAdjacentHTML("beforeend", `<tobago-overlay for='${partialElement.id}'></tobago-overlay>`);
                          }
                          else {
                              console.warn("No element found by id='%s' for overlay!", partialId);
                          }
                      }
                  }
                  jsf.ajax.request(this.actionElement, event, {
                      "javax.faces.behavior.event": this.event,
                      execute: this.execute,
                      render: this.render
                  });
                  break;
              case BehaviorMode.full:
                  setTimeout(this.submit.bind(this), this.delay);
                  break;
              // nothing to do
          }
      }
      /**
       * Submitting the page (= the form).
       */
      submit() {
          console.info("Execute submit!");
          const page = Page.page(this);
          if (!page.submitActive) {
              page.submitActive = true;
              const actionId = this.fieldId != null ? this.fieldId : this.clientId;
              const form = page.form;
              const oldTarget = form.getAttribute("target");
              const sourceHidden = document.getElementById("javax.faces.source");
              sourceHidden.disabled = false;
              sourceHidden.value = actionId;
              if (this.target) {
                  form.setAttribute("target", this.target);
              }
              page.beforeSubmit(null, this.decoupled);
              try {
                  form.submit();
                  // reset the source field after submit, to be prepared for possible next AJAX with decoupled=true
                  sourceHidden.disabled = true;
                  sourceHidden.value = "";
              }
              catch (e) {
                  console.error("Submit failed!", e);
                  const overlay = this.closest("body").querySelector(`tobago-overlay[for='${page.id}']`);
                  overlay.remove();
                  page.submitActive = false;
                  alert(`Submit failed: ${e}`); // XXX localization, better error handling
              }
              if (this.target) {
                  if (oldTarget) {
                      form.setAttribute("target", oldTarget);
                  }
                  else {
                      form.removeAttribute("target");
                  }
              }
              if (this.target || this.decoupled) {
                  page.submitActive = false;
              }
          }
      }
      get mode() {
          if (this.render || this.execute) {
              return BehaviorMode.ajax;
          }
          else if (!this.omit) {
              return BehaviorMode.full;
          }
          else {
              return BehaviorMode.client;
          }
      }
      get event() {
          return this.getAttribute("event");
      }
      set event(event) {
          this.setAttribute("event", event);
      }
      get clientId() {
          return this.getAttribute("client-id");
      }
      set clientId(clientId) {
          this.setAttribute("client-id", clientId);
      }
      get fieldId() {
          return this.getAttribute("field-id");
      }
      set fieldId(fieldId) {
          this.setAttribute("field-id", fieldId);
      }
      get execute() {
          return this.getAttribute("execute");
      }
      set execute(execute) {
          this.setAttribute("execute", execute);
      }
      get render() {
          return this.getAttribute("render");
      }
      set render(render) {
          this.setAttribute("render", render);
      }
      get delay() {
          return parseInt(this.getAttribute("delay")) || 0;
      }
      set delay(delay) {
          this.setAttribute("delay", String(delay));
      }
      get omit() {
          return this.hasAttribute("omit");
      }
      set omit(omit) {
          if (omit) {
              this.setAttribute("omit", "");
          }
          else {
              this.removeAttribute("omit");
          }
      }
      get target() {
          return this.getAttribute("target");
      }
      set target(target) {
          this.setAttribute("target", target);
      }
      get confirmation() {
          return this.getAttribute("confirmation");
      }
      set confirmation(confirmation) {
          this.setAttribute("confirmation", confirmation);
      }
      get collapseOperation() {
          return CollapseOperation[this.getAttribute("collapse-operation")];
      }
      set collapseOperation(collapseOperation) {
          this.setAttribute("collapse-operation", CollapseOperation[collapseOperation]);
      }
      get collapseTarget() {
          return this.getAttribute("collapse-target");
      }
      set collapseTarget(collapseTarget) {
          this.setAttribute("collapse-target", collapseTarget);
      }
      get decoupled() {
          return this.hasAttribute("decoupled");
      }
      set decoupled(decoupled) {
          if (decoupled) {
              this.setAttribute("decoupled", "");
          }
          else {
              this.removeAttribute("decoupled");
          }
      }
      get actionElement() {
          const rootNode = this.getRootNode();
          const id = this.clientId;
          return rootNode.getElementById(id);
      }
      get eventElement() {
          const rootNode = this.getRootNode();
          const id = this.fieldId ? this.fieldId : this.clientId;
          let result = rootNode.getElementById(id);
          if (result == null) {
              if (this.parentElement.tagName === "TD") {
                  // if <tc:event> is inside <tc:row> the <tobago-behaviour> is rendered inside a <td>, because it's not
                  // allowed directly inside a <tr>.
                  result = this.parentElement.parentElement;
                  // XXX this might not be a good solution, better fix this in the SheetRenderer
              }
          }
          return result;
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-behavior") == null) {
          window.customElements.define("tobago-behavior", Behavior);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const TobagoDropdownEvent = {
      HIDE: "tobago.dropdown.hide",
      HIDDEN: "tobago.dropdown.hidden",
      SHOW: "tobago.dropdown.show",
      SHOWN: "tobago.dropdown.shown"
  };
  /**
   * The dropdown implementation of Bootstrap does not move the menu to the tobago-page-menuStore. This behavior is
   * implemented in this class.
   */
  class Dropdown extends HTMLElement {
      constructor() {
          super();
          if (!this.classList.contains("tobago-dropdown-submenu")) { // ignore submenus
              this.addEventListener("shown.bs.dropdown", this.openDropdown.bind(this));
              this.addEventListener("hidden.bs.dropdown", this.closeDropdown.bind(this));
          }
      }
      openDropdown() {
          this.dispatchEvent(new CustomEvent(TobagoDropdownEvent.SHOW));
          if (!this.insideNavbar()) {
              this.menuStore.appendChild(this.dropdownMenu);
          }
          this.dispatchEvent(new CustomEvent(TobagoDropdownEvent.SHOWN));
      }
      closeDropdown() {
          this.dispatchEvent(new CustomEvent(TobagoDropdownEvent.HIDE));
          if (!this.insideNavbar()) {
              this.appendChild(this.dropdownMenu);
          }
          this.dispatchEvent(new CustomEvent(TobagoDropdownEvent.HIDDEN));
      }
      /**
       * The bootstrap dropdown implementation doesn't adjust the position of the dropdown menu if inside a '.navbar'.
       * In this case the dropdown menu should not be appended to the menu store.
       * https://github.com/twbs/bootstrap/blob/0d81d3cbc14dfcdca8a868e3f25189a4f1ab273c/js/src/dropdown.js#L294
       */
      insideNavbar() {
          return Boolean(this.closest(".navbar"));
      }
      get dropdownMenu() {
          const root = this.getRootNode();
          return root.querySelector(`.dropdown-menu[name='${this.id}']`);
      }
      get menuStore() {
          const root = this.getRootNode();
          return root.querySelector(".tobago-page-menuStore");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-dropdown") == null) {
          window.customElements.define("tobago-dropdown", Dropdown);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class InputSupport {
      constructor(type) {
          this.type = type;
          this.support = InputSupport.checkSupport(type);
      }
      static checkSupport(type) {
          const input = document.createElement("input");
          input.setAttribute("type", type);
          const INVALID_TEXT = "this is not a date";
          input.setAttribute("value", INVALID_TEXT);
          return input.value !== INVALID_TEXT;
      }
      example(step) {
          switch (this.type) {
              case "date":
                  return InputSupport.YEAR_MONTH + "-20";
              case "time":
                  switch (step) {
                      case 1:
                          return "20:15:00";
                      case 0.001:
                          return "20:15:00.000";
                      default:
                          return "20:15";
                  }
              case "datetime-local":
                  switch (step) {
                      case 1:
                          return InputSupport.YEAR_MONTH + "-20T20:15:00";
                      case 0.001:
                          return InputSupport.YEAR_MONTH + "-20T20:15:00.000";
                      default:
                          return InputSupport.YEAR_MONTH + "-20T20:15";
                  }
              case "month":
                  return InputSupport.YEAR_MONTH;
              case "week":
                  return InputSupport.YEAR_MONTH.substr(0, 4) + "-W52";
              default:
                  return "";
          }
      }
  }
  InputSupport.YEAR_MONTH = `${new Date().toISOString().substr(0, 7)}`;
  class TobagoDate extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          const support = TobagoDate.SUPPORTS[this.type];
          console.debug("check input type support", this.type, support);
          if (!(support === null || support === void 0 ? void 0 : support.support)) {
              this.type = "text";
              this.field.placeholder = support.example(this.step) + " " + (this.pattern ? this.pattern : "");
          }
      }
      workaround() {
          window.alert("workaround!");
      }
      get todayButton() {
          return this.hasAttribute("today-button");
      }
      set todayButton(todayButton) {
          if (todayButton) {
              this.setAttribute("today-button", "");
          }
          else {
              this.removeAttribute("today-button");
          }
      }
      get type() {
          var _a;
          return (_a = this.field) === null || _a === void 0 ? void 0 : _a.getAttribute("type");
      }
      set type(type) {
          var _a;
          (_a = this.field) === null || _a === void 0 ? void 0 : _a.setAttribute("type", type);
      }
      get min() {
          var _a;
          return (_a = this.field) === null || _a === void 0 ? void 0 : _a.getAttribute("min");
      }
      get max() {
          var _a;
          return (_a = this.field) === null || _a === void 0 ? void 0 : _a.getAttribute("max");
      }
      get step() {
          var _a;
          return Number.parseFloat((_a = this.field) === null || _a === void 0 ? void 0 : _a.getAttribute("step"));
      }
      get pattern() {
          return this.getAttribute("pattern");
      }
      get field() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::field");
      }
  }
  TobagoDate.SUPPORTS = {
      "date": new InputSupport("date"),
      "time": new InputSupport("time"),
      "datetime-local": new InputSupport("datetime-local"),
      "month": new InputSupport("month"),
      "week": new InputSupport("week")
  };
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-date") == null) {
          window.customElements.define("tobago-date", TobagoDate);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class File extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.input.form.enctype = "multipart/form-data";
      }
      get input() {
          return this.querySelector("input");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-file") == null) {
          window.customElements.define("tobago-file", File);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Focus extends HTMLElement {
      constructor() {
          super();
      }
      /**
       * The focusListener to set the lastFocusId must be implemented in the appropriate web elements.
       * @param event
       */
      static setLastFocusId(event) {
          const target = event.target;
          const computedStyle = getComputedStyle(target);
          if (target.getAttribute("type") !== "hidden"
              && target.getAttributeNames().indexOf("disabled") === -1
              && target.getAttribute("tabindex") !== "-1"
              && computedStyle.visibility !== "hidden"
              && computedStyle.display !== "none") {
              const root = target.getRootNode();
              const tobagoFocus = root.getElementById(Page.page(target).id + "::lastFocusId");
              tobagoFocus.querySelector("input").value = target.id;
          }
      }
      /**
       * Sets the focus to the requested element or to the first possible if
       * no element is explicitly requested.
       *
       * The priority order is:
       * - error (the first error element gets the focus)
       * - auto (the element with the tobago tag attribute focus="true" gets the focus)
       * - last (the element from the last request with same id gets the focus, not AJAX)
       * - first (the first input element (without tabindex=-1) gets the focus, not AJAX)
       */
      connectedCallback() {
          const errorElement = this.errorElement;
          if (errorElement) {
              errorElement.focus();
              return;
          }
          if (this.autofocusElements.length > 0) {
              // nothing to do, because the browser make the work.
              return;
          }
          const lastFocusedElement = this.lastFocusedElement;
          if (lastFocusedElement) {
              lastFocusedElement.focus();
              return;
          }
          const focusableElement = this.focusableElement;
          if (focusableElement) {
              focusableElement.focus();
              return;
          }
      }
      get errorElement() {
          const root = this.getRootNode();
          const elements = root.querySelectorAll(".tobago-messages-container .border-danger:not([disabled]):not([tabindex='-1'])");
          for (const element of elements) {
              const computedStyle = getComputedStyle(element);
              if (computedStyle.display !== "none" && computedStyle.visibility !== "hidden") {
                  return element;
              }
          }
      }
      get autofocusElements() {
          const root = this.getRootNode();
          return root.querySelectorAll("[autofocus]");
      }
      get lastFocusedElement() {
          const lastFocusId = this.hiddenInput.value;
          if (lastFocusId) {
              const root = this.getRootNode();
              return root.getElementById(lastFocusId);
          }
          else {
              return null;
          }
      }
      get hiddenInput() {
          return this.querySelector("input");
      }
      get focusableElement() {
          const root = this.getRootNode();
          const elements = root.querySelectorAll(`input:not([type='hidden']):not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),textarea:not([disabled]):not([tabindex='-1'])`);
          for (const element of elements) {
              if (this.isVisible(element)) {
                  return element;
              }
          }
      }
      isVisible(element) {
          const computedStyle = getComputedStyle(element);
          if (computedStyle.display === "none" || computedStyle.visibility === "hidden") {
              return false;
          }
          else if (element.parentElement) {
              return this.isVisible(element.parentElement);
          }
          else {
              return true;
          }
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-focus") == null) {
          window.customElements.define("tobago-focus", Focus);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Footer extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          if (this.isFixed) {
              // call now
              this.adjustMargin();
              // and after resize
              window.addEventListener("resize", this.adjustMargin.bind(this));
          }
      }
      adjustMargin(event) {
          const style = window.getComputedStyle(this);
          const maxFooterHeight = this.offsetHeight + Number.parseInt(style.marginTop) + Number.parseInt(style.marginBottom);
          if (maxFooterHeight !== this.lastMaxFooterHeight) {
              this.lastMaxFooterHeight = maxFooterHeight;
              this.closest("body").style.marginBottom = `${maxFooterHeight}px`;
          }
      }
      isFixed() {
          return this.classList.contains("fixed-bottom");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-footer") == null) {
          window.customElements.define("tobago-footer", Footer);
      }
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  // Polyfill for element.matches, to support Internet Explorer. It's a relatively
  // simple polyfill, so we'll just include it rather than require the user to
  // include the polyfill themselves. Adapted from
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  var matches = function matches(element, selector) {
    return element.matches ? element.matches(selector) : element.msMatchesSelector ? element.msMatchesSelector(selector) : element.webkitMatchesSelector ? element.webkitMatchesSelector(selector) : null;
  };

  // Polyfill for element.closest, to support Internet Explorer. It's a relatively

  var closestPolyfill = function closestPolyfill(el, selector) {
    var element = el;

    while (element && element.nodeType === 1) {
      if (matches(element, selector)) {
        return element;
      }

      element = element.parentNode;
    }

    return null;
  };

  var closest = function closest(element, selector) {
    return element.closest ? element.closest(selector) : closestPolyfill(element, selector);
  };

  // Returns true if the value has a "then" function. Adapted from
  // https://github.com/graphql/graphql-js/blob/499a75939f70c4863d44149371d6a99d57ff7c35/src/jsutils/isPromise.js
  var isPromise = function isPromise(value) {
    return Boolean(value && typeof value.then === 'function');
  };

  var AutocompleteCore = function AutocompleteCore() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        search = _ref.search,
        _ref$autoSelect = _ref.autoSelect,
        autoSelect = _ref$autoSelect === void 0 ? false : _ref$autoSelect,
        _ref$setValue = _ref.setValue,
        setValue = _ref$setValue === void 0 ? function () {} : _ref$setValue,
        _ref$setAttribute = _ref.setAttribute,
        setAttribute = _ref$setAttribute === void 0 ? function () {} : _ref$setAttribute,
        _ref$onUpdate = _ref.onUpdate,
        onUpdate = _ref$onUpdate === void 0 ? function () {} : _ref$onUpdate,
        _ref$onSubmit = _ref.onSubmit,
        onSubmit = _ref$onSubmit === void 0 ? function () {} : _ref$onSubmit,
        _ref$onShow = _ref.onShow,
        onShow = _ref$onShow === void 0 ? function () {} : _ref$onShow,
        _ref$onHide = _ref.onHide,
        onHide = _ref$onHide === void 0 ? function () {} : _ref$onHide,
        _ref$onLoading = _ref.onLoading,
        onLoading = _ref$onLoading === void 0 ? function () {} : _ref$onLoading,
        _ref$onLoaded = _ref.onLoaded,
        onLoaded = _ref$onLoaded === void 0 ? function () {} : _ref$onLoaded;

    _classCallCheck(this, AutocompleteCore);

    _defineProperty(this, "value", '');

    _defineProperty(this, "searchCounter", 0);

    _defineProperty(this, "results", []);

    _defineProperty(this, "selectedIndex", -1);

    _defineProperty(this, "handleInput", function (event) {
      var value = event.target.value;

      _this.updateResults(value);

      _this.value = value;
    });

    _defineProperty(this, "handleKeyDown", function (event) {
      var key = event.key;

      switch (key) {
        case 'Up': // IE/Edge

        case 'Down': // IE/Edge

        case 'ArrowUp':
        case 'ArrowDown':
          {
            var selectedIndex = key === 'ArrowUp' || key === 'Up' ? _this.selectedIndex - 1 : _this.selectedIndex + 1;
            event.preventDefault();

            _this.handleArrows(selectedIndex);

            break;
          }

        case 'Tab':
          {
            _this.selectResult();

            break;
          }

        case 'Enter':
          {
            var selectedResult = _this.results[_this.selectedIndex];

            _this.selectResult();

            _this.onSubmit(selectedResult);

            break;
          }

        case 'Esc': // IE/Edge

        case 'Escape':
          {
            _this.hideResults();

            _this.setValue();

            break;
          }

        default:
          return;
      }
    });

    _defineProperty(this, "handleFocus", function (event) {
      var value = event.target.value;

      _this.updateResults(value);

      _this.value = value;
    });

    _defineProperty(this, "handleBlur", function () {
      _this.hideResults();
    });

    _defineProperty(this, "handleResultMouseDown", function (event) {
      event.preventDefault();
    });

    _defineProperty(this, "handleResultClick", function (event) {
      var target = event.target;
      var result = closest(target, '[data-result-index]');

      if (result) {
        _this.selectedIndex = parseInt(result.dataset.resultIndex, 10);
        var selectedResult = _this.results[_this.selectedIndex];

        _this.selectResult();

        _this.onSubmit(selectedResult);
      }
    });

    _defineProperty(this, "handleArrows", function (selectedIndex) {
      // Loop selectedIndex back to first or last result if out of bounds
      var resultsCount = _this.results.length;
      _this.selectedIndex = (selectedIndex % resultsCount + resultsCount) % resultsCount; // Update results and aria attributes

      _this.onUpdate(_this.results, _this.selectedIndex);
    });

    _defineProperty(this, "selectResult", function () {
      var selectedResult = _this.results[_this.selectedIndex];

      if (selectedResult) {
        _this.setValue(selectedResult);
      }

      _this.hideResults();
    });

    _defineProperty(this, "updateResults", function (value) {
      var currentSearch = ++_this.searchCounter;

      _this.onLoading();

      _this.search(value).then(function (results) {
        if (currentSearch !== _this.searchCounter) {
          return;
        }

        _this.results = results;

        _this.onLoaded();

        if (_this.results.length === 0) {
          _this.hideResults();

          return;
        }

        _this.selectedIndex = _this.autoSelect ? 0 : -1;

        _this.onUpdate(_this.results, _this.selectedIndex);

        _this.showResults();
      });
    });

    _defineProperty(this, "showResults", function () {
      _this.setAttribute('aria-expanded', true);

      _this.onShow();
    });

    _defineProperty(this, "hideResults", function () {
      _this.selectedIndex = -1;
      _this.results = [];

      _this.setAttribute('aria-expanded', false);

      _this.setAttribute('aria-activedescendant', '');

      _this.onUpdate(_this.results, _this.selectedIndex);

      _this.onHide();
    });

    _defineProperty(this, "checkSelectedResultVisible", function (resultsElement) {
      var selectedResultElement = resultsElement.querySelector("[data-result-index=\"".concat(_this.selectedIndex, "\"]"));

      if (!selectedResultElement) {
        return;
      }

      var resultsPosition = resultsElement.getBoundingClientRect();
      var selectedPosition = selectedResultElement.getBoundingClientRect();

      if (selectedPosition.top < resultsPosition.top) {
        // Element is above viewable area
        resultsElement.scrollTop -= resultsPosition.top - selectedPosition.top;
      } else if (selectedPosition.bottom > resultsPosition.bottom) {
        // Element is below viewable area
        resultsElement.scrollTop += selectedPosition.bottom - resultsPosition.bottom;
      }
    });

    this.search = isPromise(search) ? search : function (value) {
      return Promise.resolve(search(value));
    };
    this.autoSelect = autoSelect;
    this.setValue = setValue;
    this.setAttribute = setAttribute;
    this.onUpdate = onUpdate;
    this.onSubmit = onSubmit;
    this.onShow = onShow;
    this.onHide = onHide;
    this.onLoading = onLoading;
    this.onLoaded = onLoaded;
  };

  // Generates a unique ID, with optional prefix. Adapted from
  // https://github.com/lodash/lodash/blob/61acdd0c295e4447c9c10da04e287b1ebffe452c/uniqueId.js
  var idCounter = 0;

  var uniqueId = function uniqueId() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return "".concat(prefix).concat(++idCounter);
  };

  // Calculates whether element2 should be above or below element1. Always
  // places element2 below unless all of the following:
  // 1. There isn't enough visible viewport below to fit element2
  // 2. There is more room above element1 than there is below
  // 3. Placing elemen2 above 1 won't overflow window
  var getRelativePosition = function getRelativePosition(element1, element2) {
    var position1 = element1.getBoundingClientRect();
    var position2 = element2.getBoundingClientRect();
    var positionAbove =
    /* 1 */
    position1.bottom + position2.height > window.innerHeight &&
    /* 2 */
    window.innerHeight - position1.bottom < position1.top &&
    /* 3 */
    window.pageYOffset + position1.top - position2.height > 0;
    return positionAbove ? 'above' : 'below';
  };

  // Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  var debounce = function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;

      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // string in the format: `key1="value1" key2="value2"` for easy use in an HTML string.

  var Props =
  /*#__PURE__*/
  function () {
    function Props(index, selectedIndex, baseClass) {
      _classCallCheck(this, Props);

      this.id = "".concat(baseClass, "-result-").concat(index);
      this["class"] = "".concat(baseClass, "-result");
      this['data-result-index'] = index;
      this.role = 'option';

      if (index === selectedIndex) {
        this['aria-selected'] = 'true';
      }
    }

    _createClass(Props, [{
      key: "toString",
      value: function toString() {
        var _this = this;

        return Object.keys(this).reduce(function (str, key) {
          return "".concat(str, " ").concat(key, "=\"").concat(_this[key], "\"");
        }, '');
      }
    }]);

    return Props;
  }();

  var Autocomplete = function Autocomplete(root) {
    var _this2 = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        search = _ref.search,
        _ref$onSubmit = _ref.onSubmit,
        onSubmit = _ref$onSubmit === void 0 ? function () {} : _ref$onSubmit,
        _ref$onUpdate = _ref.onUpdate,
        onUpdate = _ref$onUpdate === void 0 ? function () {} : _ref$onUpdate,
        _ref$baseClass = _ref.baseClass,
        baseClass = _ref$baseClass === void 0 ? 'autocomplete' : _ref$baseClass,
        autoSelect = _ref.autoSelect,
        _ref$getResultValue = _ref.getResultValue,
        getResultValue = _ref$getResultValue === void 0 ? function (result) {
      return result;
    } : _ref$getResultValue,
        renderResult = _ref.renderResult,
        _ref$debounceTime = _ref.debounceTime,
        debounceTime = _ref$debounceTime === void 0 ? 0 : _ref$debounceTime;

    _classCallCheck(this, Autocomplete);

    _defineProperty(this, "expanded", false);

    _defineProperty(this, "loading", false);

    _defineProperty(this, "position", {});

    _defineProperty(this, "resetPosition", true);

    _defineProperty(this, "initialize", function () {
      _this2.root.style.position = 'relative';

      _this2.input.setAttribute('role', 'combobox');

      _this2.input.setAttribute('autocomplete', 'off');

      _this2.input.setAttribute('autocapitalize', 'off');

      _this2.input.setAttribute('autocorrect', 'off');

      _this2.input.setAttribute('spellcheck', 'false');

      _this2.input.setAttribute('aria-autocomplete', 'list');

      _this2.input.setAttribute('aria-haspopup', 'listbox');

      _this2.input.setAttribute('aria-expanded', 'false');

      _this2.resultList.setAttribute('role', 'listbox');

      _this2.resultList.style.position = 'absolute';
      _this2.resultList.style.zIndex = '1';
      _this2.resultList.style.width = '100%';
      _this2.resultList.style.boxSizing = 'border-box'; // Generate ID for results list if it doesn't have one

      if (!_this2.resultList.id) {
        _this2.resultList.id = uniqueId("".concat(_this2.baseClass, "-result-list-"));
      }

      _this2.input.setAttribute('aria-owns', _this2.resultList.id);

      document.body.addEventListener('click', _this2.handleDocumentClick);

      _this2.input.addEventListener('input', _this2.core.handleInput);

      _this2.input.addEventListener('keydown', _this2.core.handleKeyDown);

      _this2.input.addEventListener('focus', _this2.core.handleFocus);

      _this2.input.addEventListener('blur', _this2.core.handleBlur);

      _this2.resultList.addEventListener('mousedown', _this2.core.handleResultMouseDown);

      _this2.resultList.addEventListener('click', _this2.core.handleResultClick);

      _this2.updateStyle();
    });

    _defineProperty(this, "setAttribute", function (attribute, value) {
      _this2.input.setAttribute(attribute, value);
    });

    _defineProperty(this, "setValue", function (result) {
      _this2.input.value = result ? _this2.getResultValue(result) : '';
    });

    _defineProperty(this, "renderResult", function (result, props) {
      return "<li ".concat(props, ">").concat(_this2.getResultValue(result), "</li>");
    });

    _defineProperty(this, "handleUpdate", function (results, selectedIndex) {
      _this2.resultList.innerHTML = '';
      results.forEach(function (result, index) {
        var props = new Props(index, selectedIndex, _this2.baseClass);

        var resultHTML = _this2.renderResult(result, props);

        if (typeof resultHTML === 'string') {
          _this2.resultList.insertAdjacentHTML('beforeend', resultHTML);
        } else {
          _this2.resultList.insertAdjacentElement('beforeend', resultHTML);
        }
      });

      _this2.input.setAttribute('aria-activedescendant', selectedIndex > -1 ? "".concat(_this2.baseClass, "-result-").concat(selectedIndex) : '');

      if (_this2.resetPosition) {
        _this2.resetPosition = false;
        _this2.position = getRelativePosition(_this2.input, _this2.resultList);

        _this2.updateStyle();
      }

      _this2.core.checkSelectedResultVisible(_this2.resultList);

      _this2.onUpdate(results, selectedIndex);
    });

    _defineProperty(this, "handleShow", function () {
      _this2.expanded = true;

      _this2.updateStyle();
    });

    _defineProperty(this, "handleHide", function () {
      _this2.expanded = false;
      _this2.resetPosition = true;

      _this2.updateStyle();
    });

    _defineProperty(this, "handleLoading", function () {
      _this2.loading = true;

      _this2.updateStyle();
    });

    _defineProperty(this, "handleLoaded", function () {
      _this2.loading = false;

      _this2.updateStyle();
    });

    _defineProperty(this, "handleDocumentClick", function (event) {
      if (_this2.root.contains(event.target)) {
        return;
      }

      _this2.core.hideResults();
    });

    _defineProperty(this, "updateStyle", function () {
      _this2.root.dataset.expanded = _this2.expanded;
      _this2.root.dataset.loading = _this2.loading;
      _this2.root.dataset.position = _this2.position;
      _this2.resultList.style.visibility = _this2.expanded ? 'visible' : 'hidden';
      _this2.resultList.style.pointerEvents = _this2.expanded ? 'auto' : 'none';

      if (_this2.position === 'below') {
        _this2.resultList.style.bottom = null;
        _this2.resultList.style.top = '100%';
      } else {
        _this2.resultList.style.top = null;
        _this2.resultList.style.bottom = '100%';
      }
    });

    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    this.input = this.root.querySelector('input');
    this.resultList = this.root.querySelector('ul');
    this.baseClass = baseClass;
    this.getResultValue = getResultValue;
    this.onUpdate = onUpdate;

    if (typeof renderResult === 'function') {
      this.renderResult = renderResult;
    }

    var core = new AutocompleteCore({
      search: search,
      autoSelect: autoSelect,
      setValue: this.setValue,
      setAttribute: this.setAttribute,
      onUpdate: this.handleUpdate,
      onSubmit: onSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
      onLoading: this.handleLoading,
      onLoaded: this.handleLoaded
    });

    if (debounceTime > 0) {
      core.handleInput = debounce(core.handleInput, debounceTime);
    }

    this.core = core;
    this.initialize();
  } // Set up aria attributes and events
  ;

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var SuggestFilter;
  (function (SuggestFilter) {
      SuggestFilter[SuggestFilter["all"] = 0] = "all";
      SuggestFilter[SuggestFilter["prefix"] = 1] = "prefix";
      SuggestFilter[SuggestFilter["contains"] = 2] = "contains"; // (default) checks if the typed text is inside of the suggested string
  })(SuggestFilter || (SuggestFilter = {}));

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Suggest {
      constructor(tobagoIn) {
          this.tobagoIn = tobagoIn;
      }
      init() {
          if (!this.suggest) {
              console.warn("[tobago-suggest] could not find tobago-suggest");
              return;
          }
          this.registerAjaxListener();
          this.base.classList.add("autocomplete");
          this.suggestInput.classList.add("autocomplete-input");
          this.suggestInput.insertAdjacentHTML("beforebegin", "<div class=\"autocomplete-pseudo-container\"></div>");
          this.suggestInput.insertAdjacentHTML("afterend", "<ul class=\"autocomplete-result-list\"></ul>");
          const options = {
              search: (input) => {
                  console.debug("[tobago-suggest] input = '%s'", input);
                  const minChars = this.minChars ? this.minChars : 1;
                  if (input.length < minChars) {
                      return [];
                  }
                  this.hiddenInput.value = input.toLowerCase();
                  this.positioningSpinner();
                  return new Promise(resolve => {
                      if (input.length < 1) {
                          return resolve([]);
                      }
                      if (this.update) {
                          this.resolve = resolve;
                          const suggestId = this.suggest.id;
                          jsf.ajax.request(suggestId, null, {
                              "javax.faces.behavior.event": "suggest",
                              execute: suggestId,
                              render: suggestId
                          });
                      }
                      else {
                          switch (this.filter) {
                              case SuggestFilter.all:
                                  return resolve(this.filterAll());
                              case SuggestFilter.prefix:
                                  return resolve(this.filterPrefix());
                              default:
                                  return resolve(this.filterContains());
                          }
                      }
                  });
              },
              onUpdate: (results, selectedIndex) => {
                  this.positioningResultList();
                  this.setResultListMaxHeight();
              },
              debounceTime: this.delay
          };
          new Autocomplete(this.base, options);
          if (!this.localMenu) {
              this.menuStore.append(this.resultList);
          }
      }
      registerAjaxListener() {
          jsf.ajax.addOnEvent(this.resolvePromise.bind(this));
      }
      resolvePromise(event) {
          if (event.source === this.suggest && event.status === "success") {
              return this.resolve(this.filterAll());
          }
      }
      filterAll() {
          return this.items;
      }
      filterPrefix() {
          return this.items.filter(item => {
              return item.toLowerCase().startsWith(this.hiddenInput.value);
          });
      }
      filterContains() {
          return this.items.filter(item => {
              return item.toLowerCase().indexOf(this.hiddenInput.value) > -1;
          });
      }
      positioningSpinner() {
          const baseRect = this.base.getBoundingClientRect();
          const suggestInputRect = this.suggestInput.getBoundingClientRect();
          const suggestInputStyle = getComputedStyle(this.suggestInput);
          const pseudoContainer = this.pseudoContainer;
          pseudoContainer.style.left = `${suggestInputRect.x - baseRect.x + suggestInputRect.width
            - parseFloat(getComputedStyle(pseudoContainer, ":after").width)
            - parseFloat(suggestInputStyle.marginRight)
            - parseFloat(suggestInputStyle.borderRight)
            - parseFloat(suggestInputStyle.paddingRight)}px`;
          pseudoContainer.style.top = `${suggestInputRect.y - baseRect.y + (suggestInputRect.height / 2)}px`;
      }
      positioningResultList() {
          const space = 2;
          if (this.localMenu) {
              const parentRect = this.suggestInput.parentElement.getBoundingClientRect();
              const suggestInputRect = this.suggestInput.getBoundingClientRect();
              this.resultList.style.marginLeft = `${suggestInputRect.x - parentRect.x}px`;
              this.resultList.style.maxWidth = `${suggestInputRect.width}px`;
              this.resultList.style.marginTop = `${space}px`;
              this.resultList.style.marginBottom = `${space}px`;
          }
          else {
              const suggestInputRect = this.suggestInput.getBoundingClientRect();
              this.resultList.style.minWidth = `${suggestInputRect.width}px`;
              this.resultList.style.left = `${suggestInputRect.left}px`;
              if (this.resultListPosition === "below") {
                  this.resultList.style.marginTop =
                      `${window.scrollY + suggestInputRect.top + suggestInputRect.height + space}px`;
                  this.resultList.style.marginBottom = null;
              }
              else if (this.resultListPosition === "above") {
                  this.resultList.style.marginTop = null;
                  this.resultList.style.marginBottom = `${-(window.scrollY + suggestInputRect.top - space)}px`;
              }
          }
      }
      setResultListMaxHeight() {
          const resultListEntry = this.resultList.querySelector(".autocomplete-result");
          if (this.maxItems && resultListEntry) {
              const resultListStyle = getComputedStyle(this.resultList);
              this.resultList.style.maxHeight = `${parseFloat(resultListStyle.borderTop)
                + parseFloat(resultListStyle.paddingTop)
                + (this.maxItems * parseFloat(getComputedStyle(resultListEntry).height))
                + parseFloat(resultListStyle.paddingBottom)
                + parseFloat(resultListStyle.borderBottom)}px`;
          }
      }
      get base() {
          return this.tobagoIn;
      }
      get pseudoContainer() {
          return this.base.querySelector(".autocomplete-pseudo-container");
      }
      get suggestInput() {
          const root = this.base.getRootNode();
          return root.getElementById(this.suggest.getAttribute("for"));
      }
      get suggest() {
          return this.base.querySelector("tobago-suggest");
      }
      get hiddenInput() {
          return this.suggest.querySelector(":scope > input[type=hidden]");
      }
      get items() {
          return JSON.parse(this.suggest.getAttribute("items"));
      }
      get resultList() {
          const root = this.base.getRootNode();
          const resultListId = this.suggestInput.getAttribute("aria-owns");
          return root.getElementById(resultListId);
      }
      get resultListPosition() {
          return this.base.dataset.position;
      }
      get menuStore() {
          const root = this.base.getRootNode();
          return root.querySelector(".tobago-page-menuStore");
      }
      get update() {
          return this.suggest.getAttribute("update") !== null;
      }
      get delay() {
          return parseInt(this.suggest.getAttribute("delay"));
      }
      get maxItems() {
          return parseInt(this.suggest.getAttribute("max-items"));
      }
      get minChars() {
          return parseInt(this.suggest.getAttribute("min-chars"));
      }
      get localMenu() {
          return this.suggest.getAttribute("local-menu") !== null;
      }
      get filter() {
          return SuggestFilter[this.suggest.getAttribute("filter")];
      }
  }

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class In extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.input.addEventListener("focus", Focus.setLastFocusId);
          if (this.querySelector("tobago-suggest")) {
              const suggest = new Suggest(this);
              suggest.init();
          }
      }
      get input() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::field");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-in") == null) {
          window.customElements.define("tobago-in", In);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Messages extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          for (const closeButton of this.closeButtons) {
              closeButton.addEventListener("click", this.closeAlert);
          }
      }
      closeAlert(event) {
          this.closest(".alert").remove();
      }
      get closeButtons() {
          return this.querySelectorAll(".alert button.btn-close");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-messages") == null) {
          window.customElements.define("tobago-messages", Messages);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Config {
      static set(key, value) {
          this.map.set(key, value);
      }
      static get(key) {
          const value = this.map.get(key);
          if (value) {
              return value;
          }
          else {
              console.warn("Config.get(" + key + ") = undefined");
              return 0;
          }
      }
  }
  Config.map = new Map();

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // XXX issue: if a ajax call is scheduled on the same element, the animation arrow will stacking and not desapearing.
  // XXX issue: "error" is not implemented correctly
  // see http://localhost:8080/demo-5-snapshot/content/140-partial/Partial_Ajax.xhtml to use this feature
  // XXX todo: check full page transitions
  Config.set("Tobago.waitOverlayDelay", 1000);
  Config.set("Ajax.waitOverlayDelay", 1000);
  class Overlay extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          setTimeout(this.render.bind(this), this.delay);
      }
      render() {
          const icon = this.error
              ? `<i class="bi-flash fs-1"></i>`
              : `<span class="spinner-border"></span>`;
          this.insertAdjacentHTML("afterbegin", `<div>${icon}</div>`);
      }
      get for() {
          return this.getAttribute("for");
      }
      set for(forString) {
          this.setAttribute("for", forString);
      }
      /**
       * Is this overlay for an AJAX request, or an normal submit?
       * We need this information, because AJAX need to clone the animated image, but for a normal submit
       * we must not clone it, because the animation stops in some browsers.
       */
      get ajax() {
          return this.hasAttribute("ajax");
      }
      set ajax(ajax) {
          if (ajax) {
              this.setAttribute("ajax", "");
          }
          else {
              this.removeAttribute("ajax");
          }
      }
      /**
       * This boolean indicates, if the overlay is "error" or "wait".
       */
      get error() {
          return this.hasAttribute("error");
      }
      set error(error) {
          if (error) {
              this.setAttribute("error", "");
          }
          else {
              this.removeAttribute("error");
          }
      }
      /**
       * The delay for the wait overlay. If not set the default delay is read from Tobago.Config.
       */
      get delay() {
          if (this.hasAttribute("delay")) {
              return parseInt(this.getAttribute("delay"));
          }
          else {
              return Config.get(this.ajax ? "Ajax.waitOverlayDelay" : "Tobago.waitOverlayDelay");
          }
      }
      set delay(delay) {
          this.setAttribute("delay", String(delay));
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-overlay") == null) {
          window.customElements.define("tobago-overlay", Overlay);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Panel extends HTMLElement {
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-panel") == null) {
          window.customElements.define("tobago-panel", Panel);
      }
  });

  /* Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to you under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // for old Edge (before Chromium)
  try {
      document.querySelector(":scope");
  }
  catch (exception) {
      const querySelectorWithScope = polyfill(Element.prototype.querySelector);
      Element.prototype.querySelector = function querySelector(selectors) {
          return querySelectorWithScope.apply(this, arguments);
      };
      const querySelectorAllWithScope = polyfill(Element.prototype.querySelectorAll);
      Element.prototype.querySelectorAll = function querySelectorAll(selectors) {
          return querySelectorAllWithScope.apply(this, arguments);
      };
      if (Element.prototype.matches) {
          const matchesWithScope = polyfill(Element.prototype.matches);
          Element.prototype.matches = function matches(selectors) {
              return matchesWithScope.apply(this, arguments);
          };
      }
      if (Element.prototype.closest) {
          const closestWithScope = polyfill(Element.prototype.closest);
          Element.prototype.closest = function closest(selectors) {
              return closestWithScope.apply(this, arguments);
          };
      }
      function polyfill(prototypeFunc) {
          const scope = /:scope(?![\w-])/gi;
          return function (selector) {
              if (selector.toLowerCase().indexOf(":scope") >= 0) {
                  const attr = "tobagoScopeAttribute";
                  arguments[0] = selector.replace(scope, `[${attr}]`);
                  this.setAttribute(attr, "");
                  const element = prototypeFunc.apply(this, arguments);
                  this.removeAttribute(attr);
                  return element;
              }
              else {
                  return prototypeFunc.apply(this, arguments);
              }
          };
      }
  }
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // import {Popover} from "bootstrap/dist/js/bootstrap.bundle";
  class TobagoPopover extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.popover = new Popover(this.trigger, {
              container: this.menuStore
          });
      }
      get trigger() {
          return this;
      }
      get menuStore() {
          const root = this.getRootNode();
          return root.querySelector(".tobago-page-menuStore");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-popover") == null) {
          window.customElements.define("tobago-popover", TobagoPopover);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TobagoRange extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.popover = new Popover(this.range, {
              container: this.menuStore,
              content: this.content.bind(this),
              trigger: "input",
              placement: "auto",
              delay: {
                  show: 0,
                  hide: 500
              }
          });
          const range = this.range;
          const listener = this.updatePopover.bind(this);
          range.addEventListener("input", listener);
          range.addEventListener("focus", listener);
      }
      get range() {
          return this.querySelector("input[type=range]");
      }
      get menuStore() {
          const root = this.getRootNode();
          return root.querySelector(".tobago-page-menuStore");
      }
      get tooltipBody() {
          return this.querySelector(".popover-body");
      }
      content() {
          return this.range.value;
      }
      updatePopover() {
          // XXX why update doesn't show the new content?
          //  this.popover.update();
          this.popover.show();
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-range") == null) {
          window.customElements.define("tobago-range", TobagoRange);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TobagoReload extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.schedule(this.id, this.component.id, this.frequency);
      }
      schedule(reloadId, componentId, reloadMillis) {
          if (reloadMillis > 0) {
              // may remove old schedule
              const oldTimeout = TobagoReload.timeoutMap.get(componentId);
              if (oldTimeout) {
                  console.debug("clear reload timeout '%s' for #'%s'", oldTimeout, componentId);
                  window.clearTimeout(oldTimeout);
                  TobagoReload.timeoutMap.delete(componentId);
              }
              // add new schedule
              const timeout = window.setTimeout(function () {
                  console.debug("reloading #'%s'", componentId);
                  jsf.ajax.request(reloadId, null, {
                      "javax.faces.behavior.event": "reload",
                      execute: `${reloadId} ${componentId}`,
                      render: `${reloadId} ${componentId}`
                  });
              }, reloadMillis);
              console.debug("adding reload timeout '%s' for #'%s'", timeout, componentId);
              TobagoReload.timeoutMap.set(componentId, timeout);
          }
      }
      get component() {
          return this.parentElement;
      }
      /** frequency is the number of millis for the timeout */
      get frequency() {
          const frequency = this.getAttribute("frequency");
          if (frequency) {
              return Number.parseFloat(frequency);
          }
          else {
              return 0;
          }
      }
  }
  /**
   * Map to store the scheduled timeouts by id, to prevent duplicate scheduling of the same elements.
   */
  TobagoReload.timeoutMap = new Map();
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-reload") == null) {
          window.customElements.define("tobago-reload", TobagoReload);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TobagoScroll extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          const text = this.hiddenElement.value;
          const values = JSON.parse(text);
          if (values.length === 2) {
              this.parentElement.scrollLeft = values[0];
              this.parentElement.scrollTop = values[1];
          }
          else {
              console.warn("Syntax error for scroll position: ", text);
          }
          this.parentElement.addEventListener("scroll", this.storeScrollPosition.bind(this));
      }
      storeScrollPosition(event) {
          const panel = event.currentTarget;
          const scrollLeft = panel.scrollLeft;
          const scrollTop = panel.scrollTop;
          this.hiddenElement.value = JSON.stringify([scrollLeft, scrollTop]);
      }
      get hiddenElement() {
          return this.querySelector("input");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-scroll") == null) {
          window.customElements.define("tobago-scroll", TobagoScroll);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectBooleanCheckbox extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.field.addEventListener("focus", Focus.setLastFocusId);
          if (this.field.readOnly) {
              this.field.addEventListener("click", preventClick);
          }
          function preventClick(event) {
              // in the "readonly" case, prevent the default, which is changing the "checked" state
              event.preventDefault();
          }
      }
      get field() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::field");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-boolean-checkbox") == null) {
          window.customElements.define("tobago-select-boolean-checkbox", SelectBooleanCheckbox);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectBooleanToggle extends SelectBooleanCheckbox {
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-boolean-toggle") == null) {
          window.customElements.define("tobago-select-boolean-toggle", SelectBooleanToggle);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectManyCheckbox extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          for (const input of this.inputs) {
              input.addEventListener("focus", Focus.setLastFocusId);
              if (input.readOnly) {
                  input.addEventListener("click", preventClick);
              }
              function preventClick(event) {
                  // in the "readonly" case, prevent the default, which is changing the "checked" state
                  event.preventDefault();
              }
          }
      }
      get inputs() {
          return this.querySelectorAll(`input[name='${this.id}']`);
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-many-checkbox") == null) {
          window.customElements.define("tobago-select-many-checkbox", SelectManyCheckbox);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectOneListbox extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.saveSelection();
          this.field.addEventListener("click", this.clickSelection.bind(this));
          this.field.addEventListener("focus", Focus.setLastFocusId);
      }
      clickSelection(event) {
          const select = event.currentTarget;
          if (!select.required && this.field.selectedIndex === this.oldselectedIndex) {
              this.field.selectedIndex = -1;
          }
          this.saveSelection();
      }
      saveSelection() {
          this.oldselectedIndex = this.field.selectedIndex;
      }
      get field() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::field");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-one-listbox") == null) {
          window.customElements.define("tobago-select-one-listbox", SelectOneListbox);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectManyListbox extends SelectOneListbox {
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-many-listbox") == null) {
          window.customElements.define("tobago-select-many-listbox", SelectManyListbox);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectManyShuttle extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.unselectedSelect.addEventListener("focus", Focus.setLastFocusId);
          this.selectedSelect.addEventListener("focus", Focus.setLastFocusId);
          if (this.unselectedSelect.getAttribute("readonly") !== "readonly" && !this.unselectedSelect.disabled) {
              this.unselectedSelect.addEventListener("dblclick", this.addSelectedItems.bind(this));
          }
          if (this.selectedSelect.getAttribute("readonly") !== "readonly" && !this.selectedSelect.disabled) {
              this.selectedSelect.addEventListener("dblclick", this.removeSelectedItems.bind(this));
          }
          if (!this.addAllButton.disabled) {
              this.addAllButton.addEventListener("click", this.addAllItems.bind(this));
          }
          if (!this.addButton.disabled) {
              this.addButton.addEventListener("click", this.addSelectedItems.bind(this));
          }
          if (!this.removeButton.disabled) {
              this.removeButton.addEventListener("click", this.removeSelectedItems.bind(this));
          }
          if (!this.removeAllButton.disabled) {
              this.removeAllButton.addEventListener("click", this.removeAllItems.bind(this));
          }
      }
      addAllItems(event) {
          this.addItems(this.unselectedSelect.querySelectorAll("option:not(:disabled)"));
      }
      addSelectedItems(event) {
          this.addItems(this.unselectedSelect.querySelectorAll("option:checked"));
      }
      removeSelectedItems(event) {
          this.removeItems(this.selectedSelect.querySelectorAll("option:checked"));
      }
      removeAllItems(event) {
          this.removeItems(this.selectedSelect.querySelectorAll("option:not(:disabled)"));
      }
      addItems(options) {
          for (const option of options) {
              this.selectedSelect.add(option);
              this.changeHiddenOption(option, true);
          }
      }
      removeItems(options) {
          for (const option of options) {
              this.unselectedSelect.add(option);
              this.changeHiddenOption(option, false);
          }
      }
      changeHiddenOption(option, select) {
          const hiddenOption = this.hiddenSelect.querySelector(`option[value='${option.value}']`);
          hiddenOption.selected = select;
          this.dispatchEvent(new Event("change"));
      }
      get unselectedSelect() {
          return this.querySelector(".tobago-selectManyShuttle-unselected");
      }
      get selectedSelect() {
          return this.querySelector(".tobago-selectManyShuttle-selected");
      }
      get hiddenSelect() {
          return this.querySelector(".tobago-selectManyShuttle-hidden");
      }
      get addAllButton() {
          return this.querySelector(".tobago-selectManyShuttle-addAll");
      }
      get addButton() {
          return this.querySelector(".tobago-selectManyShuttle-add");
      }
      get removeButton() {
          return this.querySelector(".tobago-selectManyShuttle-remove");
      }
      get removeAllButton() {
          return this.querySelector(".tobago-selectManyShuttle-removeAll");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-many-shuttle") == null) {
          window.customElements.define("tobago-select-many-shuttle", SelectManyShuttle);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectOneChoice extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.field.addEventListener("focus", Focus.setLastFocusId);
      }
      get field() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::field");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-one-choice") == null) {
          window.customElements.define("tobago-select-one-choice", SelectOneChoice);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SelectOneRadio extends HTMLElement {
      constructor() {
          super();
          this.oldCheckedId = "";
      }
      connectedCallback() {
          this.saveSelection();
          for (const radio of this.radioGroup) {
              radio.addEventListener("focus", Focus.setLastFocusId);
              radio.addEventListener("click", this.clickSelection.bind(this));
          }
      }
      clickSelection(event) {
          const radio = event.currentTarget;
          if (radio.readOnly) {
              this.revertSelection();
          }
          else if (!radio.disabled && !radio.required && radio.id === this.oldCheckedId) {
              radio.checked = false;
              this.oldCheckedId = "";
          }
          this.saveSelection();
      }
      revertSelection() {
          for (const radio of this.radioGroup) {
              radio.checked = radio.id === this.oldCheckedId;
          }
      }
      saveSelection() {
          for (const radio of this.radioGroup) {
              if (radio.checked) {
                  this.oldCheckedId = radio.id;
              }
          }
      }
      get radioGroup() {
          return this.querySelectorAll(`input[type='radio'][name='${this.id}']`);
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-select-one-radio") == null) {
          window.customElements.define("tobago-select-one-radio", SelectOneRadio);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Sheet extends HTMLElement {
      constructor() {
          super();
      }
      static getScrollBarSize() {
          const body = document.getElementsByTagName("body").item(0);
          const outer = document.createElement("div");
          outer.style.visibility = "hidden";
          outer.style.width = "100px";
          outer.style.overflow = "scroll";
          body.append(outer);
          const inner = document.createElement("div");
          inner.style.width = "100%";
          outer.append(inner);
          const widthWithScroll = inner.offsetWidth;
          body.removeChild(outer);
          return 100 - widthWithScroll;
      }
      static isInputElement(element) {
          return ["INPUT", "TEXTAREA", "SELECT", "A", "BUTTON"].indexOf(element.tagName) > -1;
      }
      static getRowTemplate(columns, rowIndex) {
          return `<tr row-index="${rowIndex}" class="tobago-sheet-row" dummy="dummy">
<td class="tobago-sheet-cell" colspan="${columns}"> </td>
</tr>`;
      }
      connectedCallback() {
          if (this.lazyUpdate) {
              // nothing to do here, will be done in method lazyResponse()
              return;
          }
          // synchronize column widths ----------------------------------------------------------------------------------- //
          // basic idea: there are two possible sources for the sizes:
          // 1. the columns attribute of <tc:sheet> like {"columns":[1.0,1.0,1.0]}, held by data attribute "tobago-layout"
          // 2. the hidden field which may contain a value like ",300,200,100,"
          //
          // The 1st source usually is the default set by the developer.
          // The 2nd source usually is the value set by the user manipulating the column widths.
          //
          // So, if the 2nd is set, we use it, if not set, we use the 1st source.
          const columnWidths = this.loadColumnWidths();
          console.info("columnWidths: %s", JSON.stringify(columnWidths));
          if (columnWidths && columnWidths.length === 0) { // active, but empty
              // otherwise use the layout definition
              const tokens = JSON.parse(this.dataset.tobagoLayout).columns;
              const columnRendered = this.isColumnRendered();
              const headerCols = this.getHeaderCols();
              const bodyTable = this.getBodyTable();
              const bodyCols = this.getBodyCols();
              console.assert(headerCols.length - 1 === bodyCols.length, "header and body column number doesn't match: %d != %d ", headerCols.length - 1, bodyCols.length);
              let sumRelative = 0; // tbd: is this needed?
              let widthRelative = bodyTable.offsetWidth;
              let r = 0;
              for (let i = 0; i < tokens.length; i++) {
                  if (columnRendered[i]) {
                      if (typeof tokens[i] === "number") {
                          sumRelative += tokens[i];
                      }
                      else if (typeof tokens[i] === "object" && tokens[i].measure !== undefined) {
                          const intValue = parseInt(tokens[i].measure);
                          if (tokens[i].measure.lastIndexOf("px") > 0) {
                              widthRelative -= intValue;
                          }
                          else if (tokens[i].measure.lastIndexOf("%") > 0) {
                              widthRelative -= bodyTable.offsetWidth * intValue / 100;
                          }
                      }
                      else if (tokens[i] === "auto") {
                          const value = headerCols.item(r).offsetWidth;
                          widthRelative -= value;
                          tokens[i] = { measure: `${value}px` }; // converting "auto" to a specific value
                      }
                      else {
                          console.debug("(layout columns a) auto? token[i]='%s' i=%i", tokens[i], i);
                      }
                  }
              }
              if (widthRelative < 0) {
                  widthRelative = 0;
              }
              r = 0;
              for (let i = 0; i < tokens.length; i++) {
                  let colWidth = 0;
                  if (columnRendered[i]) {
                      if (typeof tokens[i] === "number") {
                          colWidth = tokens[i] * widthRelative / sumRelative;
                      }
                      else if (typeof tokens[i] === "object" && tokens[i].measure !== undefined) {
                          const intValue = parseInt(tokens[i].measure);
                          if (tokens[i].measure.lastIndexOf("px") > 0) {
                              colWidth = intValue;
                          }
                          else if (tokens[i].measure.lastIndexOf("%") > 0) {
                              colWidth = bodyTable.offsetWidth * intValue / 100;
                          }
                      }
                      else {
                          console.debug("(layout columns b) auto? token[i]='%s' i=%i", tokens[i], i);
                      }
                      if (colWidth > 0) { // because tokens[i] == "auto"
                          headerCols.item(r).setAttribute("width", String(colWidth));
                          bodyCols.item(r).setAttribute("width", String(colWidth));
                      }
                      r++;
                  }
              }
          }
          this.addHeaderFillerWidth();
          // resize column: mouse events -------------------------------------------------------------------------------- //
          for (const resizeElement of this.querySelectorAll(".tobago-sheet-headerResize")) {
              resizeElement.addEventListener("click", function () {
                  return false;
              });
              resizeElement.addEventListener("mousedown", this.mousedown.bind(this));
          }
          // scrolling -------------------------------------------------------------------------------------------------- //
          const sheetBody = this.getBody();
          // restore scroll position
          const value = JSON.parse(this.getHiddenScrollPosition().getAttribute("value"));
          sheetBody.scrollLeft = value[0];
          sheetBody.scrollTop = value[1];
          this.syncScrolling();
          // scroll events
          sheetBody.addEventListener("scroll", this.scrollAction.bind(this));
          // add selection listeners ------------------------------------------------------------------------------------ //
          const selectionMode = this.dataset.tobagoSelectionMode;
          if (selectionMode === "single" || selectionMode === "singleOrNone" || selectionMode === "multi") {
              for (const row of this.getRowElements()) {
                  row.addEventListener("mousedown", this.mousedownOnRow.bind(this));
                  row.addEventListener("click", this.clickOnRow.bind(this));
              }
          }
          for (const checkbox of this.querySelectorAll(".tobago-sheet-cell > input.tobago-sheet-columnSelector")) {
              checkbox.addEventListener("click", (event) => {
                  event.preventDefault();
              });
          }
          // lazy load by scrolling ----------------------------------------------------------------- //
          const lazy = this.lazy;
          if (lazy) {
              // prepare the sheet with some auto-created (empty) rows
              const rowCount = this.rowCount;
              const sheetBody = this.tableBodyDiv;
              const tableBody = this.tableBody;
              const columns = tableBody.rows[0].cells.length;
              let current = tableBody.rows[0]; // current row in this algorithm, begin with first
              // the algorithm goes straight through all rows, not selectors, because of performance
              for (let i = 0; i < rowCount; i++) {
                  if (current) {
                      const rowIndex = Number(current.getAttribute("row-index"));
                      if (i < rowIndex) {
                          const template = Sheet.getRowTemplate(columns, i);
                          current.insertAdjacentHTML("beforebegin", template);
                      }
                      else if (i === rowIndex) {
                          current = current.nextElementSibling;
                          // } else { TBD: I think this is not possible
                          //   const template = Sheet.getRowTemplate(columns, i);
                          //   current.insertAdjacentHTML("afterend", template);
                          //   current = current.nextElementSibling as HTMLTableRowElement;
                      }
                  }
                  else {
                      const template = Sheet.getRowTemplate(columns, i);
                      tableBody.insertAdjacentHTML("beforeend", template);
                  }
              }
              sheetBody.addEventListener("scroll", this.lazyCheck.bind(this));
              // initial
              this.lazyCheck();
          }
          // ---------------------------------------------------------------------------------------- //
          for (const checkbox of this.querySelectorAll(".tobago-sheet-header .tobago-sheet-columnSelector")) {
              checkbox.addEventListener("click", this.clickOnCheckbox.bind(this));
          }
          // init paging by pages ---------------------------------------------------------------------------------------- //
          for (const pagingText of this.querySelectorAll(".tobago-sheet-pagingText")) {
              pagingText.addEventListener("click", this.clickOnPaging.bind(this));
              const pagingInput = pagingText.querySelector("input.tobago-sheet-pagingInput");
              pagingInput.addEventListener("blur", this.blurPaging.bind(this));
              pagingInput.addEventListener("keydown", function (event) {
                  if (event.keyCode === 13) {
                      event.stopPropagation();
                      event.preventDefault();
                      event.currentTarget.dispatchEvent(new Event("blur"));
                  }
              });
          }
      }
      // attribute getter + setter ---------------------------------------------------------- //
      get lazyActive() {
          return this.hasAttribute("lazy-active");
      }
      set lazyActive(update) {
          if (update) {
              this.setAttribute("lazy-active", "");
          }
          else {
              this.removeAttribute("lazy-active");
          }
      }
      get lazy() {
          return this.hasAttribute("lazy");
      }
      set lazy(update) {
          if (update) {
              this.setAttribute("lazy", "");
          }
          else {
              this.removeAttribute("lazy");
          }
      }
      get lazyUpdate() {
          return this.hasAttribute("lazy-update");
      }
      get rows() {
          return parseInt(this.getAttribute("rows"));
      }
      get rowCount() {
          return parseInt(this.getAttribute("row-count"));
      }
      get tableBodyDiv() {
          return this.querySelector(".tobago-sheet-body");
      }
      get tableBody() {
          return this.querySelector(".tobago-sheet-bodyTable>tbody");
      }
      // -------------------------------------------------------------------------------------- //
      /*
        when an event occurs (initial load OR scroll event OR AJAX response)
    
        then -> Tobago.Sheet.lazyCheck()
                1. check, if the lazy reload is currently active
                   a) yes -> do nothing and exit
                   b) no  -> step 2.
                2. check, if there are data need to load (depends on scroll position and already loaded data)
                   a) yes -> set lazy reload to active and make an AJAX request with Tobago.Sheet.reloadLazy()
                   b) no  -> do nothing and exit
    
         AJAX response -> 1. update the rows in the sheet from the response
                          2. go to the first part of this description
      */
      /**
       * Checks if a lazy update is required, because there are unloaded rows in the visible area.
       */
      lazyCheck(event) {
          if (this.lazyActive) {
              // nothing to do, because there is an active AJAX running
              return;
          }
          if (this.lastCheckMillis && Date.now() - this.lastCheckMillis < 100) {
              // do nothing, because the last call was just a moment ago
              return;
          }
          this.lastCheckMillis = Date.now();
          const next = this.nextLazyLoad();
          // console.info("next %o", next); // @DEV_ONLY
          if (next) {
              this.lazyActive = true;
              const rootNode = this.getRootNode();
              const input = rootNode.getElementById(this.id + ":pageActionlazy");
              input.value = String(next);
              this.reloadWithAction(input);
          }
      }
      nextLazyLoad() {
          // find first tr in current visible area
          const rows = this.rows;
          const rowElements = this.tableBody.rows;
          let min = 0;
          let max = rowElements.length;
          // binary search
          let i;
          while (min < max) {
              i = Math.floor((max - min) / 2) + min;
              // console.log("min i max -> %d %d %d", min, i, max); // @DEV_ONLY
              if (this.isRowAboveVisibleArea(rowElements[i])) {
                  min = i + 1;
              }
              else {
                  max = i;
              }
          }
          for (i = min; i < min + rows && i < rowElements.length; i++) {
              if (this.isRowDummy(rowElements[i])) {
                  return i + 1;
              }
          }
          return null;
      }
      isRowAboveVisibleArea(tr) {
          const sheetBody = this.tableBodyDiv;
          const viewStart = sheetBody.scrollTop;
          const trEnd = tr.offsetTop + tr.clientHeight;
          return trEnd < viewStart;
      }
      isRowDummy(tr) {
          return tr.hasAttribute("dummy");
      }
      lazyResponse(event) {
          let updates;
          if (event.status === "complete") {
              updates = event.responseXML.querySelectorAll("update");
              for (let i = 0; i < updates.length; i++) {
                  const update = updates[i];
                  const id = update.getAttribute("id");
                  if (id.indexOf(":") > -1) { // is a JSF element id, but not a technical id from the framework
                      console.debug(`[tobago-sheet][complete] Update after jsf.ajax complete: #${id}`); // @DEV_ONLY
                      const sheet = document.getElementById(id);
                      sheet.id = `${id}::lazy-temporary`;
                      const page = Page.page(this);
                      page.insertAdjacentHTML("beforeend", `<div id="${id}"></div>`);
                      document.getElementById(id);
                  }
              }
          }
          else if (event.status === "success") {
              updates = event.responseXML.querySelectorAll("update");
              for (let i = 0; i < updates.length; i++) {
                  const update = updates[i];
                  const id = update.getAttribute("id");
                  if (id.indexOf(":") > -1) { // is a JSF element id, but not a technical id from the framework
                      console.debug(`[tobago-sheet][success] Update after jsf.ajax complete: #${id}`); // @DEV_ONLY
                      // sync the new rows into the sheet
                      const sheetLoader = document.getElementById(id);
                      const sheet = document.getElementById(`${id}::lazy-temporary`);
                      sheet.id = id;
                      const tbody = sheet.querySelector(".tobago-sheet-bodyTable>tbody");
                      const newRows = sheetLoader.querySelectorAll(".tobago-sheet-bodyTable>tbody>tr");
                      for (i = 0; i < newRows.length; i++) {
                          const newRow = newRows[i];
                          const rowIndex = Number(newRow.getAttribute("row-index"));
                          const row = tbody.querySelector(`tr[row-index='${rowIndex}']`);
                          // replace the old row with the new row
                          row.insertAdjacentElement("afterend", newRow);
                          tbody.removeChild(row);
                      }
                      sheetLoader.parentElement.removeChild(sheetLoader);
                      this.lazyActive = false;
                  }
              }
          }
      }
      lazyError(data) {
          console.error(`Sheet lazy loading error:
Error Name: ${data.errorName}
Error errorMessage: ${data.errorMessage}
Response Code: ${data.responseCode}
Response Text: ${data.responseText}
Status: ${data.status}
Type: ${data.type}`);
      }
      // tbd: how to do this in Tobago 5?
      reloadWithAction(source) {
          console.debug(`reload sheet with action '${source.id}'`); // @DEV_ONLY
          const executeIds = this.id;
          const renderIds = this.id;
          const lazy = this.lazy;
          jsf.ajax.request(source.id, null, {
              "javax.faces.behavior.event": "reload",
              execute: executeIds,
              render: renderIds,
              onevent: lazy ? this.lazyResponse.bind(this) : undefined,
              onerror: lazy ? this.lazyError.bind(this) : undefined
          });
      }
      loadColumnWidths() {
          const hidden = document.getElementById(this.id + "::widths");
          if (hidden) {
              return JSON.parse(hidden.getAttribute("value"));
          }
          else {
              return undefined;
          }
      }
      saveColumnWidths(widths) {
          const hidden = document.getElementById(this.id + "::widths");
          if (hidden) {
              hidden.setAttribute("value", JSON.stringify(widths));
          }
          else {
              console.warn("ignored, should not be called, id='%s'", this.id);
          }
      }
      isColumnRendered() {
          const hidden = document.getElementById(this.id + "::rendered");
          return JSON.parse(hidden.getAttribute("value"));
      }
      addHeaderFillerWidth() {
          const last = document.getElementById(this.id).querySelector(".tobago-sheet-headerTable col:last-child");
          if (last) {
              last.setAttribute("width", String(Sheet.SCROLL_BAR_SIZE));
          }
      }
      mousedown(event) {
          Page.page(this).dataset.SheetMousedownData = this.id;
          // begin resizing
          console.debug("down");
          const resizeElement = event.currentTarget;
          const columnIndex = parseInt(resizeElement.dataset.tobagoColumnIndex);
          const headerColumn = this.getHeaderCols().item(columnIndex);
          this.mousemoveData = {
              columnIndex: columnIndex,
              originalClientX: event.clientX,
              originalHeaderColumnWidth: parseInt(headerColumn.getAttribute("width")),
              mousemoveListener: this.mousemove.bind(this),
              mouseupListener: this.mouseup.bind(this)
          };
          document.addEventListener("mousemove", this.mousemoveData.mousemoveListener);
          document.addEventListener("mouseup", this.mousemoveData.mouseupListener);
      }
      mousemove(event) {
          console.debug("move");
          let delta = event.clientX - this.mousemoveData.originalClientX;
          delta = -Math.min(-delta, this.mousemoveData.originalHeaderColumnWidth - 10);
          const columnWidth = this.mousemoveData.originalHeaderColumnWidth + delta;
          this.getHeaderCols().item(this.mousemoveData.columnIndex).setAttribute("width", String(columnWidth));
          this.getBodyCols().item(this.mousemoveData.columnIndex).setAttribute("width", String(columnWidth));
          if (window.getSelection) {
              window.getSelection().removeAllRanges();
          }
          return false;
      }
      mouseup(event) {
          console.debug("up");
          // switch off the mouse move listener
          document.removeEventListener("mousemove", this.mousemoveData.mousemoveListener);
          document.removeEventListener("mouseup", this.mousemoveData.mouseupListener);
          // copy the width values from the header to the body, (and build a list of it)
          const tokens = JSON.parse(this.dataset.tobagoLayout).columns;
          const columnRendered = this.isColumnRendered();
          const columnWidths = this.loadColumnWidths();
          const bodyTable = this.getBodyTable();
          const headerCols = this.getHeaderCols();
          const bodyCols = this.getBodyCols();
          const widths = [];
          let headerBodyColCount = 0;
          for (let i = 0; i < columnRendered.length; i++) {
              if (columnRendered[i]) {
                  // last column is the filler column
                  const newWidth = parseInt(headerCols.item(headerBodyColCount).getAttribute("width"));
                  // for the hidden field
                  widths[i] = newWidth;
                  const oldWidth = parseInt(bodyCols.item(headerBodyColCount).getAttribute("width"));
                  if (oldWidth !== newWidth) {
                      bodyCols.item(headerBodyColCount).setAttribute("width", String(newWidth));
                  }
                  headerBodyColCount++;
              }
              else if (columnWidths !== undefined && columnWidths.length >= i) {
                  widths[i] = columnWidths[i];
              }
              else {
                  if (typeof tokens[i] === "number") {
                      widths[i] = 100;
                  }
                  else if (typeof tokens[i] === "object" && tokens[i].measure !== undefined) {
                      const intValue = parseInt(tokens[i].measure);
                      if (tokens[i].measure.lastIndexOf("px") > 0) {
                          widths[i] = intValue;
                      }
                      else if (tokens[i].measure.lastIndexOf("%") > 0) {
                          widths[i] = parseInt(bodyTable.style.width) / 100 * intValue;
                      }
                  }
              }
          }
          // store the width values in a hidden field
          this.saveColumnWidths(widths);
          return false;
      }
      scrollAction(event) {
          console.debug("scroll");
          const sheetBody = event.currentTarget;
          this.syncScrolling();
          // store the position in a hidden field
          const hidden = this.getHiddenScrollPosition();
          hidden.setAttribute("value", JSON.stringify([Math.round(sheetBody.scrollLeft), Math.round(sheetBody.scrollTop)]));
      }
      mousedownOnRow(event) {
          console.debug("mousedownOnRow");
          this.mousedownOnRowData = {
              x: event.clientX,
              y: event.clientY
          };
      }
      clickOnCheckbox(event) {
          const checkbox = event.currentTarget;
          if (checkbox.checked) {
              this.selectAll();
          }
          else {
              this.deselectAll();
          }
      }
      clickOnRow(event) {
          const row = event.currentTarget;
          if (row.classList.contains("tobago-sheet-columnSelector") || !Sheet.isInputElement(row)) {
              if (Math.abs(this.mousedownOnRowData.x - event.clientX)
                  + Math.abs(this.mousedownOnRowData.y - event.clientY) > 5) {
                  // The user has moved the mouse. We assume, the user want to select some text inside the sheet,
                  // so we doesn't select the row.
                  return;
              }
              if (window.getSelection) {
                  window.getSelection().removeAllRanges();
              }
              const rows = this.getRowElements();
              const selector = this.getSelectorCheckbox(row);
              const selectionMode = this.dataset.tobagoSelectionMode;
              if ((!event.ctrlKey && !event.metaKey && !selector)
                  || selectionMode === "single" || selectionMode === "singleOrNone") {
                  this.deselectAll();
                  this.resetSelected();
              }
              const lastClickedRowIndex = parseInt(this.dataset.tobagoLastClickedRowIndex);
              if (event.shiftKey && selectionMode === "multi" && lastClickedRowIndex > -1) {
                  if (lastClickedRowIndex <= row.sectionRowIndex) {
                      this.selectRange(rows, lastClickedRowIndex, row.sectionRowIndex, true, false);
                  }
                  else {
                      this.selectRange(rows, row.sectionRowIndex, lastClickedRowIndex, true, false);
                  }
              }
              else if (selectionMode !== "singleOrNone" || !this.isRowSelected(row)) {
                  this.toggleSelection(row, selector);
              }
          }
      }
      clickOnPaging(event) {
          const element = event.currentTarget;
          const output = element.querySelector(".tobago-sheet-pagingOutput");
          output.style.display = "none";
          const input = element.querySelector(".tobago-sheet-pagingInput");
          input.style.display = "initial";
          input.focus();
          input.select();
      }
      blurPaging(event) {
          const input = event.currentTarget;
          const output = input.parentElement.querySelector(".tobago-sheet-pagingOutput");
          if (output.innerHTML !== input.value) {
              console.debug("Reloading sheet '%s' old value='%s' new value='%s'", this.id, output.innerHTML, input.value);
              output.innerHTML = input.value;
              jsf.ajax.request(input.id, null, {
                  "javax.faces.behavior.event": "reload",
                  execute: this.id,
                  render: this.id
              });
          }
          else {
              console.info("no update needed");
              input.style.display = "none";
              output.style.display = "initial";
          }
      }
      syncScrolling() {
          // sync scrolling of body to header
          const header = this.getHeader();
          if (header) {
              header.scrollLeft = this.getBody().scrollLeft;
          }
      }
      getHeader() {
          return this.querySelector("tobago-sheet>header");
      }
      getHeaderTable() {
          return this.querySelector("tobago-sheet>header>table");
      }
      getHeaderCols() {
          return this.querySelectorAll("tobago-sheet>header>table>colgroup>col");
      }
      getBody() {
          return this.querySelector("tobago-sheet>.tobago-sheet-body");
      }
      getBodyTable() {
          return this.querySelector("tobago-sheet>.tobago-sheet-body>.tobago-sheet-bodyTable");
      }
      getBodyCols() {
          return this.querySelectorAll("tobago-sheet>.tobago-sheet-body>.tobago-sheet-bodyTable>colgroup>col");
      }
      getHiddenSelected() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::selected");
      }
      getHiddenScrollPosition() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::scrollPosition");
      }
      getHiddenExpanded() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::expanded");
      }
      /**
       * Get the element, which indicates the selection
       */
      getSelectorCheckbox(row) {
          return row.querySelector("tr>td>input.tobago-sheet-columnSelector");
      }
      getRowElements() {
          return this.getBodyTable().querySelectorAll("tbody>tr");
      }
      getFirst() {
          return parseInt(this.dataset.tobagoFirst);
      }
      isRowSelected(row) {
          return this.isSelected(parseInt(row.dataset.tobagoRowIndex));
      }
      isSelected(rowIndex) {
          const value = JSON.parse(this.getHiddenSelected().value);
          return value.indexOf(rowIndex) > -1;
      }
      resetSelected() {
          this.getHiddenSelected().value = JSON.stringify([]);
      }
      toggleSelection(row, checkbox) {
          this.dataset.tobagoLastClickedRowIndex = String(row.sectionRowIndex);
          if (checkbox && !checkbox.disabled) {
              const selected = this.getHiddenSelected();
              const rowIndex = Number(row.getAttribute("row-index"));
              if (this.isSelected(rowIndex)) {
                  this.deselectRow(selected, rowIndex, row, checkbox);
              }
              else {
                  this.selectRow(selected, rowIndex, row, checkbox);
              }
          }
      }
      selectAll() {
          const rows = this.getRowElements();
          this.selectRange(rows, 0, rows.length - 1, true, false);
      }
      deselectAll() {
          const rows = this.getRowElements();
          this.selectRange(rows, 0, rows.length - 1, false, true);
      }
      toggleAll() {
          const rows = this.getRowElements();
          this.selectRange(rows, 0, rows.length - 1, true, true);
      }
      selectRange(rows, first, last, selectDeselected, deselectSelected) {
          const selected = this.getHiddenSelected();
          const value = new Set(JSON.parse(selected.value));
          for (let i = first; i <= last; i++) {
              const row = rows.item(i);
              const checkbox = this.getSelectorCheckbox(row);
              if (checkbox && !checkbox.disabled) {
                  const rowIndex = Number(row.getAttribute("row-index"));
                  const on = value.has(rowIndex);
                  if (selectDeselected && !on) {
                      this.selectRow(selected, rowIndex, row, checkbox);
                  }
                  else if (deselectSelected && on) {
                      this.deselectRow(selected, rowIndex, row, checkbox);
                  }
              }
          }
      }
      /**
       * @param selected input-element type=hidden: Hidden field with the selection state information
       * @param rowIndex int: zero based index of the row.
       * @param row tr-element: the row.
       * @param checkbox input-element: selector in the row.
       */
      selectRow(selected, rowIndex, row, checkbox) {
          const selectedSet = new Set(JSON.parse(selected.value));
          selected.value = JSON.stringify(Array.from(selectedSet.add(rowIndex)));
          row.classList.add("tobago-selected");
          row.classList.add("table-info");
          checkbox.checked = true;
          setTimeout(function () {
              checkbox.checked = true;
          }, 0);
      }
      /**
       * @param selected input-element type=hidden: Hidden field with the selection state information
       * @param rowIndex int: zero based index of the row.
       * @param row tr-element: the row.
       * @param checkbox input-element: selector in the row.
       */
      deselectRow(selected, rowIndex, row, checkbox) {
          const selectedSet = new Set(JSON.parse(selected.value));
          selectedSet.delete(rowIndex);
          selected.value = JSON.stringify(Array.from(selectedSet));
          row.classList.remove("tobago-selected");
          row.classList.remove("table-info");
          checkbox.checked = false;
          // XXX check if this is still needed... Async because of TOBAGO-1312
          setTimeout(function () {
              checkbox.checked = false;
          }, 0);
      }
  }
  Sheet.SCROLL_BAR_SIZE = Sheet.getScrollBarSize();
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-sheet") == null) {
          window.customElements.define("tobago-sheet", Sheet);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SplitLayout extends HTMLElement {
      constructor() {
          super();
          let first = true;
          let justAdded = false;
          for (const child of this.children) {
              if (justAdded) { // skip, because the just added had enlarges the list of children
                  justAdded = false;
                  continue;
              }
              if (getComputedStyle(child).display === "none") {
                  continue;
              }
              if (first) { // the first needs no splitter handle
                  first = false;
                  continue;
              }
              const splitter = document.createElement("div");
              splitter.classList.add(this.orientation === "horizontal" ? "tobago-splitLayout-horizontal" : "tobago-splitLayout-vertical");
              justAdded = true;
              splitter.addEventListener("mousedown", this.start.bind(this));
              child.parentElement.insertBefore(splitter, child);
          }
      }
      /**
       * Get the previous sibling element (without <style> elements).
       */
      // todo: calls of this method can probably be simplified
      static previousElementSibling(element) {
          let sibling = element.previousElementSibling;
          while (sibling != null) {
              if (sibling.tagName !== "STYLE") {
                  return sibling;
              }
              sibling = sibling.previousElementSibling;
          }
          return null;
      }
      get orientation() {
          return this.getAttribute("orientation");
      }
      set orientation(orientation) {
          this.setAttribute("orientation", orientation);
      }
      start(event) {
          event.preventDefault();
          const splitter = event.target;
          const previous = SplitLayout.previousElementSibling(splitter);
          this.offset = this.orientation === "horizontal"
              ? event.pageX - previous.offsetWidth : event.pageY - previous.offsetHeight;
          const mousedown = SplitLayoutMousedown.save(event, splitter);
          document.addEventListener("mousemove", this.move.bind(this));
          document.addEventListener("mouseup", this.stop.bind(this));
          const previousArea = mousedown.previous;
          if (this.orientation === "horizontal") {
              previousArea.style.width = `${previousArea.offsetWidth}px`;
          }
          else {
              previousArea.style.height = `${previousArea.offsetHeight}px`;
          }
          previousArea.style.flexGrow = "inherit";
          previousArea.style.flexBasis = "auto";
          console.debug("initial width/height = '%s'", (this.orientation === "horizontal" ? previousArea.style.width : previousArea.style.height));
      }
      move(event) {
          event.preventDefault();
          const data = SplitLayoutMousedown.load();
          const previousArea = data.previous;
          if (previousArea) {
              if (this.orientation === "horizontal") {
                  previousArea.style.width = String(event.pageX - this.offset) + "px";
              }
              else {
                  previousArea.style.height = String(event.pageY - this.offset) + "px";
              }
          }
      }
      stop(event) {
          document.removeEventListener("mousemove", this.move.bind(this)); // fixme remove the real added
          document.removeEventListener("mouseup", this.stop.bind(this)); // fixme remove the real added
          SplitLayoutMousedown.remove();
      }
  }
  class SplitLayoutMousedown {
      constructor(data) {
          if (data) {
              this.data = typeof data === "string" ? JSON.parse(data) : data;
          }
      }
      static save(event, splitter) {
          const horizontal = splitter.classList.contains("tobago-splitLayout-horizontal");
          SplitLayout.previousElementSibling(splitter);
          const data = {
              splitLayoutId: splitter.parentElement.id,
              horizontal: horizontal,
              splitterIndex: this.indexOfSplitter(splitter, horizontal)
          };
          Page.page(splitter).dataset.SplitLayoutMousedownData = JSON.stringify(data);
          return new SplitLayoutMousedown(data);
      }
      static load() {
          const element = document.documentElement; // XXX this might be the wrong element in case of shadow dom
          return new SplitLayoutMousedown(Page.page(element).dataset.SplitLayoutMousedownData);
      }
      static remove() {
          const element = document.documentElement; // XXX this might be the wrong element in case of shadow dom
          Page.page(element).dataset.SplitLayoutMousedownData = null;
      }
      static indexOfSplitter(splitter, horizontal) {
          const list = splitter.parentElement.getElementsByClassName(horizontal ? "tobago-splitLayout-horizontal" : "tobago-splitLayout-vertical");
          for (let i = 0; i < list.length; i++) {
              if (list.item(i) === splitter) {
                  return i;
              }
          }
          return -1;
      }
      get splitter() {
          return this.data ? document.getElementById(this.data.splitLayoutId).getElementsByClassName(this.data.horizontal ? "tobago-splitLayout-horizontal" : "tobago-splitLayout-vertical")
              .item(this.data.splitterIndex) : null;
      }
      get previous() {
          return this.splitter ? SplitLayout.previousElementSibling(this.splitter) : null;
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-split-layout") == null) {
          window.customElements.define("tobago-split-layout", SplitLayout);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Stars extends HTMLElement {
      constructor() {
          super();
      }
      static leftOffset(element) {
          let left = 0;
          let currentElement = element;
          while (currentElement) {
              left += (currentElement.offsetLeft - currentElement.scrollLeft + currentElement.clientLeft);
              currentElement = currentElement.offsetParent;
          }
          return left;
      }
      connectedCallback() {
          const hiddenInput = this.querySelector("input[type=hidden]");
          const container = this.querySelector(".tobago-stars-container");
          const tooltip = container.querySelector(".tobago-stars-tooltip");
          const selected = container.querySelector(".tobago-stars-selected");
          const unselected = container.querySelector(".tobago-stars-unselected");
          const preselected = container.querySelector(".tobago-stars-preselected");
          const slider = container.querySelector(".tobago-stars-slider");
          const readonly = slider.readOnly;
          const disabled = slider.disabled;
          const required = slider.required;
          const max = parseInt(slider.max);
          const placeholder = parseInt(slider.placeholder);
          if (parseInt(slider.min) === 0) {
              slider.style["left"] = `${-100 / max}%`;
              slider.style["width"] = `${100 + (100 / max)}%`;
          }
          const currentValue = parseInt(hiddenInput.value);
          if (currentValue > 0) {
              const percentValue = 100 * currentValue / max;
              selected.style["width"] = `${percentValue}%`;
              unselected.style["left"] = `${percentValue}%`;
              unselected.style["width"] = `${100 - percentValue}%`;
          }
          else if (placeholder) {
              selected.classList.add("tobago-placeholder");
              const placeholderValue = 100 * placeholder / max;
              selected.style["width"] = `${placeholderValue}%`;
              unselected.style["left"] = `${placeholderValue}%`;
              unselected.style["width"] = `${100 - placeholderValue}%`;
          }
          if (!readonly && !disabled) {
              /* preselectMode is a Workaround for IE11: fires change event instead of input event */
              let preselectMode = false;
              slider.addEventListener("mousedown", function (event) {
                  preselectMode = true;
              });
              slider.addEventListener("mouseup", function (event) {
                  preselectMode = false;
                  selectStars();
              });
              slider.addEventListener("input", function (event) {
                  preselectStars();
              });
              slider.addEventListener("touchend", function (event) {
                  /* Workaround for mobile devices. TODO: fire AJAX request for 'touchend' */
                  // slider.trigger("change");
                  slider.dispatchEvent(new Event("change"));
              });
              slider.addEventListener("change", function (event) {
                  if (preselectMode) {
                      preselectStars();
                  }
                  else {
                      selectStars();
                  }
              });
              slider.addEventListener("touchstart", touchstart);
              slider.addEventListener("touchmove", touchstart);
          }
          // XXX current issue: on ios-Safari select 5 stars and than click on 1 star doesn't work on labeled component.
          function touchstart(event) {
              /* Workaround for Safari browser on iPhone */
              const target = event.currentTarget;
              const sliderValue = (parseInt(target.max) / target.offsetWidth)
                  * (event.touches[0].pageX - Stars.leftOffset(slider));
              if (sliderValue > parseInt(target.max)) {
                  slider.value = target.max;
              }
              else if (sliderValue < parseInt(target.min)) {
                  slider.value = target.min;
              }
              else {
                  slider.value = String(sliderValue);
              }
              preselectStars();
          }
          function preselectStars() {
              tooltip.classList.add("show");
              if (parseInt(slider.value) > 0) {
                  tooltip.classList.remove("trash");
                  tooltip.textContent = (5 * (parseInt(slider.value)) / max).toFixed(2);
                  preselected.classList.add("show");
                  preselected.style["width"] = `${100 * parseInt(slider.value) / max}%`;
              }
              else {
                  tooltip.textContent = "";
                  tooltip.classList.add("trash");
                  if (placeholder) {
                      preselected.classList.add("show");
                      preselected.style["width"] = `${100 * placeholder / max}%`;
                  }
                  else {
                      preselected.classList.remove("show");
                  }
              }
          }
          function selectStars() {
              tooltip.classList.remove("show");
              preselected.classList.remove("show");
              if (parseInt(slider.value) > 0) {
                  selected.classList.remove("tobago-placeholder");
                  const percentValue = 100 * parseInt(slider.value) / max;
                  selected.style["width"] = `${percentValue}%`;
                  unselected.style["left"] = `${percentValue}%`;
                  unselected.style["width"] = `${100 - percentValue}%`;
                  hiddenInput.value = slider.value;
              }
              else {
                  if (placeholder) {
                      selected.classList.add("tobago-placeholder");
                      const placeholderValue = 100 * placeholder / max;
                      selected.style["width"] = `${placeholderValue}%`;
                      unselected.style["left"] = `${placeholderValue}%`;
                      unselected.style["width"] = `${100 - placeholderValue}%`;
                  }
                  else {
                      selected.classList.remove("tobago-placeholder");
                      selected.style["width"] = "";
                      unselected.style["left"] = "";
                      unselected.style["width"] = "";
                  }
                  hiddenInput.value = required ? "" : slider.value;
              }
          }
      }
  }
  document.addEventListener("DOMContentLoaded", function (event) {
      window.customElements.define("tobago-stars", Stars);
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TabGroup extends HTMLElement {
      constructor() {
          super();
          this.hiddenInput = this.querySelector(":scope > input[type=hidden]");
      }
      get switchType() {
          return this.getAttribute("switch-type");
      }
      get tabs() {
          return this.querySelectorAll(":scope > .card-header > .card-header-tabs > tobago-tab");
      }
      getSelectedTab() {
          return this.querySelector(`:scope > .card-header > .card-header-tabs > tobago-tab[index='${this.selected}']`);
      }
      get selected() {
          return parseInt(this.hiddenInput.value);
      }
      set selected(index) {
          this.hiddenInput.value = String(index);
      }
  }
  class Tab extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          const navLink = this.navLink;
          if (!navLink.classList.contains("disabled")) {
              navLink.addEventListener("click", this.select.bind(this));
          }
      }
      get index() {
          return parseInt(this.getAttribute("index"));
      }
      get navLink() {
          return this.querySelector(".nav-link");
      }
      get tabGroup() {
          return this.closest("tobago-tab-group");
      }
      select(event) {
          const tabGroup = this.tabGroup;
          const old = tabGroup.getSelectedTab();
          tabGroup.selected = this.index;
          switch (tabGroup.switchType) {
              case "client":
                  old.navLink.classList.remove("active");
                  this.navLink.classList.add("active");
                  old.content.classList.remove("active");
                  this.content.classList.add("active");
                  break;
              case "reloadTab":
                  // will be done by <tobago-behavior>
                  break;
              case "reloadPage":
                  // will be done by <tobago-behavior>
                  break;
              case "none": // todo
                  console.error("Not implemented yet: %s", tabGroup.switchType);
                  break;
              default:
                  console.error("Unknown switchType='%s'", tabGroup.switchType);
                  break;
          }
      }
      get content() {
          return this.closest("tobago-tab-group")
              .querySelector(`:scope > .card-body.tab-content > .tab-pane[index='${this.index}']`);
      }
  }
  class TabContent extends HTMLElement {
      constructor() {
          super();
      }
      get index() {
          return parseInt(this.getAttribute("index"));
      }
  }
  document.addEventListener("DOMContentLoaded", function (event) {
      window.customElements.define("tobago-tab", Tab);
      window.customElements.define("tobago-tab-content", TabContent);
      window.customElements.define("tobago-tab-group", TabGroup);
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Textarea extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.textarea.addEventListener("focus", Focus.setLastFocusId);
      }
      get textarea() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(`${this.id}::field`);
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-textarea") == null) {
          window.customElements.define("tobago-textarea", Textarea);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Selectable;
  (function (Selectable) {
      Selectable[Selectable["none"] = 0] = "none";
      Selectable[Selectable["multi"] = 1] = "multi";
      Selectable[Selectable["single"] = 2] = "single";
      Selectable[Selectable["singleOrNone"] = 3] = "singleOrNone";
      Selectable[Selectable["multiLeafOnly"] = 4] = "multiLeafOnly";
      Selectable[Selectable["singleLeafOnly"] = 5] = "singleLeafOnly";
      Selectable[Selectable["sibling"] = 6] = "sibling";
      Selectable[Selectable["siblingLeafOnly"] = 7] = "siblingLeafOnly";
      Selectable[Selectable["multiCascade"] = 8] = "multiCascade"; // Multi selection possible. When (de)selecting an item, the subtree will also be (un)selected.
  })(Selectable || (Selectable = {}));

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Tree extends HTMLElement {
      constructor() {
          super();
      }
      clearSelectedNodes() {
          this.hiddenInputSelected.value = "[]"; //empty set
      }
      addSelectedNode(selectedNode) {
          const selectedNodes = new Set(JSON.parse(this.hiddenInputSelected.value));
          selectedNodes.add(selectedNode);
          this.hiddenInputSelected.value = JSON.stringify(Array.from(selectedNodes));
      }
      deleteSelectedNode(selectedNode) {
          const selectedNodes = new Set(JSON.parse(this.hiddenInputSelected.value));
          selectedNodes.delete(selectedNode);
          this.hiddenInputSelected.value = JSON.stringify(Array.from(selectedNodes));
      }
      getSelectedNodes() {
          const queryString = [];
          for (const selectedNodeIndex of JSON.parse(this.hiddenInputSelected.value)) {
              if (queryString.length > 0) {
                  queryString.push(", ");
              }
              queryString.push("tobago-tree-node[index='");
              queryString.push(selectedNodeIndex);
              queryString.push("']");
          }
          if (queryString.length > 0) {
              return this.querySelectorAll(queryString.join(""));
          }
          else {
              return null;
          }
      }
      get hiddenInputSelected() {
          return this.querySelector(":scope > input[type=hidden].tobago-selected");
      }
      clearExpandedNodes() {
          this.hiddenInputExpanded.value = "[]"; //empty set
      }
      addExpandedNode(expandedNode) {
          const expandedNodes = new Set(JSON.parse(this.hiddenInputExpanded.value));
          expandedNodes.add(expandedNode);
          this.hiddenInputExpanded.value = JSON.stringify(Array.from(expandedNodes));
      }
      deleteExpandedNode(expandedNode) {
          const expandedNodes = new Set(JSON.parse(this.hiddenInputExpanded.value));
          expandedNodes.delete(expandedNode);
          this.hiddenInputExpanded.value = JSON.stringify(Array.from(expandedNodes));
      }
      get hiddenInputExpanded() {
          return this.querySelector(":scope > input[type=hidden].tobago-expanded");
      }
      get selectable() {
          return Selectable[this.getAttribute("selectable")];
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-tree") == null) {
          window.customElements.define("tobago-tree", Tree);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TreeListbox extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          this.applySelected();
          for (const listbox of this.listboxes) {
              if (!listbox.disabled) {
                  listbox.addEventListener("change", this.select.bind(this));
              }
          }
      }
      select(event) {
          const listbox = event.currentTarget;
          this.unselectDescendants(listbox);
          this.setSelected();
          this.applySelected();
      }
      unselectDescendants(select) {
          let unselect = false;
          for (const listbox of this.listboxes) {
              if (unselect) {
                  const checkedOption = listbox.querySelector("option:checked");
                  if (checkedOption) {
                      checkedOption.selected = false;
                  }
              }
              else if (listbox.id === select.id) {
                  unselect = true;
              }
          }
      }
      setSelected() {
          const selected = [];
          for (const level of this.levelElements) {
              const checkedOption = level
                  .querySelector(".tobago-treeListbox-select:not(.d-none) option:checked");
              if (checkedOption) {
                  selected.push(checkedOption.index);
              }
          }
          this.hiddenInput.value = JSON.stringify(selected);
      }
      applySelected() {
          const selected = JSON.parse(this.hiddenInput.value);
          let nextActiveSelect = this.querySelector(".tobago-treeListbox-select");
          const levelElements = this.levelElements;
          for (let i = 0; i < levelElements.length; i++) {
              const level = levelElements[i];
              for (const select of this.getSelectElements(level)) {
                  if ((nextActiveSelect !== null && select.id === nextActiveSelect.id)
                      || (nextActiveSelect === null && select.disabled)) {
                      const check = i < selected.length ? selected[i] : null;
                      this.show(select, check);
                      nextActiveSelect = this.getNextActiveSelect(select, check);
                  }
                  else {
                      this.hide(select);
                  }
              }
          }
      }
      getSelectElements(level) {
          return level.querySelectorAll(".tobago-treeListbox-select");
      }
      getNextActiveSelect(select, check) {
          if (check !== null) {
              const option = select.querySelectorAll("option")[check];
              const rootNode = this.getRootNode();
              return rootNode.getElementById(option.id + "::parent");
          }
          else {
              return null;
          }
      }
      show(select, check) {
          select.classList.remove("d-none");
          const checkedOption = select.querySelector("option:checked");
          if (checkedOption && checkedOption.index !== check) {
              checkedOption.selected = false;
          }
          if (check !== null && checkedOption.index !== check) {
              select.querySelectorAll("option")[check].selected = true;
          }
      }
      hide(select) {
          select.classList.add("d-none");
          const checkedOption = select.querySelector("option:checked");
          if (checkedOption) {
              checkedOption.selected = false;
          }
      }
      get listboxes() {
          return this.querySelectorAll(".tobago-treeListbox-select");
      }
      get levelElements() {
          return this.querySelectorAll(".tobago-treeListbox-level");
      }
      get hiddenInput() {
          const rootNode = this.getRootNode();
          return rootNode.getElementById(this.id + "::selected");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-tree-listbox") == null) {
          window.customElements.define("tobago-tree-listbox", TreeListbox);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TreeNode extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          if (this.expandable && this.toggles !== null) {
              this.toggles.forEach(element => element.addEventListener("click", this.toggleNode.bind(this)));
          }
      }
      toggleNode(event) {
          if (this.expanded) {
              for (const icon of this.icons) {
                  icon.classList.remove(icon.dataset.tobagoOpen);
                  icon.classList.add(icon.dataset.tobagoClosed);
              }
              for (const image of this.images) {
                  if (image.dataset.tobagoClosed) {
                      image.src = image.dataset.tobagoClosed;
                  }
                  else {
                      image.src = image.dataset.tobagoOpen;
                  }
              }
              this.deleteExpandedNode(this.index);
              this.classList.remove("tobago-expanded");
              this.hideNodes(this.treeChildNodes);
              if (this.tree) {
                  this.ajax(event, false);
              }
          }
          else {
              for (const icon of this.icons) {
                  icon.classList.remove(icon.dataset.tobagoClosed);
                  icon.classList.add(icon.dataset.tobagoOpen);
              }
              for (const image of this.images) {
                  if (image.dataset.tobagoOpen) {
                      image.src = image.dataset.tobagoOpen;
                  }
                  else {
                      image.src = image.dataset.tobagoClosed;
                  }
              }
              this.addExpandedNode(this.index);
              this.classList.add("tobago-expanded");
              this.showNodes(this.treeChildNodes);
              if (this.tree) {
                  this.ajax(event, this.treeChildNodes.length === 0);
              }
          }
      }
      ajax(event, renderTree) {
          jsf.ajax.request(this.id, event, {
              "javax.faces.behavior.event": "change",
              execute: this.tree.id,
              render: renderTree ? this.tree.id : null
          });
      }
      hideNodes(treeChildNodes) {
          for (const treeChildNode of treeChildNodes) {
              if (treeChildNode.sheet) {
                  treeChildNode.closest(".tobago-sheet-row").classList.add("d-none");
              }
              else {
                  treeChildNode.classList.add("d-none");
              }
              this.hideNodes(treeChildNode.treeChildNodes);
          }
      }
      showNodes(treeChildNodes) {
          for (const treeChildNode of treeChildNodes) {
              if (treeChildNode.sheet) {
                  treeChildNode.closest(".tobago-sheet-row").classList.remove("d-none");
              }
              else {
                  treeChildNode.classList.remove("d-none");
              }
              this.showNodes(treeChildNode.treeChildNodes);
          }
      }
      addExpandedNode(expandedNode) {
          const expandedNodes = new Set(JSON.parse(this.hiddenInputExpanded.value));
          expandedNodes.add(expandedNode);
          this.hiddenInputExpanded.value = JSON.stringify(Array.from(expandedNodes));
      }
      deleteExpandedNode(expandedNode) {
          const expandedNodes = new Set(JSON.parse(this.hiddenInputExpanded.value));
          expandedNodes.delete(expandedNode);
          this.hiddenInputExpanded.value = JSON.stringify(Array.from(expandedNodes));
      }
      get tree() {
          return this.closest("tobago-tree");
      }
      get sheet() {
          return this.closest("tobago-sheet");
      }
      get expandable() {
          return this.getAttribute("expandable") === "expandable";
      }
      get expanded() {
          for (const expandedNodeIndex of this.expandedNodes) {
              if (expandedNodeIndex === this.index) {
                  return true;
              }
          }
          return false;
      }
      get expandedNodes() {
          return new Set(JSON.parse(this.hiddenInputExpanded.value));
      }
      get hiddenInputExpanded() {
          if (this.tree) {
              return this.tree.hiddenInputExpanded;
          }
          else if (this.sheet) {
              return this.sheet.getHiddenExpanded();
          }
          else {
              console.error("Cannot detect 'tobago-tree' or 'tobago-sheet'.");
              return null;
          }
      }
      get treeChildNodes() {
          if (this.sheet) {
              return this.closest("tbody").querySelectorAll(`tobago-tree-node[parent='${this.id}']`);
          }
          else if (this.tree) {
              return this.parentElement.querySelectorAll(`tobago-tree-node[parent='${this.id}']`);
          }
          else {
              console.error("Cannot detect 'tobago-tree' or 'tobago-sheet'.");
              return null;
          }
      }
      get toggles() {
          return this.querySelectorAll(".tobago-treeNode-toggle");
      }
      get icons() {
          return this.querySelectorAll(".tobago-treeNode-toggle i");
      }
      get images() {
          return this.querySelectorAll(".tobago-treeNode-toggle img");
      }
      get index() {
          return Number(this.getAttribute("index"));
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-tree-node") == null) {
          window.customElements.define("tobago-tree-node", TreeNode);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TreeSelect extends HTMLElement {
      constructor() {
          super();
      }
      connectedCallback() {
          if (this.input) {
              this.input.addEventListener("change", this.select.bind(this));
          }
      }
      select(event) {
          switch (this.input.type) {
              case "radio":
                  this.tree.clearSelectedNodes();
                  this.tree.addSelectedNode(this.treeNode.index);
                  break;
              case "checkbox":
                  if (this.input.checked) {
                      this.tree.addSelectedNode(this.treeNode.index);
                  }
                  else {
                      this.tree.deleteSelectedNode(this.treeNode.index);
                  }
                  if (this.tree.selectable === Selectable.multiCascade) {
                      const treeNodeIds = [];
                      this.selectChildren(this.treeSelectChildren, this.input.checked, treeNodeIds);
                  }
                  break;
          }
      }
      selectChildren(treeSelectChildren, checked, treeNodeIds) {
          for (const treeSelect of treeSelectChildren) {
              if (treeSelect.input.checked !== checked) {
                  treeSelect.input.checked = checked;
                  treeNodeIds.push(treeSelect.treeNode.id);
              }
              if (checked) {
                  this.tree.addSelectedNode(treeSelect.treeNode.index);
              }
              else {
                  this.tree.deleteSelectedNode(treeSelect.treeNode.index);
              }
              this.selectChildren(treeSelect.treeSelectChildren, checked, treeNodeIds);
          }
      }
      get tree() {
          return this.treeNode.tree;
      }
      get treeNode() {
          return this.closest("tobago-tree-node");
      }
      get treeSelectChildren() {
          const treeNode = this.closest("tobago-tree-node");
          return treeNode.parentElement
              .querySelectorAll(`tobago-tree-node[parent='${treeNode.id}'] tobago-tree-select`);
      }
      get input() {
          return this.querySelector("input");
      }
  }
  document.addEventListener("tobago.init", function (event) {
      if (window.customElements.get("tobago-tree-select") == null) {
          window.customElements.define("tobago-tree-select", TreeSelect);
      }
  });

  /*
   * Licensed to the Apache Software Foundation (ASF) under one or more
   * contributor license agreements.  See the NOTICE file distributed with
   * this work for additional information regarding copyright ownership.
   * The ASF licenses this file to You under the Apache License, Version 2.0
   * (the "License"); you may not use this file except in compliance with
   * the License.  You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", (event) => {
          document.dispatchEvent(new CustomEvent("tobago.init"));
      });
  }
  else {
      document.dispatchEvent(new CustomEvent("tobago.init"));
  }

}));
//# sourceMappingURL=tobago.js.map
