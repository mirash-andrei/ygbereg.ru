import Swiper from 'swiper';

var swiper = new Swiper('.swiper-banners', {
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + '</span>';
        },
    },
});