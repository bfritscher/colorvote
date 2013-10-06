//helper to access session properties directly
Handlebars.registerHelper('session',function(input){
    return Session.get(input);
});

//Defaults
Meteor.Presence.state = function() {
	if(Meteor.user() && Meteor.user().type === 'admin'){
		return 'admin';
	}
	return  Session.get('roomId') || 'online';
}
Session.setDefault('showhistory', false);
Session.setDefault('currentPage', 'roomSelection');
Session.setDefault('showqrcode', false);
Session.setDefault('showCardVote', false);

if(Meteor.userId() === null){
	loginAnonymously();
}

//listen to url changes
window.onhashchange = function(){
	ga('send', 'pageview', '/' + location.hash.slice(1));
	if(location.hash==='#login'){
		Session.set('showlogin', true);
		Meteor.logout(function(){Session.set('currentPage', 'roomSelection');});
	}
	var room = Rooms.findOne({name: location.hash.slice(1)})
	handleRoomRedirect(room);
	if(!room){
		roomSelectionScreen();
	}
};

Meteor.startup(function () {
	FastClick.attach(document.body);
	//subscriptions
	Meteor.subscribe("userPresence");
	Meteor.subscribe("userData"); //get user.type field
	Meteor.subscribe("rooms", function(){
		ga('send', 'pageview', '/' + location.hash.slice(1));
		//parse location hash
		var room = Rooms.findOne({name: location.hash.slice(1)})
		handleRoomRedirect(room);
		//update location if a room is selected
		Deps.autorun(function () {
			if(Session.get('currentPage') === 'roomVoter' || Session.get('currentPage') === 'roomAsker'){
				var room = Rooms.findOne(Session.get('roomId'));
				if(room){
					location.hash = room.name;
				}
			}else{
				location.hash = '';
			}
		});
		//listen for changes of currentQuestion for currentRoom
		Deps.autorun(function () {
			var room = Rooms.findOne(Session.get('roomId'));
			if(room){
				Session.set('currentQuestionId', room.currentQuestion);
			}
		});
	});

	Deps.autorun(function () {
		if(Meteor.user() && Meteor.user().type === 'admin'){
			Session.set('showlogin', true);
		}
	});

	Deps.autorun(function () {
		if(Session.get("currentQuestionId")){
			Meteor.subscribe("question", Session.get("currentQuestionId"), { onError: function(err){console.log(err)},onReady:function(){
				//update vote if already voted
				question = Questions.findOne(Session.get("currentQuestionId"));
				if(question){
					var vote = _.find(question.votes, function(vote){
						return Meteor.userId() === vote.user;
					});
					if(vote){
						Session.set('vote', vote.vote);
					}else{
						Session.set('vote', null);
					}
				}
			}}); 
		}
	});
	Deps.autorun(function () {
		if(Session.get('roomId') && Session.get('showhistory')){
			Meteor.subscribe("questionsHistory", Session.get('roomId'));
		}
	});

	var interval;
	Deps.autorun(function () {
		var question = Questions.findOne(Session.get('currentQuestionId'));
		if(question){
			Meteor.clearInterval(interval);
			interval = Meteor.setInterval(function(){
				Session.set('elapsedTime', calculateTimer(question));
			}, 1000)
			
		}
	});
});

//Helper & shared functions

function handleRoomRedirect(room){
	if(room){
		Session.set('roomId', room._id);
		if(Session.get('currentPage') != 'roomVoter' && Session.get('currentPage') != 'roomAsker'){
			if(Meteor.user() && Meteor.user().type === 'admin'){
				Session.set('currentPage', 'roomAsker');
			}else{
				Session.set('currentPage', 'roomVoter');
			}
		}
	}
}

function padLeft(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}

