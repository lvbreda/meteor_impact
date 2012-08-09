Meteor.publish("posts",function(){
		return  Posts.find({},{$natural:-1});
	});
	Posts.allow({
		insert : function(userId,doc){
			return Meteor.validateDocument(doc,Posts.validation);
		},
		update : function(userId,docs,fields,modifier){
			return true;
		},
		remove : function(userId,docs){
			return true;
		},
		fetch  : function(Array){
			return true;
		}
	}); 

