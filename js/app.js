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

    var $form = $( '#form' );
    var $userRiskText = $( '#user-risk-text' );
    var $userRiskRadio = $( 'input:radio[name=user-risk-radio]' );

    var $computedDiagram = $( '#computed-diagram' );
    var $computedValue = $( '#computed-value' );

    // user selected risk, whether it is from user input or selected from the radio buttons
    var userRiskPercentage = null;

    // formulas based on Naykky's Excel data
    var calculator = function () {
        var FNA_RESULT = {
            nonDiagnostic                   : {
                estimate  : 0.515,
                lower97ci : 0.336,
                upper95ci : 0.791
            },
            benign                          : {
                estimate  : 0.093,
                lower97ci : 0.063,
                upper95ci : 0.139
            },
            aus                             : {
                estimate  : 0.405,
                lower97ci : 0.228,
                upper95ci : 0.719
            },
            suspiciousForFollicularNeoplasm : {
                estimate  : 0.608,
                lower97ci : 0.365,
                upper95ci : 1.01
            },
            suspiciousForMalignancy         : {
                estimate  : 8.35,
                lower97ci : 3.63,
                upper95ci : 19.23
            },
            malignant                       : {
                estimate  : 196.77,
                lower97ci : 67.99,
                upper95ci : 569.51
            }
        };

        // compute one FNA result
        var compute = function ( percent, fnaResult ) {
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
        };

        return {
            // compute all FNA results
            computeAll : function ( percent ) {
                return {
                    nonDiagnostic                   : compute( percent, FNA_RESULT.nonDiagnostic ),
                    benign                          : compute( percent, FNA_RESULT.benign ),
                    aus                             : compute( percent, FNA_RESULT.aus ),
                    suspiciousForFollicularNeoplasm : compute( percent, FNA_RESULT.suspiciousForFollicularNeoplasm ),
                    suspiciousForMalignancy         : compute( percent, FNA_RESULT.suspiciousForMalignancy ),
                    malignant                       : compute( percent, FNA_RESULT.malignant )
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

    function setupScreen2() {
    }

    function setupScreen3() {
        // TODO change this
        var estimate = 43;
        //var scores = calculator.computeAll( userRiskPercentage );
        //
        //console.log( scores );
        //
        //renderOutput( estimate );
    }

    // render the diagram and computed score
    var renderOutput = function ( estimate ) {
        $computedDiagram.empty();

        var currentCount = 0;
        var color = '';

        for ( var row = 0; row < 10; ++row ) {
            var $row = $( '<div class="row">' );

            $row.append( '<div class="col s1">&nbsp;</div>' );

            for ( var col = 0; col < 10; ++col ) {
                color = currentCount++ < estimate ? "teal" : "orange";
                $row.append( '<div class="col s1"><i class="btn-floating disabled ' + color + '"></i></div>' );
            }

            $row.append( '<div class="col s1">&nbsp;</div>' );

            $computedDiagram.append( $row );
        }

        // TODO fix this!
        $computedValue.text( estimate + ' % ( 40 – 70 )' );
    };

    return {
        // on start, initialize previous/next buttons and display the first screen
        start : function () {
            $prevBtn.click( function () {
                currentScreen--;
                displayScreen();
            } );

            $nextBtn.click( function () {
                // TODO may have to throw toast on user error!
                // make sure the input is correct before displaying next screen
                if ( (currentScreen === 1 && userRiskPercentage != null) ||
                     // TODO check input from screen 2 first
                     (currentScreen == 2) ) {
                    currentScreen++;
                    displayScreen();
                }
            } );

            // when user hits the refresh button on browser, remove all form fields to prevent confusion,
            // otherwise displayed/selected form fields don't reflect the value stored in JS
            $( window ).bind( 'beforeunload', function () {
                $form.trigger( 'reset' );
            } );

            setupScreen1();
            setupScreen2();
            setupScreen3();

            displayScreen();
        }
    }
}();

// start the app!
app.start();

