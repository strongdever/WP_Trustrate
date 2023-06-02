<?php

class SC_Admin_Settings{

    public static function init(){

        add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );

        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );

    }

    public static function admin_menu(){

        add_submenu_page( 'edit.php?post_type=shortcoder', 'Shortcoder - Settings', 'Settings', 'manage_options', 'settings', array( __CLASS__, 'page' ) );

    }

    public static function enqueue_scripts( $hook ){

        if( $hook != 'shortcoder_page_settings' ){
            return false;
        }

        wp_enqueue_style( 'sc-admin-settings-css', SC_ADMIN_URL . 'css/style-settings.css', array(), SC_VERSION );

        wp_enqueue_code_editor( array( 'type' => 'text/html' ) );

        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'sc-admin-settings-js', SC_ADMIN_URL . 'js/script-settings.js', array( 'jquery' ), SC_VERSION );

    }

    public static function page(){
        
        self::save_settings();
        
        echo '<div class="wrap">';
        echo '<div class="head_wrap">';
        echo '<h1>Shortcoder - General Settings</h1>';
        echo '</div>';
        
        $settings = Shortcoder::get_settings();

        echo '<div id="main">';

        $fields = array(

            array( __( 'Default editor', 'shortcoder' ), SC_Admin_Form::field( 'select', array(
                'value' => $settings[ 'default_editor' ],
                'name' => 'sc_default_editor',
                'list' => array(
                    'text' => __( 'Text editor', 'shortcoder' ),
                    'visual' => __( 'Visual editor', 'shortcoder' ),
                    'code' => __( 'Code editor', 'shortcoder' )
                ),
                'helper' => __( 'The default editor mode when creating new shortcodes', 'shortcoder' )
            ))),

            array( __( 'Default shortcode content', 'shortcoder' ), SC_Admin_Form::field( 'textarea', array(
                'value' => $settings[ 'default_content' ],
                'id' => 'sc_default_content',
                'name' => 'sc_default_content',
                'class' => 'widefat',
                'helper' => __( 'The default shortcode content when creating new shortcodes', 'shortcoder' )
            ))),

            array( __( 'Show content in "All shortcodes" page', 'shortcoder' ), SC_Admin_Form::field( 'select', array(
                'value' => $settings[ 'list_content' ],
                'name' => 'sc_list_content',
                'list' => array(
                    'no' => __( 'Hidden', 'shortcoder' ),
                    '100' => __( '100 characters', 'shortcoder' ),
                    '200' => __( '200 characters', 'shortcoder' )
                ),
                'helper' => __( 'List the shortcode content in "All shortcodes" page.', 'shortcoder' )
            ))),

        );

        echo '<form method="post">';

        echo SC_Admin_Form::table($fields);

        wp_nonce_field( 'sc_settings_nonce' );
        echo '<p><button type="submit" class="button button-primary">' . esc_html__( 'Save settings', 'shortcoder' ) . '</button></p>';
        echo '</form>';

        echo '</div>';

        echo '</div>';

    }

    public static function save_settings(){

        if( $_POST && check_admin_referer( 'sc_settings_nonce' ) ){
            
            $defaults = Shortcoder::default_settings();
            $p = Shortcoder::set_defaults( SC_Admin::clean_post(), $defaults );

            $values = array();

            foreach( $defaults as $field => $default ){
                $form_field = 'sc_' . $field;
                $value = isset( $p[ $form_field ] ) ? $p[ $form_field ] : $default;

                if( in_array( $field, array( 'default_content' ) ) ){
                    $values[ $field ] = current_user_can( 'unfiltered_html' ) ? $value : wp_kses_post( $value );
                }else{
                    $values[ $field ] = sanitize_text_field( $value );
                }
            }

            update_option( 'sc_settings', $values );
            self::print_notice( 'Successfully saved the changes !' );

        }

    }

    public static function print_notice( $msg = '', $type = 'success' ){

        if( $msg != '' ){
            echo '<div class="notice notice-' . esc_attr( $type ) . ' is-dismissible"><p>' . wp_kses_post( $msg ) . '</p></div>';
        }

    }

}

SC_Admin_Settings::init();

?>