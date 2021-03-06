

    $(document).ready( function() {
      $('div#header div.left').width(820);
      
      //If description is bigger than main_head
      if (($('div.inner_main_head div.right').height()+64)>$('div.inner_main_head div.left div.float_head').height()) {
        $('div.inner_main_head div.left').height($('div.inner_main_head div.right').height());
        $('div.inner_main_head div.left div.float_head').height($('div.inner_main_head div.right').height() + 40);
      } else {
        $('div.inner_main_head div.left').height($('div.inner_main_head div.left div.float_head').height()-39);
      }
      
      //If right part is bigger than float left
      resizeColumn();
    });
    
    
    function resizeColumn() {
      if ($('div#left_column div.float_left').height() < $('div#left_column div.right').height()) {
        var offset =  $('div#left_column div.right').height() - $('div#left_column div.float_left').height() + 100;
        $('div#left_column div.float_left div.block:last').height(offset);
      }
      
      if ($('div#left_column div.float_left').height() > $('div#left_column div.left').height()) {
        $('div#left_column div.left').height($('div#left_column div.float_left').height());
      }
      
      //If right part is bigger than float left
      // $('div#left_column div.outer_float').height($('div#left_column div.left').height()-81);
      
      
      // TO ADAPT LEFT AND RIGHT COLUMN PROPERLY
      if ($('div#left_column div.outer_float').height() > $('div#left_column div.right').height()){
        $('div#left_column div.right').height($('div#left_column div.outer_float').height());
      } else {
        $('div#left_column div.outer_float').height($('div#left_column div.right').height() + 40);
        var dif = $('div#left_column div.outer_float').height() - ($('div#left_column div.float_left').height());
        $('div#most_active_orgs').height($('div#most_active_orgs').height() + dif + 41);
		// console.log($('div#most_active_orgs').height());
      }
    }