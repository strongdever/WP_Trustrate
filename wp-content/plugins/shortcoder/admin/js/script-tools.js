function sc_show_insert(shortcode=false, block_editor_id=false, block_inline_insert=false){
    var $ = jQuery;
    var popup = '<div id="sci_wrap"><div id="sci_bg"></div><div id="sci_popup"><header><span id="sci_title"></span><span id="sci_close" title="Close"><span class="dashicons dashicons-no"></span></span></header><iframe></iframe></div></div>';

    if(typeof window.SC_INSERT_VARS === 'undefined'){
        console.log('Cannot load shortcode insert window as the script is not loaded properly');
    }

    window.SC_INSERT_VARS.block_editor = block_editor_id;
    window.SC_INSERT_VARS.block_inline_insert = block_inline_insert;

    if($('#sci_wrap').length != 0 && !window.SC_INSERT_VARS.popup_opened){
        $('#sci_wrap').show();
        sc_notify_insert(shortcode);
        return;
    }

    $('body').append(popup);

    $('#sci_title').text(window.SC_INSERT_VARS.popup_title);
    $('#sci_popup > iframe').attr('src', window.SC_INSERT_VARS.insert_page);

    $('#sci_close').on('click', function(){
        sc_close_insert();
    });

    window.SC_INSERT_VARS.popup_opened = true;
    window.SC_INSERT_VARS.iframe = $('#sci_popup > iframe');

    window.SC_INSERT_VARS.iframe.load(function(){
        sc_notify_insert(shortcode);
    });

}

function sc_close_insert(){
    jQuery('#sci_wrap').hide();
    window.SC_INSERT_VARS.popup_opened = false;
    window.SC_INSERT_VARS.block_editor = false;
}

function sc_notify_insert(shortcode){

    if(shortcode === false){
        return false;
    }

    var $iframe = window.SC_INSERT_VARS.iframe;
    var content_window = $iframe[0].contentWindow;

    content_window.postMessage(shortcode);

}

function sc_block_editor_content(content){
    var block_id = window.SC_INSERT_VARS.block_editor;

    if(block_id !== false){
        var sc_box = document.getElementById('shortcoder-input-' + block_id);

        sc_set_native_value(sc_box, content);
        sc_box.dispatchEvent(new Event('input', { bubbles: true }));

        return true;
    }

    return false;
}

function sc_block_inline_insert(content){

    if(window.SC_INSERT_VARS.block_inline_insert && window.sc_inline_insert_props){
        var props = window.sc_inline_insert_props.props;
        var insert = window.sc_inline_insert_props.insert;
        props.onChange(
            insert(props.value, content)
        );
        window.sc_inline_insert_props = false;
        return true;
    }

    return false;

}

function sc_qt_show_insert(){
    sc_show_insert();
}

function sc_set_native_value(element, value) {
    var valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    var prototype = Object.getPrototypeOf(element);
    var prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
}

if(window.addEventListener){
    window.addEventListener('load', function(){
        if( typeof QTags === 'function' ){
            QTags.addButton( 'QT_sc_insert', 'Shortcoder', sc_qt_show_insert );
        }
    });
}