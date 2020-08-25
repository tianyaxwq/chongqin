const exportTableData = function (tableNode,name,time,flag,url,params){
  // console.log(tableNode);
  let offsetLeftArray = new Array();
  let cell;// 单元格Dom
  let col;// 单元格实际所在列
  let cellStr;// 每个cell以row,col,rowSpan,colSpan,value形式
  let cellStrArray = [];
  let objTab = tableNode;
  let table = {
    "name":name,
    "time":time,
    "maxcol":"",
    "data":[],
  };
  // 遍历第一次取出offsetLeft集合
  for (let i = 0; i < objTab.rows.length; i++) {
    for (let j = 0; j < objTab.rows[i].cells.length; j++) {
      cell = objTab.rows[i].cells[j];
      if (offsetLeftArray.contains(cell.offsetLeft) == -1)
        offsetLeftArray.push(cell.offsetLeft);
    }
  }

  table.maxcol = offsetLeftArray.length;
  offsetLeftArray.sort(function(x, y) { return parseInt(x) - parseInt(y); });

  // 遍历第二次生成cellStrArray
  for (let i = 0; i < objTab.rows.length; i++) {
    let rows = [];
    for (let j = 0; j < objTab.rows[i].cells.length; j++) {
      cell = objTab.rows[i].cells[j];
      col = offsetLeftArray.contains(cell.offsetLeft);
      let height =  cell.offsetHeight;
      let weight =cell.offsetWidth;
      let clsName = cell.className;
      cell.classList.remove("is-hidden");
      if(clsName.indexOf('el-table-column--selection') !== -1 || cell.innerText === '操作'){
        table.maxcol --;
        offsetLeftArray.splice(j,1)
        continue;
      }
      let col = {
        "val":cell.innerText,
        "rowspan":cell.rowSpan-1,
        "colspan":cell.colSpan-1,
        "width":weight,
        "height":height,
        "row": i ,
        "col": col,
      };
      rows.push(col);
    }
    table.data.push(rows);
  }
  let datas = table.data;
  let ex = JSON.stringify(table);

  if(datas.length >0){

    let form = document.createElement('form');
    form.style.display = 'none';
    form.target = '_blank';
    form.method = 'post';
    form.action = url;

    let input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'tableData';
    input1.value = ex;

    let input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'filename';
    input2.value = name;

    let input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'flag';
    input3.value = flag;

    let input4 = document.createElement('input');
    input4.type = 'hidden';
    input4.name = 'params';
    input4.value = JSON.stringify(params);

    document.body.appendChild(form);
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(input4);
    // console.log(form);
    form.submit();
    form.remove();
  }else{
    alert('表格暂无数据，暂不打印该表格！');
  }
};

/**
 浏览器判断
 */
let Sys = {};
let ua = navigator.userAgent.toLowerCase();
if (window.ActiveXObject)
  Sys.ie = ua.match(/msie ([\d.]+)/)[1];
else if (document.getBoxObjectFor)
  Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1];

function containsArray(array, obj) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == obj) {
      return i;
      break;
    }
  }
  return -1;
}

Array.prototype.contains = function(obj) {
  return containsArray(this, obj);
};

export  {exportTableData};
