/**
 * Created by CSS on 16-08-2016.
 */
(function(){

    angular.module('toyotaApp').controller('dashboardController',dashboardController);

    dashboardController.$inject = [
        '$scope',
        'dashboardService'
    ];

    function dashboardController($scope,dashboardService) {

        $scope.goToModels = function(){
            dashboardService.goToModels();
        };

        $scope.goToInstructions = function () {
            dashboardService.goToInstructions();
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