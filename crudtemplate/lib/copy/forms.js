/*
 * At the moment this is written to just work. 
 * Todo : 
 * 	Extract the templates.
 * 	Think about js conventions & best practices
 */


var currentCollection ;
var currentSelected = undefined;

/**
 * Create a json document based upon the current form for saving& updating
 * @param {Object} form
 */
var createJson = function(form){
	var output = {};
	form.find(">fieldset>.control-group>.controls>input,>fieldset>.control-group>.controls>textarea").each(function(){
		self = $(this);
		output[self.attr('id')] = self.val();
	});	
	/**
	 * Hack to check if something is selected.
	 * It was bugging me.
	 * 
	 */
	
		form.find("fieldset>.control-group>.controls>fieldset").each(function(){
			var i = new Array();
			self = $(this);
			self.find("tr").each(function(){
				var temp = {};
				$(this).find("td").each(function(){
					if($(this).attr("data-name")){
						temp[$(this).attr("data-name")] = $(this).html();
					}
				});
				i.push(temp);
			});
			output[self.find('>legend>b').html()] = i;
		});
	
	return  output;
}
/**
 * Todo:
 * 	Replace this by more default meteor way.
 */
if(Meteor.is_client){
	$(document).ready(function(){
		$("input").live("click",function(e){
			$(".date").datepicker();
		});
		$("#submit").live("click",function(e){
			e.preventDefault();
			$("input,textarea").trigger("blur");
			if($(".control-group.error").length==0){
				var self = $(this);
				var document = createJson(self.closest("form"));
				if(currentSelected.hash){
					console.log(document);
					currentCollection.insert(document);
				}else{
					currentCollection.update({_id:currentSelected._id},{$set:document});
				}
			}
		});
		$(".subDelete").live("click",function(e){
			self = $(this);
			self.closest("tr").remove();
		});
		$(".addSub").live("click",function(e){
			e.preventDefault();
			var tr ="<tr>"
			self = $(this);
			self.parent("div").find("input,textarea").each(function(){
				tr += '<td data-name="'+ $(this).attr('name')+'">' + $(this).val() + '</td>';
			});
			tr += "<td class='subDelete'><i class='icon-trash'></i></td>";
			tr +="</tr>";
			console.log(self.closest("table"));
			$("table").append(tr);
		});
		$("input,textarea").live("blur",function(){
			var self = $(this);
			var controlgroup = self.closest(".control-group");
			try{				
				var checks = JSON.parse(self.attr("data-check"));
				if(checks['required'] && self.val().length==0){
					throw new Meteor.Error(500, "This field is required");
					
				}else{
					for(rule in checks){
						if(Meteor.validators[rule]){
							Meteor.validators[rule](checks[rule],self.val(),checks);
						}
						
					}
				}
				controlgroup.removeClass("error");
				controlgroup.addClass("success");
				controlgroup.find(".help-inline").html("")
			}catch(e){
				controlgroup.removeClass("success");
				controlgroup.addClass("error");
				controlgroup.find(".help-inline").html(e.reason);
				console.log(e);
			}
		});
	});
}
/**
 * Handler use like this {{{form collection "create/edit" nothing/selectedDocument}}}
 */
Handlebars.registerHelper("form", function(collection,type,selected) {
	  currentCollection = collection;
	  currentSelected = selected;
	  var VALIDATION = collection.validation;
	  var form = "";
	  console.log(selected);
	  form += '<form class="form-horizontal well" enctype="multipart/form-data"><fieldset>';
	  for(item in VALIDATION){
	  	var content = VALIDATION[item];
	  	console.log(content.type);
	  	var label = (content.type=="subDocuments")?"":'<label class="control-label" for="'+item+'">'+item +':  </label>'
	  	form += '<div class="control-group">'+label;
	  	form += '<div class="controls">' + FormElementsCreate[content.type](item,content,selected) +'</div>';
	  	form += '</div>'
	  }
	  form += '<div class="form-actions"><button type="submit" data-function="' + type +'" class="btn btn-primary" id="submit">Save</button><button class="btn">Cancel</button></div>';
	  
	  return form+'</fieldset></form><script type="text/javascript">$(".date").datepicker();</script>';
});
/**
 * This will need to be extracted to external templates.
 */
var FormElementsCreate = {
	"string" : function(item,rules,selected){
		var retvalue="";
		if((rules.max && rules.max<=130) ||!rules.max){
			var value = (selected && selected[item])?'value="' + selected[item] + '" ':'';
			retvalue = '<input type="text" name= "'+item + '" id= "'+item + '" class="input-xlarge" data-check=\'' + JSON.stringify(rules) + '\' '+value+'/>' ;
		}else{
			var value = (selected && selected[item])?'' + selected[item] + ' ':'';
			retvalue = '<textarea rows="15" style="width:100%;" name= "'+item + '" id= "'+item + '" class="input-xlarge " data-check=\'' + JSON.stringify(rules) + '\'>' + value+'</textarea>' ;
			
		}
		retvalue += '<span class="help-inline"></span>';
		return retvalue;
	},
	"number" : function(item,rules,selected){
		var retvalue="";
		var max = (rules.max)?'max="'+rules.max+'" ': '';
		var min = (rules.min)?'min="'+rules.min+'" ': '';
		var value = (selected && selected[item])?'value="' + selected[item] + '" ':'';
		retvalue = '<input type="number" name= "'+item + '" id= "'+item + '" class="input-xlarge" data-check=\'' + JSON.stringify(rules) + '\'' + min + max + value + '/>' ;
		retvalue += '<span class="help-inline"></span>';
		return retvalue;
	},
	"subDocuments" : function(item,rules,selected){
		var retvalue ="";
		retvalue+='<FIELDSET><LEGEND><b>'+item+'</b></LEGEND>'
		+ '<div class="addSubWrapper"><button class="btn btn-primary addSub"><i class="icon-plus"></i>Add ' + item +'</button>';
		for(var it in rules.subDocuments){
				var label = (rules.subDocuments[it].type=="subDocuments")?"":'<label class="control-label" for="'+it+'">'+it +':  </label>'
			  	retvalue += '<div class="control-group">'+label;
			  	retvalue += '<div class="controls">' + FormElementsCreate[rules.subDocuments[it].type](it,rules.subDocuments[it]) +'</div>';
			  	retvalue += '</div>'
		}
		retvalue += '</div>';
		retvalue +='<fieldset>';
		
			retvalue+='<table class="table table-bordered table-striped"><tbody>';
			for(var it in selected[item]){
				retvalue+="<tr>";
				for(var sub in selected[item][it]){
					retvalue+="<td data-name='"+ sub +"'>" + selected[item][it][sub] + "</td>";
				}
				retvalue+="<td class='subDelete'><i class='icon-trash'></i></td>";
				retvalue+="</tr>";
			}
			retvalue += "</tbody></table>";
		retvalue +='</fieldset></FIELDSET>';
		return retvalue;
	},
	"date" : function(item,rules,selected){
		var value = (selected && selected[item])?'value="' + selected[item] + '" ':'';
		retvalue = '<input type="text" class="date" name= "'+item + '" id= "'+item + '" class="input-xlarge" data-check=\'' + JSON.stringify(rules) + '\' '+value +' onload=\'$(".date").datepicker();\' />' ;
		retvalue += '<span class="help-inline"></span>';
		return retvalue;
	}
}
