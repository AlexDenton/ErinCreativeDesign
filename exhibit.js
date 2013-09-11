$(document).ready(function () {

    // get swipe working
    // css transitions / animations
    // background texture
    // adjust drop shadows
    // cutting off letters?
    // resizing screws up picture dimensions / fixed by refresh
    // Parallax
    // Look into setting width with javascript

    // REFACTOR
    // Use LESS / SASS

    // IMPORTANT
    // social media
    // Fix IE8 scrolling
    // Centering
    // I think the iPhone issues are just the result of a narrow view port
	var $window= $(window);
    var defaultAnimationTime = 700;

//    Hammer(window).on('swipe', function(e) {
//        // alert('swiped!');
//    });

	$window
        .load(function() {
            // Set the body font size for scaling
            var size = 100 + ($window.height - 800) * .064;
            $('body'). css('font-size', size + '%');

            // Populate the navigation dots
            $('.section').each(function () {
            	var section = this;
            	$($(this).find('.piece').get().reverse()).each(function () {
            		var piece = this;
            		var circle;
            		
            		if ($(piece).hasClass('attentionH')) {
            			circle = $('<div class="icon-circle dot"></div>');
            		} else {
            			circle = $('<div class="icon-circle-blank dot"></div>');
            		}

            		circle.click(function () { 
            			tryGiveAttentionH($(piece));
            		});
            		
            		$(section).find('h2').after(circle);
            	});
            });
        })
        .bind('DOMMouseScroll mousewheel MozMousePixelScroll', function (e) {
            e.preventDefault();
            var $attention = $('.attention');
            var $next = $($attention.next());
            var $prev = $($attention.prev());
            var wheelDelta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

            if (wheelDelta / 120 > 0 && $prev.length !== 0) {
                tryGiveAttention($prev);
            } 
            
            if (wheelDelta / 120 < 0 && $next.length !== 0) {
                tryGiveAttention($next);
            }
        })
        .keydown(function (e) {
            e.preventDefault();
            var $attention = $('.attention');
            var $next = $($attention.next('.section'));
            var $prev = $($attention.prev('.section'));
            var $attentionH = $attention.find('.attentionH');
            var $nextH = $($attentionH.next());
            var $prevH = $($attentionH.prev());

            if (e.keyCode === 38 && $prev.length !== 0) {
                tryGiveAttention($prev);
            } 
            
            if (e.keyCode === 40 && $next.length !== 0) {
                tryGiveAttention($next);
            }

            if (e.keyCode === 39 && $nextH.length !== 0) {
                tryGiveAttentionH($nextH);
            }

            if (e.keyCode === 37 && $prevH.length !== 0) {
                tryGiveAttentionH($prevH);
            }
        })
        .resize(function () {
            var $attention = $('.attention');
            var $attentionH = $attention.find('.attentionH');
            $attention.find('.wall').position().left = -$attentionH.position().left; 
            $window.scrollTop($attention.position().top);
            var size = 100 + ($window.height() - 800) * .064;
            $('body').css('font-size', size + '%');
        })
        .scroll(function () {
            fixAttention();
        })
        .mouseup(function ()  {
            tryGiveAttention($('.attention'));
        });
    
        function fixAttention() {
            $('section').each(function () {
                var $this = $(this);
                var $attention = $('.attention');
                if ($this.position().top >= $window.scrollTop()) {
                    $attention.removeClass('attention');
                    $this.addClass('attention');
                    return false;
                }
            });
        }

    $('h2').click(function () {
        tryGiveAttention($(this).parent());
    });

    $('.piece').click(function () {
        tryGiveAttentionH($(this));
    });

    function giveAttentionH($needy) {
        var $attention = $('.attention');
        var $attentionH = $attention.find('.attentionH');
        var $wall = $needy.parent();
        var $section = $wall.parent();
        var $dots = $section.find('.dot');
        
        $section.find('.icon-circle').removeClass('icon-circle').addClass('icon-circle-blank');
        $($dots[$needy.index()]).addClass('icon-circle').removeClass('icon-circle-blank');

        $wall.animate(
            {left: -$needy.position().left},
            defaultAnimationTime);
        $attentionH.removeClass('attentionH');
        $needy.addClass('attentionH');
    }

    function giveAttention($needy) {
        var $attention = $('.attention');
        $('body,html').animate(
            {scrollTop: $needy.position().top}, 
            defaultAnimationTime);
        $attention.removeClass('attention');
        $needy.addClass('attention');
    }

    var tryGiveAttention = _.throttle(giveAttention, 500, {'leading': true, 'trailing': false});
    var tryGiveAttentionH = _.throttle(giveAttentionH, 500, {'leading': true, 'trailing': false});
});
