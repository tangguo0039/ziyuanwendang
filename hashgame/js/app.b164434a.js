(function (t) {
    function e(e) {
        for (var n, s, r = e[0], c = e[1], l = e[2], u = 0, d = []; u < r.length; u++) s = r[u], Object.prototype.hasOwnProperty.call(i, s) && i[s] && d.push(i[s][0]), i[s] = 0;
        for (n in c) Object.prototype.hasOwnProperty.call(c, n) && (t[n] = c[n]);
        f && f(e);
        while (d.length) d.shift()();
        return o.push.apply(o, l || []), a()
    }

    function a() {
        for (var t, e = 0; e < o.length; e++) {
            for (var a = o[e], n = !0, s = 1; s < a.length; s++) {
                var r = a[s];
                0 !== i[r] && (n = !1)
            }
            n && (o.splice(e--, 1), t = c(c.s = a[0]))
        }
        return t
    }
    var n = {},
        s = {
            app: 0
        },
        i = {
            app: 0
        },
        o = [];

    function r(t) {
        return c.p + "js/" + ({}[t] || t) + "." + {
            "chunk-1ba2429b": "0a672d89",
            "chunk-47723c3f": "7ad111ca"
        }[t] + ".js"
    }

    function c(e) {
        if (n[e]) return n[e].exports;
        var a = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return t[e].call(a.exports, a, a.exports, c), a.l = !0, a.exports
    }
    c.e = function (t) {
        var e = [],
            a = {
                "chunk-1ba2429b": 1
            };
        s[t] ? e.push(s[t]) : 0 !== s[t] && a[t] && e.push(s[t] = new Promise((function (e, a) {
            for (var n = "css/" + ({}[t] || t) + "." + {
                "chunk-1ba2429b": "f44d659c",
                "chunk-47723c3f": "31d6cfe0"
            }[t] + ".css", i = c.p + n, o = document.getElementsByTagName("link"), r = 0; r < o.length; r++) {
                var l = o[r],
                    u = l.getAttribute("data-href") || l.getAttribute("href");
                if ("stylesheet" === l.rel && (u === n || u === i)) return e()
            }
            var d = document.getElementsByTagName("style");
            for (r = 0; r < d.length; r++) {
                l = d[r], u = l.getAttribute("data-href");
                if (u === n || u === i) return e()
            }
            var f = document.createElement("link");
            f.rel = "stylesheet", f.type = "text/css", f.onload = e, f.onerror = function (e) {
                var n = e && e.target && e.target.src || i,
                    o = new Error("Loading CSS chunk " + t + " failed.\n(" + n + ")");
                o.code = "CSS_CHUNK_LOAD_FAILED", o.request = n, delete s[t], f.parentNode.removeChild(f), a(o)
            }, f.href = i;
            var h = document.getElementsByTagName("head")[0];
            h.appendChild(f)
        })).then((function () {
            s[t] = 0
        })));
        var n = i[t];
        if (0 !== n)
            if (n) e.push(n[2]);
            else {
                var o = new Promise((function (e, a) {
                    n = i[t] = [e, a]
                }));
                e.push(n[2] = o);
                var l, u = document.createElement("script");
                u.charset = "utf-8", u.timeout = 120, c.nc && u.setAttribute("nonce", c.nc), u.src = r(t);
                var d = new Error;
                l = function (e) {
                    u.onerror = u.onload = null, clearTimeout(f);
                    var a = i[t];
                    if (0 !== a) {
                        if (a) {
                            var n = e && ("load" === e.type ? "missing" : e.type),
                                s = e && e.target && e.target.src;
                            d.message = "Loading chunk " + t + " failed.\n(" + n + ": " + s + ")", d.name = "ChunkLoadError", d.type = n, d.request = s, a[1](d)
                        }
                        i[t] = void 0
                    }
                };
                var f = setTimeout((function () {
                    l({
                        type: "timeout",
                        target: u
                    })
                }), 12e4);
                u.onerror = u.onload = l, document.head.appendChild(u)
            }
        return Promise.all(e)
    }, c.m = t, c.c = n, c.d = function (t, e, a) {
        c.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: a
        })
    }, c.r = function (t) {
        "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, c.t = function (t, e) {
        if (1 & e && (t = c(t)), 8 & e) return t;
        if (4 & e && "object" === typeof t && t && t.__esModule) return t;
        var a = Object.create(null);
        if (c.r(a), Object.defineProperty(a, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t)
            for (var n in t) c.d(a, n, function (e) {
                return t[e]
            }.bind(null, n));
        return a
    }, c.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t["default"]
        } : function () {
            return t
        };
        return c.d(e, "a", e), e
    }, c.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, c.p = "/", c.oe = function (t) {
        throw console.error(t), t
    };
    var l = window["webpackJsonp"] = window["webpackJsonp"] || [],
        u = l.push.bind(l);
    l.push = e, l = l.slice();
    for (var d = 0; d < l.length; d++) e(l[d]);
    var f = u;
    o.push([0, "chunk-vendors"]), a()
})({
    0: function (t, e, a) {
        t.exports = a("56d7")
    }, "014b": function (t, e, a) {
        var n = {
            "./BtnProcess.vue": "f102",
            "./BtnProcessSm.vue": "78ea",
            "./ComTitle.vue": "fa00",
            "./LayProcessFirst.vue": "c4a1",
            "./LayProcessFour.vue": "55ff",
            "./LayProcessSecond.vue": "cc46",
            "./LayProcessThird.vue": "8996",
            "./LoadingCircle.vue": "fc50",
            "./LuDanContent.vue": "0fe7",
            "./LuDanContentDaXiao.vue": "6cea",
            "./LuDanZhuang.vue": "52e2",
            "./LuDanZhuangDaXiao.vue": "b2ce"
        };

        function s(t) {
            var e = i(t);
            return a(e)
        }

        function i(t) {
            if (!a.o(n, t)) {
                var e = new Error("Cannot find module '" + t + "'");
                throw e.code = "MODULE_NOT_FOUND", e
            }
            return n[t]
        }
        s.keys = function () {
            return Object.keys(n)
        }, s.resolve = i, t.exports = s, s.id = "014b"
    }, "0270": function (t, e, a) {
        t.exports = a.p + "img/okex.df19b403.png"
    }, "07a3": function (t, e, a) {
        "use strict";
        a("f1e5")
    }, "0860": function (t, e, a) {
        "use strict";
        a("ee7d")
    }, "0923": function (t, e, a) {
        "use strict";
        a("655b")
    }, "0a20": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "bg-inn d-flex flex-column justify-center align-content-center"
                }, [n("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [n("div", {
                    staticClass: "d-flex flex-row justify-center align-center",
                    staticStyle: {
                        width: "720px"
                    }
                }, [n("div", {
                    staticClass: "con-left"
                }, [n("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.$t("tips1")))]), n("div", {
                    staticClass: "line-item d-flex align-center"
                }, [n("span", {
                    staticClass: "circle"
                }), n("span", {
                    staticClass: "line-yellow"
                }, [t._v(t._s(t.$t("tips2")))]), t._v(" ??????1.98 ???????????? ")]), n("div", {
                    staticClass: "line-item d-flex align-center"
                }, [n("span", {
                    staticClass: "circle"
                }), n("span", {
                    staticClass: "line-yellow"
                }, [t._v(t._s(t.$t("tips3")))]), t._v(" " + t._s(t.$t("tips6")) + " ")]), n("div", {
                    staticClass: "line-item d-flex align-center"
                }, [n("span", {
                    staticClass: "circle"
                }), n("span", {
                    staticClass: "line-yellow"
                }, [t._v(t._s(t.$t("tips4")))]), t._v(" " + t._s(t.$t("tips7")) + " ")])]), n("div", {
                    staticClass: "con-right d-flex align-center justify-center"
                }, [n("img", {
                    staticClass: "img-logo",
                    attrs: {
                        src: a("5313")
                    }
                })])])]), n("div", {
                    staticClass: "d-flex flex-row justify-center align-center top-tips"
                }, [t._v(" ?????????????????????????????????????????? ")]), n("div", {
                    staticClass: "content-bottom"
                }, [n("div", {
                    staticClass: "content-bottom-item"
                }, [n("div", {
                    staticClass: "content-bottom-item-left"
                }, [n("div", {
                    staticClass: "content-bottom-item-left-top"
                }, [t._v(t._s(t.$t("tips8")))]), n("div", {
                    staticClass: "content-bottom-item-left-bottom"
                }, [t._v(" " + t._s(t.showAddress2(t.$store.state.addressHash)) + " ")])]), n("div", {
                    staticClass: "content-bottom-item-btn btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressHash)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])]), n("div", {
                    staticClass: "content-bottom-item"
                }, [n("div", {
                    staticClass: "content-bottom-item-left"
                }, [n("div", {
                    staticClass: "content-bottom-item-left-top"
                }, [t._v(t._s(t.$t("tips9")))]), n("div", {
                    staticClass: "content-bottom-item-left-bottom"
                }, [t._v(" " + t._s(t.showAddress2(t.$store.state.addressDan)) + " ")])]), n("div", {
                    staticClass: "content-bottom-item-btn btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressDan)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])]), n("div", {
                    staticClass: "content-bottom-item"
                }, [n("div", {
                    staticClass: "content-bottom-item-left"
                }, [n("div", {
                    staticClass: "content-bottom-item-left-top"
                }, [t._v(t._s(t.$t("tips10")))]), n("div", {
                    staticClass: "content-bottom-item-left-bottom"
                }, [t._v(" " + t._s(t.showAddress2(t.$store.state.addressDaXiao)) + " ")])]), n("div", {
                    staticClass: "content-bottom-item-btn btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressDaXiao)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])])])])
            },
            s = [],
            i = a("f923"),
            o = {
                name: "LayoutFirst",
                mixins: [i["a"]],
                data: function () {
                    return {
                        addressHash: "THsrSdBx8hxqDD3mgPuGvA6hXigWUN8888",
                        addressDan: "TPPg6uEWxgqa5ozZ6SS8JotcEZ54jV7777",
                        addressDaXiao: "TTjiaAvC54yLidTMsZ9BM8CtCC4FNY5555"
                    }
                }
            },
            r = o,
            c = (a("1bb4"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "7b3d0382", null);
        e["default"] = l.exports
    }, "0de6": function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcYAAACVCAMAAAD10ar2AAABDlBMVEUAAAD////++er////////////////////////////////////66K7////////////////////////////wuAf43orywCHzxCzvtAD////////54ZX////////////xuQn////65aL534r////wtwPxvBP65Jz54ZT0yDz54JD////64I776a7ywB/0yUD87b3////0xzf////20Vv76a/21Gb202TxuQf////////2zlD1zE3313D////////////20Vv////1zlP////////ywCHywST////21GrwuQvxvBT////////zyUDywyz54ZPwuQr4237756v////xuw/xuxD////wuQvwuQXvtQDmqrVqAAAAVnRSTlMAFQjpvQ5xykb5gZoEOfK5S+Qnee9Pwb74Ed0MZ1YE9rAwVaL5zUE5qUcsFyDIohHOsNguKYVx5x/IooF5MMGOafWOXSDYtJYf6d2pQZbIJ9xsOLRKgK0wGYoAAA2ZSURBVHja7J1rV9pIHIcnNyCBhEgUJSQxkoqKN6DahVqgVlvd1b20uxvD9/8im0hqMnUmFxYhU/O86OmpBnv668wzl/9kQE5OTk5OTk5OTk5OTk5OTk5OTs7Pye2H1iHIIZzDj5u9Fsghm8OPf6xPNzeaIIdgmh83tx4epvU8R5Jpvvuy7jw8ONv1jQrIIRTXi26KLs6bzTxHUvG86DzMyP1IKs13rhd9cj+SysyLPrkfCWXmRZ/cj4QSeNEl9yOhhL0I+fEU5BAD5MXcj4QCeTH3I6FAXsz9SCjNd/XAiwg/tnI/EgDkxdyPhAJ5MfcjoUBezP1IKGEv5n4kFciLkX5s5f1qZoG8mPuRUFwvbj2l+Jr8aDQ6oixy4Kcg7MXX4keD5ihqcF+whiorgp8BpBdJmT/SHMeB9HCjK6FsjoeMxNvqTxEj1ot4P65qnEONarXaqKR7aILHxKqak1raDPXypNpdk+wZqjYAxHOL96KDX199iXpyg6NmNAadGaIo+2gFF6VsWVbZqha7xWKRsV143vtFo1PGqNi8HcBUS4B0fC+mZLr79Xb+Bkk9MRBDlApKYYZwZ3rcmUOJ8bEjENK2ptLQDsNogHCivOg42PborB9/ejt3imaX/c54jQkhzXCF5eM3Gt6OpNwB6agJavgj+QIgm8OPdfzO1PHX1v7Uwfnx88W8OQ5Ue7FURZAOugT/Fe5qBiCYKC+6dRsA7Oy/waW8NXeO1N+8vVBUHaSEhv8KfaJ71QgvOtu7G8DlDN/nvtn99HYuP3LKmr1QeA09VsLTuYFkK5UHVDQgu7gp4r341wENXCpnvSnue7Z35/MjfdW3F4r0Q4zipMvG0JWgD+jGfLeZ3RwjvVg/qIAZOwv3Iy0WF9waBQOOsWrHcQl/gGRH081sjLFe9Fm8H41r014s1jUixkXCZjXGaC8egIDF+5Gb8P+/Bc6QHrHEVxpjvBcDKkeL9uP8MTI+ffPOdLEExVvd0V9pazxK5kUQ78ftzxc7IC1KpIt4+xJaKzMtD6HgcSX7iB0XsTOgPBr0q4yx8vVzEi8m8+Nvn05BSrQ1Nyxm7RGmX5zBVmdYglAe2gFFseYy4kAUrzLG5sW6E+/FZH50tvaPQEp0k2XNG2GGdl/ykMUG9wgNAFW2A6p+gHmMzzg6x6Ti7LZpEAD5EdMaT3YqICU05cL50D4GeKIGxdjIY8Tx5/kvU5wX0eycoPzobL3fq4DFkMeYnqOL36ZxXoz3o7N+sgdcMhwj0y3OA9tnSIgRHF788uAgvIjnrLfuPEvRH6ZmN8aqXJoHURvzJMQI+xHvRdiPGC9mOMayL19YwQYdh2iSESPsR8+L7SATvB9hL4IZWY7xWSGOIOij+M/skBIj5EecF/F+nP4aeJGgGEWW57uWIsvigAMRENMaAz/CXoz3o+/Fs+DPiYnR0Bl/UY8V9A5F0T9BjK4ff3EwXsT7EeFFcmK8Fpin3anu2CzfG4TF+HYH40esF08PK2g/4rxI77zNRIysHTCBc7oa8nYItYT/kExOOG4v3rcxfnTccxmoiD+c72H86CC9SLfef1pIjgMoRiP9/4Jgrji8gh6nb6AUGasGMHSsPrPmw/ydlRgP3x2vH3+jEU3u4lfXi+gOd+v9WQXxhd72NsqLzYPNrc8J9x9pLoqOFY7xOm2dDDcK5ooylJMxMqHKxr9FA2AYaMITEyUjp3UOvf3F7eM2Mq7PB6h4P7jDn/Xfz1B+3OwhvFg5qG87CfcfuXtFiOBmGG4xYzYKVUCdswmAcmoIa1ApR5mLOqsTkJEUbx93id3O8wD1xX8qiNw//Db1JhW/76A0i4pqY/ONk7Q+hyq4PRYeRrKTY4LkXI+hxmjeA5K4fXfs7S96ObYTDmE//DX1p/g7IAn0xuZsacDrV+NjVOyFUU5zBoeBzEhUtXjl0E3xez3/cZtOPhHxQPkR6cVpivocSpFWEaNo2mHIOth4+CGo2ED5Ee1F/wnIj1gqG/Xtpwc8P2YzRrgx2gUakIPbowZr4Ag/Yrzog/Ajxotw/WoWY6QEuMiYpPNwvhfDObaTeDHFEnhz5sUAf96xkhhHBSzlIRxjWSskpzQAywf2YgDsR7wXA+L92DyoT1H1q6uJUbNfBlYDKwD2YgDsR7wXA2A/4r3oE/hxRTHy9otQvAIrA/Yi7Md4LybyYwXyIuTH1cR4aXv8TDG+DbwI4/qxicxk5xzyIuTHJs6LDwGwH+kkMfIMbvoPfx3+htcU49fNLVxR8fEZskf9+gu2rPjTETL3L1Ps+Y7z2yQxqlb0YtzaRPgR5UblX1GMB/u4f+NFxUh/+4L/Ea1mkhiLMhWzNM49Q1RfU2s8PehNX7ZTrZy2Nqe4FA9BohjFmI0qRNf8umIEoN176SEOQA9x3BRpkCzGEp1621hUX9VIFVTavRVNONwU8xgXRrPdm/7YUHZffPo/3W2dgtXEKNgMAsKn/4/tEfbjEhbjpsduiiuKcSA/RyzYIZh+uYBAMRk4tgwtxvl+XO7SuJtiBawgRjxQjKpyDRBwN0y2X0DW7i1lowryYpZiNKANKn7cASgGXTuENQJZo7nXmwZefMFt48CLmYrRq00NGGscujKgy4cLAzJSfoP044sXcfiz/mzFqPVDAUk3lAEQdCA1qtnci2z3FlhS1fwHV1LlezFTMRodExq63AMUnAaZ8a4GMkm7t7ACx9PWZ3yBo+fFbMVICUM+fugiWkxYn3oG+1Tfj1v4cuM2vtwYNZx5wJUbP3oxYzHWwimqlgiQKNBsIzNV4oh//fNWJXXxP3J/EV/8f/61CTIWY21yaQd00Ska0MEbfljI7vtVm6fzH8WBp/rYJYHm4SnIWIyw8/iujBzgjCw1FDZ/c53dGKMmFk7Sg3GnrXr0wbisxVi6k6CpP6uUKO7HkK4VleR3j6c+plpp1bdDx1QJiLF8aUPw6tgURACjq3w4xUlGh6kJDo0j/Ij0InxoPOsxNnQW8e7HtaqghH+oPLYDLtVhiaguNe4VDmgvwkvmGY+xVlV5GwHPWJosUsDDuIei5lkto5ON+BeqwH7EexHxQpVMxzgyx+gcbYZRzUKHog3uvmvDRciAJHCvN4pf/oZfb5TpGA1qpN0xDCJJ94/4/ris1fQhb8OH5UjqUsNeTORHulVHv2xsFTHeJ583NjqyZgVBQvBSv9qH2+KQqC4V8mIiP3pbGJhX/y0/RplJszROl7QJy9i8HYukKgNADpAXk/ixcgS94Bj249Jj5JTUJ6rub8wxE5vi0OoAgvh3O+1rcXvruCcevlSWHaMc6gn5ZDHS3EC2VD4mRous5RuofhXrR/glKviq4iXHyOnhrcE1BSSE64gFk+EjolSJOkXusref6pXxJ/jU661luNHQC7rsU+hKUmixWwcpEDXlzsbCWLrYIekIMviG7yWd3egLHOCS143KMkaqHMtjqhXT3qFJa5KNh1GtEsXRxHSt9Lf9acx1KngvwpWMy4iRNnmMzibXIAWcqLB2JMyYvdGvASlU9vaTX26Evxy3CZYTo8DYSJjkN+I2Rrowqa5JdjS8zbA3gt4AhBDrRz/FWC8uw41yEd0YTTFRIxx0XKda/Us+6dVJRaEkEjKF/LYf68fKWYwXlxVjrWoj4LtXjbj7/WmKGujCXT/tCQBmqIgUR4AlIT+mvoZzWne9uJwY8deTdTsxzbAmF8omO5R4OzV8nzUFEt6AFOPHGC9uNJe5baygghiWaFx+1EjXBNeFxX60DNXiGo9Pcs0UtGyWrCb0oxNcUY314jJjRMwTJFZGfLQoyrJ8pZQtL0A+zoGs4qZtMu7vsEl6W5NZH/Ds4Mc5jpthpBeXGqPe/SEAZlwWkQWnrCpFeRAu6NDpxwVXllWjLhvM4ImO5H50nIcFehGOkQ/0ljBGVpKY70jM8K4w4gzMnf6JxzAjip4tuFJaVWXwz40zW7cK+REb5MK8CNPQ2H53Rt+6TxQjJcphxA6FkaKsJmmIl31LD88oOFEWipiB0KU6IWATEvZjPM6bxF7EDyD1J0qUERdjKriJGje/5/uWoI2e/VRvWnKJeqAsEjDvwPoR58U61otZuMDBGN3x0ZuKrFkYYYrHFdPvkgmsW6V39rce8MR7MVMxAkNhIoYr6p02oGgDuyupW6564WcsEiaPj348QfgxuRezFSOoWTzGh1VFljuNmF1JWWHhy5Wzerxqfj86bzZRPWq2YgRXzPNm2K9OBK1EJbKrLtz0gydZggo7kvnR2UaPbjIWo2hCM0ypP2bLWqop/LVidiX/rOMVMY1x5sdMeHERMRq6GriQtQS9RkE6jMfwJKkyjFe4mvk54zM/ZsCLM7nZAWZjjg9gJZvvF6vlK2+Gib3hL06SWpW3hzoJk40f/Lh6L866tOITQ2WOEBr6pCxoungN/he0LJhZudconR9XNF+EoWuhS6ZGYB44sBg6ZB2S++7HlXsRccnUKjEI61IhP+K8mEMGnh/xXswhhZ2TdQfpxTxFkqB3TrZQXtw4BTkk4fkx9yL57Ln9au5F8vH8mHuReGA/Tut5j0ooe++3nNyL5LN38quTe5F8/muvjgkAgIAAAGphsBnYVNG/DWL8uytx70cvhvd+9GIC90cvJjBX7YXo2ui7AAAAAMCPDhsS+U4bMFNoAAAAAElFTkSuQmCC"
    }, "0fe7": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.title))]), t.showLoading ? a("LoadingCircle") : a("div", {
                    staticClass: "d-flex flex-column box-inn"
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[0]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[1]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[2]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[3]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: 3,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[4]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[5]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[6]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[7]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[8]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[9]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[10]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[11]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[12]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[13]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[14]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[15]
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[16],
                        borderBottom: !1
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[17],
                        borderBottom: !1
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[18],
                        borderBottom: !1
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: t.luDanData[19],
                        borderBottom: !1
                    }
                }), a("LuDanZhuang", {
                    attrs: {
                        itemType: 4,
                        borderBottom: !1,
                        borderRight: !1
                    }
                })], 1)])], 1)
            },
            s = [],
            i = {
                name: "LuDanContent",
                props: {
                    title: String,
                    showLoading: Boolean,
                    luDanDataWrap: Array
                },
                data: function () {
                    return {
                        luDanData: []
                    }
                }, mounted: function () {
                    this.checkItem()
                }, methods: {
                    checkItem: function () {
                        var t = [];
                        if (this.luDanDataWrap)
                            for (var e = this.luDanDataWrap.length, a = 0; a < 20; a++) t[a] = e > a ? this.luDanDataWrap[a] : 4;
                        else
                            for (var n = 0; n < 20; n++) t[n] = 4;
                        this.luDanData = t
                    }
                }, watch: {
                    luDanDataWrap: function () {
                        this.checkItem()
                    }
                }
            },
            o = i,
            r = (a("da0c"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "21c8ae04", null);
        e["default"] = c.exports
    }, 1053: function (t, e, a) {
        "use strict";
        a("35c0")
    }, "17d6": function (t, e, a) {
        "use strict";
        a("8c00")
    }, "1bb4": function (t, e, a) {
        "use strict";
        a("2d97")
    }, "1d69": function (t, e, a) {
        "use strict";
        a("2370")
    }, "1e4f": function (t, e, a) {}, "201d": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-in",
                    attrs: {
                        id: "rules"
                    }
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "RULES",
                        subTitle: t.$t("tips11")
                    }
                })], 1), a("div", {
                    staticClass: "layoutt"
                }, [a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.$t("tips12")))]), a("div", {
                    staticClass: "d-flex flex-row box-inn"
                }, [a("div", {
                    staticClass: "circle"
                }), a("div", {
                    staticClass: "sub-content"
                }, [t._v(" ??? "), a("a", {
                    on: {
                        click: t.goToAddr
                    }
                }, [t._v(t._s(t.$t("tips15")))]), t._v(" ???????????????????????????????????????????????????Block Hash???????????????????????????????????????????????????(1a,a1)??????????????????????????????????????????????????????????????????????????????(fa)?????????????????????(31)????????????????????? ")])]), t._m(0)]), a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.$t("tips17")))]), a("div", {
                    staticClass: "d-flex flex-row box-inn"
                }, [a("div", {
                    staticClass: "circle"
                }), a("div", {
                    staticClass: "sub-content"
                }, [t._v(" ??? "), a("a", {
                    on: {
                        click: t.goToAddr
                    }
                }, [t._v(t._s(t.$t("tips15")))]), t._v(" ??????????????????????????????????????????????????????0/2/4/6/8?????????????????????????????????????????????Block Hash????????????????????????????????????????????????????????????????????????????????????????????????1/3/5/7/9?????????????????????????????????????????????Block Hash?????????????????????????????????????????????????????? ")])]), t._m(1)]), a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.$t("tips20")))]), a("div", {
                    staticClass: "d-flex flex-row box-inn"
                }, [a("div", {
                    staticClass: "circle"
                }), a("div", {
                    staticClass: "sub-content"
                }, [t._v(" ??? "), a("a", {
                    on: {
                        click: t.goToAddr
                    }
                }, [t._v(t._s(t.$t("tips15")))]), t._v(" ??????????????????????????????????????????????????????0/2/4/6/8???????????????????????????????????????????????????????????????1/3/5/7/9????????????????????? ???????????????????????????????????????Block Hash????????????????????????0???4????????????5???9????????? ")])]), t._m(2)])])])
            },
            s = [
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "d-flex flex-row"
                    }, [a("div", {
                        staticClass: "circle"
                    }), a("div", {
                        staticClass: "sub-content"
                    }, [t._v(" ????????????????????????????????? 10 ??????????????????1.98??????????????????????????????100TRX????????????????????????????????????Block Hash??????0x******796d????????????????????????????????????????????????????????????????????????198TRX??? ")])])
                },
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "d-flex flex-row"
                    }, [a("div", {
                        staticClass: "circle"
                    }), a("div", {
                        staticClass: "sub-content"
                    }, [t._v(" ?????????????????????????????????10??????????????????1.98??????????????????????????????101TRX????????????????????????????????????Block Hash??????0x******9e3a???????????????????????????????????????????????????????????????????????????????????????????????????199.98TRX??? ")])])
                },
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "d-flex flex-row"
                    }, [a("div", {
                        staticClass: "circle"
                    }), a("div", {
                        staticClass: "sub-content"
                    }, [t._v(" ?????????????????????????????????10??????????????????1.98??????????????????????????????101TRX????????????????????????????????????Block Hash??????0x******6g2c????????????????????????????????????2??????0???4??????????????????????????????????????????????????????????????????????????????199.98TRX??? ")])])
                }
            ],
            i = (a("b680"), {
                name: "LayoutSecond",
                data: function () {
                    return {
                        calResult1: 0,
                        calResult2: 0,
                        calResult3: 0
                    }
                }, mounted: function () {
                    var t = this;
                    setTimeout((function () {
                        var e = (50 * t.$store.state.peiLvHash).toFixed(2),
                            a = (101 * t.$store.state.peiLvDan).toFixed(2),
                            n = (101 * t.$store.state.peiLvDaXiao).toFixed(2);
                        t.calResult1 = t.$t("tips14", {
                            peiLv: t.$store.state.peiLvHash,
                            result: e
                        }), t.calResult2 = t.$t("tips19", {
                            peiLv: t.$store.state.peiLvDan,
                            result: a
                        }), t.calResult3 = t.$t("tips22", {
                            peiLv: t.$store.state.peiLvDaXiao,
                            result: n
                        })
                    }), 380)
                }, methods: {
                    goToAddr: function () {
                        this.$emit("toTransAddr"), this.$vuetify.goTo("#process", {
                            offset: 48
                        })
                    }
                }
            }),
            o = i,
            r = (a("1053"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "3410f546", null);
        e["default"] = c.exports
    }, "222f": function (t, e, a) {
        "use strict";
        a("490e")
    }, 2370: function (t, e, a) {}, 2436: function (t, e, a) {}, 2560: function (t, e, a) {
        t.exports = a.p + "img/zb.5ea48520.png"
    }, 2584: function (t, e, a) {
        t.exports = a.p + "img/bg-eleven.50854bf7.png"
    }, "2c40": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn d-flex flex-column justify-center align-center"
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "RECORD",
                        subTitle: t.$t("tips32"),
                        shadowType: 2
                    }
                })], 1), a("div", {
                    staticClass: "top-nav"
                }, [a("div", {
                    staticClass: "d-flex flex-row top-nav-heade"
                }, [a("div", {
                    staticClass: "\n          top-nav-trx top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-trx-active": 1 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(1)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("33")) + " ")]), a("div", {
                    staticClass: "\n          top-nav-center top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-center-active": 2 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(2)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("34")) + " ")]), a("div", {
                    staticClass: "\n          top-nav-usdt top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-usdt-active": 3 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(3)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("35")) + " ")])]), a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "d-flex flex-row text-center tab-title"
                }, [a("div", {
                    staticStyle: {
                        "flex-basis": "15%"
                    }
                }, [t._v(t._s(t.$t("36")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "25%"
                    }
                }, [t._v(t._s(t.$t("37")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "20%"
                    }
                }, [t._v(t._s(t.$t("38")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "14%"
                    }
                }, [t._v(t._s(t.$t("39")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "31%"
                    }
                }, [t._v(t._s(t.$t("40")))])]), a("div", {
                    staticClass: "line"
                }), t._l(t.tableData, (function (e, n) {
                    return a("div", {
                        key: n,
                        staticClass: "\n          d-flex\n          flex-row\n          justify-center\n          align-center\n          text-center\n          tab-title\n          tabl-item\n        "
                    }, [a("div", {
                        staticClass: "tab-yellow text-center",
                        staticStyle: {
                            "flex-basis": "15%"
                        }
                    }, [t._v(" " + t._s(e.amount) + " ")]), a("div", {
                        staticClass: "text-center",
                        staticStyle: {
                            "flex-basis": "25%"
                        },
                        domProps: {
                            innerHTML: t._s(t.calShowAddr(e.address))
                        }
                    }), a("div", {
                        staticClass: "text-center",
                        staticStyle: {
                            "flex-basis": "20%"
                        }
                    }, [t._v(" " + t._s(e.hashEnd) + " ")]), a("div", {
                        staticClass: "text-center",
                        class: {
                            "tab-yellow-two": parseFloat(e.earnMoney) > 0
                        },
                        staticStyle: {
                            "flex-basis": "14%"
                        }
                    }, [t._v(" " + t._s(e.result) + " ")]), a("div", {
                        staticClass: "text-center",
                        staticStyle: {
                            "flex-basis": "31%"
                        }
                    }, [t._v(" " + t._s(e.earnMoney) + " ")])])
                }))], 2)])])
            },
            s = [],
            i = (a("b680"), {
                name: "LayoutFour",
                data: function () {
                    return {
                        topNav: 1,
                        tableData: [],
                        randomData: [],
                        danShData: [],
                        daXiaoData: []
                    }
                }, mounted: function () {
                    var t = this;
                    setTimeout((function () {
                        t.changeLanguage(), t.changeNav(1)
                    }), 380)
                }, watch: {
                    "$store.getters.getLang": function () {
                        this.changeLanguage(), this.changeNav(this.topNav)
                    }
                }, methods: {
                    changeLanguage: function () {
                        var t = this.$store.state.peiLvHash,
                            e = (10 * t).toFixed(2),
                            a = "10*" + t + "=" + e,
                            n = this.$store.state.peiLvDan,
                            s = (10 * n).toFixed(2),
                            i = "10*" + n + "=" + s,
                            o = this.$store.state.peiLvDaXiao,
                            r = (10 * o).toFixed(2),
                            c = "10*" + o + "=" + r;
                        this.daXiaoData = [{
                            amount: "10",
                            address: "0000000002439f2379889a47b65c67cf00274324bfd57158d595df33564472b3",
                            hashEnd: this.$t("47"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }, {
                            amount: "10",
                            address: "0000000002439f4db2f43d7f35469421d65cff688c10d78797b89b34b79fb56a",
                            hashEnd: this.$t("48"),
                            result: this.$t("41"),
                            earnMoney: c
                        }, {
                            amount: "10",
                            address: "0000000002439f422c3e68f0a1b95504d5c0b01d8c695fb52572192e96fb7cbf",
                            hashEnd: this.$t("48"),
                            result: this.$t("41"),
                            earnMoney: c
                        }, {
                            amount: "10",
                            address: "0000000002439ef5ae46862e2c00a451647b47912f5e6a1292143f7f34460c64",
                            hashEnd: this.$t("47"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }], this.danShData = [{
                            amount: "10",
                            address: "00000000024391113d40e8ed7d889f1f61eada852fdcdba5c60825c4e4b596b6",
                            hashEnd: this.$t("45"),
                            result: this.$t("41"),
                            earnMoney: i
                        }, {
                            amount: "10",
                            address: "0000000002439128be909248e791e2e60af9c1c1fff279005c57f38320ecb477",
                            hashEnd: this.$t("46"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }, {
                            amount: "10",
                            address: "00000000024394d6ca230b9414720404fe259742c36a85979b04b956fddf8125",
                            hashEnd: this.$t("46"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }, {
                            amount: "10",
                            address: "000000000243911e2c2479b77ffe617b7f10e51de5b5a130cbd6b556a883cc4f",
                            hashEnd: this.$t("45"),
                            result: this.$t("41"),
                            earnMoney: i
                        }], this.randomData = [{
                            amount: "10",
                            address: "00000000024395b7bbbc4f75bde80a177db0b4a9065ec34b1ec70c07f1038ab6",
                            hashEnd: this.$t("43") + this.$t("44"),
                            result: this.$t("41"),
                            earnMoney: a
                        }, {
                            amount: "10",
                            address: "00000000024390d00d8963e4d959a91a0c5b5df6b5ab8b474e7413f7f2f58524",
                            hashEnd: this.$t("44") + this.$t("44"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }, {
                            amount: "10",
                            address: "000000000243958e70e0fbba2e65d75dd0f02fe71e6f7f0cf02ec0d381bbe92e",
                            hashEnd: this.$t("44") + this.$t("43"),
                            result: this.$t("41"),
                            earnMoney: a
                        }, {
                            amount: "10",
                            address: "00000000024390e9976d2afe06d7190da785c744a2a84f5d0674c1b0353ec5cb",
                            hashEnd: this.$t("43") + this.$t("43"),
                            result: this.$t("42"),
                            earnMoney: "0"
                        }]
                    }, changeNav: function (t) {
                        this.topNav = t, this.tableData = 1 === t ? this.randomData : 2 === t ? this.danShData : this.daXiaoData
                    }, calShowAddr: function (t) {
                        var e = 4,
                            a = -2;
                        return 2 !== this.topNav && 3 !== this.topNav || (e = 5, a = -1), t.substr(7, 6) + "******" + t.substr(-6, e) + '<span style="color: #e3d236;">' + t.substr(a) + "</span>"
                    }
                }
            }),
            o = i,
            r = (a("def5"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "6096a212", null);
        e["default"] = c.exports
    }, "2d97": function (t, e, a) {}, "2eeb": function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcYAAACVCAMAAAD10ar2AAAAt1BMVEUAAAD///////////////////////////////////////////8TYNP5+/7///////////////8SXs7///////////////8VXM4TXc7////9/v////8SXc3///8SXc////8kXcs9etd8peWqxu4RW8+2zvITVtITXc/b5/htmt0SXc3///8IVcsSXtAEU8rt8/xNhdqLsOgaYs/O3vayy/AucNTc5/hekd1smuHD1vObu+oladHl7fr+nU4dAAAAKnRSTlMA9gdHEMUi1+qYGdD0/kA0UrqsK7KlZQqIdOF8m4TWkCz+/PtOMxt03bzSB0+iAAAMzUlEQVR42uzZe3PpQBjH8RVJaBp1K3pRSjPMZDepuivv/3Ud9ciZilOl2d1D+vvwLzK+nt2dYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAuGj3P698l1/eeGw0G/0XDa7ZcSVqV/jMDvShixQ0Cf/NMht7Cbd0hpHa9phv4gS8LhfSwsupFoyjXOmQfHXWhihRRssC9Q0d9nqmifJhHjRpNJRVpXfUY6OG5ga9KUOkx0KFXCRRmdHFc/cIFDaMfYBy/cik74wZ2Rz16rcBXKcBhVQfP9eNwyLk8fVfxNLaQUYOmwoqUEbfINaggYxogYyogYyogYyogYyogYyrsZxRhKAQyXpb9jINZZ0ktkfFixDMKMR+Nxu/ddcuAWirIaNp7qlt2nGMwXQy7SBymglktEpMRhRkD0ZlyzgurxablZN2SYsrMWKrdxpQjt3Ftk+lity1SMpgCxZq1US4yonJRFf57ga9Ry5e3+aCzHFJLaRnvM/xoOYfpUrQ4eVSSMfvASZYRtUec2Yp/thpFLWmRlZCxnudHs/RNY7XMyb2ajDm+kdGTcbLge153WyLj2Wf0xVuBk72W43XLybolQcazzjiYcnKoZSCI6r3x2mFfQ8YDGZdjflhh23LoC3qcOo25fEzUNZOPK/+KaTSdLUNGRiK6Bf6twl7L4zPa2dKubG3bMVcvxdwY7DD9GelrNyRmtNtW+YN1ZUvMOBjFin3fUghK+cO7OI+ZBDuh9oxGtmZZT1VpGe3oV/xQlzmNw5edVovx6PXgEruKWn74BRnrDx81ykUJGakiJ3mqmDwjCec72abz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"
    }, 3154: function (t, e, a) {
        t.exports = a.p + "img/logo-1.bb3a3245.png"
    }, "326a": function (t, e, a) {
        var n = {
            "./AppBar.vue": "b23f",
            "./LayoutEight.vue": "c82c",
            "./LayoutEleven.vue": "c89f",
            "./LayoutFirst.vue": "0a20",
            "./LayoutFive.vue": "4e23",
            "./LayoutFour.vue": "2c40",
            "./LayoutNine.vue": "e978",
            "./LayoutSecond.vue": "201d",
            "./LayoutSeven.vue": "3995",
            "./LayoutSix.vue": "4509",
            "./LayoutTen.vue": "ab64",
            "./LayoutThird.vue": "39e5",
            "./LayoutThirteen.vue": "a7cc",
            "./LayoutTwelve.vue": "5903"
        };

        function s(t) {
            var e = i(t);
            return a(e)
        }

        function i(t) {
            if (!a.o(n, t)) {
                var e = new Error("Cannot find module '" + t + "'");
                throw e.code = "MODULE_NOT_FOUND", e
            }
            return n[t]
        }
        s.keys = function () {
            return Object.keys(n)
        }, s.resolve = i, t.exports = s, s.id = "326a"
    }, "35c0": function (t, e, a) {}, "35d0": function (t, e) {
        t.exports = "data:image/png;base64,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"
    }, 3995: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "bg-innn d-flex flex-column align-center",
                    attrs: {
                        id: "ranking"
                    }
                }, [n("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [n("ComTitle", {
                    attrs: {
                        title: "RANKING",
                        subTitle: t.$t("menu.menu5")
                    }
                })], 1), n("div", {
                    staticClass: "top-nav"
                }, [n("div", {
                    staticClass: "d-flex flex-row top-nav-heade"
                }, [n("div", {
                    staticClass: "\n          top-nav-trx top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-trx-active": 1 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(1)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("33")) + " ")]), n("div", {
                    staticClass: "\n          top-nav-center top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-center-active": 2 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(2)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("34")) + " ")]), n("div", {
                    staticClass: "\n          top-nav-usdt top-nav-title\n          d-flex\n          flex-row\n          justify-center\n          align-center\n        ",
                    class: {
                        "top-nav-usdt-active": 3 === t.topNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeNav(3)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("35")) + " ")])]), n("div", {
                    staticClass: "bg-trx"
                }, [n("div", {
                    staticClass: "d-flex flex-row"
                }, [n("div", {
                    staticClass: "tab-nav-title",
                    class: {
                        "tab-nav-title-active": 1 === t.typeNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeTypeNav(1)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("72")) + " ")]), n("div", {
                    staticClass: "tab-nav-title",
                    class: {
                        "tab-nav-title-active": 2 === t.typeNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeTypeNav(2)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("73")) + " ")]), n("div", {
                    staticClass: "tab-nav-title",
                    class: {
                        "tab-nav-title-active": 3 === t.typeNav
                    },
                    on: {
                        click: function (e) {
                            return t.changeTypeNav(3)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("74")) + " ")])]), n("div", {
                    staticClass: "table-line"
                }), n("div", {
                    staticClass: "d-flex flex-row text-center bg-table-header table-header-title"
                }, [n("div", {
                    staticStyle: {
                        "flex-basis": "25%"
                    }
                }, [t._v(t._s(t.$t("75")))]), n("div", {
                    staticStyle: {
                        "flex-basis": "25%"
                    }
                }, [t._v(t._s(t.$t("76")))]), n("div", {
                    staticStyle: {
                        "flex-basis": "25%"
                    }
                }, [t._v(t._s(t.$t("77")))]), n("div", {
                    staticStyle: {
                        "flex-basis": "25%"
                    }
                }, [t._v(t._s(t.$t("78")))])]), t.loadingData ? n("div", {
                    staticClass: "loading-content d-flex justify-center align-center"
                }, [n("LoadingCircle")], 1) : n("div", {
                    staticClass: "table-item-content"
                }, t._l(t.tableData, (function (e, s) {
                    return n("div", {
                        key: s,
                        staticClass: "\n            d-flex\n            flex-row\n            align-center\n            justify-center\n            text-center\n            table-item-cont\n          "
                    }, [n("div", {
                        staticClass: "table-item-index d-flex justify-center",
                        staticStyle: {
                            "flex-basis": "25%"
                        }
                    }, [s < 3 ? [n("div", [n("img", {
                        staticClass: "tab-rank-icon",
                        attrs: {
                            src: a("7230")("./rank-" + (s + 1) + ".png")
                        }
                    })])] : [t._v(" " + t._s(s + 1) + " ")]], 2), n("div", {
                        staticStyle: {
                            "flex-basis": "25%"
                        }
                    }, [t._v(" " + t._s(t.showAddress(e.from)) + " ")]), n("div", {
                        staticStyle: {
                            "flex-basis": "25%"
                        }
                    }, [t._v("TRX")]), n("div", {
                        staticClass: "table-yellow",
                        staticStyle: {
                            "flex-basis": "25%"
                        }
                    }, [t._v(" " + t._s(e.win_money) + " ")])])
                })), 0)])])])
            },
            s = [],
            i = (a("4e82"), a("fb6a"), a("7c15")),
            o = {
                name: "LayoutThird",
                data: function () {
                    return {
                        topNav: 1,
                        typeNav: 1,
                        loadingData: !0,
                        tableData: []
                    }
                }, mounted: function () {
                    this.rankData()
                }, methods: {
                    changeNav: function (t) {
                        this.topNav = t, this.rankData()
                    }, changeTypeNav: function (t) {
                        this.typeNav = t, this.rankData()
                    }, rankData: function () {
                        var t = this;
                        this.loadingData = !0;
                        var e = 3;
                        e = 1 == this.typeNav ? 3 : 2 == this.typeNav ? 2 : 1, Object(i["c"])(this.topNav - 1, e).then((function (e) {
                            t.loadingData = !1, e = e.list, e = e.sort((function (t, e) {
                                return t.rank > e.rank ? 1 : t.rank < e.rank ? -1 : 0
                            })), t.tableData = e.slice(0, 5)
                        })).catch((function (t) {
                            console.log(t)
                        }))
                    }
                }
            },
            r = o,
            c = (a("d73a"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "58d8ab37", null);
        e["default"] = l.exports
    }, "39ca": function (t, e, a) {
        "use strict";
        a("dc75")
    }, "39e5": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn"
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "LIMIT",
                        subTitle: t.$t("tips23"),
                        shadowType: 2
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-column align-center conten"
                }, [a("div", {
                    staticClass: "sub-content"
                }, [t._v(t._s(t.$t("tips24")))]), a("div", {
                    staticClass: "sub-content",
                    domProps: {
                        innerHTML: t._s(t.trxTips)
                    }
                }), a("div", {
                    staticClass: "sub-content",
                    domProps: {
                        innerHTML: t._s(t.trcTips)
                    }
                }), a("div", {
                    staticClass: "sub-content"
                }, [t._v(" " + t._s(t.$t("tips27")) + " ")]), a("div", {
                    staticClass: "sub-content"
                }, [t._v(" " + t._s(t.$t("tips28")) + " ")])])])
            },
            s = [],
            i = {
                name: "LayoutThird",
                data: function () {
                    return {}
                }, computed: {
                    trxTips: function () {
                        return this.$t("tips25", {
                            min: this.$store.state.trxMin,
                            max: this.$store.state.trxMax
                        })
                    }, trcTips: function () {
                        return this.$t("tips26", {
                            min: this.$store.state.trcMin,
                            max: this.$store.state.trcMax
                        })
                    }
                }, mounted: function () {}
            },
            o = i,
            r = (a("b201"), a("07a3"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "e3d29290", null);
        e["default"] = c.exports
    }, 4360: function (t, e, a) {
        "use strict";
        a("caad"), a("2532");
        var n = a("2b0e"),
            s = a("2f62"),
            i = a("be93"),
            o = a("bc3a"),
            r = a.n(o),
            c = a("7c15");
        n["a"].use(s["a"]), e["a"] = new s["a"].Store({
            state: {
                lang: "zh-cn",
                accessToken: "",
                onLineTelegram: "",
                onLineTelegram2: "",
                addressHash: "",
                addressDan: "",
                addressDaXiao: "",
                peiLvHash: "",
                peiLvDan: "",
                peiLvDaXiao: "",
                trxMin: 0,
                trxMax: 0,
                trcMin: 0,
                trcMax: 0,
                trxUsdtPrice: 0
            },
            getters: {
                getLang: function (t) {
                    return t.lang
                }, getAccessToken: function (t) {
                    return t.accessToken
                }
            },
            mutations: {
                initAddress: function (t) {
                    r.a.get("address/collect.json").then((function (e) {
                        var a = e.data;
                        console.log(a), t.addressHash = a.addressHash, t.addressDan = a.addressDan, t.addressDaXiao = a.addressDaXiao, t.onLineTelegram = a.onLineTelegram, t.onLineTelegram2 = a.onLineTelegram2, t.peiLvHash = a.peiLvHash, t.peiLvDan = a.peiLvDan, t.peiLvDaXiao = a.peiLvDaXiao, t.trxMin = a.trxMin, t.trxMax = a.trxMax, t.trcMin = a.trcMin, t.trcMax = a.trcMax, console.log(t)
                    })), Object(c["a"])().then((function (e) {
                        console.log(e), t.trxUsdtPrice = e.price
                    })).catch((function (t) {
                        console.log(t)
                    }))
                }, updateLang: function (t, e) {
                    console.log(e), i["a"].includes(e) && (t.lang = e)
                }
            },
            actions: {},
            modules: {}
        })
    }, "43fe": function (t, e, a) {}, 4509: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "bg-innn",
                    attrs: {
                        id: "pingtai"
                    }
                }, [n("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [n("ComTitle", {
                    attrs: {
                        title: "ADVANTAGE",
                        subTitle: t.$t("65"),
                        shadowType: 2
                    }
                })], 1), n("div", {
                    staticClass: "d-flex flex-row align-center justify-center content-inn"
                }, [n("v-hover", {
                    scopedSlots: t._u([{
                        key: "default",
                        fn: function (e) {
                            var s = e.hover;
                            return [n("div", [s ? t._e() : n("div", {
                                staticClass: "item-bg d-flex flex-column justify-center align-center"
                            }, [n("div", [n("img", {
                                staticClass: "img-logo",
                                attrs: {
                                    src: a("c82d")
                                }
                            })]), n("div", {
                                staticClass: "title-subb"
                            }, [t._v(t._s(t.$t("66")))])]), s ? n("div", {
                                staticClass: "item-bg-active d-flex flex-column align-center"
                            }, [n("div", {
                                staticClass: "item-sub-title"
                            }, [t._v(" " + t._s(t.$t("67")) + " ")])]) : t._e()])]
                        }
                    }])
                }), n("v-hover", {
                    scopedSlots: t._u([{
                        key: "default",
                        fn: function (e) {
                            var s = e.hover;
                            return [n("div", [s ? t._e() : n("div", {
                                staticClass: "\n            item-bg\n            d-flex\n            flex-column\n            justify-center\n            align-center\n            item-m-l\n          "
                            }, [n("div", [n("img", {
                                staticClass: "img-logo",
                                attrs: {
                                    src: a("eb95")
                                }
                            })]), n("div", {
                                staticClass: "title-subb"
                            }, [t._v(t._s(t.$t("68")))])]), s ? n("div", {
                                staticClass: "item-bg-active d-flex flex-column align-center item-m-l"
                            }, [n("div", {
                                staticClass: "item-sub-title"
                            }, [t._v(" " + t._s(t.$t("69")) + " ")])]) : t._e()])]
                        }
                    }])
                }), n("v-hover", {
                    scopedSlots: t._u([{
                        key: "default",
                        fn: function (e) {
                            var s = e.hover;
                            return [n("div", [s ? t._e() : n("div", {
                                staticClass: "\n            item-bg\n            d-flex\n            flex-column\n            justify-center\n            align-center\n            item-m-l\n          "
                            }, [n("div", [n("img", {
                                staticClass: "img-logo",
                                attrs: {
                                    src: a("f1c8")
                                }
                            })]), n("div", {
                                staticClass: "title-subb"
                            }, [t._v(t._s(t.$t("70")))])]), s ? n("div", {
                                staticClass: "item-bg-active d-flex flex-column align-center item-m-l"
                            }, [n("div", {
                                staticClass: "item-sub-title"
                            }, [t._v(" " + t._s(t.$t("71")) + " ")])]) : t._e()])]
                        }
                    }])
                })], 1)])
            },
            s = [],
            i = {
                name: "LayoutThird",
                data: function () {
                    return {
                        show1: !1,
                        show2: !1,
                        show3: !1
                    }
                }
            },
            o = i,
            r = (a("222f"), a("2877")),
            c = a("6544"),
            l = a.n(c),
            u = a("ce87"),
            d = Object(r["a"])(o, n, s, !1, null, "416a9382", null);
        e["default"] = d.exports;
        l()(d, {
            VHover: u["a"]
        })
    }, "490e": function (t, e, a) {}, "4e23": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-ub d-flex flex-column align-center",
                    attrs: {
                        id: "process"
                    }
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "PROCESS",
                        subTitle: t.$t("49")
                    }
                })], 1), a("div", {
                    staticClass: "d-flex justify-center align-center inn-content",
                    class: {
                        "flex-row": t.$vuetify.breakpoint.mdAndUp,
                        "flex-column": t.$vuetify.breakpoint.smAndDown
                    }
                }, [t.$vuetify.breakpoint.mdAndUp ? a("div", {
                    staticClass: "d-flex flex-column justify-space-between left-content"
                }, [a("BtnProcess", {
                    attrs: {
                        active: 1 === t.showIndex,
                        number: 1,
                        title: t.$t("50")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 1
                        }
                    }
                }), a("BtnProcess", {
                    attrs: {
                        active: 2 === t.showIndex,
                        number: 2,
                        title: "??????????????????????????????TRX???USDT"
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 2
                        }
                    }
                }), a("BtnProcess", {
                    attrs: {
                        active: 3 === t.showIndex,
                        number: 3,
                        title: t.$t("52")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 3
                        }
                    }
                }), a("BtnProcess", {
                    attrs: {
                        active: 4 === t.showIndex,
                        number: 4,
                        title: t.$t("53")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 4
                        }
                    }
                })], 1) : t._e(), t.$vuetify.breakpoint.smAndDown ? a("div", {
                    staticClass: "d-flex flex-row justify-center align-center"
                }, [a("BtnProcessSm", {
                    attrs: {
                        active: 1 === t.showIndex,
                        number: 1,
                        title: t.$t("54")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 1
                        }
                    }
                }), a("BtnProcessSm", {
                    attrs: {
                        active: 2 === t.showIndex,
                        number: 2,
                        title: t.$t("55")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 2
                        }
                    }
                }), a("BtnProcessSm", {
                    attrs: {
                        active: 3 === t.showIndex,
                        number: 3,
                        title: t.$t("56")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 3
                        }
                    }
                }), a("BtnProcessSm", {
                    attrs: {
                        active: 4 === t.showIndex,
                        number: 4,
                        title: t.$t("57")
                    },
                    on: {
                        clickEv: function (e) {
                            t.showIndex = 4
                        }
                    }
                })], 1) : t._e(), a("div", {
                    staticClass: "right-content",
                    attrs: {
                        id: "processInit"
                    }
                }, [1 === t.showIndex ? a("LayProcessFirst") : t._e(), 2 === t.showIndex ? a("LayProcessSecond") : t._e(), 3 === t.showIndex ? a("LayProcessThird") : t._e(), 4 === t.showIndex ? a("LayProcessFour") : t._e()], 1)])])
            },
            s = [],
            i = (a("a9e3"), {
                name: "LayoutFive",
                props: {
                    initIndex: Number
                },
                data: function () {
                    return {
                        showIndex: 1
                    }
                }, watch: {
                    initIndex: function () {}
                }, methods: {
                    toTransAddr: function () {
                        this.showIndex = 3
                    }
                }
            }),
            o = i,
            r = (a("8ace"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "13fe6866", null);
        e["default"] = c.exports
    }, 5071: function (t, e, a) {
        "use strict";
        a("662d")
    }, "52e2": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "content",
                    class: {
                        "con-bor-right": t.borderRight,
                        "con-bor-bottom": t.borderBottom
                    }
                }, [1 === t.itemType ? n("div", {
                    staticClass: "img-logo img-yellow"
                }, [t._v(" " + t._s(this.$t("88")) + " ")]) : t._e(), 2 === t.itemType ? n("div", {
                    staticClass: "img-logo img-white"
                }, [t._v(" " + t._s(this.$t("89")) + " ")]) : t._e(), 3 === t.itemType ? n("img", {
                    staticClass: "img-logo",
                    attrs: {
                        src: a("5933")
                    }
                }) : t._e()])
            },
            s = [],
            i = (a("a9e3"), {
                name: "LuDanZhuang",
                props: {
                    borderBottom: {
                        type: Boolean,
                        default: !0
                    },
                    borderRight: {
                        type: Boolean,
                        default: !0
                    },
                    itemType: {
                        type: Number,
                        default: 1
                    }
                },
                methods: {}
            }),
            o = i,
            r = (a("dbd5"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "0a7ef2cb", null);
        e["default"] = c.exports
    }, 5313: function (t, e, a) {
        t.exports = a.p + "img/logo-img.5b63be61.png"
    }, "54e7": function (t, e, a) {
        "use strict";
        a("6ceb")
    }, 5537: function (t, e, a) {
        t.exports = a.p + "img/gate.d2259b03.png"
    }, "55ff": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "bg-inn"
                }, [n("div", {
                    staticClass: "title-pro"
                }, [t._v(t._s(t.$t("53")))]), n("div", {
                    staticClass: "bg-box"
                }, [n("div", {
                    staticClass: "\n        d-flex\n        flex-column\n        justify-center\n        align-center\n        justify-space-between\n        table-bodyd\n      "
                }, [n("div", {
                    staticClass: "box-text-1"
                }, [t._v(" " + t._s(t.$t("64")) + " ")]), n("div", [n("img", {
                    staticClass: "img-logo",
                    attrs: {
                        src: a("5313")
                    }
                })])])])])
            },
            s = [],
            i = {
                name: "LayProcessFirst",
                data: function () {
                    return {}
                }
            },
            o = i,
            r = (a("da74"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "1064f47f", null);
        e["default"] = c.exports
    }, "56d7": function (t, e, a) {
        "use strict";
        a.r(e);
        a("e260"), a("e6cf"), a("cca6"), a("a79d");
        var n = a("2b0e"),
            s = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("router-view")
            },
            i = [],
            o = {
                name: "App",
                metaInfo: {
                    title: "Hash Game",
                    titleTemplate: "Hash Game",
                    htmlAttrs: {
                        lang: "en"
                    },
                    meta: [{
                        charset: "utf-8"
                    }, {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }]
                },
                created: function () {
                    this.$store.commit("initAddress")
                }
            },
            r = o,
            c = (a("cf25"), a("2877")),
            l = Object(c["a"])(r, s, i, !1, null, null, null),
            u = l.exports,
            d = (a("d3b7"), a("3ca3"), a("ddb0"), a("8c4f")),
            f = d["a"].prototype.push;
        d["a"].prototype.push = function (t) {
            return f.call(this, t).catch((function (t) {
                return t
            }))
        }, n["a"].use(d["a"]);
        var h = [{
                path: "/",
                name: "App",
                component: function () {
                    return a.e("chunk-1ba2429b").then(a.bind(null, "56b7"))
                }
            }, {
                path: "/help",
                name: "Help",
                component: function () {
                    return a.e("chunk-47723c3f").then(a.bind(null, "2167"))
                }
            }],
            v = new d["a"]({
                mode: "history",
                base: "/",
                scrollBehavior: function (t, e, a) {
                    return t.hash ? {
                        selector: t.hash
                    } : a || {
                        x: 0,
                        y: 0
                    }
                }, routes: h
            }),
            p = v,
            g = a("4360"),
            m = a("f309"),
            b = a("83df");
        a("8128");
        n["a"].use(m["a"]);
        var A = new m["a"]({
            theme: {
                dark: !1,
                themes: {
                    light: {
                        primary: "#42A5F6",
                        secondary: "#050B1F",
                        accent: "#204165"
                    },
                    dark: {
                        primary: "#50778D",
                        secondary: "#0B1C3D",
                        accent: "#204165"
                    }
                }
            }
        });
        n["a"].use(b["a"], {
            context: {
                vuetify: A
            }
        });
        var x = A,
            y = a("b85c"),
            w = (a("ac1f"), a("5319"), a("8103")),
            C = a.n(w),
            D = a("bba4"),
            T = a.n(D),
            L = a("326a"),
            j = a("014b");

        function k(t) {
            var e, a = Object(y["a"])(t.keys());
            try {
                for (a.s(); !(e = a.n()).done;) {
                    var s = e.value,
                        i = t(s),
                        o = s.replace(/index.js/, "").replace(/^\.\//, "").replace(/\.\w+$/, ""),
                        r = C()(T()(o));
                    n["a"].component("".concat(r), i.default || i)
                }
            } catch (c) {
                a.e(c)
            } finally {
                a.f()
            }
        }
        k(L), k(j);
        var R = a("58ca");
        n["a"].use(R["a"], {
            refreshOnceOnNavigation: !0
        });
        a("159b");
        var E = a("a925"),
            M = a("be93"),
            S = {};
        M["a"].forEach((function (t) {
            S[t] = a("8bcd")("./".concat(t, ".json"))
        })), n["a"].use(E["a"]);
        var U = new E["a"]({
            locale: "zh-cn",
            fallbackLocale: "zh-cn",
            messages: S
        });
        var I = {
            name: "commonUtils",
            computed: {
                lang: function () {
                    return this.$store.getters.getLang
                }
            },
            methods: {
                showAddress: function (t) {
                    return t.substr(0, 6) + "***" + t.substr(t.length - 5, t.length)
                }, showAddress2: function (t) {
                    return t.substr(0, 10) + "***" + t.substr(t.length - 10, t.length)
                }, timeFormat: function (t) {
                    return new Date(1e3 * t).toLocaleString()
                }
            }
        };
        n["a"].config.productionTip = !1, n["a"].mixin(I);
        var N = new n["a"]({
            router: p,
            store: g["a"],
            i18n: U,
            vuetify: x,
            render: function (t) {
                return t(u)
            }
        }).$mount("#app");
        U.locale = g["a"].getters.getLang;
        e["default"] = N
    }, 5903: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "inn-content",
                    style: {
                        height: t.innHeight + "px"
                    }
                }, [t.androidMobile ? n("div", {
                    staticClass: "inn-content-m-android",
                    style: {
                        height: t.innHeight + "px",
                        width: "100%"
                    }
                }) : t._e(), t.androidMobile ? t._e() : n("video-background", {
                    ref: "videobackground",
                    style: {
                        height: t.innHeight + "px"
                    },
                    attrs: {
                        poster: a("2584"),
                        src: a("e830"),
                        sources: [{
                            src: a("b159"),
                            res: 768,
                            autoplay: !0,
                            poster: a("e13c")
                        }]
                    }
                }), t._m(0)], 1)
            },
            s = [
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "inn-content-content"
                    }, [a("p", {
                        staticClass: "title"
                    })])
                }
            ],
            i = a("cf1a"),
            o = a.n(i),
            r = a("701b"),
            c = {
                name: "LayoutTwelve",
                data: function () {
                    return {
                        androidMobile: !1,
                        innHeight: 0
                    }
                }, components: {
                    VideoBackground: o.a
                }, created: function () {}, mounted: function () {
                    var t = document.getElementsByTagName("video")[0];
                    t && t.setAttribute("x5-video-player-type", "h5"), this.innHeight = this.$vuetify.breakpoint.height, this.androidNotPlay()
                }, updated: function () {}, beforeDestroy: function () {}, methods: {
                    androidNotPlay: function () {
                        console.log(navigator.userAgent.toLowerCase());
                        var t = Object(r["default"])();
                        "mobile" === t.platform && "android" === t.system && (this.androidMobile = !0)
                    }
                }
            },
            l = c,
            u = (a("5071"), a("2877")),
            d = Object(u["a"])(l, n, s, !1, null, "5bd6504d", null);
        e["default"] = d.exports
    }, 5933: function (t, e) {
        t.exports = "data:image/png;base64,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"
    }, "5ffb": function (t, e, a) {}, 6430: function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcYAAACVCAMAAAD10ar2AAAArlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////8Qgv7///////9Fnv////+Et/IMgP5osP9irf8ciP4qkP////9Lof8Vhf4tkv////////////////////8mjv4/m/////////////+Tnaggi/5Gnv+Qxf9rsv9Hn/9psf////8MgP4DfP5aAKVCAAAAN3RSTlMADPwsCd3hos0huwSvNfIW5Hlcne331vTFP4dUEbhEMdW9gh/oqhptmIdKyp6MamEM4VwjWm91zughygAACvxJREFUeNrswYEAAAAAgKD9qRepAgAAAAAAAAAAAAAAAAAAmF27XU4UhgIwfPhQREYrSrWii6KAWq21a90T7v/Gtl07EyXC0WFjgenzsxOh42v4CPyQomU3G0+9ZwWKzLIs+JGu21fxn7qtQzH9Dv319MPa3xy8OfwQWAZyDROK6A87NVhvDhOoFmW1NE4sZw83VmziqX4RO44HLGngu1WalJaBCU24yQrPNQp4gpwP2AWB60FVKA4mdHS4gaZigg2FwzMmhFUJqdSFjArcoIlJ7QcoGp5REFbjJJkzo6miYARFwzNecNhB+eXMOETREr6ZNfEmOyojt67AhMyZcYuiJnyvuc8Ym+7JjNw7lF3OjDMUNeBbeQH79LYnM3Kbsq/v5MzYLdxsfGdHsUtn5PySnyBzZtQQsVB3HHy9JrwlY+yPocxyZlQcFAxBProi+3WWkRKvS92RyEiyMamhZ++wBbLwimJGUlzq42rejOLnh9nje7gAWTyWmpEWl/k6h8hIG91016gYiDUL5NgHeTKy2IXSojLStiqe6EEW3UDEmg5S7KYxkZEQl3eFlcxIe+abcFbU4xSJGd2YERkpwR5Kis5IU+zj4/+6YVIVJWacMJY3YxxCSeXJyFlmd9ttUR/socSMu+l1Gau5LJeSUYYeysx4iDMysmtNS3rXcb+MS5SZcR+w9IyW/9m4ylerd8u4RKkZ3VjMyM39QbAOw9APGCEo53S8V8YXlJpxHDAx46n9+DjOO/hVnI6SM/KKcjO6cVpGkReyDNNSruXIzcgrys1oTRmdkfOyzpWlXAO4S8YV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"
    }, "655b": function (t, e, a) {}, "662d": function (t, e, a) {}, "69a5": function (t, e, a) {
        "use strict";
        a("db4c")
    }, "6b0d": function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcYAAACVCAMAAAD10ar2AAAA81BMVEUAAAD////////////////////////////////////////////////h5un///////////+SxNf////////////////////////Q3+Vou9f///////////////////8Cibz///////////8Tib1DvNROob5XsdL///8ClL+U0OP///8yss4lksFIt9NVvNYypMlVytphudYEdrSFx94StMwJpMUChLkYlsK5xMypxM4owtNEmcepvschn8WFwNxCncj///8ImMEDfLcEgroKpcYFibwHkr8MrsoJn8QOtcwHjr4DeLUMqccCdLQOus4Pv88Aaa67CayKAAAAQHRSTlMA+U3Q8i3nHNgS4yGhCK6DQQtXRHW9wjgPf31nd2An8reL79eoHz0391CVx65pkblLK99j4fDr5yIq4KI3eun9FTAiHQAADilJREFUeNrswYEAAAAAgKD9qRepAgAAAAAAAAAAAAAAAAAAmD077EkbCAM4/twVRqkF0q20BVcYsXSFCkrAIIsuNVLAxrjv/212XA9KezAVcZnjfopvaAzen+doqyAIgiAIgiAIgiAIgnDENG0yHPYdqt+50UD4aDRr2PdHo6enp18roz4IH4im3dT80cPDE5V0/OGC8FFo18uGJCLJGFtnvAROiQDhH6O1L53R/IHiSvIZSyenqvo1D/+8YiF2FG85rd3zR3NakXVc25qxhA0UBEg+PdRSP2/PHEbuE4Xh/0ciXs0J0nHOzeO2jFjOBUuHWR2MPr1QTs7D68hB7DN8RO2221katK3nj70kESkWke/Yy4yPigIKqcWDZAxeat+M6ANmtAZDZ+yFYRSFnl9z2/AnmutcPbKIO0veQkq+GjDVvMj4TtzaOIxmd8zMc1wNdprURlMWkT2Sksk89jIZjYAxRMb3cU0izggSkIX0rmoD2E679BePZBYfyRfBSnLzmP1stFoB07JExvfgOvfRjEiFjC5c2Ma6HU0fNxLSiPw8PmQzQl5iq/odDgAHKCtgcijlWDK6fhiRjNmQnj8A3rUzvSIZidQ4cvPIZwSTXnAYGA4h36pndFlH9K2eph9FRnfcjJZCsq9GIQ0Z8xwLsibO3ZSIOxKP6U/INT4j0ajrer0B78TMsdXXIesIMg4uaMWw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"
    }, "6cea": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "contain"
                }, [a("div", {
                    staticClass: "title-head"
                }, [t._v(t._s(t.title))]), t.showLoading ? a("LoadingCircle") : a("div", {
                    staticClass: "d-flex flex-column box-inn"
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[0]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[1]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[2]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[3]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: 3,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[4]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[5]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[6]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[7]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[8]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[9]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[10]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[11]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[12]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[13]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[14]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[15]
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: 4,
                        borderRight: !1
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-row justify-space-around",
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[16],
                        borderBottom: !1
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[17],
                        borderBottom: !1
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[18],
                        borderBottom: !1
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: t.luDanData[19],
                        borderBottom: !1
                    }
                }), a("LuDanZhuangDaXiao", {
                    attrs: {
                        itemType: 4,
                        borderBottom: !1,
                        borderRight: !1
                    }
                })], 1)])], 1)
            },
            s = [],
            i = {
                name: "LuDanContent",
                props: {
                    title: String,
                    showLoading: Boolean,
                    luDanDataWrap: Array
                },
                data: function () {
                    return {
                        luDanData: []
                    }
                }, mounted: function () {
                    this.checkItem()
                }, methods: {
                    checkItem: function () {
                        var t = [];
                        if (this.luDanDataWrap)
                            for (var e = this.luDanDataWrap.length, a = 0; a < 20; a++) t[a] = e > a ? this.luDanDataWrap[a] : 4;
                        else
                            for (var n = 0; n < 20; n++) t[n] = 4;
                        this.luDanData = t
                    }
                }, watch: {
                    luDanDataWrap: function () {
                        this.checkItem()
                    }
                }
            },
            o = i,
            r = (a("afc2"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "26e095cc", null);
        e["default"] = c.exports
    }, "6ceb": function (t, e, a) {}, "701b": function (t, e, a) {
        "use strict";
        a.r(e), a.d(e, "default", (function () {
            return n
        }));
        a("ac1f"), a("00b4"), a("5319"), a("d3b7"), a("25f0"), a("466d");

        function n() {
            var t = navigator.userAgent.toLowerCase(),
                e = function (e) {
                    return e.test(t)
                },
                a = function (e) {
                    return t.match(e).toString().replace(/[^0-9|_.]/g, "").replace(/_/g, ".")
                },
                n = "unknow";
            e(/windows|win32|win64|wow32|wow64/g) ? n = "windows" : e(/macintosh|macintel/g) ? n = "macos" : e(/x11/g) ? n = "linux" : e(/android|adr/g) ? n = "android" : e(/ios|iphone|ipad|ipod|iwatch/g) && (n = "ios");
            var s = "unknow";
            "windows" === n ? e(/windows nt 5.0|windows 2000/g) ? s = "2000" : e(/windows nt 5.1|windows xp/g) ? s = "xp" : e(/windows nt 5.2|windows 2003/g) ? s = "2003" : e(/windows nt 6.0|windows vista/g) ? s = "vista" : e(/windows nt 6.1|windows 7/g) ? s = "7" : e(/windows nt 6.2|windows 8/g) ? s = "8" : e(/windows nt 6.3|windows 8.1/g) ? s = "8.1" : e(/windows nt 10.0|windows 10/g) && (s = "10") : "macos" === n ? s = a(/os x [\d._]+/g) : "android" === n ? s = a(/android [\d._]+/g) : "ios" === n && (s = a(/os [\d._]+/g));
            var i = "unknow";
            "windows" === n || "macos" === n || "linux" === n ? i = "desktop" : ("android" === n || "ios" === n || e(/mobile/g)) && (i = "mobile");
            var o = "unknow",
                r = "unknow";
            e(/applewebkit/g) ? (o = "webkit", e(/edge/g) ? r = "edge" : e(/opr/g) ? r = "opera" : e(/chrome/g) ? r = "chrome" : e(/safari/g) && (r = "safari")) : e(/gecko/g) && e(/firefox/g) ? (o = "gecko", r = "firefox") : e(/presto/g) ? (o = "presto", r = "opera") : e(/trident|compatible|msie/g) && (o = "trident", r = "iexplore");
            var c = "unknow";
            "webkit" === o ? c = a(/applewebkit\/[\d._]+/g) : "gecko" === o ? c = a(/gecko\/[\d._]+/g) : "presto" === o ? c = a(/presto\/[\d._]+/g) : "trident" === o && (c = a(/trident\/[\d._]+/g));
            var l = "unknow";
            "chrome" === r ? l = a(/chrome\/[\d._]+/g) : "safari" === r ? l = a(/version\/[\d._]+/g) : "firefox" === r ? l = a(/firefox\/[\d._]+/g) : "opera" === r ? l = a(/opr\/[\d._]+/g) : "iexplore" === r ? l = a(/(msie [\d._]+)|(rv:[\d._]+)/g) : "edge" === r && (l = a(/edge\/[\d._]+/g));
            var u = "none",
                d = "unknow";
            return e(/micromessenger/g) ? (u = "wechat", d = a(/micromessenger\/[\d._]+/g)) : e(/qqbrowser/g) ? (u = "qq", d = a(/qqbrowser\/[\d._]+/g)) : e(/ucbrowser/g) ? (u = "uc", d = a(/ucbrowser\/[\d._]+/g)) : e(/qihu 360se/g) ? u = "360" : e(/2345explorer/g) ? (u = "2345", d = a(/2345explorer\/[\d._]+/g)) : e(/metasr/g) ? u = "sougou" : e(/lbbrowser/g) ? u = "liebao" : e(/maxthon/g) && (u = "maxthon", d = a(/maxthon\/[\d._]+/g)), Object.assign({
                engine: o,
                engineVs: c,
                platform: i,
                supporter: r,
                supporterVs: l,
                system: n,
                systemVs: s
            }, "none" === u ? {} : {
                shell: u,
                shellVs: d
            })
        }
    }, 7230: function (t, e, a) {
        var n = {
            "./rank-1.png": "7d16",
            "./rank-2.png": "b988",
            "./rank-3.png": "7fd6"
        };

        function s(t) {
            var e = i(t);
            return a(e)
        }

        function i(t) {
            if (!a.o(n, t)) {
                var e = new Error("Cannot find module '" + t + "'");
                throw e.code = "MODULE_NOT_FOUND", e
            }
            return n[t]
        }
        s.keys = function () {
            return Object.keys(n)
        }, s.resolve = i, t.exports = s, s.id = "7230"
    }, 7265: function (t, e, a) {
        t.exports = a.p + "img/bitpie.aa9bddb2.png"
    }, "777a": function (t, e, a) {}, "78ea": function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "d-flex flex-column align-center justify-center bg-normal",
                    class: {},
                    on: {
                        click: function (e) {
                            return t.$emit("clickEv")
                        }
                    }
                }, [a("div", {
                    staticClass: "number circle d-flex align-center justify-center",
                    class: {
                        "number-active": t.active,
                        "circle-active": t.active
                    }
                }, [t._v(" " + t._s(t.number) + " ")]), a("div", {
                    staticClass: "title-head",
                    class: {
                        "title-active": t.active
                    }
                }, [t._v(" " + t._s(t.title) + " ")])])
            },
            s = [],
            i = (a("a9e3"), {
                name: "BtnProcess",
                props: {
                    active: {
                        type: Boolean,
                        default: !1
                    },
                    number: Number,
                    title: String
                }
            }),
            o = i,
            r = (a("92f7"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "1743f360", null);
        e["default"] = c.exports
    }, "7c15": function (t, e, a) {
        "use strict";
        a.d(e, "b", (function () {
            return d
        })), a.d(e, "c", (function () {
            return f
        })), a.d(e, "a", (function () {
            return h
        }));
        a("d3b7");
        var n = a("bc3a"),
            s = a.n(n),
            i = a("4360"),
            o = a("56d7"),
            r = function (t) {
                o["default"].$dialog.message.error(t, {
                    centered: !0,
                    timeout: 1300
                })
            },
            c = s.a.create({
                timeout: 3e4
            });
        c.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded", c.interceptors.request.use((function (t) {
            var e = i["a"].getters.getAccessToken;
            return e && (t.headers.authorization = e), t
        }), (function (t) {
            return Promise.reject(t)
        })), c.interceptors.response.use((function (t) {
            return 200 === t.status ? Promise.resolve(t.data) : Promise.reject()
        }), (function (t) {
            return console.log("net error"), console.log(t), r(t.response.statusText), Promise.reject(t)
        }));
        var l = c,
            u = "https://proxy.a8hash.io/";

        function d(t) {
            return l.get(u + "/api.html", {
                params: {
                    method: "hashinfo.get_list",
                    win_type: t,
                    randomKey: (new Date).getTime()
                }
            })
        }

        function f(t, e) {
            return l.get(u + "/api.html", {
                params: {
                    method: "hashinfo.get_trans_ranking",
                    win_type: t,
                    time_type: e,
                    randomKey: (new Date).getTime()
                }
            })
        }

        function h() {
            return l.get("https://api.binance.com/api/v3/ticker/price?symbol=TRXUSDT")
        }
    }, "7d16": function (t, e, a) {
        t.exports = a.p + "img/rank-1.a147713a.png"
    }, "7fd6": function (t, e, a) {
        t.exports = a.p + "img/rank-3.d8dc07e0.png"
    }, 8950: function (t, e, a) {}, 8996: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn"
                }, [a("div", {
                    staticClass: "title-pro"
                }, [t._v(t._s(t.$t("52")))]), a("div", {
                    staticClass: "bg-box"
                }, [a("div", {
                    staticClass: "\n        d-flex\n        flex-column\n        justify-center\n        align-center\n        justify-space-between\n        table-bodyd\n      "
                }, [a("div", {
                    staticClass: "box-text-1"
                }, [t._v(t._s(t.$t("62")))]), a("div", {
                    staticClass: "box-text-2"
                }, [t._v(t._s(t.$t("63")))]), a("div", {
                    staticClass: "item-conten box-text-2"
                }, [a("div", {
                    staticClass: "item-box"
                }, [a("div", [t._v(t._s(t.$t("tips8")))]), a("div", {
                    staticClass: "box-text-2"
                }, [t._v(" " + t._s(t.showAddress(t.$store.state.addressHash)) + " ")]), a("div", {
                    staticClass: "d-flex justify-center align-center box-text-3 btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressHash)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])]), a("div", {
                    staticClass: "item-box"
                }, [a("div", [t._v(t._s(t.$t("tips9")))]), a("div", {
                    staticClass: "box-text-2"
                }, [t._v(" " + t._s(t.showAddress(t.$store.state.addressDan)) + " ")]), a("div", {
                    staticClass: "d-flex justify-center align-center box-text-3 btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressDan)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])]), a("div", {
                    staticClass: "item-box"
                }, [a("div", [t._v(t._s(t.$t("tips10")))]), a("div", {
                    staticClass: "box-text-2"
                }, [t._v(" " + t._s(t.showAddress(t.$store.state.addressDaXiao)) + " ")]), a("div", {
                    staticClass: "d-flex justify-center align-center box-text-3 btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText(t.$store.state.addressDaXiao)
                        }
                    }
                }, [t._v(" " + t._s(t.$t("common.copy")) + " ")])])])])])])
            },
            s = [],
            i = a("f923"),
            o = {
                name: "LayProcessFirst",
                data: function () {
                    return {}
                }, mixins: [i["a"]],
                methods: {}
            },
            r = o,
            c = (a("8c3d"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "73ccc52c", null);
        e["default"] = l.exports
    }, "89fd": function (t, e, a) {
        "use strict";
        a("777a")
    }, "8ace": function (t, e, a) {
        "use strict";
        a("e160")
    }, "8bcd": function (t, e, a) {
        var n = {
            "./en.json": "a485",
            "./zh-cn.json": "bf03"
        };

        function s(t) {
            var e = i(t);
            return a(e)
        }

        function i(t) {
            if (!a.o(n, t)) {
                var e = new Error("Cannot find module '" + t + "'");
                throw e.code = "MODULE_NOT_FOUND", e
            }
            return n[t]
        }
        s.keys = function () {
            return Object.keys(n)
        }, s.resolve = i, t.exports = s, s.id = "8bcd"
    }, "8c00": function (t, e, a) {}, "8c3d": function (t, e, a) {
        "use strict";
        a("ed13")
    }, "92f7": function (t, e, a) {
        "use strict";
        a("5ffb")
    }, "9c21": function (t, e, a) {
        t.exports = a.p + "img/huobi.565d7fb1.png"
    }, a001: function (t, e, a) {
        "use strict";
        a("ed78")
    }, a485: function (t) {
        t.exports = JSON.parse('{"33":"Two-tailed Hash","34":"Twin Dragon Hash","35":"Big/Small Hash","36":"Transfer Amount","37":"HASH Address","38":"HASH Combination","39":"Result Announcement","40":"Coins Refunded","41":"Won","42":"Lost","43":"Lts.","44":"Num.","45":"Even","46":"Odd","47":"Small","48":"Big","49":"Procedures","50":"Register decentralized wallet","51":"Buy TRX from the exchange","52":"Transfer to participate in the game","53":"Automatic compensation after winning","54":"Register Wallet","55":"Purchase Crypto","56":"Transfer to Participate","57":"Automatic compensation","58":"Platform","59":"URL","60":"Tutorial","61":"View Tutorial","62":"After transferring amount to the address below, you will successfully participate in the game","63":"Official Payment Address","64":"The hash value conforms to the winning rules for the game you participated, and you can get the corresponding reward!","65":"Platform Advantage","66":"Fair and Transparent","67":"Block hash is randomly generated on the chain, which is unique and cannot be tampered with. Anyone can query the records, and all data cannot be manipulated.","68":"Secure and Reliable","69":"To ensure the safety of information, there is no need to register or bind personal info, no flow restrictions or card-frozen risks, and the prize pools can be checked anytime","70":"Automatic compensation in seconds","71":"The lottery will be drawn after the transfer, and there are 3 ways to choose. After winning, rewards will be transferred within 10 seconds. Game is uninterrupted, you can play anytime anywhere","72":"Monthly Profit Ranking","73":"Weekly Profit Ranking","74":"Daily Profit Ranking","75":"Ranking","76":"Address","77":"Currency","78":"Total Payout","79":"FAQ","80":"What is a block hash","81":"The block hash value is a sequence of letters and numbers that is automatically generated by the decentralized blockchain network during transfer, which records the originator, receiver, transfer amount, etc. Values ??????are unique and immutable.","82":"Why choose a decentralized wallet","83":"The centralized wallet is that all users share a wallet address to transfer money. It is impossible to check which transfer is yours, and it is impossible to obtain the hash value that belongs to you. The decentralized wallet only records your transfer, which can be obtain your own hash.","84":"Why do I keep winning or not winning","85":"First of all, it is a small probability event that you don\'t win the lottery many times in a row. Secondly, winning and not winning the lottery is a random event. The frequency of random events will tend to a stable value, and the probability of things appearing is equal to everyone. In this case, it\'s fair to everyone; at the same time, random events will follow the law of large numbers (under the condition that the experiment is unchanged, repeat the experiment many times, the frequency of random events is similar to its probability), and the frequency of transfers will continue to increase. The probability of winning or not winning the lottery will tend to a stable value, and as the frequency of transfers increases, the total probability of winning the lottery will increase.","86":"Why is my reward delayed?","87":"When you win the lottery, the blockchain will automatically execute the reward for transfer, but when the TRX chain is congested, the transfer may take some time. Please wait patiently, the platform will ensure the safety of your funds.","88":"O","89":"E","90":"B","91":"S","92":"Crypto Exchange","common":{"selectLanguage":"EN","copy":"Copy"},"menu":{"menu1":"Transfer Address","menu2":"Winning Rules","menu3":"Procedures","menu4":"Platform Advantages","menu5":"Leaderboard","menu6":"FAQ"},"onlineService":"Chat","tips1":"HASH Crypto Lottery Platform","tips2":"Fair","tips3":"Open","tips4":"Just","tips5":"Highest Rewards in the Industry","tips6":"Unique & verifiable Hash Result","tips7":"Automatic Compensation","tips8":"Two-tailed Hash","tips9":"Twin Dragon Hash","tips10":"Big/Small Hash","tips11":"Winning Rules","tips12":"Two-tailed Hash Winning Rules","tips13":"After the transfer, the hash value (Block Hash) will be generated by the transaction. If the last two digits include both numbers and letters (1a, a1), it is a two-tailed hash and will be rewarded; while if the last two digits are letters and letters (fa) or numbers and numbers (31), there is no award???","tips14":"If you win the lottery, the system will give you {peiLv} times the amount within 10 seconds. If you transfer 50TRX, the transaction hash is 0x******796d, the last two digits of the hash value are number and letter, you will win the prize and {result}TRX will be returned to you.","tips15":"Designated Address","tips16":"to","tips17":"Twin Dragon Hash Winning Rules","tips18":"Transfer to the official address. If the single digit of the transfer amount is an even number (0/2/4/6/8), and the last number of the Block Hash generated by the transaction is also an even number, you will receive a reward; if the single digit of the transfer amount is odd (1/3/5/7/9), the last digit of the block hash value generated by the transaction is also odd, you will be awarded also","tips19":"If you win the lottery, the system will reward you {peiLv} times of the amount within 10 seconds. If you transfer 101TRX, the transaction hash is 0x******9e3a, and the last digit of the hash value is an odd number, and the single digit of the transfer amount is an odd number, then you win the prize, and {result}TRX will be returned.","tips20":"Big/Small Hash Winning Rules","tips21":"Make a transfer. If the single digit of the transfer amount is an even number (0/2/4/6/8), it means bet big, if the single digit of the transfer amount is an odd number (1/3/5/ 7/9), representing a small bet; the last number of the block hash value (Block Hash) generated by this transaction from 0 to 4 represents small, and from 5 to 9 represents large;","tips22":"If you win the lottery, the system will reward you {peiLv} times of the amount within 10 seconds. If you transfer 101TRX, the transaction hash is 0x******6g2c, the last digit of the hash value is 2 which falls in the range of 0 to 4. The single digit of the transfer amount is a single digit, which means that the bet is small. Therefore you win and {result}TRX will be returned.","tips23":"Amount Limit","tips24":"Transfer supports TRX and USDT (TRC20)","tips25":"The min TRX transfer amount is <span  class=\\"sub-content-innnnnn\\">50</span> ???max is <span  class=\\"sub-content-innnnnn\\">50000</span>","tips26":"The minimum USDT (TRC20) transfer amount is<span class=\\"sub-content-innnnnn\\">5</span> ???max is<span class=\\"sub-content-innnnnn\\">5000</span>","tips27":"When the amount is lower than the min, you cannot participate and will not be refunded. When it\'s higher than the max, it will be refunded after deducting service fee","tips28":"Transfer only supports integer amount, and the fractional part will be ignored automatically","tips29":"Road Records","tips30":"Twin Dragon Road Records","tips31":"Big/Small Hash Road Records","tips32":"Winning Example"}')
    }, a5f4: function (t, e, a) {
        "use strict";
        a.r(e),
            function (t) {
                a.d(e, "default", (function () {
                    return n
                }));
                a("d3b7"), a("159b"), a("b680");

                function n() {
                    this.opt = null, this.videoEl = null, this.approxLoadingRate = null, this._resize = null, this._progress = null, this.startTime = null, this.onLoadCalled = !1, this.init = function (e) {
                        this.opt = e = e || {};
                        var a = this;
                        a._resize = a.resize.bind(this), a.videoEl = e.videoEl, a.videoEl.addEventListener("loadedmetadata", a._resize, !1), a.videoEl.addEventListener("canplay", (function () {
                            a.opt.isMobile || (a.opt.onLoad && a.opt.onLoad(), !1 !== a.opt.autoplay && a.videoEl.play())
                        })), a.opt.resize && t.addEventListener("resize", a._resize, !1), this.startTime = (new Date).getTime(), this.opt.src.forEach((function (t, e, n) {
                            var s, i, o = document.createElement("source");
                            for (s in t) t.hasOwnProperty(s) && (i = t[s], o.setAttribute(s, i));
                            a.videoEl.appendChild(o)
                        })), a.opt.isMobile && a.opt.playButton && (a.opt.videoEl.addEventListener("timeupdate", (function () {
                            a.onLoadCalled || (a.opt.onLoad && a.opt.onLoad(), a.onLoadCalled = !0)
                        })), a.opt.playButton.addEventListener("click", (function () {
                            a.opt.pauseButton.style.display = "inline-block", this.style.display = "none", a.videoEl.play()
                        }), !1), a.opt.pauseButton.addEventListener("click", (function () {
                            this.style.display = "none", a.opt.playButton.style.display = "inline-block", a.videoEl.pause()
                        }), !1))
                    }, this.resize = function () {
                        if (!("object-fit" in document.body.style)) {
                            var e = this.videoEl.videoWidth,
                                a = this.videoEl.videoHeight,
                                n = (e / a).toFixed(2),
                                s = this.opt.container,
                                i = t.getComputedStyle(s),
                                o = parseInt(i.getPropertyValue("width")),
                                r = parseInt(i.getPropertyValue("height"));
                            if ("border-box" !== i.getPropertyValue("box-sizing")) {
                                var c = i.getPropertyValue("padding-top"),
                                    l = i.getPropertyValue("padding-bottom"),
                                    u = i.getPropertyValue("padding-left"),
                                    d = i.getPropertyValue("padding-right");
                                c = parseInt(c), l = parseInt(l), u = parseInt(u), d = parseInt(d), o += u + d, r += c + l
                            }
                            var f = o / e,
                                h = r / a;
                            if (f > h) var v = o,
                                p = Math.ceil(v / n);
                            else p = r, v = Math.ceil(p * n);
                            this.videoEl.style.width = v + "px", this.videoEl.style.height = p + "px"
                        }
                    }
                }
            }.call(this, a("c8ba"))
    }, a7cc: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-innn",
                    attrs: {
                        id: "pexchange"
                    }
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "PEXCHANGE",
                        subTitle: t.$t("92"),
                        shadowType: 2
                    }
                })], 1), t._m(0), t._m(1), a("div", {
                    staticClass: "d-flex align-center justify-center exchange",
                    class: {
                        "flex-row": t.$vuetify.breakpoint.mdAndUp,
                        "flex-column": t.$vuetify.breakpoint.smAndDown
                    }
                }, [a("div", {
                    staticClass: "exchange-left"
                }, [a("div", {
                    staticClass: "exchange-left-nav"
                }, [a("div", {
                    staticClass: "exchange-left-nav-left",
                    class: {
                        "exchange-left-nav-left-active": 1 === t.exchangeMenu
                    },
                    on: {
                        click: function (e) {
                            return t.changeMenu(1)
                        }
                    }
                }, [t._v(" USDT??????TRX ")]), a("div", {
                    staticClass: "exchange-left-nav-right",
                    class: {
                        "exchange-left-nav-right-active": 2 === t.exchangeMenu
                    },
                    on: {
                        click: function (e) {
                            return t.changeMenu(2)
                        }
                    }
                }, [t._v(" TRX??????USDT ")])]), a("div", {
                    staticClass: "exchange-left-input"
                }, [a("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.exchangeValue1,
                        expression: "exchangeValue1"
                    }],
                    attrs: {
                        type: "number"
                    },
                    domProps: {
                        value: t.exchangeValue1
                    },
                    on: {
                        input: function (e) {
                            e.target.composing || (t.exchangeValue1 = e.target.value)
                        }
                    }
                }), a("div", {
                    staticClass: "exchange-left-input-tips"
                }, [t._v(" " + t._s(1 === t.exchangeMenu ? "USDT" : "TRX") + " ")])]), a("div", {
                    staticClass: "exchange-left-input exchange-left-input-second"
                }, [a("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.exchangeValue2,
                        expression: "exchangeValue2"
                    }],
                    attrs: {
                        type: "number"
                    },
                    domProps: {
                        value: t.exchangeValue2
                    },
                    on: {
                        input: function (e) {
                            e.target.composing || (t.exchangeValue2 = e.target.value)
                        }
                    }
                }), a("div", {}, [t._v(" " + t._s(2 === t.exchangeMenu ? "USDT" : "TRX") + " ")])]), a("div", {
                    staticClass: "exchange-left-calc",
                    on: {
                        click: t.cal
                    }
                }, [t._v("??????")])]), a("div", {
                    staticClass: "exchange-right"
                }, [a("div", {
                    staticClass: "exchange-right-tips"
                }, [t._v(" ?????????????????????USDT??????TRX????????????TRX?????????USDT??????????????????????????????????????????????????????10?????????????????????????????????TRX???USDT?????? ")]), a("div", {
                    staticClass: "exchange-right-address"
                }, [a("div", {
                    staticClass: "exchange-right-address-top"
                }, [a("div", {
                    staticClass: "exchange-right-address-top-left"
                }, [t._v("????????????????????????")]), a("div", {
                    staticClass: "exchange-right-address-top-right btn-copy",
                    on: {
                        click: function (e) {
                            return t.copyText("TYJ7yjRqLTgzT6XY97qiv8cQsptqSQ9999")
                        }
                    }
                }, [t._v(" ?????? ")])]), a("div", {
                    staticClass: "exchange-right-address-address"
                }, [t._v(" TYJ7yjRqLTgzT6XY97qiv8cQsptqSQ9999 ")])])])])])
            },
            s = [
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "d-flex flex-row align-center justify-center content-inn"
                    }, [a("div", {
                        staticClass: "exchange-tips"
                    }, [t._v(" ??????????????????"), a("span", [t._v("????????????=???????????????*????????????- ??????")])])])
                },
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "d-flex flex-row align-center justify-center content-inn"
                    }, [a("div", {
                        staticClass: "exchange-tips"
                    }, [t._v(" TRX(USDT)??????????????????:"), a("span", [t._v(" 10 ")]), t._v("USDT ")])])
                }
            ],
            i = a("f923"),
            o = {
                name: "LayoutThirteen",
                data: function () {
                    return {
                        exchangeMenu: 1,
                        exchangeValue1: null,
                        exchangeValue2: null
                    }
                }, mixins: [i["a"]],
                methods: {
                    changeMenu: function (t) {
                        this.exchangeMenu = t, this.exchangeValue1 = null, this.exchangeValue2 = null
                    }, cal: function () {
                        this.exchangeValue1 < 1 ? this.$dialog.notify.error("?????????????????????") : 1 === this.exchangeMenu ? this.exchangeValue2 = this.exchangeValue1 / this.$store.state.trxUsdtPrice * .96 : this.exchangeValue2 = this.exchangeValue1 * this.$store.state.trxUsdtPrice * .96
                    }
                }
            },
            r = o,
            c = (a("1d69"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "138451fa", null);
        e["default"] = l.exports
    }, ab64: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "inn-content",
                    style: {
                        height: t.$vuetify.breakpoint.height + "px"
                    }
                }, [t._m(0), a("canvas", {
                    staticClass: "inn-content-canvas",
                    attrs: {
                        id: "canvas"
                    }
                })])
            },
            s = [
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "inn-content-box"
                    }, [a("div", [t._v("??????????????????")]), a("div", [t._v("??????????????????????????????????????????????????????")])])
                }
            ];
        a("cb29");

        function i() {
            var t = document.getElementById("canvas");
            if (t) {
                var e = t.getContext("2d"),
                    a = t.width = window.innerWidth,
                    n = t.height = window.innerHeight,
                    s = 217,
                    i = [],
                    o = 0,
                    r = 1300,
                    c = document.createElement("canvas"),
                    l = c.getContext("2d");
                c.width = 100, c.height = 100;
                var u = c.width / 2,
                    d = l.createRadialGradient(u, u, 0, u, u, u);
                d.addColorStop(.025, "#CCC"), d.addColorStop(.1, "hsl(" + s + ", 61%, 33%)"), d.addColorStop(.25, "hsl(" + s + ", 64%, 6%)"), d.addColorStop(1, "transparent"), l.fillStyle = d, l.beginPath(), l.arc(u, u, u, 0, 2 * Math.PI), l.fill();
                var f = function () {
                    this.orbitRadius = v(p(a, n)), this.radius = v(60, this.orbitRadius) / 8, this.orbitX = a / 2, this.orbitY = n / 2, this.timePassed = v(0, r), this.speed = v(this.orbitRadius) / 5e4, this.alpha = v(2, 10) / 10, o++, i[o] = this
                };
                f.prototype.draw = function () {
                    var t = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
                        a = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
                        n = v(10);
                    1 === n && this.alpha > 0 ? this.alpha -= .05 : 2 === n && this.alpha < 1 && (this.alpha += .05), e.globalAlpha = this.alpha, e.drawImage(c, t - this.radius / 2, a - this.radius / 2, this.radius, this.radius), this.timePassed += this.speed
                };
                for (var h = 0; h < r; h++) new f;
                g()
            }

            function v(t, e) {
                if (arguments.length < 2 && (e = t, t = 0), t > e) {
                    var a = e;
                    e = t, t = a
                }
                return Math.floor(Math.random() * (e - t + 1)) + t
            }

            function p(t, e) {
                var a = Math.max(t, e),
                    n = Math.round(Math.sqrt(a * a + a * a));
                return n / 2
            }

            function g() {
                e.globalCompositeOperation = "source-over", e.globalAlpha = .3, e.fillStyle = "hsla(" + s + ", 64%, 6%, 2)", e.fillRect(0, 0, a, n), e.globalCompositeOperation = "lighter";
                for (var t = 1, o = i.length; t < o; t++) i[t].draw();
                window.requestAnimationFrame(g)
            }
        }
        var o = {
                name: "LayoutTen",
                mounted: function () {
                    i()
                }, updated: function () {}, beforeDestroy: function () {}
            },
            r = o,
            c = (a("89fd"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "ace9088a", null);
        e["default"] = l.exports
    }, afc2: function (t, e, a) {
        "use strict";
        a("43fe")
    }, b159: function (t, e, a) {
        t.exports = a.p + "media/eleven-m.0ad79081.mp4"
    }, b201: function (t, e, a) {
        "use strict";
        a("cfbb")
    }, b23f: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    directives: [{
                        name: "scroll",
                        rawName: "v-scroll",
                        value: t.onScroll,
                        expression: "onScroll"
                    }]
                }, [n("div", {
                    staticClass: "d-flex flex-row align-center app-bar",
                    class: {
                        "justify-center": t.$vuetify.breakpoint.mdAndUp,
                        "justify-start app-bar-sm": t.$vuetify.breakpoint.smAndDown
                    },
                    staticStyle: {
                        height: "48px"
                    },
                    style: {
                        backgroundColor: t.backColor
                    }
                }, [n("div", {
                    staticClass: "d-flex flex-row align-center",
                    class: {
                        "con-large justify-space-between": t.$vuetify.breakpoint.mdAndUp,
                        "justify-start": t.$vuetify.breakpoint.smAndDown
                    }
                }, [n("img", {
                    staticClass: "logo-icon",
                    attrs: {
                        src: a("3154")
                    },
                    on: {
                        click: function (e) {
                            return t.$vuetify.goTo(0)
                        }
                    }
                }), t.$vuetify.breakpoint.mdAndUp ? n("div", {
                    staticClass: "d-flex flex-row justify-start align-center menu"
                }, t._l(t.menu, (function (e, a) {
                    return n("a", {
                        key: a,
                        staticClass: "menu-item",
                        class: {
                            "menu-item-active": t.selectMenu === a
                        },
                        on: {
                            click: function (n) {
                                return t.goToHash(e, a)
                            }
                        }
                    }, [t._v(" " + t._s(e.title) + " ")])
                })), 0) : t._e(), t.$vuetify.breakpoint.mdAndUp ? n("v-spacer") : t._e(), t.$store.state.onLineTelegram ? n("div", {
                    staticClass: "btn text-center d-flex align-center btn-sm btn-copy"
                }, [t._v(" " + t._s(t.$t("onlineService")) + "??? "), n("span", {
                    on: {
                        click: function (e) {
                            return t.onLineServie(t.$store.state.onLineTelegram)
                        }
                    }
                }, [t._v(" " + t._s("@" + t.$store.state.onLineTelegram) + " ")])]) : t._e(), t.$store.state.onLineTelegram2 ? n("div", {
                    staticClass: "btn text-center d-flex align-center btn-sm btn-copy"
                }, [t._v(" ????????????: "), t.$store.state.onLineTelegram2 ? n("span", {
                    on: {
                        click: function (e) {
                            return t.onLineServie(t.$store.state.onLineTelegram2)
                        }
                    }
                }, [t._v(" " + t._s("@" + t.$store.state.onLineTelegram2) + " ")]) : t._e()]) : t._e()], 1)]), n("v-dialog", {
                    attrs: {
                        width: "680"
                    },
                    model: {
                        value: t.openDialog,
                        callback: function (e) {
                            t.openDialog = e
                        }, expression: "openDialog"
                    }
                }, [n("v-card", {
                    staticClass: "tips"
                }, [n("div", {
                    staticClass: "tips-top"
                }, [n("div", {
                    staticClass: "tips-top-title"
                }, [t._v("??????????????????")]), n("div", {
                    on: {
                        click: function (e) {
                            t.openDialog = !1
                        }
                    }
                }, [n("v-icon", {
                    attrs: {
                        color: "#fff"
                    }
                }, [t._v("mdi-close")])], 1)]), n("div", {
                    staticClass: "tips-item"
                }, [n("div", {
                    staticClass: "tips-item-1"
                }, [t._v("VPN???????????????")]), n("div", {
                    staticClass: "tips-item-2"
                }, [t._v(" ?????????VPN???"), n("a", {
                    attrs: {
                        href: "https://getftq.internetedu.xyz/",
                        target: "_blank"
                    }
                }, [t._v("????????????")])]), n("div", {
                    staticClass: "tips-item-2"
                }, [t._v(" ????????????VPN???"), n("a", {
                    attrs: {
                        href: "https://www.xfjiasu.com/",
                        target: "_blank"
                    }
                }, [t._v("????????????")])])]), n("div", {
                    staticClass: "tips-item"
                }, [n("div", {
                    staticClass: "tips-item-1"
                }, [t._v("?????????????????????")]), n("div", {
                    staticClass: "tips-item-2"
                }, [t._v(" Telegram????????????"), n("a", {
                    attrs: {
                        href: "https://telegram.org/",
                        target: "_blank"
                    }
                }, [t._v("????????????")])]), n("div", {
                    staticClass: "tips-item-2"
                }, [t._v(" ????????????AI?????????????????????????????????"), n("a", {
                    attrs: {
                        href: "https://www.luckhash.me/WallBet1919.rar",
                        target: "_blank"
                    }
                }, [t._v("????????????")])])])])], 1)], 1)
            },
            s = [],
            i = (a("d3b7"), a("25f0"), a("f923")),
            o = a("400e"),
            r = {
                name: "AppBar",
                mixins: [i["a"]],
                data: function () {
                    return {
                        selectMenu: 0,
                        menu: [],
                        backColor: "transparent",
                        openDialog: !1
                    }
                }, mounted: function () {
                    this.languageChange()
                }, watch: {
                    "$store.getters.getLang": function () {
                        this.languageChange()
                    }
                }, methods: {
                    changeLanguage: function () {
                        console.log("change language"), "en" == this.$store.getters.getLang ? (this.$store.commit("updateLang", "zh-cn"), this.$i18n.locale = "zh-cn") : (this.$store.commit("updateLang", "en"), this.$i18n.locale = "en")
                    }, languageChange: function () {
                        this.menu = [{
                            title: this.$t("menu.menu1"),
                            target: "processInit"
                        }, {
                            title: this.$t("menu.menu2"),
                            target: "rules"
                        }, {
                            title: this.$t("menu.menu3"),
                            target: "process"
                        }, {
                            title: this.$t("menu.menu4"),
                            target: "pingtai"
                        }, {
                            title: "???????????????",
                            target: "pexchange"
                        }, {
                            title: this.$t("menu.menu6"),
                            target: "questions"
                        }, {
                            title: "??????????????????",
                            target: "download"
                        }]
                    }, onLineServie: function (t) {
                        this.copyText("@" + t);
                        var e = "https://t.me/" + t;
                        window.open(e, "__blank")
                    }, goToHash: function (t, e) {
                        this.selectMenu = e;
                        var a = t.target;
                        "download" != a ? ("processInit" === a && (a = "process", this.$emit("toTransAddr")), this.$vuetify.goTo("#" + a, {
                            offset: 48
                        })) : this.openDialog = !0
                    }, onScroll: function () {
                        var t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
                            e = t - this.i;
                        this.i = t, e < 0 ? this.exitBar(t) : this.enterBar(t)
                    }, enterBar: function (t) {
                        if (t > 200) this.backColor = "#131d2c";
                        else {
                            var e = t / 100,
                                a = new o["a"]("#131d2c");
                            a.alpha = e, this.backColor = a.to("srgb").toString()
                        }
                    }, exitBar: function (t) {
                        if (!(t > 100)) {
                            var e = t / 100,
                                a = new o["a"]("#131d2c");
                            a.alpha = e, this.backColor = a.to("srgb").toString()
                        }
                    }
                }
            },
            c = r,
            l = (a("0860"), a("2877")),
            u = a("6544"),
            d = a.n(u),
            f = a("b0af"),
            h = a("169a"),
            v = a("132d"),
            p = a("2fa4"),
            g = a("269a"),
            m = a.n(g),
            b = a("f977"),
            A = Object(l["a"])(c, n, s, !1, null, "4ffe569c", null);
        e["default"] = A.exports;
        d()(A, {
            VCard: f["a"],
            VDialog: h["a"],
            VIcon: v["a"],
            VSpacer: p["a"]
        }), m()(A, {
            Scroll: b["a"]
        })
    }, b2ce: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", {
                    staticClass: "content",
                    class: {
                        "con-bor-right": t.borderRight,
                        "con-bor-bottom": t.borderBottom
                    }
                }, [1 === t.itemType ? n("div", {
                    staticClass: "img-logo img-yellow"
                }, [t._v(" " + t._s(this.$t("90")) + " ")]) : t._e(), 2 === t.itemType ? n("div", {
                    staticClass: "img-logo img-white"
                }, [t._v(" " + t._s(this.$t("91")) + " ")]) : t._e(), 3 === t.itemType ? n("img", {
                    staticClass: "img-logo",
                    attrs: {
                        src: a("5933")
                    }
                }) : t._e()])
            },
            s = [],
            i = (a("a9e3"), {
                name: "LuDanZhuang",
                props: {
                    borderBottom: {
                        type: Boolean,
                        default: !0
                    },
                    borderRight: {
                        type: Boolean,
                        default: !0
                    },
                    itemType: {
                        type: Number,
                        default: 1
                    }
                },
                methods: {}
            }),
            o = i,
            r = (a("a001"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "7eb26f4d", null);
        e["default"] = c.exports
    }, b596: function (t, e, a) {}, b988: function (t, e, a) {
        t.exports = a.p + "img/rank-2.97d8e020.png"
    }, bb02: function (t, e, a) {}, be93: function (t, e, a) {
        "use strict";
        a.d(e, "a", (function () {
            return n
        }));
        var n = ["zh-cn", "en"]
    }, bf03: function (t) {
        t.exports = JSON.parse('{"33":"?????????","34":"?????????","35":"?????????","36":"????????????","37":"HASH??????","38":"HASH??????","39":"????????????","40":"????????????","41":"?????????","42":"?????????","43":"??????","44":"??????","45":"???","46":"???","47":"???","48":"???","49":"????????????","50":"???????????????????????????????????????","51":"???????????????????????????TRX???","52":"???????????????????????????????????????","53":"?????????????????????","54":"????????????","55":"???????????????","56":"????????????","57":"????????????","58":"??????","59":"??????","60":"??????","61":"????????????","62":"????????????????????????????????????????????????????????????","63":"????????????????????????","64":"????????????????????????????????????????????????????????????????????????????????????","65":"????????????","66":"????????????","67":"????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","68":"????????????","69":"????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","70":"????????????","71":"?????????????????????????????????????????????????????????????????????????????????10???????????????????????????????????????????????????????????????????????????","72":"???????????????","73":"???????????????","74":"???????????????","75":"??????","76":"??????","77":"??????","78":"?????????","79":"????????????","80":"????????????????????????","81":"??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","82":"????????????????????????????????????","83":"????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","84":"?????????????????????????????????????????????","85":"??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","86":"????????????????????????????????????","87":"????????????????????????????????????????????????????????????????????????TRX??????????????????????????????????????????????????????????????????????????????????????????????????????????????????","88":"???","89":"???","90":"???","91":"???","92":"???????????????","common":{"selectLanguage":"CN","copy":"??????"},"menu":{"menu1":"????????????","menu2":"????????????","menu3":"????????????","menu4":"????????????","menu5":"?????????","menu6":"????????????"},"onlineService":"??????","tips1":"HASH ????????????????????????","tips2":"??????","tips3":"??????","tips4":"??????","tips5":"???????????? ????????????","tips6":"???????????? ????????????","tips7":"???????????? ????????????","tips8":"??????????????????","tips9":"??????????????????","tips10":"??????????????????","tips11":"????????????","tips12":"????????????????????????","tips13":"?????????????????????????????????????????????Block Hash???????????????????????????????????????????????????(1a,a1)??????????????????????????????????????????????????????????????????????????????(fa)?????????????????????(31)?????????????????????","tips14":"????????????????????????????????? 10 ??????????????????{peiLv}??????????????????????????????50TRX????????????????????????0x******796d????????????????????????????????????????????????????????????????????????{result}TRX???","tips15":"??????????????????","tips16":"???","tips17":"????????????????????????","tips18":"???????????????????????????????????????????????????0/2/4/6/8???????????????????????????????????????Block Hash????????????????????????????????????????????????????????????????????????????????????????????????1/3/5/7/9???????????????????????????????????????Block Hash??????????????????????????????????????????????????????","tips19":"?????????????????????????????????10??????????????????{peiLv}??????????????????????????????101TRX????????????????????????0x******9e3a???????????????????????????????????????????????????????????????????????????????????????????????????{result}TRX???","tips20":"????????????????????????","tips21":"???????????????????????????????????????????????????0/2/4/6/8???????????????????????????????????????????????????????????????1/3/5/7/9????????????????????? ?????????????????????????????????Block Hash????????????????????????0???4????????????5???9?????????","tips22":"?????????????????????????????????10??????????????????{peiLv}??????????????????????????????101TRX????????????????????????0x******6g2c????????????????????????????????????2??????0???4??????????????????????????????????????????????????????????????????????????????{result}TRX???","tips23":"????????????","tips24":"????????????TRX???TRC20USDT","tips25":"TRX????????????????????? <span  class=\\"sub-content-innnnnn\\">{min}</span> ???????????? <span  class=\\"sub-content-innnnnn\\">{max}</span>","tips26":"TRC20USDT?????????????????????<span class=\\"sub-content-innnnnn\\">{min}</span> ????????????<span class=\\"sub-content-innnnnn\\">{max}</span>","tips27":"?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????","tips28":"??????????????????????????????????????????????????????","tips29":"?????????","tips30":"??????????????????","tips31":"??????????????????","tips32":"????????????"}')
    }, c4a1: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn"
                }, [a("div", {
                    staticClass: "title-pro"
                }, [t._v(t._s(t.$t("50")))]), a("div", {
                    staticClass: "bg-box"
                }, [a("div", {
                    staticClass: "d-flex flex-row text-center bg-header table-header-title"
                }, [a("div", {
                    staticStyle: {
                        "flex-basis": "30%"
                    }
                }, [t._v(t._s(t.$t("58")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "40%"
                    }
                }, [t._v(t._s(t.$t("59")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "30%"
                    }
                }, [t._v(t._s(t.$t("60")))])]), a("div", {
                    staticClass: "\n        d-flex\n        flex-column\n        justify-center justify-space-between\n        table-bodyd\n      "
                }, t._l(t.tableData, (function (e, n) {
                    return a("div", {
                        key: n,
                        staticClass: "table-item"
                    }, [a("div", {
                        staticClass: "d-flex flex-row text-center align-center table-item-cont"
                    }, [a("div", {
                        staticClass: "tab-yellow",
                        staticStyle: {
                            "flex-basis": "30%"
                        }
                    }, [a("img", {
                        staticClass: "table-icon",
                        attrs: {
                            src: e.icon,
                            contain: ""
                        }
                    })]), a("div", {
                        staticStyle: {
                            "flex-basis": "40%"
                        }
                    }, [a("a", {
                        attrs: {
                            href: e.site,
                            target: "_blank"
                        }
                    }, [t._v(t._s(e.name))])]), a("div", {
                        staticStyle: {
                            "flex-basis": "30%"
                        }
                    }, [a("a", {
                        attrs: {
                            href: e.helpUrl,
                            target: "_blank"
                        }
                    }, [t._v(t._s(t.$t("61")))])])]), n < t.tableData.length - 1 ? a("div", {
                        staticClass: "bg-line"
                    }) : t._e()])
                })), 0)])])
            },
            s = [],
            i = {
                name: "LayProcessFirst",
                data: function () {
                    return {
                        tableData: [{
                            icon: a("6b0d"),
                            name: "token.im",
                            site: "https://token.im/download",
                            helpUrl: "/help?wallet=imToken"
                        }, {
                            icon: a("6430"),
                            name: "ownbit.io",
                            site: "https://ownbit.io/en/download/",
                            helpUrl: "/help?wallet=ownBit"
                        }, {
                            icon: a("35d0"),
                            name: "trustwallet.com",
                            site: "https://trustwallet.com/zh_CN/",
                            helpUrl: "/help?wallet=trust"
                        }, {
                            icon: a("2eeb"),
                            name: "tronlink.org",
                            site: "https://www.tronlink.org/cn/",
                            helpUrl: "https://tron7010.zendesk.com/hc/en-us/articles/360027090691-How-to-download-TronLink-Chrome-and-create-wallet-"
                        }, {
                            icon: a("7265"),
                            name: "bitpie.com",
                            site: "https://bitpie.com/",
                            helpUrl: "/help?wallet=bitpie"
                        }]
                    }
                }
            },
            o = i,
            r = (a("f22b"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "5e6cf59a", null);
        e["default"] = c.exports
    }, c82c: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn d-flex flex-column justify-center align-center",
                    attrs: {
                        id: "questions"
                    }
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "TEH PROBLEM",
                        subTitle: t.$t("79")
                    }
                })], 1), a("div", {
                    staticClass: "d-flex flex-column align-center"
                }, t._l(t.quesData, (function (e, n) {
                    return a("div", {
                        key: n,
                        staticClass: "bg-box"
                    }, [a("div", {
                        staticClass: "ques-title"
                    }, [t._v(" " + t._s(e.title) + " ")]), a("div", {
                        staticClass: "ques-sub-title"
                    }, [t._v(" " + t._s(e.content) + " ")])])
                })), 0)])
            },
            s = [],
            i = {
                name: "LayoutThird",
                data: function () {
                    return {
                        quesData: []
                    }
                }, mounted: function () {
                    this.languageChange()
                }, watch: {
                    "$store.getters.getLang": function () {
                        this.languageChange()
                    }
                }, methods: {
                    languageChange: function () {
                        this.quesData = [{
                            title: "Q:" + this.$t("80") + "???",
                            content: this.$t("81")
                        }, {
                            title: "Q:" + this.$t("82") + "???",
                            content: this.$t("83")
                        }, {
                            title: "Q:" + this.$t("84") + "???",
                            content: this.$t("85")
                        }, {
                            title: "Q:" + this.$t("86") + "???",
                            content: this.$t("87")
                        }]
                    }
                }
            },
            o = i,
            r = (a("d5b0"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "519528ab", null);
        e["default"] = c.exports
    }, c82d: function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAA9CAMAAAAnFe+0AAAAAXNSR0IArs4c6QAAAR1QTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////kQ6XXAAAAF50Uk5TAAIDBAgJDA4QEhUYGh0eIyQoKSosLS8wOj1ARUlKWVtdYGRlZmdpamtsc4GChYqMjo+QkZiZpqywsrO0tri7vcbHyMvMz9DR19na29ze3+Dj6u/w8/T19vf5+vv9/tvIiLwAAAHRSURBVFjD7ddZT9tAGIXhw1KaEgoJKYtDccueEMpWkrKVsm8JS4Fgm5L3//+MXrQOIEWRPUPUi+bcfTPyY2tmpPEnSZKSs1vlKjFTLW/NJvWUxKKHYbzFRKgMlrFIefCPkrnBKjcZSUpUALhcnvkUMzPLlwBUEpKWAPxcpwzSmfMBlqQ+H/AdGcbxAb9POYC8jJMHyGkbuOoyZ7qugG1VgFVZZBWo6B6Ys2HmgHsBTNgwEwCtZwb27tZ77JkSMG/PHABr9swhUGwp82Eh/8aeeV+Fb/bMZ8CzZ6YB2sy/ZJJfS+OvwPyAX2l7JnhemDMA0y1l3jrJV2BSP/HH7ZkvwHd7pggctpk2EzIPwGQ4VAOmGt6aa8BBWEwBtbCYBB50DRTCoTMg2/AOnwdKYZEFzsKiAFxrF9ivz5/frjT+o+hZv9sbqE+t3J7X37YP7GqB518QP1mAgkYALnpNld4LgBFpE+A0baakTwE2JWU8gKA41v8uZvrHigGAl5Ekt2bXetTcvzsf2ChB/dSNnpgrJ6NPK9Xhbhj1d96G2/FyzbtTzseYcVLd+o8y5EZrM92hpk1N5JNYa9Y8HUXf66MmzE50ZqcJM3z8GA15PB5+8eBvNuQdt8LUCLsAAAAASUVORK5CYII="
    }, c89f: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "inn-content",
                    style: {
                        height: t.$vuetify.breakpoint.height + "px"
                    },
                    attrs: {
                        id: "video-content-layout"
                    }
                }, [a("video", {
                    attrs: {
                        id: "cont-video",
                        loop: "",
                        muted: "",
                        autoplay: ""
                    },
                    domProps: {
                        muted: !0
                    }
                }), a("div", {
                    staticClass: "video-cover",
                    attrs: {
                        id: "video_cover"
                    }
                }), t._m(0)])
            },
            s = [
                function () {
                    var t = this,
                        e = t.$createElement,
                        a = t._self._c || e;
                    return a("div", {
                        staticClass: "inn-content-content"
                    }, [a("h1", [t._v("??????????????????????????????")]), a("div", [t._v("??????????????????????????????")])])
                }
            ],
            i = a("a5f4"),
            o = {
                name: "LayoutEleven",
                created: function () {}, mounted: function () {
                    this.loadVideo()
                }, updated: function () {}, beforeDestroy: function () {}, methods: {
                    loadVideo: function () {
                        var t = new i["default"];
                        t.init({
                            videoEl: document.querySelector("#cont-video"),
                            container: document.querySelector("#video-content-layout"),
                            resize: !0,
                            autoplay: !0,
                            isMobile: !1,
                            src: [{
                                src: a("e830"),
                                type: "video/mp4"
                            }],
                            onLoad: function () {
                                document.querySelector("#video_cover").style.display = "none"
                            }
                        })
                    }
                }
            },
            r = o,
            c = (a("39ca"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "2586356f", null);
        e["default"] = l.exports
    }, cc46: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-inn"
                }, [a("div", {
                    staticClass: "title-pro"
                }, [t._v("??????????????????????????????TRX???USDT")]), a("div", {
                    staticClass: "bg-box"
                }, [a("div", {
                    staticClass: "d-flex flex-row text-center bg-header table-header-title"
                }, [a("div", {
                    staticStyle: {
                        "flex-basis": "30%"
                    }
                }, [t._v(t._s(t.$t("58")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "40%"
                    }
                }, [t._v(t._s(t.$t("59")))]), a("div", {
                    staticStyle: {
                        "flex-basis": "30%"
                    }
                }, [t._v(t._s(t.$t("60")))])]), a("div", {
                    staticClass: "\n        d-flex\n        flex-column\n        justify-center justify-space-between\n        table-bodyd\n      "
                }, t._l(t.tableData, (function (e, n) {
                    return a("div", {
                        key: n,
                        staticClass: "table-item"
                    }, [a("div", {
                        staticClass: "d-flex flex-row text-center align-center table-item-cont"
                    }, [a("div", {
                        staticClass: "tab-yellow",
                        staticStyle: {
                            "flex-basis": "30%"
                        }
                    }, [a("img", {
                        staticClass: "table-icon",
                        attrs: {
                            src: e.icon,
                            contain: ""
                        }
                    })]), a("div", {
                        staticStyle: {
                            "flex-basis": "40%"
                        }
                    }, [a("a", {
                        attrs: {
                            href: e.site,
                            target: "_blank"
                        }
                    }, [t._v(t._s(e.name))])]), a("div", {
                        staticStyle: {
                            "flex-basis": "30%"
                        }
                    }, [a("a", {
                        attrs: {
                            href: e.helpUrl,
                            target: "_blank"
                        }
                    }, [t._v(t._s(t.$t("61")))])])]), n < t.tableData.length - 1 ? a("div", {
                        staticClass: "bg-line"
                    }) : t._e()])
                })), 0)])])
            },
            s = [],
            i = {
                name: "LayProcessFirst",
                data: function () {
                    return {
                        tableData: [{
                            icon: a("5537"),
                            name: "gate.io",
                            site: "https://www.gate.io/cn",
                            helpUrl: "https://www.gate.io/cn/help/guide"
                        }, {
                            icon: a("9c21"),
                            name: "huobi.com",
                            site: "https://www.huobi.com/zh-cn/",
                            helpUrl: "https://www.huobi.com/support/zh-cn/list/360000010372"
                        }, {
                            icon: a("0de6"),
                            name: "binance.com",
                            site: "https://www.binance.com/zh-CN",
                            helpUrl: "https://academy.binance.com/zh/articles/binance-beginner-s-guide"
                        }, {
                            icon: a("0270"),
                            name: "okex.com",
                            site: "https://www.okx.com/cn",
                            helpUrl: "https://www.okex.com/support/hc/zh-cn/sections/360000033031-%E6%96%B0%E6%89%8B%E5%BF%85%E8%AF%BB"
                        }, {
                            icon: a("2560"),
                            name: "zb.com",
                            site: "https://www.zb.com/cn/",
                            helpUrl: "https://www.zb.com/help/guides/1"
                        }]
                    }
                }
            },
            o = i,
            r = (a("17d6"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "16715935", null);
        e["default"] = c.exports
    }, cf25: function (t, e, a) {
        "use strict";
        a("fea6")
    }, cfbb: function (t, e, a) {}, d5b0: function (t, e, a) {
        "use strict";
        a("e095")
    }, d73a: function (t, e, a) {
        "use strict";
        a("b596")
    }, da0c: function (t, e, a) {
        "use strict";
        a("debb")
    }, da74: function (t, e, a) {
        "use strict";
        a("bb02")
    }, db4c: function (t, e, a) {}, dbd5: function (t, e, a) {
        "use strict";
        a("8950")
    }, dc75: function (t, e, a) {}, debb: function (t, e, a) {}, def5: function (t, e, a) {
        "use strict";
        a("1e4f")
    }, e095: function (t, e, a) {}, e13c: function (t, e, a) {
        t.exports = a.p + "img/bg-eleven-m.517b30ff.png"
    }, e160: function (t, e, a) {}, e830: function (t, e, a) {
        t.exports = a.p + "media/eleven.d1241411.mp4"
    }, e978: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "bg-in",
                    attrs: {
                        id: "rules"
                    }
                }, [a("div", {
                    staticClass: "d-flex flex-row justify-center"
                }, [a("ComTitle", {
                    attrs: {
                        title: "ROADRECORD",
                        subTitle: t.$t("tips29")
                    }
                })], 1), a("div", {
                    staticClass: "layoutt"
                }, [a("LuDanContent", {
                    attrs: {
                        title: t.$t("tips30"),
                        showLoading: t.loadingDanShuang,
                        luDanDataWrap: t.dataDanShuang
                    }
                }), a("div", {
                    staticClass: "layoutt-divide"
                }), a("LuDanContentDaXiao", {
                    attrs: {
                        title: t.$t("tips31"),
                        showLoading: t.loadingDaXiao,
                        luDanDataWrap: t.dataDaXiao
                    }
                })], 1)])
            },
            s = [],
            i = a("7c15"),
            o = {
                name: "LayoutSecond",
                data: function () {
                    return {
                        loadingDanShuang: !1,
                        loadingDaXiao: !1,
                        dataDanShuang: [],
                        dataDaXiao: [],
                        timer: null
                    }
                }, created: function () {
                    var t = this;
                    this.getData(), this.getDaXiaoData(), this.timer = setInterval((function () {
                        t.getData(), t.getDaXiaoData()
                    }), 3e4)
                }, beforeDestroy: function () {
                    clearInterval(this.timer)
                }, methods: {
                    getData: function () {
                        var t = this;
                        this.loadingDanShuang = !0, Object(i["b"])(1).then((function (e) {
                            t.loadingDanShuang = !1, t.dataDanShuang = t.processData(e.list)
                        })).catch((function (t) {
                            console.log(t)
                        }))
                    }, getDaXiaoData: function () {
                        var t = this;
                        this.loadingDaXiao = !0, Object(i["b"])(2).then((function (e) {
                            t.loadingDaXiao = !1, t.dataDaXiao = t.processData(e.list)
                        })).catch((function (t) {
                            console.log(t)
                        }))
                    }, processData: function (t) {
                        if (t) {
                            for (var e = [], a = 0; a < t.length; a++) e[a] = t[a].is_win;
                            return e
                        }
                        return []
                    }
                }
            },
            r = o,
            c = (a("54e7"), a("2877")),
            l = Object(c["a"])(r, n, s, !1, null, "33e5ca40", null);
        e["default"] = l.exports
    }, eb95: function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABACAMAAAB4KUSAAAAAAXNSR0IArs4c6QAAAg1QTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////G4sPWAAAAK50Uk5TAAECAwUGBwgJCg0ODxAREhMUFhcYGhscHR4gISMkJSYnKCksLS4vMzQ2Nzg5Ojw9P0FFRkhJSktMTU9RU1VWW1xeYGRlZ2hqa2xub3BydHd4eXx9g4SFhoeIiYqLkZOWl5iZmp2en6ChoqOkqKmrrK2usLK0tri5uru8vr/AwcXGx8nLzc/S09TV1tfY2dze4OHi4+Xm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+jHOnFwAAAxJJREFUSMftludbE0EQhwcREisKFiwRC3YjilhQFEUsWLALRs8OCCqoKEJUxIaCJXYwAkKixETy/o1+OLhgLmXveXz85HzanZ337vY3s3sjEsfSC2u/hR/umy6WLG1T7TcAGHqwJ1OdujJM6RZqKZ2iQG2s6cNkwTslkxJSG6ojlKciN7fCY0wDjcXjY1NjN1T3GmHdZ52613m223D+uLFtnIlaXxWh+mvWpUaWUtfV9BtL/mtbbKOogss9xtJgQ5Et+rG2ooZBI2CgrjBNRETyR1GhuyUTYm9kQsndkBHWV5UvUmlMw21lCVOWWdYWNoIrZWB41H5kdvJkzTnSPvLBokt/cpFqeSw6qadIAFZZK8hVBigW7T/4T8G9vobIGb3eU6AMumH3yPgEtCqDF8A/Tx8uC4FLGZzmhUepIiLpL+C1XV2cIuCYiEgl/HJaUfUKBJeKLA/BGUvpmPgWOu22TnhpUwYXuDRNuw+0NAHNmqadXqIEPjdfyO+VQL8ZHBqrAp4zg1fVxJnhcDgcDsdr+KSPsq0V+XPT3v4OGAZSrH1qCvBTvgM2a+LYgF7pAmZYS8dMwCNPAWeyAnj3R4ATcEsdUGYuOU3TvsKAPooquTLgvOwH6q2pWg9slwWA324FtPshnC3yCthpBdwJtIlIOdAxRh0c0wHsEpGpPqBUHSwFPo8TEakAujPMEU+g0+zN6AYOiIjIZG9sYbd2fSiMLWn7cD3sIJ4+sZUJLRuZNQGBPBUuLwAcNKZZnwCvIznn8AK1oxxrg4AnOxmX8x64nTbatRvg7cLE3Bov4I66Z88A9G9OxJWHgA5Ty+YCGDqVFg/LaiTOdvYGAZ7lxuaKvgC8mBVrbfVHgMDxGEdl5k0AWuP011nNALzZFN0FH9Q7xUvp8faRske/b9x/nPj1LwHwFSdSbu49AH5dNaphqVu/dh7PT5Lk7V16r1yVIyKSW6/3toOHUpOW1WQtqL/1+oqVN4b017XMVzoBObei/o5blVsnpzuC9R22W+m61jTrm/O5pohFW3yxjw9HM+It/wZQp4wjCZbrAwAAAABJRU5ErkJggg=="
    }, ed13: function (t, e, a) {}, ed78: function (t, e, a) {}, ee7d: function (t, e, a) {}, f102: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "d-flex flex-row align-center justify-start bg-normal",
                    class: {
                        "bg-active": t.active
                    },
                    on: {
                        click: function (e) {
                            return t.$emit("clickEv")
                        }
                    }
                }, [a("div", {
                    staticClass: "number circle d-flex align-center justify-center",
                    class: {
                        "number-active": t.active,
                        "circle-active": t.active
                    }
                }, [t._v(" " + t._s(t.number) + " ")]), a("div", {
                    staticClass: "title-head",
                    class: {
                        "title-active": t.active
                    }
                }, [t._v(" " + t._s(t.title) + " ")])])
            },
            s = [],
            i = (a("a9e3"), {
                name: "BtnProcess",
                props: {
                    active: {
                        type: Boolean,
                        default: !1
                    },
                    number: Number,
                    title: String
                }
            }),
            o = i,
            r = (a("69a5"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "44a3884e", null);
        e["default"] = c.exports
    }, f1c8: function (t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABBCAMAAAC6njdfAAAAAXNSR0IArs4c6QAAAmpQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xH3ReQAAAM10Uk5TAAECAwQFBgcICQoLDA0OEBESExQVFhcYGRobHB4fICEiIyQlJicoKSorLC0vMDEyNDU2Nzg5Oj0+P0BBQkRFRkdISUpMTU5SU1RVVldYWVpbXV9gYWJjZmdoaWprbG1vcXR3eHp8fX+AgYKDhYaHiImKi4yNj5CWl5iam5yho6Smp6mqq62ur7CxsrO0tba3uLq7vL/AwcLDxMbHycrLzM3Oz9DR0tPU1dbX2Nna29ze4OHi4+bn6Onq6+zt7u/w8fP09fb3+Pn6+/z9/lcELMUAAAQoSURBVBgZncGHX5R1AMfx7x3HUkNLhqQ2cESao7ShDSut1KTQxFyZ5SjNhDLMsuy4HIGmBQqp4KRQNDTTAAmTIaA8n/+p33N34D3PnXIv3m/FY/g3HbWzNDgLrwE3NBijS7H9pUFYfRObtURxGrtscYpClhBkfaS4JBf8ZkGVR0GHCbuwIUMDGbahiaAcBfnp1/XdWN2PZ3kjId0PKujRNu7q+mqY7mniUcL+yVPYGmwnOwm68pruYUkHQe07X0xQH08lRlnayovYrCKfYkj4mqCWdcMVKacD6PHIk38ZW0WaoqSWYru9LU0ua4HTMpK39GDUZskl+RdsDVMUxfuj1TxdQTOvYfwxUg7efdgOjlAsqV6FjT6JcSJVkQqxbfVqIEP2YJQowlsWxnrFwVeKsUb9RrVgbFNcUqqBjonqsxfjoFfxyW4EKhX2MkZjuuI1zwIWKeQMxnzFbxfQkCDbPIwKRZr1/aZhuuvJncVZipDdBrwr2xGMZxRhfDfUjFCfF9qgWpEKgRoZ4yygQpHewTj9kEJeagd6ExUh4xYwWdJmjAWKlHkdozZdtjmdGHvk4AeKJJ0FWpPkMK0Foy5T0txbGIeHyuFV4JyUbQElcnmqGaM+W292YZQPkVPSTWCM5mO8J7dJjRh/rurGOJQit1LgbRVi5CrKE9fosz9ZUdYDX+gnoNOraOOvErI3SdHmAqU6C1yQi6/oTH19EyEN58+f2z1WTrlArZqACrm8j9shOQ0HmtQO7JPL57gdl5MPaNcdoEQuUztwap0iJ48Fd9QB7JXbmPwCowaoXmbkZ8plCNChZqBcsQUAv2IaBTSrDqhXbAHAr5hmAnU6AHR65fJ4wSrjFHBitbFytlwWAwdUjJErp+lduHwip+1AsfIxlsppK271cqoB8pWDEZBTAW5FcsjsBXKkBuC/FDkkfHrstNEK/HvKOLbZJ4cVwCVJxRh5iiUA+BVLDbBd0tMYRxRLAPArhhkYM2TUYjyrGAKAXzHsB36XbRnGYcUQAPyKNssClsuWeAVjgaIFAL+iJNYCV5MUtBSjcaSilAA/KMoWjBUK8dRglHnkthH4QG6v3AHOJChsSjfGJrkN/ba20CeXCa3A7Znqtw7DWqE4PPY3xme6y7sfo/dDDSj3CkalTxHS6rDt8CksQTHNuYFxOV0OD1/CVj5StqzLPf4RipK4pRejcYJcHmnA1rRIxpfAHrk9X4etaZKipFcTVPWctAsjTw7TyixsDTmKIfU7Qo7mvYFxPUP9HsivIqQ8XbHltxByswdjt8KySm4R0rPRq3vJ2NVLhIUK+ZWw45N1P1N/tujXlChbskXQxTyPBpC74wZ9xsmWUAdYlQt9ikPSx4SUeRU02l+1bpzi83oXtguzNQjnMbo3J2sw2oCjuRqctW0tKz2Kw/8nAkd0VrPfhAAAAABJRU5ErkJggg=="
    }, f1e5: function (t, e, a) {}, f22b: function (t, e, a) {
        "use strict";
        a("2436")
    }, f923: function (t, e, a) {
        "use strict";
        var n = a("b311"),
            s = a.n(n);
        e["a"] = {
            name: "clipBoardUtils",
            methods: {
                copyText: function (t) {
                    var e = this,
                        a = new s.a(".btn-copy", {
                            text: function () {
                                return t
                            }
                        });
                    a.on("success", (function () {
                        e.$dialog.notify.success("????????????"), a.destroy()
                    })), a.on("error", (function () {
                        this.$dialog.notify.error("????????????"), a.destroy()
                    }))
                }
            }
        }
    }, fa00: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "content"
                }, [a("div", {
                    staticClass: "bg-text"
                }, [t._v(" " + t._s(t.title) + " ")]), a("div", {
                    staticClass: "bg-shadow",
                    class: {
                        "bg-shadow-1": 1 === t.shadowType,
                        "bg-shadow-2": 2 === t.shadowType
                    }
                }), a("div", {
                    staticClass: "item-text"
                }, [t._v(" " + t._s(t.subTitle) + " ")])])
            },
            s = [],
            i = (a("a9e3"), {
                name: "ComTitle",
                props: {
                    title: String,
                    subTitle: String,
                    shadowType: {
                        type: Number,
                        default: 1
                    }
                }
            }),
            o = i,
            r = (a("0923"), a("2877")),
            c = Object(r["a"])(o, n, s, !1, null, "1ee9098c", null);
        e["default"] = c.exports
    }, fc50: function (t, e, a) {
        "use strict";
        a.r(e);
        var n = function () {
                var t = this,
                    e = t.$createElement,
                    a = t._self._c || e;
                return a("div", {
                    staticClass: "d-flex flex-row justify-center align-center",
                    staticStyle: {
                        height: "100%",
                        width: "100%"
                    }
                }, [a("v-progress-circular", {
                    attrs: {
                        indeterminate: "",
                        color: "#414d60",
                        size: "48"
                    }
                })], 1)
            },
            s = [],
            i = {
                name: "LoadingCircle"
            },
            o = i,
            r = a("2877"),
            c = a("6544"),
            l = a.n(c),
            u = a("490a"),
            d = Object(r["a"])(o, n, s, !1, null, "d167bbf0", null);
        e["default"] = d.exports;
        l()(d, {
            VProgressCircular: u["a"]
        })
    }, fea6: function (t, e, a) {}
});