(function($){
$(document).ready(function(){

    var send_editor = function(content){

        if(typeof parent.sc_block_editor_content === 'function'){
            if(parent.sc_block_editor_content(content)){
                return true;
            }
        }

        if(typeof parent.sc_block_inline_insert === 'function'){
            if(parent.sc_block_inline_insert(content)){
                return true;
            }
        }

        if(typeof parent.send_to_editor === 'function'){
            parent.send_to_editor(content);
        }else{
            alert('Editor does not exist. Cannot insert shortcode !');
        }

    }

    var close_window = function(){
        if( typeof parent.sc_close_insert === 'function' ){
            parent.sc_close_insert();
        }
    }

    var copy_to_clipboard = function(str){
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    var generate_sc = function(id){
        var $wrap = $('.sc_wrap[data-id="' + id + '"]');
        var name = $wrap.attr('data-name');
        var enclosed = $wrap.attr('data-enclosed');
        var params = '';

        $wrap.find('.sc_param').each(function(){
            if($(this).val() != ''){
                attr = $(this).attr('data-param');
                val = $(this).val().replace( /\"/g, '' );
                params += attr + '="' + val + '" ';
            }
        });

        sc = '[sc name="' + name + '" ' + params + ']';
        sc += '[/sc]';

        return sc;

    }

    var set_shortcode = function(shortcode){

        var re_attrs_text = /\[sc ([^\]]*)+\]/g;
        var re_attrs = /(\w+?)="(.+?)"/g;

        var attributes_text_matches = re_attrs_text.exec(shortcode);

        if(attributes_text_matches.length < 1){
            return false;
        }

        var attributes_text = attributes_text_matches[1];
        var attributes = {};

        while(true){
            var attributes_matches = re_attrs.exec(attributes_text);

            if(attributes_matches !== null){
                var name = attributes_matches[1];
                var val = attributes_matches[2];
                attributes[name] = val;
            }else{
                break;
            }
        }

        if(!('name' in attributes)){
            return false;
        }

        var sc_name = attributes['name'];
        var $sc_wrap = $('.sc_wrap[data-name="' + sc_name + '"]');

        if($sc_wrap.length == 0){
            return false;
        }

        var $sc_options = $sc_wrap.find('.sc_options');
        var $sc_head = $sc_wrap.find('.sc_head');

        delete attributes['name'];

        for (var attribute in attributes) {
            if (attributes.hasOwnProperty(attribute)) {
                var attr_val = attributes[attribute];
                $sc_options.find('input[data-param="' + attribute + '"]').val(attr_val);
            }
        }

        if(!$sc_wrap.hasClass('open')){
            $sc_head.trigger('click');
        }

        $sc_wrap[0].scrollIntoView();

    }

    $('.sc_insert').on('click', function(){
        var sc_id = $(this).closest('.sc_wrap').attr('data-id');
        var sc = generate_sc(sc_id);
        
        send_editor(sc);
        close_window();
    });
    
    $('.sc_copy').on('click', function(){
        var sc_id = $(this).closest('.sc_wrap').attr('data-id');
        var sc = generate_sc(sc_id);

        copy_to_clipboard(sc);
        close_window();
    });

    $('.sc_head').on('click', function(){
        $('.sc_options').slideUp();
        $('.sc_wrap').removeClass('open');
        if($(this).next('.sc_options').is(':visible')){
            $(this).next().slideUp();
        }else{
            $(this).next().slideDown();
            $(this).closest('.sc_wrap').addClass('open');
        }
    });

    $('.sc_search').on('keyup search', function(){

        var re = new RegExp($(this).val(), 'gi');

        $('.sc_wrap').each(function(){
            var name = $(this).find('.sc_head h3').text();
            var desc = $(this).find('.sc_head p').text();
            if(name.match(re) === null && desc.match(re) === null){
                $(this).hide();
            }else{
                $(this).show();
            }
        });

        var $no_scs_msg = $('.sc_search_none');
        var visible = $('.sc_wrap:visible').length;

        if( visible == 0 ){
            $no_scs_msg.show();
        }else{
            $no_scs_msg.hide();
        }

    });

    $('.cfe_amt').on('click', function(){
        var $btn = $(this).closest('.cfe_form').find('.cfe_btn');
        $btn.attr('href', $btn.data('link') + $(this).val());
    });

    $('.note').on('click', function(){
        $(this).find('table').slideToggle();
    });

    window.addEventListener('message', function(e){
        var key = e.message ? 'message' : 'data';
        var data = e[key];

        if(data == false){
            return true;
        }

        set_shortcode(data);

    }, false);

});
})( jQuery );