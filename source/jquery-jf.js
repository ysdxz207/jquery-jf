;
(function ($) {

    var defaultOptions = {

        fontSize: '20'
    };
    $.fn.jf = function () {
        var _this = $(this);
        var json = arguments[0],
            options = arguments[1];
        $.fn.extend(defaultOptions, options);

        console.log(defaultOptions)
        _this.css('opacity', '0');
        _this.css('font-size', defaultOptions['fontSize'] + 'px')

        if (json == null) {
            try {
                json = JSON.parse(_this.text());
            } catch(e) {
                console.error('非json格式')
            }
        }
        if (json == null) {
            return;
        }


    }

})(jQuery)