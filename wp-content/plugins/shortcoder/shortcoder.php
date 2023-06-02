<?php
/*
Plugin Name: Shortcoder
Plugin URI: https://www.aakashweb.com/wordpress-plugins/shortcoder/
Description: Shortcoder plugin allows to create a custom shortcodes for HTML, JavaScript and other snippets. Now the shortcodes can be used in posts/pages and the snippet will be replaced in place.
Author: Aakash Chakravarthy
Version: 6.2
Author URI: https://www.aakashweb.com/
Text Domain: shortcoder
Domain Path: /languages
*/

define( 'SC_VERSION', '6.2' );
define( 'SC_PATH', plugin_dir_path( __FILE__ ) ); // All have trailing slash
define( 'SC_URL', plugin_dir_url( __FILE__ ) );
define( 'SC_ADMIN_URL', trailingslashit( plugin_dir_url( __FILE__ ) . 'admin' ) );
define( 'SC_BASE_NAME', plugin_basename( __FILE__ ) );
define( 'SC_POST_TYPE', 'shortcoder' );

// error_reporting(E_ALL);

final class Shortcoder{

    static public $shortcodes = array();

    static public $current_shortcode = false;

    public static function init(){
        
        // Include the required
        self::includes();

        add_shortcode( 'sc', array( __CLASS__, 'execute_shortcode' ) );
        
    }

    public static function includes(){

        include_once( SC_PATH . 'includes/updates.php' );
        include_once( SC_PATH . 'includes/metadata.php' );
        include_once( SC_PATH . 'admin/admin.php' );
        include_once( SC_PATH . 'admin/form.php' );
        include_once( SC_PATH . 'admin/edit.php' );
        include_once( SC_PATH . 'admin/settings.php' );
        include_once( SC_PATH . 'admin/manage.php' );
        include_once( SC_PATH . 'admin/tools.php' );

    }

    public static function execute_shortcode( $atts, $enclosed_content = null ){

        $atts = (array) $atts;
        $shortcodes = self::get_shortcodes();

        if( empty( $shortcodes ) ){
            return '<!-- No shortcodes are defined -->';
        }

        $shortcode = self::find_shortcode( $atts, $shortcodes );

        $shortcode = apply_filters( 'sc_mod_shortcode', $shortcode, $atts, $enclosed_content );
        do_action( 'sc_do_before', $shortcode, $atts );

        if( !is_array( $shortcode ) ){
            return $shortcode;
        }

        // Prevent same shortcode nested loop
        if( self::$current_shortcode == $shortcode[ 'name' ] ){
            return '';
        }
        self::$current_shortcode = $shortcode[ 'name' ];

        $sc_content = $shortcode[ 'content' ];
        $sc_settings = $shortcode[ 'settings' ];

        if( !self::can_display( $shortcode ) ){
            $sc_content = '<!-- Shortcode does not match the conditions -->';
        }else{
            $sc_content = self::replace_sc_params( $sc_content, $atts );
            $sc_content = self::replace_wp_params( $sc_content, $enclosed_content );
            $sc_content = self::replace_custom_fields( $sc_content );
            $sc_content = do_shortcode( $sc_content );
        }

        $sc_content = apply_filters( 'sc_mod_output', $sc_content, $atts, $sc_settings, $enclosed_content );
        do_action( 'sc_do_after', $shortcode, $atts );

        self::$current_shortcode = false;

        return $sc_content;

    }

    public static function get_shortcodes(){

        if( !empty( self::$shortcodes ) ){
            return self::$shortcodes;
        }

        $shortcodes = array();
        $shortcode_posts = get_posts(array(
            'post_type' => SC_POST_TYPE,
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));

        foreach( $shortcode_posts as $index => $post ){
            $shortcodes[ $post->post_name ] = array(
                'id' => $post->ID,
                'name' => $post->post_name,
                'content' => $post->post_content,
                'settings' => self::get_sc_settings( $post->ID )
            );
        }

        self::$shortcodes = $shortcodes;

        return $shortcodes;

    }

    public static function default_sc_settings(){

        return apply_filters( 'sc_mod_sc_settings', array(
            '_sc_description' => '',
            '_sc_disable_sc' => 'no',
            '_sc_disable_admin' => 'no',
            '_sc_editor' => '',
            '_sc_allowed_devices' => 'all'
        ));

    }

