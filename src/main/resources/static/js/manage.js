var updateThis; //更新按钮指定的this

const request = (url, config) => {
    return fetch(url, config).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            throw Error('服务器请求异常')
        }
    }).then((resJson) => {
        return resJson
    }).catch((error) => {
        console.error(error)
    })
};

const get = (url) => {
    return request(url, {method: 'GET'})
};

const post = (url, config) => {
    return request(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(config)
    })
};

/* 左侧菜单选择事件 */
$(".sidebar-menu li").click(function () {
    console.log("大石街道")
    $(".sidebar-menu li").removeClass("active");
    $(this).addClass("active");
    $("#tables-section").hide();
    $("#administrate-section").hide();
    $("#settings-section").hide();

    $("#" + $(this).attr("data-section")).show();
});

/* 获取所有待选人信息 */
function getInformation() {
    let a = get("hello");
    console.log("大家啊四等奖假数据爱神的箭 ");
    console.log(a);
    $.ajax({
        url: 'MainServlet/selectAllUser',
        dataType: 'json',
        success: function (data) {
            // 判断返回的数据是否为空
            if (JSON.stringify(data) === '[]') {
                console.log("返回的待选人信息数据为空");
                return 0;
            } else {
                // 遍历json将待选人填入表中
                for (let i in data[0].list) {
                    $("#information").append(`
                      <tr>
                        <td class=\"table-user-id\">` + data[0].list[i].id + `</td>
                        <td class=\"table-user-name\">` + data[0].list[i].name + `</td>
                        <td class=\"table-user-group\">` + data[0].list[i].group + `</td>               
                        <td>
                         <button class=\"btn btn-danger btn-sm update-user \">update</button>&nbsp;&nbsp;
                         <button class=\"btn btn-danger btn-sm delete-user \">delete</button>
                        </td>
                      </tr>
                    `);
                }
            }
        },
        error: function (data) {
            console.log("待选人信息请求失败！");
        }
    });
}

/* 从从信息表中删除人 */
$(document).on("click", ".delete-user", function () {
    // 绑定this对象
    var that = this;
    // 存储传输的用户id
    var myData = {
        id: parseInt($(that).parent().prevAll(".table-user-id").html())
    };
    //询问是否确认删除
    layer.confirm('确认删除该人？', {
        btn: ['确定', '取消']
    }, function () {
        /** test */
        $(that).parent().parent().remove();
        layer.msg('删除成功', {icon: 1, time: 1000});
        /**  test end */
        //向后端传输数据
        $.ajax({
            url: 'MainServlet/deleteUser',
            dataType: 'json',
            data: myData,
            success: function (data) {
                if (data[0].isDelete) {
                    // 将人从页面删除
                    $(that).parent().parent().remove();
                    layer.msg('删除成功', {icon: 1, time: 1000});
                } else {
                    layer.msg('删除失败', {icon: 2, time: 1000});
                }
            },
            error: function () {
                console.log("删除待选人请求发送失败！");
            }
        });
    });
});

/* 从从信息表中修改信息 */
$(document).on("click", ".update-user", function () {
    // 绑定this对象
    var that = this;
    //绑定全局this
    updateThis = this;
    // 将需要修改人的信息传给模态框
    $("#update-user-id").val($(that).parent().prevAll(".table-user-id").html());
    $("#update-user-group").val($(that).parent().prevAll(".table-user-group").html());
    $("#update-user-name").val($(that).parent().prevAll(".table-user-name").html());
    $("#myModal").modal('show');
});

/* 确认修改待选人信息 */
$("#update-user-btn").click(function () {
    $("#myModal").modal('hide');
    let updateData = {
        id: $("#update-user-id").val(),
        group: $("#update-user-group").val(),
        name: $("#update-user-name").val()
    };
    // 将信息传给后台
    $.ajax({
        url: 'MainServlet/updateUser',
        type: "post",
        dataType: 'json',
        data: updateData,
        success: function (data) {
            console.log("修改信息成功");
            // 刷新用户列表,存在bug，后端更新比较慢，请求的是还未更新的内容
            //所以直接在前端更新，不请求后端数据
            //  getInformation();

            // 前端更新修改后的数据: 姓名和组号
            $(updateThis).parent().prevAll(".table-user-name").html($("#update-user-name").val());
            $(updateThis).parent().prevAll(".table-user-group").html($("#update-user-group").val());
        },
        error: function () {
            console.log("修改待选人信息请求发送失败！");
        }
    });
});

/** 显示被抽中次数 */
function showFrequency() {
    myChart = echarts.init(document.getElementById('frequencyChart'));
    myChart.showLoading();
    // 统计次数
    var dataX = [];
    // Y轴的数据
    var dataY = [];
    // 统计显示的人数
    var number = 0;

//向后端请求待选人被抽中次数数据
    $.ajax({
        url: 'hello',
        dataType: 'json',
        success: function (data) {
            // 遍历json
            for (let i in data[0].list) {
                number++; // 人数加一
                dataX.push(data[0].list[i].count);
                dataY.push(data[0].list[i].name);
            }
            // 调整高度
            $("#frequencyChart").css('height', number * 60);
            console.log($("#frequencyChart").css("height"));
            // 显示图形
            option = {
                title: {
                    text: '待选人抽中次数'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true},
                        dataZoom: {
                            yAxisIndex: 'none'
                        }
                    }
                },
                grid: {
                    containLabel: true
                },
                xAxis: {
                    name: "次数（次）",
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    name: "待选人",
                    type: 'category',
                    data: dataY
                },
                series: [
                    {
                        name: '抽中次数',
                        type: 'bar',
                        data: dataX,
                        itemStyle: {
                            normal: {
                                color: '#4ad2ff'
                            }
                        },
                    }
                ]
            };
            myChart.hideLoading();
            myChart.setOption(option);
        },
        error: function () {
            console.log("删除待选人请求发送失败！");
        }
    });
}


// 点击导出报表按钮，打印报表
$("#report-btn").click(function () {
    const request = (url, config) => {
        return fetch(url, config).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                // 服务器异常
                throw Error('')
            }
        }).then((resJson) => {
            return resJson
        }).catch((error) => {
            console.log(error)
        })
    }
});

// 点击清空次数按钮
$("#reset-number-btn").click(function () {
    // 发出ajax请求
    $.ajax({
        url: 'MainServlet/clearTime',
        type: "post",
        success: function () {
            // 刷新次数条形图
            showFrequency();
            console.log("清空次数成功");
        },
        error: function () {
            console.log("清空次数请求失败");
        }
    });

});


$(function () {
    getInformation();
    showFrequency();

    /* 条形图窗口变化时重绘 */
    let reset = setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200);
});