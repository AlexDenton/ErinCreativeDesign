$(document).ready(function () {

    // TODO
    // Bigger logo image
    // Picture icons?
    // get swipe working
    // css transitions / animations / fallbacks
    // background texture? parallax?
    // resizing screws up picture dimensions / fixed by refresh
    // Look into setting width with javascript
    // Centering
    // I think the iPhone issues are just the result of a narrow view port

    // REFACTOR
    // angular

    // IMPORTANT
    // mobile site
    // suggest using keys / modern browser (modernizr)
	var $window= $(window);
    var defaultAnimationTime = 700;
    var defaultThrottleTime = 500;
    var defaultRotationTime = 10000;

//    Hammer(window).on('swipe', function(e) {
//        // alert('swiped!');
//    });

    window.toggleAbout = function toggleAbout() {
        var $aboutInfo = $('.about-info');
        var $arrowUp = $('.arrow-up');

        if ($aboutInfo.is(':visible')) {
            $aboutInfo.hide();
            $arrowUp.hide();
        } else {
            $aboutInfo.show();
            $arrowUp.show();
        }
    };

    function rotateSplash () {
        var $splash = $('.splash');
        var direction = 'forward';

        window.setInterval(function () {
            var $currentFocusedPiece = $splash.find('.focused-piece');
            var $nextH = $($currentFocusedPiece.next());
            var $prevH = $($currentFocusedPiece.prev());

            if (direction === 'forward') {
                if ($nextH.length === 0) {
                    direction = 'backward';
                    tryFocusPiece($prevH, $splash);
                } else {
                    tryFocusPiece($nextH, $splash);
                }
            } else if (direction === 'backward') {
               if ($prevH.length === 0) {
                   direction = 'forward';
                   tryFocusPiece($nextH, $splash);
               } else {
                   tryFocusPiece($prevH, $splash);
               }
            }
        }, defaultRotationTime);
    }

    $('body').mousewheel(function (e, delta) {
        e.preventDefault();
        var $currentFocusedSection = $('.focused-section');
        var $next = $($currentFocusedSection.next('.section'));
        var $prev = $($currentFocusedSection.prev('.section'));

        if (delta / 120 > 0 && $prev.length !== 0) {
            tryFocusSection($prev);
        }

        if (delta / 120 < 0 && $next.length !== 0) {
            tryFocusSection($next);
        }
    });

    $window
        .load(function() {
            // Set the body font size for scaling
            var size = 100 + ($window.height - 800) * .064;
            $('body').css('font-size', size + '%');
            if (window.navigator.userAgent.match(/iPhone/)) {
                $('html').css('overflow-x', 'hidden');
            }

            rotateSplash();

            // Populate the navigation dots
            $('.section').each(function () {
            	var section = this;
            	$($(this).find('.piece').get().reverse()).each(function () {
            		var piece = this;
            		var circle;
            		
            		if ($(piece).hasClass('focused-piece')) {
            			circle = $('<div class="icon-circle dot"></div>');
            		} else {
            			circle = $('<div class="icon-circle-blank dot"></div>');
            		}

            		circle.click(function () { 
            			tryFocusPiece($(piece), $(section));
            		});
            		
            		$(section).find('header').after(circle);
            	});
            });
        })
        .keydown(function (e) {
            e.preventDefault();
            var $currentFocusedSection = $('.focused-section');
            var $next = $($currentFocusedSection.next('.section'));
            var $prev = $($currentFocusedSection.prev('.section'));
            var $currentFocusedPiece = $currentFocusedSection.find('.focused-piece');
            var $nextH = $($currentFocusedPiece.next());
            var $prevH = $($currentFocusedPiece.prev());

            if (e.keyCode === 38 && $prev.length !== 0) {
                tryFocusSection($prev);
            } 
            
            if (e.keyCode === 40 && $next.length !== 0) {
                tryFocusSection($next);
            }

            if (e.keyCode === 39 && $nextH.length !== 0) {
                tryFocusPiece($nextH, $currentFocusedSection);
            }

            if (e.keyCode === 37 && $prevH.length !== 0) {
                tryFocusPiece($prevH, $currentFocusedSection);
            }
        })
        .resize(function () {
            var $currentFocusedSection = $('.focused-section');
            var $currentFocusedPiece = $currentFocusedSection.find('.focused-piece');
            $currentFocusedSection.find('.wall').position().left = -$currentFocusedPiece.position().left;
            $window.scrollTop($currentFocusedSection.position().top);
            var size = 100 + ($window.height() - 800) * .064;
            $('body').css('font-size', size + '%');
        })
        .scroll(function () {
            fixFocus();
        })
        .mouseup(function ()  {
            tryFocusSection($('.focused-section'));
        });
    
        function fixFocus() {
            $('.section').each(function () {
                var $this = $(this);
                var $attention = $('.focused-section');
                if ($this.position().top >= $window.scrollTop()) {
                    $attention.removeClass('focused-section');
                    $this.addClass('focused-section');
                    return false;
                }
            });
        }

    $('h2').click(function () {
        tryFocusSection($(this).parent());
    });

    $('.piece').click(function () {
        tryFocusPiece($(this), $('.focused-section'));
    });

    function focusPiece($newFocusedPiece, $section) {
        if ($newFocusedPiece) {
            var $currentFocusedPiece = $section.find('.focused-piece');
            var $wall = $newFocusedPiece.parent();
            var $dots = $section.find('.dot');

            $section.find('.icon-circle').removeClass('icon-circle').addClass('icon-circle-blank');
            $($dots[$newFocusedPiece.index()]).addClass('icon-circle').removeClass('icon-circle-blank');

            $wall.animate(
                {left: -$newFocusedPiece.position().left},
                defaultAnimationTime);
            $currentFocusedPiece.removeClass('focused-piece');
            $newFocusedPiece.addClass('focused-piece');
        }
    }

    function focusSection($newFocusedSection) {
        var $currentFocusedSection = $('.focused-section');
        $(document.documentElement).stop().animate(
            {scrollTop: $newFocusedSection.position().top},
            defaultAnimationTime);
        $currentFocusedSection.removeClass('focused-section');
        $newFocusedSection.addClass('focused-section');
    }

    var tryFocusSection = _.throttle(focusSection, defaultThrottleTime, {'leading': true, 'trailing': false});
    var tryFocusPiece = _.throttle(focusPiece, defaultThrottleTime, {'leading': true, 'trailing': false});
});