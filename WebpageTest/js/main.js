$(document).ready(function () {

	$('h1, h2, h3, h4, h5, h6')
		.attr('data-300', 'color:rgb(246, 105, 51)')
		.attr('data-100p', 'color:rgb(80, 100, 180)');

	var s = skrollr.init();

	$('.menu a').click(function(e){
		e.preventDefault();
		var scrollPos = $(window).scrollTop();
		var targetPos = $($(this).attr('href')).offset().top;

		var distance = Math.abs(scrollPos-targetPos);
		var speed = 2;
		var time = distance/speed;

		$("html, body").stop().animate({
			scrollTop: targetPos
		}, time, 'easeInOutQuad');
	});
});