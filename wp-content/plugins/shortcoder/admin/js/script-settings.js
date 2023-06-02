(function($){
$(document).ready(function(){

    var init = function(){

        load_codemirror();

    }

    var load_codemirror = function(){

        try{
            var editor = wp.codeEditor.initialize(document.getElementById('sc_default_content'));

            editor.codemirror.setSize( null, null );
            editor.codemirror.on('change', function(){
                editor.codemirror.save();
            });
    
            window.sc_cm = editor.codemirror;
        }catch(error){
            console.error('Shortcoder: Unable to load code editor.', error);
            return false;
        }

    }

    init();

});
})( jQuery );