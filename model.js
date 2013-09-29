Config = {
	numMaxAnswers: 8
};
Accounts.config({
	forbidClientAccountCreation: false
});

Rooms = new Meteor.Collection("rooms");

function isAdmin(userId){
	var user = Meteor.users.findOne(userId);
	return user && user.type === 'admin';
}

Rooms.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});

Questions = new Meteor.Collection("questions");
Questions.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});

function createQuestionInRoom(roomId, possibleAnswers){
	var newQuestionId = Questions.insert({possibleAnswers: possibleAnswers || Config.numMaxAnswers,
		state:'started', votes:[], dateStarted: new Date(), roomId: roomId});
	//set as currentQuestion for same room
	Rooms.update(roomId, {$set:{currentQuestion: newQuestionId}});
};

Meteor.methods({
	changeNumAnswers: function(questionId, numAnswers){
		check(questionId, String);
		check(numAnswers, Number);
		if(!isAdmin(this.userId)){
			throw new Meteor.Error(403, "Not an admin");
		}
		if(numAnswers > Config.numMaxAnswers){
			throw new Meteor.Error(403, "numAnswers must be less or equal to " + Config.numMaxAnswers);
		}
		
		Questions.update(questionId, {$set: {possibleAnswers: numAnswers}})
	},
	makeAdmin: function(userId){
		check(userId, String);
		if(!isAdmin(this.userId)){
			throw new Meteor.Error(403, "Not an admin");
		}
		Meteor.users.update(userId, {$set:{type:'admin'}})
	},
		
  vote: function (questionId, vote) {
	check(questionId, String);
	check(vote, Number);
	var question = Questions.findOne(questionId);
	if (! question){
		throw new Meteor.Error(404, "No such question");
	}
	if(question.state === 'stopped'){
		throw new Meteor.Error(403, "Question stopped");
	}
		
	var voteIndex = _.indexOf(_.pluck(question.votes, 'user'), this.userId);
	if (voteIndex !== -1) {
	  // update existing vote entry

	  if (Meteor.isServer) {
		// update the appropriate vote entry with $
		Questions.update(
		  {_id: questionId, "votes.user": this.userId},
		  {$set: {"votes.$.vote": vote}});
	  } else {
		// minimongo doesn't yet support $ in modifier. as a temporary
		// workaround, make a modifier that uses an index. this is
		// safe on the client since there's only one thread.
		var modifier = {$set: {}};
		modifier.$set["votes." + voteIndex + ".vote"] = vote;
		Questions.update(questionId, modifier);
	  }
	} else {
	  // add new entry
	  Questions.update(questionId,
					 {$push: {votes: {user: this.userId, vote: vote}}});
	}
  },
  
  questionAction: function(questionId){
	check(questionId, String);
	var question = Questions.findOne(questionId);
	if (! question){
	  throw new Meteor.Error(404, "No such question");
	}
	var room = Rooms.findOne(question.roomId);
	if (! room){
	  throw new Meteor.Error(404, "No such room");
	}
	if(!isAdmin(this.userId)){
		throw new Meteor.Error(403, "Not an admin");
	}
	 
	if(question.state==='started'){
		Questions.update(questionId, {$set: {state: 'stopped', dateStopped: new Date()}});
		//TODO: could compute end results
	}else if(question.state==='stopped'){
		createQuestionInRoom( question.roomId, question.possibleAnswers);
	}
  },
  newRoom: function(name){
	check(name, String);
	if(!isAdmin(this.userId)){
		throw new Meteor.Error(403, "Not an admin");
	}
	var roomId = Rooms.insert({name:name});
	createQuestionInRoom( roomId );
  }
});