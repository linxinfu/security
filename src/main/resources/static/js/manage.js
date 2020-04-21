let updateThis; //更新按钮指定的this

/* 左侧菜单选择事件 */
$(".sidebar-menu li").click(function () {
    $(".sidebar-menu li").removeClass("active");
    $(this).addClass("active");
    $("#tables-section").hide();
    $("#administrate-section").hide();
    $("#settings-section").hide();

    $("#" + $(this).attr("data-section")).show();
});

/* 展示密码信息 */
const showKeysInfo = () => {
    let keys = getAllKeysReq();
    keys.then(resp => {
        if (resp.status === 1) {
            $("#information").find(".key-item").remove();
            resp.data.forEach(v => {
                $("#information").append(`
                      <tr class=\"key-item\">
                        <td class=\"table-key-id\">` + v.id + `</td>
                        <td class=\"table-key-name\">` + v.name + `</td>
                        <td class=\"table-key-account\">` + v.account + `</td>
                        <td class=\"table-key-password\">` + v.password + `</td>
                        <td class=\"table-key-level\">` + v.level + `</td>
                        <td class=\"table-key-remark\">` + v.remark + `</td>
                        <td class=\"table-key-create-time\">` + v.create_at + `</td>
                        <td>
                            <button class="btn btn-primary btn-sm view-key"><i class="fa fa-eye"></i></button>&nbsp;
                            <button class="btn btn-primary btn-sm update-key"><i class="fa fa-pencil-square-o"></i></button>&nbsp;
                            <button class="btn btn-danger btn-sm delete-key"><i class="fa fa-trash-o"></i></button>
                        </td>
                      </tr>
                    `);
            });
        } else {
            console.log("获取密码信息失败")
        }
    });
};

// 增加密码
const addKey = () => {
    let password = $("#add-key-pwd").val();
    let encryptKey = $("#add-key-primary-key").val();
    let encryptedPwd = aesEncrypt(password, encryptKey);
    let reqConfig = {
        name: $("#add-key-name").val(),
        level: checkPassWord(password),
        account: $("#add-key-account").val(),
        password: encryptedPwd,
        remark: $("#add-key-remark").val()
    };

    let res = addKeyReq(reqConfig);
    res.then(json => {
        $("#addKeyModal").modal('hide');
        if (json.status === 1) {
            layer.msg('新增成功', {icon: 1, time: 1000});
            showKeysInfo()
        } else {
            layer.msg('新增失败', {icon: 2, time: 1000});
        }
    }, json => {
        $("#addKeyModal").modal('hide');
        console.error(json)
        layer.msg('新增失败', {icon: 2, time: 1000});
    })
};

/* 删除密码 */
$(document).on("click", ".delete-key", function () {
    // 绑定this对象
    let that = this;
    let keyId = $(that).parents().prevAll(".table-key-id").html()
    layer.confirm('删除不可撤回，确认删除？', {
        btn: ['确定', '取消']
    }, () => {
        let resp = deleteKeyReq(keyId)
        resp.then(respJson => {
            if (respJson.status === 1) {
                $(that).parent().parent().remove();
                layer.msg('删除成功', {icon: 1, time: 1000});
            }
        }, respJson => {
            layer.msg(`删除失败,${respJson.msg}`, {icon: 2, time: 1000});
        })
    });
});

$(document).on("click", ".view-key", function() {
    let encryptedPwd = $(this).parent().prevAll(".table-key-password").html()
    console.log(encryptedPwd)
    layer.prompt({title: '输入主密钥', formType: 1}, function (msg, index) {
        try {
            let password = aesDecrypt(encryptedPwd, msg)
            layer.msg(`成功,${password}`, {icon: 1, time: 8000});
        } catch (err) {
            console.log(err)
            layer.msg(`删除失败`, {icon: 2, time: 8000});
        }

        // layer.close(index);

    });
})
/* 从信息表中修改信息 */
$(document).on("click", ".update-key", function () {
    // 绑定this对象
    var that = this;
    //绑定全局this
    updateThis = this;
    // 将需要修改人的信息传给模态框
    $("#update-key-id").val($(that).parent().prevAll(".table-key-id").html());
    $("#update-key-group").val($(that).parent().prevAll(".table-key-group").html());
    $("#update-key-name").val($(that).parent().prevAll(".table-key-name").html());
    $("#myModal").modal('show');
});

/* 确认修改待选人信息 */
$("#update-key-btn").click(function () {
    $("#myModal").modal('hide');
    let updateData = {
        id: $("#update-key-id").val(),
        group: $("#update-key-group").val(),
        name: $("#update-key-name").val()
    };
    // 将信息传给后台
    $.ajax({
        url: 'MainServlet/updatekey',
        type: "post",
        dataType: 'json',
        data: updateData,
        success: function (data) {
            console.log("修改信息成功");
            // 刷新用户列表,存在bug，后端更新比较慢，请求的是还未更新的内容
            //所以直接在前端更新，不请求后端数据
            //  getInformation();

            // 前端更新修改后的数据: 姓名和组号
            $(updateThis).parent().prevAll(".table-key-name").html($("#update-key-name").val());
            $(updateThis).parent().prevAll(".table-key-group").html($("#update-key-group").val());
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
    showKeysInfo();
    showFrequency();

    /* 条形图窗口变化时重绘 */
    let reset = setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200);
});