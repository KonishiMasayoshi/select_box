/*----------------------------- select_box -----------------------------*/
(function($){
	var 
	defaults = {
		input:true, 
		attr:{}, 
		list:{}, 
		disabledList:[], 
		selectValue:false, 
		sort:false, 
		sortPosition:'desc', 
		classNameSelectBoxActiveTrigger:'select_box_active_trigger', 
		classNameSelectBoxDisabled:'select_box_disabled', 
		classNameSelectBoxSelectItemPointerShowAnimate:'select_box_select_item_pointer_show_animate', 
		classNameSelectBoxSelectItemPointerHideAnimate:'select_box_select_item_pointer_hide_animate', 
		classNameSelectBoxSelectTriggerDisabled:'select_box_select_trigger_disabled', 
		flagDisabled:false, 
		flagSearchForm:false, 
		flagEscape:true, 
		searchFormPlaceHolder:'検索', 
		speedAnimationHeight:250, 
		setTimeInitSelectBoxSearchList:400, 
		funcChangeCallback:(
			value, 
			text, 
		) => {} 
	};
	$.fn.selectBox = function(options){
		var 
		configs = {}, 
		el = this, 
		lenEl = el.length;
		if(lenEl === 0)
		return this;
		if(lenEl > 1){
			el.each(function(){
				$(this).selectBox(options);
			});
			return this;
		}
		var 
		flagAnimate = false;
		el.funcDestructor = () => {
			lenEl = 
			el.funcInit = 
			el.funcCustomEvents = 
			el.funcDestructor = void 0;
		}, 
		el.funcInit = () => {
			configs = $.extend(
				{}, 
				defaults, 
				options 
			);
			el.funcPutSelectBox();
			el.funcPutInputAttr();
			el.funcPutSelectList();
			el.funcAddEventListenerSelectList(true);
			el.funcCustomEvents();
			el.funcDestructor();
		}, 
		el.funcSortObject = (
			object, 
			target, 
			sort 
		) => {
			var 
			array = [];
			switch(target){
				case 'key':
					var 
					keys = Object.keys(object), 
					lenKeys = keys.length;
					keys.sort();
					for(var i = 0;i < lenKeys;++i)
					array.push({
						key:keys[i], 
						value:object[keys[i]] 
					});
					if(
						typeof sort === 'string' && 
						sort === 'desc' 
					)
					array.reverse();
				break;
				case 'value':
					var 
					values = Object.values(object), 
					keys = Object.keys(object), 
					keysIndex = {};
					lenValues = values.length;
					values.sort();
					if(
						typeof sort === 'string' && 
						sort === 'desc' 
					)
					values.reverse();
					for(var i = 0;i < lenValues;++i){
						var 
						key = keys.filter(function(key){
							return object[key] === values[i];
						});
						if(typeof keysIndex[key] === 'undefined'){
							keysIndex[key] = 0;
						}else{
							++keysIndex[key];
						}
						array.push({
							key:key[keysIndex[key]], 
							value:object[key[keysIndex[key]]] 
						});
					}
				break;
				default:
					for(var key in object)
					array.push({
						key:key, 
						value:object[key] 
					});
				break;
			}
			return array;
		}, 
		el.funcHtmlspecialchars = (str) => {
			return configs.flagEscape === false?str:(str + '')
			.replace(/&/g,'&amp;')
			.replace(/"/g,'&quot;')
			.replace(/'/g,'&#039;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;');
		}, 
		el.funcInitSelectBox = () => {
			el.empty();
		}, 
		el.funcPutSelectBox = () => {
			el
			.empty()
			.html('\
				<div class="select_box_inner' + (configs.flagSearchForm?' select_box_set_search_form':'') + (configs.flagDisabled?' ' + configs.classNameSelectBoxDisabled:'') + '">\
					<div class="select_box_parent">\
						<div class="select_box_select_item_parent">\
							<output class="select_box_select_item"></output>\
							<span class="select_box_select_item_pointer"></span>\
						</div>\
						<div class="select_box_select_list_parent">\
							<ul class="select_box_select_list"></ul>\
						</div>\
						' + (configs.input?'<input type="hidden">':'') + '\
					</div>\
					' + (configs.flagSearchForm?'\
					<div class="select_box_search_parent">\
						<input type="search" placeholder="' + configs.searchFormPlaceHolder + '"' + (configs.flagDisabled?' disabled':'') + ' class="select_box_search_input">\
						<div class="select_box_search_list_parent">\
							<ul class="select_box_search_list"></ul>\
						</div>\
					</div>\
					':'') + '\
				</div>\
			');
		}, 
		el.funcPutInputAttr = () => {
			if(configs.input === false)
			return false;
			var 
			eleSelectBoxInput = $('input[type="hidden"]', el);
			for(var attr in configs.attr)
			eleSelectBoxInput.attr(
				attr, 
				configs.attr[attr] 
			);
		}, 
		el.funcPutSelectList = () => {
			var 
			defaultValue, 
			eleSelectBoxSelectItem = $('.select_box_select_item', el), 
			eleSelectBoxSelectList = $('.select_box_select_list', el), 
			list = el.funcSortObject(
				configs.list, 
				configs.sort, 
				configs.sortPosition 
			);
			if(configs.input){
				var 
				eleSelectBoxInput = $('input[type="hidden"]', el);
				eleSelectBoxInput
				.removeAttr('value')
				.removeAttr('data-input-text');
			}
			eleSelectBoxSelectItem.empty();
			eleSelectBoxSelectList.empty();
			for(var i = 0, l = list.length;i < l;++i){
				if(
					$.inArray(
						list[i].key, 
						configs.disabledList 
					) === -1 
				){
					if(configs.selectValue === false){
						configs.selectValue = list[i].key;
						defaultValue = configs.selectValue;
						eleSelectBoxSelectItem.html(el.funcHtmlspecialchars(list[i].value));
						if(configs.input)
						eleSelectBoxInput
						.val(list[i].key)
						.attr(
							'data-input-text', 
							el.funcHtmlspecialchars(list[i].value) 
						);
					}else 
					if(
						configs.selectValue == list[i].key || 
						eleSelectBoxSelectItem.html() === '' 
					){
						defaultValue = list[i].key;
						eleSelectBoxSelectItem.html(el.funcHtmlspecialchars(list[i].value));
						if(configs.input)
						eleSelectBoxInput
						.val(list[i].key)
						.attr(
							'data-input-text', 
							el.funcHtmlspecialchars(list[i].value) 
						);
					}
				}
				eleSelectBoxSelectList.append('\
					<li>\
						<span class="select_box_select_trigger' + (
							$.inArray(
								list[i].key, 
								configs.disabledList 
							) === -1?'':' ' + configs.classNameSelectBoxSelectTriggerDisabled) + '" data-select-box-value="' + el.funcHtmlspecialchars(list[i].key) + '">' + el.funcHtmlspecialchars(list[i].value) + '</span>\
					</li>\
				');
			}
			if(configs.selectValue !== defaultValue)
			configs.selectValue = defaultValue;
			el.funcResetClassSelectTrigger(
				false, 
				configs.selectValue 
			);
		}, 
		el.funcGetSearchList = (keyword) => {
			var 
			list = {};
			if(keyword === '')
			return list;
			for(var value in configs.list){
				if(configs.list[value].indexOf(keyword) !== -1)
				list[value] = configs.list[value];
			}
			return list;
		}, 
		el.funcPutSearchList = (list) => {
			var 
			eleSelectBoxSearchListParent = $('.select_box_search_list_parent', el), 
			eleSelectBoxSearchList = $('.select_box_search_list', el), 
			list = el.funcSortObject(
				list, 
				configs.sort, 
				configs.sortPosition 
			);
			eleSelectBoxSearchList.empty();
			eleSelectBoxSearchListParent.show();
			for(var i = 0, l = list.length;i < l;++i)
			eleSelectBoxSearchList.append('\
				<li>\
					<span class="select_box_search_select_trigger" data-select-box-value="' + el.funcHtmlspecialchars(list[i].key) + '">' + el.funcHtmlspecialchars(list[i].value) + '</span>\
				</li>\
			');
		}, 
		el.funcAddEventListenerSearchList = () => {
			var 
			eleSelectBoxSearchSelectTrigger = $('.select_box_search_select_trigger', el);
			eleSelectBoxSearchSelectTrigger.on({
				'click':function(){
					var 
					dataSelectBoxValue = $(this).attr('data-select-box-value');
					el.funcExecuteSelect(dataSelectBoxValue);
				} 
			});
		}, 
		el.funcResizeSelectBoxSearchList = (callback) => {
			var 
			eleSelectBoxSearchListParent = $('.select_box_search_list_parent', el), 
			eleSelectBoxSearchList = $('.select_box_search_list', eleSelectBoxSearchListParent);
			eleSelectBoxSearchListParent
			.stop()
			.animate(
				{
					'height':eleSelectBoxSearchList.outerHeight(true) 
				}, 
				configs.speedAnimationHeight, 
				() => {
					if(typeof callback === 'function')
					callback();
				} 
			);
		}, 
		el.funcInitSelectBoxSearchList = () => {
			var 
			eleSelectBoxSearchList = $('.select_box_search_list', el);
			eleSelectBoxSearchList.empty();
			el.funcResizeSelectBoxSearchList(() => {
				var 
				eleSelectBoxSearchListParent = $('.select_box_search_list_parent', el);
				eleSelectBoxSearchListParent.hide();
			});
		}, 
		el.funcAddEventListenerSelectList = (flagInit) => {
			var 
			eleSelectBoxSelectItemParent = $('.select_box_select_item_parent', el), 
			eleSelectBoxSelectTrigger = $('.select_box_select_trigger', el);
			if(flagInit){
				eleSelectBoxSelectItemParent.on({
					'click':(e) => {
						e.stopPropagation();
						if(
							configs.flagDisabled || 
							flagAnimate 
						)
						return false;
						flagAnimate = true;
						el.funcShowSelectBoxSelectList(() => {
							var 
							win = $(window);
							win.on({
								'click.selectBox':() => {
									if(flagAnimate)
									return false;
									flagAnimate = true;
									el.funcHideSelectBoxSelectList(() => {
										win.off('click.selectBox');
										flagAnimate = false;
									});
								} 
							});
							flagAnimate = false;
						});
					} 
				});
				if(configs.flagSearchForm){
					var 
					eleSelectBoxSearchInput = $('.select_box_search_input', el);
					eleSelectBoxSearchInput.on({
						'focus keyup':function(){
							var 
							valKeyword = $(this).val();
							el.funcPutSearchList(
								el.funcGetSearchList(valKeyword) 
							);
							el.funcAddEventListenerSearchList();
							el.funcResizeSelectBoxSearchList();
						}, 
						'blur':() =>{
							setTimeout(
								el.funcInitSelectBoxSearchList, 
								configs.setTimeInitSelectBoxSearchList 
							);
						} 
					});
				}
			}
			eleSelectBoxSelectTrigger.on({
				'click':function(){
					if($(this).hasClass(configs.classNameSelectBoxSelectTriggerDisabled))
					return false;
					var 
					dataSelectBoxValue = $(this).attr('data-select-box-value');
					el.funcExecuteSelect(dataSelectBoxValue);
				} 
			});
		}, 
		el.funcCustomEvents = () => {
			el.on({
				'selectBox.change':(
					e, 
					value 
				) => {
					el.funcExecuteSelect(value);
				}, 
				'selectBox.disabled':(
					e, 
					disabled 
				) => {
					if(disabled === 'toggle')
					disabled = configs.flagDisabled?false:true;
					configs.flagDisabled = disabled;
					var 
					eleSelectBoxInner = $('.select_box_inner', el), 
					eleSelectBoxSearchInput = $('.select_box_search_input', el), 
					win = $(window);
					eleSelectBoxSearchInput.prop(
						'disabled', 
						configs.flagDisabled 
					);
					if(configs.flagDisabled){
						el.funcInitSelectBoxSearchList();
						el.funcHideSelectBoxSelectList(() => {
							win.off('click.selectBox');
							flagAnimate = false;
						});
						eleSelectBoxInner.addClass(configs.classNameSelectBoxDisabled);
					}else 
					if(eleSelectBoxInner.hasClass(configs.classNameSelectBoxDisabled)){
						eleSelectBoxInner.removeClass(configs.classNameSelectBoxDisabled);
					}
				}, 
				'selectBox.resetList':(
					e, 
					args 
				) => {
					if(typeof args.list === 'object')
					configs.list = args.list;
					if(typeof args.selectValue === 'string')
					configs.selectValue = args.selectValue;
					if(typeof args.disabledList === 'object')
					configs.disabledList = args.disabledList;
					el.funcPutSelectList();
					el.funcAddEventListenerSelectList(false);
				}, 
				'selectBox.init':(e) => {
					el.funcInitSelectBox();
				}, 
				'selectBox.reset':(
					e, 
					args 
				) => {
					configs = $.extend(
						{}, 
						configs, 
						args 
					);
					el.funcInitSelectBox();
					el.funcPutSelectBox();
					el.funcPutInputAttr();
					el.funcPutSelectList();
					el.funcAddEventListenerSelectList(true);
				} 
			});
		}, 
		el.funcShowSelectBoxSelectList = (callback) => {
			var 
			eleSelectBoxSelectListParent = $('.select_box_select_list_parent', el), 
			eleSelectBoxSelectList = $('.select_box_select_list', eleSelectBoxSelectListParent), 
			eleSelectBoxSelectItemPointer = $('.select_box_select_item_pointer', el);
			if(eleSelectBoxSelectItemPointer.hasClass(configs.classNameSelectBoxSelectItemPointerHideAnimate))
			eleSelectBoxSelectItemPointer
			.removeClass(configs.classNameSelectBoxSelectItemPointerHideAnimate);
			eleSelectBoxSelectItemPointer
			.addClass(configs.classNameSelectBoxSelectItemPointerShowAnimate);
			eleSelectBoxSelectListParent
			.stop()
			.show()
			.animate(
				{
					'height':eleSelectBoxSelectList.outerHeight(true) 
				}, 
				configs.speedAnimationHeight, 
				() => {
					if(typeof callback === 'function')
					callback();
				} 
			);
		}, 
		el.funcHideSelectBoxSelectList = (callback) => {
			var 
			eleSelectBoxSelectListParent = $('.select_box_select_list_parent', el), 
			eleSelectBoxSelectItemPointer = $('.select_box_select_item_pointer', el);
			if(eleSelectBoxSelectItemPointer.hasClass(configs.classNameSelectBoxSelectItemPointerShowAnimate))
			eleSelectBoxSelectItemPointer
			.removeClass(configs.classNameSelectBoxSelectItemPointerShowAnimate)
			.addClass(configs.classNameSelectBoxSelectItemPointerHideAnimate);
			eleSelectBoxSelectListParent
			.stop()
			.animate(
				{
					'height':0 
				}, 
				configs.speedAnimationHeight, 
				() => {
					eleSelectBoxSelectListParent.hide();
					if(typeof callback === 'function')
					callback();
				} 
			);
		}, 
		el.funcGetListIndex = (value) => {
			var 
			eleSelectBoxSelectList = $('.select_box_select_list > li', el), 
			index = -1;
			eleSelectBoxSelectList.each(function(i){
				var 
				eleSelectBoxSelectTrigger = $('> .select_box_select_trigger', this), 
				dataSelectBoxValue = eleSelectBoxSelectTrigger.attr('data-select-box-value');
				if(dataSelectBoxValue == value){
					index = i;
					return false;
				}
			});
			return index;
		}, 
		el.funcExecuteSelect = (value) => {
			if(
				configs.flagDisabled || 
				value === configs.selectValue || 
				typeof configs.list[value] === 'undefined' 
			)
			return false;
			var 
			eleSelectBoxSelectItem = $('.select_box_select_item', el);
			if(configs.input)
			var 
			eleSelectBoxInput = $('input[type="hidden"]', el);
			eleSelectBoxSelectItem.html(el.funcHtmlspecialchars(configs.list[value]));
			if(configs.input)
			eleSelectBoxInput
			.val(el.funcHtmlspecialchars(value))
			.attr(
				'data-input-text', 
				el.funcHtmlspecialchars(configs.list[value]) 
			);
			el.funcResetClassSelectTrigger(
				configs.selectValue, 
				value 
			);
			configs.selectValue = value;
			configs.funcChangeCallback(
				value, 
				configs.list[value] 
			);
		}, 
		el.funcResetClassSelectTrigger = (
			prevValue, 
			nextValue 
		) => {
			if(prevValue !== false){
				let 
				selectIndexPrev = el.funcGetListIndex(prevValue);
				if(selectIndexPrev !== -1){
					let 
					eleSelectBoxSelectTriggerPrev = $('.select_box_select_list > li', el).eq(selectIndexPrev).find('> .select_box_select_trigger');
					if(eleSelectBoxSelectTriggerPrev.hasClass(configs.classNameSelectBoxActiveTrigger))
					eleSelectBoxSelectTriggerPrev.removeClass(configs.classNameSelectBoxActiveTrigger);
				}
			}
			let 
			selectIndexNext = el.funcGetListIndex(nextValue);
			if(selectIndexNext === -1)
			return false;
			let 
			eleSelectBoxSelectTriggerNext = $('.select_box_select_list > li', el).eq(selectIndexNext).find('> .select_box_select_trigger');
			if(
				$.inArray(
					nextValue, 
					configs.disabledList 
				) === -1 
			)
			eleSelectBoxSelectTriggerNext.addClass(configs.classNameSelectBoxActiveTrigger);
		};
		el.funcInit();
		return this;
	};
})(jQuery);
/*----------------------------- /select_box -----------------------------*/