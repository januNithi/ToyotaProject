/**
 * Created by CSS on 22-09-2016.
 */
(function(){

    angular.module('toyotaApp').controller('additionalController',additionalController);


    additionalController.$inject=['$scope','$window','additionalService'];


    function additionalController($scope,$window,additionalService){

        $scope.cur_page= 1;
        $scope.dataFilter = [];
        $scope.items_per_page = 10;
        $scope.totalLength= 0;
        $scope.max_size= 6;

        $scope.editableData = null;

        $scope.flags = [
            {id:'1',value:'Active'},
            {id:'0',value:'In-Active'}
        ];


        $scope.additionals = [];

        $scope.getAdditionals=function(){

            additionalService.getAdditionals().then(function(result){

                $scope.additionals=result.data;
                $scope.totalLength = $scope.additionals.length;
                $scope.$watch('cur_page + items_per_page', function() {
                    var begin = (($scope.cur_page - 1) * $scope.items_per_page), end = begin + $scope.items_per_page;
                    console.log(begin + ' ' + end);
                    $scope.dataFilter = $scope.additionals.slice(begin, end);
                });

            },function (error) {
                console.log(error);
            });

        };
        $scope.getAdditionals();


        $scope.editAdditional=function(data){

            $scope.editableData = data;

            angular.element('#addAdditionalModal').trigger('click');

        };

        $scope.goToDashboard = function () {
            additionalService.goToDashboard();
        };

        $scope.saveAdditional=function() {

            if($scope.editableData==undefined){

                alert('Empty Fields cannot be updated!!');

            }
            else if($scope.editableData.Additional==undefined || $scope.editableData.Purpose==undefined
                || $scope.editableData.Employee==undefined || $scope.editableData.Flag==undefined)
            {
                alert('Some Fields are Missing');

            }else {

                additionalService.saveAdditional($scope.editableData).then(function (error) {
                    console.log(error);

                },function (result) {
                    $scope.editableData = null;
                    alert('Successfully Saved..');
                    $scope.getAdditionals();
                });
            }

        };


        $scope.deleteAdditional = function (data) {

            console.log(data);

            if ($window.confirm('Do you need to delete the Additional?')) {

                additionalService.deleteAdditional(data).then(function (err) {
                    console.log(err);
                },function(result)
                {
                    $scope.getAdditionals();


                });

            }


        };

        $scope.close=function(){
            $scope.editableData=null;

        }

    }



})();