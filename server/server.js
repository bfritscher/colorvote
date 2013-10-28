Accounts.registerLoginHandler(function(options) {
	if (!options.anonymous)
	  return undefined; // don't handle

	// Create and insert a user, bypassing everything. All we want is the token.
	return Accounts.insertUserDoc({generateLoginToken:true}, {type: 'anonymous', services: {}});
});
/*
Meteor.publish('userPresence', function() {
  return Meteor.users.find({ "profile.online": true, 'type': {$ne:'admin'} }, {fields: {'profile.online': true, 'profile.room': true}});
});
*/

Meteor.publish("question", function (id) {
	check(id, String);	
	//only show results to admin
	var fields = {votes: true };
	var user = Meteor.users.findOne(this.userId);
	if(user && user.type==='admin'){
		fields.results = true;
	}
	return [Questions.find(id), QuestionResults.find({_id: id}, {fields: fields})];
});

Meteor.publish("vote", function (questionId) {
	check(questionId, String);
	return Votes.find({questionId: questionId, userId: this.userId});
});

Meteor.publish("rooms", function () {
	return Rooms.find({});
});

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'type': 1}});
});

Meteor.publish("questionsHistory", function (roomId) {
	check(roomId, String);
	return [Questions.find({roomId: roomId, state:'stopped'}, {sort:{dateStopped: -1}, limit:20}),
			QuestionResults.find({_id:{$in: _.pluck(Questions.find({roomId: roomId, state:'stopped'}, {sort:{dateStopped: -1}, limit:20, fields:{'_id':true}}).fetch(), '_id')}})];
});