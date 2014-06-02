
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

	App.limit = 50;
	App.offset = 0;

	$(document).ready(function()
	{
		App.Auth.login();
		App.API.get('https://api.diy.org/skills', {'limit': App.limit}, function(data)
														{
															App.skills = data.response;
															App.buildSkills()
														});
	});

	App.buildSkills = function()
	{
		$.each(App.skills, function(key, value)
		{
			$('.main > section').append('<span onclick="App.loadSkill(\'' + value.url + '\', \'' + value.title + '\', \'' + value.icons.small + '\')" class="grid-item">' +
											'<img src="https:' + (value.icons.medium).replace('https:', '') + '"/>' +
											'<span>' + value.title + '</span>' +
										'</span>');
		})

	}

	App.loadSkill = function(url, title, icon)
	{
		$('.main > .container').click(function(){
			$('.main > .container').hide();
		});

		App.API.get('https://api.diy.org/skills/' + url + '/challenges', {}, function(data)
		{
			App.challenges = data.response;
			App.buildChallenges(title, icon)
		});
	},

	App.loadMore = function()
	{
		App.offset += App.limit;
		App.API.get('https://api.diy.org/skills', {'limit': App.limit, 'offset': App.offset}, function(data)
		{
			App.skills = data.response;
			App.buildSkills()
		});
	}

	App.buildChallenges = function(title, icon)
	{
		$('.main > .container').show();
		$('.main > .container > .dialog > .header').html('<img src="https:' + (icon).replace('https:', '') + '"/><span>' + title + '</span>');
		$('.main > .container > .dialog > .content').html('');
		$.each(App.challenges, function(key, value)
		{
			$('.main > .container  > .dialog > .content').append('<span><img src="' + value.image.web_300.url + '"/><span>' + value.title + '</span></span>');
		})
	};

})(this)
