var app = function () {
    'use strict';

    return {
        start : function () {
            // for mobile menu hamburger to work
            $( ".button-collapse" ).sideNav();
        }
    }
}();

app.start();

