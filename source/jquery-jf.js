

(function($) {
    var defaultOptions = {

        fontSize: '20'
    };
    var jf = {
        show: function (e1) {
            e1.fadeIn(200);
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
            /* Escape tags */
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (isUrl(json))
                html += '<a href="' + json + '" class="json-string">' + json + '</a>';
            else
                html += '<span class="json-string">"' + json + '"</span>';
        }
        else if (typeof json === 'number') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (typeof json === 'boolean') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (json === null) {
            html += '<span class="json-literal">null</span>';
        }
        else if (json instanceof Array) {
            if (json.length > 0) {
                html += '[<ol class="json-array">';
                for (var i = 0; i < json.length; ++i) {
                    html += '<li>';
                    /* Add toggle button if item is collapsable */
                    if (isCollapsable(json[i])) {
                        html += '<a href class="json-toggle"></a>';
                    }
                    html += json2html(json[i], options);
                    /* Add comma if item is not last */
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
                            '<span class="json-string">"' + key + '"</span>' : key;
                        /* Add toggle button if item is collapsable */
                        if (isCollapsable(json[key])) {
                            html += '<a href class="json-toggle">' + keyRepr + '</a>';
                        }
                        else {
                            html += keyRepr;
                        }
                        html += ': ' + json2html(json[key], options);
                        /* Add comma if item is not last */
                        if (--key_count > 0)
                            html += ',';
                        html += '</li>';
                    }
                }
                html += '</ul>}';
            }
            else {
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

        return this.each(function() {
            var html = json2html(json, defaultOptions);
            _this.html(html);
        });

        /*_this.css('display', 'none');
        _this.css('font-size', defaultOptions['fontSize'] + 'px')

        if (json == null) {
            try {
                json = JSON.parse(_this.text());
            } catch(e) {
                console.error('非json格式')
            }
        }
        if (json == null) {
            jf.show(_this);
            return;
        }

        $('<pre>').appendTo(_this).html(JSON.stringify(json, undefined, '<li></li>'));
        jf.show(_this);*/

    };
})(jQuery);
