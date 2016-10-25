/**
 * Created by CSS on 26-07-2016.
 */
(function() {
    angular
        .module('toyotaApp')
        .config(config);
    angular.module('toyotaApp').constant('defaultProfilePicture', 'images/no_profile.png');
    angular.module('toyotaApp').constant('defaultInvalidPicture', 'images/noimage.jpg');
    angular.module('toyotaApp').constant('uploadedExcelImagePath', 'uploads/excelImages/');
    angular.module('toyotaApp').constant('downloadReportPath', 'uploads/');
    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/loadInputData', {
                templateUrl: '../app/loadInputData/loadInputData.html',
                controller: 'loadInputDataController'
        }).when('/', {
            templateUrl: '../app/dashboard/dashboard.html',
            controller: 'dashboardController'
        }).when('/reportGeneration', {
            templateUrl: '../app/TechnicianWorkReport/technicianWorkReport.html',
            controller: 'technicianWorkReportController'
        }).when('/instructionManual', {
            templateUrl: '../app/InstructionManual/instructionManual.html',
            controller: 'instructionManualController'
        }).when('/modelRegistration', {
            templateUrl: '../app/modelRegistration/registerModel.html',
            controller: 'modelRegistrationController'
        }).when('/employeeRegistration', {
            templateUrl: '../app/UserRegistration/UserRegistration.html',
            controller: 'userRegistrationController'
        }).when('/jobRegistration', {
            templateUrl: '../app/job Registration/jobRegistration.html',
            controller: 'jobRegistrationController'
}       ).otherwise({
        }).when('/additionals',{
            templateUrl : '../app/Additional/additional.html',
            controller : 'additionalController'
        }).when('/measures',{
            templateUrl : '../app/measures/measures.html',
            controller : 'measureController'
        }).otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }
}());