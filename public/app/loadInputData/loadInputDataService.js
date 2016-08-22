
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

            uploadData : function (files,serviceId) {

                return Upload.upload({
                    url: '/connect/loadData?serviceId='+serviceId,

                    data: {file: files}

                });

            },

            viewManual : function () {
                $window.location.href = '/instructionManual';
            }
        };
    }
})();

