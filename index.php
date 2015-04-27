<?php require('_includes/header.php'); ?>

<div class="container">
    <div class="row">
    </div>

    <div id="calculator-input" class="row">
        <form class="form">
            <!--
            ###################
            Step 1
            ###################
            -->
            <div class="col s12 m12 l6">
                <h5 class="light"><strong>Step 1:</strong> Enter probability</h5>

                <p>Based on your clinical assessment, enter the probability of thyroid malignancy
                    for this nodule :
                </p>

                <div class="card">
                    <div class="card-content">
                        <div class="row">
                            <div class="input-field col s3 l2 offset-s4 offset-l4">
                                <input id="user-risk-text" type="text">
                                <label for="user-risk-text"></label>
                            </div>
                            <div class="input-field col s5">
                                <label for="user-risk-text">%</label>
                            </div>
                        </div>
                        <small class="light left">Value between 1 to 100. Example: 50 for 50%</small>
                    </div>
                </div>

                <div class="divider"></div>
                <h5 class="center-align">- OR -</h5>

                <div class="divider"></div>

                <p>Otherwise, select an ATA US risk classification :</p>

                <ul class="collection z-depth-1">
                    <li class="collection-item">
                        <input id="risk1" type="radio" name="user-risk-radio" value="0.8" class="with-gap"/>
                        <label for="risk1" class="black-text">High suspicion (>70-90%)</label>

                        <a href="#!" class="risk-info secondary-content hide-on-small-and-down"><i
                                class="mdi-action-info small blue-text"></i></a>

                        <div class="risk-description row hide-on-small-and-down hide">
                            <br/>

                            <div class="grey-text col s10 offset-s1">
                                Solid hypoechoic nodule or component (if
                                partially cystic) with ≥1 features: irregular margins (infiltrative,
                                microlobulated), microcalcifications, taller than wide shape, rim calcifications,
                                extrathyroidal extension.
                            </div>
                        </div>
                    </li>
                    <li class="collection-item">
                        <input id="risk2" type="radio" name="user-risk-radio" value="0.15" class="with-gap"/>
                        <label for="risk2" class="black-text">Intermediate suspicion (10-20%)</label>

                        <a href="#!" class="risk-info secondary-content hide-on-small-and-down"><i
                                class="mdi-action-info small blue-text"></i></a>

                        <div class="risk-description row hide-on-small-and-down hide">
                            <br/>

                            <div class="grey-text col s10 offset-s1">
                                Hypoechoic solid nodule with smooth margins
                                without microcalcifications, extrathyroidal extension, or taller than wide shape.
                            </div>
                        </div>
                    </li>
                    <li class="collection-item">
                        <input id="risk3" type="radio" name="user-risk-radio" value="0.075" class="with-gap"/>
                        <label for="risk3" class="black-text">Low suspicion (5-10%)</label>

                        <a href="#!" class="risk-info secondary-content hide-on-small-and-down"><i
                                class="mdi-action-info small blue-text"></i></a>

                        <div class="risk-description row hide-on-small-and-down hide">
                            <br/>

                            <div class="grey-text col s10 offset-s1">
                                Isoechoic or hyperechoic solid nodule, or
                                partially cystic nodule with eccentric solid areas, without microcalcification,
                                irregular margin or extrathyroidal extension, or taller than wide shape.
                            </div>
                        </div>
                    </li>
                    <li class="collection-item">
                        <input id="risk4" type="radio" name="user-risk-radio" value="0.03" class="with-gap"/>
                        <label for="risk4" class="black-text">Very low suspicion (<3%)</label>

                        <a href="#!" class="risk-info secondary-content hide-on-small-and-down"><i
                                class="mdi-action-info small blue-text"></i></a>

                        <div class="risk-description row hide-on-small-and-down hide">
                            <br/>

                            <div class="grey-text col s10 offset-s1">
                                Spongiform or partially cystic nodules
                                without any of the sonographic features described in low, intermediate or
                                high suspicion patterns.
                            </div>
                        </div>
                    </li>
                    <li class="collection-item">
                        <input id="risk5" type="radio" name="user-risk-radio" value="0.01" class="with-gap"/>
                        <label for="risk5" class="black-text">Benign (<1%)</label>

                        <a href="#!" class="risk-info secondary-content hide-on-small-and-down"><i
                                class="mdi-action-info small blue-text"></i></a>

                        <div class="risk-description row hide-on-small-and-down hide">
                            <br/>

                            <div class="grey-text col s10 offset-s1">
                                Purely cystic nodules (no solid component).
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!--
            ###################
            Step 2
            ###################
            -->
            <div class="col s12 m12 l6">
                <h5 class="light"><strong>Step 2:</strong> Enter US-FNA result</h5>

                <ul class="collection z-depth-1">
                    <li class="collection-item">
                        <input id="usfna1" type="radio" name="us-fna-radio" value="nonDiagnostic"
                               class="with-gap"/>
                        <label for="usfna1" class="black-text">Non Diagnostic</label>
                    </li>
                    <li class="collection-item">
                        <input id="usfna2" type="radio" name="us-fna-radio" value="benign" class="with-gap"/>
                        <label for="usfna2" class="black-text">Benign</label>
                    </li>
                    <li class="collection-item">
                        <input id="usfna3" type="radio" name="us-fna-radio" value="aus" class="with-gap"/>
                        <label for="usfna3" class="black-text">Atypia of Undetermined Significance</label>
                    </li>
                    <li class="collection-item">
                        <input id="usfna4" type="radio" name="us-fna-radio"
                               value="suspiciousForFollicularNeoplasm" class="with-gap"/>
                        <label for="usfna4" class="black-text">Suspicious for Follicular Neoplasm</label>
                    </li>
                    <li class="collection-item">
                        <input id="usfna5" type="radio" name="us-fna-radio" value="suspiciousForMalignancy"
                               class="with-gap"/>
                        <label for="usfna5" class="black-text">Suspicious for Malignancy</label>
                    </li>
                    <li class="collection-item">
                        <input id="usfna6" type="radio" name="us-fna-radio" value="malignant" class="with-gap"/>
                        <label for="usfna6" class="black-text">Malignant</label>
                    </li>
                </ul>

                <div class="center-align">
                    <br/>
                    <button id="calculateBtn" class="btn btn-large waves-effect waves-light blue" type="button">
                        Calculate
                        <i class="mdi-content-send right"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!--
    ###################
    Step 3
    ###################
    -->
    <div id="calculator-result" class="hide">
        <div class="card-panel">
            <h5>Risk of Malignancy</h5>

            <p>In 100 nodules with these features: <span id="result-probability"></span>% pretest probability and
                <span id="result-us-fna"></span> US-FNA result
            </p>

            <div class="row">
                <div class="col s12 m6 l6 center-align">
                    <div id="computed-diagram"></div>

                    <h5 id="computed-value" class="light"></h5>
                </div>
                <div class="col s12 m6 l6">
                    <p class="divider hide-on-med-and-up"></p>

                    <div class="valign-wrapper">
                        <i class="valign small mdi-social-person red-text"></i>
                        <span id="malignancy-count-text"></span>
                    </div>
                    <div class="valign-wrapper">
                        <i class="valign small mdi-social-person teal-text"></i>
                        <span id="non-malignancy-count-text"></span>
                    </div>
                </div>
            </div>

            <div class="row center-align">
                <button id="startOverBtn" class="btn btn-large waves-effect waves-light blue" type="button">
                    Start Over
                    <i class="mdi-content-reply right"></i>
                </button>
            </div>

        </div>
    </div>
</div>

<?php require('_includes/javascripts.php'); ?>
<script type="text/javascript" src="/_assets/js/calculator.min.js"></script>

<?php require('_includes/footer.php'); ?>

