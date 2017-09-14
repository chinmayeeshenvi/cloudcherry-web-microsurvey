"use strict";
var SurveyHandler_1 = require("./SurveyHandler");
var DomSurvey_1 = require("./helpers/dom/DomSurvey");
var DomUtilities_1 = require("./helpers/dom/DomUtilities");
var Scrollbar_1 = require("./helpers/dom/Scrollbar");
var localCCSDK = {
    init: init,
    destroy: destroy,
    trigger: trigger,
};
var instances = {};
var CCSDKEntry = (function () {
    function CCSDKEntry(surveyToken, config) {
        this.surveyToken = surveyToken;
        this.config = config;
        this.setupSurvey();
    }
    CCSDKEntry.prototype.setupSurvey = function () {
        this.survey = new SurveyHandler_1.SurveyHandler(this.surveyToken);
        this.util = new DomUtilities_1.DomUtilities;
        this.config.themeColor = (this.config && this.config.themeColor) ?
            this.config.themeColor : "#db3c39";
        this.getSurveyData();
    };
    CCSDKEntry.prototype.getSurveyData = function () {
        var data = this.survey.fetchQuestions();
        var self = this;
        data.then(function (surveyData) {
            self.surveyData = surveyData;
            self.util.trigger(document, self.surveyToken + '-ready', { 'survey': self });
        });
    };
    CCSDKEntry.prototype.initSurvey = function () {
        var self = this;
        self.survey.attachSurvey(this.surveyData);
        self.dom = new DomSurvey_1.DomSurvey();
        self.dom.setTheme(self.config.themeColor);
        self.dom.setupListeners();
        self.survey.displayWelcomeQuestion();
    };
    CCSDKEntry.prototype.trigger = function (type, target) {
        var self = this;
        switch (type) {
            case 'click':
                document.querySelectorAll(target)[0].addEventListener('click', function () {
                    self.initSurvey();
                    Scrollbar_1.Scrollbar.initAll();
                });
                break;
            case 'launch':
                self.initSurvey();
                Scrollbar_1.Scrollbar.initAll();
            default:
                break;
        }
    };
    CCSDKEntry.prototype.prefill = function (id, value, valueType) {
        this.survey.fillPrefillQuestion(id, value, valueType);
    };
    CCSDKEntry.prototype.prefillPost = function () {
        this.survey.postPrefillPartialAnswer();
    };
    return CCSDKEntry;
}());
if (typeof window.CCSDK !== 'undefined') {
    var queue = window.CCSDK.q;
    window.CCSDK = function () {
        if (arguments && arguments.length == 0) {
            var time = new Date();
        }
        else {
            console.log(arguments);
            var args = Array.from(arguments);
            var functionName = args.splice(0, 1)[0];
            console.log(functionName);
            return localCCSDK[functionName].apply(this, args);
        }
    };
    if (queue) {
        for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
            var q = queue_1[_i];
            var args = Array.from(q);
            var functionName = args.splice(0, 1)[0];
            localCCSDK[functionName].apply(this, args);
        }
    }
    var eventCCReady = document.createEvent('Event');
    eventCCReady.initEvent('ccready', true, true);
    document.dispatchEvent(eventCCReady);
    window.CCSDK = localCCSDK;
}
function init(surveyToken) {
    var config = (typeof arguments[1] === 'object') ? arguments[1] : {};
    instances[surveyToken] = (instances[surveyToken]) ?
        instances[surveyToken] : new CCSDKEntry(surveyToken, config);
    return instances[surveyToken];
}
exports.init = init;
function destroy(surveyToken) {
    this.survey.destroy();
    instances[surveyToken] = null;
}
exports.destroy = destroy;
function trigger(type, target) {
    instances[this.surveyToken].trigger(type, target);
}
exports.trigger = trigger;
//# sourceMappingURL=CCSDKEntry.js.map