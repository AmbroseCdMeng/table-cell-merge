# Table Cell Merge

# 表格单元格自动合并


## 合并某一列内容相同的单元格 
 * 表格合并列单元格，colIdx要合并的列序号，从0开始
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  列位置，从0开始
 
 
## 合并某 n 列内容相同的单元格（单元格内容有关联） 
 * 表格合并列单元格，colIdx：要合并的前 n 列
 * @param tableid 表ID，例如#Table_Center
 * @param colIdx  结束列位置 从 0 开始 含
 * @param colIdxstart 开始列位置 从 0 开始 含自身

## 跨列合并某单元格 
 * 跨列合并(如果结束行传0代表合并所有行)
 * @param tableid 表ID，例如#table
 * @param colIdx  结束列 从 0 开始 包含自身
 * @param colIdxstart  开始列 从 0 开始 包含自身 默认 0 
