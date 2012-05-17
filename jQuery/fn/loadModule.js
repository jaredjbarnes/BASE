
BASE.require(["jQuery","jQuery.loadFile","jQuery.executeDataScript"], function(){
    jQuery.fn.loadModule = function(url, options){
        options = options || {};
        var beforeAppend = options.beforeAppend || function(){};
        var afterAppend = options.afterAppend || function(){};
        var err = options.error || function(){};
        return this.each(function(){
            var $this = $(this);
            $.loadFile(url, {
                fromCache: true,
                success:function(html){
                    var $module = $(html);
                    beforeAppend.call($this[0], $module[0]);
                    $module.appendTo($this);
                    jQuery.executeDataScript($this[0]);
                    afterAppend.call($this[0], $module[0]);
                },
                error: function(){
                    err.call($this[0]);
                    //throw new Error("Couldn't find module located at \""+url+"\".");
                }
            }, function(){});
        });
    };
     

});