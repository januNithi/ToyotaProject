/**
 * Created by CSS on 16-08-2016.
 */
(function(){

    angular.module('toyotaApp').controller('dashboardController',dashboardController);

    dashboardController.$inject = [
        '$scope',
        'dashboardService',
        'spinnerService'
    ];

    function dashboardController($scope,dashboardService,spinnerService) {



        $scope.goToModels = function(){
            spinnerService.show('html5spinner');
            dashboardService.goToModels();
            spinnerService.hide('html5spinner');
        };

        $scope.goToReportGeneration = function () {
            spinnerService.show('html5spinner');
            dashboardService.goToReportGeneration();
            spinnerService.hide('html5spinner');
        };
        
        $scope.goToAdditionals = function () {
            spinnerService.show('html5spinner');
            dashboardService.goToAdditionals();
            spinnerService.hide('html5spinner');
        };

        $scope.goToMeasures = function () {
            spinnerService.show('html5spinner');
            dashboardService.goToMeasures();
            spinnerService.hide('html5spinner');
        };

        $scope.goToInstructions = function () {
            spinnerService.show('html5spinner');
            dashboardService.goToInstructions();
            spinnerService.hide('html5spinner');
        };
        
        $scope.goToRegistration=function(){
            spinnerService.show('html5spinner');
            dashboardService.goToRegistration();
            spinnerService.hide('html5spinner');
        };
        $scope.goTojobRegistration=function(){
            spinnerService.show('html5spinner');
            dashboardService.goTojobRegistration();
            spinnerService.hide('html5spinner');
        };
        
        $scope.loadData = function () {
            spinnerService.show('html5spinner');
            dashboardService.loadData();
            spinnerService.hide('html5spinner');
        }

        $scope.registerOrder = function(){
            // var data = {
            //     orderNumber:"AZSD",
            //     serviceId:24,
            //     mileage:"100cc",
            //     vehicleNumber:"TN005678"
            // }
            // dashboardService.registerService(data);
            var data = {
                flag:"I",
                taskNumber:1,
                orderRegId:1,
                summary:'working'
            }
            dashboardService.updateTaskCompleted(data);
        };


    }

})();