/**
 * Created by CSS on 29-07-2016.
 */
(function () {

    angular
        .module('toyotaApp')
        .controller('modelRegistrationController', modelRegistrationController);

    modelRegistrationController.$inject = [
        '$scope',
        'modelRegistrationService'
    ];

    function modelRegistrationController($scope,modelRegistrationService) {

        $scope.model = [];

        $scope.flags = [
            {id:'1',value:'Active'},
            {id:'0',value:'In-Active'}
        ];
        
        $scope.getModels = function () {

            modelRegistrationService.getModels().then(function (result) {
                $scope.model = result.data;
            });

        }
        
        $scope.editModel = function(mdl){
            angular.forEach($scope.model,function (value,index) {

                if(value.MName == mdl.MName){
                    value.isEdit = true;
                }

            });
        };


        $scope.goToDashboard = function () {
            modelRegistrationService.goToDashboard();
        };


        $scope.cancelEdit = function(mdl){
            angular.forEach($scope.model,function (value,index) {

                if(value.MName == mdl.MName){
                    value.isEdit = false;
                    $scope.getModels();
                }

            });
        };

        $scope.addNewModel = function () {

            var data = {
                MName : '',
                services : [
                    {
                        MType: '',
                        Employee: '',
                        Flag: ''
                    }
                ],
                isEdit : true
            };
            $scope.model.push(data);

        };

        $scope.addNewService = function (mdl) {
            angular.forEach($scope.model,function (value,index) {

                if(value == mdl){
                    var data = {
                        MType : '',
                        Employee : '',
                        Flag : ''
                    }
                    value.services.push(data);
                }

            });
        };
        
        $scope.removeAService = function (mdl,service) {
          
            angular.forEach($scope.model,function (value1,index1) {

                if(value1.MName == mdl.MName){
                    angular.forEach(value1.services,function(value,index){
                       if(value.Mid == service.Mid){
                           value1.services.splice(index,1);
                       }
                        if(value1.services.length == 0){
                            $scope.model.splice(index1,1);
                        }
                    });
                }

            });
            
        };

        $scope.updateModel = function(mdl){

            modelRegistrationService.updateModel(mdl).then(function(error) {

                console.log(error);

            },function (result) {
                $scope.getModels();
            });

        };
        
        $scope.deleteModel = function (mdl) {
            var data = [];
            angular.forEach(mdl.services,function (value,index) {
                if(value.Mid) {

                    data.push(value.Mid);

                    if((index + 1) == mdl.services.length){

                        if(data.length){
                            modelRegistrationService.deleteAModel(data).then(function (error) {

                                console.log(error);

                            },function (result) {
                                $scope.getModels();
                            });
                        }else{

                            $scope.getModels();

                        }

                    }

                }
            });


            
        };

        $scope.showEditable = function(mdl){
            if(mdl.isEdit == true){
                return true;
            }
            return false;
        }
       

        $scope.getModels();
    }

})();