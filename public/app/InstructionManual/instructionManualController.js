/**
 * Created by CSS on 02-08-2016.
 */
(function () {

    angular
        .module('toyotaApp')
        .controller('instructionManualController', instructionManualController);

    instructionManualController.$inject = [
        '$scope',
        'instructionManualService',
        '$window',
        "defaultProfilePicture",
        "uploadedExcelImagePath",
    ];

    function instructionManualController($scope,instructionManualService,$window,defaultProfilePicture,uploadedExcelImagePath) {


        $scope.LT = true;
        $scope.RT = false;
        $scope.I = false;
        $scope.selectedData =[];
        $scope.selectedField = '';
        $scope.selectedImage;
        $scope.onEdit = false;
        $scope.models = [];
        $scope.services = [];

        $scope.loadInstruction = false;

        $scope.file = defaultProfilePicture;

        $scope.instructions = [];

        $scope.services = [];
        
        $scope.choosenModel = 0;

        $scope.choosenService = 0;

        $scope.getData = function () {

            instructionManualService.getData($scope.choosenModel,$scope.choosenService).then(function (result) {
                $scope.instructions = result.data;
                $scope.loadInstruction = true;
            });

        };
        
        $scope.modelSelected = function(chsnModel){
            angular.forEach($scope.models,function (value,index) {
          
                if(chsnModel == value.id){

                    $scope.services = value.services;
                    
                }
                
            });
        };

        $scope.serviceSelected = function (chnsService) {

            if($scope.choosenModel !=0  && $scope.choosenService != 0) {
                $scope.getData();
            }

        };

        $scope.showLeftTechnicianInstructions = function () {
            $scope.LT = true;
            $scope.RT = false;
            $scope.I = false;
        };

        $scope.showRightTechnicianInstructions = function () {
            $scope.LT = false;
            $scope.RT = true;
            $scope.I = false;
        };

        $scope.showInstructorInstructions = function () {
            $scope.LT = false;
            $scope.RT = false;
            $scope.I = true;
        };

        $scope.triggerUpload = function(instruction,fieldName,fileId) {
            $scope.selectedData = instruction;
            $scope.selectedField = fieldName;
            angular.element('#'+fileId).trigger('click');
        };

        $scope.showImage = function(image){
            if(image != null){
                return uploadedExcelImagePath+image;
            }
            return $scope.file;
        };

        $scope.editData = function () {
            $scope.onEdit = true;
        };
        
        $scope.updateData = function(){
            $scope.onEdit = false;
            if ($window.confirm('Are You Sure ! Do you need to update the Data?')) {

                instructionManualService.updateData($scope.instructions).then(function(result) {
                    
                },function(error){
                    // dashboardService.showError(error.data);
                });
            }
        };

        $scope.cancelUpdate = function () {
            $scope.onEdit = false;
            $scope.getData();
        };


        $scope.uploadFile = function(image) {

            if ($window.confirm('Are You Sure ! Do you need to update the ProfilPicture?')) {

                $scope.imageChanged = true;
                $scope.selectedImage = image[0];

                instructionManualService.uploadImage($scope.selectedImage,$scope.selectedData.id,$scope.selectedField).then(function(result) {
                    $scope.imageChanged = false;
                    $scope.instructions = result.data;
                },function(error){
                    // dashboardService.showError(error.data);
                });
            }

        };
        
        $scope.getModelAndService = function () {
            instructionManualService.getModels().then(function (response) {
                $scope.models = response.data;
            });
        };

        $scope.editSingleInstruction = function (ins) {
            angular.forEach($scope.instructions,function (value,index) {

                if(value == ins){
                    value.isEdit = true;
                }

            });
        };

        $scope.updateSingleInstruction = function (ins) {
             var data = [];
            data.push(ins);
            if ($window.confirm('Are You Sure ! Do you need to update the Data?')) {

                instructionManualService.updateData(data).then(function(result) {
                    instructionManualService.getData(0,ins.serviceId).then(function (result) {
                        $scope.instructions = result.data;
                        $scope.loadInstruction = true;
                    });
                },function(error){
                    // dashboardService.showError(error.data);
                });
            }
        };

        $scope.cancelUpdateSingleInstruction = function (ins) {

            angular.forEach($scope.instructions, function (value,index) {

                if(value == ins){
                    value.isEdit = false;
                    instructionManualService.getData(0,ins.serviceId).then(function (result) {
                        $scope.instructions = result.data;
                        $scope.loadInstruction = true;
                    });
                }

            });

        };


        $scope.deleteSingleInstruction = function (ins) {

            angular.forEach($scope.instructions,function (value,index) {

                if(value == ins){
                    $scope.instrucions.splice(index,1);
                }

            });

        };

        // $scope.getData();
        $scope.getDataModel = function () {

            instructionManualService.getServiceId().then(function (result) {

                if(result.data.serviceId !=0){
                    instructionManualService.getData(0,result.data.serviceId).then(function (result) {
                        $scope.instructions = result.data;
                        $scope.loadInstruction = true;
                    });
                }else{
                    $scope.getModelAndService();
                }
            });
        }

        $scope.getDataModel();

    }


})();