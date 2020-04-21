$(document).ready(function () {
    $('.down').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        var el = window[$(this).data('id')];

        count = count < 1 ? 1 : count;
        $input.val(count);
        el.COUNT = count;
        $input.change();

        return false;
    });
    $('.up').click(function () {
        var $input = $(this).parent().find('input');
        var el = window[$(this).data('id')];
        $input.val(parseInt($input.val()) + 1);
        el.COUNT = $input.val();
        $input.change();
        return false;
    });
    $("#sku").on("change", function () {
        var el = window[$(this).data('id')];
        let sku = elementSKU[this.value];
        el.NAME = el.NAME + ' ' + sku.NAME;
        el.OPT_PRICE = sku.OPT_PRICE;
        el.PRICE = sku.PRICE;
        $('[data-price="opt"]').html(sku.OPT_PRICE + ' ₽');
        $('[data-price="retail"]').html(sku.PRICE + ' ₽');
    });
    $(".add-order").on("submit", function (e) {
        e.preventDefault();
        let $url = '/include/ajax/lk/order.php',
            $data = $('.add-order').serializeArray();

        $.post($url, $data, function (result) {
            window.location.href = result;
        });
    });
    $('.add-basket-detail').on('click', function (e) {
        e.preventDefault();
        $('.js-body-element').html('');
        let el = window[$(this).data('id')],
            url = '/include/ajax/basket.php';
        $.post(url, el, function (result) {
            $('.js-body-element').html('<p>' + el.COUNT + 'x ' + el.NAME + '</p>');
        });
    });
});
