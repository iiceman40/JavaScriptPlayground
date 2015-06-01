$(document).ready(function () {

	// make all icons pop into the screen
	$('.icon').each(function(){
		$(this).delay(Math.random() * 1500 + 2000).animate({
			opacity: 1,
			width: '3em',
			height: '3em',
			'left': '-=0.5em',
			'top': '-=0.5em'
		}, 500, 'easeOutElastic', function(){
			// save the elements original position
			var position = $(this).position();
			$(this).data('originalPos', {x: position.left, y: position.top});
		});
	});

	initVisoAnimation();

	// test for open face animation
	setTimeout(function () {
		openFace();
	}, 7000);

});

function initVisoAnimation(){
	var speedModifier = 30;
	var escapeDistance = 200;
	var returnDistance = 0;
	var forceReturnDistance = 50;
	var stopForceReturnDistance = 10;

	// find mouse position and store in global variable
	var e = {left: 0, top: 0};
	$(document).bind('mousemove', function (event) {
		e = event;
	});

	// icon movement
	setInterval(function () {

		$('.icon-container.left, .icon-container.right').find('.icon').each(function () {
			var el = $(this);

			if(el.data('originalPos') == undefined){
				//console.log('original position is undefined');
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
}

function openFace() {
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