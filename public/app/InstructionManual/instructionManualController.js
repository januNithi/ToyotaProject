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
        "spinnerService"
    ];

    function instructionManualController($scope,instructionManualService,$window,defaultProfilePicture,uploadedExcelImagePath,spinnerService) {


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

        $scope.flags = [
            {id:'1',value:'Active'},
            {id:'0',value:'In-Active'}
        ];

        $scope.measuresData = [];

        $scope.getData = function () {
            spinnerService.show('html5spinner');
            $scope.splitInstructions();

        };

        $scope.splitInstructions = function(){
            instructionManualService.getData($scope.choosenModel,$scope.choosenService).then(function (result) {

                $scope.instructions = result.data;
                $scope.loadInstruction = true;
                $scope.leftTechnicianInstruction = [];
                $scope.rightTechnicianInstruction = [];
                $scope.instructorInstruction = [];
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

                            instructionManualService.getMeasures().then(function (result) {

                                $scope.measuresData = result.data;

                            });

                            if(spinnerService){
                                spinnerService.hide('html5spinner');
                            }

                        }

                    }

                });

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
            spinnerService.show('html5spinner');
            angular.forEach($scope.models,function (value,index) {
          
                if(chsnModel == value.modelName){

                    $scope.services = value.services;
                    spinnerService.hide('html5spinner');
                }
                
            });
        };

        $scope.serviceSelected = function (chnsService) {

            if($scope.choosenModel !=0  && $scope.choosenService != 0) {
                $scope.getData();
            }

        };

        $scope.showLeftTechnicianInstructions = function () {
            spinnerService.show('html5spinner');
            $scope.LT = true;
            $scope.RT = false;
            $scope.I = false;
            spinnerService.hide('html5spinner');
        };

        $scope.showRightTechnicianInstructions = function () {
            spinnerService.show('html5spinner');
            $scope.LT = false;
            $scope.RT = true;
            $scope.I = false;
            spinnerService.hide('html5spinner');
        };

        $scope.showInstructorInstructions = function () {
            spinnerService.show('html5spinner');
            $scope.LT = false;
            $scope.RT = false;
            $scope.I = true;
            spinnerService.hide('html5spinner');
        };

        $scope.triggerUpload = function(instruction,fieldName,fileId) {
            $scope.selectedData = instruction;
            $scope.selectedField = fieldName;
            angular.element('#'+fileId).trigger('click');
        };

        $scope.showImage = function(image){
            if(image != null){
                return "data:image/jpeg;base64,"+image;
            }
            return $scope.file;
        };

        $scope.editData = function () {
            $scope.onEdit = true;
        };
        
        $scope.updateData = function(){
            $scope.onEdit = false;
            if ($window.confirm('Are You Sure ! Do you need to update the Data?')) {
                spinnerService.show('html5spinner');


                instructionManualService.updateData($scope.instructions).then(function(error) {
                    console.log(error);
                },function(result){
                    spinnerService.hide('html5spinner');

                    splitInstructions();
                    instructionManualService.updateTaskFin($scope.choosenModel,$scope.choosenService);

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
                spinnerService.show('html5spinner');
                $scope.imageChanged = true;
                $scope.selectedImage = image[0];

                instructionManualService.uploadImage($scope.selectedImage,$scope.selectedData.id,$scope.selectedField).then(function(error) {
                    console.log("Error"+error);
                },function(result){
                    $scope.imageChanged = false;
                    spinnerService.hide('html5spinner');
                    $scope.getData();
                });
            }

        };
        
        $scope.getModelAndService = function () {
            spinnerService.show('html5spinner');
            instructionManualService.getModels().then(function (response) {
                $scope.models = response.data;
                spinnerService.hide('html5spinner');
            });
        };

        $scope.editSingleInstruction = function (ins,userType) {
            spinnerService.show('html5spinner');
            if(userType == 'I'){

                angular.forEach($scope.dataFilter_i,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                        spinnerService.hide('html5spinner');
                    }

                });
            }
            if(userType == 'RT'){

                angular.forEach($scope.dataFilter_r,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                        spinnerService.hide('html5spinner');
                    }

                });
            }
            if(userType == 'LT'){

                angular.forEach($scope.dataFilter_l,function (value,index) {

                    if(value.id == ins.id){
                        value.isEdit = true;
                        spinnerService.hide('html5spinner');
                    }

                });
            }
        };

        $scope.updateSingleInstruction = function (ins) {
             var data = [];
            data.push(ins);
            if ($window.confirm('Are You Sure ! Do you need to update the Data?')) {
                spinnerService.show('html5spinner');
                instructionManualService.updateData(data).then(function(error) {
                    console.log(error);
                },function(result){
                    spinnerService.hide('html5spinner');
                    $scope.getData();
                    instructionManualService.updateTaskFin($scope.choosenModel,$scope.choosenService);

                });
            }
        };

        $scope.cancelUpdateSingleInstruction = function (ins,userType) {
            spinnerService.show('html5spinner');
            if(userType == 'I'){

                angular.forEach($scope.dataFilter_i,function (value,index) {

                    if(value.id == ins.id){
                        spinnerService.hide('html5spinner');
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
                        spinnerService.hide('html5spinner');
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
                        spinnerService.hide('html5spinner');
                        value.isEdit = false;
                        $scope.leftTechnicianInstruction = [];
                        $scope.rightTechnicianInstruction = [];
                        $scope.instructorInstruction = [];
                        $scope.getData();
                    }

                });
            }

        };

        $scope.goToDashboard = function () {
            spinnerService.show('html5spinner');
            instructionManualService.goToDashboard();
        };


        $scope.deleteInstruction = function (ins,userMode) {

            if ($window.confirm('Do you need to delete the instruction for other two Technicians?')) {
                spinnerService.show('html5spinner');
                instructionManualService.deleteEntireInstruction(ins).then(function (error) {
                    console.log(error);
                },function(result){
                    spinnerService.hide('html5spinner');
                    $scope.getData();
                });

            }else{
                spinnerService.show('html5spinner');
                instructionManualService.deleteSingleInstruction(ins,userMode).then(function (error) {
                    console.log(error);
                },function (result) {
                    spinnerService.hide('html5spinner');
                    $scope.getData();
                });

            }
          

        };

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