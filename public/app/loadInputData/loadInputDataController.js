/**
 * Created by CSS on 26-07-2016.
 */
(function () {

    angular
        .module('toyotaApp')
        .controller('loadInputDataController', loadInputDataController);

    loadInputDataController.$inject = [
        '$scope',
        'loadInputDataService',
        'instructionManualService',
        '$window'
    ];

    function loadInputDataController($scope,loadInputDataService,instructionManualService,$window) {

        
        $scope.loadedData = [];

        $scope.models = [];

        $scope.services = [];
        
        $scope.choosenModel = '';
        
        $scope.choosenService = '';

        $scope.loadExcel = false;

        $scope.data = [];
        
        $scope.loadData = function (files) {
            
            $scope.loadedData = files[0];

            loadInputDataService.uploadData(files[0],$scope.choosenService,$scope.choosenModel).then(function (result) {
                loadInputDataService.viewManual();
            });
            
        };

        $scope.goToDashboard = function () {
          loadInputDataService.goToDashboard();
        };

        $scope.serviceSelected = function (chnsService) {

            if($scope.choosenModel !=''  && $scope.choosenService != '') {
                $scope.loadExcel = true;
            }

        };

        $scope.modelSelected = function(chsnModel){
            angular.forEach($scope.models,function (value,index) {

                if(chsnModel == value.modelName){

                    $scope.services = value.services;

                }

            });
        };


        $scope.getModelAndService = function () {
            instructionManualService.getModels().then(function (response) {
                $scope.models = response.data;
            });
        };

        // $scope.getData();

        $scope.getModelAndService();

    }


})();