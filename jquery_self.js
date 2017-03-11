(function(window){
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;

    var toString = Object.prototype.toString;

    //自定义数据类型
    var types = ("Number String Boolean Date Array Object RegExp" +
    " Null Undefined Math Function").split(" ");

    var class2Type = {};

    for(var i = 0;i < types.length;i++){
        var type = types[i];
        class2Type["[object "+type+"]"] = type.toLowerCase();
    }

    var elems = function (selector) {
        return document.querySelectorAll(selector);
    };

    function jQuery(selector){
        return new jQuery.fn.F(selector);
    }

    jQuery.fn = jQuery.prototype = {
        constructor:jQuery,
        version:"0.0.1",//自定义版本号-识别是否是jquery对象
        F:function(selector){
            /*参数为字符串*/
            if(jQuery.isString(selector)){
                //$("<div></div>")---html字符串
                if(selector.charAt(0) == "<" && selector.charAt(selector.length - 1) == ">" && selector.length >= 3){
                    //存放于内存中
                    var div = document.createElement("div");
                    div.innerHTML = selector;
                    push.apply(this,div.childNodes);
                }else{
                    //$("div")---选择器
                    splice.call(this,0,this.length);
                    push.apply(this,elems(selector));
                }

                //鸭式辨型--具有该事物的特征
            }else if(selector.nodeType){
                //{0:selector,length:1}--jquery对象--即实例
                /*参数为dom元素-->$($("div")[0])*/
                this[0] = selector;
                this.length = 1;

            }else if(selector.version === this.version){
                //jquery对象--$($("div"))
                return selector;

            }
            return this;
        }
    };

    jQuery.fn.extend = jQuery.extend = function () {
        var arg0 = arguments[0];
        var argLen = arguments.length;
        var target;
        var arrSources = [];

        if(argLen == 0) return this;

        if(argLen == 1){
            arrSources.push(arg0);
            target = this;
        }else{
            for(var i = 1;i < argLen;i++){
                arrSources.push(arguments[i]);
            }
            target = arg0;
        }
        for(var i = 0;i < argLen;i++){
            var source = arrSources[i];
            for(var key in source){
                target[key] = source[key];
            }
        }
        return target;
    };

    /*工具函数 --模块*/
    jQuery.extend({
        type: function (opt) {
            return class2Type[toString.call(opt)];
        },
        isString: function (str) {
            return jQuery.type(str) === "string";
        },
        isFunction: function (fn) {
            return jQuery.type(fn) === "function";
        },
        isPlainObject: function (obj) {
            return jQuery.type(obj) === "object";
        },
        error: function (msg) {
            throw new Error(msg);
        },
        each: function (ele,callback) {
            var i;
            var len = ele.length;

            /*数组或伪数组*/
            if(typeof len === "number" && len >= 0){
                for(i = 0;i < len;){
                    if(callback.call(ele[i],i,ele[i++]) === false){
                        break;
                    }
                }
            }else{
                /*对象*/
                for(i in ele){
                    if(callback.call(ele[i],i,ele[i]) === false){
                        break;
                    }
                }
            }
        },
        trim: function (str) {
            return str.replace(/^\s+|\s+$/g,"");
        }
    });

    /**
     * css --模块
     */
    jQuery.fn.extend({
        each: function (callback) {
            /*$("div").each(function(){})*/
            jQuery.each(this,callback);//this指向实例
            return this;
        },
        css: function () {
            var arg0 = arguments[0];
            var arg1 = arguments[1];

            if(arguments.length == 0) return this;

            if(arguments.length == 1){
                /*$("xxx").css("color")*/
                if(jQuery.isString(arg0)){
                    var firstDom = this[0];
                    return window.getComputedStyle(firstDom,null)[arg0];
                }else{
                    /*$("xxx").css({"color":"red"})*/
                    return this.each(function () {
                        jQuery.extend(this.style,arg0);
                    });
                }
            }else{
                /*$("xxx").css("color","red")*/
                this.each(function () {
                    var dom = this;
                    dom.style[arg0] = arg1;
                });
            }
        },
        show: function () {
            return this.css("display","block");
        },
        hide: function () {
            return this.css("display","none");
        },
        toggle: function () {
            return this.each(function () {
                var $this = $(this);
                $this.css("display") === "none" ? $this.show() : $this.hide();
            });
        }
    });

    /**
     * 属性+样式+节点 --模块
     */
    jQuery.fn.extend({
        attr: function (arg0, arg1) {
            /*$("xxx").attr()*/
            if(arguments.length == 0) return this;

            if(arguments.length == 1){
                if(jQuery.isString(arg0)){
                    /*$("xxx").attr("id")*/
                    var firstDom = this[0];
                    return firstDom.getAttribute(arg0);
                }else{
                    /*$("xxx").attr({type:"button"})*/
                    //自定义属性和内置属性的添加
                    for(var i = 0;i < this.length;i++){
                        var dom = this[i];
                        for(var key in arg0){
                            dom.setAttribute(key,arg0[key]);
                        }
                    }
                    //链式
                    return this;
                }
            }else{
                /*$("xxx").attr("id","aa")*/
                //链式
                return this.each(function () {
                    var dom = this;
                    dom.setAttribute(arg0,arg1);
                });
            }
        },
        hasClass: function (className) {
            //开闭原则
            var isExist = false;
            this.each(function () {
                if(((" "+this.className+" ").indexOf(" "+className+" ")) > -1){
                    isExist = true;
                    return false;//终止dom元素的遍历
                }
            });
            return isExist;
        },
        addClass: function (className) {
            //链式
            return this.each(function () {
                var classNames = className.split(" ");

                for(var i = 0;i < classNames.length;i++){
                    var singleName = classNames[i];

                    //className不存在
                    if(!this.className){
                        this.className += singleName;
                    }
                    //存在且样式类不同
                    if(!$(this).hasClass(singleName)){
                        this.className += " "+singleName;
                    }
                }
            });
        },
        removeClass: function (className) {
            /*删除所有*/
            if(!className){
                //链式
                return this.each(function () {
                    this.className = "";
                });
            }
            var classNames = className.split(" ");
            /*删除一个或多个*/
            //链式
            return this.each(function () {
                var currentClassName = " "+this.className+" ";

                for(var i = 0;i < classNames.length;i++){
                    var singleName = classNames[i];
                    //获取替换后的返回值
                    currentClassName = currentClassName.replace(" "+singleName+" "," ");
                }
                this.className = jQuery.trim(currentClassName);
            });
        },
        appendTo: function () {
            //$("<span></span><div></div>").appendTo("div");/document.body
            var arg0 =  arguments[0];//子节点
            var $parent = $(arg0);

            return this.each(function () {
                var child = this;
                $parent.each(function () {
                    var parent = this;
                    parent.appendChild(child.cloneNode(true));
                });
            });
        },
        prependTo: function () {
            var arg0 = arguments[0];
            var $parent = $(arg0);//$($())
            return this.each(function () {
                var child = this;
                $parent.each(function () {
                    var parent = this;
                    parent.insertBefore(child.cloneNode(true),parent.firstChild);
                });
            });
        },
        append: function () {
            //复用appendTo方法
            var $parent = this;
            var $child = $(arguments[0]);
            $child.appendTo($parent);
            return this;
        },
        prepend: function () {
            var $parent = this;
            var $child = $(arguments[0]);
            $child.prependTo($parent);
            return this;
        },
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },
        html: function (html) {
            //不传参-获取第一个dom元素的内容
            if(html === undefined){
                var firstDom = this[0];
                return firstDom.innerHTML;
            }
            //参数为null或者为一个字符串
            return this.each(function () {
                this.innerHTML = html;
            });
        },
        text: function (text) {
            //不传参-返回所有元素的文本内容的总和
            if(text === undefined){
                var str = "";
                this.each(function () {
                     str += this.innerText;
                });
                return str;
            }
            return this.each(function () {
                this.innerText = text;
            });
        }
    });
    /**
     * 事件绑定
     */

        //自定义事件类型
    var events = ("click dblclick mouseover mouseout mouseenter mouseleave" +
        " mouseup mousedown keyup keydown").split(" ");

    //闭包实现
    for(var j = 0;j < events.length;j++){
        var eventType = events[j];

        jQuery.fn[eventType] = (function (type) {
            return function(callback){
                return this.on(type,callback);//this指向实例
            };
        })(eventType); //使用闭包固定作用域--即每次遍历都保存了type变量的值
    }

    jQuery.fn.extend({
        //$("div").on("click",callback);
        on: function (type,callback) {
            return this.each(function () {
                this.addEventListener(type,callback);
            });
        }
    });

    /*F的实例可以访问jQuery原型上的方法*/
    jQuery.fn.F.prototype = jQuery.fn;

    /*对外提供两个接口$--jQuery*/
    window.$ = window.jQuery = jQuery;

})(window);