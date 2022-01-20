/**
 * sticky-sidebar-v2 - A JavaScript plugin for making smart and high performance sticky sidebars.
 * @version v1.1.0
 * @link https://github.com/blixhavn/sticky-sidebar-v2
 * @author Øystein Blixhavn
 * @license The MIT License (MIT)
**/
!function(t, e) {
    "function" == typeof define && define.amd ? define(["exports"], e) : "undefined" != typeof exports ? e(exports) : (e(e = {}),
    t.stickySidebar = e)
}(this, function(t) {
    "use strict";
    function n(t, e) {
        for (var i = 0; i < e.length; i++) {
            var n = e[i];
            n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value"in n && (n.writable = !0),
            Object.defineProperty(t, n.key, n)
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var a, s, e = (s = {
        topSpacing: 0,
        bottomSpacing: 0,
        containerSelector: !(a = ".stickySidebar"),
        scrollContainer: !1,
        innerWrapperSelector: ".inner-wrapper-sticky",
        stickyClass: "is-affixed",
        minWidth: !1
    },
    function(t, e, i) {
        return e && n(t.prototype, e),
        i && n(t, i),
        t
    }(p, [{
        key: "initialize",
        value: function() {
            var i = this;
            if (this._setSupportFeatures(),
            this.options.innerWrapperSelector && (this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector),
            null === this.sidebarInner && (this.sidebarInner = !1)),
            !this.sidebarInner) {
                var t = document.createElement("div");
                for (t.setAttribute("class", "inner-wrapper-sticky"),
                this.sidebar.appendChild(t); this.sidebar.firstChild != t; )
                    t.appendChild(this.sidebar.firstChild);
                this.sidebarInner = this.sidebar.querySelector(".inner-wrapper-sticky")
            }
            if (this.options.containerSelector) {
                var e = document.querySelectorAll(this.options.containerSelector);
                if ((e = Array.prototype.slice.call(e)).forEach(function(t, e) {
                    t.contains(i.sidebar) && (i.container = t)
                }),
                !e.length)
                    throw new Error("The container does not contains on the sidebar.")
            }
            this.scrollContainer = this.options.scrollContainer ? document.querySelector(this.options.scrollContainer) : void 0,
            "function" != typeof this.options.topSpacing && (this.options.topSpacing = parseInt(this.options.topSpacing) || 0),
            "function" != typeof this.options.bottomSpacing && (this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0),
            this._widthBreakpoint(),
            this.calcDimensions(),
            this.stickyPosition(),
            this.bindEvents(),
            this._initialized = !0
        }
    }, {
        key: "bindEvents",
        value: function() {
            var t, e = this;
            this.eventTarget = this.scrollContainer || window,
            this.eventTarget.addEventListener("resize", this, {
                passive: !0,
                capture: !1
            }),
            this.eventTarget.addEventListener("scroll", this, {
                passive: !0,
                capture: !1
            }),
            this.sidebar.addEventListener("update" + a, this),
            "undefined" != typeof ResizeObserver && ((t = new ResizeObserver(function() {
                return e.handleEvent()
            }
            )).observe(this.sidebarInner),
            t.observe(this.container))
        }
    }, {
        key: "handleEvent",
        value: function(t) {
            this.updateSticky(t)
        }
    }, {
        key: "calcDimensions",
        value: function() {
            var t;
            this._breakpoint || ((t = this.dimensions).containerTop = p.offsetRelative(this.container).top,
            t.containerHeight = this.container.clientHeight,
            t.containerBottom = t.containerTop + t.containerHeight,
            t.sidebarHeight = this.sidebarInner.offsetHeight,
            t.sidebarWidth = this.sidebarInner.offsetWidth,
            t.viewportHeight = window.innerHeight,
            t.maxTranslateY = t.containerHeight - t.sidebarHeight,
            this._calcDimensionsWithScroll())
        }
    }, {
        key: "_calcDimensionsWithScroll",
        value: function() {
            var t = this.dimensions;
            t.sidebarLeft = p.offsetRelative(this.sidebar).left,
            this.scrollContainer ? (t.viewportTop = this.scrollContainer.scrollTop,
            t.viewportLeft = this.scrollContainer.scrollLeft) : (t.viewportTop = document.documentElement.scrollTop || document.body.scrollTop,
            t.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft),
            t.viewportBottom = t.viewportTop + t.viewportHeight,
            t.topSpacing = this.options.topSpacing,
            t.bottomSpacing = this.options.bottomSpacing,
            "function" == typeof t.topSpacing && (t.topSpacing = parseInt(t.topSpacing(this.sidebar)) || 0),
            "function" == typeof t.bottomSpacing && (t.bottomSpacing = parseInt(t.bottomSpacing(this.sidebar)) || 0),
            "VIEWPORT-TOP" === this.affixedType ? t.topSpacing < t.lastTopSpacing && (t.translateY += t.lastTopSpacing - t.topSpacing,
            this._reStyle = !0) : "VIEWPORT-BOTTOM" === this.affixedType && t.bottomSpacing < t.lastBottomSpacing && (t.translateY += t.lastBottomSpacing - t.bottomSpacing,
            this._reStyle = !0),
            t.lastTopSpacing = t.topSpacing,
            t.lastBottomSpacing = t.bottomSpacing
        }
    }, {
        key: "isSidebarFitsViewport",
        value: function() {
            return this.dimensions.viewportHeight >= this.dimensions.lastBottomSpacing + this.dimensions.lastTopSpacing + this.dimensions.sidebarHeight
        }
    }, {
        key: "observeScrollDir",
        value: function() {
            var t, e = this.dimensions;
            e.lastViewportTop !== e.viewportTop && (t = "down" === this.direction ? Math.min : Math.max,
            e.viewportTop === t(e.viewportTop, e.lastViewportTop) && (this.direction = "down" === this.direction ? "up" : "down"))
        }
    }, {
        key: "getAffixType",
        value: function() {
            this._calcDimensionsWithScroll();
            var t = this.dimensions
              , e = t.viewportTop + t.topSpacing
              , i = this.affixedType
              , i = e <= t.containerTop || t.containerHeight <= t.sidebarHeight ? (t.translateY = 0,
            "STATIC") : "up" === this.direction ? this._getAffixTypeScrollingUp() : this._getAffixTypeScrollingDown();
            return t.translateY = Math.max(0, t.translateY),
            t.translateY = Math.min(t.containerHeight, t.translateY),
            t.translateY = Math.round(t.translateY),
            t.lastViewportTop = t.viewportTop,
            i
        }
    }, {
        key: "_getAffixTypeScrollingDown",
        value: function() {
            var t = this.dimensions
              , e = t.sidebarHeight + t.containerTop
              , i = t.viewportTop + t.topSpacing
              , n = t.viewportBottom - t.bottomSpacing
              , s = this.affixedType;
            return this.isSidebarFitsViewport() ? t.sidebarHeight + i >= t.containerBottom ? (t.translateY = t.containerBottom - e,
            s = "CONTAINER-BOTTOM") : i >= t.containerTop && (t.translateY = i - t.containerTop,
            s = "VIEWPORT-TOP") : t.containerBottom <= n ? (t.translateY = t.containerBottom - e,
            s = "CONTAINER-BOTTOM") : e + t.translateY <= n ? (t.translateY = n - e,
            s = "VIEWPORT-BOTTOM") : t.containerTop + t.translateY <= i && 0 !== t.translateY && t.maxTranslateY !== t.translateY && (s = "VIEWPORT-UNBOTTOM"),
            s
        }
    }, {
        key: "_getAffixTypeScrollingUp",
        value: function() {
            var t = this.dimensions
              , e = t.sidebarHeight + t.containerTop
              , i = t.viewportTop + t.topSpacing
              , n = t.viewportBottom - t.bottomSpacing
              , s = this.affixedType;
            return i <= t.translateY + t.containerTop ? (t.translateY = i - t.containerTop,
            s = "VIEWPORT-TOP") : t.containerBottom <= n ? (t.translateY = t.containerBottom - e,
            s = "CONTAINER-BOTTOM") : this.isSidebarFitsViewport() || t.containerTop <= i && 0 !== t.translateY && t.maxTranslateY !== t.translateY && (s = "VIEWPORT-UNBOTTOM"),
            s
        }
    }, {
        key: "_getStyle",
        value: function(t) {
            if (void 0 !== t) {
                var e = {
                    inner: {},
                    outer: {}
                }
                  , i = this.dimensions;
                switch (t) {
                case "VIEWPORT-TOP":
                    e.inner = {
                        position: "fixed",
                        top: i.topSpacing,
                        left: i.sidebarLeft - i.viewportLeft,
                        width: i.sidebarWidth
                    };
                    break;
                case "VIEWPORT-BOTTOM":
                    e.inner = {
                        position: "fixed",
                        top: "auto",
                        left: i.sidebarLeft,
                        bottom: i.bottomSpacing,
                        width: i.sidebarWidth
                    };
                    break;
                case "CONTAINER-BOTTOM":
                case "VIEWPORT-UNBOTTOM":
                    var n = this._getTranslate(0, i.translateY + "px");
                    e.inner = n ? {
                        transform: n
                    } : {
                        position: "absolute",
                        top: i.translateY,
                        width: i.sidebarWidth
                    }
                }
                switch (t) {
                case "VIEWPORT-TOP":
                case "VIEWPORT-BOTTOM":
                case "VIEWPORT-UNBOTTOM":
                case "CONTAINER-BOTTOM":
                    e.outer = {
                        height: i.sidebarHeight,
                        position: "relative"
                    }
                }
                return e.outer = p.extend({
                    height: "",
                    position: ""
                }, e.outer),
                e.inner = p.extend({
                    position: "relative",
                    top: "",
                    left: "",
                    bottom: "",
                    width: "",
                    transform: ""
                }, e.inner),
                e
            }
        }
    }, {
        key: "stickyPosition",
        value: function(t) {
            if (!this._breakpoint) {
                t = this._reStyle || t || !1;
                this.options.topSpacing,
                this.options.bottomSpacing;
                var e = this.getAffixType()
                  , i = this._getStyle(e);
                if ((this.affixedType != e || t) && e) {
					/*if ("STATIC" === this.getAffixType()) {
						$("body").trigger("sticky-sidebar-end");
					} else {
						$("body").trigger("sticky-sidebar-start");
					}*/
                    var n, s, t = "affix." + e.toLowerCase().replace("viewport-", "") + a;
                    for (n in p.eventTrigger(this.sidebar, t),
                    "STATIC" === e ? p.removeClass(this.sidebar, this.options.stickyClass) : p.addClass(this.sidebar, this.options.stickyClass),
                    i.outer) {
                        var o = "number" == typeof i.outer[n] ? "px" : "";
                        this.sidebar.style[n] = i.outer[n] + o
                    }
                    for (s in i.inner) {
                        var r = "number" == typeof i.inner[s] ? "px" : "";
                        this.sidebarInner.style[s] = i.inner[s] + r
                    }
                    t = "affixed." + e.toLowerCase().replace("viewport-", "") + a;
                    p.eventTrigger(this.sidebar, t)
					if ("STATIC" === this.getAffixType()) {
						$("body").trigger("sticky-sidebar-end");
					} else {
						$("body").trigger("sticky-sidebar-start");
					}
                } else
                    this._initialized && (this.sidebarInner.style.left = i.inner.left);
                this.affixedType = e
            }
        }
    }, {
        key: "_widthBreakpoint",
        value: function() {
            window.innerWidth <= this.options.minWidth ? (this._breakpoint = !0,
            this.affixedType = "STATIC",
            this.sidebar.removeAttribute("style"),
            p.removeClass(this.sidebar, this.options.stickyClass),
            this.sidebarInner.removeAttribute("style")) : this._breakpoint = !1
        }
    }, {
        key: "updateSticky",
        value: function() {
					/*if ("STATIC" === this.getAffixType()) {
						$("body").trigger("sticky-sidebar-end");
					} else {
						$("body").trigger("sticky-sidebar-start");
					}*/
            var t, e = this, i = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
            this._running || (this._running = !0,
            t = i.type,
            requestAnimationFrame(function() {
                "scroll" === t ? (e._calcDimensionsWithScroll(),
                e.observeScrollDir(),
                e.stickyPosition()) : (e._widthBreakpoint(),
                e.calcDimensions(),
                e.stickyPosition(!0)),
                e._running = !1
            }))
        }
    }, {
        key: "_setSupportFeatures",
        value: function() {
            var t = this.support;
            t.transform = p.supportTransform(),
            t.transform3d = p.supportTransform(!0)
        }
    }, {
        key: "_getTranslate",
        value: function() {
            var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
              , e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
            return this.support.transform3d ? "translate3d(" + t + ", " + e + ", " + (2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0) + ")" : !!this.support.translate && "translate(" + t + ", " + e + ")"
        }
    }, {
        key: "destroy",
        value: function() {
            window.removeEventListener("resize", this, {
                capture: !1
            }),
            window.removeEventListener("scroll", this, {
                capture: !1
            }),
            this.sidebar.classList.remove(this.options.stickyClass),
            this.sidebar.style.minHeight = "",
            this.sidebar.removeEventListener("update" + a, this);
            var t, e, i = {
                inner: {},
                outer: {}
            };
            for (t in i.inner = {
                position: "",
                top: "",
                left: "",
                bottom: "",
                width: "",
                transform: ""
            },
            i.outer = {
                height: "",
                position: ""
            },
            i.outer)
                this.sidebar.style[t] = i.outer[t];
            for (e in i.inner)
                this.sidebarInner.style[e] = i.inner[e];
            this.options.resizeSensor && "undefined" != typeof ResizeSensor && (ResizeSensor.detach(this.sidebarInner, this.handleEvent),
            ResizeSensor.detach(this.container, this.handleEvent))
        }
    }], [{
        key: "supportTransform",
        value: function(t) {
            var i = !1
              , e = t ? "perspective" : "transform"
              , t = e.charAt(0).toUpperCase() + e.slice(1)
              , n = document.createElement("support").style;
            return (e + " " + ["Webkit", "Moz", "O", "ms"].join(t + " ") + t).split(" ").forEach(function(t, e) {
                if (void 0 !== n[t])
                    return i = t,
                    !1
            }),
            i
        }
    }, {
        key: "eventTrigger",
        value: function(t, e, i) {
            try {
                var n = new CustomEvent(e,{
                    detail: i
                })
            } catch (t) {
                (n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, i)
            }
            t.dispatchEvent(n)
        }
    }, {
        key: "extend",
        value: function(t, e) {
            var i, n = {};
            for (i in t)
                void 0 !== e[i] ? n[i] = e[i] : n[i] = t[i];
            return n
        }
    }, {
        key: "offsetRelative",
        value: function(t) {
            var e = {
                left: 0,
                top: 0
            };
            do {
                var i = t.offsetTop
                  , n = t.offsetLeft
            } while (isNaN(i) || (e.top += i),
            isNaN(n) || (e.left += n),
            t = "BODY" === t.tagName ? t.parentElement : t.offsetParent);
            return e
        }
    }, {
        key: "addClass",
        value: function(t, e) {
            p.hasClass(t, e) || (t.classList ? t.classList.add(e) : t.className += " " + e)
        }
    }, {
        key: "removeClass",
        value: function(t, e) {
            p.hasClass(t, e) && (t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)","gi"), " "))
        }
    }, {
        key: "hasClass",
        value: function(t, e) {
            return t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)","gi").test(t.className)
        }
    }, {
        key: "defaults",
        get: function() {
            return s
        }
    }]),
    p);
    function p(t) {
        var e = this
          , i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        if (!function(t, e) {
            if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function")
        }(this, p),
        this.options = p.extend(s, i),
        this.sidebar = "string" == typeof t ? document.querySelector(t) : t,
        void 0 === this.sidebar)
            throw new Error("There is no specific sidebar element.");
        this.sidebarInner = !1,
        this.container = this.sidebar.parentElement,
        this.affixedType = "STATIC",
        this.direction = "down",
        this.support = {
            transform: !1,
            transform3d: !1
        },
        this._initialized = !1,
        this._reStyle = !1,
        this._breakpoint = !1,
        this.dimensions = {
            translateY: 0,
            maxTranslateY: 0,
            topSpacing: 0,
            lastTopSpacing: 0,
            bottomSpacing: 0,
            lastBottomSpacing: 0,
            sidebarHeight: 0,
            sidebarWidth: 0,
            containerTop: 0,
            containerHeight: 0,
            viewportHeight: 0,
            viewportTop: 0,
            lastViewportTop: 0
        },
        ["handleEvent"].forEach(function(t) {
            e[t] = e[t].bind(e)
        }),
        this.initialize()
    }
    t.default = e,
    window.StickySidebar = e
});