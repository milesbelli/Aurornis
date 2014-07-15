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
