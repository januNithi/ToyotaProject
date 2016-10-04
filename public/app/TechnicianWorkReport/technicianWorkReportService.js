/**
 * Created by CSS on 20-09-2016.
 */
(function () {
    angular
        .module("toyotaApp")
        .factory('technicianWorkReportService', technicianWorkReportService);

    technicianWorkReportService.$inject = [
        '$http',
        '$window'
    ];
    function technicianWorkReportService ($http,$window) {
        return {

            getWorkCompleted: function (serviceId) {

                return $http.get(
                    '/connect/getWorkCompleted?serviceId=' + serviceId
                );

            },

            goToDashboard : function () {

                $window.location.href = '/';

            },

            deleteFile  : function () {

                return $http.get('/report/delete');

            },

            getRegistrations : function () {

                return $http.get('/connect/getRegisteredService');

            },

            downloadReport : function (data) {
                return $http.post('/report/download',data);
                // return $http.post('/report/pdf/download',data);
            }

        }

    }

})();