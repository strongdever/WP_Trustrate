//Usecase Tab bar start-----------------

function openUsecase(evt, usecaseName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  if(usecaseName == "usecase1"){
    document.getElementById(usecaseName).style.backgroundColor = "#087AC9";
    if(window.innerWidth < 650){
      document.getElementsByClassName('tab1')[0].style.width = "193px";
      document.getElementsByClassName('tab1')[0].childNodes[0].style.display = "inline";
      document.getElementsByClassName('tab2')[0].style.width = "71px";
      document.getElementsByClassName('tab2')[0].childNodes[0].style.display = "none";
      document.getElementsByClassName('tab3')[0].style.width = "71px";
      document.getElementsByClassName('tab3')[0].childNodes[0].style.display = "none";
    }
  }
  if(usecaseName == "usecase2"){
      document.getElementById(usecaseName).style.backgroundColor = "#3CA1E1";
    if(window.innerWidth < 650){
      document.getElementsByClassName('tab1')[0].style.width = "71px";
      document.getElementsByClassName('tab1')[0].childNodes[0].style.display = "none";
      document.getElementsByClassName('tab2')[0].style.width = "193px";
      document.getElementsByClassName('tab2')[0].childNodes[0].style.display = "inline";
      document.getElementsByClassName('tab3')[0].style.width = "71px";
      document.getElementsByClassName('tab3')[0].childNodes[0].style.display = "none";
    }
  }
  if(usecaseName == "usecase3"){
      document.getElementById(usecaseName).style.backgroundColor = "#59BAF0";
    if(window.innerWidth < 650){
      document.getElementsByClassName('tab1')[0].style.width = "71px";
      document.getElementsByClassName('tab1')[0].childNodes[0].style.display = "none";
      document.getElementsByClassName('tab2')[0].style.width = "71px";
      document.getElementsByClassName('tab2')[0].childNodes[0].style.display = "none";
      document.getElementsByClassName('tab3')[0].style.width = "193px";
      document.getElementsByClassName('tab3')[0].childNodes[0].style.display = "inline";
    }
  }
  tablinks = document.getElementsByClassName("tabs-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  var targetcontent = document.getElementById(usecaseName);
  targetcontent.style.display = "flex";  
  evt.currentTarget.className += " active";
}

//Hiding and showing header when scrolling down and up-------start----------
function initial(){
  if(window.pageYOffset < 98){
    document.getElementById("header").style.top = "0";
  }
}
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var screen_width = screen.width;
  var currentScrollPos = window.pageYOffset;
  if (screen_width > 650){
    if (currentScrollPos < 10) {
      document.getElementById("header").style.top = "0";
    } else {
      document.getElementById("header").style.top = "-98px";
    }
  }
  prevScrollpos = currentScrollPos;
}

function headerVisible(event){
  let y = event.clientY;
  if(screen.width > 650){
    if(y < 98){
      document.getElementById("header").style.top = "0";
    }
    else{
      if(prevScrollpos > 2){
        document.getElementById("header").style.top = "-98px";
      }
    }
  }
}
//Hiding and showing header when scrolling down and up-------end----------

function navFuc(){
  var x = document.getElementById("header");
  if (x.className === "header") {
    x.className += " responsive";
  }
}

function navClose(){
  var x = document.getElementById("header");
  if (x.className === "header responsive") {
    x.className = "header";
  }
}

function forResponsive(){
  var x = document.getElementById("header");
  x.className = "header";
}


let freezeClic = false; // just modify that variable to disable all clics events
document.addEventListener("click", freezeClicFn, true);
//function for the prohibit the mouse click event when the user send acontact request
function freezeClicFn(e) {
  if (freezeClic) {
    e.stopPropagation();
    e.preventDefault();
  }
}

