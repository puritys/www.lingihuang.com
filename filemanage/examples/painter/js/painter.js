(function(){
	//var _MAP, _DRAW;
    var UMInitial = {
		funcs: [],
		add: function(funcName){
			var args = Array.prototype.slice(arguments, 1);
			this.funcs.push(function(){
				//window[funcName].apply(this, args);
				if (typeof funcName=='function') {
                    funcName();
				} else if (typeof funcName=='string') {
					var fnName=funcName.split('.');// 'routeUI.drawOnMap'
					//var obj=window;
					var obj=this;//expect UM
					for(var i=0, j=fnName.length; i<j; i++){
						obj=obj[fnName[i]];
					}
					obj.apply(this, args);
				}
			});
		}
	};
	var UM = function() {
		var self = this;
        var ID = {
            topHeader: 'topHeaderDiv',
            bodyContent: 'bodyContentDiv'
        };
		var Initialize = {
			windowEvent: function(){
				$(window).bind('resize', resizeWindow)
                         .trigger('resize');
			},
			ajax : function(){
				var loading = function(){
                    
				};
				var complete = function(){
                    
				};
				$.ajaxSetup({
					beforeSend: loading,
					error: complete,
					success: complete,
					complete: complete,
                    cache:true
				});
			}
		};
		var resizeWindow = function(){
			var boxAttrs = ['borderTopWidth', 'borderBottomWidth', 'marginTop', 'marginBottom'];
            function dimSum(node) {
                var sum = 0;
                for (var i=0; i<boxAttrs.length; i++){
                    var boxAttrsi = node.css(boxAttrs[i]);
                    if(boxAttrsi)
                        sum += parseInt(boxAttrsi, 10) || 0;
                }
                return sum;
            }
            var height = $(document).height() - $('#'+ID.topHeader).height() - dimSum($('#'+ID.topHeader));
            $('#'+ID.bodyContent).height(height);
		};
		var _init = function(){
			for (var i in Initialize)
				Initialize[i]();
			for (var i in UMInitial.funcs)
				UMInitial.funcs[i]();
		};
		var _addInit = function(fnName, args){
            UMInitial.add(fnName, args);
		};
		var clearRecordList = [];
		var _clearRecord = function(){
			for(var i in clearRecordList){
				if(clearRecordList.hasOwnProperty(i)){
					clearRecordList[i]();
				}
			}
		};
		var _addFunctionToClearRecord = function(func){
			clearRecordList.push(func);
		};
		var _extend = function(obj){
            for(var i in obj){
				this[i] = obj[i];
			}
		};
		this.triggerResize = resizeWindow;
		this.init = _init;
		this.addInit = _addInit;
		//增加function到clearRecord
		this.addFunctionToClearRecord = _addFunctionToClearRecord;
		this.clearRecord = _clearRecord;
        this.extend = _extend;
	};
	window.UM = new UM();
})();
/*
 *UM.extend({
    test : function(){
        alert(0);
    },
    test2 : function(){
        alert(1);
    }
});
 *
 **/
//UM.addInit(function(){UM.routeUI.drawOnMap( ["{c}wCy|udVz@?i@A??MiB??MmB??@wC???{@???eB??@sD??@oE???i@??DoF??BiG??B{B???Y??@uC??@o@???aA??DuC??bB@??bA@??hA???bA@??jA???pA@??dA???xA@??vA@??dA???hA@??jA@??bA???dA@??jB@???a@???kC??B}D??@aD??@wE??@o@??@yB??BsD??@oA??D}D??@gC??F_I??@oC??BeC???G??@oA@i@??@eC??D}D??BmE??gCC{A?l@?r@xA"])});
