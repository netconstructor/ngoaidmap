
  var map;
  var bounds;
  var overlay; 
  var map;
  var baseUrl="http://chart.apis.google.com/chart?chs=256x256";
  var global_index = 10;

  $(document).ready( function() {
    var styleMapType = new google.maps.StyledMapType(stylez, styledMapOptions);    

    var mapChartOptions = {
        getTileUrl: function(coord, zoom) {
            var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
            var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);     
            var projectionMap = new MercatorProjection();
            var lULg = projectionMap.fromDivPixelToLatLng(lULP, zoom);
            var lLRg = projectionMap.fromDivPixelToLatLng(lLRP, zoom);                 
            return baseUrl+"&chd="+chd+"&chco="+chco+"&chld="+chld+"&chf="+chf+"&cht=map:fixed="+
               lULg.lat() +","+ lULg.lng() + "," + lLRg.lat() + "," + lLRg.lng();
        },
        tileSize: new google.maps.Size(256, 256),
        opacity:parseFloat(0.4),
        isPng: true
    };
    var mapChartType = new google.maps.ImageMapType(mapChartOptions);      
    
    bounds =new google.maps.LatLngBounds(
      new google.maps.LatLng(bbox[0].lat,bbox[0].lon),
      new google.maps.LatLng(bbox[1].lat,bbox[1].lon)
      ); 

    var myOptions = {
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoom: 2,
      center: bounds.getCenter()
    }
    if ($('#map').length>0) {
      map = new google.maps.Map(document.getElementById("map"), myOptions);
    } else {
      map = new google.maps.Map(document.getElementById("small_map"), myOptions);
    }
    map.overlayMapTypes.insertAt(2, mapChartType);
    map.mapTypes.set('labels', styleMapType);
    map.setMapTypeId('labels');
    
    google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() > 12) map.setZoom(12);
    });
    

    var range = max_count/6;
    var diameter = 0;
    
    for (var i = 0; i<map_data.length; i++) {
      if (map_data[i].count <range) {
        diameter = 16;
        marker_image = marker_source+'marker_1.png';
      } else if ((map_data[i].count>=(range)) && (map_data[i].count<(range*2))) {
        diamter = 20;
        marker_image = marker_source+'marker_2.png';
      } else if ((map_data[i].count>=(range*2)) && (map_data[i].count<(range*3))) {
        diameter = 26;
        marker_image = marker_source+'marker_3.png';
      } else if ((map_data[i].count>=(range*3)) && (map_data[i].count<(range*4))) {
        diameter = 34;
        marker_image = marker_source+'marker_4.png';
      } else if ((map_data[i].count>=(range*4)) && (map_data[i].count<(range*5))) {
        diameter = 42;
        marker_image = marker_source+'marker_5.png';
      } else {
        diameter = 58;
        marker_image = marker_source+'marker_6.png';
      }
      var marker_ = new IOMMarker(map_data[i],diameter, marker_image,map);
    }
    

    map.fitBounds(bounds);
    
    //Positionate zoom controls
    positionZoomControls();
    $('#zoomIn').fadeIn();
    $('#zoomOut').fadeIn();
    window.onResize = positionZoomControls;
  });
  
  
  function positionZoomControls() {
    if ($('#layout').length>0) {
      var column_position = $('#layout').offset().left;
      var map_position = $('#map').position().top + 25;
    } else {
      var column_position = $('#project_layout').offset().left;
      var map_position = $('#small_map').position().top + 25;
    }
    
    $('#zoomIn').css('left',column_position+'px');
    $('#zoomIn').css('top',map_position+'px');
    
    $('#zoomOut').css('left',column_position+32+'px');
    $('#zoomOut').css('top',map_position+'px');
  }
  
  
  function zoomIn() {
    var zoom = map.getZoom();
    if (zoom<12) {
      map.setZoom(zoom+1);
    }
  }
  
  function zoomOut() {
    map.setZoom(map.getZoom() - 1);
  }
  
  
  
  
  
  
  