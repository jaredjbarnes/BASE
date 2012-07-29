BASE.require(["jQuery"], function(){
	
	var walkTheDom = function($elem, condition, callback){
		var $children = $elem.children();
		
		$children.each(function(){
			walkTheDom($(this), condition, callback);
		});
		
		if (condition($elem)){
			callback.apply($elem[0],[]);
		}
	};

	var views = function( $root, each){
		walkTheDom($root, function($elem){
			if ($elem.attr("data-view")){
				return true;
			}
			return false;
		}, each);
	};

	var controllers = function( $root, each ){
		walkTheDom($root, function($elem){
			if ($elem.attr("data-controller")){
				return true;
			}
			return false;
		}, each);
	};
	
	window.MVC = {
		apply: function(root, callback){
			var totalViews = [];
			var totalControllers = [];
			callback = callback || function(){};
			
			views($(root), function () {
				var $this = $(this);
				var script = $this.attr("data-view");
				
				if (!$this[0].view) {
					totalViews.push(script)
					BASE.require([script], function () {
						var Klass = BASE.getObject(script);

						if (typeof Klass === "function") {
							$this[0].view = new Klass($this[0]);
							totalViews.pop();
							
							if (totalViews.length === 0){
								controllers( $(root), function () {
									var $this = $(this);
									var script = $this.attr("data-controller");
									var view = $this[0].view;
									
									if (!$this[0].controller) {
										if (!view){
											throw new Error("Controller \""+script+"\" needs to have a \"data-view\" attribute also.");
										}
										
										totalControllers.push(script)
										BASE.require([script], function () {
											var Klass = BASE.getObject(script);
											
											if (typeof Klass === "function") {
												$this[0].controller = new Klass(view, $this[0]);
												totalControllers.pop();
												
												if (totalControllers.length === 0){
													callback();
												}
												
											} else {
												throw new Error("\"" + script + "\" needs to be a class.");
											}
										});
									}
								});
							}
						} else {
							throw new Error("\"" + script + "\" needs to be a class.");
						}
					});
				}
			});
		}
	};
	
	MVC.apply(document.body);
});