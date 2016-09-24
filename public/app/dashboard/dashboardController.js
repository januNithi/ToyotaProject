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
            dashboardService.goToModels();
        };

        $scope.goToReportGeneration = function () {

            dashboardService.goToReportGeneration();

        };
        
        $scope.goToAdditionals = function () {
          
            dashboardService.goToAdditionals();
            
        };

        $scope.goToMeasures = function () {
            dashboardService.goToMeasures();
        };

        $scope.goToInstructions = function () {
            dashboardService.goToInstructions();
        };
        
        $scope.goToRegistration=function(){


            dashboardService.goToRegistration();
        };
        $scope.goTojobRegistration=function(){

            dashboardService.goTojobRegistration();
        };
        
        $scope.loadData = function () {
            dashboardService.loadData();
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