//------------------------------------
// app_sensor.js   ver:1.0
// @date    : 2015-04-06
//------------------------------------

var mAPP_ID='pOlE5wi8qSZ5h4ggCuChNka2KYfx8qhPrYIHR2oi';
var mJS_KEY ='O5KkQg92KTMqaDlKN6LYfIsBR5KzeCXENg4YF8j0';
var mMC_ID=4;

var mClassName='SenObject1';
var mHeight_indicate  =75;

var SensorApp = (function () {
    function SensorApp() {
    }
    SensorApp.prototype.proc_stop_prog = function ( src) {
		$('#floatingBarsG').hide( 500 );
	    var cont = $('div#id_div_indi');
		cont.css({'visibility' : 'hidden'});
    };
    SensorApp.prototype.proc_start_prog = function () {
		var wH = $(window).height();
	    $('#floatingBarsG').show();
	    var top = (wH / 2) -mHeight_indicate;
	    
		var cont = $('div#id_div_indi');
		var indi = $('div#box_indi');
		
		indi.css({"margin-top" : top+"px" });
		cont.css({"height": wH +'px' ,'visibility' : 'visible'});
    };
    SensorApp.prototype.get_zeroStr = function ( src) {
    	var ret='00';
    	ret= ret +src;
    	var iSrc= ret.length;
    	ret= ret.substr( iSrc-2 );
    	return ret;
    };
    SensorApp.prototype.get_dateStr = function ( src) {
    	var ret='';
    	if(src.length >=14){
	    	ret=src.substr( 4,2 );
	    	ret=ret + "-"+src.substr( 6,2 );
	    	ret=ret + " "+src.substr( 8,2 );
	    	ret=ret + ":"+src.substr( 10,2 );
	    	ret=ret + ":"+src.substr( 12,2 );
    	}
    	return ret;
    };
    SensorApp.prototype.get_nowDate = function () {
    	var ret='';
	 	var  dd = new Date();
	 	var sYY = new String(dd.getFullYear() );
	 	var sMM = new String(dd.getMonth()+1 );
	 	sMM= this.get_zeroStr(sMM);
	 	var sDD = new String(dd.getDate() );
	 	sDD= this.get_zeroStr(sDD);
	 	ret = sYY+ sMM + sDD + '000000';
		return ret;
    };
    
    SensorApp.prototype.get_array = function (  todos , iSen) {
    	var ret= new Array();
		for (var i = 0; i < todos.length; i++) {
			var sSnum1 = todos[i].get("snum1");
			var sSnum2 = todos[i].get("snum2");
			var sSnum3 = todos[i].get("snum3");
			var sSnum4 = todos[i].get("snum4");
			var nDate = todos[i].get("dtnum");
			sDate= new String(nDate);
			sDate = sDate.substr(8, 4 );
			if(iSen==1){
				ret[i] = [ parseInt(sDate) , sSnum1];
			}else if(iSen==2){
				ret[i] = [ parseInt(sDate) , sSnum2];
			}else if(iSen==3){
				ret[i] = [ parseInt(sDate) , sSnum3];
			}else if(iSen==4){
				ret[i] = [ parseInt(sDate) , sSnum4];
			}
// console.log ('date='+sDate + ', s1='+sSnum1 +",s2="+ sSnum2);
		}
		return ret;
    };
    SensorApp.prototype.make_chart = function ( data_1 ,data_2, data_3, data_4 ) {
	    jQuery . jqplot(
	        'jqPlot-sample',
	        [
	           data_1, data_2, data_3, data_4
	        ],
	        {
	            series: [ { label: 'Sensor-1' }, { label: 'Sensor-2' }, { label: 'Sensor-3' },{ label: 'Sensor-4' } ],
	            legend: {
	                show: true,
	                placement: 'outside',
	                location: 'ne',
	            },
	            seriesDefaults: { markerOptions: { size: 6 } }
	        }
	    ); 
    };
    SensorApp.prototype.add_table = function (  todos ) {
    	var tbl= $('#id-tbody');
    	var iCt=0;
    	for (var i = 0; i < todos.length; i++) {
			var sSnum1 = todos[i].get("snum1");
			var sSnum2 = todos[i].get("snum2");
			var sSnum3 = todos[i].get("snum3");
			var sSnum4 = todos[i].get("snum4");
			var nDate = todos[i].get("dtnum");
			var sDate = new String(nDate);
			    sDate = this.get_dateStr( sDate );
			var objTr =  $('<tr></tr>');
			tbl.append( objTr );
			var objMc    =  $('<td>'+ mMC_ID +'</td>');
			objTr.append( objMc );
			var objSnum1 =  $('<td>'+ sSnum1 +'</td>');
			objTr.append( objSnum1 );
			var objSnum2 =  $('<td>'+ sSnum2 +'</td>');
			objTr.append( objSnum2 );
			var objSnum3 =  $('<td>'+ sSnum3 +'</td>');
			objTr.append( objSnum3 );
			var objSnum4 =  $('<td>'+ sSnum4 +'</td>');
			objTr.append( objSnum4);
			var objDate =  $('<td>'+ sDate +'</td>');
			objTr.append( objDate );
			if(iCt >= 50 ){
			  return false;
			}
			iCt ++;
    	}
    };
    
    
    SensorApp.prototype.init_proc = function (  model ) {
    	var parent_app=this;
		var query = new Parse.Query( model );
		var sDate  = this.get_nowDate();
		var nBef  =parseInt(sDate);
		query.equalTo("mc_id", mMC_ID);
		query.greaterThan("dtnum",  nBef);
		query.limit(300);
		query.find({
		   success: function(todos) {
		   	   if(todos.length < 1){
		   	   	   parent_app.proc_stop_prog();
				   alert('error, Nothing data.');
		   	   }else{
				var dat1 = parent_app.get_array( todos ,1 );
				var dat2 = parent_app.get_array( todos ,2 );
				var dat3 = parent_app.get_array( todos ,3 );
				var dat4 = parent_app.get_array( todos ,4 );
				parent_app.make_chart(dat1, dat2, dat3, dat4);
				parent_app.put_data( model );
		   	   }
		   },
		   error: function(object, error) {
		   	   parent_app.proc_stop_prog();
			   alert('error');
		   }
		});
    };

    SensorApp.prototype.put_data = function (  model ) {
    	var parent_app=this;
		var query = new Parse.Query( model );
		//delete
		$('tr.cls-tr-dat1').remove();
		
		var sDate  = this.get_nowDate();
		var nBef  =parseInt(sDate);
		query.equalTo("mc_id", mMC_ID);

		query.descending("dtnum");
		query.limit(50);
		query.find({
		   success: function(todos) {
		   	   parent_app.proc_stop_prog();
		   	   if(todos.length < 1){
				   alert('error, Nothing data.');
		   	   }else{
		   	   	   parent_app.add_table(todos);
		   	   }
		   },
		   error: function(object, error) {
		   	   parent_app.proc_stop_prog();
			   alert('error');
		   }
		});
    };    
    return SensorApp;
})();


onload = function() {
    Parse.initialize(mAPP_ID, mJS_KEY);
	var TodoModel = Parse.Object.extend({
		className: mClassName
	});
 	$('#id-font-mcid').text(mMC_ID);
	var senApp = new SensorApp( );
	senApp.proc_start_prog();
 	senApp.init_proc(TodoModel);
};

