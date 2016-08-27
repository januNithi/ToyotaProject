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



        $scope.leftTechnicianInstruction = [];
        $scope.rightTechnicianInstruction = [];
        $scope.instructorInstruction = [];

        $scope.noData_l = true;
        $scope.cur_page_l = 1;
        $scope.dataFilter_l = [];
        $scope.items_per_page_l = 4;
        $scope.totalLength_l = 0;
        $scope.max_size_l = 6;

        $scope.noData_i = true;
        $scope.cur_page_i = 1;
        $scope.dataFilter_i = [];
        $scope.items_per_page_i = 4;
        $scope.totalLength_i = 0;
        $scope.max_size_i = 6;

        $scope.noData_r = true;
        $scope.cur_page_r = 1;
        $scope.dataFilter_r = [];
        $scope.items_per_page_r = 4;
        $scope.totalLength_r = 0;
        $scope.max_size_r = 6;

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

               $scope.splitInstructions();


            });

        };

        $scope.splitInstructions = function(){
            angular.forEach($scope.instructions,function (value,index) {

                if(value.taskId_l != null){
                    $scope.leftTechnicianInstruction.push(value);
                }
                if(value.taskId_r != null){
                    $scope.rightTechnicianInstruction.push(value);
                }
                if(value.taskId_i != null){
                    $scope.instructorInstruction.push(value);
                }

                if((index +1) == $scope.instructions.length){

                    if ($scope.leftTechnicianInstruction.length > 0) {
                        $scope.noData_l = false;
                        $scope.totalLength_l = $scope.leftTechnicianInstruction.length;
                        $scope.$watch('cur_page_l + items_per_page_l', function() {
                            var begin = (($scope.cur_page_l - 1) * $scope.items_per_page_l), end = begin + $scope.items_per_page_l;
                            console.log(begin + ' ' + end);
                            $scope.dataFilter_l = $scope.leftTechnicianInstruction.slice(begin, end);
                        });
                    }

                    if ($scope.instructorInstruction.length > 0) {
                        $scope.noData_i = false;
                        $scope.totalLength_i = $scope.instructorInstruction.length;
                        $scope.$watch('cur_page_i + items_per_page_i', function() {
                            var begin = (($scope.cur_page_i - 1) * $scope.items_per_page_i), end = begin + $scope.items_per_page_i;
                            console.log(begin + ' ' + end);
                            $scope.dataFilter_i = $scope.instructorInstruction.slice(begin, end);
                        });
                    }

                    if ($scope.rightTechnicianInstruction.length > 0) {
                        $scope.noData_r = false;
                        $scope.totalLength_r = $scope.rightTechnicianInstruction.length;
                        $scope.$watch('cur_page_r + items_per_page_r', function() {
                            var begin = (($scope.cur_page_r - 1) * $scope.items_per_page_r), end = begin + $scope.items_per_page_r;
                            console.log(begin + ' ' + end);
                            $scope.dataFilter_r = $scope.rightTechnicianInstruction.slice(begin, end);
                        });
                    }

                }

            });

        };

        $scope.showPagination = function(tech) {
            if(tech == 'I'){
                return $scope.noData_i;
            }
            if(tech == 'R'){
                return $scope.noData_r;
            }
            if(tech == 'L'){
                return $scope.l;
            }
        };

        $scope.getClass = function (tech) {
            if(tech == 'I'){
                if($scope.I){
                    return 'active';
                }
            }
            if(tech == 'LT'){
                if($scope.LT){
                    return 'active';
                }
            }
            if(tech == 'RT'){
                if($scope.RT){
                    return 'active';
                }
            }
        }

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

            if ($window.confirm('Are You Sure ! Do you need to update the Picture?')) {

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

        $scope.editSingleInstruction = function (ins,userType) {
            if(userType == 'I'){

                angular.forEach($scope.dataFilter_i,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                    }

                });
            }
            if(userType == 'RT'){

                angular.forEach($scope.dataFilter_r,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                    }

                });
            }
            if(userType == 'LT'){

                angular.forEach($scope.dataFilter_l,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                    }

                });
            }
        };

        $scope.updateSingleInstruction = function (ins) {
             var data = [];
            data.push(ins);
            if ($window.confirm('Are You Sure ! Do you need to update the Data?')) {

                instructionManualService.updateData(data).then(function(result) {
                    $scope.getData();
                },function(error){
                    // dashboardService.showError(error.data);
                });
            }
        };

        $scope.cancelUpdateSingleInstruction = function (ins,userType) {

            if(userType == 'I'){

                angular.forEach($scope.dataFilter_i,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = false;
                        $scope.leftTechnicianInstruction = [];
                        $scope.rightTechnicianInstruction = [];
                        $scope.instructorInstruction = [];
                        $scope.getData();
                    }

                });
            }
            if(userType == 'RT'){

                angular.forEach($scope.dataFilter_r,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = false;
                        $scope.leftTechnicianInstruction = [];
                        $scope.rightTechnicianInstruction = [];
                        $scope.instructorInstruction = [];
                        $scope.getData();
                    }

                });
            }
            if(userType == 'LT'){

                angular.forEach($scope.dataFilter_l,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = false;
                        $scope.leftTechnicianInstruction = [];
                        $scope.rightTechnicianInstruction = [];
                        $scope.instructorInstruction = [];
                        $scope.getData();
                    }

                });
            }
            //
            // angular.forEach($scope.instructions, function (value,index) {
            //
            //     if(value.id == ins.id){
            //         value.isEdit = false;
            //         instructionManualService.getData(0,ins.serviceId).then(function (result) {
            //             $scope.instructions = result.data;
            //             $scope.loadInstruction = true;
            //         });
            //     }
            //
            // });

        };

        $scope.goToDashboard = function () {
            instructionManualService.goToDashboard();
        };


        $scope.deleteInstruction = function (ins,userMode) {

            if ($window.confirm('Do you need to delete the instruction for other two Technicians?')) {

                instructionManualService.deleteEntireInstruction(ins).then(function (result) {
                    $scope.getData();
                });

            }else{

                instructionManualService.deleteSingleInstruction(ins,userMode).then(function (result) {
                    $scope.getData();
                });

            }
          

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