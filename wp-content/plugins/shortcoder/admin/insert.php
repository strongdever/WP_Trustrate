<?php if( ! defined( 'ABSPATH' ) ) exit; ?>
<!DOCTYPE html>
<html>
<head>
<title>Insert shortcode</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="<?php echo SC_ADMIN_URL; ?>css/style-insert.css<?php echo '?ver=' . SC_VERSION; ?>" media="all" rel="stylesheet" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="<?php echo SC_ADMIN_URL; ?>js/script-insert.js<?php echo '?ver=' . SC_VERSION; ?>"></script>
</head>
<body>

<div class="sc_menu">
    <input type="search" class="sc_search" placeholder="Search ..." />
    <div class="top_btns">
        <a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=shortcoder' ) ); ?>" target="_blank" class="button"><?php _e( 'Create Shortcode', 'shortcoder' ) ?></a>
        <span class="promo_link">
<?php
    $promo_links = array(
        array('super-rss-reader/?utm_source=shortcoder&utm_medium=insert&utm_campaign=srr-pro', 'Super RSS Reader', 'super-rss-reader.png'),
        array('ultimate-floating-widgets/?utm_source=shortcoder&utm_medium=insert&utm_campaign=ufw-pro', 'Ultimate Floating Widgets', 'ultimate-floating-widgets.png'),
        array('announcer/?utm_source=shortcoder&utm_medium=sidebar&utm_campaign=announcer-pro', 'Announcer', 'announcer.png'),
    );
    $promo_link_id = array_rand( $promo_links, 1 );
    $promo_link = $promo_links[$promo_link_id ];
?>
            <a class="button" href="https://www.aakashweb.com/wordpress-plugins/<?php echo $promo_link[0]; ?>" target="_blank"><i><?php _e( 'Check out:', 'shortcoder' ) ?> </i> <?php echo $promo_link[1]; ?></a>
            <span><img src="<?php echo esc_url( SC_ADMIN_URL . '/images/' . $promo_link[2] ); ?>" /></span>
        </span>
    </div>
</div>

<div class="sc_list">
<?php

$shortcodes = Shortcoder::get_shortcodes();

if( empty( $shortcodes ) ){
    echo '<p class="sc_note">No shortcodes are created, go ahead create one in <a href="' . esc_url( admin_url( 'post-new.php?post_type=' . SC_POST_TYPE ) ) . '" target="_blank">shortcoder admin page</a>.</p>';
}else{

    foreach( $shortcodes as $name => $options ){
        $id = $options[ 'id' ];
        $content = $options[ 'content' ];
        $settings = $options[ 'settings' ];
        $params = array();

        preg_match_all( '/%%(.*?)%%/', $content, $matches );

        $cp_data = $matches[1];

        if( !empty( $cp_data ) ){

            $cp_data = array_map( 'strtolower', $cp_data );

            foreach( $cp_data as $data ){
                $colon_pos = strpos( $data, ':' );
                if( $colon_pos === false ){
                    array_push( $params, trim( $data ) );
                }else{
                    $cp_name = substr( $data, 0, $colon_pos );
                    array_push( $params, trim( $cp_name ) );
                }
            }
        }

        $enclosed_sc = strpos( $content, '$$enclosed_content$$' ) !== false ? 'true' : 'false';

        echo '<div class="sc_wrap" data-name="' . esc_attr( $name ) . '" data-id="' . esc_attr( $id ) . '" data-enclosed="' . esc_attr( $enclosed_sc ) . '">';
            echo '<div class="sc_head">';
                echo '<img src="' . esc_url( SC_ADMIN_URL ) . '/images/arrow.svg" width="16" />';
                echo '<h3>' . esc_html( $settings[ '_sc_title' ] ) . '</h3>';
                echo '<p>' . esc_html( $settings[ '_sc_description' ] ) . '</p>';
                echo '<div class="sc_tools">';
                    if( current_user_can( 'edit_post', $id ) ){
                        echo '<a href="' . esc_url( admin_url( 'post.php?action=edit&post=' . $id ) ) . '" class="button" target="_blank">' . esc_html__( 'View/Edit', 'shortcoder' ) . '</a>';
                    }
                    echo '<button class="button sc_copy">' . esc_html__( 'Copy', 'shortcoder' ) . '</button>';
                    echo '<button class="button sc_insert">' . esc_html__( 'Insert', 'shortcoder' ) . '</button>';
                echo '</div>';
            echo '</div>';

            echo '<div class="sc_options">';

            if( !empty( $params ) ){
                echo '<h4>' . esc_html__( 'Available parameters', 'shortcoder' ) . ': </h4>';
                echo '<div class="sc_params_wrap">';
                $temp = array();

                foreach( $params as $k => $v ){
                    $cleaned = str_replace( '%', '', $v );
                    if( !in_array( $cleaned, $temp ) ){
                        array_push( $temp, $cleaned );
                        echo '<label>' . esc_html( $cleaned ) . ': <input type="text" class="sc_param" data-param="' . esc_attr( $cleaned ) . '"/></label> ';
                    }
                }

                echo '</div>';

            }else{
                echo '<p>' . esc_html__( 'No parameters present in this shortcode', 'shortcoder' ) . '</p>';
            }

            echo '<div class="sc_foot">';
                echo '<button class="sc_insert button button-primary">' . esc_html__( 'Insert shortcode', 'shortcoder' ) . '</button>';
                if( $enclosed_sc == 'true' ){
                    echo '<span>' . esc_html__( 'Has enclosed content parameter', 'shortcoder' ) . '</span>';
                }
            echo '</div>';

            echo '</div>';
        echo '</div>';
    }

    echo '<p class="sc_note sc_search_none">' . esc_html__( 'No shortcodes match search term !', 'shortcoder' ) . '</p>';

}

?>
</div>

<div class="note">
<p><strong>Note:</strong> When shortcodes are inserted in a post, please ensure all the shortcodes are closed. Click for more details.</p>
    <table>
        <tr>
<td>
<pre>
Paragraph 1
[sc name="my-shortcode-1"]

Paragraph 2
[sc name="my-shortcode-2"]

Paragraph 3
[sc name="my-shortcode-3"][/sc]
</pre>
<p>❌ Here, everything between <code>my-shortcode-1</code> and <code>my-shortcode-3</code> won't be displayed because <code>my-shortcode-3</code> has a closing shortcode.</p>
<p>So all the contents between <code>[sc name="my-shortcode-1"] ... [/sc]</code> are taken inside <code>my-shortcode-1</code>.</p>
</td>

<td>
<pre>
Paragraph 1
[sc name="my-shortcode-1"][/sc]

Paragraph 2
[sc name="my-shortcode-2"][/sc]

Paragraph 3
[sc name="my-shortcode-3"][/sc]
</pre>
<p>✅ Close all the Shortcoder's shortcodes in a post with <code>[/sc]</code>. <a href="https://codex.wordpress.org/Shortcode_API#Unclosed_Shortcodes" target="_blank">Learn more</a></p>
</td>
        </tr>
    </table>
</div>

<div class="footer_thanks">Thanks for using <a href="https://www.aakashweb.com/wordpress-plugins/shortcoder/" target="_blank">Shortcoder</a> &bull; Please <a href="https://wordpress.org/support/plugin/shortcoder/reviews/?rate=5#new-post" target="_blank">rate 5 stars</a> and spread the word.</div>

<?php do_action( 'sc_do_insert_popup_footer' ); ?>

</body>
</html>