$(document).ready(function() {
   colorpicker.get("picker_append");
});

function cp_destroy(){
	colorpicker.destroy();
	return false;
}

function cp_create(){
	colorpicker.get("picker_append");
	return false;
}