$(document).ready(function(){

  //language exchange
  $('.lang-jp').click(function(e){
    if(!$(this).hasClass("active")){
      //window.location.replace=("");
      $(this).addClass("active");
      $('.lang-en').removeClass("active");
    } else{
      e.preventDefault();
    }
  })

  $('.lang-en').click(function(e){
    if(!$(this).hasClass("active")){
      //console.log(window.location.href);
      //window.location.replace("top-en");
      $(this).addClass("active");
      $('.lang-jp').removeClass("active");
    } else{
      e.preventDefault();
    }
  })
  
  // When the user clicks the button, open the modal
  $(".news-category").click(function() {
    var modal = $("#news-popup-overlay");
//news date part
    modal.find('h4').text($(this).find('h4').text());
//news category part
    modal.find('.news-category-group').empty();
    $(this).find('.news-category-group').clone().appendTo(modal.find('.news-category-group'));
//news tittle part
    modal.find('.news-header').text($(this).find('.news-article').text());
//news news content part
    modal.find('.news-article').empty();
    $(this).find('.news-content').clone().appendTo(modal.find('.news-article'));
    $('.news-article .news-content').show();
    console.log(modal.find('.news-article').text());
    modal.show();
    $("body").css('overflow', "hidden");
  });

//contactus modify button click event
  $('.contactus-modify').click(function(){
    $('#contactus-popup-overlay').hide();
    $("body").css('overflow', "auto");
  })

// When the user clicks on <span> (x), close the modal
  $(".popup-close").click(function() {
    $("#news-popup-overlay").hide();
    $("#contactus-popup-overlay").hide();
    $("#contactus-verify-overlay").hide();
    $("body").css('overflow', "auto");
  });

// When the user clicks anywhere outside of the modal, close it
  $(window).click(function(event) {
    if (event.target.className == "news-popup-overlay") {
      $("#news-popup-overlay")[0].style.display = "none";
      $("body").css('overflow', "auto");
    }
    if (event.target.className == "contactus-popup-overlay") {
      $("#contactus-popup-overlay")[0].style.display = "none";
      $("body").css('overflow', "auto");
    }
    if (event.target.className == "contactus-verify-overlay") {
      $("#contactus-verify-overlay")[0].style.display = "none";
      $("body").css('overflow', "auto");
    }
  })

//News Popup End----------------------

//news pagination start-------------------
  var article_num = $('.news-category').length;
  var display_num = 6;
  $(".news-page-content .news-category").slice(display_num).hide();
  $('#news-pagination').pagination({
      // Total number of items present
      // in wrapper class
      items: article_num,
  
      // Items allowed on a single page
      itemsOnPage: display_num, 
      onPageClick: function (noofele) {
          $(".news-page-content .news-category").hide()
              .slice(display_num * (noofele - 1),
              display_num + display_num * (noofele - 1)).show();
      }
  });
  //news pagination end-------------------

  //Contact us Validation start-----------
  $("#contact-by-email").prop('checked', true);
  $("#contact-by-phone").prop('checked', false);
  $("#contact-by-phone").click(function(){
    if($(this).is(":checked")){
      $("#contact-by-email").prop('checked', false);
    } else{
      $(this).prop('checked', true);
    }
  });
  $("#contact-by-email").click(function(){
    if($(this).is(":checked")){
      $("#contact-by-phone").prop('checked', false);
    } else{
      $(this).prop('checked', true);
    }
  });
  var valid_status = 1;
  $('#contact-detail').click(function(){  //indetail button
    if($("#inquiry-detail").val() == ""){
      $(".inquiry-detail-error").show();
      $("#inquiry-detail").focus();
      valid_status = 0;
    }

    if($("#inquiry-phonenumber").val() == ""){
      $(".phonenumber-error").show();
      $("#inquiry-phonenumber").focus();
      valid_status = 0;
    }

    if($("#inquiry-email").val() == ""){
      $(".email-error1").show();
      $(".email-error2").hide();
      $("#inquiry-email").focus();
      valid_status = 0;
    } else{
      var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(!regex.test($("#inquiry-email").val())){
        $(".email-error1").hide();
        $(".email-error2").show();
        $("#inquiry-email").focus();
        alid_status = 0;
      } else{
        $(".email-error1").hide();
        $(".email-error2").hide();
      }
    }

    if($("#inquiry-name").val() == ""){
      $(".user-name-error").show();
      $("#inquiry-name").focus();
      valid_status = 0;
    }

    if($("#comp-name-input").val() == ""){
      $(".comp-name-error").show();
      $("#comp-name-input").focus();
      valid_status = 0;
    }

    if(valid_status == 1){
      var modal = $("#contactus-popup-overlay");
      modal.find('.popup-inquire-purpose').val($(".inquiry-purpose select").children("option:selected").val());
      modal.find('.popup-company-name').val($("#comp-name-input").val());
      modal.find('.popup-user-name').val($("#inquiry-name").val());
      modal.find('.popup-user-email').val($("#inquiry-email").val());
      modal.find('.popup-user-phone').val($("#inquiry-phonenumber").val());
      if($('#contact-by-phone').is(":checked")){
        modal.find('.popup-contact-method').val($('#contact-method1').text());
        modal.find('.popup-contact-method').show();
      } else{
        modal.find('.popup-contact-method').val($('#contact-method2').text());
        modal.find('.popup-contact-method').show();
      }
      modal.find('.popup-inquire-detail').val($("#inquiry-detail").val());
      modal.show();
      $("body").css('overflow', "hidden");
    }
    valid_status = 1;
  })
  
//sending contact info
  var contactForm = $('#contactus-popup-content');
  contactForm.submit(function (event) {
    $('#popup-inquire-purpose').prop( "disabled", false );
    $('#popup-company-name').prop( "disabled", false );
    $('#popup-user-name').prop( "disabled", false );
    $('#popup-user-email').prop( "disabled", false );
    $('#popup-user-phone').prop( "disabled", false );
    $('#popup-contact-method').prop( "disabled", false );
    $('#popup-inquire-detail').prop( "disabled", false );
    event.preventDefault();
    const serviceID = "service_3ovt3mh";
    const templateID = "template_jp5cmc7";
    // send the email here
    $(".contact-spinner").show();
    emailjs.sendForm(serviceID, templateID, this).then(
      (response) => {
        freezeClic = false;
        $('#contactus-popup-overlay').hide();
        $("body").css('overflow', "hidden");
        $(".contact-spinner").hide();
        $('#contactus-verify-overlay').show();
        if($('.lang-jp').hasClass("active")){
          error_message = "お問合せ頂きましてありがとうございました。お問合せ内容に関しては、1-2営業日にてご連絡申し上げます。";
          $('.contactus-Verify-content .inquires-description').css('text-align', "start");
          $(".close-text").text("閉じる");
        } else{
          error_message = "Thank you for contacting us. We will contact you within 1-2 business days regarding your inquiry.";
          $('.contactus-Verify-content .inquires-description').css('text-align', "center");
          $(".close-text").text("Close");
        }
        $('.contactus-Verify-content .inquires-description').text(error_message);
        $('#contactus-verify-overlay').show();
      },
      (error) => {
        freezeClic = false;
        $('#contactus-popup-overlay').hide();
        $("body").css('overflow', "hidden");
        $(".contact-spinner").hide();
        var error_message = "";
        if($('.lang-jp').hasClass("active")){
          error_message = "申し訳ございませんが、お問い合わせのリクエストは失敗しました。もう一度やり直してください。";
          $('.contactus-Verify-content .inquires-description').css('text-align', "start");
          $(".close-text").text("閉じる");
        } else{
          error_message = "I am sorry, but faild your inquiry request. Please try again.";
          $('.contactus-Verify-content .inquires-description').css('text-align', "center");
          $(".close-text").text("Close");
        }
        $('.contactus-Verify-content .inquires-description').text(error_message);
        $('#contactus-verify-overlay').show();
      }
    );
    $('#popup-inquire-purpose').prop( "disabled", true );
    $('#popup-company-name').prop( "disabled", true );
    $('#popup-user-name').prop( "disabled", true );
    $('#popup-user-email').prop( "disabled", true );
    $('#popup-user-phone').prop( "disabled", true );
    $('#popup-contact-method').prop( "disabled", true );
    $('#popup-inquire-detail').prop( "disabled", true );
  });

  $("#comp-name-input").on("input", function(){ //when the company name is input to
    if($(this).val() == ''){
      $(".comp-name-error").show();
      valid_status = 0;
    } else{
      $(".comp-name-error").hide();
      valid_status = 1;
    }
  })

  $("#inquiry-name").on("input", function(){ //when the user name is input to
    if($(this).val() == ''){
      $(".user-name-error").show();
      valid_status = 0;
    } else{
      $(".user-name-error").hide();
      valid_status = 1;
    }
  })

  $("#inquiry-email").on("input", function(){ //when the email is input to
    if($("#inquiry-email").val() == ""){
      $(".email-error1").show();
      $(".email-error2").hide();
      $("#phonenumber-error").focus();
      valid_status = 0;
    } else{
      var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(!regex.test($("#inquiry-email").val())){
        $(".email-error1").hide();
        $(".email-error2").show();
        $("#inquiry-email").focus();
        valid_status = 0;
      } else{
        $(".email-error1").hide();
        $(".email-error2").hide();
        valid_status = 1;
      }
    }
  })

  $("#inquiry-phonenumber").on("input", function(){ //when the phonenumber is input to
    if($(this).val() == ''){
      $(".phonenumber-error").show();
      valid_status = 0;
    } else{
      $(".phonenumber-error").hide();
      var valid_status = 1;
    }
  })

  $("#inquiry-detail").on("input", function(){ //when the textarea is input to
    if($(this).val() == ''){
      $(".inquiry-detail-error").show();
      valid_status = 0;
    } else{
      $(".inquiry-detail-error").hide();
      var valid_status = 1;
    }
  })

  //prohibit the control of the whol page when the user send acontact request
  $("#contactus-sending").click(function(){
    freezeClic = true;  //prohibit the mouse click event.
  })
  //Contact us Validation end--------------
})
