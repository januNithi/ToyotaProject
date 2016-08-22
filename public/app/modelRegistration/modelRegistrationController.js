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

        $scope.getModels = function () {

            modelRegistrationService.getModels().then(function (result) {
                $scope.model = result.data;
            });

        }
        
        $scope.editModel = function(mdl){
            angular.forEach($scope.model,function (value,index) {

                if(value == mdl){
                    value.isEdit = true;
                }

            });
        }

        $scope.cancelEdit = function(mdl){
            angular.forEach($scope.model,function (value,index) {

                if(value == mdl){
                    value.isEdit = false;
                    $scope.getModels();
                }

            });
        }

        $scope.addNewService = function (mdl) {
            angular.forEach($scope.model,function (value,index) {

                if(value == mdl){
                    var data = {
                        serviceName : ''
                    }
                    value.services.push(data);
                }

            });
        };
        
        $scope.removeAService = function (mdl,service) {
          
            angular.forEach($scope.model,function (value1,index1) {

                if(value1 == mdl){
                    angular.forEach(value1.services,function(value,index){
                       if(value == service){
                           value1.services.splice(index,1);
                           // value1.isEdit = false;
                       }
                    });
                }

            });
            
        };

        $scope.updateModel = function(mdl){

            modelRegistrationService.updateModel(mdl).then(function(result){

                $scope.model = result.data;

            });

        };
        
        $scope.deleteModel = function (mdl) {
            
            modelRegistrationService.deleteAModel(mdl).then(function (result) {
                
                $scope.model = result.data;
                
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