let selectedFile;

document.getElementById('input1').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

document.getElementById('input2').addEventListener("change", (event) => {
    selectedFile1 = event.target.files[0];
})

let data=[{
    "name":"yash",
    "data":"scd",
    "abc":"sdef"
}]


document.getElementById('button1').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});

         workbook.SheetNames.forEach(sheet => {
              let ctrObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              window.tlower = (ctrObject[0].sch_dep).toString()
              window.tupper = (ctrObject[(ctrObject.length)-1].act_arr).toString()
         });
        }
    }

    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile1){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile1);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});

         workbook.SheetNames.forEach(sheet => {
              let trObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              let date = []
              let speed = []
              ind = 0;
              for (let i = 5; i < trObject.length; i++)
              {
                date[ind] = new Date(trObject[i].Route);
                date[ind].setHours(date[ind].getHours() + 5);
                date[ind].setMinutes(date[ind].getMinutes() + 30);
                speed[ind] = Number((trObject[i].__EMPTY_3).substring(0,(trObject[i].__EMPTY_3).length - 3));
                ind = ind + 1;
              }
              dl = [['Time', 'Speed']]
                     tl = new Date(date[1]);
                     tu = new Date(date[1]); 
                     tl.setHours((window.tlower[0]+window.tlower[1]))
                     tl.setMinutes((window.tlower[3]+window.tlower[4]))
                     tl.setSeconds((window.tlower[6]+window.tlower[7]))
                     tu.setHours((window.tupper[0]+window.tupper[1]))
                     tu.setMinutes((window.tupper[3]+window.tupper[4]))
                     tu.setSeconds((window.tupper[6]+window.tupper[7]))

                for (var j = 1; j <= date.length; j++)
                 {  

                     if (date[j] > tl && date[j] < tu)
                     {
                        td = [];
                        td[0] = date[j]
                        td[1] = speed[j] * 1.852
                        dl.push(td)
                     }
                     
                 }
            window.d = dl

         });
        }
    }

      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(window.d);
        var options = {
          title: 'Speed - Time Chart',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }


});
