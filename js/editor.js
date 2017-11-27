
/****************

author:棒棒糖

version:1.2.1
	优化属性控制调和属性值之间的联动(2017.8.4)

version:1.2.2
	增加热点样式选项(2017.8.8)



***********/



var krpano = document.getElementById("krpanoSWFObject");
var spotname="";  //热点名字
var result_code="";   //代码结果
var update_status=true;  //场景列表更新状态
var wh_status=false; //是否显示热点宽高.默认不显示
var text_status=0;   //是否添加热点，默认不添加
var h_text="";	//热点文字内容参数
var spotstyle="";  //热点样式参数


$("input[name='spot_name']").on("change",function(){
		spotname=$(this).val();
    
    	var array=[];
    	var existed_spotnums=krpano.get("hotspot.count");
		for(var i=0;i< existed_spotnums;i++){
			array[i]=krpano.get("hotspot["+i+"].name");
			//console.log(array[i])
		}
		var status=$.inArray(spotname,array);
		//console.log(status);
		

    if(status >=0){  //编辑状态
    $(".spot_name img").css("display","block");
    var hs_text=krpano.get("hotspot["+spotname+"].text");
    console.log(hs_text);
	
    if(hs_text=="" || hs_text==null){
    	text_status=0;
    	h_text="";
    }
    else{
    	text_status=1;
    	h_text="";
    }
    

    krpano.call("looktohotspot("+spotname+",120);tween(hotspot["+spotname+"].ty,-30,0.2,default,tween(hotspot["+spotname+"].ty,0,0.2))");
    	
	//krpano.call("tween(hotspot["+spotname+"].ty,-30,0.2,default,tween(hotspot["+spotname+"].ty,0,0.2))");
	krpano.set("hotspot["+spotname+"].ondown","jscall('drag_hotspot()')");

	$("input[name='scale']").val(krpano.get("hotspot["+spotname+"].scale"));
	$("input[name='alpha']").val(krpano.get("hotspot["+spotname+"].alpha"));
	$("input[name='rotate']").val(krpano.get("hotspot["+spotname+"].rotate"));
	$("input[name='rx']").val(krpano.get("hotspot["+spotname+"].rx"));
	$("input[name='ry']").val(krpano.get("hotspot["+spotname+"].ry"));
	$("input[name='rz']").val(krpano.get("hotspot["+spotname+"].rz"));
	$("input[name='ox']").val(krpano.get("hotspot["+spotname+"].ox"));
	$("input[name='oy']").val(krpano.get("hotspot["+spotname+"].oy"));
	$("input[name='width']").val(krpano.get("hotspot["+spotname+"].width"));
	$("input[name='height']").val(krpano.get("hotspot["+spotname+"].height"));
    }
    else if(status<0 && $(this).val() !==""){   //添加新热点请求
    	var a=confirm("热点不存在，是否创建新热点");  //确认或取消
    	if(!a){   //取消
    		spotname="";
    		$("input[name='spot_name']").val("");
    	}
    	else{
    		//打开热点样式窗口
    		$("#spotstyle_window").show();
    		$("#toolbar").show();
    	}
    }
	
	
    
})

//大小滑动函数
var slider_adjust=function(event){
	var that=event.target;
	var name=event.target.name;  //获取滑块的name,对应热点的属性
	var hotspot="hotspot"+"["+spotname+"]"+"."+name;
	var value=$(that).val();  //获取滑块的值

	krpano.set(hotspot,value);

	var diff=$(that).attr("class");
	if(diff.match(/3d/i)=="3d"){
		$(that).next().next().val(value);
	}
	else{
		$(that).next().val(value);
	}


}
//属性输入框内容改变
var input_change=function(event){
	var that=event.target;
	var name=event.target.name;
	var value=$(that).val();

	var diff=$(that).attr("class");
	if(diff.match(/3d/i)=="3d"){
		$(that).prev().prev().val(value);
	}
	else{
		$(that).prev().val(value);
	}

	var hotspot="hotspot"+"["+spotname+"]"+"."+name;
	krpano.set(hotspot,value);

};

$("input[type='range']").on("input",function(event){
	slider_adjust(event);
})

