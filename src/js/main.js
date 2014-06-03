(function(main)
{
	/**
	 * @class api class
	 *
	 *
	 */
	var api = {
		
		/**
		 * @property originUrl 
		 * @type string
		 */
		originUrl: 'https://api.diy.org',
	
		/**
		 * get api method
		 * ajax call wrapper
		 *
		 * @public
		 * @param url {string}
		 * @param data {object}
		 * @param onSuccess {function}
		 * @param onError {function}
		 * @return {void}
		 */
		getter: function(url, data, onSuccess, onError)
		{
			// jquery ajax method
			$.ajax(
			{
				url: this.originUrl + url,
				data: data,
				success: function(data)
				{
					if(data.head.code === 200)
					{
						onSuccess(data.response);
					}
					else
					{
						onError(data);
					}
				},
				error: function()
				{
					onError(arguments);
				}
			});
		}
	};

	/**
	 * @class skill render class
	 *
	 */
	var skillsClass = {
	
		/**
		 * @property offset
		 * @type int
		 */
		offset: 0,

		/**
		 * @property limit
		 * @tpye int
		 */
		limit: 10,
		
		/**
		 * load more results
		 *
		 * @public
		 * @return {void}
		 */
		loadMore: function()
		{
			this.offset += this.limit;
			
			this.getSkills();
		},
	
		/**
		 * render api results to DOM
		 *
		 * @public
		 * @return {void}
		 */
		render: function(result)
		{
			var body = $('#main');
			$.each(result, function(key, value)
			{
				if(result.hasOwnProperty(key)) 
				{	
					var icon = value.icons.small;
					if(!(/^https/.test(icon)))
					{
						icon = 'https:' + icon;
					}
						
					var row = $('<div class="row" data-url="' + value.url + '" ></div>');
					var imgContainer = $('<span class="img"></span>');
					var img = $('<img src="' + icon + '" />');
					var textContainer = $('<span class="text"></span>');
					var text = value.description;
						
					row.append(imgContainer.append(img))
						.append(textContainer.append(text));
							
					body.append(row);

					row.bind('click', function()
					{
						var url = $(this).attr('data-url');
						challengeClass.getChallenges(url);
					});
				}
			});
					
			var loadRow = $('#load-more');
			if(loadRow.length > 0)
			{
				loadRow.remove();
			}
					
			loadRow = $('<div id="load-more" class="row">Load More</div>');
					
			body.append(loadRow);
					
			loadRow.bind('click', function()
			{
				skillsClass.loadMore();
			});
		},
	
		/**
		 * errror callback function
		 *
		 * @public
		 * @return {void}
		 */
		onError: function(err)
		{
			console.log(err);
		},
		
		/**
		 * get skills
		 *
		 * @public
		 * @return {void}
		 */
		getSkills: function()
		{
			var data = {
				offset: this.offset,
				limit: this.limit
			};
			
			api.getter('/skills', data, this.render, this.onError);
		}
	};
	
	// global define
	window.skillClass = skillsClass;
	
	var challengeClass = {
		
		/**
		 * render api results to DOM
		 *
		 * @public
		 * @return {void}
		 */
		render: function(result)
		{
			// get dialog div
			var dialog = $('#dialog');

			// creates a dialog container to go inside the dialog
			var container = $('<div class="container"></div>');

			// loop over each result
			$.each(result, function(key, value)
			{
				// make sure the array key is a valid entry
				if(result.hasOwnProperty(key))
				{
					// get the image url and ensure it has https on it
					var icon = value.image.web_300.url;
					if(!(/^https/.test(icon)))
					{
						icon = 'https:' + icon;
					}

					// build the row for a challenge object
					var row = $('<div class="row"></div>');
					var imgContainer = $('<span class="img"></span>');
					var img = $('<img src="' + icon + '" />');
					var textContainer = $('<span class="text"></span>');
					var text = value.description;

					// append it to the container
					row.append(imgContainer.append(img))
						.append(textContainer.append(text));
					container.append(row);
				}
			});

			// add the container to the dialog
			dialog.html(container).addClass('active');

			// stop the clicks on the dialog from
			// closing the dialog
			container.click(function()
			{
				return false;
			});

			// close the dialog when clicked outside the container
			dialog.bind('click.close-dialog', function()
			{
				dialog.removeClass('active').unbind('click.close-dialog');
			});
		},

		/**
		 * errror callback function
		 *
		 * @public
		 * @return {void}
		 */
		onError: function(result)
		{
			console.log(result);
		},

		/**
		 * get challenges
		 *
		 * @public
		 * @param {url}
		 * @return {void}
		 */
		getChallenges: function(url)
		{
			var data = {
				offset: this.offset,
				limit: this.limit
			};
			
			api.getter('/skills/' + url + '/challenges' , data, this.render, this.onError);
		}
	};

	// document ready callback
	$(document).ready(function()
	{
		// start app
		skillsClass.getSkills();
	});

})(window);
