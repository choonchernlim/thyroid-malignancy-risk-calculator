var RISK_CATEGORY = {
    highSuspicion         : {
        percentage         : 0.8,
        sonographicPattern : 'High suspicion (>70-90%)',
        usFeature          : 'Solid hypoechoic nodule or solid hypoechoic component of a partially cystic nodule with one or more of the following features:  irregular margins (infiltrative, microlobulated), microcalcifications, taller than wide shape, rim calcifications with small extrusive soft tissue component, evidence of extrathyroidal extension'
    },
    intermediateSuspicion : {
        percentage         : 0.15,
        sonographicPattern : 'Intermediate suspicion (10-20%)',
        usFeature          : 'Hypoechoic solid nodule with smooth margins without microcalcifications, extrathyroidal extension, or taller than wide shape'
    },
    lowSuspicion          : {
        percentage         : 0.075,
        sonographicPattern : 'Low suspicion (5-10%)',
        usFeature          : 'Isoechoic or hyperechoic solid nodule, or partially cystic nodule with eccentric solid areas, without microcalcification, irregular margin or extrathyroidal extension, or taller than wide shape'
    },
    veryLowSuspicion      : {
        percentage         : 0.03,
        sonographicPattern : 'Very low suspicion (<3%)',
        usFeature          : 'Spongiform or partially cystic nodules without any of the sonographic features described in low, intermediate or high suspicion patterns'
    },
    benign                : {
        percentage         : 0.01,
        sonographicPattern : 'Benign (<1%)',
        usFeature          : 'Purely cystic nodules (no solid component)'
    }
};

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

var calculator = {
    computeAll : function ( percent ) {
        return {
            nonDiagnostic                   : calculator.compute( percent, FNA_RESULT.nonDiagnostic ),
            benign                          : calculator.compute( percent, FNA_RESULT.benign ),
            aus                             : calculator.compute( percent, FNA_RESULT.aus ),
            suspiciousForFollicularNeoplasm : calculator.compute( percent, FNA_RESULT.suspiciousForFollicularNeoplasm ),
            suspiciousForMalignancy         : calculator.compute( percent, FNA_RESULT.suspiciousForMalignancy ),
            malignant                       : calculator.compute( percent, FNA_RESULT.malignant )
        };
    },

    compute : function ( percent, fnaResult ) {
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
};
