<?php

if( ! defined( 'ABSPATH' ) ) exit;

class SC_Admin_Form{

    public static function table( $rows = array(), $print = false, $class = '' ){
        
        $html = '<table class="form-table ' . esc_attr( $class ) . '">';
        
        foreach( $rows as $row ){
            $html .= '<tr ' . ( isset( $row[2] ) ? $row[2] : '' ) . '>';
                $html .= '<th>' . ( isset( $row[0] ) ? $row[0] : '' ) . '</th>';
                $html .= '<td>' . ( isset( $row[1] ) ? $row[1] : '' ) . '</td>';
            $html .= '</tr>';
        }
        
        $html .= '</table>';
        
        if( $print ){
            echo $html;
        }else{
            return $html;
        }
        
    }

    public static function field( $field_type, $params = array() ){
        
        $fields = array( 'text', 'select', 'checkbox', 'textarea' );

        $default_props = array(
            'id' => '',
            'name' => '',
            'class' => '',
            'value' => '',
            'list' => array(),
            'type' => 'text',
            'required' => '',
            'placeholder' => '',
            'rows' => '',
            'cols' => '',
            'helper' => '',
            'tooltip' => '',
            'before_text' => '',
            'after_text' => '',
            'custom' => ''
        );

        if( !in_array( $field_type, $fields ) ){
            return '';
        }
        
        $params = Shortcoder::set_defaults( $params, $default_props );
        $params = self::clean_attr( $params );
        $field_html = '';

        extract( $params, EXTR_SKIP );
        
        $id_attr = empty( $id ) ? '' : 'id="' . $id . '"';

        switch( $field_type ){
            case 'text':
                $field_html = "<input type='$type' class='$class' $id_attr name='$name' value='$value' placeholder='$placeholder' " . ( $required ? "required='$required'" : "" ) . " $custom />";
            break;
            
            case 'select':
                $field_html .= "<select name='$name' class='$class' $id_attr $custom>";
                foreach( $list as $k => $v ){
                    $field_html .= "<option value='$k'" . selected( $value, $k, false ) . ">$v</option>";
                }
                $field_html .= "</select>";
            break;

            case 'textarea':
                $field_html .= "<textarea $id_attr name='$name' class='$class' placeholder='$placeholder' rows='$rows' cols='$cols' $custom>$value</textarea>";
            break;

            case 'checkbox':
                $field_html .= '<div class="radios_wrap">';
                foreach( $list as $k => $v ){
                    $checked = in_array( $k, $value ) ? ' checked="checked"' : '';
                    $field_html .= "<label class='lbl_margin' $custom><input type='checkbox' name='{$name}[]' class='$class' value='$k' $id_attr $checked />&nbsp;$v </label>";
                }
                $field_html .= '</div>';
            break;

        }

        if( !empty( $tooltip ) ){
            $field_html .= "<div class='sc-tt'><span class='dashicons dashicons-editor-help'></span><span class='sc-tt-text'>$tooltip</span></div>";
        }
        
        if( !empty( $helper ) ){
            $field_html .= "<p class='description'>$helper</p>";
        }
        
        return $field_html;
        
    }

    public static function clean_attr( $a ){
        
        foreach( $a as $k=>$v ){
            if( is_array( $v ) ){
                $a[ $k ] = self::clean_attr( $v );
            }else{
                
                if( in_array( $k, array( 'custom', 'tooltip', 'helper', 'before_text', 'after_text' ) ) ){
                    $a[ $k ] = wp_kses_post( $v );
                }else{
                    $a[ $k ] = esc_attr( $v );
                }
            }
        }
        
        return $a;
    }

}

?>