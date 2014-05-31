
(function()
{
	// namespace App
	var App = {};

	/**
	 * API class localizes the $.ajax calls in one place
	 * for easey maintanence
	 *
	 */
	App.API = {

		/**
		 * conveinence method for get calls
		 *
		 * @public
		 * @param url {string} api url
		 * @param data {object} parameters needed for the api call
		 * @param onSuccess {function} success callback
		 * @param onError {function} error callback
		 * @return {void}
		 */
		get: function(url, data, onSuccess, onError)
		{
			this._call(url, 'GET', data, onSuccess, onError);
		},

		/**
		 * conveinence method for post calls
		 *
		 * @public
		 * @param url {string} api url
		 * @param data {object} parameters needed for the api call
		 * @param onSuccess {function} success callback
		 * @param onError {function} error callback
		 * @return {void}
		 */
		post: function(url, data, onSuccess, onError)
		{
			this._call(url, 'POST', data, onSuccess, onError);
		},

		/**
		 * wrapper method for the $.ajax calls
		 *
		 * @private
		 * @param url {string} api url
		 * @param type {string} the api method type (POST | GET)
		 * @param data {object} parameters needed for the api call
		 * @param onSuccess {function} success callback
		 * @param onError {function} error callback
		 * @return {void}
		 */
		_call: function(url, type, data, onSuccess, onError)
		{
			data = data !== undefined ? data : {};
			onSuccess = onSuccess !== undefined ? onSuccess : function(){};
			onError = onError !== undefined ? onError : function(){};

			$.ajax(
			{
				url: url,
				type: type,
				data: data,
				success: onSuccess,
				error: onError
			});
		}
	};

	/**
	 * Authentication class
	 *
	 */
	App.Auth = {

		// user name to authenticate with
		user: 'suclimbing',

		// password to authenticate with
		password: 'Password01',
		
		// auth data store
		authData: null,

		/**
		 * authentication method
		 *
		 * @return {void}
		 */
		login: function()
		{
			var thisObj = this;
			$.ajax(
			{
				url: 'https://api.diy.org/authorize',
				beforeSend: function(xhr) 
				{
					xhr.setRequestHeader("Authorization", "Basic " + btoa(thisObj.user + ":" + thisObj.password)); 
				},
				processData: false,
				success: function (data) {
					console.log(data);
					if(data.head.code === 200)
					{
						thisObj.authData = data.respone;
					}
				},
				error: function(){
					console.log("Cannot get data", arguments);
				}
			});
		}
	};

	// set App namespace to the global namespace
	this.App = App;

	$(document).ready(function()
	{
		App.Auth.login();
	});

})(this)