function calculateTimer(question){
	var time
	if(question.state === 'stopped'){
		time = moment(question.dateStopped).diff(question.dateStarted);
	}else{
		time = moment().diff(question.dateStarted);
	}
	time = Math.round(time / 1000);
	var secondes = time % 60;
	return padLeft((time-secondes)/60,2) +  ':' +  padLeft(secondes,2)
}

function loginAnonymously(){
	Accounts.callLoginMethod({methodArguments:[{anonymous: true}],
		validateResult:function(e){}
	});
}

function getCurrentRoomName(){
	var room = Rooms.findOne(Session.get('roomId'));
	if(room){
		return room.name;
	}else{
		return '';
	}
}

function isStopped(){
	question = Questions.findOne(Session.get("currentQuestionId"));
	if(question){
		return question.state === 'stopped';
	}
};

function createEmptyResult(possibleAnswers){
	var result = {};
	for(var i=0; i< possibleAnswers; i++){
		result[i] = 0;
	}
	return result;
}

function createQuestionResult(question){
	return _.reduce(question.votes, function(memo, voteObj){
            if(memo.hasOwnProperty(voteObj.vote)){
                memo[voteObj.vote]++;
            }
            return memo
		}, createEmptyResult(question.possibleAnswers));
}

function votesCount(){
	var question = Questions.findOne(Session.get('currentQuestionId'));
	if(question){
		return question.votes.length;
	}
	return 0;
}

function isAdmin(){
	return Meteor.user() && Meteor.user().type === 'admin';
}

function possibleAnswers(){
	var question = Questions.findOne(Session.get('currentQuestionId'));
	if(question){
		return question.possibleAnswers;
	}
	return 0;
};

function roomSelectionScreen(){
	Session.set('currentPage', 'roomSelection');
	Session.set('roomId', null);
}

function generateChoices(){
	var choices = [];
	for(var i=0; i< possibleAnswers(); i++){
		choices.push({no:i});
	}
	return choices;
}

//Templates

Template.page.currentPage = function(){
	return Session.get('currentPage');
}

Template.page.currentPageIs = function(page){
	return Session.get('currentPage') === page;
}

Template.roomSelection.rooms = function(){
	return _.map(Rooms.find({},{sort:{name:1}}).fetch(), function(room){
		room.userCount = Meteor.presences.find({state: room._id}).count();
		return room;
	});
}

Template.roomSelection.isAdmin = isAdmin;
Template.roomSelection.events({
	'click .room.add-room': function(event){
		event.stopImmediatePropagation();
		var name = prompt('Room name?');
		if(name){
			Meteor.call('newRoom', name);
		}
	}
});

Template.roomSelectionItem.isAdmin = isAdmin;
Template.roomSelectionItem.events({
	'click .room': function(){
		Session.set('roomId', this._id);
		if(isAdmin()){
			Session.set('currentPage', 'roomAsker');
		}else{
			Session.set('currentPage', 'roomVoter');
		}
	},
	'click .room .rename-room': function(event){
		event.stopImmediatePropagation();
		var name = prompt('Room name?', this.name);
		if(name && name.length > 0 && name != this.name){
			Rooms.update(this._id, {$set:{name:name}});
		}
	}
});

Template.roomName.room = function(){
	return getCurrentRoomName();
}
Template.roomName.votes = votesCount;

Template.roomName.presenceCount = function(){
	return Meteor.presences.find({state: Session.get('roomId')}).count();
};
Template.roomVoter.choices = generateChoices;

Template.roomVoter.events({
	'click .card-vote': function(event){
		event.stopImmediatePropagation();
		Session.set('showCardVote', false);
	},
	'click .show-card-vote': function(event){
		event.stopImmediatePropagation();
		var state = Session.get('showCardVote');
		if(!state){
			ga('send', 'pageview', '/' + location.hash.slice(1) + '/cards');
		}else{
			ga('send', 'pageview', '/' + location.hash.slice(1));
		}
		Session.set('showCardVote', !state);
	}
});

