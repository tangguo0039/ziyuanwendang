(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
    ["chunk-1ba2429b"], {
        "54c8": function (t, a, i) {
            "use strict";
            i("6a97")
        }, "56b7": function (t, a, i) {
            "use strict";
            i.r(a);
            var e = function () {
                    var t = this,
                        a = t.$createElement,
                        i = t._self._c || a;
                    return i("v-app", {
                        attrs: {
                            dark: ""
                        }
                    }, [i("AppBar", {
                        on: {
                            toTransAddr: t.toTransAddr
                        }
                    }), i("v-main", [i("div", {
                        staticClass: "main-bg"
                    }, [i("LayoutFirst"), i("LayoutSecond", {
                        on: {
                            toTransAddr: t.toTransAddr
                        }
                    }), i("LayoutThird"), i("LayoutNine"), i("LayoutFive", {
                        ref: "five"
                    }), i("LayoutSix"), i("LayoutThirteen"), i("LayoutEight")], 1)])], 1)
                },
                n = [],
                o = {
                    name: "Index",
                    methods: {
                        toTransAddr: function () {
                            console.log("to transfer"), this.$refs.five.toTransAddr()
                        }
                    }
                },
                s = o,
                r = (i("54c8"), i("2877")),
                d = i("6544"),
                u = i.n(d),
                c = i("5530"),
                p = (i("d9e2"), i("df86"), i("7560")),
                f = i("58df"),
                l = Object(f["a"])(p["a"]).extend({
                    name: "v-app",
                    props: {
                        dark: {
                            type: Boolean,
                            default: void 0
                        },
                        id: {
                            type: String,
                            default: "app"
                        },
                        light: {
                            type: Boolean,
                            default: void 0
                        }
                    },
                    computed: {
                        isDark: function () {
                            return this.$vuetify.theme.dark
                        }
                    },
                    beforeCreate: function () {
                        if (!this.$vuetify || this.$vuetify === this.$root) throw new Error("Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object")
                    }, render: function (t) {
                        var a = t("div", {
                            staticClass: "v-application--wrap"
                        }, this.$slots.default);
                        return t("div", {
                            staticClass: "v-application",
                            class: Object(c["a"])({
                                "v-application--is-rtl": this.$vuetify.rtl,
                                "v-application--is-ltr": !this.$vuetify.rtl
                            }, this.themeClasses),
                            attrs: {
                                "data-app": !0
                            },
                            domProps: {
                                id: this.id
                            }
                        }, [a])
                    }
                }),
                v = (i("bd0c"), i("2b0e")),
                h = v["a"].extend({
                    name: "ssr-bootable",
                    data: function () {
                        return {
                            isBooted: !1
                        }
                    }, mounted: function () {
                        var t = this;
                        window.requestAnimationFrame((function () {
                            t.$el.setAttribute("data-booted", "true"), t.isBooted = !0
                        }))
                    }
                }),
                y = h.extend({
                    name: "v-main",
                    props: {
                        tag: {
                            type: String,
                            default: "main"
                        }
                    },
                    computed: {
                        styles: function () {
                            var t = this.$vuetify.application,
                                a = t.bar,
                                i = t.top,
                                e = t.right,
                                n = t.footer,
                                o = t.insetFooter,
                                s = t.bottom,
                                r = t.left;
                            return {
                                paddingTop: "".concat(i + a, "px"),
                                paddingRight: "".concat(e, "px"),
                                paddingBottom: "".concat(n + o + s, "px"),
                                paddingLeft: "".concat(r, "px")
                            }
                        }
                    },
                    render: function (t) {
                        var a = {
                            staticClass: "v-main",
                            style: this.styles,
                            ref: "main"
                        };
                        return t(this.tag, a, [t("div", {
                            staticClass: "v-main__wrap"
                        }, this.$slots.default)])
                    }
                }),
                m = Object(r["a"])(s, e, n, !1, null, "4f3eb12c", null);
            a["default"] = m.exports;
            u()(m, {
                VApp: l,
                VMain: y
            })
        }, "6a97": function (t, a, i) {}, bd0c: function (t, a, i) {}, df86: function (t, a, i) {}
    }
]);