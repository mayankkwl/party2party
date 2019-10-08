/**
 *
 */
if (typeof PARTYTWOPARTY == "undefined" || !PARTYTWOPARTY) {
    /**
     * The PARTYTWOPARTY global namespace object. If PARTYTWOPARTY is already defined,
     * the existing PARTYTWOPARTY object will not be overwritten so that defined
     * PARTYTWOPARTY are preserved.
     *
     * @class PARTYTWOPARTY
     * @static
     */
    var PARTYTWOPARTY = {};
}

PARTYTWOPARTY.Global = function() {
	var MIN_RANGE = 0;
	var MAX_RANGE = 500;
	var isPartyAdded = false;
	var isRelationAdded = false;
	var GRAPH_JSON = {};
	//var deletePartyRow = "";
	loadGroupandParty = function (){
		var fa_user = $.parseJSON(sessionStorage.getItem("fa_user"));
		if(fa_user == null) {
			window.location.href='index.html';
			return;
		}
		if(fa_user && fa_user.relation == 'family') {
			$(".nonefamilier").addClass("_nonefamilier");
		}
		$.getJSON( "json/"+fa_user.url, function( data ) {
			PARTYJSON = data;
			var partyHtml = "";
			var groupHtml = "";
			var defaultPin = "";
			for(var i = 0; i< PARTYJSON.party.length; i++){
				if(i==0) defaultPin = "default-pin"; else defaultPin = "";				
				var _w = (PARTYJSON.party[i].worth > 0) ? PARTYJSON.party[i].worth + " MM" : "";
				partyHtml += '<li id="partylist__'+PARTYJSON.party[i].id+'" data-details="'+PARTYJSON.party[i].details+'" class="partygraph lg '+defaultPin+'" data-name="'+PARTYJSON.party[i].url+'"> <img src="'+PARTYJSON.party[i].imgPath+'" alt="'+PARTYJSON.party[i].name+'" /> <span class="name expand_view">'+PARTYJSON.party[i].name+'</span> <span class="act expand_view">'+_w+ " " +PARTYJSON.party[i].account+'</span> </li>'
			}
			for(var i = 0; i< PARTYJSON.group.length; i++){
				if(i==0) defaultPin = "default-pin"; else defaultPin = "";
				groupHtml += '<li id="grouplist__'+PARTYJSON.group[i].id+'" class="groupgraph lg '+defaultPin+'" data-name="'+PARTYJSON.group[i].url+'"> <div class="groupcircle">'+PARTYJSON.group[i].groupName+'</div> <span class="name expand_view">'+PARTYJSON.group[i].name+'</span> <span class="act expand_view">'+PARTYJSON.group[i].worth+ " MM " +PARTYJSON.group[i].account+'</span> </li>'
			}
			$("#parties ul").html(partyHtml);
			$("#group ul").html(groupHtml);
			setTimeout(function(){
				$(".lg").on("click", function(){
					var that = $(this);
					that.parent().find(".active").removeClass("active");
					$(this).addClass("active");
					if($(this).hasClass("groupgraph")){
						$("#grptitle").text($(this).find(".name").text());
						$("#grptitle").parent().find(".crumb").remove();
						$("#grptitle").parent().append('<a href="javascript:;" class="crumb">Chris Smith</a>');
					}else{
						$("#grptitle").parent().find(".crumb").remove();
						$("#grptitle").text($(this).find(".name").text());
					}
					/*
					$(".icon-profileDetail").show();
					$(".icon-profileDetail").animate({
						right: 0
					}, 300, function() {});
					*/
					$("#legends").show();
					activeNodeContainer={sourceNode:{},data:[]};
					loadGraph($(this).attr("data-name"));
					$(".listviewparty").hide();
					$(".listviewparty").animate({opacity: 0}, 1000, function() {});
					$(".switchview").find("button").removeClass("button-primary");
					$(".switchview button").first().addClass("button-primary");
					if((that).attr("data-details") != undefined){
						updateDetailPanel((that).attr("data-details"))
					}
					if($(".viewTitle").text()=="Party View"){
						setTimeout(function(){
							$(".switchview").show();
						}, 100);
					}
					
				});
				try{
					if(!getParamStr()) $("#grouplist__1").click();					
					//$("#grouplist__1").addClass("");
				}catch(e){
					//console.log(e)
				}
				//$(".icon-profileDetail").click();
				//$(".partyContainer").show()
			}, 100);
		});
	};
	
	togglePane = function () {
        $(".togglePane").click(function() {
            var that = $(this);
            if ($(this).attr("data-view") == "collapse") {
							
                $(".left-pane").animate({
                    width: "215px"
                }, 100, function() {
					reinitheight();
                    $(that).attr("data-view", "expand");
                    $(".collapsed_view").hide();
                    $(".expand_view").show();
                    $(".downslide").css("bottom", "54px");
					$(".right-pane").width($(document).width()-($(".left-pane").width()));
                });				
            } else {
                $(".expand_view").hide();
                $(".collapsed_view").show();
                $(".downslide").css("bottom", "0px");
				reinitheight("a");
                $(".left-pane").animate({
                    width: "95"
                }, 100, function() {
                    $(that).attr("data-view", "collapse");
					$(".right-pane").width($(document).width()-($(".left-pane").width()));
					
                });
            }
        });
    };
	switchTabs = function () {
        $(".tabs li").click(function() {
        	activeNodeContainer={sourceNode:{},data:[]}
            setTimeout(function() {
				$(".slide").show();
            }, 100);
			$("#legends").hide();
			$(".switchview").hide();
			$(".crumb").remove();
			/*
			$(".icon-profileDetail").hide();
			$(".icon-profileDetail").animate({
						right: -200
			}, 300, function() {});
			*/
            $(".tabs li").removeClass("active");
			$(".graphContainer").html("");
			$("#grptitle").html("");
			/*
			if($(".icon-profileDetail").hasClass("isOpen")){
				$(".icon-profileDetail").click();
			}
			*/
			$(".userList li").removeClass("active");
            if ($(this).attr("data-type") == "group") {
                $(this).addClass("active");
                $("#parties").hide();
                $("#group").show();
				$(".userDetailParty").hide();
				$(".userDetailGroup").show();
				$(".toggelbar").hide();
				$(".feeds").hide();
				$(".toggelbar").css("left", -580);
				$("#nav-icon1").removeClass("open");
				$(".viewTitle").text("Group View");
				$(".listviewparty").hide();
				$("#grouplist__1").click();
            } else {
                $(this).addClass("active")
                $("#parties").show();
                $("#group").hide();
				$(".userDetailParty").show();
				$(".userDetailGroup").hide();
				$(".toggelbar").show();
				$(".viewTitle").text("Party View");
				$(".switchview").find("button").removeClass("button-primary");
				$(".switchview button").first().addClass("button-primary");
				$("#partylist__1").click();
            }
        });
    };	
	addparty = function(){
			if(isPartyAdded) {
				$(".md-close").click();
				return false;
			}
			
			if($.trim($("#faparty").val()).length==0){
				$("#addpartylayer .error").text("Please enter party name !!!")
				return false;
			}
			gTable.destroy();
			var _html ='<tr><td><a href="javascript:;">Jason Ericson</a></td><td>Client</td><td><input class="checkbox" checked type="checkbox" value="10" data-account="2"></td><td>10MM</td><td><a class="edit" href="javascript:;"><i></i></a> <a data-worth="10" data-account="2" class="delete deletelay"  href="javascript:;"><i></i></a></td></tr>';
			$("#grpParties tbody").append(_html);
			//re creating datatable;
			datatableForGrp();
			
			
			var _w = parseInt($("#groupworth").text());
			$("#groupworth").html((_w + 10) + " MM");
			
			$("#groupaccount").html(parseInt($("#groupaccount").text())+2);
			$("#groupparties").html(parseInt($("#groupparties").text())+1);
			
			$(".checkbox").unbind("change");
			$(".checkbox").on("change", function() {
				calculateWorth(this);
			});
			
			$(".deletelay").click(function(){
				deletePartyRow = this;
				$("#deletepname").html("Jason Ericson");
				$("#deletepartylayer").click();
			});
			$(".md-overlay").click();
			$("#faparty").val("");
			loadGraph("updated-smith-group.json");
			isPartyAdded = true;
			activeNodeContainer={sourceNode:{},data:[]};
	}
	
	deletePartyFromGroup = function(){
		$("#groupparties").html(parseInt($("#groupparties").text())-1);
		
		if($(deletePartyRow).parent().parent().find(".checkbox").is(":checked")){
			if($(deletePartyRow).attr("data-worth")){
			var _w = parseInt($("#groupworth").text());
			$("#groupworth").html( _w - parseInt($(deletePartyRow).attr("data-worth")) + " MM");
			}
			if($(deletePartyRow).attr("data-account")){
				var _a = parseInt($("#groupaccount").text());
				$("#groupaccount").html(_a - parseInt($(deletePartyRow).attr("data-account")));
			}
		}
		
		//Destroying Data Table for Group
		gTable.destroy();
		$(deletePartyRow).parent().parent().remove();
		$(".modalWindow").hide();
		//Recreating Data Table for Group
		datatableForGrp();
		
		loadGraph("smith-group.json");
		isPartyAdded = false;
		activeNodeContainer={sourceNode:{},data:[]};
	}
	
	calculateWorth = function(t){
		var that = t;
		var _w = parseInt($("#groupworth").text());
		var _a = parseInt($("#groupaccount").text());
		
		if(that.checked) {			
			$("#groupaccount").html(_a + parseInt($(that).attr("data-account")));
			$("#groupworth").html(_w + parseInt($(that).val()) + " MM");
		}else{
			$("#groupaccount").html(_a - parseInt($(that).attr("data-account")));		
			$("#groupworth").html(_w - parseInt($(that).val()) + " MM");
		}
		
	}
	//Manage Relations
	manageRelations = function(){
		if(isRelationAdded) {
			$(".md-close").click();
			return false;
		}
		if($.trim($("#farelation").val()).length==0){
			$(".manageRlation .error").text("Please enter party name !!!")
			return false;
		}
		if($.trim($("#relation").val()).length==0){
			$(".manageRlation .error").text("Please enter relation !!!")
			return false;
		}
		var currentremovingele;
		$("#totalRetions").text(parseInt($("#totalRetions").text())+1);
		//DOM update of Paul on overlay
		var html = '<tr><td>Paul Buckler</td><td>Lawyer</td><td class="pos"><a class="delete removerelation" href="javascript:;"><i></i></a><div class="remove">Disassociate</div></td></tr>';
		$(".manageRlation table tbody").append(html);
		
		//DOM update of Paul on list view
		var listhtml = '<tr><td><a href="javascript:;">Paul Buckler</a></td><td>Contact</td><td></td><td></td><td></td><td>1</td></tr>';
		$(".listview tbody").append(listhtml);
		loadGraph("updated-doe-party.json");
		$(".switchview").find("button").removeClass("button-primary");
		$(".switchview button").first().addClass("button-primary")
		$(".listviewparty").css({
			opacity:0,
			display:'none'
		});
		
		$(".manageRlation .error").text("")
		isRelationAdded = true;
		$('.removerelation').click(function(event){
			event.stopPropagation();
			currentremovingele = $(this);
			$(this).parent().find(".remove").show();
			$(this).parent().find(".remove").animate({
				 width: 85,
				 queue: false
			}, 300, function() {});
		});
		$('.relationtable .remove').click(function(event){
			event.stopPropagation();
			$(currentremovingele).parent().parent().remove();
			$(".listview tbody tr:last-child").remove();
			$("#totalRetions").text(parseInt($("#totalRetions").text())-1);
			$(".switchview").find("button").removeClass("button-primary");
			$(".switchview button").first().addClass("button-primary")
			$(".listviewparty").css({
				opacity:0,
				display:'none'
			});
			loadGraph("doe-party.json");
			isRelationAdded = false;
		});
	}
	
	datatableForGrp = function(){
		gTable = $('#grpParties').DataTable({
			"paging":   false,
			"info":     false,
			"searching": true,
			"order": [[ 1, "asc" ]],
			"columnDefs": [ {
			  "targets": [ 2, 4 ],
			  "orderable": false
			} ]
		});
		//$('#grpPartiesTextField').unbind("keyup");
		$('#grpPartiesTextField').keyup(function(){
			  gTable.search($(this).val()).draw() ;
		});
	}
	
	reinitheight = function(a) {		
	   var _h = ($(window).height() > 820) ? $(window).height() : 820;
		if(a){
			$(".userListp").height(_h-113);
		}else{
			$(".userListp").height(_h-170);
		}
	   
	   $(".rpane").height(_h-136);
	   $(".rpane").height(_h-136);
	   $(".grptable").height($(".rpane").height()-360); 
	}
	
	/*
		User Detail panel
	*/
	updateDetailPanel = function(url){	
		$.getJSON("json/"+url , function( data ) {
			$("#p_img").attr("src", "images/"+data.img);
			$("#p_name").html(data.name);
			$("#p_designation").html(data.designation);
			$("#p_address").html(data.address);
			$("#p_tel").html(data.tel);
			$("#p_taxid").html(data.taxid);
			$("#p_clientType").html(data.clientType);
			$("#p_rm").html(data.rm);
			$("#p_netVal").html(data.netVal);
			$("#p_totalAccounts").html(data.totalAccounts);
			$("#totalRetions").html(data.totalRetions);			
			try{
				pTable.destroy();
			}catch(e){
				//console.log("p table is not defined");
			}
			$("#tblpartydetail tbody").html("");
			var _html = "";
			/*
				//TODO
				have to do a better way for this.
			*/
			$(data.account).each(function(index){				
				if(data.account[index].beneficiaryDialouge !="undefined"){
					var c_name = "";
					if(data.account[index].beneficiaryDialouge && data.account[index].beneficiaryDialouge.length){
						 c_name = (data.account[index].beneficiaryDialouge.length<3) ? "elpview" : "";
					}
					submenu = '<ul id="elpview'+index+'" class="'+c_name+'">'
					$(data.account[index].beneficiaryDialouge).each(function(innerIndex){
						if(innerIndex==0)
							submenu += '<li><div class="arrow-left"></div>'+data.account[index].beneficiaryDialouge[innerIndex]+'</li>';
						else
							submenu += '<li>'+data.account[index].beneficiaryDialouge[innerIndex]+'</li>';
					});
					submenu += '</ul>';
				}
				_html += '<tr><td>'+data.account[index].a_no+'</td><td>'+data.account[index].a_type+'</td><td class="truncate"><a id="elp'+index+'" href="javascript:;">'+data.account[index].beneficiary+'</a>'+submenu+'</td><td>'+data.account[index].netval+'</td><td><a class="edit" href="javascript:;"><i></i></a> <a class="delete"  href="javascript:;"><i></i></a></td></tr>';
				//submenu = "";
			});
			$("#tblpartydetail tbody").append(_html);
			
			
			//Party Account table Sorting			
			pTable = $('#tblpartydetail').DataTable({
				"paging":   false,
				"info":     false,
				"searching": true,
				"order": [[ 3, "desc" ]],
				"columnDefs": [ {
				  "targets": [ 4 ],
				  "orderable": false
				} ]
			});
			$('#grpAccountTextField').keyup(function(){
				  pTable.search($(this).val()).draw() ;
			});
		})
	}

	getParamStr = function(){
		var prmstr = window.location.search.substr(1);
		if(prmstr){
			return true;
		}else return false;		
	}
	/* --- Carousal code --  */
    init = function() {
         loadGroupandParty();
		 togglePane();
		 switchTabs();
		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 500,
			values: [0, 500],
			slide: function(event, ui) {
				//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				PARTYTWOPARTY.Global.MIN_RANGE = ui.values[0];
				PARTYTWOPARTY.Global.MAX_RANGE = ui.values[1];
				$("#_min").html(ui.values[0] + " MM");
				$("#_max").html(ui.values[1] + " MM");
			}
		});
		setTimeout(function() {
			$("#slider-range span:nth-child(2)").html("<div class='rbox' id='_min'>0 MM</div><i></i><div class='txt'>MIN</div>");
			$("#slider-range span:nth-child(3)").html("<div class='rbox' id='_max'>500 MM</div><i></i><div class='txt'>MAX</div>");
		}, 100);
		$(".search_btn").click(function() {
			$(".searchForm").slideToggle("slow");
			$(".search_btn i").toggleClass("downArrow");
		});
		/* --- Fancy dropdown code --  */
		$('#partyType').fancySelect({
			forceiOS: true
		});
		$('#search').fancySelect({
			forceiOS: true
		});
		/* --- Fancy dropdown code --  */
		
		$('#nav-icon1').click(function(){
			$(this).toggleClass('open');
			if($(this).hasClass('open')){
				$(".feeds").show();
				$(".feeds").animate({
				   left: -850
				}, { duration: 300, queue: false });
				$(".toggelbar").animate({
				   left: -860,
				}, { duration: 300, queue: false });
			}else{
				$(".feeds").animate({
                     left: -570,
					 queue: false
                }, 300, function() {$(".feeds").hide();});
				$(".toggelbar").animate({
				   left:-580
				}, { duration: 300, queue: false });
			}
		});
		$(".icon-profileDetail").click(function(){
			$(this).toggleClass('isOpen');			
			if($(this).hasClass('isOpen')){			
				$(".partyContainer").show();				
				$(".partyContainer").animate({
					right:2
                }, 300, function() {
					
				});
			}else{
				$(".partyContainer").animate({
					right:-600
                }, 300, function() {$(".partyContainer").hide();});
			}
			//
		});
		
		$(".checkbox").on("change", function() {
			calculateWorth(this);
		});
		
		$("#existingpartytogroup").click(addparty);
		$(".right-pane").width($(document).width()-($(".left-pane").width()+2));
		$("#deletingingpartytogroup").click(function(){
			deletePartyFromGroup();
			$(".md-overlay").click();
		});
		
		//Clearing search and reloading data.
		$('#txtsearch').bind('keyup', function(e) {
			if($(this).val().length==0 && $("#group ul li").length==1){
				loadGroupandParty();
			}else if($(this).val().length==0 && $("#parties ul li").length==1){
				loadGroupandParty();
			}
		});
		
		//Toggle between List and Pary view
		$(".switchview button").click(function(){
			$(this).parent().find("button").removeClass("button-primary");
			if($(this).attr("data-type")=="graph"){
				//$(this).removeClass("button-primary");
				$(this).addClass("button-primary");
				$(".graphContainer").show();
				$(".graphContainer").animate({opacity: 1}, 1000, function() {});
				$(".listviewparty").hide();
				$(".listviewparty").animate({opacity: 0}, 1000, function() {});
				$("#legends").show();
			}else{
				//$(this).removeClass("button-primary");
				$(this).addClass("button-primary");
				$(".listviewparty").show();
				$(".listviewparty").animate({opacity: 1}, 1000, function() {});
				$(".graphContainer").hide();
				$(".graphContainer").animate({opacity: 0}, 1000, function() {});
				$("#legends").hide();
			}
		});
		
		//Code to swtich group and party panel and load Nita's graph
		$(".grpparties").click(function(){
			$( ".tabs li:nth-child(2)").click().addClass("active");
			setTimeout(function(){
				$("#partylist__9").click();
			}, 200);
		});
		
		//Code for Manage relation
		$("#relations").click(manageRelations);
		
		//Toggeling Logout Menu
		$(".dd").click(function(){			
			if($(".ddl").hasClass("open")){
				$(".ddl").animate({
					height: 0
				}, 300, function() {$(".ddl").hide()});
			}else{
				$(".ddl").show()
				$(".ddl").animate({
					height: 70
				}, 300, function() {});	
			}
			$(".ddl").toggleClass("open");
		});
		
		//Logout Code
		$(".logout").click(function(){
			sessionStorage.removeItem("fa_user");
			setTimeout(function(){
				window.location.href = "index.html"
			}, 100);
		});
		
		//Group Party table Sorting
		datatableForGrp();
		
		//Breadcrumb click
		$("#grptitle").click(function(){
			nodeclicked(PARTYTWOPARTY.Global.GRAPH_JSON.nodes[0])
			if($(this).text()=="Jane Doe")
				updateDetailPanel("jane_doe.json");
			else if($(this).text()=="Nita Smith")
				updateDetailPanel("nita_smith.json");
			else updateDetailPanel("john_doe.json");
		});
    }
    return {
        init: init,
		MIN_RANGE : MIN_RANGE,
		MAX_RANGE : MAX_RANGE,
		reinitheight : reinitheight,
		updateDetailPanel : updateDetailPanel,
		GRAPH_JSON:GRAPH_JSON,
		getParamStr : getParamStr
    };
}();
$(document).ready(function() {
	PARTYTWOPARTY.Global.reinitheight();
	//var prmstr = window.location.search.substr(1);
	if(PARTYTWOPARTY.Global.getParamStr()){
		var file = localStorage.getItem("filename");
		if(file){
			/*
			$(".icon-profileDetail").show();
			$(".icon-profileDetail").animate({
				right: 0
			}, 300, function() {});
			*/
			$("#grptitle").text("MSO ID - Corps");
			$("#grptitle").parent().append('<a href="javascript:;" class="crumb">Sandra Smith</a>');
			$("#legends").show();
			
			gTable.destroy();
			var _html ='<tr><td><a href="javascript:;">Sandra Smith</a></td><td>Client</td><td><input class="checkbox" checked type="checkbox" value="2" data-account="1" /></td><td>2MM</td><td><a class="edit" href="javascript:;"><i></i></a> <a data-worth="2" data-account="1" class="delete deletelay"  href="javascript:;"><i></i></a> </td></tr>';
			$("#grpParties tbody").append(_html);
			//re creating datatable;
			setTimeout(function(){
				datatableForGrp();
			}, 100);
			
			$(".checkbox").unbind("change");
			$(".checkbox").on("change", function() {
				calculateWorth(this);
			});
			
			$(".deletelay").click(function(){
				deletePartyRow = this;
				$("#deletepname").html("Sandra Smith");
				$("#deletepartylayer").click();
			});
			
			var _w = parseInt($("#groupworth").text());
			$("#groupworth").html((_w + 2) + " MM");
			
			
			$("#groupaccount").html(parseInt($("#groupaccount").text())+1);
			$("#groupparties").html(parseInt($("#groupparties").text())+1);
			loadGraph(file);
			localStorage.removeItem("filename");
		}else{
			loadGraph("smith-group.json");
			$("#legends").show();
		}
	}
});
(function() {
	PARTYTWOPARTY.Global.init();
    $(window).scroll(function() {
    });

    $(window).resize(function() {
		//$(".right-pane").width($(document).width()-($(".left-pane").width()+2));
    });
})();