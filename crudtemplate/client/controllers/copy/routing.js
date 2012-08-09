Meteor.startup(function() {
	var router = Backbone.Router.extend({
		routes : {
			":page" : "list",
			":page/edit/:id" : "edit",
			":page/new" : "newobject"
		},
		list : function(page) {
			document.body.innerHTML = "";
			var frag = Meteor.ui.render(function() {
				if (Template[page]) {
					return Template[page]();
				}
				return "";
			});
			console.log("a");
			document.body.appendChild(frag);
			
		},
		edit : function(page,id) {
			Session.set("editid",id);
			document.body.innerHTML = "";
			var frag = Meteor.ui.render(function() {
				if (Template["edit" + page]) {
					return Template["edit" + page]();
				}
				return "";
			});
			document.body.appendChild(frag);
			
			
		},
		newobject : function(page) {
			document.body.innerHTML = "";
			var frag = Meteor.ui.render(function() {
				if (Template["new" + page]) {
					return Template["new" + page]();
				}
				return "";
			});
			document.body.appendChild(frag);
		}
	});
	Router = new router;
	Meteor.startup(function() {
		Backbone.history.start({
			pushState : true
		});
	});
}); 