Template.choice.events({
	'click .card': function(event){
		event.stopImmediatePropagation();
		Session.set('vote', this.no);
		Meteor.call('vote', Session.get('currentQuestionId'), this.no);	
	}
});


Template.swipeVote.rendered = function(){
	var choices = generateChoices();
	if(choices.length > 0){
		if(!Template.swipeVote.swiper){
			Template.swipeVote.swiper = new Swiper('.swiper-container.voter',{
				pagination: '.pagination',
				paginationClickable: true,
				createPagination: true,
				loop: true,
				watchActiveIndex: true,
				queueEndCallbacks: true,
				onSlideChangeEnd: function(swiper){
					Session.set('vote', swiper.activeLoopIndex);
					Meteor.call('vote', Session.get('currentQuestionId'), swiper.activeLoopIndex);
				}
			});
		}
		
		var toCreate = choices.length+2 - Template.swipeVote.swiper.slides.length;
		for(var i=0; i< toCreate;i++){
			Template.swipeVote.swiper.createSlide('<div class="title"></div>').append();
		}
		
		for(var i=0; i< choices.length+2;i++){
			var slide = Template.swipeVote.swiper.getSlide(i);
			if(slide && choices.length>0){
				//fix loop
				var j=i;
				if(j === choices.length+1){
					j=0;
				}else if(j===0){
					j=choices.length-1;
				}else{
					j=i-1;
				}
				slide.className = 'swiper-slide color-' + choices[j].no;
				slide.querySelector('.title').textContent = choices[j].no;
			}
		};
		while(choices.length+2 < Template.swipeVote.swiper.slides.length){
			var slide = Template.swipeVote.swiper.getSlide(choices.length+2);
			if(slide){
				if(slide.isActive()){
					Template.swipeVote.swiper.swipeTo(0, 0);
				}
				slide.remove();
			}
		}
		
		if(Template.swipeVote.swiper.activeLoopIndex != Session.get('vote') && Session.get('vote') < choices.length){
			Template.swipeVote.swiper.swipeTo(Session.get('vote'), 0);
		}
	}
};
Template.swipeVote.destroyed = function () {
	if(Template.swipeVote.swiper){
		Template.swipeVote.swiper.destroy();
		delete Template.swipeVote.swiper;
	}
};

Template.choice.currentVoteIs = function(choice){
	return Session.get('vote') === choice;
};
Template.choice.events({
	'click .choice': function(){
		Session.set('vote', this.no);
		Meteor.call('vote', Session.get('currentQuestionId'), this.no);
	}
});

Template.roomAsker.room = getCurrentRoomName;
Template.roomAsker.stopped = isStopped;
Template.roomAsker.hrefThumb = function() {return {width: 40, height: 40, href:location.href};};
Template.roomAsker.href = function() {return {href:location.href};};

Template.roomAsker.possibleAnswers = possibleAnswers;

Template.roomAsker.data = function(){
	var question = Questions.findOne(Session.get('currentQuestionId'));
	if(question){
		return createQuestionResult(question);
	}
};

Template.votesCount.votesCount = votesCount;

Template.roomAsker.events({
	'change input': function(event){
		Meteor.call('changeNumAnswers', Session.get('currentQuestionId'), Number(event.currentTarget.value));
	},
	'click #questionAction': function(event){
		//auto show/hide result on stop (if in reactive then toggle problem..)
		var question = Questions.findOne(Session.get('currentQuestionId'));
		if(question.state === 'started'){
			Session.set('showresults', true);
		}else{
			Session.set('showresults', false);
		}
		Meteor.call('questionAction', Session.get('currentQuestionId'),function (error, result) { console.log(error);} );
		
	},
	'click #toggleResults': function(event){
		Session.set('showresults', !Session.get('showresults'));
	},
	'click #qrCodePanel': function(event){
		Session.set('showqrcode', false);
	},
	'click #showqrcode': function(event){
		Session.set('showqrcode', true);
	},
	'click #toggleHistory': function(event){
		Session.set('showhistory', !Session.get('showhistory'));
	}
});
Template.logo.events({
	'click h1': function(event){
		roomSelectionScreen();
	}
});
Template.backLink.events({
	'click .backLink': function(event){
		roomSelectionScreen();
	}
});


