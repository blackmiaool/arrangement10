export default function generateTable(list) {
    const tbody = list
        .map((li) => {
            let tr = "<tr>";
            tr += `<td>${li.project}</td>`;
            tr += `<td>${li.task}</td>`;
            tr += `<td>${li.precondition}</td>`;
            tr += `<td>${li.dependency}</td>`;
            tr += `<td>${li.labour||''}</td>`;
            tr += `<td>${li.status}</td>`;
            tr += `<td>${li.startTime}</td>`;
            tr += `<td>${li.finishTime}</td>`;
            tr += `<td>${li.actualFinishTime}</td>`;
            tr += `<td>${li.comment}</td>`;           
            return tr;
        })
        .join("");
    return `<table style="width:1300px;">
        <thead class="has-gutter">
            <th style="width:150px;">项目名称</th>
            <th style="min-width:200px">详细任务</th>
            <th style="min-width:100px">前置条件</th>            
            <th style="width:120px">前置责任人</th>
            <th style="width:100px;">工时</th>
            <th style="width:110px;">状态</th>
            <th>计划开始时间</th>
            <th>计划完成时间</th>
            <th>实际完成时间</th>
            <th style="width:300px">备注</th>
        </thead>
        <tbody>
            ${tbody}
        </tbody>
    </table>`;
}