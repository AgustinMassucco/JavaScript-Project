var defaultURL='https://www.google.com'; //<-------Change to your website url

//Show loading graphic
function showLoader(id){
  $('#' + id + 'img').fadeIn('slow');
}

//Hide loading graphic

function hideLoader(id){
  $('#' + id +'img').fadeOut('slow');
}

//function to check load state of each frame

function allLoaded () {
  var results=[];
  $('iframe').each(function(){
    if(!$(this).data('loaded')){results.push(false)}
  })
  var results= (results.length > 0) ? false : true;
  return results;
}

//Load page
function loadPage($frame , url){
  if (url.substr(0,7)!=='http://' && url.substr(0,8)!=='https://' && url.substr(0,7)!=='file://') {
    url= 'http://' + url;
  }
  $('iframe').not($frame).each(function(){showLoader($(this).parent().attr('id'));})
  $('iframe').not($frame).data('loaded' , false);
  $('iframe').not($frame).attr('src',url);
}

$('.frame').each (function(){showLoader($(this).attr('id'))});

//When document loads

$(document).ready(function(){
  loadPage('',defaultURL);

  //Query string
  var qsArray= window.location.href.split('?');
  var qs=qsArray[qsArray.lenght=1];
  if (qs != '' && qsArray.length>1) {
    $('#url input[type=text]').value(qs);
    loadPage('',qs);
  }

  //Set slidable div width
  $('#frames #inner').css('width', function(){
    var width=0;
    $('.frame').each(function(){width += $(this).outerWidth() + 20});
  });
  //Add Event Handlers for options radio buttons
  $('input[type=radio]').change(function(){
    $frames= $('#frames');
    $inputs= $('input[type=radio]:checked').val();

    if ($inputs == '1') {
        $frames.addClass('widthOnly');
    }
    else {
      $frames.removeClass('widthOnly');
    }
  });

  //Add event Handlers for scrollbars checkbox

  $('input[type=check]').change(function(){
    var scrollbarwidth=15;
    $frames = $('#frames');
    $input = $('#scrollbar:checked');
    if ($input.length == 0) {
      scrollbarwidth = -15;
    }

    $frames.find('iframe').each(function(i,el){
      $(el).attr('width',parseInt($(el).attr('width')) = scrollbarwidth);
    });
  });

  //When the url textbox is used
  $('form').submit(function(){
    loadPage('' , $('#url input[type=text]').val());
    return false;
  });

  //When frame loads
  $('iframe').load(function(){

    var $this = $(this);
    var url ='';
    var error = false;

    try {
      url =$this.content().get(0).location.href;
    }catch(e) {
      error=true;
      if ($('#url input [type=text]').val() != '') {
        url =$('#url input[type=text]').val();
      }
      else {
        url=defaultURL;
      }
    }
    if (allLoaded()) {
      if (error) {
        alert("Browsers prevent navigation from inside iframe");
        loadPage('', defaultURL);
      }
      else {
        loadPage($this , url);
      }
    }

    //When frame loads, hide loader graphic
    else {
      error=false;
      hideLoader($(this).parent().attr('id'));
      $(this).data('loaded', true);
    }

  });

});
