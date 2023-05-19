$(function () {
    //メインスライダー
    $('.js-main-slide').slick({
        autoplay: true,
        centerMode: true,
        dots: true,
        infinite: true,
        variableWidth: true,
        prevArrow: '<div class="mainSlide__arw--prev"></div>',
        nextArrow: '<div class="mainSlide__arw--next"></div>'
    });
    //お客様の声スライダー
    $('.js-customer-slide').slick({
        autoplay: true,
        prevArrow: '<i class="fas fa-chevron-circle-left ui-tx-main customerSlide__arw--prev"></i>',
        nextArrow: '<i class="fas fa-chevron-circle-right ui-tx-main customerSlide__arw--next"></i>',
        slidesToShow: 4,
        variableWidth: true
    });
    //スタッフスライダー
    $('.js-staff-slide').slick({
        autoplay: true,
        prevArrow: '<i class="fas fa-chevron-circle-left ui-tx-main customerSlide__arw--prev"></i>',
        nextArrow: '<i class="fas fa-chevron-circle-right ui-tx-main customerSlide__arw--next"></i>',
        slidesToShow: 3,
        variableWidth: true,
        centerMode: true
    });
    //ブログタブ切替
    $('.js-blog-tab').click(function () {
        const selectBlog = $(this).data('blogtab');
        $('.js-blog-tab').removeClass('ui-bg-main is-active');
        $(this).addClass('ui-bg-main is-active');
        $('.js-blog-cont').removeClass('is-active');
        $('[data-blogcont="' + selectBlog + '"]').addClass('is-active');
    });
    //更新情報スクロール
    $('.js-info-scroll').jScrollPane();
    $('.jspDrag').addClass('ui-bg-main');
    //スクロールフェードイン
    $(window).scroll(function () {
        const wHeight = $(window).height();
        const scrollAmount = $(window).scrollTop();
        $('.js-fadein').each(function () {
            const targetPosition = $(this).offset().top;
            if(scrollAmount > targetPosition - wHeight + 200) {
                $(this).addClass("fadein-item");
            }
        });
    });
    //よくあるコンテンツ（Q&A）
    $('.js-acord-bt').click(function(){
        $(this).toggleClass('is-active');
        $(this).next('.js-arord-cont').slideToggle();
    });
});