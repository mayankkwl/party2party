$(function () {
	var progIndex = 17;
    $('.sublist a').click(function () {
        var href = $(this).attr('href');
        var that = $(this);
        $(this).parent().parent().find(".listactive").removeClass('listactive');
        $(this).parent().addClass('listactive');
        $('.active').animate({
            left: '250px'
        }).removeClass('active').addClass("inactive");
        $(href).removeClass("inactive").addClass('active');

        sessionStorage.setItem("tab", ($(this).attr("id")));

        setTimeout(function () {
            if ($(window).height() >= $("#rightsideContent").height()) {
                $("#leftsideContent").height($(window).height() - 70);
            } else {
                $("#leftsideContent").height($("#rightsideContent").height());
            }
        }, 100);
		$( "#progressbar" ).progressbar({value: getValue(href) });
        return false;
    });
	function getValue(href){
		var prog = 0;
		switch(href) {
			case '#one':
				prog = 0
				break;
			case '#two':
				prog = parseInt(progIndex)*1
				break;
			case '#three':
				prog = parseInt(progIndex)*2
				break;
			case '#four':
				prog = parseInt(progIndex)*3
				break;
		}
console.log(prog)
		return 	prog
	}
});
$(document).ready(function () {
    $(".right-pane .button-primary").click(function () {
        var _i = $(this).attr("data-index");
        $("#list" + _i).click();
    });
});

function storageLink(d) {
    sessionStorage.setItem("tab", d);
}
var isAccountAdded = false;
function addAccount() {
	if(isAccountAdded) return;
    $("#accountRow").append($("#accountRow").html());
    setTimeout(function () {
        $("#leftsideContent").height($(document).height() - 70);
		$(".accnumInput").each(function(i){
			if(i==1){
				$(this).val("101-234345");
			}
		});
		$(".actypeInput").each(function(i){
			if(i==1){
				$(this).val(2);
			}
		});
		$(".benInput").each(function(i){
			if(i==1){
				$(this).val(5);
			}
		});
    }, 5);
	
    $("#paper").hide().fadeIn('fast');
	isAccountAdded = true;
}
var isRelationAdded = false;
function addRelation() {
	if(isRelationAdded) return;
	 $("#relationRow").append($("#relationRow").html());
    setTimeout(function () {
        $("#leftsideContent").height($(document).height() - 70);
		$(".partyInput").each(function(i){
			if(i==1){
				$(this).val(2);
			}
		});
		$(".reltypeInput").each(function(i){
			if(i==1){
				$(this).val(5);
			}
		});
		
		$(".switch").each(function(i){
			if(i==1){
				$(this).find("input").attr("id", "cmn-toggle-2");
				$(this).find("label").attr("for", "cmn-toggle-2")
			}
		});
		
		
		
    }, 5);
    $("#paper").hide().fadeIn('fast');
	isRelationAdded = true;
}

//js to control input field css
(function () {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(rtrim, '');
            };
        })();
    }

				[].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        }

        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
})();

// js to control select field css
(function () {
				[].slice.call(document.querySelectorAll('select.cs-select')).forEach(function (el) {
        new SelectFx(el);
    });
})();
