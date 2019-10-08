// JavaScript Document
(function(){
	$("#submit").click(function(){
		var fauserId = $.trim($("#fauserId").val());
		var fapassword = $.trim($("#fapassword").val());
		if($("#fauserId").val() == ""){
			$(".error").text("Please enter your Username");
			$("#fauserId").focus();
			return false;
		}else if($("#fapassword").val() == ""){
			$(".error").text("Please enter your Password");
			$("#fapassword").focus();
			return false;
		}
		if($("#fauserId").val() == "fa1" || $("#fauserId").val() == "fa2"){
			if(typeof(Storage) !== "undefined") {
				/*
					fa1 : admin
					fa2 : user
				*/
				var url = $("#fauserId").val() == "fa1" ? "partylist.json" : "partylist1.json";
				var relation = $("#fauserId").val() == "fa1" ? "nonfamily" : "family";
				var name = $("#fauserId").val() == "fa1" ? "Chris Smith" : "John Doe";
				
				var fa_login = {
					"url" : url,
					"relation" : relation,
					"name" : name
				}
				
				sessionStorage.setItem("fa_user", JSON.stringify(fa_login));
				setTimeout(function(){
					window.location.href = "dashboard.html"
				}, 100);
			} else {
				// Sorry! No Web Storage support..
			}
		}else{
			$(".error").text("Invalid user");
		}
		
	});	
})();