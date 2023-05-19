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
define( 'AUTH_KEY',         'Lo!|,GI^{9]GSDTeHKVKiI4Rs>O) jJLidrT>c9QvoeEom_E3?]|w4:;tz)duN^A' );
define( 'SECURE_AUTH_KEY',  'uT}hP6&0FmNTD0o?k|@rq?3H0/_-1RVj7wW j0mXS/VZ[yq%b4_j=+c_$[nCG7)>' );
define( 'LOGGED_IN_KEY',    ':f($imB@p{d$-MX/]u)Vj`TdiA]p<4.]_wWi5!bX02A6r}gdUYdk).a@$yz5D=Fa' );
define( 'NONCE_KEY',        'vTC.AMmhtawU;mu*26=q$:5ZM`K40>ETn<dmP/)JRn{Xf9g}o=CS-R, ^>< m7Sk' );
define( 'AUTH_SALT',        ':N&qB]W*X<z>Nn}PE1~B4rp^0U=VfCW(eL! xm:m?|k[~mU+rt/%Vb8tMr$r3w+t' );
define( 'SECURE_AUTH_SALT', '$r(@te.e:2#;;Qra`V63ohL4.`yf:N1,1[CLi.gI*Ykx3wq:0}8J,][kWp!kaPQs' );
define( 'LOGGED_IN_SALT',   '?-I9YkLsE!jaS9q,*n[;xh!CJEnck4pn#Z??}VosN+/?I-3^o1YsG/u=j,/<QG:W' );
define( 'NONCE_SALT',       'gh3M8>[Ab3CTJ@8adPl0JAwJ1 YL| Y>h{M79H`eYpkt/Dw1r40e(bb++e([IvdQ' );

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
