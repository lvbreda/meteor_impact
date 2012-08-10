Meteor.validateDocument = function(doc,model){
		try{
			for(var field in model){
				rules = model[field];
				for(var rule in rules){
					if(rules["required"] && !doc[field]){
						console.log(field + " " + rule + " " + doc[field]);
									return false;
					}else{
						if(!rules["required"] && !doc[field]){
							
						}else{
							if(Meteor.validators[rule]){
								if(!Meteor.validators[rule](rules[rule],doc[field],rules)){
									console.log(field + " " + rule + " " + doc[field]);
									return false;
								}
							}
						}	
					}
				}
			}
			return doc;
		}catch(e){
			return false;
		}
		
}
Meteor.validators = {
	"required" : function(rule,document,allRules){
		if((rule && !document) || (rule && document.length == 0)){
			throw new Meteor.Error(500, "This field is required");
			return false;
		}
		return true;
	},
	"type" : function(rule,document,allRules){
		if(rule=="subDocuments"){
			for(var subdoc in document){
				if(!Meteor.validateDocument(document[subdoc],allRules["subDocuments"])){
					return false;
				}
			}
		}else{

			rule=(rule=="date")?"string":rule;
			if(rule != (typeof document)){
				throw new Meteor.Error(500, "This field needs to be a " + rule);
				return false;
			}
			if(allRules.regex){
				if(allRules.regex.test(document)){
					throw new Meteor.Error(500, "This field contains illegal characters or is in the wrong format");
					return false;
				}
			}
		}
		return true;
	},
	"max" : function(rule,document,allRules){
		switch(typeof document){
			case "number":{
				if(document>rule){
					throw new Meteor.Error(500, "This field has a maximum of " + rule);
					return false;
				}
				break;
			}
			default:{
				if(document.length>rule){
					throw new Meteor.Error(500, "This field has a maximum of " + rule  +" character(s)");
					return false;
				}
			}
		}
		return true;
	},
	"min" : function(rule,document,allRules){
		switch(typeof document){
			case "number":{
				if(document<rule){
					throw new Meteor.Error(500, "This field has a minimum of " + rule);
					return false;
				}
				break;
			}
			default:{
				if(document.length<rule){
					throw new Meteor.Error(500, "This field has a minimum of " + rule + " character(s)");
					return false;
				}
			}
		}
		return true;
	}
}
