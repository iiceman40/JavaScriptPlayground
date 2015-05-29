$(document).ready(function () {
	var amountOfIcons = 30;
	var variance = 20;
	var iconClasses = ["glyphicon-glass", "glyphicon-music", "glyphicon-search", "glyphicon-envelope", "glyphicon-heart", "glyphicon-star", "glyphicon-star-empty", "glyphicon-user", "glyphicon-film", "glyphicon-th-large", "glyphicon-th", "glyphicon-th-list", "glyphicon-ok", "glyphicon-remove", "glyphicon-zoom-in", "glyphicon-zoom-out", "glyphicon-off", "glyphicon-signal", "glyphicon-cog", "glyphicon-trash", "glyphicon-home", "glyphicon-file", "glyphicon-time", "glyphicon-road", "glyphicon-download-alt", "glyphicon-download", "glyphicon-upload", "glyphicon-inbox", "glyphicon-play-circle", "glyphicon-repeat", "glyphicon-refresh", "glyphicon-list-alt", "glyphicon-lock", "glyphicon-flag", "glyphicon-headphones", "glyphicon-volume-off", "glyphicon-volume-down", "glyphicon-volume-up", "glyphicon-qrcode", "glyphicon-barcode", "glyphicon-tag", "glyphicon-tags", "glyphicon-book", "glyphicon-bookmark", "glyphicon-print", "glyphicon-camera", "glyphicon-font", "glyphicon-bold", "glyphicon-italic", "glyphicon-text-height", "glyphicon-text-width", "glyphicon-align-left", "glyphicon-align-center", "glyphicon-align-right", "glyphicon-align-justify", "glyphicon-list", "glyphicon-indent-left", "glyphicon-indent-right", "glyphicon-facetime-video", "glyphicon-picture", "glyphicon-pencil", "glyphicon-map-marker", "glyphicon-adjust", "glyphicon-tint", "glyphicon-edit", "glyphicon-share", "glyphicon-check", "glyphicon-move", "glyphicon-step-backward", "glyphicon-fast-backward", "glyphicon-backward", "glyphicon-play", "glyphicon-pause", "glyphicon-stop", "glyphicon-forward", "glyphicon-fast-forward", "glyphicon-step-forward", "glyphicon-eject", "glyphicon-chevron-left", "glyphicon-chevron-right", "glyphicon-plus-sign", "glyphicon-minus-sign", "glyphicon-remove-sign", "glyphicon-ok-sign", "glyphicon-question-sign", "glyphicon-info-sign", "glyphicon-screenshot", "glyphicon-remove-circle", "glyphicon-ok-circle", "glyphicon-ban-circle", "glyphicon-arrow-left", "glyphicon-arrow-right", "glyphicon-arrow-up", "glyphicon-arrow-down", "glyphicon-share-alt", "glyphicon-resize-full", "glyphicon-resize-small", "glyphicon-plus", "glyphicon-minus", "glyphicon-asterisk", "glyphicon-exclamation-sign", "glyphicon-gift", "glyphicon-leaf", "glyphicon-fire", "glyphicon-eye-open", "glyphicon-eye-close", "glyphicon-warning-sign", "glyphicon-plane", "glyphicon-calendar", "glyphicon-random", "glyphicon-comment", "glyphicon-magnet", "glyphicon-chevron-up", "glyphicon-chevron-down", "glyphicon-retweet", "glyphicon-shopping-cart", "glyphicon-folder-close", "glyphicon-folder-open", "glyphicon-resize-vertical", "glyphicon-resize-horizontal", "glyphicon-hdd", "glyphicon-bullhorn", "glyphicon-bell", "glyphicon-certificate", "glyphicon-thumbs-up", "glyphicon-thumbs-down", "glyphicon-hand-right", "glyphicon-hand-left", "glyphicon-hand-up", "glyphicon-hand-down", "glyphicon-circle-arrow-right", "glyphicon-circle-arrow-left", "glyphicon-circle-arrow-up", "glyphicon-circle-arrow-down", "glyphicon-globe", "glyphicon-wrench", "glyphicon-tasks", "glyphicon-filter", "glyphicon-briefcase", "glyphicon-fullscreen"];

	for (var i = 0; i < amountOfIcons; i++) {
		var top = 50 + (Math.random() * variance - variance / 2);
		var left = Math.random() * 100;
		var iconClass = iconClasses[Math.floor(Math.random() * iconClasses.length)];

		var el = $(
			'<div class="icon" id="icon' + i + '" style="top: ' + top + '%; left: ' + left + '%;">' +
			'<span class="glyphicon ' + iconClass + '"></span>' +
			'</div>'
		);

		// append element to the left or the right side
		var container = $('.icon-container-left');
		if (Math.random() > 0.5) {
			container = $('.icon-container-right');
		}
		container.append(el);

		el.delay(Math.random() * 1500 + 2000).animate({
			opacity: 1,
			width: '2em',
			height: '2em',
			'left': '-=0.5em',
			'top': '-=0.5em'
		}, 500, 'easeOutElastic', function(){
			// save the elements original position
			var position = $(this).position();
			$(this).data('originalPos', {x: position.left, y: position.top});
		});

	}

	var speedModifier = 30;
	var escapeDistance = 200;
	var returnDistance = 0;
	var forceReturnDistance = 100;
	var stopForceReturnDistance = 20;

	// find mouse position and store in global variable
	var e = {left: 0, top: 0};
	$(document).bind('mousemove', function (event) {
		e = event;
	});

	// icon movement
	setInterval(function () {

		$('.icon-container-left, .icon-container-right').find('.icon').each(function () {
			var el = $(this);

			if(el.data('originalPos') == undefined){
				return;
			}

			var parentOffset = $(this).parent().offset();

			// get current icon element, its position and move vector
			var position = el.position();
			var moveVector = {
				x: position.left - (e.pageX - parentOffset.left),
				y: position.top - (e.pageY - parentOffset.top)
			};
			var distanceToCursor = Math.abs(moveVector.x) + Math.abs(moveVector.y);

			// get original position of element
			var originalPos = el.data('originalPos');
			var moveBackVector = {
				x: originalPos.x - position.left,
				y: originalPos.y - position.top
			};
			var distanceToOriginalPosition = Math.abs(moveBackVector.x) + Math.abs(moveBackVector.y);

			// decide what way the icon should move
			if (distanceToCursor < escapeDistance && !el.data('ignoreMouse')) {

				// try to avoid cursor
				$(this).css({
					top: position.top + moveVector.y / speedModifier,
					left: position.left + moveVector.x / speedModifier
				});

				if (distanceToOriginalPosition > forceReturnDistance) {
					el.data('ignoreMouse', true);
				}

			} else {

				// move back to original position
				if (distanceToOriginalPosition > returnDistance && el.data('ignoreMouse')) {

					el.css({
						top: position.top + moveBackVector.y / speedModifier,
						left: position.left + moveBackVector.x / speedModifier
					});

				}

				if (distanceToOriginalPosition < stopForceReturnDistance) {
					el.data('ignoreMouse', false);
				}

			}

		});

	}, 20);

});


function openFace() {
	// TODO switch to static background??

	$('.face-left').animate({
		left: '-30%'
	}, 1000);
	$('.brace-left').animate({
		left: '-45%',
		top: '-45%'
	}, 1000);
	$('.face-right').animate({
		right: '-30%'
	}, 1000);
	$('.brace-right').animate({
		right: '-45%',
		top: '45%'
	}, 1000);
}

setTimeout(function () {
	openFace();
}, 7000);