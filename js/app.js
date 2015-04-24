var app = function () {
    'use strict';

    // display first screen
    var currentScreen = 1;

    // total screens available
    var totalScreens = 3;

    var $prevBtn = $( '#prevBtn' );
    var $nextBtn = $( '#nextBtn' );
    var $userProgress = $( '.user-progress' );
    var $userScreen = $( '.user-screen' );

    var $form = $( '.form' );
    var $userRiskText = $( '#user-risk-text' );
    var $userRiskRadio = $( 'input:radio[name=user-risk-radio]' );
    var $usFnaRadio = $( 'input:radio[name=us-fna-radio]' );

    var $computedDiagram = $( '#computed-diagram' );
    var $computedValue = $( '#computed-value' );

    var malignancyCountText = $( '#malignancy-count-text' );
    var nonMalignancyCountText = $( '#non-malignancy-count-text' );

    var userRiskPercentage = null;
    var usFnaString = null;

    // formulas based on Naykky's Excel data
    var calculator = function () {
        var FNA_RESULT = [];
        FNA_RESULT['nonDiagnostic'] = {
            estimate  : 0.515,
            lower97ci : 0.336,
            upper95ci : 0.791
        };
        FNA_RESULT['benign'] = {
            estimate  : 0.093,
            lower97ci : 0.063,
            upper95ci : 0.139
        };
        FNA_RESULT['aus'] = {
            estimate  : 0.405,
            lower97ci : 0.228,
            upper95ci : 0.719
        };
        FNA_RESULT['suspiciousForFollicularNeoplasm'] = {
            estimate  : 0.608,
            lower97ci : 0.365,
            upper95ci : 1.01
        };
        FNA_RESULT['suspiciousForMalignancy'] = {
            estimate  : 8.35,
            lower97ci : 3.63,
            upper95ci : 19.23
        };
        FNA_RESULT['malignant'] = {
            estimate  : 196.77,
            lower97ci : 67.99,
            upper95ci : 569.51
        };

        return {
            compute : function ( percent, fnaResultString ) {
                var fnaResult = FNA_RESULT[fnaResultString];
                var preTestOdds = percent / (1 - percent);
                var postTestOddsEstimate = preTestOdds * fnaResult.estimate;
                var postTestProbabilityEstimate = postTestOddsEstimate / (1 + postTestOddsEstimate) * 100;
                var postTestOddsLower = preTestOdds * fnaResult.lower97ci;
                var postTestProbabilityLower = postTestOddsLower / (1 + postTestOddsLower) * 100;
                var postTestOddsHigher = preTestOdds * fnaResult.upper95ci;
                var postTestProbabilityHigher = postTestOddsHigher / (1 + postTestOddsHigher) * 100;

                return {
                    preTestOdds                 : preTestOdds,
                    postTestOddsEstimate        : postTestOddsEstimate,
                    postTestProbabilityEstimate : postTestProbabilityEstimate,
                    postTestOddsLower           : postTestOddsLower,
                    postTestProbabilityLower    : postTestProbabilityLower,
                    postTestOddsHigher          : postTestOddsHigher,
                    postTestProbabilityHigher   : postTestProbabilityHigher
                };
            }
        }
    }();

    // determine what progress buttons, user screen and previous/next button to display
    var displayScreen = function () {
        $userProgress.addClass( 'grey-text text-lighten-1' );
        $( '.user-progress-' + currentScreen ).removeClass( 'grey-text text-lighten-1' ).addClass( 'blue-grey-text' );

        $userScreen.addClass( 'hide' );
        $( '.user-screen-' + currentScreen ).removeClass( 'hide' );

        if ( currentScreen === 1 ) {
            $prevBtn.addClass( 'hide' );
        }
        else {
            $prevBtn.removeClass( 'hide' );
        }

        if ( currentScreen === totalScreens ) {
            $nextBtn.addClass( 'hide' );
        }
        else {
            $nextBtn.removeClass( 'hide' );
        }
    };

    var setupScreen1 = function () {
        // when user input text field is on focus, clear all radio button values
        // when user input text field changes, validate the input
        $userRiskText
            .focus( function () {
                $userRiskRadio.prop( 'checked', false );
            } )
            .change( function () {
                var value = $( this ).val();
                var isValid = false;
                var intValue = null;

                // valid - 1 to 3 digits and between value of 1 to 100
                if ( /^\d{1,3}$/.test( value ) ) {
                    intValue = parseInt( value );

                    if ( intValue >= 1 && intValue <= 100 ) {
                        isValid = true;
                    }
                }

                if ( isValid ) {
                    $( this ).removeClass( 'invalid' ).addClass( 'valid' );
                    // divide the input value by 100 to get the percentage
                    userRiskPercentage = intValue / 100;
                }
                else {
                    $( this ).removeClass( 'valid' ).addClass( 'invalid' );
                    userRiskPercentage = null;
                }
            } );

        // when radio is selected, record the selected value and clear input text
        $userRiskRadio
            .change( function () {
                userRiskPercentage = $( this ).val();
                $userRiskText.val( '' );
            } );
    };

    var setupScreen2 = function () {
        $usFnaRadio.change( function () {
            usFnaString = $( this ).val();
        } );
    };

    var setupScreen3 = function () {
        var currentCount = 0;
        var color = '';

        var result = calculator.compute( userRiskPercentage, usFnaString );

        var malignancyCount = Math.round( result.postTestProbabilityEstimate );
        var nonMalignancyCount = 100 - malignancyCount;

        var lower = Math.round( result.postTestProbabilityLower );
        var higher = Math.round( result.postTestProbabilityHigher );

        // display diagram
        $computedDiagram.empty();

        for ( var row = 0; row < 10; ++row ) {
            var $row = $( '<div class="row center-align"  style="padding:0; margin: 0">' );

            $row.append( '<div class="col s1" style="padding:0; margin: 0;">&nbsp;</div>' );

            for ( var col = 0; col < 10; ++col ) {
                color = currentCount++ < malignancyCount ? "red-text" : "teal-text";
                $row.append( '<div class="col s1"  style="padding: 0; margin: 0;">' +
                             '<i class="flow-text mdi-social-person ' + color + '"></i>' +
                             '</div>' );
            }

            $row.append( '<div class="col s1" style="padding:0; margin: 0;">&nbsp;</div>' );

            $computedDiagram.append( $row );
        }

        malignancyCountText.text( malignancyCount + ' patient' +
                                  (malignancyCount != 1 ? 's' : '') + ' with malignancy' );

        nonMalignancyCountText.text( nonMalignancyCount + ' patient' +
                                     (nonMalignancyCount != 1 ? 's' : '') + ' without malignancy' );

        $computedValue.text( malignancyCount + ' % ( ' + lower + ' – ' + higher + ' )' );
    };

    return {
        // on start, initialize previous/next buttons and display the first screen
        startCalculator : function () {
            $prevBtn.click( function () {
                currentScreen--;
                displayScreen();
            } );

            $nextBtn.click( function () {
                var errorMessage = null;

                if ( currentScreen === 1 ) {
                    if ( userRiskPercentage ) {
                        setupScreen2();
                    }
                    else {
                        errorMessage = 'Please specify a valid value first.'
                    }
                }
                else if ( currentScreen === 2 ) {
                    if ( usFnaString ) {
                        setupScreen3();
                    }
                    else {
                        errorMessage = 'Please enter US-FNA result first.'
                    }
                }

                if ( errorMessage ) {
                    Materialize.toast( errorMessage, 3000 );
                }
                else {
                    currentScreen++;
                    displayScreen();
                }
            } );

            // when user hits the refresh button on browser, remove all form fields to prevent confusion,
            // otherwise displayed/selected form fields don't reflect the value stored in JS
            $( window ).bind( 'beforeunload', function () {
                $form.trigger( 'reset' );
            } );

            // setup and show first screen
            setupScreen1();
            displayScreen();

        },

        globalSetup : function () {
            // for mobile menu hamburger to work
            $( ".button-collapse" ).sideNav();
        }
    }
}();

app.globalSetup();

