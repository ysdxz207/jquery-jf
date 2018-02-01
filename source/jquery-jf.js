var TimeFn = null;

(function ($) {
    var defaultOptions = {

        fontSize: '14',
        lineHeight: '24',
        collapsed: false,
        withQuotes: false,
        showImg: true
    };
    var jf = {
            json: {},
            show: function (e1) {
                e1.fadeIn(200);
            },
            hide: function (e1) {
                e1.hide();
            },
            collapse: function (el) {

            },
            expand: function (el) {

            },
            toggle: function (el) {

            },
            json2html: function (json, options) {
                var html = '';

                if (typeof json === 'string') {
                    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    if (jf.isUrl(json)) {
                        html += '<a href="' + json + '" class="json-value json-link" target="_blank">"';
                        if (defaultOptions.showImg) {
                            html += '<img src="' + json + '" onerror="javascript:this.parentNode.removeChild(this)">"';
                        }
                        html += json + '"</a>';

                    } else {
                        html += '<span class="json-value json-string">"' + json + '"</span>';
                    }
                }
                else if (typeof json === 'number') {
                    html += '<span class="json-value json-number">' + json + '</span>';
                }
                else if (typeof json === 'boolean') {
                    html += '<span class="json-value json-boolean">' + json + '</span>';
                }
                else if (json === null) {
                    html += '<span class="json-value json-null">null</span>';
                }
                else if (json instanceof Array) {
                    if (json.length > 0) {
                        html += '[<ol class="json-value json-array">';
                        for (var i = 0; i < json.length; ++i) {
                            html += '<li>';
                            if (jf.isCollapsable(json[i])) {
                                html += '<a href class="json-toggle-btn"></a>';
                            }
                            html += jf.json2html(json[i], options);
                            if (i < json.length - 1) {
                                html += ',';
                            }
                            html += '</li>';
                        }
                        html += '</ol>]';
                    }
                    else {
                        html += '[]';
                    }
                }
                else if (typeof json === 'object') {
                    var key_count = Object.keys(json).length;
                    if (key_count > 0) {
                        html += '{<ul class="json-dict">';
                        for (var key in json) {
                            if (json.hasOwnProperty(key)) {
                                html += '<li>';
                                var keyRepr = options.withQuotes ?
                                    '<span class="json-key" title="单击复制key,双击复制value,右键复制json">"' + key + '"</span>' : '<span class="json-key" title="单击复制key,双击复制value,右键复制json">' + key + '</span>';
                                if (jf.isCollapsable(json[key])) {
                                    html += '<i class="json-toggle-btn"><hr></i>' + keyRepr;
                                }
                                else {
                                    html += keyRepr;
                                }
                                html += ': ' + jf.json2html(json[key], options);
                                if (--key_count > 0)
                                    html += ',';
                                html += '</li>';
                            }
                        }
                        html += '</ul>}';
                    } else {
                        html += '{}';
                    }
                }
                return html;
            },
            isCollapsable: function (arg) {
                return arg instanceof Object && Object.keys(arg).length > 0;
            },
            isUrl: function (string) {
                var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                return regexp.test(string);
            }
            ,
            copyJson: function (clickObj, type) {
                var key = clickObj.text(),
                    jsonObj = jf.findJson(clickObj),
                    value = jsonObj['value'],
                    tempClickObj = $('<div></div>');
                var clipboard = new Clipboard(tempClickObj[0], {
                    text: function () {
                        if (type === 'key') {
                            return key;
                        } else if (type === 'value') {
                            return value;
                        } else if (type === 'json') {
                            key = defaultOptions.withQuotes ? '"' + key + '"' : key;
                            return key + ':' + value;
                        }
                        return key;
                    }
                });

                clipboard.on('success', function (e) {
                    jf.tip('复制' + type + '成功');
                });

                clipboard.on('error', function (e) {
                    console.log(e);
                });

                tempClickObj.click();
                clipboard.destroy();
            }
            ,
            tip: function (text, timeout) {
                var tipEle = $('<div class="tip">' + text + '</div>');
                tipEle.appendTo('body');
                tipEle.show(500);
                tipEle.delay(timeout || 1000).fadeOut(500);
            },
            findJson: function (obj) {
                var index = $('.json-key').index(obj);

                var convertJson2Arr = function (json) {
                    var arr = [];
                    if (json instanceof Object) {
                    }
                    $.each(json, function (k, v) {
                        if (v instanceof Object) {
                            arr.push({'key':k,'value':JSON.stringify(v)});
                            if (!(v instanceof Array)) {
                                $.each(convertJson2Arr(v), function (i, o) {
                                    arr.push(o);
                                });
                            }
                        } else {
                            arr.push({'key':k,'value':v});
                        }
                    });
                    return arr;
                };

                var arr = convertJson2Arr(jf.json);
                var str = arr[index];
                return str;
            }
        }
    ;

    $.fn.jf = function () {


        var _this = $(this);
        var json = arguments[0],
            options = arguments[1] || {};
        $.fn.extend(defaultOptions, options);

        jf.hide(_this);
        if (json == null) {
            try {
                json = JSON.parse(_this.text());
            } catch (e) {
                return;
            }
        }
        if (json == null) {
            return;
        }

        if (typeof json === 'string') {
            try {
                json = JSON.parse(json);
            } catch (e) {
                jf.json = json;
                jf.show(_this);
                return;
            }
        }

        jf.json = json;
        _this.html('<i class="json-toggle-btn"><hr></i><span class="json-root">ROOT</span>')

        return this.each(function () {
            var html = jf.json2html(json, defaultOptions);
            _this.css('font-size', defaultOptions.fontSize + 'px');
            _this.css('line-height', defaultOptions.lineHeight + 'px');
            _this.addClass('jf-main');
            _this.append(html);
            jf.show(_this);

            $(this).off('click');
            $(this).on('click', '.json-toggle-btn', function () {
                var target = $(this).toggleClass('collapsed').siblings('ul.json-dict, ol.json-array');
                target.toggle();
                if (target.is(':visible')) {
                    target.siblings('.json-placeholder').remove();
                } else {
                    var count = target.children('li').length;
                    var placeholder = count + (count > 1 ? ' items' : ' item');
                    target.after('<span class="json-placeholder">' + placeholder + '</span>');
                }
                return false;
            });

            $(this).on('click', '.json-placeholder', function () {
                $(this).siblings('.json-toggle-btn').click();
                return false;
            });
            if (defaultOptions.collapsed == true) {
                $(this).find('.json-toggle-btn').click();
            }


            if (defaultOptions.showImg) {

                $('.json-link').bind('mouseover', function () {
                    var img = $(this).find('img');
                    img.css('left', window.event.clientX + window.document.body.scrollLeft + 6);
                    img.css('top', window.event.clientY + window.document.body.scrollLeft + 6);
                    img.show(400);
                }).bind('mouseout', function () {
                    var img = $(this).find('img');
                    img.hide(100);
                });
            }


            $('.json-key').bind('click', function () {
                var $this = $(this);
                // 取消上次延时未执行的方法
                clearTimeout(TimeFn);
                //执行延时
                TimeFn = setTimeout(function () {
                    //do function在此处写单击事件要执行的代码
                    jf.copyJson($this, 'key');
                }, 300);

            });
            $('.json-key').bind('dblclick', function () {
                // 取消上次延时未执行的方法
                clearTimeout(TimeFn);
                jf.copyJson($(this), 'value');
            });

            $('.json-key').rightMenu();
        });

    };





    $.fn.rightMenu = function () {
        $(document).contextmenu(function(){
            return false;
        });
        var _this = $(this);
        $(document).mousedown(function (e) {
            if (e.which == 3) {
                if ($.inArray(e.target,_this) != -1) {
                    var liCopy = $('<li>'),
                        ul = $('<ul class="right-menu">');
                    liCopy.text('复制对象');
                    liCopy.bind('click', function () {
                        jf.copyJson($(e.target), 'json');
                        ul.remove();
                    });
                    liCopy.appendTo(ul);
                    ul.appendTo('body');
                    ul.css('left', e.clientX + 12 + 'px');
                    ul.css('top', e.clientY + 'px');
                    ul.show(400);
                } else {
                    $('.right-menu').remove();
                }
            } else if ($.inArray(e.target, $('.right-menu li')) == -1) {
                $('.right-menu').remove();
            }

        })
    };

})(jQuery);
