var jcrop_api = null;
var scale = null;

function randomString(string_length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function destroy_jcrop()
{
    if (jcrop_api != null) {
        jcrop_api.destroy();
        jcrop_api = null;
    }
}

function initCropFor(version, original_id, cropped_id, form_id, crop_width, crop_height) {

    var aspect_ratio = null;
	if (crop_width && crop_height)
		aspect_ratio = crop_width / crop_height;

    var original = $('#' + original_id)
    var img = $('#'+cropped_id);
    var parent = img.parent();

    var v_src = img.attr('src');

    var original_width = original.width();
    if (scale == null) {
        scale = original_width > 600 ? 600 / original_width : 1;
        original.width(original_width * scale)
    }

    original_width = original.width()
    var original_height = original.height();

    var form = $('#'+form_id);
    var field_x = form.find('#id_x')
    var field_y = form.find('#id_y')
    var field_x2 = form.find('#id_x2')
    var field_y2 = form.find('#id_y2')
    var field_version = form.find('#id_version');
    field_version.val(version);

    var cropSelect = function(coords){

        if (parseInt(coords.w) > 0) {
            if (img.attr('src') != original.attr('src')) {
                img.attr('src', original.attr('src'));
                img.width(crop_width);
                img.height(crop_height);
            }

            var this_width = crop_width || crop_height / coords.h * coords.w;
            var this_height = crop_height || crop_width / coords.w * coords.h;

            var x_scale = this_width / coords.w;
            var y_scale = this_height / coords.h;

            parent.css({
                width: Math.round(this_width) + 'px',
                height: Math.round(this_height) + 'px',
                display: 'block'
            });
            img.css({
                width: Math.round(x_scale * original_width) + 'px',
                height: Math.round(y_scale * original_height) + 'px',
                marginLeft: '-' + Math.round(x_scale * coords.x) + 'px',
                marginTop: '-' + Math.round(y_scale * coords.y) + 'px',
            });

            field_x.val(Math.round(coords.x / scale));
            field_y.val(Math.round(coords.y / scale));
            field_x2.val(Math.round(coords.x2 / scale));
            field_y2.val(Math.round(coords.y2 / scale));
        }
        else
        {
            img.attr('src', v_src);
            parent.css({
                width: 'auto',
                height: 'auto',
                display: 'block'
            });
            img.css({
                width: 'auto',
                height: 'auto',
                marginLeft: '0px',
                marginTop: '0px',
            });
            field_x.val('');
            field_y.val('');
            field_x2.val('');
            field_y2.val('');
        }
    }

    original.Jcrop({
        aspectRatio: aspect_ratio,
        onSelect: cropSelect,
        onChange: cropSelect,
    }, function() { jcrop_api = this;});
}
