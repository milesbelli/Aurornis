function TimelineAssistant(timelines,page) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	this.timelines = timelines;
	//this.timeline = timelines[page];
	this.page = page;
}

TimelineAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	
	//Making change
	
	/* Setting up an object to return, in text, the name of the
	 * scene element for timelines. */
	this.sceneTimeline = {
			hometimeline:     "homeTimeLine",
			mentionstimeline: "mentionTimeLine",
			directstimeline:  "directTimeLine"
	};
	
	/* TODO: We need to get rid of this or something.
	if (this.timeline == null){
		
		this.controller.get("tap-4-more").update("Getting tweets...");
		var onSuccess = function(transport){
			this.timeline = TwitterCall.getResponse(transport);
			this.controller.get("tap-4-more").update("Tap to load more");
			this.controller.get("homeTimeLine").mojo.noticeAddedItems(0,this.timeline).bind(this);
			this.controller.modelChanged(this.homeTweetsModel).bind(this);
		}.bind(this);
		
		this.getTimeline({count: 35}, onSuccess);
		
	}; */
	
	/* Setup for header buttons */
	this.topMenuModel = {
			visible: true,
			items: [
			       {visible: false},
			       
			       {label: "Header",
			    	   command: "none",
			    	   toggleCmd: this.page,
			    	   items:[
			    	          {label: "Home", command: "hometimeline", width: 115},
			    	          {label: "Mentions", command: "mentionstimeline"},
			    	          {label: "Directs", command: "directstimeline"}
			    	          ]},
			    	          
			    	          {visible: false}
			       ]
	};
	
	this.controller.setupWidget(Mojo.Menu.viewMenu,undefined,this.topMenuModel);
	
	/* Setup for footer buttons */
	this.cmdMenuModel = {
			visible: true,
			items: [
			        {icon: "refresh", command: "refresh-timeline"},
			        {visible: false},
			        {icon: "new", command: "new-tweet"}
			        ]
	
	};
	
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
	
	
	/* Setup for home timeline */
	this.homeAttributes = {
			itemTemplate: "timeline/tweet",
			listTemplate: "timeline/container",
			renderLimit: 1000
			};
	this.homeTweetsModel = {listTitle: "tweets",
			items: this.timelines["hometimeline"]
			};
	
	this.controller.setupWidget("homeTimeLine",this.homeAttributes,this.homeTweetsModel);
	
	
	/* Set up for mentions timeline */
	this.timelines["mentionstimeline"] = [];
	this.mentionAttributes = {
			itemTemplate: "timeline/tweet",
			listTemplate: "timeline/container",
			renderLimit: 800
	};
	this.mentionTweetsModel = {listTitle: "mentions",
			items: this.timelines["mentionstimeline"]
	};
	
	this.controller.setupWidget("mentionTimeLine",this.mentionAttributes,this.mentionTweetsModel);

	
	/* Set up listeners for objects in the main body (not the widgets) */
	this.controller.listen("tap-4-more", Mojo.Event.tap, this.handleMore.bindAsEventListener(this));
	
};

TimelineAssistant.prototype.handleCommand = function (event) {
	
	/* Handling commands for all the various buttons here.
	 * Kind of wondering if I should break all the switch cases
	 * out into their own functions. */
	
	if(event.type == Mojo.Event.command) {
		switch(event.command){
		case "refresh-timeline":
			/* Refresh the timeline (go figure). */
			var lastId = this.timelines[this.page][0].id;
			
			this.cmdMenuModel.items[0].disabled = true;
			this.controller.modelChanged(this.cmdMenuModel);
			
			this.reenableBtn = function(){
				this.cmdMenuModel.items[0].disabled = false;
				this.controller.modelChanged(this.cmdMenuModel,this);
			}.bind(this);
			
			this.reenableBtn.delay(5);
			
			//Mojo.Log.info("Top Tweet",this.timeline[0].text);
			
			this.timelines[this.page] = TweetBuild.refreshTStamps(this.timelines[this.page]);
			
			/* These following two lines refresh the list of existing tweets with refreshed timestamps.
			 * I'm not super clear on why we need to assign the updated array of tweets back
			 * to the Model, but we do.
			 * 
			 * We didn't back when this call happened after noticeAddedItems, the 'notice'
			 * function might update it for us. But noticeUpdated doesn't seem to, but I
			 * can't figure out why. */
			this.tweetModel().items = this.timelines[this.page];
			this.controller.modelChanged(this.tweetModel(), this);
			
			
			var onSuccess = function(transport){
				var response = TwitterCall.getResponse(transport);
				var last = response.length - 1;

				if (response[last].id == lastId) response.pop();
				
					this.timelines[this.page] = response.concat(this.timelines[this.page]);
					
					/* This is the line that actually updates the list with new tweets, if any. */
					if (response.length > 0) this.controller.get(this.sceneTimeline[this.page]).mojo.noticeAddedItems(0,response).bind(this);
			}.bind(this);
			
			this.getTimeline({since_id: lastId}, onSuccess);
			break;
		case "hometimeline":
			var sceneInfo = {
				transition: Mojo.Transition.crossFade,
				name: "timeline"
		};
			//this.timelines[this.page] = this.timeline;
			//Mojo.Controller.stageController.swapScene(sceneInfo,this.timelines,"hometimeline");
			break;
		case "mentionstimeline":
			var sceneInfo = {
				transition: Mojo.Transition.crossFade,
				name: "timeline"
		};
			//this.timelines[this.page] = this.timeline;
			//Mojo.Controller.stageController.swapScene(sceneInfo,this.timelines,"mentionstimeline");
			break;
		};
	};
};

TimelineAssistant.prototype.handleMore = function () {
	var oldSize = this.timelines[this.page].length;
	var oldestId = this.timelines[this.page][oldSize - 1].id;
	this.controller.get("tap-4-more").update("Getting tweets...");

	
	var onSuccess = function (transport){
		var response = TwitterCall.getResponse(transport);
		
		if (response[0].id == oldestId) response.shift();
		this.timelines[this.page] = TweetBuild.refreshTStamps(this.timelines[this.page]);
		this.timelines[this.page] = this.timelines[this.page].concat(response);
		
		/** Oh goodie, look! More homeTimeLine shit! This all needs
		 * to be modified to allow for other timelines, like MENTIONS
		 * and DIRECTS. Ho boy! **/
		this.controller.get("tap-4-more").update("Tap to load more");
		this.controller.get(this.sceneTimeline[this.page]).mojo.noticeAddedItems(oldSize,response).bind(this);
		this.controller.modelChanged(this.tweetModel()).bind(this);
	}.bind(this);
	
	var onFailure = function (transport){
		TwitterCall.failHandler(transport);
		
		this.controller.get("tap-4-more").update("Tap to load more");
	}.bind(this);
	
	this.getTimeline({max_id: oldestId, count: 50}, onSuccess, onFailure);
};

TimelineAssistant.prototype.getTimeline = function (args,onSuccess,onFailure) {
	if (this.page == "hometimeline") TwitterCall.hometimeline(args,onSuccess,onFailure);
	else if (this.page == "mentionstimeline") TwitterCall.mentionstimeline(args,onSuccess,onFailure);
};

TimelineAssistant.prototype.tweetModel = function (){
	switch(this.page){
	case "hometimeline":
		return this.homeTweetsModel;
		break;
	case "mentionstimeline":
		return this.mentionTweetsModel;
		break;
	};
};

TimelineAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

TimelineAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

TimelineAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
