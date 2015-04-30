var calculator = function () {
    'use strict';

    var calculatorLink = $( '.brand-logo' ).attr( 'href' );

    var $startOverBtn = $( '#startOverBtn' );
    var $calculateBtn = $( '#calculateBtn' );

    var $form = $( '.form' );
    var $userRiskText = $( '#user-risk-text' );
    var $userRiskRadio = $( 'input:radio[name=user-risk-radio]' );
    var $usFnaRadio = $( 'input:radio[name=us-fna-radio]' );

    var $calculatorInput = $( '#calculator-input' );
    var $calculatorResult = $( '#calculator-result' );
    var $computedDiagram = $( '#computed-diagram' );
    var $riskInfo = $( '.risk-info' );

    var malignancyCountText = $( '#malignancy-count-text' );
    var nonMalignancyCountText = $( '#non-malignancy-count-text' );
    var resultText = $( '#result-text' );
    var resultProbability = $( '#result-probability' );
    var resultUsFna = $( '#result-us-fna' );

    var userRiskPercentage = null;
    var usFnaString = null;
    var usFnaLabel = null;

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

    var displayFormFields = function () {
        // when user hits the refresh button on browser, remove all form fields to prevent confusion,
        // otherwise displayed/selected form fields don't reflect the value stored in JS
        $( window ).bind( 'beforeunload', function () {
            $form.trigger( 'reset' );
        } );

        // user input text field...
        // when on focus, clear all radio button values
        // when on change, validate the input
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

        // record US FNA result, both value and text
        $usFnaRadio.change( function () {
            usFnaString = $( this ).val();
            usFnaLabel = $( this ).parent().find( 'label' ).text();
        } );

        // when button is clicked, perform validation before showing the result
        $calculateBtn.click( function () {
            var isValid = true;

            if ( userRiskPercentage == null ) {
                isValid = false;
                displayError( 'Valid probability required.' );
            }
            if ( usFnaString == null ) {
                isValid = false;
                displayError( 'US-FNA result required.' );
            }

            if ( isValid ) {
                displayResult();
            }
        } );

        // when info icon is clicked, hide the icon and show the description
        $riskInfo.click( function () {
            var $this = $( this );
            $this.addClass( 'hide' );
            $this.parent().find( '.risk-description' ).removeClass( 'hide' );
        } );

        $calculatorResult.addClass( 'hide' );
        $calculatorInput.removeClass( 'hide' );
    };

    var displayError = function ( errorMessage ) {
        Materialize.toast( errorMessage, 2500 );
    };

    var displayResult = function () {
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

        resultProbability.text( userRiskPercentage * 100 );

        resultUsFna.text( usFnaLabel );

        resultText.text( 'Best estimate of thyroid malignancy risk is ' +
                         malignancyCount + '% (range of ' + lower + ' to ' + higher + ')' );

        malignancyCountText.text( getPatientText( malignancyCount ) + ' with thyroid malignancy' );

        nonMalignancyCountText.text( getPatientText( nonMalignancyCount ) + ' without thyroid malignancy' );

        $startOverBtn.click( function () {
            window.location = calculatorLink;
        } );

        $calculatorInput.addClass( 'hide' );
        $calculatorResult.removeClass( 'hide' );
    };

    var getPatientText = function ( count ) {
        return count == 1 ? count + ' patient' : count + ' patients';
    };

    return {
        start : function () {
            displayFormFields();
        }
    }
}();

calculator.start();
