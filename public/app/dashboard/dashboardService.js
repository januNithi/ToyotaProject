/**
 * Created by CSS on 16-08-2016.
 */
(function(){

    angular.module('toyotaApp').factory('dashboardService',dashboardService);

    dashboardService.$inject = [
        '$window',
        '$http'
    ];

    function dashboardService($window,$http) {

        return {

            goToModels : function () {
                $window.location.href = '/modelRegistration';
            },

            goToReportGeneration : function () {
                $window.location.href = '/reportGeneration';
            },

            goToInstructions : function () {
                $window.location.href = '/instructionManual';
            },
            goToRegistration: function(){

                $window.location.href='/employeeRegistration';
             },
            goTojobRegistration: function(){

                $window.location.href='/jobRegistration';
            },
            loadData : function () {
                $window.location.href = '/loadInputData';
            },

            goToAdditionals : function () {

                $window.location.href = '/additionals';

            },

            goToMeasures : function () {

                $window.location.href = '/measures';

            },

            registerService : function (data) {
                return $http.post('/registerService',data);

            },

            updateTaskCompleted : function (data) {
                return $http.post('/taskCompleted',data);

            }

        }

    }

})();