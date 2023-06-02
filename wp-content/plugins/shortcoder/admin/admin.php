<?php

if( ! defined( 'ABSPATH' ) ) exit;

class SC_Admin{

    public static function init(){
        
        add_action( 'init', array( __CLASS__, 'register_post_type' ), 0 );

        add_action( 'init', array( __CLASS__, 'register_taxonomy' ), 0 );

        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );

        add_action( 'admin_footer', array( __CLASS__, 'changelog' ) );

        add_action( 'admin_footer', array( __CLASS__, 'import_export' ) );

        add_action( 'wp_ajax_sc_admin_ajax', array( __CLASS__, 'admin_ajax' ) );

        add_filter( 'plugin_action_links_' . SC_BASE_NAME, array( __CLASS__, 'action_links' ) );

        add_action( 'admin_menu', array( __CLASS__, 'upgrade_menu' ), 15 );

    }

    public static function register_post_type(){

        $labels = array(
            'name'                  => _x( 'Shortcoder', 'Post Type General Name', 'shortcoder' ),
            'singular_name'         => _x( 'Shortcode', 'Post Type Singular Name', 'shortcoder' ),
            'menu_name'             => __( 'Shortcoder', 'shortcoder' ),
            'name_admin_bar'        => __( 'Shortcode', 'shortcoder' ),
            'archives'              => __( 'Shortcode Archives', 'shortcoder' ),
            'attributes'            => __( 'Shortcode Attributes', 'shortcoder' ),
            'parent_item_colon'     => __( 'Parent Shortcode:', 'shortcoder' ),
            'all_items'             => __( 'All Shortcodes', 'shortcoder' ),
            'add_new_item'          => __( 'Create shortcode', 'shortcoder' ),
            'add_new'               => __( 'Create shortcode', 'shortcoder' ),
            'new_item'              => __( 'New Shortcode', 'shortcoder' ),
            'edit_item'             => __( 'Edit Shortcode', 'shortcoder' ),
            'update_item'           => __( 'Update Shortcode', 'shortcoder' ),
            'view_item'             => __( 'View Shortcode', 'shortcoder' ),
            'view_items'            => __( 'View Shortcodes', 'shortcoder' ),
            'search_items'          => __( 'Search Shortcode', 'shortcoder' ),
            'not_found'             => __( 'Not found', 'shortcoder' ),
            'not_found_in_trash'    => __( 'Not found in Trash', 'shortcoder' ),
            'featured_image'        => __( 'Featured Image', 'shortcoder' ),
            'set_featured_image'    => __( 'Set featured image', 'shortcoder' ),
            'remove_featured_image' => __( 'Remove featured image', 'shortcoder' ),
            'use_featured_image'    => __( 'Use as featured image', 'shortcoder' ),
            'insert_into_item'      => __( 'Insert into shortcode', 'shortcoder' ),
            'uploaded_to_this_item' => __( 'Uploaded to this shortcode', 'shortcoder' ),
            'items_list'            => __( 'Shortcodes list', 'shortcoder' ),
            'items_list_navigation' => __( 'Shortcodes list navigation', 'shortcoder' ),
            'filter_items_list'     => __( 'Filter shortcodes list', 'shortcoder' ),
        );

        $args = apply_filters( 'sc_mod_post_type_args', array(
            'label'                 => __( 'Shortcode', 'shortcoder' ),
            'labels'                => $labels,
            'supports'              => false,
            'taxonomies'            => array( 'sc_tag' ),
            'hierarchical'          => false,
            'public'                => false,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 25,
            'menu_icon'             => '',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => false,
            'exclude_from_search'   => true,
            'publicly_queryable'    => false,
            'show_in_rest'          => false,
            'map_meta_cap'          => true,
            'capability_type'       => 'shortcoder',
        ));

        register_post_type( SC_POST_TYPE, $args );

    }

    public static function register_taxonomy(){

        $labels = array(
            'name'                       => _x( 'Tags', 'Taxonomy General Name', 'shortcoder' ),
            'singular_name'              => _x( 'Tag', 'Taxonomy Singular Name', 'shortcoder' ),
            'menu_name'                  => __( 'Tags', 'shortcoder' ),
            'all_items'                  => __( 'All Tags', 'shortcoder' ),
            'parent_item'                => __( 'Parent Tag', 'shortcoder' ),
            'parent_item_colon'          => __( 'Parent Tag:', 'shortcoder' ),
            'new_item_name'              => __( 'New Tag Name', 'shortcoder' ),
            'add_new_item'               => __( 'Add New Tag', 'shortcoder' ),
            'edit_item'                  => __( 'Edit Tag', 'shortcoder' ),
            'update_item'                => __( 'Update Tag', 'shortcoder' ),
            'view_item'                  => __( 'View Tag', 'shortcoder' ),
            'separate_items_with_commas' => __( 'Separate tags with commas', 'shortcoder' ),
            'add_or_remove_items'        => __( 'Add or remove tags', 'shortcoder' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'shortcoder' ),
            'popular_items'              => __( 'Popular Tags', 'shortcoder' ),
            'search_items'               => __( 'Search Tags', 'shortcoder' ),
            'not_found'                  => __( 'Not Found', 'shortcoder' ),
            'no_terms'                   => __( 'No tags', 'shortcoder' ),
            'items_list'                 => __( 'Tags list', 'shortcoder' ),
            'items_list_navigation'      => __( 'Tags list navigation', 'shortcoder' ),
        );
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => false,
            'public'                     => false,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => false,
            'show_tagcloud'              => false,
            'show_in_rest'               => false,
        );

        register_taxonomy( 'sc_tag', array( SC_POST_TYPE ), $args );
        
    }

    public static function is_sc_admin_page(){

        $screen = get_current_screen();

        if( $screen && $screen->post_type == SC_POST_TYPE ){
            return true;
        }else{
            return false;
        }

    }

    public static function is_edit_page( $new_edit = null ){

        global $pagenow;

        if (!is_admin()) return false;

        if( $new_edit == 'edit' ){
            return in_array( $pagenow, array( 'post.php' ) );
        }elseif( $new_edit == 'new' ){
            return in_array( $pagenow, array( 'post-new.php' ) );
        }else{
            return in_array( $pagenow, array( 'post.php', 'post-new.php' ) );
        }

    }

    public static function inline_js_variables(){

        return array(
            'sc_version' => SC_VERSION,
            'ajax_url' => get_admin_url() . 'admin-ajax.php',
            'screen' => get_current_screen(),
            'text_editor_switch_notice' => __( 'Switching editor will refresh the page. Please save your changes before refreshing. Do you want to refresh the page now ?', 'shortcoder' )
        );

    }

    public static function enqueue_scripts( $hook ){

        wp_enqueue_style( 'sc-icon-css', SC_ADMIN_URL . 'css/menu-icon.css', array(), SC_VERSION );

        if( !self::is_sc_admin_page() || $hook == 'shortcoder_page_settings' ){
            return false;
        }

        wp_enqueue_style( 'sc-admin-css', SC_ADMIN_URL . 'css/style.css', array(), SC_VERSION );

        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'sc-admin-js', SC_ADMIN_URL . 'js/script.js', array( 'jquery' ), SC_VERSION );

        wp_localize_script( 'sc-admin-js', 'SC_VARS', self::inline_js_variables() );

    }

    public static function admin_ajax(){

        $g = self::clean_get();
        $do = $g[ 'do' ];

        if( $do == 'close_changelog' ){
            update_option( 'shortcoder_last_changelog', SC_VERSION );
            echo 'done';
        }

        die( 0 );

    }

    public static function changelog(){

        if( !self::is_sc_admin_page() ){
            return false;
        }

        $last_changelog = get_option( 'shortcoder_last_changelog' );

        if( $last_changelog && version_compare( $last_changelog, SC_VERSION, '>=' ) ){
            return false;
        }

        $response = wp_remote_get( 'https://raw.githubusercontent.com/vaakash/vaakash.github.io/master/misc/shortcoder/changelogs/' . SC_VERSION . '.html' );
        $changelog = false;

        if( !is_wp_error( $response ) && $response[ 'response' ][ 'code' ] == 200 ){
            $changelog = wp_remote_retrieve_body( $response );
        }

        if( !$changelog ){
            update_option( 'shortcoder_last_changelog', SC_VERSION );
            return false;
        }

        echo '<div class="sc_changelog"><main>
        <article>' . wp_kses_post( $changelog ) . '</article>
        <footer><button href="#" class="button button-primary dismiss_btn">' . esc_html__( 'Continue using Shortcoder', 'shortcoder' ) . '</a></footer>
        </main></div>';

    }

    public static function import_export(){

        if( !self::is_sc_admin_page() ){
            return false;
        }

        $screen = get_current_screen();
        if( $screen->base != 'edit' ){
            return false;
        }

        echo '<div id="ie_content" class="hidden"><div>
<div id="contextual-help-back"></div>
<div id="contextual-help-columns">
    <div class="contextual-help-tabs">
        <ul>
            <li class="active"><a href="#export-tab" aria-controls="export-tab">' . esc_html__( 'Export', 'shortcoder' ) . '</a></li>
            <li><a href="#import-tab" aria-controls="import-tab">' . esc_html__( 'Import', 'shortcoder' ) . '</a></li>
            <li><a href="#import-others-tab" aria-controls="import-others-tab">' . esc_html__( 'Import from other sources', 'shortcoder' ) . '</a></li>
        </ul>
    </div>
    <div class="contextual-help-sidebar"><p><a href="https://www.aakashweb.com/docs/shortcoder/" target="_blank">' . esc_html__( 'Documentation', 'shortcoder' ) . '</a></p></div>
    <div class="contextual-help-tabs-wrap">
        <div id="export-tab" class="help-tab-content active">
        <h3>' . esc_html__( 'Export', 'shortcoder' ) . '</h3><p>' . wp_kses( __( 'WordPress has a native exporter tool which can be used to export shortcoder data. Navigate to <code>Tools -> Export</code> and select "Shortcoder" as the content to export.', 'shortcoder' ), array( 'code' => array() ) ) . '</p>
        <a href="' . esc_url( admin_url( 'export.php' ) ) . '" class="button button-primary">' . esc_html__( 'Go to export page', 'shortcoder' ) . '</a>
        </div>
        <div id="import-tab" class="help-tab-content">
        <h3>' . esc_html__( 'Import', 'shortcoder' ) . '</h3><p>' . wp_kses( __( 'The XML file downloaded through the native export process can be imported via WordPress\'s own import tool. Navigate to <code>Tools -> Import</code>, install the importer plugin if not installed and run the importer under WordPress section.', 'shortcoder' ), array( 'code' => array() ) ) . '</p>
        <a href="' . esc_url( admin_url( 'import.php' ) ) . '" class="button button-primary">' . esc_html__( 'Go to import page', 'shortcoder' ) . '</a>
        </div>
        <div id="import-others-tab" class="help-tab-content">
        <h3>' . esc_html__( 'Import from other sources', 'shortcoder' ) . '</h3><p>' . esc_html__( 'To import from other sources like CSV, excel please read the below linked documentation.', 'shortcoder' ) . '</p>
        <a href="https://www.aakashweb.com/docs/shortcoder/import-export/" target="_blank" class="button button-primary">' . esc_html__( 'Open documentation', 'shortcoder' ) . '</a>
        </div>
    </div>
