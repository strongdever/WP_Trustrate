(function($){
$(document).ready(function(){

    var init = function(){

        if(typeof window.SC_EDITOR !== 'undefined' && typeof window.SC_EDITOR.active !== 'undefined' && window.SC_EDITOR.active == 'code'){

            var codemirror_loaded = load_codemirror();

            if(!codemirror_loaded){
                $('.sc_editor_toolbar').append('<p>Unable to load code editor. Please check browser console (press Ctrl+Shift+J) for errors or try deactivating any code editor related plugin/themes.</p>');
            }

            $('.sc_editor_toolbar').appendTo('.sc_cm_menu');

        }else{
            $('.sc_editor_toolbar').appendTo('.wp-media-buttons');
        }

        if(typeof window.SC_VARS !== 'undefined'){

            if(SC_VARS['screen']['base'] == 'edit'){
                var version = '<small>v' + SC_VARS['sc_version'] + '</small>';
                $('.wp-heading-inline').append(version);
                add_top_import_export_btn();
            }

            add_top_pro_btn();
        }

        $('.sc_params_list').appendTo('body');

    }

    var set_sc_preview_text = function(name){
        $('.sc_preview_text').text('[sc name="' + name + '"][/sc]');
    }

    var insert_in_editor = function(data){
        if(window.SC_EDITOR.active == 'code'){
            var doc = window.sc_cm.getDoc();
            doc.replaceRange(data, doc.getCursor());
        }else{
            send_to_editor(data);
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

    var load_codemirror = function(){

        if(typeof window.SC_CODEMIRROR === 'undefined'){
            console.error('Shortcoder: Codemirror settings are not loaded');
            return false;
        }

        if(typeof window.wp === 'undefined' || typeof window.wp.codeEditor === 'undefined'){
            console.error('Shortcoder: codeEditor namespace is not available');
            return false;
        }

        var sc_mode_loaded = load_cm_sc_mode();
        var mode = sc_mode_loaded ? 'sc_mode' : 'htmlmixed';

        wp.codeEditor.defaultSettings.codemirror['mode'] = mode;

        var editor = wp.codeEditor.initialize(document.getElementById('sc_content'), window.SC_CODEMIRROR);

        editor.codemirror.setSize( null, 500 );
        editor.codemirror.on('change', function(){
            editor.codemirror.save();
        });

        window.sc_cm = editor.codemirror;

        return true;

    }

    var load_cm_sc_mode = function(){

        if(typeof wp.CodeMirror === 'undefined'){
            console.error('Shortcoder: CodeMirror library is not loaded/available');
            return false;
        }

        if(typeof wp.CodeMirror.overlayMode === 'undefined'){
            console.error('Shortcoder: CodeMirror overlay method is not available');
            return false;
        }

        try{
            wp.CodeMirror.defineMode('sc_mode', function(config, parserConfig){
                var sc_overlay = {
                    token: function(stream, state){
                        if(stream.match(/\$\$[a-z0-9A-Z:_\-]+\$\$/)){
                            return 'number sc_param';
                        }
                        if(stream.match(/%%.*?%%/)){
                            return 'atom sc_param';
                        }
                        if(stream.match(/\[(.+?)?\](?:(.+?)?\[\/\])?/)){
                            return 'string sc_param';
                        }
                        stream.next();
                    }
                };
                return wp.CodeMirror.overlayMode(wp.CodeMirror.getMode(config, parserConfig.backdrop || 'htmlmixed'), sc_overlay);
            });
        }catch(error){
            console.error('Shortcoder: Unable to load shortcoder mode.', error);
            return false;
        }

        return true;

    }

    var close_params_list = function(){
        $('.sc_params_list').hide();
    }

    var add_top_pro_btn = function(){

        $('#screen-meta-links').prepend('<div class="screen-meta-toggle pro_top_link"><a class="show-settings button" href="https://www.aakashweb.com/wordpress-plugins/shortcoder/?utm_source=admin&utm_medium=top&utm_campaign=sc-pro#pro" target="_blank">Upgrade to PRO <span class="dashicons dashicons-plus"></span></a></div>');

    }

    var add_top_import_export_btn = function(){

        $('#screen-meta-links').prepend('<div class="screen-meta-toggle ie_top_link hide-if-no-js"><button aria-controls="import-export-tab" aria-expanded="false" class="show-settings button">Import / Export</button></div>');

        $('#screen-meta').append('<div id="import-export-tab" class="hidden"></div>');

        $('#ie_content > div').appendTo('#import-export-tab');

    }

    $('#post_name').on('change keyup', function(){
        set_sc_preview_text($(this).val());
    });

    $('.sc_editor').on('focus', function(){
        window.sc_old_editor = $(this).val();
    }).on('change', function(e){

        new_editor = $(this).val();
        response = confirm(SC_VARS.text_editor_switch_notice);

        if(!response){
            e.preventDefault();
            $(this).val(window.sc_old_editor);
            return false;
        }

        window.location = window.location + '&editor=' + $(this).val();

    });

    $('.sc_insert_param').on('click', function(e){
        
        e.preventDefault();
        
        var offset = $(this).offset();
        var mtop = offset.top + $(this).outerHeight();

        $('.sc_params_list').css({
            top: mtop,
            left: offset.left
        }).toggle();

    });

    $('.sc_wp_params li').on('click', function(){
        insert_in_editor('$$' + $(this).data('id') + '$$');
        close_params_list();
    });

    $('.sc_cp_btn').on('click', function(){

        var $cp_box = $('.sc_cp_box');
        var $cp_default = $('.sc_cp_default');
        var $cp_info = $('.sc_cp_info');
        var param_val = $cp_box.val().trim();
        var default_val = $cp_default.val().trim();

        if( param_val != '' && $cp_box[0].checkValidity() ){

            var the_code = '';
            if(default_val == ''){
                the_code = '%%' + param_val + '%%';
            }else{
                the_code = '%%' + param_val + ':' + default_val + '%%';
            }

            insert_in_editor(the_code);
            $cp_info.removeClass('red');
            close_params_list();
        }else{
            $cp_info.addClass('red');
        }

    });
    
    $('.sc_cf_btn').on('click', function(){

        var $cf_box = $('.sc_cf_box');
        var $cf_info = $('.sc_cf_info');
        var param_val = $cf_box.val().trim();

        if( param_val != '' && $cf_box[0].checkValidity() ){
            insert_in_editor('$$custom_field:' + param_val + '$$');
            $cf_info.removeClass('red');
            close_params_list();
        }else{
            $cf_info.addClass('red');
        }

    });

    $('.sc_copy').on('click', function(){
        copy_to_clipboard($('.sc_preview_text').text());
        $this = $(this);
        $this.addClass('copied');
        setTimeout(function() {
            $this.removeClass('copied');
        }, 3000);
    })

    $('.sc_copy_list').on('click', function(e){
        e.preventDefault();
        var $copy_field = $(this).siblings('.sc_copy_text');
        copy_to_clipboard($copy_field.val());
        $copy_field.addClass('copied');
        setTimeout(function() {
            $copy_field.removeClass('copied');
        }, 3000);
    });

    $('.sc_changelog .dismiss_btn').on('click', function(){
        var url = SC_VARS.ajax_url + '?action=sc_admin_ajax&do=close_changelog';
        $.get(url, function( data ){
            if(data.search( /done/g ) == -1){
                $( '.sc_changelog article' ).html('Failed to close window. <a href="' + url + '" target="_blank">Please click here to close</a>');
            }else{
                $( '.sc_changelog' ).fadeOut();
            }
        });
    });

    $('.sc_settings_link').on('click', function(e){
        e.preventDefault();
        $('html').animate({
            scrollTop: $("#sc_mb_settings").offset().top
        }, 1000, function(){
            $('input[name="post_title"]').focus();
        });
    });

    $('.cfe_amt').on('click', function(){
        var $btn = $(this).closest('.cfe_form').find('.cfe_btn');
        $btn.attr('href', $btn.data('link') + $(this).val());
    });

    $('.subscribe_btn').click(function(e){
        e.preventDefault();
        var action = $(this).parent().data('action');
        $.ajax({
            type: 'get',
            url: action,
            cache: false,
            dataType: 'jsonp',
            data: {
                'EMAIL': $('.subscribe_email_box').val()
            },
            success : function(data) {
            }
        });
        $('.subscribe_confirm').show();
    });

    init();

});
})( jQuery );