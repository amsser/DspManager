function formControl($scope, $http) {

    $scope.ad = {};
    $scope.ad.Ad_type = '1';
    $scope.Exchange_selected = [];
    $scope.Exchange_all = [{label:"Mongo Exchange",value:"15",ischecked:false}];


    $http.get('/order/listjson').success(function(orders) {

        $scope.orders = orders;

        $scope.order = orders[0];

        if ($scope.id) {

            $http.get('/ad/getjson?id=' + $scope.id).success(function(rs) {

                $scope.ad = rs['ad'];

                for (var o in orders) {
                    if ($scope.ad.Order_id == orders[o]._id) {
                        $scope.order = orders[o];
                    }
                }


                $scope.Exchange_selected = $scope.ad.Exchange;

                var regj = 0;



                for (a in $scope.Exchange_all) {

                   

                    if (regj < $scope.Exchange_selected.length && $scope.Exchange_all[a].value == $scope.Exchange_selected[regj]) {

                        $scope.Exchange_all[a].ischecked = 'true';

                        regj++;

                    }

                }



            });

        };


    });


}