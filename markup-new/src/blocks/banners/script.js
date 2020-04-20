import Swiper from 'swiper';

var swiper = new Swiper('.swiper-banners', {
    pagination: {
        el: '.swiper-pagination',
        freeMode: !1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + '</span>';
        },
    },
});