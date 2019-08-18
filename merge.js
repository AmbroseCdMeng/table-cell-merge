/* ***** 合并某一列内容相同的单元格 *****
 * 表格合并列单元格，colIdx要合并的列序号，从0开始
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  列位置，从0开始
 * 如mergeSingleCol('#table', 2) 表示自动合并 table 中第 2 列中所有内容相同的相邻单元格
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

/* ***** 合并某 n 列内容相同的单元格（单元格内容有关联） *****
 * 表格合并列单元格，colIdx：要合并的前 n 列
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  结束列位置 从 0 开始 含
 * @param colIdxstart 开始列位置 从 0 开始 含自身     2019年8月17日13:30:46 扩展一个参数
 *  0  1  2  3  4  5        colIdx = 4  colIdxstart = 2
 *  0  1  → 2  3  4 ← 5
 *  如mergeMultiCol('#table', 4, 2) 表示合并 table 第2 - 4列内容相同的单元格（单元格内容关联，与 单独合并 2，3，4 列不同）
 */
function mergeMultiCol(tableid, colIdx, colIdxstart) {
    //未指定开始列时默认第0列
    colIdxstart = colIdxstart || 0;
    var that;
    /**/
    var _text = function (cols) {
        return $.map(cols, function (col) {
            return $(col).text();
        }).join("**");
    };

    /* 遍历表格下所有行 */
    $(tableid + " tbody tr").each(function (row) {
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

/* ***** 跨列合并某单元格 *****
 * 跨列合并(如果结束行传0代表合并所有行)
 * @param tableid 表ID，例如#table
 * @param colId  起始列
 * @param length  需合跨行数
 * 如mergeRows('#table', 3, 2) 表示合并第 3 - 4 列同一行内容相同的单元格。
 */
function mergeRows(tableid, rowIdx, length) {
    var that;
    $(tableid + ' tr').each(function (row) {
        $('td:gt(' + colId + '):lt(' + length + ')', this).filter(':visible').each(function (col) {
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
