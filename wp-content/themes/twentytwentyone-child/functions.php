
<?php
add_shortcode('url', function ( $atts ) {
    if(isset($atts['arg'])) {
        return site_url($atts['arg']);
    }
    return get_theme_file_uri();
} );

remove_filter('term_description','wpautop');
remove_filter( 'the_content', 'wpautop' );

add_shortcode('news', function ( $atts ) {
    $num = ( isset( $atts['num'] ) ? $atts['num'] : -1 );
    query_posts( array( 'posts_per_page' => $num ) );
    ob_start();
    while ( have_posts() ) :
        the_post(); ?>
        <div class="news-category" id="btn-news-category">
            <div class="section-item">
                <h4><?php echo date('Y年m月d日', strtotime( get_the_date() ) ); ?></h4>
                <div class="news-category-group">
                    <?php
                    $cats = get_the_category();
                    if ( $cats ) { 
                        foreach ( $cats as $cat ) { ?>
                            <div class="category"><?php echo $cat->name; ?></div>
                        <?php
                        }
                    } ?>
                </div>
                <div class="news-article"><?php the_title(); ?></div>
                <div class="news-content" style="display:none"><?php the_content(); ?></div>
            </div>
        </div>
    <?php
    endwhile;
    wp_reset_query();
    return ob_get_clean();
} );

add_shortcode('news-page', function ( $atts ) {
    $num = ( isset( $atts['num'] ) ? $atts['num'] : -1 );
    query_posts( array( 'posts_per_page' => $num ) );
    ob_start();
    while ( have_posts() ) :
        the_post(); ?>
        <div class="news-category" id="btn-news-category">
            <div class="section-item news-page-item">
                <h4><?php echo date('Y年m月d日', strtotime( get_the_date() ) ); ?></h4>
                <div class="news-category-group">
                    <?php
                    $cats = get_the_category();
                    if ( $cats ) { 
                        foreach ( $cats as $cat ) { ?>
                            <div class="category"><?php echo $cat->name; ?></div>
                        <?php
                        }
                    } ?>
                </div>
                <div class="news-article"><?php the_title(); ?></div>
                <div class="news-content" style="display:none"><?php the_content(); ?></div>
                <hr>
            </div>
        </div>
    <?php
    endwhile;
    wp_reset_query();
    return ob_get_clean();
} );