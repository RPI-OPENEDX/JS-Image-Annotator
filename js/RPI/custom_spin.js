var imgSrc = location.search.split('img=')[1] ? location.search.split('img=')[1] : 'myDefaultValue';
var note_type = "stickers/check.png";
var editor_type = "draw"; 

function blackNote() {
  if (1==1){
    var $mybits = $(document.createElement('span'));
    var style = {"background":"url(" + note_type + ") no-repeat"};
    $mybits.css(style);
    $mybits.addClass("user_annotation");
    return $mybits;
  }

  if (note_type == 1) {
    return $(document.createElement('span')).addClass('black circle note');
  }else{
     return $(document.createElement('span')).addClass('set-label');
  }
}


function toggle_edit_type() {
  if (editor_type == "draw") {
    editor_type = "sticker";
    document.getElementById('draw_settings').style.display = "none";
    document.getElementById('sticker_settings').style.display = "block";
    document.getElementById('enable_editing').innerHTML = "Editor Mode:Sticker";
    document.getElementById('gameCanvas').style.zIndex = "1";
  }else if (editor_type == "sticker") {
    editor_type = "draw";
    document.getElementById('draw_settings').style.display = "block";
    document.getElementById('sticker_settings').style.display = "none";
    document.getElementById('enable_editing').innerHTML = "Editor Mode:Draw";
    document.getElementById('gameCanvas').style.zIndex = "2";
  }
}

$(window).load(function(){
    //load user image
    n = document.createElement('img'); // create an image element
    n.src = imgSrc; // relative path to the image
    n.id = 'userDoc';
    $(n).addClass("active_files");
    document.getElementById('toAnnotate').appendChild(n); // append the image to the body
    
    //make image annotatable
	$('#toAnnotate').annotatableImage(blackNote);
    
    //make canvas sketchable
    $(function() {
        $('#gameCanvas').sketch();
    });
    
    //load draw tools
    $(function() {
    $.each(['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'], function() {
      $('#draw_settings').append("<a href='#gameCanvas' data-color='" + this + "' style='width:32px; background: " + this + "; display: inline-block; border: 1px solid #000; height: 30px; line-height: 30px;'></a><br> ");
    });
    $.each([3, 5, 10, 15, 100], function() {
      $('#draw_settings').append("<a href='#gameCanvas' data-size='" + this + "' style='background: #ccc; display: inline-block; border: 1px solid #000; height: 30px; width: 100%; line-height: 30px; text-align: center;'>" + this + "</a><br> ");
    });
  });
    
    //load stickers
    $.get('resource', function(data){
        var stickers = data.split('\n');
        for (var i = 0, num = stickers.length; i < num - 1; ++i){
            var sticker_meta = stickers[i].split('/');
            $("#sticker_list").append($("<img src=" + stickers[i] + " id=" + sticker_meta[2] + " class=" + sticker_meta[1] + " style='width:50px; height:50px;'></img>"));    
        }
    });
    
    //get onclick events
    //download button
    $('#download').click(function() { 
        html2canvas($("#image_region"), {
            onrendered: function(canvas) {
                var imgData = canvas.toDataURL('image/png');              
                var doc = new jsPDF('p', 'mm');
                doc.addImage(imgData, 'PNG', 10, 10);
                doc.save('sample-file.pdf');
            }
        });
    });

    //stickers
    $( document ).on("click", "img.emoticons, img.stickers", function() {
        note_type = this.getAttribute("class") + '/' + this.getAttribute("id");  
        $("img#sticker_in_use").attr('src', note_type);
    });    
})