    public static function default_settings(){

        return apply_filters( 'sc_mod_settings', array(
            'default_editor' => 'code',
            'default_content' => '',
            'list_content' => 'no'
        ));

    }

    public static function get_settings(){

        $settings = get_option( 'sc_settings', array() );
        $default_settings = self::default_settings();

        return self::set_defaults( $settings, $default_settings );

    }

    public static function get_sc_settings( $post_id ){

        $meta_vals = get_post_meta( $post_id, '', true );
        $default_vals = self::default_sc_settings();
        $settings = array();

        if( !is_array( $meta_vals ) ){
            return $default_vals;
        }

        foreach( $default_vals as $key => $val ){
            $settings[ $key ] = array_key_exists( $key, $meta_vals ) ? $meta_vals[$key][0] : $val;
        }

        $settings[ '_sc_title' ] = get_the_title( $post_id );

        return $settings;

    }

    public static function get_sc_tag( $post_id ){
        $post = get_post( $post_id );
        return '[sc name="' . $post->post_name . '"][/sc]';
    }

    public static function find_shortcode( $atts, $shortcodes ){

        $sc_name = false;

        // Find by shortcode ID
        if( array_key_exists( 'sc_id', $atts ) ){
            $sc_id = $atts[ 'sc_id' ];
            foreach( $shortcodes as $temp_name => $temp_props ){
                if( $temp_props[ 'id' ] == $sc_id ){
                    $sc_name = $temp_name;
                    break;
                }
            }
        }

        // If shortcode ID is not passed, then get the shortcode name
        if( !$sc_name ){
            if( !array_key_exists( 'name', $atts ) ){
                return '<!-- Shortcode is missing "name" attribute -->';
            }
            $sc_name = $atts[ 'name' ];
        }

        // Check if the shortcode name exists
        if( !array_key_exists( $sc_name, $shortcodes ) ){
            $sc_name = sanitize_title_with_dashes( $sc_name );
            if( !array_key_exists( $sc_name, $shortcodes ) ){
                return '<!-- Shortcode does not exist -->';
            }
        }

        return $shortcodes[ $sc_name ];

    }

    public static function can_display( $sc_props ){

        $settings = $sc_props['settings'];

        if( $settings[ '_sc_disable_sc' ] == 'yes' ){
            return false;
        }

        $devices = $settings[ '_sc_allowed_devices' ];

        if( $devices == 'mobile_only' && !wp_is_mobile() ){
            return false;
        }

        if( $devices == 'desktop_only' && wp_is_mobile() ){
            return false;
        }

        if( current_user_can( 'manage_options' ) && $settings[ '_sc_disable_admin' ] == 'yes' ){
            return false;
        }

        return true;

    }

    public static function replace_sc_params( $content, $params ){

        $params = array_change_key_case( $params, CASE_LOWER );

        preg_match_all('/%%([a-zA-Z0-9_\-]+)\:?(.*?)%%/', $content, $matches);

        $cp_tags = $matches[0];
        $cp_names = $matches[1];
        $cp_defaults = $matches[2];
        $to_replace = array();

        for( $i = 0; $i < count( $cp_names ); $i++ ){

            $name = strtolower( $cp_names[ $i ] );
            $default = $cp_defaults[ $i ];
            $value = '';

            if( array_key_exists( $name, $params ) ){
                $value = $params[ $name ];

                // Handle scenario when the attributes are added with paragraph tags by autop
                if( substr( $value, 0, 4 ) == '</p>' ){
                    $value = substr( $value, 4 );
                    if( substr( $value, -3 ) == '<p>' ){
                        $value = substr( $value, 0, -3 );
                    }
                }

            }

            if( $value == '' ){
                array_push( $to_replace, $default );
            }else{
                array_push( $to_replace, $value );
            }

        }

        $content = str_ireplace( $cp_tags, $to_replace, $content );

        return $content;

    }

    public static function replace_wp_params( $content, $enc_content = null ){

        $params = self::wp_params_list();
        $metadata = Shortcoder_Metadata::metadata();
        $metadata[ 'enclosed_content' ] = $enc_content;
        $all_params = array();
        $to_replace = array();

        foreach( $params as $group => $group_info ){
            $all_params = array_merge( $group_info[ 'params' ], $all_params );
        }

        foreach( $all_params as $id => $name ){
            if( array_key_exists( $id, $metadata ) ){
                $placeholder = '$$' . $id . '$$';
                $to_replace[ $placeholder ] = $metadata[ $id ];
            }
        }

        $content = strtr( $content, $to_replace );

        return $content;

    }

