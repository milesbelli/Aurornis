function StartupAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

StartupAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	//TwitterFormat.generateNonce();
	//Mojo.Log.info("Tstamp test:",requestParam.timeStamp);
	
	this.controller.setupWidget("tweetSpinner",
			this.attributes = {
			spinnerSize: "large",
			fps: 15,
	},
	this.model = {
			spinning: true,
			
	});
	var deviceHeight = this.controller.window.innerHeight;
	deviceHeight = deviceHeight/4;
	deviceHeight.toString();
	deviceHeight += "px";
	//Mojo.Log.info("height",deviceHeight);
	
	this.controller.get("tweetSpinner").style.marginTop = deviceHeight;
	this.controller.get("loadingText").update("Connecting to Twitter...");
	
	
	/* Setting up db for storing and retrieving Twitter token and any preferences.
	 * db acct structure will probably look like this:
	 * 
	 * acctdb = { usertoken, usersecret, screenname, [array, of, drafts], ... }
	 * 
	 * We will want to add prefs to this eventually, but I have yet to determine
	 * those.
	 * 
	 * Right now the only acct we'll have is "default" but in the future we could
	 * easily support multiple accounts, possibly by having an array with their
	 * names, then saving them in the depot by name, and then fetching them back
	 * out that way. 
	 * 
	 * Some of this works, but by all means continue to ignore it.*/
	this.depotOptions = {
			name: "ext:aurornisUser"
	};
	
	this.userdb = new Mojo.Depot(this.depotOptions,this.getUserAcct.bind(this),this.depotFailure.bind(this));
	
	
	TwitterCall.hometimeline({count: 35}, function(transport){
		var response = TwitterCall.getResponse(transport);
		
		//Mojo.Log.info("Original End:",response[response.length-1].text);
		
		Mojo.Controller.stageController.swapScene(
				{transition: Mojo.Transition.crossFade,
					name:"timeline"
					},
				{hometimeline: response},
				"hometimeline");
	});

};

StartupAssistant.prototype.genericSuccess = function(){
	Mojo.Log.info("generic success!");
};

StartupAssistant.prototype.getUserAcct = function(){
	Mojo.Log.info("db success");
	this.userdb.get("default",this.checkUserAcct.bind(this),this.depotFailure.bind(this));
};

StartupAssistant.prototype.checkUserAcct = function(dbResponse){
	if(dbResponse == null){
		Mojo.Log.info("It's null!");
		var userInfo = {
				token: "itsatoken",
				secret: "itsasecret",
				screenname: "milesbelli"
				};
		this.userdb.add("default",userInfo,this.genericSuccess.bind(this),this.depotFailure.bind(this));
	} else {
		Mojo.Log.info("Not null:",dbResponse.token);
	};
};

StartupAssistant.prototype.depotFailure = function(){
	Mojo.Log.info("db failure!");
};

StartupAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

StartupAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

StartupAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
