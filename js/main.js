$(document).ready(function () {
    $('.left-side .brace').animate({
        right: '50%'
    }, 3000);
    $('.right-side .brace').animate({
        left: '50%'
    }, 3000);
    animateRotate($('.braces-wrapper'), -45, 3000);
});

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