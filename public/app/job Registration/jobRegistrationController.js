(function(){
    
    angular.module('toyotaApp').controller('jobRegistrationController',jobRegistrationController);


    jobRegistrationController.$inject=['$scope','$window','jobRegistrationService','instructionManualService'];
    
    
    function jobRegistrationController($scope,$window,jobRegistrationService,instructionManualService){


        $scope.getServiceRegDetails=function(){


            $scope.cur_page= 1;
            $scope.dataFilter = [];
            $scope.items_per_page = 4;
            $scope.totalLength= 0;
            $scope.max_size= 6;

            jobRegistrationService.serviceRegDetails().then(function(data){

                $scope.serviceDetails=data.data;
                $scope.totalLength = $scope.serviceDetails.length;
                $scope.$watch('cur_page + items_per_page', function() {
                    var begin = (($scope.cur_page - 1) * $scope.items_per_page), end = begin + $scope.items_per_page;
                    console.log(begin + ' ' + end);
                    $scope.serviceRegDetails = $scope.serviceDetails.slice(begin, end);
                });

            });

        };
        $scope.getServiceRegDetails();


        $scope.editJobReg=function(data){

            angular.forEach($scope.serviceRegDetails,function (value,index) {

                if(value.Sid == data.Sid){
                    value.isEdit = true;
                    if(value.Mid!=null){

                        $scope.modelSelected(value.Mid);

                    }

                }

            });


        };

        $scope.updateJobReg=function(data){
           

            jobRegistrationService.postUpdateJobReg(data).then(function (result) {

                alert('Successfully Saved..');
                $scope.services=null;

                $scope.getServiceRegDetails();

            });
            
            
            
        };
        $scope.goToDashboard = function () {
            instructionManualService.goToDashboard();
        };

        $scope.saveNewJob=function(data) {

            if(data==undefined){

                alert('please fill all fields and save');

            }

               else if(data.OrderCode==undefined || $scope.services==undefined || $scope.choosenModel==undefined || data.Vehicle_No==undefined || data.VehicleMilege==undefined || data.Bay_No==undefined)
                {
                    $scope.services=null;
                    $scope.choosenModel='';
                    $scope.data=null;
                    alert('please fill all fields and save');
                    $scope.close();

                }else {
                data.choosenModel = $scope.choosenModel;
                data.choosenService = $scope.choosenService;
                jobRegistrationService.saveNewJobService(data).then(function (data) {

                    console.log(data);
                    $scope.data =null;
                    alert('Successfully Saved..');
                    $scope.services = null;
                    $scope.getServiceRegDetails();


                });
            }

        };


        $scope.deleteJobReg = function (data) {

            console.log(data);

            if ($window.confirm('Do you need to delete?')) {

                jobRegistrationService.deleteJobReg(data).then(function (err) {
                    console.log(err);
                },function(result)
                {
                    $scope.getServiceRegDetails();


                });

            }


        };

        $scope.cancelJobReg = function (data) {


            angular.forEach($scope.serviceRegDetails,function (value,index) {

                if(value.Sid == data.Sid){
                    value.isEdit = false;
                    $scope.getServiceRegDetails();
                }

            });


        };

        $scope.modelSelected = function(chsnModel){
            angular.forEach($scope.models,function (value,index) {

                if(chsnModel == value.modelName){

                    $scope.services = value.services;

                }

            });
        };

        $scope.getModelAndService = function () {
            jobRegistrationService.getModels().then(function (response) {
                $scope.models = response.data;
            });
        };
        $scope.getModelAndService();


        $scope.close=function()
        {

            $scope.data=null;
            $scope.services=null;
            $scope.choosenModel='';

        }

    }


    
})();