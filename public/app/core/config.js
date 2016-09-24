/**
 * Created by CSS on 26-07-2016.
 */
(function() {
    angular
        .module('toyotaApp')
        .config(config);
    angular.module('toyotaApp').constant('defaultProfilePicture', 'images/no_profile.png');
    angular.module('toyotaApp').constant('uploadedExcelImagePath', 'uploads/excelImages/');
    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/loadInputData', {
                templateUrl: '../app/loadInputData/loadInputData.html',
                controller: 'loadInputDataController'
        }).when('/', {
            templateUrl: '../app/dashboard/dashboard.html',
            controller: 'dashboardController'
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
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }
}());