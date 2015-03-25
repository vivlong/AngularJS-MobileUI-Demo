
app.controller('MainController', function($rootScope, $scope) {
    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;
    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
});

app.controller('mainCtl', function($scope) {
});

app.controller('loginCtl', function($scope, $http, $location) {
    $scope.rememberMe = true;
    $scope.logininfo = {};
    if($scope.logininfo.strPassword == undefined){
        $scope.logininfo.strPassword = "";
    }
    $scope.login = function () {
        var jsonData = { strUserName:$scope.logininfo.strUserName,strPassword:hex_md5($scope.logininfo.strPassword)};
        $http({
            method: 'POST',
            url:    strWebServiceURL +"/login/user",
            data:   jsonData
        }).success(function (data) {
            if (data.status == "success") {
                $location.path('/main').replace();
            } else if (data.status == "failed") {
                $scope.message = "Wrong User Name Or Password.";
            }
        }).error(function (data) {
            $scope.message = "Connect to WebService failed.";
        });
    };
});

app.controller('pvCtl', function($scope, $http){
    $scope.gridOptions = {
        enableSorting: false,
        enableGrouping: false,
        enableColumnMenus: false,
        enablePaginationControls: false,
        paginationPageSize: 8,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 30,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        enableFiltering: false,
        data: {},
        columnDefs: [
            {field:'TrxNo', displayName:'TrxNo', visible: false },
            {field:'VoucherNo', displayName:'Voucher No', width: '28%', headerCellClass: 'text-center'},
            {field:'InvoiceAmt', displayName:'Amt', width: '14%', headerCellClass: 'text-center'},
            {field:'VendorName', displayName:'Vendor Name', width: '33%', headerCellClass: 'text-center'},
            {field:'InvoiceDate', displayName:'Date', width: '26%', headerCellClass: 'text-center'},
            {field:'StatusCode', displayName:'Status', visible: false }
        ]
    };
    $scope.gridOptions.columnDefs[4].cellFilter = 'date';
    $scope.gridOptions.multiSelect = true;

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.selectAll = function() {
        $scope.gridApi.selection.selectAllRows();
    };
    $scope.clearAll = function() {
        $scope.gridApi.selection.clearSelectedRows();
    };

    $scope.searchinfo = {};
    $scope.strSearchBy = 'Voucher No';
    $scope.filterStatus = false;
    $scope.fStatus = 'USE';
    $scope.searchBy = function(intOrder){
        if(intOrder == 0){
            $scope.strSearchBy = 'Voucher No';
        }else{
            $scope.strSearchBy = 'Vendor Name';
        }
    };
    $scope.search = function() {
        var strFilter = "";
        if($scope.searchinfo.strSearch != undefined && $scope.searchinfo.strSearch != ""){
            strFilter = "/" + $scope.strSearchBy.replace(/\s+/g,"") + "/" + $scope.searchinfo.strSearch;
        }
        strFilter = strFilter + "/" + $scope.fStatus
        var p = $http({
            method: "GET",
            url: strWebServiceURL + "/tables/plcp1" + strFilter
        });
        p.success(function(data){
            $scope.gridOptions.data = changeTedious2uiGridDT(data);
        });
        p.error(function(data){
            $scope.message = "Connect to WebService failed.";
        });
    };
    var watch = $scope.$watch("filterStatus",function(newValue,oldValue, scope) {
        if (newValue) {
            $scope.fStatus = "APP";
        } else {
            $scope.fStatus = "USE";
        }
        if (newValue != oldValue) {
            var strFilter = "";
            if($scope.searchinfo.strSearch != undefined && $scope.searchinfo.strSearch != ""){
                strFilter = "/" + $scope.strSearchBy.replace(/\s+/g,"") + "/" + $scope.searchinfo.strSearch;
            }
            strFilter = strFilter + "/" + $scope.fStatus
            var p = $http({
                method: "GET",
                url: strWebServiceURL + "/tables/plcp1" + strFilter
            });
            p.success(function (data) {
                $scope.gridOptions.data = changeTedious2uiGridDT(data);
            });
            p.error(function (data) {
                $scope.message = "Connect to WebService failed.";
            });
        }
    });

    $scope.updateSave = function(){
        var strTrxNo = "";
        var intLength = $scope.gridApi.selection.getSelectedRows().length;
        for (var i=0;i<intLength;i++){
            strTrxNo = strTrxNo + "," + $scope.gridApi.selection.getSelectedRows()[i].TrxNo;
        }
        if(strTrxNo.length>0){
            var p = $http.put(strWebServiceURL + "/tables/plcp1/" + strTrxNo.substring(1));
            p.success(function (data) {
                if (data.status == "success") {
                    $scope.message = data.status;
                    $scope.search();
                } else if (data.status == "failed") {
                    $scope.message = data.status + ". Please try again.";
                }
            });
            p.error(function (data) {
                $scope.message = "Connect to WebService failed.";
            });
        }else{
            $scope.message ="Please select at least one record!";
        }
    };
});


