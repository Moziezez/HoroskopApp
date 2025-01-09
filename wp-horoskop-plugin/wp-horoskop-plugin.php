<?php
/*
 * Plugin Name: Vedaversum Horoskopgenerator
 * Plugin URI:  https://vedaversum.eu-4.evennode.com/
 * Description: WordPress plugin Horoskopgenerator use [horo_input].
 * Version:     1.0.1
 * Author:      Maurice Schollmeyer
 */


function enqueue_related_pages_scripts_and_styles() {
	$version = 4;
	wp_enqueue_style('related-form-styles', plugins_url("css/formStyles.css?v={$version}", __FILE__), array(), '2.0.2');
    wp_enqueue_style('related-plot-styles', plugins_url("css/plotStyles.css?v={$version}", __FILE__), array(), '3.1.3');
	wp_enqueue_style('related-styles', plugins_url("css/styles.css?v={$version}", __FILE__), array(), '2.0.3');	
	wp_enqueue_style('related-datetime-styles', plugins_url('/css/jquery.datetimepicker.min.css', __FILE__));
	wp_enqueue_script('plotFunc.js');
	wp_enqueue_script('jquery');

	wp_enqueue_script('dt-js', 
					   plugins_url('/assets/datetimepicker-master/build/jquery.datetimepicker.full.min.js', __FILE__), 
					   array('jquery'), 
					   '', 
					   false
					  ); 

	wp_enqueue_script('geoapify-js', 
					   'https://unpkg.com/@geoapify/geocoder-autocomplete@^1/dist/index.min.js', 
					   array(), 
					   '1.0', 
					   false
					  ); 
}

add_action('wp_enqueue_styles','enqueue_related_pages_scripts_and_styles');
add_action('wp_enqueue_scripts','enqueue_related_pages_scripts_and_styles');

// Add a shortcode to display the index.html file
function display_html_file() {
    $file_path = plugin_dir_path(__FILE__) . 'plugin_index.html';
    ob_start();
    include $file_path;
    return ob_get_clean();
}

add_shortcode('horo_input', 'display_html_file', 9999);

