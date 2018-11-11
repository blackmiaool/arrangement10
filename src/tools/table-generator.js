const Url=require('url');

export default function generateTable(list,config) {
    function formatDate(time){
        return (new Date(time)).format("MM/dd");
    }
    function objectSpanMethod(tableData,{ rowIndex, columnIndex }) {
        if (columnIndex === 0) {
            if (
                rowIndex !== 0 &&
                tableData[rowIndex - 1].project ===
                    tableData[rowIndex].project
            ) {
                return {
                    rowspan: 0,
                    colspan: 0
                };
            } else {
                let cnt = 0;
                for (let i = rowIndex; i < tableData.length; i++) {
                    if (
                        tableData[i].project ===
                        tableData[rowIndex].project
                    ) {
                        cnt++;
                    }
                }
                return {
                    rowspan: cnt,
                    colspan: 1
                };
            }
        }
        return {rowspan:1,colspan:1};
    }
    const tdStyle=`padding:12px 10px;color:${config.skin.content_color};`;

    const tbody = list
        .filter(li=>li.task)
        .map((li,i) => {
            const {rowspan,colspan}=objectSpanMethod(list,{
                rowIndex:i,
                columnIndex:0
            });
            let tr = "<tr>";
            if(rowspan||colspan){
                tr += `<td style="${tdStyle}" rowspan="${rowspan}" colspan="${colspan}">${li.project}</td>`;
            }            
            tr += `<td style="${tdStyle}">${li.task}</td>`;
            tr += `<td style="${tdStyle}">${li.precondition}</td>`;
            tr += `<td style="${tdStyle}">${li.dependency}</td>`;
            tr += `<td style="${tdStyle}">${li.labour||''}</td>`;
            tr += `<td style="${tdStyle}">${li.status}</td>`;
            tr += `<td style="${tdStyle}">${formatDate(li.startTime)}</td>`;
            tr += `<td style="${tdStyle}">${formatDate(li.finishTime)}</td>`;
            tr += `<td style="${tdStyle}">${formatDate(li.actualFinishTime)}</td>`;
            tr += `<td style="${tdStyle}">${li.comment}</td>`;           
            return tr;
        })
        .join("");
    const thStyle=`background-color:${config.skin.bg_color} !important;color:${config.skin.title_color};`;
    const name=config.name.replace(/[<>&]/g,'');
    const href=location.href+`${encodeURIComponent(JSON.stringify(list,config))}`;
    function addParam(href,key,value){
    
        const url=Url.parse(href,true);
        url.query[key]=value;
        return url.format();
    }
    
    return `<table style="width:1300px;border-color:${config.skin.border_color}" cellspacing="0" class="el-table--border el-table">
        <thead>
            <tr style="">
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}width:150px;${thStyle}">            
                <a href="${href}" style="color:inherit;text-decoration:none;">项目名称</a>
                <span style="opacity:0;font-size:0px;width:0;height:0;">${name}</span>
            </th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}min-width:200px;${thStyle}">详细任务</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}min-width:100px;${thStyle}">前置条件</th>            
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}width:120px;${thStyle}">前置责任人</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}width:100px;${thStyle}">工时</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}width:110px;${thStyle}">状态</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}${thStyle}">计划开始时间</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}${thStyle}">计划完成时间</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}${thStyle}">实际完成时间</th>
            <th bgcolor="${config.skin.bg_color}" style="${tdStyle}width:300px;${thStyle}">备注</th>
            </tr>
        </thead>
        <tbody>
            ${tbody}
        </tbody>
    </table>`;
}