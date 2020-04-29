/* 左侧菜单选择事件 */
$(".sidebar-menu li").on('click', function () {
    $(".sidebar-menu li").removeClass("active");
    $(this).addClass("active");
    $("#tables-section").hide();
    $("#manage-section").hide();
    $("#statistics-section").hide();

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
            console.error("获取密码信息失败")
        }
    });
};

// 增加密码
const addKey = () => {
    let password = $("#add-key-pwd").val();
    let encryptKey = $("#add-key-primary-key").val();
    let encryptedPwd = AES_ECB_encrypt(password, encryptPassword(encryptKey));
    let reqConfig = {
        name: $("#add-key-name").val(),
        level: checkPassWord(password),
        account: $("#add-key-account").val(),
        password: encryptedPwd,
        remark: $("#add-key-remark").val()
    };

    let res = addKeyReq(reqConfig);
    res.then(json => {
        if (json.status === 1) {
            layer.msg('新增成功', {icon: 1, time: 1000});
            showKeysInfo()
        } else {
            layer.msg('新增失败', {icon: 2, time: 1000});
        }
    }, json => {
        console.error(json);
        layer.msg('新增失败', {icon: 2, time: 1000});
    }).then(() => {
        $("#addKeyModal").modal('hide');
    })
};

/* 删除密码 */
$(document).on("click", ".delete-key", function () {
    // 绑定this对象
    let that = this;
    let keyId = $(that).parents().prevAll(".table-key-id").html();
    layer.confirm('删除不可撤回，确认删除？', {
        btn: ['确定', '取消']
    }, () => {
        let resp = deleteKeyReq(keyId);
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

$(document).on("click", ".view-key", function () {
    let that = this;
    let encryptedPwd = $(that).parent().prevAll(".table-key-password").html();
    layer.prompt({title: '输入主密钥', formType: 1}, function (inputKey, index) {
        try {
            let password = AES_ECB_decrypt(encryptedPwd, encryptPassword(inputKey));
            if (password !== "") {
                layer.close(index);
                layer.open({
                    type: 1,
                    title: false, // 不显示标题栏
                    closeBtn: false,
                    area: '300px;',
                    shade: 0.8,
                    id: 'show_password', // 设定一个id，防止重复弹出
                    btn: ['复制', "取消"],
                    btnAlign: 'c',
                    moveType: 1, // 拖拽模式，0或者1
                    content: `<div style="padding: 50px; line-height: 22px; 
                                   background-color: #393D49; font-size: large;
                                   text-align: center; color: #fff; font-weight: 300;">${password}</div>`,
                    success: function (layerElem) {
                        let btn = layerElem.find('.layui-layer-btn');
                        btn.find('.layui-layer-btn0').attr("id", "show-decrypted-password");
                        let clipboard = new ClipboardJS('#show-decrypted-password', {
                            text: function () {
                                return password;
                            }
                        });
                        clipboard.on('success', function () {
                            layer.msg('密码已复制到剪贴板', {icon: 1, time: 1000});
                        });

                        clipboard.on('error', function () {
                            layer.msg(`复制失败`, {icon: 2, time: 1000});
                        });
                    }
                });
            } else {
                throw Error;
            }
        } catch (err) {
            console.error(err);
            layer.msg(`解密失败，可能主密码有误`, {icon: 2, time: 1000});
        }
    });
});

/* 修改密码信息 */
$(document).on("click", ".update-key", function () {
    let that = this;
    // 将需要修改的信息传给模态框
    $("#update-key-id").val($(that).parent().prevAll(".table-key-id").html());
    $("#update-key-name").val($(that).parent().prevAll(".table-key-name").html());
    $("#update-key-account").val($(that).parent().prevAll(".table-key-account").html());
    $("#update-key-password").val($(that).parent().prevAll(".table-key-password").html());
    $("#update-key-remark").val($(that).parent().prevAll(".table-key-remark").html());
    $("#myModal").modal('show');
});

const updateKey = () => {
    let id = $("#update-key-id").val();
    let name = $("#update-key-name").val();
    let remark = $("#update-key-remark").val();
    let resp = updateKeyInfoReq(id, name, remark);

    resp.then(respJson => {
        if (respJson.status === 1) {
            layer.msg('修改成功', {icon: 1, time: 1000});
            showKeysInfo()
        } else {
            layer.msg(respJson.msg, {icon: 2, time: 1000});
        }
    }).then(() => {
        $("#myModal").modal('hide');
    })
};

const statisticsAll = () => {
    levelChart.showLoading();
    safeChart.showLoading();
    let resp = statisticsReq();
    resp.then((respJson) => {
        if (respJson.status === 1) {
            let chartData = [];
            respJson.data.forEach(v => {
                chartData.push({
                    value: v.count,
                    name: v.level
                })
            });
            printLevelChart(chartData);

            let coefficient = safeCoefficient(respJson.data);
            printSafeChart(coefficient);
        } else {
            console.error("获取统计数据失败")
        }
    }, (respJson) => {
        console.error(respJson)
    });
};

const printLevelChart = (data) => {
    let option = {
        title: {
            text: '密码强度',
            subtext: '分布细则',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#4cb4e7', '#ffc90f', '#ffee93', '#e2dbbe', '#a3a380'],
        series: [
            {
                name: '密码强度',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: data,
                label: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    levelChart.hideLoading();
    levelChart.setOption(option);
};

const printSafeChart = (coefficient) => {
    let option = {
        title: {
            text: '安全性分析',
            left: 'center'
        },
        tooltip: {
            formatter: '{a} <br/>{b} : {c}'
        },
        series: [
            {
                name: '指标',
                type: 'gauge',
                center: ['50%', '55%'],
                detail: {formatter: '{value}%'},
                data: [{value: coefficient, name: '安全程度'}],
                axisLine: {
                    lineStyle: {
                        color: [[0.3, '#c23531'], [0.7, '#87CEEB'], [1, '#00C957']]
                    }
                }
            }
        ]
    };
    safeChart.hideLoading();
    safeChart.setOption(option);
};

const autoFillPassword = () => {
    let password = genKey(true, true, true, true, false, 24);
    let level = checkPassWord(password);

    while (level !== keyLevel.safe.name && level !== keyLevel.verySafe.name) {
        password = genKey(true, true, true, true, false, 24);
        level = checkPassWord(password);
    }
    $("#add-key-pwd").val(password);
    printPwdProcess(level);
};

// 模态框关闭的时候清空表单
$('#addKeyModal').on('hidden.bs.modal', function () {
    $('#add-key-name').val('');
    $('#add-key-account').val('');
    $('#add-key-pwd').val('');
    $('#add-key-remark').val('');
    $('#add-key-primary-key').val('');
    $('#pwdProcess').css('width', "0").html('');
});

const printPwdProcess = (level) => {
    let process = '0';
    let styleClass = '';
    switch (level) {
        case keyLevel.veryWeak.name:
            process = '20%';
            styleClass = 'progress-bar-danger';
            break;
        case keyLevel.weak.name:
            process = '40%';
            styleClass = 'progress-bar-danger';
            break;
        case keyLevel.middle.name:
            process = '60%';
            styleClass = 'progress-bar-warning';
            break;
        case keyLevel.safe.name:
            process = '80%';
            styleClass = 'progress-bar-info';
            break;
        case keyLevel.verySafe.name:
            process = '100%';
            styleClass = 'progress-bar-success';
            break;
        default:
            break
    }
    $('#pwdProcess').removeClass().addClass('progress-bar').addClass(styleClass).css('width', process).html(level);
};

$('#add-key-pwd').bind('input propertychange', function () {
    let password = $('#add-key-pwd').val();
    if (password.length === 0) {
        printPwdProcess("");
        return
    }
    let level = checkPassWord(password);
    printPwdProcess(level)
});

const addPrimaryKey = () => {
    let password = $('#set-password').val();
    let rePassword = $('#re-set-password').val();
    if (password !== rePassword) {
        layer.msg(`两次密码输入不一致`, {icon: 2, time: 1000});
    }
    let hashPwd = encryptPassword(password, 50);
    let req = addPrimaryKeyReq(hashPwd);
    req.then(respJson => {
        if (respJson.status === 1) {
            layer.msg(`设置成功`, {icon: 1, time: 1000});
        } else {
            layer.msg(respJson.msg, {icon: 2, time: 1000});
        }
    })
};

const downloadDBFile = () => {
    layer.prompt({title: '输入主密钥', formType: 1}, function (inputKey, index) {
        let keyHash = encryptPassword(inputKey, 50);
        layer.close(index);
        let rep = downloadDatabaseReq(keyHash);
        rep.then(v => {
            if (v !== undefined) {
                layer.msg("密钥校验错误", {icon: 2, time: 1000});
            }
        }, (resJson) => {
            console.error(resJson)
        });
    });
};

const uploadKeyFile = () => {
    layer.msg("暂不支持", {icon: 2, time: 1000});
};

$(function () {
    levelChart = echarts.init(document.getElementById('level-statistics'));
    safeChart = echarts.init(document.getElementById('safe-analysis'));
    showKeysInfo();
    statisticsAll();

    /* 条形图窗口变化时重绘 */
    // let reset = setTimeout(function () {
    //     window.onresize = function () {
    //         levelChart.resize();
    //         safeChart.resize();
    //     }
    // }, 200);

    // 切换菜单的时候div被隐藏，重新显示时chart宽度设为为100%无法获取真实宽度，需要重绘一下
    // 监听div大小变化时重绘
    $("#statistics-section").resize(function () {
        levelChart.resize();
        safeChart.resize();
    });
});