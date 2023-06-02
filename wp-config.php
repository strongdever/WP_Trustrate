<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'trustrate' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'I`1Of<*$R?Hv.$XCu:/MGz)MK78W{H!E|!G@SA6SS6ZRmoGwHfk-xiHgyy]9{cQs' );
define( 'SECURE_AUTH_KEY',  'iL+6psdNIAm0HNiQH}krZA<|LCM9/1n&!Zp]YAG6;X@<3D`X>*tyi5b[YgUf*xTc' );
define( 'LOGGED_IN_KEY',    'zf&Z$1j4D91&`w~Ts?J/=hZD$MGF-xi.(w#<-_fjexW*:2}I{a:,pZcLL0|fl:L]' );
define( 'NONCE_KEY',        '8xV!2L6=<]*(wbO?#F[jLp1t*hah7)5)kS#deks3CT)`D3+Q;6n~HCP)m=pU$twL' );
define( 'AUTH_SALT',        '0/RDYeXS1&*f+imyzed>_(!Yo?m7F%c7@xoDR ]hVf^J =S3@{%O=c`0].JFr*>i' );
define( 'SECURE_AUTH_SALT', 'VNO@gt4rc~;0^$/R?;i, {|^5f*=.BGo&),r0 6Bk.[GABe=]Vo$|ZMYa-*LRISe' );
define( 'LOGGED_IN_SALT',   'EnR7mcX$( T1a30^,=6:|0H1($c.j^GD7cYm0[P# dnQcxSfxl4-S$;QXcWp&9t+' );
define( 'NONCE_SALT',       'D7R`d21GL?Yufz;C4aMY;W7}J l!{} 8/?Q%3eN`O3frT||hu_R9a<>HZFaZ&^=9' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