$("li input[type='text']").on("input",function(event){
	input_change(event);
});

//保存按下,抬起事件
$("#save_attributes").mousedown(function(){
	$(this).css("background","#0C9A23");
});
$("#save_attributes").mouseup(function(){
	$(this).css("background","#09b725");
});

//保存按钮点击事件
$("#save_attributes").on("click",function(){
	//获取热点的属性
	var h_style=krpano.get("hotspot["+spotname+"].style");
	var h_ath=parseFloat(krpano.get("hotspot["+spotname+"].ath")).toFixed(3);
	var h_atv=parseFloat(krpano.get("hotspot["+spotname+"].atv")).toFixed(3);
	var h_scale=$("input[name='scale']").val();
	var h_alpha=$("input[name='alpha']").val();
	var h_rotate=$("input[name='rotate']").val();
	var h_rx=$("input[name='rx']").val();
	var h_ry=$("input[name='ry']").val();
	var h_rz=$("input[name='rz']").val();
	var h_ox=($("input[name='ox']").val() =="")? 0:$("input[name='ox']").val();
	var h_oy=($("input[name='oy']").val() =="")? 0:$("input[name='oy']").val();
	var h_linkedscene=krpano.get("hotspot["+spotname+"].linkedscene");

	var text_onloaded=function(arr){
		if(arr){
			if(h_text==""){
				h_text=krpano.get("hotspot["+spotname+"].text");

			}
			return `onloaded="add_all_the_time_tooltip_for_VR()" text="`+h_text+`"`
		}
		else{
			return "";
		}
	}

	if(wh_status){
		var h_width=$("input[name='width']").val();
		var h_height=$("input[name='height']").val();

		result_code=`<hotspot name="${spotname}" style="${h_style}" distorted="true" ath="${h_ath}" atv="${h_atv}" scale="${h_scale}" width="${h_width}" height="${h_height}" 
		alpha="${h_alpha}" rotate="${h_rotate}" rx="${h_rx}" ry="${h_ry}" rz="${h_rz}" ox="${h_ox}" oy="${h_oy}" ${text_onloaded(text_status)} linkedscene="${h_linkedscene}"  />`
	}
	else{
		result_code=`<hotspot name="${spotname}" style="${h_style}" distorted="true" ath="${h_ath}" atv="${h_atv}" scale="${h_scale}" alpha="${h_alpha}"
		 rotate="${h_rotate}" rx="${h_rx}" ry="${h_ry}" rz="${h_rz}" ox="${h_ox}" oy="${h_oy}" ${text_onloaded(text_status)} linkedscene="${h_linkedscene}"  />`
	}

	

	if(spotname ==""){
		alert("未修改热点，请先修改热点属性！");
	}
	else{
		$("#result").text(result_code);
		$("#result_window").show();
	}



	
});

//关闭按钮
$("#window_close").on("click",function(){
	$("#result_window").hide();
});

//编辑器开关按钮事件
$("#editor_switch").on("click",function(){

	if(update_status){
		updateSceneList();
	}

	if($("#editor_container").css("display")=="none"){
		$("#editor_container").show();
		$("#editor_container").animate({"width":"400px","opacity":"1"});
		$(this).animate({"right":"404px"});
	}
	else{
		
		$("#editor_container").animate({"width":"0px","opacity":"0.1"},function(){
			$("#editor_container").hide();
		});
		$(this).animate({"right":"4px"});
	}
	//console.log($("#editor_container").display)
	

});

