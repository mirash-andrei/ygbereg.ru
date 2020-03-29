import Swiper from 'swiper';

$(document).ready(function () {

    function tabInit(tab, list, item, block) {
        $(tab).each(function () {
            let $tabMain = $(this);
            $tabMain.find(list).on('click', item, function () {
                let $tabItem = $(this);

                $tabMain.find(item).removeClass('is-select');
                $tabItem.addClass('is-select');

                let clickedTab = $tabItem,
                    clickedTabIndex = clickedTab.index();

                $tabMain.find(block + '.is-open').hide();
                $tabMain.find(block).removeClass('is-open');

                $tabMain.find(block).eq(clickedTabIndex).show().addClass('is-open');
            });
        });
    }

    tabInit('.js-tab', '.js-tabList', '.js-tabItem', '.js-tabBlock');


    var swiper2 = new Swiper('.swiper-catalog', {
        slidesPerView: 4,
        spaceBetween: 30,
        freeMode: !1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1200: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 1,
            },
        }
    });

    var swiper3 = new Swiper('.swiper-catalog-2', {
        slidesPerView: 4,
        spaceBetween: 30,
        freeMode: !1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

});