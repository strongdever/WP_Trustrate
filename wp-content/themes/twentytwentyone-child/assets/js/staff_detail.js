$(function(){
    $('#detail-left ul li').hover(function(){
        var cls = $(this).attr('class');
        $('#main a img').css('display','none');
        $('#' + cls).children('img').css('display','inline-block');
        $('#main').css('text-align','center');
    });
    $('#detail-left ul li').click(function(){
        $("#main a img").each(function(){
            if($(this).css("display") != "none"){
                $(this).click();
            }
        });
    });
    $(document).ready(function() {
        $(".fancybox").fancybox({
            openEffect  : 'none',
            closeEffect : 'none'
        });
    });

});