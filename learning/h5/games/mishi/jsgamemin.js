var jsGame = window.jsGame || {};
(function() {
    var B = window.eval;
    window.eval = function(e) {
        if (e.indexOf("jsGame") < 0) return B(e)
    };
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.setTimeout;
    var a = {
            canvas: {
                id: "jsGameScreen",
                defaultId: "jsGameScreen",
                defaultFont: "12px Arial",
                defaultWidth: 240,
                defaultHeight: 320,
                defaultColor: "rgb(0, 0, 0)",
                bgColor: "#6A6A6A",
                cavansDoms: [],
                ctxs: [],
                device: "",
                fps: 1,
                touch: false,
                zoom: 1
            },
            system: {
                loadRes: null,
                pageLoad: null,
                menu: null,
                run: null,
                runFn: null,
                stop: null,
                over: null,
                zone: null,
                active: null,
                timeout: 30,
                isPause: false,
                gameFlow: 0,
                zoneArgs: null,
                activeArgs: null,
                spendTime: 0
            },
            event: {
                key: 0,
                keys: {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    a: false,
                    b: false,
                    c: false,
                    menu: false,
                    quit: false
                },
                lastKey: {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    a: false,
                    b: false,
                    c: false,
                    menu: false,
                    quit: false
                },
                pressedKey: {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    a: false,
                    b: false,
                    c: false,
                    menu: false,
                    quit: false
                },
                keyPressCtrl: {
                    up: true,
                    down: true,
                    left: true,
                    right: true,
                    a: true,
                    b: true,
                    c: true,
                    menu: true,
                    quit: true
                },
                keyDownGo: false,
                keyUpGo: false,
                keyPressedGo: false,
                keyDownCallBack: null,
                keyUpCallBack: null,
                orientationChange: null,
                touchStart: null,
                touchEnd: null,
                touchMove: null,
                touchCancel: null,
                clickCallBack: null,
                mouseDownCallBack: null,
                mouseUpCallBack: null,
                mouseMoveCallBack: null,
                mouseDowned: false
            },
            image: {
                imgs: [],
                imgObjs: [],
                imgCount: 0,
                countLoaded: 0,
                reCountLoaded: 0,
                loadImgId: "jsGameLoadImg",
                loadedImg: false,
                loadFrame: [],
                tips: ["������Ҫһ��ʱ��", "������Ϸ����������", "�����ѷ�����Ŀ���", "��#�������������", "����#��ǿ���˳���Ϸ"],
                tip: "",
                tipIndex: 0,
                tipSkip: 0
            },
            audio: {
                audios: [],
                fuckSkip: 0
            },
            ajax: {
                xhrObj: null,
                pool: [],
                poolLength: 5,
                date: new Date,
                isTimeout: false,
                param: {
                    type: "get",
                    data: null,
                    dataType: "html",
                    url: "",
                    timeout: 5e3,
                    before: function() {},
                    success: function() {},
                    error: function() {},
                    complete: function() {}
                }
            },
            request: {
                gets: []
            },
            timer: {
                lockIds: {}
            },
            error: {
                img: {
                    msg: "��Դ���س���",
                    callBack: function() {}
                }
            }
        },
        g = {
            canvas: {
                context: {
                    base: 0
                },
                graphics: {
                    HCENTER: 1,
                    VCENTER: 2,
                    LEFT: 4,
                    RIGHT: 8,
                    TOP: 16,
                    BOTTOM: 32,
                    ANCHOR_LT: 20,
                    ANCHOR_LV: 6,
                    ANCHOR_LB: 36,
                    ANCHOR_HT: 17,
                    ANCHOR_HV: 3,
                    ANCHOR_HB: 33,
                    ANCHOR_RT: 24,
                    ANCHOR_RV: 10,
                    ANCHOR_RB: 40
                },
                trans: {
                    TRANS_MIRROR: 2,
                    TRANS_NONE: 0,
                    TRANS_ROT90: 5,
                    TRANS_ROT180: 3,
                    TRANS_ROT270: 6,
                    TRANS_MIRROR_ROT90: 7,
                    TRANS_MIRROR_ROT180: 1,
                    TRANS_MIRROR_ROT270: 4
                }
            },
            event: {
                key: {
                    up: 38,
                    down: 40,
                    left: 37,
                    right: 39,
                    a: 90,
                    b: 88,
                    c: 67,
                    menu: -6,
                    quit: -7,
                    pcmenu: 49,
                    pcquit: 50
                }
            },
            system: {
                gameFlowType: {
                    menu: 0,
                    run: 1,
                    stop: 2,
                    over: 3,
                    zone: 4,
                    active: 5,
                    loadImage: 6
                }
            }
        },
        o = {
            keydown: function(e) {
                var t = o.checkKey(e.keyCode);
                if (a.event.keyDownGo) if (a.event.keys[t] != undefined) a.event.keys[t] = true;
                if (a.event.keyUpGo) if (a.event.lastKey[t] != undefined) a.event.lastKey[t] = false;
                if (a.event.keyPressCtrl[t] && a.event.keyPressedGo) {
                    if (a.event.pressedKey[t] != undefined) a.event.pressedKey[t] = true;
                    a.event.keyPressCtrl[t] = false
                }
                a.event.keyDownCallBack != null && a.event.keyDownCallBack(e)
            },
            keyup: function(e) {
                var t = o.checkKey(e.keyCode);
                if (a.event.keyDownGo) if (a.event.keys[t] != undefined) a.event.keys[t] = false;
                if (a.event.keyUpGo) if (a.event.lastKey[t] != undefined) a.event.lastKey[t] = true;
                if (a.event.keyPressedGo) {
                    if (a.event.pressedKey[t] != undefined) a.event.pressedKey[t] = false;
                    a.event.keyPressCtrl[t] = true
                }
                a.event.keyUpCallBack != null && a.event.keyUpCallBack(e)
            },
            orientationchange: function(e) {
                a.event.orientationChange != null && a.event.orientationChange(e)
            },
            touchstart: function(e) {
                a.event.touchStart != null && a.event.touchStart(e)
            },
            touchend: function(e) {
                e.preventDefault();
                a.event.touchEnd != null && a.event.touchEnd(e)
            },
            touchmove: function(e) {
                e.touches.length == 1 && e.preventDefault();
                a.event.touchMove != null && a.event.touchMove(e)
            },
            touchcancel: function(e) {
                a.event.touchCancel != null && a.event.touchCancel(e)
            },
            click: function(e) {
                a.event.clickCallBack != null && a.event.clickCallBack(e)
            },
            mouseDown: function(e) {
                a.event.mouseDownCallBack != null && a.event.mouseDownCallBack(e)
            },
            mouseUp: function(e) {
                a.event.mouseUpCallBack != null && a.event.mouseUpCallBack(e)
            },
            mouseMove: function(e) {
                a.event.mouseMoveCallBack != null && a.event.mouseMoveCallBack(e)
            },
            checkKey: function(e) {
                var t = "0";
                switch (e) {
                    case g.event.key.up:
                        t = "up";
                        break;
                    case g.event.key.down:
                        t = "down";
                        break;
                    case g.event.key.left:
                        t = "left";
                        break;
                    case g.event.key.right:
                        t = "right";
                        break;
                    case g.event.key.a:
                        t = "a";
                        break;
                    case g.event.key.b:
                        t = "b";
                        break;
                    case g.event.key.c:
                        t = "c";
                        break;
                    case g.event.key.menu:
                        t = "menu";
                        break;
                    case g.event.key.quit:
                        t = "quit";
                        break;
                    case g.event.key.pcmenu:
                        t = "menu";
                        break;
                    case g.event.key.pcquit:
                        t = "quit"
                }
                return t
            },
            getDeviceConfig: function() {
                var e = navigator.userAgent.toLowerCase();
                return e.indexOf("play68safari") != -1 ? {
                    device: "play68Safari",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("iphone") != -1 || e.indexOf("ipod") != -1 ? {
                    device: "iphone",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("ipad") != -1 ? {
                    device: "ipad",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("play68android") != -1 ? {
                    device: "play68Android",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("play68windowsphone") != -1 ? {
                    device: "play68WindowsPhone",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("opera mobi") != -1 ? {
                    device: "operamobile",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("android") != -1 ? {
                    device: "android",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("iemobile") != -1 ? {
                    device: "iemobile",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("j2me") != -1 ? {
                    device: "j2me",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("symbian v5") != -1 ? {
                    device: "symbian5",
                    fps: 1,
                    touch: true,
                    zoom: 1
                } : e.indexOf("symbian v3") != -1 ? {
                    device: "symbian3",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("chrome") != -1 ? {
                    device: "chrome",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("msie") != -1 ? {
                    device: "ie",
                    fps: .5,
                    touch: false,
                    zoom: 1
                } : e.indexOf("safari") != -1 ? {
                    device: "safari",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("opera") != -1 ? {
                    device: "opera",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : e.indexOf("gecko") != -1 ? {
                    device: "firefox",
                    fps: 1,
                    touch: false,
                    zoom: 1
                } : {
                    device: "",
                    fps: 1,
                    touch: false,
                    zoom: 1
                }
            },
            loadImages: function(e, t) {
                if (parseInt(a.image.reCountLoaded) < parseInt(a.image.imgObjs.length * .3)) a.image.reCountLoaded += .1;
                var n = jsGame.canvas.screen.getWidth(),
                    r = jsGame.canvas.screen.getHeight(),
                    i = (n - 200) / 2,
                    s = r - 40;
                e = parseInt(a.image.reCountLoaded) > e ? parseInt(a.image.reCountLoaded) : e;
                e = e > t ? t : e;
                jsGame.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 0, n, r).strokeRect(i, s, 200, 5).fillStyle("#FFFFFF").fillRect(i + 1, s + 1, e / t * 198, 3);
                if (a.image.loadedImg) {
                    n = (n - 130) / 2;
                    r = (r - 100) / 2;
                    jsGame.canvas.drawImage(a.image.loadImgId, 45, 21, 79, 13, n + 51, r + 15, 79, 13).drawImage(a.image.loadImgId, 0, 46, 107, 12, n + 12, r + 70, 107, 12);
                    for (i = 0; i < a.image.loadFrame.length; i++) {
                        jsGame.canvas.drawImage(a.image.loadImgId, 47 + a.image.loadFrame[i].frames[a.image.loadFrame[i].step++] * 7, 3, 7, 7, n + a.image.loadFrame[i].x, r + a.image.loadFrame[i].y, 7, 7);
                        a.image.loadFrame[i].step %= a.image.loadFrame[i].frames.length
                    }
                } else jsGame.canvas.drawString("������", 0, parseInt(r / 2), jsGame.graphics.VCENTER, true, "#FFFFFF", "#000000");
                if (a.image.tipSkip == 2 * parseInt(1e3 / a.system.timeout)) {
                    a.image.tipSkip = 0;
                    a.image.tipIndex++;
                    a.image.tipIndex %= a.image.tips.length;
                    a.image.tip = a.image.tips[a.image.tipIndex];
                    jsGame.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 230, jsGame.canvas.screen.getWidth(), 35)
                }
                jsGame.canvas.drawString(a.image.tip, 0, jsGame.canvas.screen.getHeight() - 65, jsGame.graphics.VCENTER, true, "#FFFFFF", "#000000");
                a.image.tipSkip++
            },
            initImageCallBack: null,
            loadImageCallBack: null,
            getAnchor: function(e, t, n, r, i) {
                switch (i) {
                    case g.canvas.graphics.ANCHOR_HV:
                        e -= parseInt(n / 2);
                        t -= parseInt(r / 2);
                        break;
                    case g.canvas.graphics.ANCHOR_LV:
                        t -= parseInt(r / 2);
                        break;
                    case g.canvas.graphics.ANCHOR_RV:
                        e -= n;
                        t -= parseInt(r / 2);
                        break;
                    case g.canvas.graphics.ANCHOR_HT:
                        e -= parseInt(n / 2);
                        break;
                    case g.canvas.graphics.ANCHOR_RT:
                        e -= n;
                        break;
                    case g.canvas.graphics.ANCHOR_HB:
                        e -= parseInt(n / 2);
                        t -= r;
                        break;
                    case g.canvas.graphics.ANCHOR_LB:
                        t -= r;
                        break;
                    case g.canvas.graphics.ANCHOR_RB:
                        e -= n;
                        t -= r
                }
                return {
                    x: e,
                    y: t
                }
            },
            initUrlParams: function(e) {
                if (e.indexOf("?") >= 0) {
                    var t = e.split("?");
                    e = [];
                    if (t[1].indexOf("&") >= 0) e = t[1].split("&");
                    else e.push(t[1]);
                    t = [];
                    for (var n = 0; n < e.length; n++) if (e[n].indexOf("=") >= 0) {
                        t = e[n].split("=");
                        a.request.gets[t[0]] = t[1]
                    }
                }
            }
        };
    jsGame = {
        init: function(e, t) {
            if (!e && !t) {
                this.version = 1.6;
                this.request.init();
                this.events.init();
                this.canvas.initDevice()
            } else {
                a.canvas.defaultWidth = e;
                a.canvas.defaultHeight = t
            }
            return this
        },
        extend: function(e, t) {
            var n = function() {};
            n.prototype = t.prototype;
            e.prototype = new n;
            e.prototype.constructor = e;
            n = null;
            return e
        },
        error: function(e) {
            throw Error(e)
        },
        ajax: function(e) {
            e && a.ajax.pool.length < a.ajax.poolLength && a.ajax.pool.push(e);
            if (e && e.clear) a.ajax.pool = [];
            if (a.ajax.xhrObj == null && a.ajax.pool.length > 0) {
                a.ajax.xhrObj = this.objExtend(a.ajax.param, a.ajax.pool.shift() || {});
                a.ajax.xhrObj.type = a.ajax.xhrObj.type.toUpperCase();
                a.ajax.xhrObj.dataType = a.ajax.xhrObj.dataType.toUpperCase();
                a.ajax.xhrObj.xhr = jsGame.classes.getAjax();
                a.ajax.isTimeout = false;
                a.ajax.xhrObj.xhr.onreadystatechange = function() {
                    if (a.ajax.isTimeout) return false;
                    if (a.ajax.xhrObj && a.ajax.xhrObj.xhr.readyState == 4) {
                        if (a.ajax.xhrObj.xhr.status == 200) {
                            var e;
                            switch (a.ajax.xhrObj.dataType) {
                                default:
                                    e = a.ajax.xhrObj.xhr.responseText;
                                    break;
                                case "JSON":
                                    e = jsGame.getJson(a.ajax.xhrObj.xhr.responseText)
                            }
                            a.ajax.xhrObj.success(e);
                            a.ajax.xhrObj.complete()
                        } else a.ajax.xhrObj.error(a.ajax.xhrObj.xhr, "" + ("[error: " + a.ajax.xhrObj.xhr.status + "]"), a.ajax.xhrObj.xhr.status);
                        a.ajax.xhrObj = null;
                        jsGame.ajax()
                    }
                };
                a.ajax.xhrObj.xhr.open(a.ajax.xhrObj.type, a.ajax.xhrObj.url, true);
                a.ajax.xhrObj.before(a.ajax.xhrObj.xhr);
                a.ajax.xhrObj.type == "POST" && a.ajax.xhrObj.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                a.ajax.xhrObj.xhr.send(a.ajax.xhrObj.data);
                setTimeout(function() {
                    jsGame.ajax({
                        clear: true
                    });
                    a.ajax.isTimeout = true;
                    if (a.ajax.xhrObj) {
                        a.ajax.xhrObj.error(null, "timeout", null);
                        a.ajax.xhrObj = null
                    }
                }, a.ajax.xhrObj.timeout)
            }
        },
        getDom: function(e) {
            try {
                return document.getElementById(e)
            } catch (t) {
                return document.all[e]
            }
        },
        objExtend: function() {
            var e = this.clone(arguments[0]) || {},
                t = 1,
                n = arguments.length,
                r = false,
                i;
            if (typeof e === "boolean") {
                r = e;
                e = arguments[1] || {};
                t = 2
            }
            if (typeof e !== "object") e = {};
            if (n == t) {
                e = this;
                --t
            }
            for (; t < n; t++) if ((i = arguments[t]) != null) for (var s in i) {
                var o = e[s],
                    u = i[s];
                if (e !== u) if (r && u && typeof u === "object" && !u.nodeType) e[s] = this.objExtend(r, o || (u.length != null ? [] : {}), u);
                else if (u !== undefined) e[s] = u
            }
            return e
        },
        getJson: function(b) {
            try {
                return eval("(" + b + ")")
            } catch (c) {
                return {}
            }
        },
        clone: function(e) {
            var t;
            e = e || [];
            if (typeof e == "object") if (e.length) {
                t = [];
                for (var n = 0; n < e.length; n++) if (e[n].length && e[n].length > 0) {
                    t[n] = [];
                    for (var r = 0; r < e[n].length; r++) t[n][r] = e[n][r]
                } else t[n] = e[n]
            } else {
                t = {};
                for (n in e) t[n] = e[n]
            }
            return t
        },
        classes: {
            init: function(e) {
                e.classes.timer.prototype.stop = function() {
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        this.timeout = null
                    }
                };
                e.classes.timer.prototype.start = function(e) {
                    if (e) {
                        this.time = this._initTime;
                        this._dateTime = new Date
                    }
                    this.stop();
                    this.timeout = setTimeout(function(e) {
                        var t = new Date,
                            n = parseInt((t - e._dateTime) / e.millisec);
                        e._dateTime = t;
                        e.time -= n;
                        e.callBack ? e.callBack(e) : e.stop();
                        if (e.time >= 0) e.start();
                        else {
                            e.stop();
                            e.time = 0
                        }
                    }, this.millisec, this)
                };
                e.classes.webSocket.prototype.send = function(e) {
                    this.socket.send(e)
                };
                e.classes.webSocket.prototype.close = function() {
                    this.socket.close()
                }
            },
            getAjax: function() {
                return new XMLHttpRequest
            },
            observer: function() {
                this.group = [];
                this.register = function(e) {
                    if (e == null) return this;
                    jsGame.commandFuns.inArray(e, this.group) == -1 && this.group.push(e);
                    return this
                };
                this.unregister = function(e) {
                    if (e == null) return this;
                    e = jsGame.commandFuns.inArray(e, this.group);
                    e > -1 && this.group.splice(e, 1);
                    return this
                };
                this.notify = function(e) {
                    for (var t = 0; t < this.group.length; t++) if (this.group[t] != null) this.group[t](e);
                    return this
                };
                this.clear = function() {
                    this.group.length > 0 && this.group.splice(0, this.group.length);
                    return this
                }
            },
            getImage: function() {
                return new Image
            },
            timer: function(e, t, n, r, i) {
                this.id = e;
                this._initTime = t;
                this._dateTime = new Date;
                this.time = this._initTime;
                this.callBack = n;
                this.millisec = r || 1e3;
                this.data = i;
                this.timeout = null
            },
            webSocket: function(e, t, n, r, i) {
                this.ipPort = e || "";
                this.socket = new WebSocket(this.ipPort);
                this.socket.onopen = t;
                this.socket.onmessage = n;
                this.socket.onclose = r;
                this.socket.onerror = i
            }
        },
        commandFuns: function() {
            var e = {
                arr: [],
                len: 0,
                v: 0
            };
            return {
                registerNotify: function(e, t) {
                    e != null && e.register(t)
                },
                rangeRegisterNotify: function(e, t) {
                    for (var n = 0; n < t.length; n++) jsGame.commandFuns.registerNotify(e, t[n])
                },
                unRegisterNotify: function(e, t) {
                    e != null && e.unregister(t)
                },
                rangeUnRegisterNotify: function(e, t) {
                    for (var n = 0; n < t.length; n++) jsGame.commandFuns.unRegisterNotify(e, t[n])
                },
                getRandom: function(e, t) {
                    if (t) return Math.round(Math.random() * (t - e) + e);
                    else {
                        var n = e;
                        if (!n || n < 0) n = 0;
                        return Math.round(Math.random() * n)
                    }
                },
                getArray: function(t, n) {
                    e.arr = [];
                    e.len = t.toString().length;
                    e.v = t;
                    for (var r = 0; r < e.len; r++) {
                        e.arr.push(e.v % 10);
                        e.v = parseInt(e.v / 10)
                    }
                    n || e.arr.reverse();
                    return e.arr
                },
                inArray: function(e, t) {
                    var n, r = t.length;
                    for (n = 0; n < r; n++) if (e == t[n]) return n;
                    return -1
                },
                collisionCheck: function(e, t, n, r, i, s, o, u) {
                    if (o && Math.abs(e + parseInt(n / 2) - (i + parseInt(o / 2))) < parseInt((n + o) / 2) && Math.abs(t + parseInt(r / 2) - (s + parseInt(u / 2))) < parseInt((r + u) / 2)) return true;
                    return false
                },
                circleCollisionCheck: function(e, t, n, r, i, s) {
                    e = Math.abs(e - r);
                    t = Math.abs(t - i);
                    if (Math.sqrt(e * e + t * t) < n + s) return true;
                    return false
                }
            }
        }(),
        args: {
            ajax: {
                type: "get",
                data: null,
                dataType: "html",
                url: "",
                before: function() {},
                success: function() {},
                error: function(e, t, n) {
                    this.error(t + "[" + n + "]")
                },
                complete: function() {}
            },
            setError: function(e, t, n) {
                a.error[e] = {
                    msg: t,
                    callBack: n
                };
                return jsGame
            },
            getError: function(e) {
                if (a.error[e]) return a.error[e];
                return {
                    msg: "",
                    callBack: function() {}
                }
            },
            setAjax: function(e, t) {
                if (a.ajax[e]) a.ajax[e] = t;
                return jsGame
            },
            xhr: null,
            gc: {
                collectWaitTime: 1e3
            }
        },
        localStorage: function() {
            var e, t;
            return {
                init: function() {
                    e = this;
                    if (!t) {
                        var n;
                        try {
                            n = window.localStorage
                        } catch (r) {}
                        t = n
                    }
                    return e
                },
                setItem: function(n, r) {
                    t.setItem(n, r);
                    return e
                },
                getItem: function(e) {
                    return t.getItem(e)
                },
                removeItem: function(n) {
                    t.removeItem(n);
                    return e
                },
                clear: function() {
                    t.clear();
                    return e
                },
                key: function(e) {
                    return t.key(e)
                },
                getLength: function() {
                    return t.length
                },
                base: function() {
                    return jsGame
                }
            }
        }(),
        sessionStorage: function() {
            var e, t;
            return {
                init: function() {
                    e = this;
                    if (!t) {
                        var n;
                        try {
                            n = window.sessionStorage
                        } catch (r) {}
                        t = n
                    }
                    return e
                },
                setItem: function(n, r) {
                    t.setItem(n, r);
                    return e
                },
                getItem: function(e) {
                    return t.getItem(e)
                },
                removeItem: function(n) {
                    t.removeItem(n);
                    return e
                },
                clear: function() {
                    t.clear();
                    return e
                },
                key: function(e) {
                    return t.key(e)
                },
                getLength: function() {
                    return t.length
                },
                base: function() {
                    return jsGame
                }
            }
        }(),
        pageLoad: function(e) {
            if (a.system.pageLoad == null) {
                a.system.pageLoad = e;
                this.localStorage.init();
                this.sessionStorage.init();
                this.canvas.init();
                this.audio.init();
                this.gameFlow.init();
                this.classes.init(this);
                this.graphics.ANCHOR_LT = g.canvas.graphics.ANCHOR_LT;
                this.graphics.ANCHOR_LV = g.canvas.graphics.ANCHOR_LV;
                this.graphics.ANCHOR_LB = g.canvas.graphics.ANCHOR_LB;
                this.graphics.ANCHOR_HT = g.canvas.graphics.ANCHOR_HT;
                this.graphics.ANCHOR_HV = g.canvas.graphics.ANCHOR_HV;
                this.graphics.ANCHOR_HB = g.canvas.graphics.ANCHOR_HB;
                this.graphics.ANCHOR_RT = g.canvas.graphics.ANCHOR_RT;
                this.graphics.ANCHOR_RV = g.canvas.graphics.ANCHOR_RV;
                this.graphics.ANCHOR_RB = g.canvas.graphics.ANCHOR_RB;
                e = jsGame.getDom(a.canvas.defaultId);
                if (jsGame.canvas.screen.getTouch()) {
                    window.addEventListener("orientationchange", o.orientationchange, false);
                    e.ontouchstart = o.touchstart;
                    e.ontouchend = o.touchend;
                    e.ontouchmove = o.touchmove;
                    e.ontouchcancel = o.touchcancel
                } else {
                    document.onkeydown = o.keydown;
                    document.onkeyup = o.keyup;
                    if (jsGame.canvas.screen.getDevice() != "j2me" && jsGame.canvas.screen.getDevice().indexOf("symbian") == -1) {
                        e.onclick = o.click;
                        e.onmousedown = o.mouseDown;
                        e.onmouseup = o.mouseUp;
                        e.onmousemove = o.mouseMove;
                        if (a.canvas.device == "iemobile") try {
                            window.external.notify("RM," + a.canvas.id + ",0,0," + jsGame.canvas.screen.getWidth() + "," + jsGame.canvas.screen.getHeight() + ",0")
                        } catch (t) {}
                    }
                }
                e = null;
                if (o.initImageCallBack == null) o.initImageCallBack = o.loadImages;
                this.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 0, jsGame.canvas.screen.getWidth(), jsGame.canvas.screen.getHeight());
                a.system.gameFlow = g.system.gameFlowType.run;
                a.image.tipIndex = jsGame.commandFuns.getRandom(a.image.tips.length - 1);
                a.image.tip = a.image.tips[a.image.tipIndex];
                if (a.system.loadRes == null) {
                    a.system.loadRes = function() {
                        o.initImageCallBack(a.image.countLoaded, a.image.imgObjs.length - 1);
                        if (a.image.countLoaded == a.image.imgObjs.length) {
                            a.system.pageLoad(jsGame);
                            a.image.loadFrame = [];
                            a.image.imgObjs = [];
                            a.image.countLoaded = 0;
                            a.image.reCountLoaded = 0;
                            a.image.tipSkip = 0
                        } else setTimeout(a.system.loadRes, a.system.timeout)
                    };
                    a.system.loadRes()
                }
            }
        },
        menu: function(e) {
            if (a.system.menu == null && typeof e == "function") {
                a.system.gameFlow = g.system.gameFlowType.menu;
                a.system.menu = e
            }
            return this
        },
        run: function(e) {
            if (a.system.run == null) {
                if (a.system.runFn == null) a.system.runFn = e;
                a.system.run = function() {
                    var e = new Date;
                    switch (a.system.gameFlow) {
                        case g.system.gameFlowType.menu:
                            a.system.menu();
                            break;
                        case g.system.gameFlowType.run:
                            a.system.runFn();
                            break;
                        case g.system.gameFlowType.stop:
                            a.system.stop();
                            break;
                        case g.system.gameFlowType.over:
                            a.system.over();
                            break;
                        case g.system.gameFlowType.zone:
                            a.system.zone(a.system.zoneArgs);
                            break;
                        case g.system.gameFlowType.active:
                            a.system.active(a.system.activeArgs);
                            break;
                        case g.system.gameFlowType.loadImage:
                            if (o.loadImageCallBack != null) {
                                o.loadImageCallBack(a.image.countLoaded, a.image.imgCount - 1);
                                if (a.image.imgObjs.length > 0) {
                                    var t = a.image.imgObjs.shift();
                                    if (a.image.imgs[t.id]) a.image.countLoaded++;
                                    else {
                                        a.image.imgs[t.id] = jsGame.classes.getImage();
                                        a.image.imgs[t.id].onload = function() {
                                            a.image.countLoaded++
                                        };
                                        a.image.imgs[t.id].src = t.src;
                                        a.image.imgs[t.id].id = t.id
                                    }
                                    t = null
                                }
                            }
                    }
                    a.system.spendTime = new Date - e;
                    e = null;
                    a.system.isPause || jsGame.play()
                };
                a.system.run()
            }
            return this
        },
        stop: function(e) {
            if (a.system.stop == null && typeof e == "function") a.system.stop = e;
            return this
        },
        over: function(e) {
            if (a.system.over == null && typeof e == "function") a.system.over = e;
            return this
        },
        zone: function(e) {
            if (a.system.zone == null && typeof e == "function") a.system.zone = e;
            return this
        },
        active: function(e) {
            if (a.system.active == null && typeof e == "function") a.system.active = e;
            return this
        },
        play: function() {
            a.system.isPause = false;
            setTimeout(a.system.run, a.system.timeout - a.system.spendTime < 0 ? 0 : (a.system.timeout - a.system.spendTime) * this.canvas.screen.getFps());
            return this
        },
        pause: function() {
            a.system.isPause = true;
            return this
        },
        gameFlow: function() {
            var e;
            return {
                init: function() {
                    return e = this
                },
                menu: function() {
                    if (a.system.menu != null) a.system.gameFlow = g.system.gameFlowType.menu;
                    return e
                },
                run: function() {
                    if (a.system.run != null) a.system.gameFlow = g.system.gameFlowType.run;
                    return e
                },
                stop: function() {
                    if (a.system.stop != null) a.system.gameFlow = g.system.gameFlowType.stop;
                    return e
                },
                over: function() {
                    if (a.system.over != null) a.system.gameFlow = g.system.gameFlowType.over;
                    return e
                },
                zone: function(t) {
                    if (a.system.zone != null) {
                        a.system.gameFlow = g.system.gameFlowType.zone;
                        a.system.zoneArgs = t
                    }
                    return e
                },
                active: function(t) {
                    if (a.system.active != null) {
                        a.system.gameFlow = g.system.gameFlowType.active;
                        a.system.activeArgs = t
                    }
                    return e
                },
                base: function() {
                    return jsGame
                }
            }
        }(),
        keyIsPressed: function(e) {
            if (!a.event.keyDownGo) a.event.keyDownGo = true;
            return a.event.keys[e]
        },
        keyPressed: function(e) {
            if (e) {
                if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
                var t = a.event.pressedKey[e];
                a.event.pressedKey[e] = false;
                return t
            } else {
                if (this.keyPressed("up")) return true;
                else if (this.keyPressed("down")) return true;
                else if (this.keyPressed("left")) return true;
                else if (this.keyPressed("right")) return true;
                else if (this.keyPressed("a")) return true;
                else if (this.keyPressed("b")) return true;
                else if (this.keyPressed("c")) return true;
                else if (this.keyPressed("menu")) return true;
                else if (this.keyPressed("quit")) return true;
                return false
            }
        },
        keyIsUnPressed: function(e) {
            if (!a.event.keyUpGo) a.event.keyUpGo = true;
            var t = a.event.lastKey[e];
            a.event.lastKey[e] = false;
            return t
        },
        keyReleased: function(e) {
            if (e) return this.keyIsUnPressed(e);
            else {
                if (this.keyReleased("up")) return true;
                else if (this.keyReleased("down")) return true;
                else if (this.keyReleased("left")) return true;
                else if (this.keyReleased("right")) return true;
                else if (this.keyReleased("a")) return true;
                else if (this.keyReleased("b")) return true;
                else if (this.keyReleased("c")) return true;
                else if (this.keyReleased("menu")) return true;
                else if (this.keyReleased("quit")) return true;
                return false
            }
        },
        keyRepeated: function(e) {
            if (e) return this.keyIsPressed(e);
            else {
                if (this.keyRepeated("up")) return true;
                else if (this.keyRepeated("down")) return true;
                else if (this.keyRepeated("left")) return true;
                else if (this.keyRepeated("right")) return true;
                else if (this.keyRepeated("a")) return true;
                else if (this.keyRepeated("b")) return true;
                else if (this.keyRepeated("c")) return true;
                else if (this.keyRepeated("menu")) return true;
                else if (this.keyRepeated("quit")) return true;
                return false
            }
        },
        canvas: function() {
            var e, t, n, r, i, s, u, f, l, c, h;
            return {
                init: function() {
                    e = this;
                    n = {
                        x: 0,
                        y: 0
                    };
                    r = {
                        fillColor: "#000000",
                        strokeColor: "#000000"
                    };
                    i = {
                        x: 0,
                        y: 0
                    };
                    s = {
                        x: 0,
                        y: 0
                    };
                    u = {
                        x: 0,
                        y: 0,
                        fillStyle: "#FFFFFF",
                        strokeStyle: "#CCCCCC"
                    };
                    return e.pass()
                },
                initDevice: function() {
                    l = o.getDeviceConfig();
                    a.canvas.device = l.device;
                    a.canvas.fps = l.fps;
                    a.canvas.touch = l.touch;
                    a.canvas.zoom = l.zoom;
                    return e
                },
                pass: function(n, r, i) {
                    var s;
                    s = !n || n == "" ? a.canvas.defaultId : n;
                    if (!a.canvas.ctxs[s]) {
                        n = n ? document.createElement("canvas") : e.base().getDom(s);
                        a.canvas.ctxs[s] = null;
                        delete a.canvas.ctxs[s];
                        a.canvas.ctxs[s] = n.getContext("2d");
                        n.width = r ? r : a.canvas.defaultWidth;
                        n.style.width = parseInt(n.width * a.canvas.zoom) + "px";
                        n.height = i ? i : a.canvas.defaultHeight;
                        n.style.height = parseInt(n.height * a.canvas.zoom) + "px";
                        a.canvas.cavansDoms[s] = null;
                        delete a.canvas.cavansDoms[s];
                        a.canvas.cavansDoms[s] = n
                    }
                    t = a.canvas.ctxs[s];
                    t.font = a.canvas.defaultFont;
                    f = a.canvas.cavansDoms[s];
                    c = parseInt(f.width);
                    h = parseInt(f.height);
                    return e.screen.setId(s)
                },
                font: function(n) {
                    a.canvas.defaultFont = n;
                    t.font = a.canvas.defaultFont;
                    return e
                },
                del: function(t) {
                    if (a.canvas.ctxs[t]) {
                        a.canvas.ctxs[t] = null;
                        delete a.canvas.ctxs[t];
                        a.canvas.cavansDoms[t] = null;
                        delete a.canvas.cavansDoms[t]
                    }
                    return e
                },
                setCurrent: function(t) {
                    return e.pass(t)
                },
                screen: {
                    setId: function(t) {
                        if (a.canvas.ctxs[t]) a.canvas.id = t;
                        return e
                    },
                    getId: function() {
                        return a.canvas.id
                    },
                    getWidth: function() {
                        return c
                    },
                    setWidth: function(t) {
                        a.canvas.defaultWidth = t;
                        if (f) {
                            f.width = a.canvas.defaultWidth;
                            f.style.width = f.width + "px";
                            c = parseInt(f.width)
                        }
                        return e
                    },
                    getHeight: function() {
                        return h
                    },
                    setHeight: function(t) {
                        a.canvas.defaultHeight = t;
                        if (f) {
                            f.height = a.canvas.defaultHeight;
                            f.style.height = f.height + "px";
                            h = parseInt(f.height)
                        }
                        return e
                    },
                    getDevice: function() {
                        return a.canvas.device
                    },
                    getFps: function() {
                        return a.canvas.fps
                    },
                    setFps: function(t) {
                        if (t > 0) a.canvas.fps = t;
                        return e
                    },
                    getTouch: function() {
                        return a.canvas.touch
                    },
                    getZoom: function() {
                        return a.canvas.zoom
                    }
                },
                fillStyle: function(n) {
                    t.fillStyle = n;
                    return e
                },
                fillRect: function(n, r, i, u, a) {
                    i = i ? i : 0;
                    u = u ? u : 0;
                    if (a) s = o.getAnchor(n, r, i, u, a);
                    else {
                        s.x = n;
                        s.y = r
                    }
                    t.fillRect(s.x, s.y, i, u);
                    return e
                },
                fillText: function(n, r, i, s) {
                    t.font = s || a.canvas.defaultFont;
                    t.fillText(n, r, i);
                    return e
                },
                clearRect: function(n, r, i, s) {
                    t.clearRect(n, r, i, s);
                    return e
                },
                clearScreen: function() {
                    return e.clearRect(0, 0, c, h)
                },
                fillScreen: function() {
                    return e.fillRect(0, 0, c, h)
                },
                strokeStyle: function(n) {
                    t.strokeStyle = n;
                    return e
                },
                lineWidth: function(n) {
                    t.lineWidth = n || 1;
                    return e
                },
                strokeRect: function(n, r, s, u, a) {
                    if (a) i = o.getAnchor(n, r, s, u, a);
                    else {
                        i.x = n;
                        i.y = r
                    }
                    t.strokeRect(i.x, i.y, s, u);
                    return e
                },
                strokeText: function(n, r, i, s) {
                    t.font = s || a.canvas.defaultFont;
                    t.strokeText(n, r, i);
                    return e
                },
                setColor: function(t, n, i) {
                    if (i == null) {
                        r.fillColor = t;
                        r.strokeColor = n ? n : t
                    } else {
                        r.fillColor = "rgb(" + t + ", " + n + ", " + i + ")";
                        r.strokeColor = r.fillColor
                    }
                    return e.fillStyle(r.fillColor).strokeStyle(r.strokeColor)
                },
                drawImage: function(r, i, s, u, a, f, l, c, h, p) {
                    if (u) if (a) if (p) {
                        n = o.getAnchor(f, l, c, h, p);
                        t.drawImage(jsGame.getImage(r), i, s, u, a, n.x, n.y, c, h)
                    } else t.drawImage(jsGame.getImage(r), i, s, u, a, f, l, c, h);
                    else {
                        n = o.getAnchor(i, s, jsGame.getImage(r).width, jsGame.getImage(r).height, u);
                        t.drawImage(jsGame.getImage(r), n.x, n.y)
                    } else t.drawImage(jsGame.getImage(r), i, s);
                    return e
                },
                drawRotate: function(n, r, i, s, o, u, f, l, c, h) {
                    var p = parseInt(l >> 1),
                        d = parseInt(c >> 1),
                        v = jsGame.getImage(n);
                    n = v ? v : a.canvas.cavansDoms[n];
                    u -= p;
                    f -= d;
                    t.save();
                    t.translate(u + p, f + d);
                    t.rotate(h * Math.PI / 180);
                    t.translate(-(u + p), -(f + d));
                    t.drawImage(n, r, i, s, o, u, f, l, c);
                    t.restore();
                    return e
                },
                drawCache: function(r, i, s, u, f, l, c, h, p, v) {
                    if (r = a.canvas.cavansDoms[r]) if (u) if (f) if (v) {
                        n = o.getAnchor(l, c, h, p, v);
                        t.drawImage(r, i, s, u, f, n.x, n.y, h, p)
                    } else t.drawImage(r, i, s, u, f, l, c, h, p);
                    else {
                        n = o.getAnchor(i, s, r.width, r.height, u);
                        t.drawImage(r, n.x, n.y)
                    } else t.drawImage(r, i, s);
                    return e
                },
                drawRegion: function(n, r, i, s, o, u, a, f) {
                    switch (u) {
                        default:
                            t.setTransform(1, 0, 0, 1, a, f);
                            break;
                        case g.canvas.trans.TRANS_ROT90:
                            t.setTransform(0, 1, -1, 0, o + a, f);
                            break;
                        case g.canvas.trans.TRANS_ROT180:
                            t.setTransform(-1, 0, 0, -1, s + a, o + f);
                            break;
                        case g.canvas.trans.TRANS_ROT270:
                            t.setTransform(0, -1, 1, 0, a, s + f);
                            break;
                        case g.canvas.trans.TRANS_MIRROR:
                            t.setTransform(-1, 0, 0, 1, s + a, f);
                            break;
                        case g.canvas.trans.TRANS_MIRROR_ROT90:
                            t.setTransform(0, -1, -1, 0, o + a, s + f);
                            break;
                        case g.canvas.trans.TRANS_MIRROR_ROT180:
                            t.setTransform(1, 0, 0, -1, a, o + f);
                            break;
                        case g.canvas.trans.TRANS_MIRROR_ROT270:
                            t.setTransform(0, 1, 1, 0, a, f)
                    }(jsGame.getImage(n) ? e.drawImage : e.drawCache)(n, r, i, s, o, 0, 0, s, o);
                    t.setTransform(1, 0, 0, 1, 0, 0);
                    return e
                },
                drawNumber: function(t, n, r, i, s, o, u, a, f) {
                    t = t.toString();
                    var l = t.length;
                    a = a ? a : r;
                    f = f ? f : i;
                    if (u) for (u = 0; u < l; u++) e.drawImage(n, parseInt(t.charAt(u)) * r, 0, r, i, s + u * a, o, a, f);
                    else for (u = l - 1; u >= 0; u--) e.drawImage(n, parseInt(t.charAt(u)) * r, 0, r, i, s - (l - 1 - u) * a, o, a, f, jsGame.graphics.ANCHOR_RT);
                    return e
                },
                moveTo: function(n, r) {
                    t.moveTo(n, r);
                    return e
                },
                lineTo: function(n, r) {
                    t.lineTo(n, r);
                    return e
                },
                stroke: function() {
                    t.stroke();
                    return e
                },
                fill: function() {
                    t.fill();
                    return e
                },
                beginPath: function() {
                    t.beginPath();
                    return e
                },
                closePath: function() {
                    t.closePath();
                    return e
                },
                arc: function(n, r, i, s, o, u) {
                    t.arc(n, r, i, s, o, u);
                    return e
                },
                quadraticCurveTo: function(n, r, i, s) {
                    t.quadraticCurveTo(n, r, i, s);
                    return e
                },
                bezierCurveTo: function(n, r, i, s, o, u) {
                    t.bezierCurveTo(n, r, i, s, o, u);
                    return e
                },
                measureText: function(n) {
                    var r = t.measureText(n),
                        i = r.width;
                    r = r.height ? r.height : parseInt(t.font);
                    return {
                        width: e.screen.getDevice() == "j2me" ? t.measureText(n) : i,
                        height: r
                    }
                },
                translate: function(n, r) {
                    t.translate(n, r);
                    return e
                },
                drawLine: function(t, n, r, i) {
                    return e.beginPath().moveTo(t, n).lineTo(r, i).closePath().stroke()
                },
                drawRect: function(t, n, r, i, s) {
                    return e.strokeRect(t, n, r, i, s)
                },
                drawString: function(n, r, i, s, o, f, l, c) {
                    u.x = r;
                    u.y = i;
                    t.font = c || a.canvas.defaultFont;
                    if (s) switch (s) {
                        case g.canvas.graphics.LEFT:
                            u.x = 0;
                            break;
                        case g.canvas.graphics.VCENTER:
                            u.x = parseInt(e.screen.getWidth() - e.measureText(n).width >> 1);
                            break;
                        case g.canvas.graphics.RIGHT:
                            u.x = e.screen.getWidth() - e.measureText(n).width
                    }
                    if (o) {
                        u.fillStyle = f ? f : "#000000";
                        u.strokeStyle = l ? l : "#CCCCCC";
                        e.fillStyle(u.strokeStyle).fillText(n, u.x + 1, u.y + 1, c).fillStyle(u.fillStyle)
                    }
                    return e.fillText(n, u.x, u.y, c).fillStyle(a.canvas.defaultColor)
                },
                drawSubstring: function(t, n, r, i, s, o, u, a, f, l) {
                    return e.drawString(t.substring(n, n + r), i, s, o, u, a, f, l)
                },
                clip: function() {
                    t.clip();
                    return e
                },
                save: function() {
                    t.save();
                    return e
                },
                restore: function() {
                    t.restore();
                    return e
                },
                rect: function(n, r, i, s) {
                    t.rect(n, r, i, s);
                    return e
                },
                rotate: function(n) {
                    t.rotate(n);
                    return e
                },
                setTransform: function(n, r, i, s, o, u) {
                    t.setTransform(n, r, i, s, o, u);
                    return e
                },
                scale: function(n, r) {
                    t.scale(n, r);
                    return e
                },
                globalAlpha: function(n) {
                    t.globalAlpha = n || 1;
                    return e
                },
                getContext: function() {
                    return t
                },
                base: function() {
                    return jsGame
                }
            }
        }(),
        initImage: function(e) {
            a.image.imgs = [];
            a.image.imgs[a.image.loadImgId] = jsGame.classes.getImage();
            a.image.imgs[a.image.loadImgId].id = a.image.loadImgId;
            a.image.imgs[a.image.loadImgId].src = "2000.png";
            if (e.length > 0) {
                jsGame.pushImage(e);
                for (e = 0; e < a.image.imgObjs.length; e++) if (a.image.imgObjs[e].id != a.image.loadImgId) {
                    a.image.imgs[a.image.imgObjs[e].id] = jsGame.classes.getImage();
                    a.image.imgs[a.image.imgObjs[e].id].onload = function() {
                        a.image.countLoaded++
                    };
                    a.image.imgs[a.image.imgObjs[e].id].onerror = function() {
                        var e = jsGame.args.getError("img");
                        a.image.tips = [e.msg];
                        e.callBack()
                    };
                    a.image.imgs[a.image.imgObjs[e].id].src = a.image.imgObjs[e].src;
                    a.image.imgs[a.image.imgObjs[e].id].id = a.image.imgObjs[e].id;
                    a.image.imgs[a.image.imgObjs[e].id].url = a.image.imgObjs[e].src
                } else {
                    a.image.countLoaded++;
                    if (a.image.imgs[a.image.loadImgId].src != a.image.imgObjs[e].src) {
                        a.image.imgs[a.image.loadImgId].src = a.image.imgObjs[e].src;
                        a.image.imgs[a.image.loadImgId].url = a.image.imgObjs[e].src
                    }
                }
            }
            a.image.imgs[a.image.loadImgId].onload = function() {
                a.image.loadedImg = true;
                a.image.loadFrame = [{
                    x: 14,
                    y: 0,
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    step: 0
                }, {
                    x: 23,
                    y: 1,
                    frames: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    step: 0
                }, {
                    x: 31,
                    y: 6,
                    frames: [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    step: 0
                }, {
                    x: 35,
                    y: 15,
                    frames: [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
                    step: 0
                }, {
                    x: 34,
                    y: 24,
                    frames: [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
                    step: 0
                }, {
                    x: 28,
                    y: 32,
                    frames: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
                    step: 0
                }, {
                    x: 20,
                    y: 35,
                    frames: [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
                    step: 0
                }, {
                    x: 11,
                    y: 34,
                    frames: [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
                    step: 0
                }, {
                    x: 3,
                    y: 29,
                    frames: [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
                    step: 0
                }, {
                    x: 0,
                    y: 21,
                    frames: [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
                    step: 0
                }, {
                    x: 1,
                    y: 12,
                    frames: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
                    step: 0
                }, {
                    x: 6,
                    y: 4,
                    frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
                    step: 0
                }]
            };
            return this
        },
        loadImage: function(e) {
            if (a.system.gameFlow != g.system.gameFlowType.loadImage && e.length > 0) {
                a.system.gameFlow = g.system.gameFlowType.loadImage;
                a.image.imgObjs = e;
                a.image.imgCount = a.image.imgObjs.length;
                a.image.countLoaded = 0
            }
        },
        pushImage: function(e) {
            for (var t = 0; t < e.length; t++) a.image.imgObjs.push(e[t]);
            return this
        },
        initImageCallBack: function(e) {
            if (typeof e == "function") o.initImageCallBack = e;
            return this
        },
        loadImageCallBack: function(e) {
            if (typeof e == "function") o.loadImageCallBack = e;
            return this
        },
        getImage: function(e) {
            if (a.image.imgs[e]) return a.image.imgs[e]
        },
        delImage: function(e) {
            if (a.image.imgs[e]) {
                a.image.imgs[e] = null;
                delete a.image.imgs[e]
            }
            return this
        },
        audio: function() {
            var e = null;
            return {
                init: function() {
                    return e = this
                },
                play: function(t) {
                    if (a.audio.audios[t]) try {
                        a.audio.audios[t].paused && a.audio.audios[t].play()
                    } catch (n) {}
                    return e
                },
                pause: function(t) {
                    if (a.audio.audios[t]) try {
                        a.audio.audios[t].pause()
                    } catch (n) {}
                    return e
                },
                noSound: function() {
                    for (var t in a.audio.audios) a.audio.audios[t].pause();
                    return e
                },
                load: function(t) {
                    if (a.audio.audios[t]) try {
                        a.audio.audios[t].load()
                    } catch (n) {}
                    return e
                },
                replay: function(t) {
                    e.pause(t);
                    e.load(t);
                    e.play(t);
                    return e
                },
                fuckAudio: function(t) {
                    if (a.audio.audios[t] && a.audio.audios[t].paused) {
                        a.audio.fuckSkip++;
                        if (a.audio.fuckSkip == 10) {
                            e.replay(t);
                            a.audio.fuckSkip = 0
                        }
                    }
                    return e
                },
                getAudio: function(e) {
                    return a.audio.audios[e]
                }
            }
        }(),
        initAudio: function(e) {
            if (e.length > 0) {
                a.audio.audios = [];
                for (var t, n, r, i, s = 0; s < e.length; s++) if ((t = e[s]) && t.id != "" && t.src != "") {
                    n = t.loop;
                    r = t.preload;
                    i = t.autoplay;
                    a.audio.audios[t.id] = new Audio(t.src);
                    a.audio.audios[t.id].id = t.id;
                    a.audio.audios[t.id].loop = n;
                    a.audio.audios[t.id].preload = r;
                    a.audio.audios[t.id].autoplay = i
                }
            }
            return this
        },
        setRunFrequency: function(e) {
            a.system.timeout = e;
            return this
        },
        events: function() {
            var e;
            return {
                init: function() {
                    return e = this
                },
                keyDown: function(t) {
                    if (!a.event.keyDownGo) a.event.keyDownGo = true;
                    if (!a.event.keyUpGo) a.event.keyUpGo = true;
                    if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
                    a.event.keyDownCallBack = t;
                    return e
                },
                keyUp: function(t) {
                    if (!a.event.keyDownGo) a.event.keyDownGo = true;
                    if (!a.event.keyUpGo) a.event.keyUpGo = true;
                    if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
                    a.event.keyUpCallBack = t;
                    return e
                },
                orientationChange: function(t) {
                    a.event.orientationChange = t;
                    return e
                },
                touchStart: function(t) {
                    a.event.touchStart = t;
                    return e
                },
                touchEnd: function(t) {
                    a.event.touchEnd = t;
                    return e
                },
                touchMove: function(t) {
                    a.event.touchMove = t;
                    return e
                },
                touchCancel: function(t) {
                    a.event.touchCancel = t;
                    return e
                },
                click: function(t) {
                    a.event.clickCallBack = t;
                    return e
                },
                mouseDown: function(t) {
                    a.event.mouseDownCallBack = t;
                    return e
                },
                mouseUp: function(t) {
                    a.event.mouseUpCallBack = t;
                    return e
                },
                mouseMove: function(t) {
                    a.event.mouseMoveCallBack = t;
                    return e
                },
                base: function() {
                    return jsGame
                }
            }
        }(),
        ui: {},
        graphics: {
            HCENTER: g.canvas.graphics.HCENTER,
            VCENTER: g.canvas.graphics.VCENTER,
            LEFT: g.canvas.graphics.LEFT,
            RIGHT: g.canvas.graphics.RIGHT,
            TOP: g.canvas.graphics.TOP,
            BOTTOM: g.canvas.graphics.BOTTOM
        },
        trans: {
            TRANS_NONE: g.canvas.trans.TRANS_NONE,
            TRANS_ROT90: g.canvas.trans.TRANS_ROT90,
            TRANS_ROT180: g.canvas.trans.TRANS_ROT180,
            TRANS_ROT270: g.canvas.trans.TRANS_ROT270,
            TRANS_MIRROR: g.canvas.trans.TRANS_MIRROR,
            TRANS_MIRROR_ROT90: g.canvas.trans.TRANS_MIRROR_ROT90,
            TRANS_MIRROR_ROT180: g.canvas.trans.TRANS_MIRROR_ROT180,
            TRANS_MIRROR_ROT270: g.canvas.trans.TRANS_MIRROR_ROT270
        },
        request: function() {
            return {
                init: function() {
                    o.initUrlParams(location.href)
                },
                get: function(e) {
                    return a.request.gets[e] ? a.request.gets[e] : ""
                }
            }
        }()
    }.init()
})()