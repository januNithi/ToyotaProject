/**
 * Created by CSS on 02-08-2016.
 */

(function () {
    angular
        .module("toyotaApp")
        .factory('instructionManualService', instructionManualService);

    instructionManualService.$inject = [
        '$http',
        'Upload',
        '$window'
    ];
    function instructionManualService ($http,Upload,$window) {
        return {

            getData : function (model,service) {

                return $http.get(
                    '/connect/getData?modelId='+model+'&serviceId='+service
                );

            },

            goToDashboard : function () {

                $window.location.href = '/';

            },
            
            getServiceId : function () {
                
                return $http.get('/getServiceId');
                
            },

            deleteEntireInstruction : function (ins) {
              
                return $http.post('/deleteEntireInstruction',ins);
                
            },
            
            deleteSingleInstruction : function (ins,userMode) {

                var data = {
                    ins : ins,
                    userMode : userMode
                };

                return $http.post('/deleteSingleInstruction',data);

            },            
            
            uploadImage: function (file,id,selectedField) {

                return Upload.upload({
                    url: '/uploadImage?id='+id+'&selectedField='+selectedField,

                    data: {file:file}

                });
            },
            updateData : function(instructions){

                return $http.post('/connect/updateData',instructions);

            },
            getModels : function () {

                return $http.get(
                    '/model/getModel'
                );

            },
        };
    }
})();
