$(document).ready(function () {
    $('.down').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();

        return false;
    });
    $('.up').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
    $("#sku").on("change", function () {
        let sku = elementSKU[this.value];
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
});
