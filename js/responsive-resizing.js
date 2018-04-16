(function ($) {

  var iframes = {};
  var imgs
  
	$(document).ready(function(){
  	
  	$('.grapesjs-editable-field iframe:not(.ignore-resize)').each (function () {
    	
			var src = $(this).attr('src');
			var w = $(this).attr('width');
			var h = $(this).attr('height');
			
			if (typeof (src) == 'undefined') {
				return;
			}
			if (typeof (w) == 'undefined') {
				w = $(this).width();
			}
			if (typeof (h) == 'undefined') {
				h = $(this).height();
			}
			
			iframes[src] = {
				w: w,
				h: h
			};
			
			pw = $(this).parent().width();
			if (pw < w) {
				var nh = h/w * pw;
				$(this).width('100%');
				$(this).height(nh);
			}
		
		});
  
    $('.grapesjs-editable-field img:not(.ignore-resize)').each (function () {

    	var src = $(this).attr('src');
			var w = $(this).attr('width');
			var h = $(this).attr('height');
			var pl = $(this).css('padding-left');
			var pr = $(this).css('padding-right');
			var ml = $(this).css('margin-left');
			var mr = $(this).css('margin-right');
			
			if (typeof (src) != 'string' || src == '') {
				return;
			}
			if (typeof (w) == 'undefined') {
				w = $(this)[0].naturalWidth;
			}
			else if (typeof (w) == 'string') {
				w = parseInt(w);
				if (w == 'NaN') {
					w = $(this)[0].naturalWidth;
				}
			}
			if (typeof (h) == 'undefined') {
				h = $(this)[0].naturalHeight;
			}
			else if (typeof (h) == 'string') {
				h = parseInt(h);
				if (h == 'NaN') {
					h = $(this)[0].naturalHeight;
				}
			}
			if (typeof (pl) == 'string') {
				pl = parseInt(pl.replace('px',''));
			}
			else {
				pl = 0;
			}
			if (typeof (pr) == 'string') {
				pr = parseInt(pr.replace('px',''));
			}
			else {
				pr = 0;
			}
			if (typeof (ml) == 'string') {
				ml = parseInt(ml.replace('px',''));
			}
			else {
				ml = 0;
			}
			if (typeof (mr) == 'string') {
				mr = parseInt(mr.replace('px',''));
			}
			else {
				mr = 0;
			}

			imgs[src] = {
				w: w,
				h: h,
				pl: pl,
				pr: pr,
				ml: ml,
				mr: mr
			};

			var imgW = ml + pl + w + pr + ml;
			var p = $(this).parent();
			var pt = $(p).css('display');
			while (pt == 'inline') {
				p = $(p).parent();
				pt = $(p).css('display');
			}
			pw = $(p).width();			
			
			if (pw == 0) {
				pw = imgW;
			}
			
			if (pw < imgW) {
				var nh = h/w * pw;
				$(this).width('100%');
				$(this).height(nh);
				$(this).css('margin-left', 0);
				$(this).css('padding-left', 0);
				$(this).css('padding-right', 0);
				$(this).css('margin-right', 0);
			}
		
		});
		
		$(window).resize(function(){
  		
  		$('.grapesjs-editable-field iframe:not(.ignore-resize)').each (function () {
				
				var src = $(this).attr('src');
				
				if (typeof (src) == 'undefined' || typeof (iframes[src]) == 'undefined') {
					return;
				}
				
				var h = iframes[src].h;
				var w = iframes[src].w;
				pw = $(this).parent().width();

				if (pw < w) {
					var nh = h/w * pw;
					$(this).width('100%');
					$(this).height(nh);
				}
				else {
					$(this).width(w);
					$(this).height(h);
				}
				
			});
			
			$('.grapesjs-editable-field img:not(.ignore-resize)').each (function () {
				
				var src = $(this).attr('src');
				if (typeof (src) != 'string' || src == '' || typeof (imgs[src]) == 'undefined') {
					return;
				}
				var h = imgs[src].h;
				var w = imgs[src].w;
				var pl = imgs[src].pl;
				var pr = imgs[src].pr;
				var ml = imgs[src].ml;
				var mr = imgs[src].mr;
				var imgW = ml + pl + w + pr + ml;
				
				
				var p = $(this).parent();
				var pt = $(p).css('display');
				while (pt == 'inline') {
					p = $(p).parent();
					pt = $(p).css('display');
				}
				
				pw = $(p).width();

				if (pw == 0) {
					pw = imgW;
				}
				
				if (pw < imgW) {
					var nh = h/w * pw;
					$(this).width('100%');
					$(this).height(nh);
					$(this).css('margin-left', 0);
					$(this).css('padding-left', 0);
					$(this).css('padding-right', 0);
					$(this).css('margin-right', 0);
				}
				else {
					$(this).width(w);
					$(this).height(h);
					$(this).css('margin-left', ml);
					$(this).css('padding-left', pl);
					$(this).css('padding-right', pr);
					$(this).css('margin-right', mr);
				}
			});
			
					
		});
		
	});

})(jQuery);