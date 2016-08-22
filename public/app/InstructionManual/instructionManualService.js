/**
 * Created by CSS on 02-08-2016.
 */

(function () {
    angular
        .module("toyotaApp")
        .factory('instructionManualService', instructionManualService);

    instructionManualService.$inject = [
        '$http',
        'Upload'
    ];
    function instructionManualService ($http,Upload) {
        return {

            getData : function (model,service) {

                return $http.get(
                    '/connect/getData?modelId='+model+'&serviceId='+service
                );

            },
            
            getServiceId : function () {
                
                return $http.get('/getServiceId');
                
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
