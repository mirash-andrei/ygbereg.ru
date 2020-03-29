$(function () {
    $('.js-pagination').each(function () {
        let pagination = $(this),
            params = pagination.data('settings'),
            loading = false;

        params = $.extend({}, {
            infinityScroll: false,
            setPageUrl: false
        }, params);

        pagination.on('click', '.js-load-more-btn', function (e) {

            e.preventDefault();

            if (loading)
                return false;

            loading = true;

            pagination.addClass('is-loading');

            let el = $(this),
                url = el.attr('href');

            if (url && url !== '#') {
                $.get(url, {}, function (html) {
                    loading = false;

                    pagination.removeClass('is-loading');

                    html = $(html);

                    let newPagination = html.is('.js-pagination') ? html.filter('.js-pagination') : html.find('.js-pagination'),
                        items = html.find('.js-load-more-item'),
                        row = pagination.parent().find('.js-load-more-container').length != 0 ? pagination.parent().find('.js-load-more-container') : $('.js-load-more-container');

                    pagination.empty().append(newPagination.children());
                    row.append(items);

                    if (params.setPageUrl)
                        history.pushState({}, document.title, url);

                    $(document).trigger('load-more-finish');
                });
            }

            return false;
        });

        if (params.infinityScroll) {
            var intersectionObserver = new IntersectionObserver(entries => {
                if (entries[0].intersectionRatio <= 0)
                    return;

                pagination.find('.js-load-more-btn').trigger('click');
            });
            intersectionObserver.observe(pagination.get(0));
        }
    });
});