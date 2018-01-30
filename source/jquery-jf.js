

(function($) {
    var defaultOptions = {

        fontSize: '14',
        lineHeight: '24',
        collapsed: false,
        withQuotes: false,
        showImg: true
    };
    var jf = {
        show: function (e1) {
            e1.fadeIn(200);
        },
        hide: function (e1) {
            e1.hide();
        },
        collapse: function(el) {

        },
        expand: function(el) {

        },
        toggle: function(el) {

        }
    };

    function isCollapsable(arg) {
        return arg instanceof Object && Object.keys(arg).length > 0;
    };
    function isUrl(string) {
        var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(string);
    };
    function json2html(json, options) {
        var html = '';

        if (typeof json === 'string') {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (isUrl(json))
                html += '<a href="' + json + '" class="json-value json-link" target="_blank"><img src="'+json + '">" ' + json + '</a>';
            else
                html += '<span class="json-value json-string">"' + json + '"</span>';
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
                    if (isCollapsable(json[i])) {
                        html += '<a href class="json-toggle-btn"></a>';
                    }
                    html += json2html(json[i], options);
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
                            '<span class="json-key">"' + key + '"</span>' : '<span class="json-key">' + key + '</span>';
                        if (isCollapsable(json[key])) {
                            html += '<i class="json-toggle-btn"><hr></i><span class="json-key">' + keyRepr + '</span>';
                        }
                        else {
                            html += keyRepr;
                        }
                        html += ': ' + json2html(json[key], options);
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
    }

    return $.fn.jf = function() {


        var _this = $(this);
        var json = arguments[0],
            options = arguments[1] || {};
        $.fn.extend(defaultOptions, options);

        jf.hide(_this);
        if (json == null) {
            try {
                json = JSON.parse(_this.text());
            } catch(e) {
                jf.show(_this);
                return;
            }
        }
        if (json == null) {
            jf.show(_this);
            return;
        }

        if (typeof json === 'string') {
            try {
                json = JSON.parse(json);
            } catch(e) {
                jf.show(_this);
                return;
            }
        }
        _this.html('<i class="json-toggle-btn"><hr></i><span class="json-root">ROOT</span>')

        return this.each(function() {
            var html = json2html(json, defaultOptions);
            _this.css('font-size', defaultOptions.fontSize + 'px');
            _this.css('line-height', defaultOptions.lineHeight + 'px');
            _this.addClass('jf-main');
            _this.append(html);
            jf.show(_this);

            $(this).off('click');
            $(this).on('click', '.json-toggle-btn', function() {
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

            $(this).on('click', '.json-placeholder', function() {
                $(this).siblings('.json-toggle-btn').click();
                return false;
            });
            if (defaultOptions.collapsed == true) {
                $(this).find('.json-toggle-btn').click();
            }

            $('.json-link').hover(function () {
                console.log('show')
                $(this).find('img').show(400);
            });
        });

    };
})(jQuery);
