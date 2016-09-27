
(function () {
    angular
        .module("toyotaApp")
        .factory('loadInputDataService', loadInputDataService);

    loadInputDataService.$inject = [
        'Upload',
        '$window',
        '$http'
    ];
    function loadInputDataService (Upload,$window,$http) {
        return {

            uploadData : function (files,service,model) {

                return Upload.upload({
                    url: '/connect/loadData?service='+service+'&model='+model,

                    data: {file: files}

                });

            },
            updateTaskFin : function (model,service) {

                return $http.get('/connect/updateTaskFin?service='+service+'&model='+model);

            },
            goToDashboard : function () {

                $window.location.href = '/';

            },


            viewManual : function () {
                $window.location.href = '/instructionManual';
            }
        };
    }
})();

