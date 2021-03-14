javascript: 
var archive = "Staatsarchiv Freiburg";
var titleDiv = document.getElementById('titel');
var signature = titleDiv.firstChild.innerText + "";
var signature = signature.replace("1 Bd.", "") ;
var selectedBild = getSelectedOption(document.getElementsByName('originalBilddatei')[0]).text;
var bild = (selectedBild + "").replace("Bild ", "");
var id = document.getElementsByName('aid')[0].value;
var link = "http://www.landesarchiv-bw.de/plink/?f=" + id + "-" + bild;
 
/*https://www.dyn-web.com/tutorials/forms/select/selected.php */     
function getSelectedOption(sel) 
{         
	var opt;
	for ( var i = 0, len = sel.options.length;i < len; i++ ) 
	{             
		opt = sel.options[i];
		if ( opt.selected === true ) 
		{                 
			break;
		}         
	}         return opt;
} 
prompt("..", archive + ", " + signature + ", [" + link +" "  +"picture " + bild +"], #");
;void(0); 
