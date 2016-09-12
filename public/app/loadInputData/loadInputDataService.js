
(function () {
    angular
        .module("toyotaApp")
        .factory('loadInputDataService', loadInputDataService);

    loadInputDataService.$inject = [
        'Upload',
        '$window'
    ];
    function loadInputDataService (Upload,$window) {
        return {

            uploadData : function (files,service,model) {

                return Upload.upload({
                    url: '/connect/loadData?service='+service+'&model='+model,

                    data: {file: files}

                });

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

