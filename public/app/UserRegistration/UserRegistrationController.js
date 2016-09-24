(function(){

    angular.module('toyotaApp')
           .controller('userRegistrationController',userRegistrationController);

    userRegistrationController.$inject=['$scope','userRegistrationService','$window','instructionManualService'];

    function userRegistrationController($scope,userRegistrationService,$window,instructionManualService){
        
        $scope.employeeRegDetails=[];
        $scope.files='';
        $scope.Editfiles='';
        $scope.selectUserdetails=null;
        $scope.data={};
        $scope.image=true;
        $scope.myDate = new Date();
        $scope.name=true;


        
        $scope.cur_page= 1;
        $scope.dataFilter = [];
        $scope.items_per_page = 4;
        $scope.totalLength= 0;
        $scope.max_size= 6;

        $scope.Flags = [{id:1,value:"Active"},
                        {id:0,value:"InActive"}];

        $scope.ModelFlag=["Active","InActive"];

        $scope.re = /^[0-9]{1,6}$/;
        //$scope.re1 = /^[0-9]{1,6}$/;



        $scope.getEmployeeRegDetails=function(){

            userRegistrationService.getEmployeeRegDetails().then(function(data){

                console.log(data.data);

                $scope.employeeRegDetails=data.data;
                $scope.totalLength = $scope.employeeRegDetails.length;
                $scope.$watch('cur_page + items_per_page', function() {
                    var begin = (($scope.cur_page - 1) * $scope.items_per_page), end = begin + $scope.items_per_page;
                    console.log(begin + ' ' + end);
                    $scope.dataFilter = $scope.employeeRegDetails.slice(begin, end);
                });

                
                
            });

        };
        $scope.getEmployeeRegDetails();


        $scope.encodeImage=function(encodeImage){
               
            return "data:image/jpeg;base64,"+encodeImage;

        };



      $scope.editEmployeeReg=function(data){

          angular.element('#f1').trigger('click');
          if ($window.confirm('Do you need to edit?')) {

              $scope.selectUserdetails=data;
              angular.forEach($scope.employeeRegDetails, function (value, index) {

                  if (value.DMI_No == data.DMI_No) {
                      value.isEdit = true;
                  }

              });
          }

      };
        $scope.goToDashboard = function () {
            instructionManualService.goToDashboard();
        };

        $scope.showImage=function(){
            return $scope.name;
        };


        $scope.uploadedFiles = function(element) {
            $scope.name=false;
            $scope.$apply(function($scope) {

                $scope.Editfiles = element.files;

            });
        };

    $scope.updateEmployeeReg=function()
    {
        $scope.selectUserdetails.image=$scope.Editfiles;
        $scope.i=0;
        console.log($scope.selectUserdetails);
        if($scope.selectUserdetails.Flag=="Active"){

            $scope.selectUserdetails.Flag=1;

        }
        else {

            $scope.selectUserdetails.Flag=0;
        }
        angular.forEach($scope.employeeRegDetails, function (value, index) {

            if(value.DMI_No != $scope.selectUserdetails.DMI_No) {

                if (value.Bay_No == $scope.selectUserdetails.Bay_No) {
                    $scope.i = $scope.i + 1;

                }
            }

        });

        if ($scope.i >= 3) {

            alert('Already BayNo Exits...!');
            $scope.getEmployeeRegDetails();

        }else {

            if ($window.confirm('Do you need to update?')) {
                userRegistrationService.postUpdateEmployeeDetails($scope.selectUserdetails).then(function (result) {

                    $scope.selectUserdetails.isEdit = false;
                    $scope.selectUserdetails = '';
                    alert('Successfully Saved..');
                    $scope.getEmployeeRegDetails();


                });
            }
        }

    };
        $scope.uploadedFile = function(element) {
            $scope.$apply(function($scope) {
                $scope.files = element.files;
            });
        };




        $scope.saveNewEmployee=function() {
                $scope.i=0;
            if($scope.selectUserdetails.Flag=="Active"){

                $scope.selectUserdetails.Flag=1;

            }
            else {

                $scope.selectUserdetails.Flag=0;
            }
            angular.forEach($scope.employeeRegDetails, function (value, index) {


                if(value.Bay_No==$scope.selectUserdetails.Bay_No){
                    $scope.i =$scope.i+1;

                }

            });


            if ($scope.i >= 3) {

                alert('Already BayNo Exits...!');
                $scope.data=null;
                $scope.selectUserdetails=null;

            }else{
                //$scope.data=$scope.data.BayNo;
                $scope.selectUserdetails.files=$scope.files;
                if ($window.confirm('Do you need to save?')) {
                    userRegistrationService.saveEmployeeRegDetails($scope.selectUserdetails).then(function (data) {

                        console.log(data);
                        $scope.data = null;
                        $scope.selectUserdetails=null;
                        alert('Successfully Saved..');
                        $scope.getEmployeeRegDetails();


                    });
                }
            }

        };

        $scope.cancelEmployeeReg = function () {

                    $scope.getEmployeeRegDetails();



        };
        $scope.deleteEmployeeReg = function (data) {

            console.log(data);

            if ($window.confirm('Do you need to delete?')) {

                userRegistrationService.deleteEmployeeDetails(data).then(function (err) {
                    console.log(err);
                },function(result)
                {
                    $scope.getEmployeeRegDetails();


                });

            }


        };


        $scope.close=function(){

            $scope.data=null;
            $scope.selectUserdetails=null;



        };
    }




})();