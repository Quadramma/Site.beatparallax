$(document).ready(function(){
	
	//Beatbox stuff
	swfsound.embedSWF('swfsound/swfsound.swf');
	
	var playSound = function(drum) {
			var sound = swfsound.loadSound( 'mp3/' + drum + '.mp3', true);
		},
		kit = 1,
		changeKit = function() {
			kit = kit < 3 ? kit+1 : 1;
			$.each($('#controls a'), function(){
				$(this).attr('href', $(this).attr('href').slice(0,-1) + kit);
			});
			$('img#kit').attr('src','images/design/kit' + kit + '.png');
		};
		
	$('#controls a').click(function(e){
		e.preventDefault();
		var control = $(this),
			drum = control.attr('href').slice(1);
		playSound(drum);
		control.addClass('on');
		$('.dynImg').addClass('on');
		var removeOn = setTimeout(function(){
			control.removeClass('on');
			$('.dynImg').removeClass('on');
		},100);
	});
	
	$('#legend ul li:lt(4) a').click(function(e){
		e.preventDefault();
		$('#controls a:eq(' + $(this).parent().index() + ')').click();
	});
	
	$('#legend ul a[href="#kit"]').click(function(e){
		e.preventDefault();
		changeKit();
	});
	
	$('body').keydown(function(e){
		if (e.keyCode >= 70 && e.keyCode <= 74 && e.keyCode !== 73) {
			e.preventDefault();
			e.keyCode = e.keyCode === 74 ? 73 : e.keyCode;
			$('#controls a:eq(' + (parseInt(e.keyCode)-70) + ')').click();
		}else if (e.keyCode === 18) {
			e.preventDefault();
			changeKit();
		}else if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
			var activePage = getActivePage();
			if (e.keyCode === 38) {
				if (activePage.attr('id') == $('.page:first').attr('id')) {
					activePage = activePage.next();
				}
				scrollPage(activePage.prev().attr('id'));
			}else{
				if (activePage.attr('id') == $('.page:last').attr('id')) {
					activePage = activePage.prev();
				}
				scrollPage(activePage.next().attr('id'));
			}
		}
	});
	
	//Preload sound
	var filesLoaded = 0,
		finishedLoading = true,
		fileLoaded = function(){
			filesLoaded = filesLoaded +1;
			var percentLoaded = (filesLoaded/(sounds.length+images.length))*100;
			$('#loading #bar').css('width',percentLoaded+'%');
			if (percentLoaded===100) {
				finishedLoading = true;
					var sound = swfsound.loadSound( 'mp3/intro.mp3',true);
					var posCheck = setInterval(function(){
						if (swfsound.getPosition(sound)>0) {
							introAnimation();
							clearInterval(posCheck);
						}
					},10);
			}
		},
		introAnimation = function(){
			$crest = $('.crest');
			$crest.css('background-position','left -315px');
			setTimeout(function(){
				$crest.css('background-position','left 0px');
				setTimeout(function(){
					$crest.css('background-position','left -315px');
					setTimeout(function(){
						$crest.css('background-position','left 0px');
						setTimeout(function(){
							$crest.css('background-position','left -315px');
							setTimeout(function(){
								$crest.css('background-position','left 0px');
								setTimeout(function(){
									$crest.css('background-position','left -315px');
									setTimeout(function(){
										$crest.css('background-position','left 0px');
										$('#left').animate({
											'left': '-50%'
										},600);
										$('#right').animate({
											'right': '-50%'
										},600,function(){
											$('#intro').hide();
										});
										$('#loading').animate({
											'bottom': '-10px'
										});
									},100);
								},500);
							},100);
						},500);
					},100);
				},500);
			},100);	
		},
		sounds = [
			'bass1.mp3',
			'snare1.mp3',
			'hat1.mp3',
			'tom1.mp3',
			'bass2.mp3',
			'snare2.mp3',
			'hat2.mp3',
			'tom2.mp3',
			'bass3.mp3',
			'snare3.mp3',
			'hat3.mp3',
			'tom3.mp3',
			'intro.mp3'
		],
		images = [];
		
	$.each($('.page:not(:first) img'),function(){
		images.push($(this).attr('src').replace('design','design/sprites'));
	});
	
	swfsound.onload = function() {
		for (var k in sounds) {
			$.ajax({
		        url: 'mp3/' + sounds[k],
		        success: function() {
		            fileLoaded();
		        }
		    });
		}
		for (var i in images) {
			$.ajax({
		        url: images[i],
		        success: function() {
		            fileLoaded();
		        }
		    });
		}
	};
	
	//Resizing stuff
	var $scrollBody = !$('body').scrollTop() ? $('html') : $('body'),
		getScrollTop = function(){
		    if(typeof pageYOffset!= 'undefined'){
		        //most browsers
		        return pageYOffset;
		    }
		    else{
		        var B= document.body; //IE 'quirks'
		        var D= document.documentElement; //IE with doctype
		        D= (D.clientHeight)? D: B;
		        return D.scrollTop;
		    }
		},
		pageOffsets = [],
		wH = 0,
		adjustPages = function(w,h){
			wH = h;
			$('.page').css({
				'width': w + 'px',
				'height': h + 'px'
			}).find('.content, .wrapper').css({
				'height': h + 'px'
			});
			$('#historyBg').css({
				'width': w + 'px',
				'height': (h*2-150) + 'px',
				'top': (h*3-200) + 'px'
			});
			$.each($('.page'), function(k,v){
				pageOffsets[k] = $(this).offset().top;
			});
			$('#legend').css('top',h-$('#legend').height()-40);
			$('#about .floating:eq(0)').css('top',h-$('#about .floating:eq(1)').height()+26);
			$('#order .floating:eq(2)').css('top',h-$('#order .floating:eq(2)').height()-51);
			$('#order .floating:eq(3)').css('top',h-$('#order .floating:eq(3)').height()-42);
		},
		adjustLayers = function(){
			$.each($('.page'), function(){
				var pageOffset = $(this).offset().top - getScrollTop();
				$.each($(this).find('.floating'),function(){
					var rate = $(this).index() === 4 ? 4 : $(this).index()+1;
					$(this).css('margin-top', (pageOffset/rate)+'px');
				});
			});
		},
		getActivePage = function(){
			var activePage = undefined;
			for (var k in pageOffsets) {
				if ((getScrollTop()+(wH/2)) < pageOffsets[k]) {
					activePage = $('.page:eq(' + (k-1) + ')');
					break;
				}
				if (!activePage) {
					activePage = $('.page:last');
				}
			}
			return activePage;
		},
		setNav = function(){
			var activePage = getActivePage(),
				activeId = activePage.attr('id');
			if (getScrollTop()+100 >= pageOffsets[3]) {
				$('ul#nav').addClass('light');
			}else{
				$('ul#nav').removeClass('light');
			}
			$('ul#nav li').removeClass('active');
			$('ul#nav li a[href="#' + activeId + '"]').parent().addClass('active');
		}
		
	$(window).resize(function(){
		adjustPages($(this).width(),$(this).height());
		adjustLayers();
		setNav();
	}).resize().load(function(){
		adjustPages($(this).width(),$(this).height());
	}).scroll(function(){
		//Nav highlighting
		setNav();
		adjustLayers();
		$('#barber #pattern').css('background-position', 'left '+(getScrollTop()*-1)+'px');
	});
	
	$('.page:not(:first)').imagesLoaded(function($images){
		$.each($images, function(){
			$(this).replaceWith('<div class="dynImg floating" style="width:' + $(this).width() + 'px;height:' + $(this).height() + 'px;background-image:url(\'' + $(this).attr('src').replace('design','design/sprites') + '\')">&nbsp;</div>');
		});
		$(window).resize();
	});
	
	//Navigation stuff
	var scrollPage = function(destination) {
		$('body,html').stop().animate({
			'scrollTop':$('.page#' + destination).offset().top
		},2000);
	}
	$('ul#nav a').click(function(e){
		e.preventDefault();
		scrollPage($(this).attr('href').slice(1));
	});
	$('#legend ul a.arrow').click(function(e){
		e.preventDefault();
		var activePage = getActivePage();
		if ($(this).hasClass('up') === 38) {
			scrollPage(activePage.prev().attr('id'));
		}else{
			scrollPage(activePage.next().attr('id'));
		}
	});
	
});