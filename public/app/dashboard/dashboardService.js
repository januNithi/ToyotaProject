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

            registerService : function (data) {
                return $http.post('/registerService',data);

            },

            updateTaskCompleted : function (data) {
                return $http.post('/taskCompleted',data);

            }

        }

    }

})();