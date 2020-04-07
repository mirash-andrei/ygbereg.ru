$(document).ready(function () {

    // if ($(this).width() < 992) {
    //     $(".nav-body").removeClass("active");
    //     $(".nav-burger").removeClass("active");
    // } else {
    //     $(".nav-body").addClass("active");
    // }
    $(".nav-head").click(function (e) {
        e.preventDefault();
        $(".nav-burger").toggleClass("active");
        $(".nav-body").fadeToggle(500, "linear");
    });
    $(function () {
        $(".register-user").on("submit", function (e) {
            e.preventDefault();
            let $url = '/include/ajax/lk/registration.php',
                $data = $('.register-user').serializeArray(),
                mess = $('.result');

            mess.html('');

            $.post($url, $data, function (result) {
                result = JSON.parse(result);
                if (!result['success']) {
                    mess.html(result['errors']);
                    $('html').animate({
                        scrollTop: mess.offset().top - 55
                    }, 500);
                } else if (result['ID']) {
                    location.reload();
                }
            });
        });
        $(".add-call-back").on("submit", function (e) {
            e.preventDefault();
            let $url = '/include/ajax/callback.php',
                $data = $('.add-call-back').serializeArray(),
                mess = $('.result-form');

            mess.html('');

            $.post($url, $data, function (result) {
                result = JSON.parse(result);
                if (!result['success']) {
                    mess.html(result['errors']);
                    $('html').animate({
                        scrollTop: mess.offset().top - 55
                    }, 500);
                } else {
                    mess.html('Ваша заявка принята вскоре с вами свяжуться');
                }
                console.log(result);
            });
        });
        $('.add-basket').on('click', function (e) {
            e.preventDefault();
            let el = window[$(this).data('id')],
                url='/include/ajax/basket.php';
            $.post(url, el, function (result) {
                $('.js-body-element').html('<p>' + el.COUNT + 'x ' + el.NAME + '</p>');
            });
        });
    });
});

