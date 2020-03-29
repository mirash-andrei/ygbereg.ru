$(document).ready(function () {

    // if ($(this).width() < 992) {
    //     $(".nav-body").removeClass("active");
    //     $(".nav-burger").removeClass("active");
    // } else {
    //     $(".nav-body").addClass("active");
    // }
    $(".nav-head").click(function (e) {
        e.preventDefault();
        $(".nav-burger").toggleClass("active");
        $(".nav-body").fadeToggle(500, "linear");
    });
});

// $(window).resize(function () {
//     if ($(this).width() < 992) {
//         $(".nav-body").css("display", "none");
//     } else {
//         $(".nav-body").css("display", "block");
//     }
//
// });