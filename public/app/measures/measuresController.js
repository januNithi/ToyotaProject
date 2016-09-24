/**
 * Created by CSS on 22-09-2016.
 */
(function(){

    angular.module('toyotaApp').controller('measureController',measureController);


    measureController.$inject=['$scope','$window','measureService'];


    function measureController($scope,$window,measureService){

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


        $scope.measures = [];

        $scope.getMeasures=function(){

            measureService.getMeasures().then(function(result){

                $scope.measures=result.data;
                $scope.totalLength = $scope.measures.length;
                $scope.$watch('cur_page + items_per_page', function() {
                    var begin = (($scope.cur_page - 1) * $scope.items_per_page), end = begin + $scope.items_per_page;
                    console.log(begin + ' ' + end);
                    $scope.dataFilter = $scope.measures.slice(begin, end);
                });

            },function (error) {
                console.log(error);
            });

        };
        $scope.getMeasures();


        $scope.editMeasure=function(data){

            $scope.editableData = data;

            angular.element('#addMeasureModal').trigger('click');

        };

        $scope.goToDashboard = function () {
            measureService.goToDashboard();
        };

        $scope.saveMeasure=function() {

            if($scope.editableData==undefined){

                alert('Empty Fields cannot be updated!!');

            }
            else if($scope.editableData.MName==undefined || $scope.editableData.Start==undefined
                || $scope.editableData.start1==undefined || $scope.editableData.Assigned==undefined
                || $scope.editableData.Flag==undefined)
            {
                alert('Some Fields are Missing');

            }else {

                measureService.saveMeasure($scope.editableData).then(function (error) {
                    console.log(error);

                },function (result) {
                    $scope.editableData = null;
                    alert('Successfully Saved..');
                    $scope.getMeasures();
                });
            }

        };


        $scope.deleteMeasure = function (data) {

            console.log(data);

            if ($window.confirm('Do you need to delete the Additional?')) {

                measureService.deleteMeasure(data).then(function (err) {
                    console.log(err);
                },function(result)
                {
                    $scope.getMeasures();


                });

            }


        };

        $scope.close=function(){
            $scope.editableData=null;

        }

    }



})();