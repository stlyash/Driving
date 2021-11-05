var ur = [];
fetch("./RainyAms.json")
    .then( function (response) {return response.json})
    .then(function (obj) {
      window.ur[1] = obj;
    })

fetch("./WinterAms.json")
.then( function (response) {return response.json})
.then(function (obj) {
  window.ur[2] = obj;
})

fetch("./SummerAms.json")
.then( function (response) {return response.json})
.then(function (obj) {
  window.ur[0] = obj;
})
/*
function preload(){
  window.ur[1] =loadJSON('RainyAms.json');
  window.ur[2] =loadJSON('WinterAms.json');
  window.ur[0] =loadJSON('SummerAms.json');
}
*/
let selectedFile;

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

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

var score = 0,amsper=0,fast_points = 0;
var tlower,tupper,acDep,acArr,smax,length=0,sp = [],secams = [],ind = 0;
var scode,s1,s2,lsec,usec,indica,totime,num,bfg,brake_f_high;
var brake_f_low,brake_p_high,brake_p_low,ptime,ftime,bfindic,indicator;
var bf_prange,bp_prange,bpg,befpmax,bp_range,bf_range,indbrake,d;
document.getElementById('button1').addEventListener("click", () => {
	score = 0;
	amsper = 0;
	fast_points = 0;
  // Dictionary containing all the ams values of all sections
  
  var stncod = [];
  var secmax = [];
  // Reading ams percentage 
  var ams_per = Number(document.getElementById('inp_ams').value)

  // Hourly analysis (Lowering ams percentage according to crowd density)
  var crad = document.getElementsByName('crowd');
  if (crad[1].checked)
    { 
      ams_per -= 5;
    }
  else if (crad[2].checked)
    {
      ams_per -= 10;
    }
    window.amsper = ams_per;

  // Reading brake power test ranges
  const bf_prange = Number(document.getElementById('inp_bfrange').value)
  const bp_prange = Number(document.getElementById('inp_bprange').value)

  XLSX.utils.json_to_sheet(data, 'out.xlsx');
  let ctrObject = {}
  if(selectedFile){
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event)=>{
      let data = event.target.result;
      let workbook = XLSX.read(data,{type:"binary"});
          
      workbook.SheetNames.forEach(sheet => {
        ctrObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
        window.tlower = (ctrObject[0].sch_dep).toString()
        window.tupper = (ctrObject[(Object.keys(ctrObject).length)-1].act_arr).toString()
        window.acDep = []
        window.acArr = []
        for (let i = 0; i < (Object.keys(ctrObject).length)- 1; i++)
        {
          var k = (ctrObject[i].stn_code).toString() + "-" + ((ctrObject)[i+1].stn_code).toString()
          stncod[i] = k;
          secmax[i] = Number(ctrObject[i+1].sec_max_speed)
          window.acDep[i] = (ctrObject[i].act_dep).toString()
          window.acArr[i] = (ctrObject[i+1].act_arr).toString()
        }
        window.smax = secmax;
        
        

        var stations = Object.keys(ctrObject).length;
        var sections = Object.keys(ctrObject).length -1;
        document.getElementById("stn").innerHTML = ("Total number of Stations in the journey: " + stations.toString());
        document.getElementById("secn").innerHTML = ("Total number of Sections in the journey: " + sections.toString());


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
        window.sp = []
        window.secams = []
        ind = 0;
        for (let i = 5; i < trObject.length; i++)
        {
          date[ind] = new Date(trObject[i].Route);
          date[ind].setHours(date[ind].getHours() + 5);
          date[ind].setMinutes(date[ind].getMinutes() + 30);
          speed[ind] = 1.852 * Number((trObject[i].__EMPTY_3).substring(0,(trObject[i].__EMPTY_3).length - 3));
          ind = ind + 1;
          window.sp[ind] = 1.852 * Number((trObject[i].__EMPTY_3).substring(0,(trObject[i].__EMPTY_3).length - 3));
        }
        
        

        let lmax = [];
        let lmin = [];
        
        var amsdic = {};
        async function getjson(){
        
          var wea = document.getElementsByName('weather');
          if (wea[1].checked)
          { 
            window.ind = 1;
          }
          else if (wea[2].checked)
          {
            window.ind = 2;
          }
          else 
          {
            window.ind = 0;
          }

          var jsdata = window.ur[window.ind];
          console.log(window.ur[0])
          console.log(Object.keys(jsdata).length)
          for (var n = 0; n < Object.keys(jsdata).length;n++)
          {
            amsdic[(jsdata[n].Var1).toString()] = Number(jsdata[n].Var2)
          }
          var ams_ach = 0;
          var ams_not_ach = 0;
          window.scode = stncod;
          // Array containing ams between stations
          var sec_ams = []
        
          for (var p = 0; p < (window.scode).length; p++)
          {
            if((window.scode)[p] in amsdic)
            {
              sec_ams[p] = amsdic[(window.scode)[p]]
              window.secams[p] = sec_ams[p]
            }
            else
            { //scam
              sec_ams[p] = 80
              window.secams[p] = 80
            }

            if (window.smax[p] > sec_ams[p])
            {
              ams_ach += 1;
            }
            else
            {
              ams_not_ach += 1;
            }
          }
          window.fast_points = 0;

          for(let sec = 0; sec < (window.acDep).length ; sec++)
          {

          window.s1 = window.acDep[sec].toString()
          window.s2 = window.acArr[sec].toString()
          ind_tlow = new Date(date[1]);
          ind_tup = new Date(date[1]); 
          ind_tlow.setHours((window.s1[0]+window.s1[1]))
          ind_tlow.setMinutes((window.s1[3]+window.s1[4]))
          ind_tlow.setSeconds((window.s1[6]+window.s1[7]))
          ind_tup.setHours((window.s2[0]+window.s2[1]))
          ind_tup.setMinutes((window.s2[3]+window.s2[4]))
          ind_tup.setSeconds((window.s2[6]+window.s2[7]))

          window.lsec = date.indexOf(ind_tlow)
          window.usec = date.indexOf(ind_tup)
          
          // finding lower data point of the section
          window.indica = 0;
          for (var lp = 0; lp < date.length; lp++)
          {
            if (window.indica == 0 && date[lp] > ind_tlow)
            {
              window.lsec = lp-1;
              window.indica = 1;
            }
            if (window.indica == 1 && date[lp] > ind_tup)
            {
              window.usec = lp+1;
              window.indica = 2;
            }
          }
          window.fast_points = 0;
          window.totime = 0;
          for (var dpts = window.lsec; dpts <= window.usec; dpts++)
          {
            window.totime += 1;
            if(window.sp[dpts] >= window.amsper * window.secams[sec] * 0.01)
            {
              window.fast_points += 1;
            }
          }
          }
          document.getElementById("fast_time").innerHTML = ("Data Points in which speed is more than "+ (window.amsper).toString() +"% of the AMS: " + (window.fast_points.toString()))
          document.getElementById("total_time").innerHTML = ("Total number of Data Points when the train was moving: " + (window.totime).toString())

          // Adding ratio of total number of Datapoints where the speed is more than threshold percentage and the total datapoints when the train is moving to the score
          window.score += (window.fast_points/window.totime);
          // Adding ratio of total sections in which the AMS is achieved and the total number of sections in the score
          window.score += (ams_ach/(ams_not_ach + ams_ach));
		  console.log(ams_ach);
          document.getElementById("sec_ach").innerHTML = (ams_ach)
          document.getElementById("sec_not_ach").innerHTML = ("Sections in whihch failed to achieve AMS: " + ams_not_ach.toString())
        }
        getjson();
        
        dl = [['Time', 'Speed']]
        tl = new Date(date[1]);
        tu = new Date(date[1]); 
        tl.setHours((window.tlower[0]+window.tlower[1]))
        tl.setMinutes((window.tlower[3]+window.tlower[4]))
        tl.setSeconds((window.tlower[6]+window.tlower[7]))
        tu.setHours((window.tupper[0]+window.tupper[1]))
        tu.setMinutes((window.tupper[3]+window.tupper[4]))
        tu.setSeconds((window.tupper[6]+window.tupper[7]))
                
        // journey speed and journey date of the train
        var jspeed = []
        var jdate = []
        var indj = 0
        for (var j = 1; j <= date.length; j++)
        {  
          if (date[j] > tl && date[j] < tu)
          {
            td = [];
            td[0] = date[j]
            td[1] = speed[j] 
            jspeed[indj] = speed[j]
            jdate[indj] = date[j]
            indj += 1;
            dl.push(td)
          }
                     
        }
        window.d = dl
        // reading maxima
        lmax[0] = 0;
        lmin[0] = 0;
        lmax[jspeed.length-1] = 0;
        lmin[jspeed.length-1] = 0;
        for (var ma = 1; ma < jspeed.length - 1; ma++)
        {
          if (jspeed[ma-1]<jspeed[ma] && jspeed[ma+1] < jspeed[ma])
          {
            
            lmax[ma] = 1;
          }
          else if (jspeed[ma-1]==jspeed[ma] && jspeed[ma+1]<jspeed[ma])
          {
            lmax[ma] = 1;
          }
          else if (jspeed[ma-1]<jspeed[ma] && jspeed[ma+1] == jspeed[ma])
          {
            lmax[ma] = 1;
          }
          else
          {
            lmax[ma] = 0;
          }
        }

        // Reading minima 
        for (var ma = 1; ma < jspeed.length - 1; ma++)
        {
          if (jspeed[ma-1]>jspeed[ma] && jspeed[ma+1] > jspeed[ma])
          {
            lmin[ma] = 1;
          }
          else if (jspeed[ma-1]==jspeed[ma] && jspeed[ma+1]>jspeed[ma])
          {
            lmin[ma] = 1;
          }
          else if (jspeed[ma-1]>jspeed[ma] && jspeed[ma+1] == jspeed[ma])
          {
            lmin[ma] = 1;
          }
          else
          {
            lmin[ma] = 0;
          }
        }

        // testing brake feel
        window.num = jspeed.length
        window.bfg = 5;
        window.brake_f_high = 0
        window.brake_f_low = 0
        window.brake_p_high = 0
        window.brake_p_low = 0
        window.ptime = new Date(date[1])
        window.ftime = new Date(date[1])
        window.bfindic = 2
        for (var l = 0; l < num; l++)
        {
          if (lmax[l]>0 && window.bfindic == 2 && jspeed[l] > 4 && jspeed[l] <25)
          {
            window.brake_f_high = jspeed[l];
            window.bfindic = 3;
          }
          if (lmin[l]>0 && window.bfindic ==3)
          {
            window.brake_f_low = jspeed[l];
            window.ftime = jdate[l];
            window.bfindic = 4;
            if (window.brake_f_high - window.brake_f_low < bfg)
            {
              window.bfindic = 2;
              window.brake_f_low = 0
              window.ftime = new Date(date[1])
              window.brake_f_high = 0
            }
          }
        }
        window.indicator = 2;

        // testing brake power test
        window.bpg = 5;
        window.befpmax = 0;
        for(var l = 0; l < num; l++)
        {
          
          if (window.indicator != 6 && jspeed[l]>25 && lmax[l]>0 && jspeed[l] < 70)
          {
            window.brake_p_high = jspeed[l];
            window.indicator = 5;
          }
          if (window.indicator == 5 && lmin[l] > 0)
          {
            window.brake_p_low = jspeed[l];
            window.ptime = jdate[l];
            window.indicator = 6;
            if (window.brake_p_high - window.brake_p_low < bpg)
            {
              window.indicator = 2;
              window.brake_p_low = 0
              window.ptime = new Date(date[1])
              window.brake_p_high = 0
            }
          }
          if (befpmax<jspeed[l])
          {
            befpmax = jspeed[l];
          }
        }

        // finding out the range of brake tests
        window.bf_range = window.brake_f_high - window.brake_f_low;
        window.bp_range = window.brake_p_high - window.brake_p_low;

        window.indbrake = 1;
        if ((window.indicator == 6 && window.ftime>=window.ptime) || window.bf_range == 0)
        {
          window.indbrake = 2;
        }

        ti = new Date(tl)
        if ((window.ptime > ti.setMinutes(ti.getMinutes() + 15)) || window.bp_range==0 || befpmax > brake_p_high)
        {
          if (window.indbrake == 2)
          {
            window.indbrake = 3;
          }
          else
          {
            window.indbrake = 4;
          }
        }


        window.bp_prange = Number(document.getElementById("inp_bprange").value)
        window.bf_prange = Number(document.getElementById("inp_bfrange").value)
        
        // Displaying Result of Brake tests
        if (window.indbrake == 3)
        {
          document.getElementById("bRemarks").innerHTML = ("Brake Feel and Brake Power tests are not done.");
        }
        else if (window.indbrake == 2)
        {   
          if (window.bp_range < window.bp_prange)
          {
            window.score += 0.2;
            document.getElementById("bRemarks").innerHTML = ("Only Brake Power test is done and it is not done in prescribed range.")
            document.getElementById("bprange").innerHTML = ("Brake Power test done in the range: " + (window.brake_p_high).toString() + " to "+ (window.brake_p_low).toString() + " KMPH.")
          }
          else
          {
            window.score += 0.5;
            document.getElementById("bRemarks").innerHTML = ("Only Brake Power test is done and it is done in prescribed range.")
            document.getElementById("bprange").innerHTML = ("Brake Power test done in the range: " + (window.brake_p_high).toString() + " to "+ (window.brake_p_low).toString() + " KMPH.")
          }
        }
        else if (window.indbrake == 4)
        {    
          if (window.bf_range < window.bf_prange)
          {
            window.score += 0.2;
            document.getElementById("bRemarks").innerHTML = ("Only Brake Feel test is done and it is not done in prescribed range.")
            document.getElementById("bfrange").innerHTML = ("Brake Feel test done in the range: " + (window.brake_f_high).toString() + " to " + (window.brake_f_low).toString() + " KMPH.")
          }
          else
          {
            window.score += 0.5;
            document.getElementById("bRemarks").innerHTML = ("Only Brake Feel test is done and it is done in prescribed range.")
            document.getElementById("bfrange").innerHTML = ("Brake Feel test done in the range: " + (window.brake_f_high).toString() + " to " + (window.brake_f_low).toString() + " KMPH.")
          }
        } 
        else
        {
          if (window.bf_range < window.bf_prange && window.bp_range < window.bp_prange)
          {
            window.score += 0.4;
            document.getElementById("bRemarks").innerHTML = ("Brake tests are not done in prescribed range.")
          }
          else if (window.bf_range < window.bf_prange)
          {
            window.score += 0.7;
            document.getElementById("bRemarks").innerHTML = ("Brake Power test done properly, but Brake Feel test is not done in prescribed range.")
          }
          else if (window.bp_range < window.bp_prange)
          {
            window.score += 0.7;
            document.getElementById("bRemarks").innerHTML = ("Brake Feel test done properly, but Brake Power test is not done in prescribed range.")
          }
          else
          {
            document.getElementById("bRemarks").innerHTML = ("Brake Feel and Brake Power tests are done in prescribed range.")
            window.score += 1;
          }

          document.getElementById("bfrange").innerHTML = ("Brake Feel test done in the range: " + (window.brake_f_high).toString() + " to "+ (window.brake_f_low).toString() + " KMPH.")
          document.getElementById("bprange").innerHTML = ("Brake Power test done in the range: " + (window.brake_p_high).toString() + " to " + (window.brake_p_low).toString() + " KMPH.")
        }      
        
          document.getElementById("score").innerHTML = ("Score is : " + (window.score).toString() + " out of 3.")

      });
    }
  }
  
 //  console.log(window.score)
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
