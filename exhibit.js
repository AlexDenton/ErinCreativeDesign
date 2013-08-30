$(document).ready(function () {

    // get swipe working
    // css transitions / animations
    // background texture
    // adjust drop shadows
    // cutting off letters?
    // resizing screws up picture dimensions / fixed by refresh

    // Important
    // social media
    // body font javascript
    // circle things
    // Fix IE
	var $window= $(window);
    var defaultAnimationTime = 700;

    Hammer(window).on('swipe', function(e) {
        // alert('swiped!');
    });

	$window
        .load(function(e) {
            var size = 100 + ($window.height - 800) * .064
            $('body').css('font-size', size + '%');
        })
        .bind('mousewheel MozMousePixelScroll', function (e) {
            e.preventDefault();
            var $attention = $('.attention');
            var $next = $($('.attention').next());
            var $prev = $($('.attention').prev());
            var wheelDelta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

            if (wheelDelta / 120 > 0 && $prev.length !== 0) {
                tryGiveAttention([$prev]);
            } 
            
            if (wheelDelta / 120 < 0 && $next.length !== 0) {
                tryGiveAttention([$next]);
            }
        })
        .keydown(function (e) {
            e.preventDefault();
            var $attention = $('.attention');
            var $next = $($attention.next('section'));
            var $prev = $($attention.prev('section'));
            var $attentionH = $attention.find('.attentionH');
            var $nextH = $($attentionH.next().next());
            var $prevH = $($attentionH.prev().prev());

            if (e.keyCode === 38 && $prev.length !== 0) {
                tryGiveAttention([$prev]);
            } 
            
            if (e.keyCode === 40 && $next.length !== 0) {
                tryGiveAttention([$next]);
            }

            if (e.keyCode === 39 && $nextH.length !== 0) {
                tryGiveAttentionH([$nextH]);
            }

            if (e.keyCode === 37 && $prevH.length !== 0) {
                tryGiveAttentionH([$prevH]);
            }
        })
        .resize(function () {
            var $attention = $('.attention');
            var $attentionH = $attention.find('.attentionH');
            $attention.find('.wall').position().left = -$attentionH.position().left; 
            $window.scrollTop($attention.position().top);
            var size = 100 + ($window.height() - 800) * .064
            console.log($window.height());
            $('body').css('font-size', size + '%');
        })
        .scroll(function (e) {
            fixAttention();
        })
        .mouseup(function (e)  {
            giveAttention($('.attention'));
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
        };
        
    $('h2').click(function () {
        tryGiveAttention([$(this).parent()]);
    });

    $('.piece').click(function () {
        tryGiveAttentionH([$(this)]);
    });

    function giveAttentionH($needy) {
        var $attention = $('.attention');
        var $attentionH = $attention.find('.attentionH');
        var $wall = $needy.parent();

        $wall.animate(
            {left: -$needy.position().left},
            700);
        $attentionH.removeClass('attentionH');
        $needy.addClass('attentionH');
    }

    function giveAttention($needy) {
        var $attention = $('.attention');
        $('body,html').animate(
            {scrollTop: $needy.position().top}, 
            700);
        $attention.removeClass('attention');
        $needy.addClass('attention');
    }

    function oncePer(fn, period) {
        var canRun = true;
        return function (args) {
            if (canRun) {
                canRun = false;
                fn.apply(this, args);
                window.setTimeout(
                    function() { 
                        canRun = true; 
                    }, period);
            }
        }
    }

    var tryGiveAttention = oncePer(giveAttention, 500); 
    var tryGiveAttentionH = oncePer(giveAttentionH, 500); 

});
