<?php
/**
  * Gives the page details for WordPress parameters
  * 
  */

if( ! defined( 'ABSPATH' ) ) exit;

class Shortcoder_Metadata{
    
    public static function init(){
        
    }
    
    public static function metadata(){
        
        global $post;
        
        $d = array();
        $defaults = array(
            'title' => '',
            'url' => '',
            'short_url' => '',
            
            'post_id' => '',
            'post_excerpt' => '',
            'post_comments_count' => '',
            'post_image' => '',
            'post_author' => '',
            'post_date' => '',
            'post_modified_date' => '',
            'post_slug' => '',
            
            'site_name' => get_bloginfo( 'name' ),
            'site_description' => get_bloginfo( 'description' ),
            'site_url' => get_bloginfo( 'url' ),
            'site_wpurl' => get_bloginfo( 'wpurl' ),
            'site_charset' => get_bloginfo( 'charset' ),
            'wp_version' => get_bloginfo( 'version' ),
            'stylesheet_url' => get_bloginfo( 'stylesheet_url' ),
            'stylesheet_directory' => get_bloginfo( 'stylesheet_directory' ),
            'template_url' => get_bloginfo( 'template_url' ),
            'atom_url' => get_bloginfo( 'atom_url' ),
            'rss_url' => get_bloginfo( 'rss2_url' ),
            
            'day' => date_i18n( 'j' ),
            'day_lz' => date_i18n( 'd' ),
            'day_ws' => date_i18n( 'D' ),
            'day_wf' => date_i18n( 'l' ),
            'month' => date_i18n( 'n' ),
            'month_lz' => date_i18n( 'm' ),
            'month_ws' => date_i18n( 'M' ),
            'month_wf' => date_i18n( 'F' ),
            'year' => date_i18n( 'Y' ),
            'year_2d' => date_i18n( 'y' ),
            
        );
        
        if( in_the_loop()) {
            
            $d = self::meta_by_id( get_the_ID() );
            
        }else{
            
            if( is_home() && get_option( 'show_on_front' ) == 'page' ){
                
                $d = self::meta_by_id( get_option( 'page_for_posts' ) );
                
            }elseif( is_front_page() || ( is_home() && ( get_option( 'show_on_front' ) == 'posts' || !get_option( 'page_for_posts' ) ) ) ){
                
                $d = array(
                    'title' => get_bloginfo( 'name' ),
                    'url' => get_bloginfo( 'url' ),
                    'post_excerpt' => get_bloginfo( 'description' ),
                    'short_url' => get_bloginfo( 'url' ),
                );
                
            }elseif( is_singular() ){
                
                if( is_object( $post ) ){
                    $d = self::meta_by_id( $post->ID );
                }
            
            }elseif( is_tax() || is_tag() || is_category() ){
                
                $term = get_queried_object();
                $d = array(
                    'title' => wp_title( '', false ),
                    'url' => get_term_link( $term, $term->taxonomy ),
                    'post_excerpt' => $term->description
                );
                
            }elseif( function_exists( 'get_post_type_archive_link' ) && is_post_type_archive() ){
                
                $post_type = get_query_var( 'post_type' );
                $post_type_obj = get_post_type_object( $post_type );
                
                $d = array(
                    'title' => wp_title( '', false ),
                    'url' => get_post_type_archive_link( $post_type ),
                    'post_excerpt' => $post_type_obj->description
                );
                
            }elseif( is_date() ){
                
                if( is_day() ){
                    
                    $d = array(
                        'title' => wp_title( '', false ),
                        'url' => get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) )
                    );
                    
                }elseif( is_month() ){
                    
                    $d = array(
                        'title' => wp_title( '', false ),
                        'url' => get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) )
                    );
                    
                }elseif( is_year() ){
                    
                    $d = array(
                        'title' => wp_title( '', false ),
                        'url' => get_year_link( get_query_var( 'year' ) )
                    );
                    
                }
                
            }elseif( is_author() ){
                
                $d = array(
                    'title' => wp_title( '', false ),
                    'url' => get_author_posts_url( get_query_var( 'author' ), get_query_var( 'author_name' ) )
                );
                
            }elseif( is_search() ){
                
                $d = array(
                    'title' => wp_title( '', false ),
                    'url' => get_search_link()
                );
                
            }elseif( is_404() ){
                
                $d = array(
                    'title' => wp_title( '', false ),
                    'url' => home_url( esc_url( $_SERVER['REQUEST_URI'] ) )
                );
                
            }
        }
        
        $meta = wp_parse_args( $d, $defaults );
        foreach( $meta as $key => $val ){
            if( is_string( $val ) ){
                $val = trim( $val );
            }
            $meta[ $key ] = $val;
        }
        $meta = apply_filters( 'sc_mod_metadata', $meta );
        
        return $meta;
        
    }
    
    public static function meta_by_id( $id ){
        
        $d = array();
        
        if( $id ){
            $d = array(
                'title' => get_the_title( $id ),
                'url' => get_permalink( $id ),
                'short_url' => wp_get_shortlink( $id ),
                
                'post_id' => $id,
                'post_excerpt' => self::excerpt(),
                'post_comments_count' => get_comments_number( $id ),
                'post_image' => self::post_image( $id ),
                'post_author' => get_the_author(),
                'post_date' => get_the_date(),
                'post_modified_date' => get_the_modified_date(),
                'post_slug' => self::post_slug()
            );

            if( $d[ 'short_url' ] == '' ){
                $d[ 'short_url' ] = $d[ 'url' ];
            }

        }
        
        return $d;
        
    }
    
    public static function excerpt(){
        
        global $post;
        
        if( !is_object( $post ) ){
            return '';
        }
        
        return $post->post_excerpt;
        
    }
    
    public static function post_image( $post_id ){
        
        $thumbnail = get_the_post_thumbnail_url( $post_id );
        
        if( $thumbnail === false ){
            return '';
        }else{
            return $thumbnail;
        }
        
    }
    
    public static function post_slug(){

        global $post;

        if( !is_object( $post ) ){
            return '';
        }

        return $post->post_name;

    }

}

Shortcoder_Metadata::init();

?>