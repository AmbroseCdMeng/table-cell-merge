/**
 * 表格单元格自动合并
 */

/* ***** 合并某一列内容相同的单元格 *****
 * 表格合并列单元格，colIdx要合并的列序号，从0开始
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  列位置，从0开始
 */
function mergeSingleCol(tableid, colIdx) {
    var that;
    $(tableid + ' tr').each(function (row) {
        /*取该行下的指定列单元格*/
        $('td:eq(' + colIdx + ')', this).filter(':visible').each(function (col) {
            /*临时存储当前单元格内容 判断如果与上一次循环取得的内容相同时*/
            if (that != null && $(this).html() == $(that).html()) {
                /*为当前单元格添加 rowspan 属性*/
                rowspan = $(that).attr("rowSpan");
                /* 如果不存在 rowspan 属性 则添加该属性，默认值为 1*/
                if (rowspan == undefined) {
                    $(that).attr("rowSpan", 1);
                    rowspan = $(that).attr("rowSpan");
                }
                /* 如果已经存在 rowspan 属性，则值 + 1 */
                rowspan = Number(rowspan) + 1;
                $(that).attr("rowSpan", rowspan);
                /* 隐藏当前单元格 */
                $(this).hide();
            } else {
                /*第一次循环 或 单元格内容与上一次不同时 更新 that 的值*/
                that = this;
            }
        });
    });
}

/* ***** 合并某 n 列(指定范围)内容相同的单元格（单元格内容有关联） *****
 * 表格合并列单元格，colIdx：要合并的前 n 列
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  结束列位置 从 0 开始 含
 * @param colIdxstart 开始列位置 从 0 开始 含自身
 *  0  1  2  3  4  5        colIdx = 4  colIdxstart = 2
 *  0  1  → 2  3  4 ← 5
 */
function mergeMultiCol(tableid, colIdx, colIdxstart) {
    colIdxstart = colIdxstart || 0;
    var that;
    var _text = function (cols) {
        return $.map(cols, function (col) {
            return $(col).text();
        }).join("**");
    };
    /* 遍历表格下所有行 */
    $(tableid + " tr").each(function (row) {
        /* 获取指定前n列 并篩選"不可見"元素（hidden、disabled 等）*/
        var _colspan = $(this)
            .find("td" + (colIdxstart <= 0 ? "" : ":gt(" + (colIdxstart - 1) + ")") + ":lt(" + (colIdx - colIdxstart + 1) + ")")
            .filter(":visible");
        /* 如果存在可见列 */
        if (_colspan.length > 0) {
            /* 如果存在上一行内容 并且 当前行的前 colIdx 列的内容 与上一行的前 colIdx 列的内容 完全相同 */
            if (that != null && _text(_colspan) == _text(that)) {
                /* 遍历前当前行的 前 colIdx 列 */
                that.each(function (col) {
                    /* 获取当前遍历到的列的 rowSpan 属性 */
                    rowspan = $(this).attr("rowSpan");
                    /* 如果未定义 rowSpan 属性 */
                    if (rowspan == undefined) {
                        /* 对当前单元格添加 rowSpan 属性，默认值为 1 */
                        $(this).attr("rowSpan", 1);
                        rowspan = $(this).attr("rowSpan");
                    }
                    /* 如果当前单元格已存在 rowSpan 属性 ，则对 rowspan 的值加上之前合并过的 rowspan 的值（默认 为 1）*/
                    rowspan = Number(rowspan) + Number($(_colspan).attr("rowSpan") || 1);
                    $(this).attr("rowSpan", rowspan);
                });
                /* 遍历之前判断的内容相同的列，依次隐藏 */
                $(_colspan).each(function (col) {
                    $(this).hide();
                });
            } else {
                /* 如果不存在上一行内容（第一行）*/
                that = _colspan;
            }
        }
    });
    /* 自调用 */
    if (colIdx > colIdxstart) {
        colIdx -= 1;
        mergeMultiCol(tableid, colIdx, colIdxstart);
    }
}


/* ***** 合并某 n 列(指定列索引)内容相同的单元格（单元格内容有关联） *****
 * 表格合并列单元格，colIdx：要合并的列（数组）
 * @param tableid 表ID，例如#Table_Center
 * @param colArr 列数组 如 [1,2,3]
 */
function mergeMultiCol_2(tableid, colArr) {
    var that;
    if (!(colArr instanceof Array))
        return;
    var _text = function (cols) {
        return $.map(cols, function (col) {
            return $(col).text();
        }).join("**");
    };
    var condition_str = $.map(colArr, (i, item) => {
        //return "td eq(" + i + ")";
        return `td:eq(${i})`;
    }).join(",");

    /* 遍历表格下所有行 */
    $(tableid + " tr").each(function (row) {
        /* 获取指定前n列 并篩選"不可見"元素（hidden、disabled 等）*/
        var _colspan = $(this)
            .find(condition_str)
            .filter(":visible");
        /* 如果存在可见列 */
        if (_colspan.length > 0) {
            /* 如果存在上一行内容 并且 当前行的前 colIdx 列的内容 与上一行的前 colIdx 列的内容 完全相同 */
            if (that != null && _text(_colspan) == _text(that)) {
                /* 遍历前当前行的 前 colIdx 列 */
                that.each(function (col) {
                    /* 获取当前遍历到的列的 rowSpan 属性 */
                    rowspan = $(this).attr("rowSpan");
                    /* 如果未定义 rowSpan 属性 */
                    if (rowspan == undefined) {
                        /* 对当前单元格添加 rowSpan 属性，默认值为 1 */
                        $(this).attr("rowSpan", 1);
                        rowspan = $(this).attr("rowSpan");
                    }
                    /* 如果当前单元格已存在 rowSpan 属性 ，则对 rowspan 的值加上之前合并过的 rowspan 的值（默认 为 1）*/
                    rowspan = Number(rowspan) + Number($(_colspan).attr("rowSpan") || 1);
                    $(this).attr("rowSpan", rowspan);
                });
                /* 遍历之前判断的内容相同的列，依次隐藏 */
                $(_colspan).each(function (col) {
                    $(this).hide();
                });
            } else {
                /* 如果不存在上一行内容（第一行）*/
                that = _colspan;
            }
        }
    });
    /* 自调用 */
    if (colArr.length > 0) {
        colArr.pop();
        mergeMultiCol_2(tableid, colArr);
    }
}

/* ***** 跨列合并某单元格 *****
 * 跨列合并(如果结束行传0代表合并所有行)
 * @param tableid 表ID，例如#table
 * @param colIdx  结束列 从 0 开始 包含自身
 * @param colIdxstart  开始列 从 0 开始 包含自身 默认 0 
 */

function mergeRows(tableid, colIdx, colIdxstart) {
    colIdxstart = colIdxstart || 0;
    $(tableid + ' tr').each(function (row) {
        var that;
        $("td" + (colIdxstart <= 0 ? "" : ":gt(" + (colIdxstart - 1) + ")") + ":lt(" + (colIdx - colIdxstart + 1) + ")", this)
            .filter(':visible').each(function (col) {
                if (that != null && $(this).html() == $(that).html()) {
                    colspan = $(that).attr("colSpan");
                    if (colspan == undefined) {
                        $(that).attr("colSpan", 1);
                        colspan = $(that).attr("colSpan");
                    }
                    colspan = Number(colspan) + 1;
                    $(that).attr("colSpan", colspan);
                    $(this).hide();
                } else {
                    that = this;
                }
            });
    });
}