Template.questionAction.stopped = isStopped;
Template.roomVoter.stopped = isStopped;
Template.roomVoter.votenow = function(){
	return !isStopped() && (Session.get('vote') === '' || Session.get('vote') === null);
}

Template.history.questionsHistory = function(){
	return _.map(Questions.find({roomId: Session.get("roomId"), state:'stopped',$where:"this.votes.length > 0"},
		{sort:{dateStopped: -1}, limit:20}).fetch(), function(q){
		q.result = createQuestionResult(q);
		q.date = moment(q.dateStopped).format('DD.MM.YYYY HH:mm');
		q.time = calculateTimer(q);
		return q;
	});
}

Template.history.rendered = function(){
	if(this.find('.history .swiper-container')){
		if(Template.history.swiper){
			Template.history.swiper.destroy();
		}
		Template.history.swiper = new Swiper('.history .swiper-container',{
			pagination: '.pagination',
			paginationClickable: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			loop: false,
			watchActiveIndex: true,			
			initialSlide: 0,
			onFirstInit: function(swiper){
				Meteor.setTimeout(function(){document.querySelector('.swiper-wrapper').className='swiper-wrapper';}, 300);
			}
		});		
	}
};
Template.history.destroyed = function () {
	if(Template.history.swiper){
		Template.history.swiper.destroy();
		delete Template.history.swiper;
	}
};

Template.qrCode.rendered = function(){
	if(!this.qrCode){
		this.qrCode = new QRCode(this.find('div.qrcode'), {
			width : this.data.width || 400,
			height : this.data.height || 400
		});
	}
	this.qrCode.makeCode(this.data.href || 'empty');
}

Template.resultChart.rendered = function () {
  var self = this;
  self.node = self.find("svg");

  //if (! self.handle) {
  //  self.handle = Deps.autorun(function () {
		var margin = {top: 30, right: 20, bottom: 30, left: 40},
			width = 500 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var formatPercent = d3.format(".0%");

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);
		
		var data = self.data;
		var keys = d3.keys(data).sort();
			
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yMax= d3.sum(d3.values(data));
		var yAxis = d3.svg.axis()
			.scale(y)
			.tickFormat(d3.format("d"))
			.tickSubdivide(0)
			.orient("left");

		var svg = d3.select(self.node)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.select('g.transform').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		x.domain(keys);
		y.domain([0, d3.max(d3.values(data))]);

		svg.select("g.x.axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.select('g.y.axis')
			.transition().duration(1000)
			.call(yAxis);

		var bar = svg.selectAll(".bar")
		    .data(d3.entries(data));
		var barEnter = bar.enter()
		var barG = barEnter.append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { return 'translate(' + x(d.key) + ',0)'; });
		
		//repeat code not to have flash in animation		
		barG.append("rect")
			.attr("class", function(d){ return 'color-' + d.key;})
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); });
		barG.append('text')
			.attr('x',  x.rangeBand()/2 - 12)
			.attr('y', function(d) { return y(d.value) - 8; });
			
		bar.attr("transform", function(d) { return 'translate(' + x(d.key) + ',0)'; });
			
		bar.select("rect").transition().duration(1000)
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); });
		bar.select("rect")
			.attr("width", x.rangeBand());
		bar.select('text').transition().duration(1000)
			.text(function(d){ return formatPercent(d.value/yMax || 0);})
			.attr('y', function(d) { return y(d.value) - 8; });
		bar.select('text')
			.attr('x',  x.rangeBand()/2 - 12);
			
		bar.exit().remove();
   // });
  //}
};

Template.resultChart.destroyed = function () {
 // this.handle && this.handle.stop();
};