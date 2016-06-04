
var sd_pathToImage = "images/loadingAnimation.gif";

//on page load call spdialog_init
$(document).ready(function () {
	SPDialog_init('a.spdialog, area.spdialog, input.spdialog'); //pass where to apply spdialog
	imgLoader = new Image(); // preload image
	imgLoader.src = sd_pathToImage;
});

//add spdialog to href & area elements that have a class of .spdialog
function SPDialog_init(domChunk) {
	$(domChunk).click(function () {
		var a = (this.href != null && this.href != '' && this.href.indexOf('javascript:') != 0) ? this.href : $(this).attr('alt');
		SPDialog_show(a);
		this.blur();
		return false;
	}).removeClass('spdialog');
}

function SPDialog_show(url) {//function called when the user clicks on a spdialog link
	try {
		//$('body').css('min-height', '2000px');
		$("body").append("<div id='SD_overlay'></div><div id='SD_window'></div>");
		$("body").append("<div id='SD_load'><img src='" + imgLoader.src + "' /></div>"); //add loader to the page
		$("#SD_overlay").css("display", "block");
		$("#SD_load").css("display", "block");
		$("body > *").not("#SD_overlay, #SD_load , #SD_window").addClass("disp_none");

		$("#SD_iframeContent").remove();
		$("#SD_window").append("<iframe frameborder='0' hspace='0' scrolling='no' src='" + url + "' id='SD_iframeContent' name='SD_iframeContent" + Math.round(Math.random() * 1000) + "' onload='SD_showIframe()'> </iframe>");

		if (url.toLowerCase().indexOf('fixedheight=1') >= 0) {
			if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) != null) {
				var iOSVersion = 0;
				try {
					navigator.userAgent.match(/OS (\d+)(_\d+)* like Mac OS X/im);
					iOSVersion = parseInt(RegExp.$1);
				} catch (e) { }
				if (iOSVersion < 7) {
					if (getCookie('sb-closed') == '' && getCookie('sb-installed') == '') {
						//iOS 6以下かつスマホバナーが表示される場合、ダイアログの下に余白が表示されてしまう不具合対応
						//iOS 6以下のシェアが十分に低くなったら削除してよし
						window.scrollTo(0, 0);
						$("#SD_window,#SD_overlay").height(window.innerHeight + 1);
					}
				}
			}
		}

		document.onkeyup = function(e){ 	
			if (e == null) { // ie
				keycode = event.keyCode;
			} else { // mozilla
				keycode = e.which;
			}
			if(keycode == 27){ // close
				SD_remove();
			}	
		};
	} catch(e) {
		//nothing here
	}
}

//helper functions below
function SD_showIframe() {
	$("#SD_load,#SD_overlay").remove();
	$("#SD_window").show();
	SD_AdjustHeight();
	scrollTo(0, 1);	//アドレスバーを隠す
}

//最初のscript以外の要素がクラス「adjustDialogHeight」を持っている場合、その要素の高さにダイアログの高さをあわせます。
function SD_AdjustHeight() {
	var children = $("#SD_iframeContent")[0].contentWindow.document.body.childNodes;
	var firstChild;
	for (var i = 0; i < children.length; i++) {
		if (children[i].nodeType == Node.ELEMENT_NODE && children[i].tagName.toLowerCase() != 'script') {
			firstChild = children[i];
			break;
		}
	}

	if ($(firstChild).hasClass("adjustDialogHeight") > 0) {
		$("#SD_window").height($(firstChild).height());
	}
}

function SD_remove() {
	//$("#SD_closeWindowButton").unbind("click");
	$("#SD_window").fadeOut("fast",function(){$('#SD_window,#SD_overlay').trigger("unload").unbind().remove();});
	$("#SD_load").remove();
	$("body > *").removeClass("disp_none");
	//$('body').css('min-height', window.innerHeight + 'px');
	return false;
}