//热点拖动事件
var drag_hotspot=function(){
	 var text_name="vrtooltip_"+spotname;
	krpano.call("spheretoscreen(hotspot["+spotname+"].ath,hotspot["+spotname+"].atv,hotspotcenterx,hotspotcentery)");
	krpano.call("sub(drag_adjustx, mouse.stagex, hotspotcenterx)");
	krpano.call("sub(drag_adjusty, mouse.stagey, hotspotcentery)");
	krpano.call("asyncloop(hotspot["+spotname+"].pressed,sub(dx, mouse.stagex, drag_adjustx);sub(dy, mouse.stagey, drag_adjusty);screentosphere(dx, dy, hotspot["+spotname+"].ath, hotspot["+spotname+"].atv);)");

	krpano.call("spheretoscreen(hotspot["+text_name+"].ath,hotspot["+text_name+"].atv,hotspotcenterx2,hotspotcentery2)");
	krpano.call("sub(drag_adjustx2, mouse.stagex, hotspotcenterx2)");
	krpano.call("sub(drag_adjusty2, mouse.stagey, hotspotcentery2)");
	krpano.call("asyncloop(hotspot["+spotname+"].pressed,sub(dx2, mouse.stagex, drag_adjustx2);sub(dy2, mouse.stagey, drag_adjusty2);screentosphere(dx2, dy2, hotspot["+text_name+"].ath, hotspot["+text_name+"].atv);)");


	
}
function show(){
		
	}

//添加热点按钮事件
var addhotspot=function(){

	var h = krpano.get("view.hlookat");
	var v = krpano.get("view.vlookat");

	krpano.call("addhotspot("+spotname+")");
	krpano.call("hotspot["+spotname+"].loadstyle("+spotstyle+")");
	krpano.set("hotspot["+spotname+"].edge","center");
	krpano.set("hotspot["+spotname+"].ath",h);
	krpano.set("hotspot["+spotname+"].atv",v);
	krpano.set("hotspot["+spotname+"].ondown","jscall('drag_hotspot()')");
	// krpano.set("hotspot["+spotname+"].onloaded","add_all_the_time_tooltip_for_VR()");
	// krpano.set("hotspot["+spotname+"].text","null");



	$("input[name='scale']").val(krpano.get("hotspot["+spotname+"].scale"));
	$("input[name='alpha']").val(krpano.get("hotspot["+spotname+"].alpha"));
	$("input[name='rotate']").val(krpano.get("hotspot["+spotname+"].rotate"));
	$("input[name='rx']").val(krpano.get("hotspot["+spotname+"].rx"));
	$("input[name='ry']").val(krpano.get("hotspot["+spotname+"].ry"));
	$("input[name='rz']").val(krpano.get("hotspot["+spotname+"].rz"));
	$("input[name='ox']").val(krpano.get("hotspot["+spotname+"].ox"));
	$("input[name='oy']").val(krpano.get("hotspot["+spotname+"].oy"));
	$("input[name='width']").val(krpano.get("hotspot["+spotname+"].width"));
	$("input[name='height']").val(krpano.get("hotspot["+spotname+"].height"));



	
}

//更新场景列表
var updateSceneList=function(){
	update_status=false;
	var scene_count=krpano.get("scene.count");


    
    //获取必要的信息
    var scene_name=[];
    var scene_thumb_url=[];
    for(let i=0;i <scene_count;i++){
    	scene_name[i]=krpano.get("scene["+i+"].title");
    	scene_thumb_url[i]=krpano.get("scene["+i+"].thumburl");
    	//console.log(scene_name[i]);

    }

	for(let i=0;i<scene_count;i++){
		var li_element=document.createElement('li');
		var img_element=document.createElement('img');
		var span_element=document.createElement('span');
		li_element.className=i;
		span_element.innerHTML=scene_name[i];
		img_element.src=scene_thumb_url[i];

		document.getElementById('scene').appendChild(li_element);
		$('#scene li[class='+i+']').append(img_element);
		$('#scene li[class='+i+']').append(span_element);



	}
	document.getElementById('scene').onclick=function(event){
		if(event.target.nodeName.toLowerCase()=='li'){
			var index=$(event.target).index();
			var scene_link=krpano.get("scene["+index+"].name");
			krpano.set("hotspot["+spotname+"].linkedscene",scene_link);

			if(scene_count>1){
				
				$(event.target).addClass('scene_actived').siblings().removeClass('scene_actived');
			}
			else{
				$(event.target).addClass('scene_actived');
			}
			
			
		}
		else if(event.target.nodeName.toLowerCase()=='img' || 'span'){
			var index=$(event.target).parent().index();  //父元素，li
			var scene_link=krpano.get("scene["+index+"].name");
			krpano.set("hotspot["+spotname+"].linkedscene",scene_link);

			if(scene_count>1){
				$(event.target).parent().addClass('scene_actived').siblings().removeClass('scene_actived');
			}
			else{
				$(event.target).parent().addClass('scene_actived');
			}

			
		}

	}
}
//场景列表确定，取消按钮点击事件
$("#listofscene button").on("click",function(){
	var button_id=$(this).attr("id");
	if(button_id=="scene_quit"){
		krpano.set("hotspot["+spotname+"].linkedscene","");
	}

	$("#listofscene").hide();
	$("#scene li").removeClass('scene_actived');
});

