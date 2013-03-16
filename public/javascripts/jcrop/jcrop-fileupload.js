jQuery(function($){

    // Create variables (in this scope) to hold the API and image size
    var jcrop_api,
        boundx,
        boundy,
        minsize = 48,
        maxsize = 100,

    // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height();

    console.log('init',[xsize,ysize]);
    $('#target').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        bgOpactiy: 0.5,
        bgColor: '#efefef',
        aspectRatio: 1,
        minSize: [minsize, minsize],
        maxSize: [maxsize, maxsize],
        setSelect: [0, 0, 100, 100 ]
    },function(){
        // Use the API to get the real image size
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        // Store the API in the jcrop_api variable
        jcrop_api = this;

        // Move the preview into the jcrop container for css positioning
        $preview.appendTo(jcrop_api.ui.holder);
        var v = $('#img_position').val();

        if (v !== undefined) {
            v = v.split(',');
            jcrop_api.setSelect([v[2], v[3], v[4], v[5]]);
        } else {
            jcrop_api.setSelect([0, 0, 50, 50]);
        }
    });

    function updatePreview(c)
    {
        if (parseInt(c.w) > 0)
        {
            var rx = xsize / c.w;
            var ry = ysize / c.h;

            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });

            $('#img_positon').val((function() {
                var data = [],
                    i,
                    list = ['w', 'h', 'x', 'y', 'x2', 'y2'];
                for (i = 0, l = list.length; i < l; i++) {
                    data.push(Math.round(c[list[i]]));
                }
                return data.join(',');
            })());
        }
    };

});