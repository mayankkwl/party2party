(function(){
	var allTags = [
      "John Doe", "Jane Doe", "James Doe", "Shane Doe", "Alex Sun", "Dan Joe", "Jack Lee", "Chris Smith", "Nita Smith", "Andrew Smith", "James Smith", "Dan Smith", "Isha Smith", "Paul Buckler", "Smith Group", "Gates Foundation", "Apple", "Microsoft", "Pepsico", "BP", "Clark Group", "DLJ Group", "Tanscon Group",  "Track Group"
    ];
	
	var partyTags = ["John Doe", "Jane Doe", "James Doe", "Shane Doe", "Alex Sun", "Dan Joe", "Jack Lee", "Chris Smith", "Nita Smith", "Andrew Smith", "James Smith", "Dan Smith", "Isha Smith", "Paul Buckler"];
	
	var groupTags = ["Smith Group", "Gates Foundation", "Apple", "Microsoft", "Pepsico", "BP", "Clark Group", "DLJ Group", "Tanscon Group",  "Track Group"];
	
	var partyPopTags = [
		{
			value: "John Doe",
			label: "John Doe",
			desc: "TaxId: 12345678, Net Value: 8MM",
			netval : 0,
			totalaccount : 0
		 },
		 {
			value: "Jane Doe",
			label: "Jane Doe",
			desc: "TaxId: 32456421, Net Value: 3MM",
			netval : 0,
			totalaccount : 0
		 },
		 {
			value: "Shane Doe",
			label: "Shane Doe",
			desc: "TaxId: 47398857",
			netval : 0,
			totalaccount : 0
		 },
		 {
			value: "Dan Joe",
			label: "Dan Joe",
			desc: "TaxId: 23892098",
			netval : 0,
			totalaccount : 0
		 },
		 {
			value: "Jack Lee",
			label: "Jack Lee",
			desc: "TaxId: 36476272",
			netval : 0,
			totalaccount : 0
		 },
		 {
			value: "James Doe",
			label: "James Doe",
			desc: "TaxId: 28694856",
			netval : 0,
			totalaccount : 0
		 },{
			value: "Jason Ericson",
			label: "Jason Ericson",
			desc: "TaxId: 78346923, Net Value: 10MM",
			netval : 10,
			totalaccount : 2
		 },{
			value: "Paul Buckler",
			label: "Paul Buckler",
			desc: "TaxId: 12345678",
			netval : 0,
			totalaccount : 0
		 },
	];
	
    $( "#txtsearch" ).autocomplete({
      source: allTags
    });	
	
	$( "#farelation" ).autocomplete({
      minLength: 0,
      source: partyPopTags,
      focus: function( event, ui ) {
        $( "#farelation" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
		 $( "#farelation" ).val( ui.item.label );		
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a class='autoc'>" + item.label + "<br><span>" + item.desc + "</span></a>" )
        .appendTo( ul );
    };
	
	$( "#faparty" ).autocomplete({
      minLength: 0,
      source: partyPopTags,
      focus: function( event, ui ) {
        $( "#faparty" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
		//$("#faparty" ).val( ui.item.label );
		//$("#faparty-id" ).val( ui.item.value );
		// $("#faparty-description" ).html( ui.item.desc);
		
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a class='autoc'>" + item.label + "<br><span>" + item.desc + "</span></a>" )
        .appendTo( ul );
    };
	
	
	
	$( "#txtsearch").autocomplete({
	  select: function( event, ui ) {
			var partyHtml = "";
			var groupHtml = "";
			var searchTxt = ui.item.value;
			var type = $(".tabs").find(".active").text();
			if(type == "PARTY"){
				$("#parties ul").html("");				
				for(var i = 0; i< PARTYJSON.party.length; i++){
					if(PARTYJSON.party[i].name.indexOf(searchTxt) != -1){
						partyHtml += '<li data-name="'+PARTYJSON.party[i].url+'"> <img src="'+PARTYJSON.party[i].imgPath+'" alt="'+PARTYJSON.party[i].name+'" /> <span class="name expand_view">'+PARTYJSON.party[i].name+'</span> <span class="act expand_view">'+PARTYJSON.party[i].worth+ " MM " +PARTYJSON.party[i].account+'</span> </li>'
					}
				}
				setTimeout(function(){
					$(".slide").hide();
					$("#parties ul").html(partyHtml);
				}, 100);
				
			}else{
				$("#group ul").html("");
				for(var i = 0; i< PARTYJSON.group.length; i++){
					if(PARTYJSON.group[i].name.indexOf(searchTxt) != -1){
						groupHtml += '<li class="groupgraph" data-name="'+PARTYJSON.group[i].url+'"> <div class="groupcircle">'+PARTYJSON.group[i].groupName+'</div> <span class="name expand_view">'+PARTYJSON.group[i].name+'</span> <span class="act expand_view">'+PARTYJSON.group[i].worth+ " MM " +PARTYJSON.group[i].account+'</span> </li>'
					}
				}
				setTimeout(function(){
					$(".slide").hide();
					$("#group ul").html(groupHtml);					
					$(".groupgraph").on("click", function(){
						var that = $(this);
						that.parent().find(".active").removeClass("active");
						$(this).addClass("active");
						$("#grptitle").text($(this).find(".name").text());
						$(".icon-profileDetail").show();
						$(".icon-profileDetail").animate({
							right: 0
						}, 300, function() {});	
						$("#legends").show();
						loadGraph($(this).attr("data-name"));
						if($(".viewTitle").text()=="Party View"){
							setTimeout(function(){
								$(".switchview").show();
							}, 100);
						}
					});
					
					
					
					
				}, 100);
				
			}
	  }
	});
	
	$( "#partyName" ).autocomplete({
      source: partyTags
    });
	
	$( "#groupName" ).autocomplete({
      source: groupTags
    });
	
	$("#advSearch").click(function(){
		var searchTxt = $("#partyName").val();
		//console.log($("#groupName").val());
		//console.log(PARTYTWOPARTY.Global.MIN_RANGE, PARTYTWOPARTY.Global.MAX_RANGE);
		var partyHtml = "";
		var groupHtml = "";
		var type = $(".tabs").find(".active").text();
		if(type == "PARTY"){
			$("#parties ul").html("");				
			for(var i = 0; i< PARTYJSON.party.length; i++){
				if(PARTYJSON.party[i].name.indexOf(searchTxt) != -1){
					partyHtml += '<li> <img src="'+PARTYJSON.party[i].imgPath+'" alt="'+PARTYJSON.party[i].name+'" /> <span class="name expand_view">'+PARTYJSON.party[i].name+'</span> <span class="act expand_view">'+PARTYJSON.party[i].worth+ " MM " +PARTYJSON.party[i].account+'</span> </li>'
				}
			}
			setTimeout(function(){
				$("#parties ul").html(partyHtml);
			}, 100);
		}else{
			$("#group ul").html("");
			for(var i = 0; i< PARTYJSON.group.length; i++){
				if(PARTYJSON.group[i].name.indexOf(searchTxt) != -1){
					groupHtml += '<li class="groupgraph" data-name="smith-group.json"> <img src="'+PARTYJSON.group[i].imgPath+'" alt="'+PARTYJSON.group[i].name+'" /> <span class="name expand_view">'+PARTYJSON.group[i].name+'</span> <span class="act expand_view">'+PARTYJSON.group[i].worth+ " MM " +PARTYJSON.group[i].account+'</span> </li>'
				}
			}
			setTimeout(function(){				
				$("#group ul").html(groupHtml);
			}, 100);
		}
		$(".slide").hide();
	});
})();