function changeTedious2uiGridDT(data){
    var arrayDT = [];
    var intRowCount = data.length;
    if(intRowCount>0){
        var intCols = data[0].length;
        for(var intRC=0;intRC<=intRowCount-1;intRC++){
            var objRows =  new Object;
            for(var intI=0;intI<=intCols-1;intI++){
                objRows[data[intRC][intI].key] = data[intRC][intI].value;
            }
            arrayDT.push(objRows);
        }
    }  
    return arrayDT;
}

app.controller('echartsBarCtl', function($scope) {
    // initial echarts
    var myChart = echarts.init(document.getElementById('echartsBar')); 
    var option = {
        title : {
            text: '蒸发量和降水量',
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['蒸发量','降水量']
        },
        toolbox: {
            show : true,
            feature : {
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'蒸发量',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'降水量',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint : {
                    data : [
                        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };
    myChart.setOption(option); 
});

app.controller('echartsPieCtl', function($scope) {
    // initial echarts
    var myChart = echarts.init(document.getElementById('echartsPie')); 
    var option = {
        title : {
            text: '用户访问来源',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        toolbox: {
            show : true,
            feature : {
                magicType : {
                    show: true, 
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }
        ]
    };
    myChart.setOption(option); 
});

app.controller('echartsMapCtl', function($scope) {
    // initial echarts
    var myChart = echarts.init(document.getElementById('echartsMap')); 
    var option = {
        title : {
            text: 'iphone销量',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            x:'left',
            data:['iphone3','iphone4','iphone5']
        },
        dataRange: {
            min: 0,
            max: 2500,
            x: 'left',
            y: 'bottom',
            text:['高','低'],           // 文本，默认为数值文本
            calculable : true
        },
        toolbox: {
            show: true,
            orient : 'vertical',
            x: 'right',
            y: 'center',
            feature : {
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series : [
            {
                name: 'iphone3',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                    {name: '北京',value: Math.round(Math.random()*1000)},
                    {name: '天津',value: Math.round(Math.random()*1000)},
                    {name: '上海',value: Math.round(Math.random()*1000)},
                    {name: '重庆',value: Math.round(Math.random()*1000)},
                    {name: '河北',value: Math.round(Math.random()*1000)},
                    {name: '河南',value: Math.round(Math.random()*1000)},
                    {name: '云南',value: Math.round(Math.random()*1000)},
                    {name: '辽宁',value: Math.round(Math.random()*1000)},
                    {name: '黑龙江',value: Math.round(Math.random()*1000)},
                    {name: '湖南',value: Math.round(Math.random()*1000)},
                    {name: '安徽',value: Math.round(Math.random()*1000)},
                    {name: '山东',value: Math.round(Math.random()*1000)},
                    {name: '新疆',value: Math.round(Math.random()*1000)},
                    {name: '江苏',value: Math.round(Math.random()*1000)},
                    {name: '浙江',value: Math.round(Math.random()*1000)},
                    {name: '江西',value: Math.round(Math.random()*1000)},
                    {name: '湖北',value: Math.round(Math.random()*1000)},
                    {name: '广西',value: Math.round(Math.random()*1000)},
                    {name: '甘肃',value: Math.round(Math.random()*1000)},
                    {name: '山西',value: Math.round(Math.random()*1000)},
                    {name: '内蒙古',value: Math.round(Math.random()*1000)},
                    {name: '陕西',value: Math.round(Math.random()*1000)},
                    {name: '吉林',value: Math.round(Math.random()*1000)},
                    {name: '福建',value: Math.round(Math.random()*1000)},
                    {name: '贵州',value: Math.round(Math.random()*1000)},
                    {name: '广东',value: Math.round(Math.random()*1000)},
                    {name: '青海',value: Math.round(Math.random()*1000)},
                    {name: '西藏',value: Math.round(Math.random()*1000)},
                    {name: '四川',value: Math.round(Math.random()*1000)},
                    {name: '宁夏',value: Math.round(Math.random()*1000)},
                    {name: '海南',value: Math.round(Math.random()*1000)},
                    {name: '台湾',value: Math.round(Math.random()*1000)},
                    {name: '香港',value: Math.round(Math.random()*1000)},
                    {name: '澳门',value: Math.round(Math.random()*1000)}
                ]
            },
            {
                name: 'iphone4',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                    {name: '北京',value: Math.round(Math.random()*1000)},
                    {name: '天津',value: Math.round(Math.random()*1000)},
                    {name: '上海',value: Math.round(Math.random()*1000)},
                    {name: '重庆',value: Math.round(Math.random()*1000)},
                    {name: '河北',value: Math.round(Math.random()*1000)},
                    {name: '安徽',value: Math.round(Math.random()*1000)},
                    {name: '新疆',value: Math.round(Math.random()*1000)},
                    {name: '浙江',value: Math.round(Math.random()*1000)},
                    {name: '江西',value: Math.round(Math.random()*1000)},
                    {name: '山西',value: Math.round(Math.random()*1000)},
                    {name: '内蒙古',value: Math.round(Math.random()*1000)},
                    {name: '吉林',value: Math.round(Math.random()*1000)},
                    {name: '福建',value: Math.round(Math.random()*1000)},
                    {name: '广东',value: Math.round(Math.random()*1000)},
                    {name: '西藏',value: Math.round(Math.random()*1000)},
                    {name: '四川',value: Math.round(Math.random()*1000)},
                    {name: '宁夏',value: Math.round(Math.random()*1000)},
                    {name: '香港',value: Math.round(Math.random()*1000)},
                    {name: '澳门',value: Math.round(Math.random()*1000)}
                ]
            },
            {
                name: 'iphone5',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                    {name: '北京',value: Math.round(Math.random()*1000)},
                    {name: '天津',value: Math.round(Math.random()*1000)},
                    {name: '上海',value: Math.round(Math.random()*1000)},
                    {name: '广东',value: Math.round(Math.random()*1000)},
                    {name: '台湾',value: Math.round(Math.random()*1000)},
                    {name: '香港',value: Math.round(Math.random()*1000)},
                    {name: '澳门',value: Math.round(Math.random()*1000)}
                ]
            }
        ]
    };
    myChart.setOption(option); 
});

app.controller('echartsRadarCtl', function($scope) {
    // initial echarts
    var myChart = echarts.init(document.getElementById('echartsRadar')); 
    var option = {
        title : {
            text: '罗纳尔多',
            subtext: '球员数据'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            x : 'center',
            data:['罗纳尔多','舍普琴科']
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        polar : [
            {
                indicator : [
                    {text : '进攻', max  : 100},
                    {text : '防守', max  : 100},
                    {text : '体能', max  : 100},
                    {text : '速度', max  : 100},
                    {text : '力量', max  : 100},
                    {text : '技巧', max  : 100}
                ],
                radius : 130
            }
        ],
        series : [
            {
                name: '完全实况球员数据',
                type: 'radar',
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data : [
                    {
                        value : [97, 42, 88, 94, 90, 86],
                        name : '舍普琴科'
                    },
                    {
                        value : [97, 32, 74, 95, 88, 92],
                        name : '罗纳尔多'
                    }
                ]
            }
        ]
    };
    myChart.setOption(option); 
});

app.controller('echartsLineCtl', function($scope) {
    // initial echarts
    var myChart = echarts.init(document.getElementById('echartsLine')); 
    var option = {
        title : {
            text: '气温变化',
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温']
        },
        toolbox: {
            show : true,
            feature : {
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} °C'
                }
            }
        ],
        series : [
            {
                name:'最高气温',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                data:[1, -2, 2, 5, 3, 2, 0],
                markPoint : {
                    data : [
                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };
    myChart.setOption(option); 
});