    public static function replace_custom_fields( $content ){

        global $post;

        preg_match_all('/\$\$[^\s^$]+\$\$/', $content, $matches );

        $cf_tags = $matches[0];

        if( empty( $cf_tags ) ){
            return $content;
        }

        foreach( $cf_tags as $tag ){
            
            if( strpos( $tag, 'custom_field:' ) === false ){
                continue;
            }
            
            preg_match( '/:[^\s\$]+/', $tag, $match );

            if( empty( $match ) ){
                continue;
            }

            $match = substr( $match[0], 1 );
            $value = is_object( $post ) ? get_post_meta( $post->ID, $match, true ) : '';
            $content = str_replace( $tag, $value, $content );

        }
        
        return $content;

    }

    public static function wp_params_list(){

        return apply_filters( 'sc_mod_wp_params', array(
            'wp_info' => array(
                'name' => __( 'WordPress information', 'shortcoder' ),
                'icon' => 'wordpress-alt',
                'params' => array(
                    'url' => __( 'URL of the post/location', 'shortcoder' ),
                    'title' => __( 'Title of the post/location', 'shortcoder' ),
                    'short_url' => __( 'Short URL of the post/location', 'shortcoder' ),
                    
                    'post_id' => __( 'Post ID', 'shortcoder' ),
                    'post_image' => __( 'Post featured image URL', 'shortcoder' ),
                    'post_excerpt' => __( 'Post excerpt', 'shortcoder' ),
                    'post_author' => __( 'Post author', 'shortcoder' ),
                    'post_date' => __( 'Post date', 'shortcoder' ),
                    'post_modified_date' => __( 'Post modified date', 'shortcoder' ),
                    'post_comments_count' => __( 'Post comments count', 'shortcoder' ),
                    'post_slug' => __( 'Post slug', 'shortcoder' ),
                    
                    'site_name' => __( 'Site title', 'shortcoder' ),
                    'site_description' => __( 'Site description', 'shortcoder' ),
                    'site_url' => __( 'Site URL', 'shortcoder' ),
                    'site_wpurl' => __( 'WordPress URL', 'shortcoder' ),
                    'site_charset' => __( 'Site character set', 'shortcoder' ),
                    'wp_version' => __( 'WordPress version', 'shortcoder' ),
                    'stylesheet_url' => __( 'Active theme\'s stylesheet URL', 'shortcoder' ),
                    'stylesheet_directory' => __( 'Active theme\'s directory', 'shortcoder' ),
                    'atom_url' => __( 'Atom feed URL', 'shortcoder' ),
                    'rss_url' => __( 'RSS 2.0 feed URL', 'shortcoder' )
                )
            ),
            'date_info' => array(
                'name' => __( 'Date parameters', 'shortcoder' ),
                'icon' => 'calendar-alt',
                'params' => array(
                    'day' => __( 'Day', 'shortcoder' ),
                    'day_lz' => __( 'Day - leading zeros', 'shortcoder' ),
                    'day_ws' => __( 'Day - words - short form', 'shortcoder' ),
                    'day_wf' => __( 'Day - words - full form', 'shortcoder' ),
                    'month' => __( 'Month', 'shortcoder' ),
                    'month_lz' => __( 'Month - leading zeros', 'shortcoder' ),
                    'month_ws' => __( 'Month - words - short form', 'shortcoder' ),
                    'month_wf' => __( 'Month - words - full form', 'shortcoder' ),
                    'year' => __( 'Year', 'shortcoder' ),
                    'year_2d' => __( 'Year - 2 digit', 'shortcoder' ),
                )
            ),
            'sc_cnt' => array(
                'name' => __( 'Shortcode enclosed content', 'shortcoder' ),
                'icon' => 'text',
                'params' => array(
                    'enclosed_content' => __( 'Shortcode enclosed content', 'shortcoder' )
                )
            )
        ));

    }

    public static function set_defaults( $a, $b ){
        
        $a = (array) $a;
        $b = (array) $b;
        $result = $b;
        
        foreach ( $a as $k => &$v ) {
            if ( is_array( $v ) && isset( $result[ $k ] ) ) {
                $result[ $k ] = self::set_defaults( $v, $result[ $k ] );
            } else {
                $result[ $k ] = $v;
            }
        }
        return $result;
    }

}

Shortcoder::init();

?>