
BASE.require(["jQuery","jQuery.loadFile"], function(){
    jQuery.fn.loadModule = function(url, options){
        options = options || {};
        var beforeAppend = options.beforeAppend || function(){};
        var afterAppend = options.afterAppend || function(){};
        
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
                    throw new Error("Couldn't find module located at \""+url+"\".");
                }
            }, function(){});
        });
    };
    
    jQuery.executeDataScript = function(root){
        $("[data-script]", root || document).each(function(){
            var $this = $(this);
            var script = $this.attr("data-script");
            if (!$this.data("data-script")){
                BASE.require([script], function(){
                    var Klass = BASE.getObject(script);
                    
                    if (typeof Klass === "function"){
                        $this.data("data-script", new Klass($this[0]));
                    } else {
                        throw new Error("\""+script +"\" needs to be a class.");
                    }
                });
            }            
        });  
    };
    
    jQuery(function(){
          jQuery.executeDataScript();
    });
});