</div>
        </div></div>';

    }

    public static function action_links( $links ){
        array_unshift( $links, '<a href="'. esc_url( admin_url( 'edit.php?post_type=shortcoder') ) .'">' . esc_html__( 'View shortcodes', 'shortcoder' ) . '</a>' );
        array_unshift( $links, '<a href="https://www.aakashweb.com/wordpress-plugins/shortcoder/?utm_source=admin&utm_medium=menu&utm_campaign=sc-pro#pro" target="_blank"><b>' . esc_html__( 'Upgrade to PRO', 'shortcoder' ) . '</b></a>' );
        return $links;
    }

    public static function upgrade_menu(){
        add_submenu_page( 'edit.php?post_type=shortcoder', 'Shortcoder - Upgrade', '<span style="color: #ff8c29" class="sc_upgrade_link">Upgrade to PRO</span>', 'manage_options', 'https://www.aakashweb.com/wordpress-plugins/shortcoder/?utm_source=admin&utm_medium=menu&utm_campaign=sc-pro#pro', null );
    }

    public static function clean_get(){
        
        foreach( $_GET as $k => $v ){
            $_GET[$k] = sanitize_text_field( $v );
        }

        return $_GET;
    }

    public static function clean_post(){
        
        return stripslashes_deep( $_POST );
        
    }

}

SC_Admin::init();

?>