<?php

if( ! defined( 'ABSPATH' ) ) exit;

class Shortcoder_Updates{

    public static function init(){

        add_action( 'admin_init', array( __CLASS__, 'do_update' ) );

    }

    public static function do_update(){

        $previous_version = self::get_previous_version();
        $current_version = SC_VERSION;

        if( version_compare( $previous_version, $current_version, '>=' ) ){
            return true;
        }

        if ( get_transient( 'sc_upgrade' ) === 'yes' ) {
            return false;
        }

        set_transient( 'sc_upgrade', 'yes', MINUTE_IN_SECONDS * 3 );

        if( version_compare( $previous_version, '5.0', '<' ) ){
            if( !self::do_update_50() ){
                return false;
            }
        }

        if( version_compare( $previous_version, '5.0', '>' ) && version_compare( $previous_version, '5.1', '<' ) ){
            if( !self::do_update_504() ){
                return false;
            }
        }

        // Register roles every time plugin is updated.
        self::register_roles();

        delete_transient( 'sc_upgrade' );

        update_option( 'shortcoder_version', $current_version );

    }

    public static function do_update_50(){

        $o_scs = get_option( 'shortcoder_data' );
        $n_scs = Shortcoder::get_shortcodes();

        if( empty( $o_scs ) ){
            return true;
        }

        // Remove kses filtering before the migration
        remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
        remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

        foreach( $o_scs as $o_name => $o_props ){

            if( array_key_exists( 'post_id', $o_props ) || array_key_exists( $o_name, $n_scs ) ){
                continue;
            }

            if( post_exists( $o_name, '', '', SC_POST_TYPE ) != 0 ){
                continue;
            }

            $status = ( isset( $o_props[ 'disabled' ] ) && $o_props[ 'disabled' ] == 0 ) ? 'no' : 'yes';
            $disable_admin = ( isset( $o_props[ 'hide_admin' ] ) && $o_props[ 'hide_admin' ] == 0 ) ? 'no' : 'yes';
            $content = isset( $o_props[ 'content' ] ) ? $o_props[ 'content' ] : '';
            $editor = isset( $o_props[ 'editor' ] ) ? $o_props[ 'editor' ] : 'code';
            $tags = isset( $o_props[ 'tags' ] ) ? $o_props[ 'tags' ] : array();
            $devices = isset( $o_props[ 'devices' ] ) ? $o_props[ 'devices' ] : 'all';

            $post_id = wp_insert_post( array(
                'post_title' => $o_name,
                'post_name' => $o_name,
                'post_content' => $content,
                'post_type' => SC_POST_TYPE,
                'post_status' => 'publish',
                'tax_input' => array(
                    'sc_tag' => $tags
                ),
                'meta_input' => array(
                    '_sc_disable_sc' => $status,
                    '_sc_disable_admin' => $disable_admin,
                    '_sc_editor' => $editor,
                    '_sc_allowed_devices' => $devices,
                    '_sc_migrated' => 'yes'
                )
            ));

            if( $post_id ){
                $o_scs[ $o_name ][ 'post_id' ] = $post_id;
            }else{
                return false;
            }

        }

        update_option( 'shortcoder_data', $o_scs );

        // Enabling the filters back
        add_filter( 'content_save_pre', 'wp_filter_post_kses' );
        add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

        return true;

    }

    public static function do_update_504(){

        $o_scs = get_option( 'shortcoder_data' );

        if( empty( $o_scs ) ){
            return true;
        }

        // Remove kses filtering before the migration
        remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
        remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

        foreach( $o_scs as $o_name => $o_props ){

            if( !array_key_exists( 'post_id', $o_props ) || !isset( $o_props[ 'content' ] ) ){
                continue;
            }

            if( array_key_exists( '_scc_fix', $o_props ) ){
                continue;
            }

            $sc_pid = $o_props[ 'post_id' ];
            $sc_content = $o_props[ 'content' ];

            wp_insert_post( array(
                'ID' => $sc_pid,
                'post_content' => $sc_content,
                'post_type' => SC_POST_TYPE,
                'post_status' => 'publish'
            ));

            $o_scs[ $o_name ][ '_scc_fix' ] = true;

        }

        update_option( 'shortcoder_data', $o_scs );

        // Enabling the filters back
        add_filter( 'content_save_pre', 'wp_filter_post_kses' );
        add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

        return true;

    }

    public static function register_roles(){

        $capability_type = 'shortcoder';

        $capabilities = array(
            "edit_{$capability_type}",
            "read_{$capability_type}",
            "delete_{$capability_type}",
            "edit_{$capability_type}s",
            "edit_others_{$capability_type}s",
            "publish_{$capability_type}s",
            "delete_{$capability_type}s",
            "delete_published_{$capability_type}s",
            "delete_others_{$capability_type}s",
            "edit_published_{$capability_type}s",
        );

        $roles = array( 'administrator' );

        foreach( $roles as $role_name ){

            $role = get_role( $role_name );

            foreach( $capabilities as $cap ){
                $role->add_cap( $cap );
            }

        }

    }

    public static function get_previous_version(){

        $version = get_option( 'shortcoder_version' );

        if( $version ){
            return $version;
        }

        $sc_flags = get_option( 'shortcoder_flags' );

        if( !$sc_flags ){
            return '0';
        }

        if( !is_array( $sc_flags ) || !array_key_exists( 'version', $sc_flags ) ){
            return '0';
        }

        return $sc_flags[ 'version' ];

    }

}

Shortcoder_Updates::init();

?>