$("#toolbar .scene_hotspot").on("click",function(){
	$("#listofscene").show();
});

//文字热点窗口
$("#toolbar .add_text").on("click",function(){
	$("#text_window").show();
	krpano.call("add_all_the_time_tooltip_for_VR_JS()");

	//console.log(krpano.get("hotspot["+spotname+"].text"));
});

//文字输入框实时事件
$("#text_window .text_input").on("input",function(){
	var value=$(this).val();
	krpano.set("hotspot["+spotname+"].text",value);
	krpano.call("add_all_the_time_tooltip_for_VR_JS()");

});

//文字窗口确认，取消事件
$("#text_sure").on("click",function(){
	text_status=1;
	h_text=$("#text_window .text_input").val();
	$("#text_window").hide();
	$("#text_window .text_input").val("");

});
$("#text_quit").on("click",function(){
	var remove_name="vrtooltip_"+spotname;
	text_status=0;
	$("#text_window").hide();
	$("#text_window .text_input").val("");
	krpano.set("hotspot["+spotname+"].text","");
	krpano.call("removehotspot("+remove_name+")");
});

//宽度和高度的复选框
$("input[type='checkbox']").on("click",function(){
	if($(this)[0].checked){
		wh_status=true;
		$("#scale").hide();
		$("#w_h").show();
	}
	else{
		wh_status=false;
		$("#scale").show();
		$("#w_h").hide();
	}
});

//gear's actions
$('.spot_name img').on("click",function(){
	if($("#toolbar").css("display")=="block"){
		$("#toolbar").hide();
	}
	else if($("#toolbar").css("display")=="none"){
		$("#toolbar").show();
	}
	
});

/***热点样式选择窗口函数****/
//标签切换事件
$(".textbar span").on("click",function(){
	$(this).css("background","#f1971b");
	$(this).siblings().css("background","#E6E7E7");
});

//热点标签点击事件
$(".style_container li img").on("click",function(){
	spotstyle=$(this).attr('class');
	$(this).parent().css({
		"background":"#7B7878",
		"box-shadow":"0 0 16px 4px #7B7878"
	});
	$(this).parent().siblings().css({
		"background":"rgba(126, 122, 118, 0.3)",
		"box-shadow":""
	});
});
//自定义样式输入框事件
$("#custom_style").on("change",function(){
	spotstyle=$(this).val();
	
});
//热点窗口确认，取消事件
$("#style_sure").on("click",function(){
	if(spotstyle==null ||spotstyle==""){
		alert("请先选定热点样式！");
	}
	addhotspot();
	$(".style_container li").css({
		"box-shadow":"",
		"background":"rgba(126, 122, 118, 0.3)"
	});
	$("#spotstyle_window").hide(0,function(){
		spotstyle="";
		$("#custom_style").val("");
	});
});

$("#style_quit").on("click",function(){
	$("#spotstyle_window").hide();
	spotname="";
	spotstyle="";
	$("input[name='spot_name']").val("");
	$(".style_container li").css({
		"box-shadow":"",
		"background":"rgba(126, 122, 118, 0.3)"
	});
});
//系统样式和自定义便签样式点击事件
$(".textbar span").on("click",function(){
	var thatclass=$(this).attr('class');
	if(thatclass=='system_spot'){
		$(".custom_style").hide();
		$(".style_container").show();
	}
	else if(thatclass=='custom_spot'){
		$(".custom_style").show();
		$(".style_container").hide();
	}
});

//复制代码
var clipkboard = new Clipboard(".copy");

clipkboard.on('success',function(e){
	console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
});






