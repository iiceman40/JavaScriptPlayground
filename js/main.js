$(document).ready(function () {
    //$('.left-side .brace').animate({
    //    right: '50%'
    //}, 3000);
    //$('.right-side .brace').animate({
    //    left: '50%'
    //}, 3000);
    //animateRotate($('.braces-wrapper'), -45, 3000);
	var amountOfIcons = 20;
	var variance = 20;
	var iconClasses = ["glyphicon-glass","glyphicon-music","glyphicon-search","glyphicon-envelope","glyphicon-heart","glyphicon-star","glyphicon-star-empty","glyphicon-user","glyphicon-film","glyphicon-th-large","glyphicon-th","glyphicon-th-list","glyphicon-ok","glyphicon-remove","glyphicon-zoom-in","glyphicon-zoom-out","glyphicon-off","glyphicon-signal","glyphicon-cog","glyphicon-trash","glyphicon-home","glyphicon-file","glyphicon-time","glyphicon-road","glyphicon-download-alt","glyphicon-download","glyphicon-upload","glyphicon-inbox","glyphicon-play-circle","glyphicon-repeat","glyphicon-refresh","glyphicon-list-alt","glyphicon-lock","glyphicon-flag","glyphicon-headphones","glyphicon-volume-off","glyphicon-volume-down","glyphicon-volume-up","glyphicon-qrcode","glyphicon-barcode","glyphicon-tag","glyphicon-tags","glyphicon-book","glyphicon-bookmark","glyphicon-print","glyphicon-camera","glyphicon-font","glyphicon-bold","glyphicon-italic","glyphicon-text-height","glyphicon-text-width","glyphicon-align-left","glyphicon-align-center","glyphicon-align-right","glyphicon-align-justify","glyphicon-list","glyphicon-indent-left","glyphicon-indent-right","glyphicon-facetime-video","glyphicon-picture","glyphicon-pencil","glyphicon-map-marker","glyphicon-adjust","glyphicon-tint","glyphicon-edit","glyphicon-share","glyphicon-check","glyphicon-move","glyphicon-step-backward","glyphicon-fast-backward","glyphicon-backward","glyphicon-play","glyphicon-pause","glyphicon-stop","glyphicon-forward","glyphicon-fast-forward","glyphicon-step-forward","glyphicon-eject","glyphicon-chevron-left","glyphicon-chevron-right","glyphicon-plus-sign","glyphicon-minus-sign","glyphicon-remove-sign","glyphicon-ok-sign","glyphicon-question-sign","glyphicon-info-sign","glyphicon-screenshot","glyphicon-remove-circle","glyphicon-ok-circle","glyphicon-ban-circle","glyphicon-arrow-left","glyphicon-arrow-right","glyphicon-arrow-up","glyphicon-arrow-down","glyphicon-share-alt","glyphicon-resize-full","glyphicon-resize-small","glyphicon-plus","glyphicon-minus","glyphicon-asterisk","glyphicon-exclamation-sign","glyphicon-gift","glyphicon-leaf","glyphicon-fire","glyphicon-eye-open","glyphicon-eye-close","glyphicon-warning-sign","glyphicon-plane","glyphicon-calendar","glyphicon-random","glyphicon-comment","glyphicon-magnet","glyphicon-chevron-up","glyphicon-chevron-down","glyphicon-retweet","glyphicon-shopping-cart","glyphicon-folder-close","glyphicon-folder-open","glyphicon-resize-vertical","glyphicon-resize-horizontal","glyphicon-hdd","glyphicon-bullhorn","glyphicon-bell","glyphicon-certificate","glyphicon-thumbs-up","glyphicon-thumbs-down","glyphicon-hand-right","glyphicon-hand-left","glyphicon-hand-up","glyphicon-hand-down","glyphicon-circle-arrow-right","glyphicon-circle-arrow-left","glyphicon-circle-arrow-up","glyphicon-circle-arrow-down","glyphicon-globe","glyphicon-wrench","glyphicon-tasks","glyphicon-filter","glyphicon-briefcase","glyphicon-fullscreen"];

	for(var i=0; i<amountOfIcons; i++) {
		var top = 50 + (Math.random() * variance - variance/2);
		var left1 = Math.random() * 10 + 28;
		var left2 = Math.random() * 10 + 60.5;

		var left = left1;
		if(Math.random() > 0.5){
			left = left2;
		}

		var iconClass = iconClasses[Math.floor(Math.random() * iconClasses.length)];

		var el = $(
			'<div class="icon" id="icon' + i +'" style="top: ' + top + '%; left: ' + left + '%;" data-moving="false">' +
				'<span class="glyphicon ' + iconClass + '"></span>' +
			'</div>'
		);

		$('.icon-container').append(el);
		var offset = el.offset();
		el.data('originalPos', {x: offset.left, y: offset.top});
	}

	var modifier = 30;
	var excapeDistance = 200;
	var returnDistance = 0;

	var e = {left: 0, top: 0};
	$(document).bind('mousemove',function(event){
		e = event;
	});

	setInterval(function() {

		$('.icon-container').find('.icon').each(function () {
			var el = $(this);
			var offset = el.offset();
			var moveVector = {
				x: offset.left - e.pageX,
				y: offset.top - e.pageY
			};

			if (Math.abs(moveVector.x) + Math.abs(moveVector.y) < excapeDistance) {
				// try to avoid cursor
				$(this).css({
					top: offset.top + moveVector.y / modifier,
					left: offset.left + moveVector.x / modifier
				});
			} else {
				// move back to original position
				originalPos = el.data('originalPos');
				var moveBackVector = {
					x: originalPos.x - offset.left,
					y: originalPos.y - offset.top
				};

				console.log(moveBackVector, el.attr('id'));

				if (Math.abs(moveBackVector.x) + Math.abs(moveBackVector.y) > returnDistance) {
					el.css({
						top: offset.top + moveBackVector.y / modifier,
						left: offset.left + moveBackVector.x / modifier
					});
				}
			}
		});
		//});
	}, 20);

});

/*
function animateRotate(elem, angle, time) {
    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: 0}).animate({deg: angle}, {
        duration: time,
        step: function (now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}
*/