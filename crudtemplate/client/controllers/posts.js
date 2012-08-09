
Meteor.autosubscribe(function () {
  Meteor.subscribe("posts");
});
/**
 * Postlist
 */

Template.posts.posts = function(){
	return Posts.find({},{$natural:-1});
}
Template.posts.selectedPost = function(){
	return Session.get("selectedpost");
}
Template.posts.events = {
	"click #delete" : function(e){
		Session.set("selectedrow",this);
		$('#myModal').modal('show')
	},
	"click #deleteConfirm" : function(e){
		Posts.remove({_id:Session.get("selectedrow")._id});
		$('#myModal').modal('hide')
	}
}
/**
 * Create a new post
 */

Template.newposts.collection = function(){
	return Posts;
}
Template.editposts.collection = function(){
	return Posts;
}

/**
 * Edit a post
 */
Template.editposts.posts = function(){
	
	return Posts.find({_id:window.location.pathname.split("/")[3]});
}
Template.editposts.callback = function(){
	Meteor.defer(function() {
     	$(".date").datepicker();
   	});
   	return "";
}
