(function(){
    
    angular.module('toyotaApp').controller('jobRegistrationController',jobRegistrationController);


    jobRegistrationController.$inject=['$scope','$window','jobRegistrationService','instructionManualService','spinnerService'];
    
    
    function jobRegistrationController($scope,$window,jobRegistrationService,instructionManualService,spinnerService){


        $scope.getServiceRegDetails=function(){

            spinnerService.show('html5spinner');
            $scope.cur_page= 1;
            $scope.dataFilter = [];
            $scope.items_per_page = 4;
            $scope.totalLength= 0;
            $scope.max_size= 6;

            jobRegistrationService.serviceRegDetails().then(function(data){

                spinnerService.hide('html5spinner');
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
            spinnerService.show('html5spinner');
            angular.forEach($scope.serviceRegDetails,function (value,index) {

                if(value.Sid == data.Sid){
                    value.isEdit = true;
                    if(value.Mid!=null){

                        $scope.modelSelected(value.Mid);

                    }
                    spinnerService.hide('html5spinner');
                }

            });


        };

        $scope.updateJobReg=function(data){

            spinnerService.show('html5spinner');
            jobRegistrationService.postUpdateJobReg(data).then(function (result) {

                alert('Successfully Saved..');
                $scope.services=null;
                spinnerService.hide('html5spinner');
                $scope.getServiceRegDetails();

            });
            
            
            
        };
        $scope.goToDashboard = function () {
            spinnerService.show('html5spinner');
            instructionManualService.goToDashboard();
            spinnerService.hide('html5spinner');

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
                // $scope.close();

            }else {
                spinnerService.show('html5spinner');
                data.choosenModel = $scope.choosenModel;
                data.choosenService = $scope.choosenService;
                jobRegistrationService.saveNewJobService(data).then(function (data) {

                    console.log(data);
                    $scope.data =null;
                    alert('Successfully Saved..');
                    $scope.services = null;
                    spinnerService.hide('html5spinner');
                    $scope.getServiceRegDetails();

                });
            }

        };


        $scope.deleteJobReg = function (data) {

            console.log(data);

            if ($window.confirm('Do you need to delete?')) {
                spinnerService.show('html5spinner');
                jobRegistrationService.deleteJobReg(data).then(function (err) {
                    console.log(err);
                },function(result)
                {
                    spinnerService.hide('html5spinner');
                    $scope.getServiceRegDetails();
                });

            }


        };

        $scope.cancelJobReg = function (data) {
            spinnerService.show('html5spinner');
            angular.forEach($scope.serviceRegDetails,function (value,index) {

                if(value.Sid == data.Sid){
                    value.isEdit = false;
                    spinnerService.hide('html5spinner');
                    $scope.getServiceRegDetails();
                }

            });


        };

        $scope.modelSelected = function(chsnModel){
            spinnerService.show('html5spinner');
            angular.forEach($scope.models,function (value,index) {

                if(chsnModel == value.MName){

                    $scope.services = value.services;
                    spinnerService.hide('html5spinner');
                }

            });
        };

        $scope.getModelAndService = function () {
            spinnerService.show('html5spinner');
            jobRegistrationService.getModels().then(function (response) {
                spinnerService.hide('html5spinner');
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