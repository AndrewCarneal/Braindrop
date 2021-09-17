function submitDroplet() {
	$.post('/submit', { content: $('#dropletTextbox').val() }, function() {
		console.log('submitting');
	})
		.done(function() {
			console.log('success');
		})
		.fail(function() {
			console.log('error');
		})
		.always(function() {
			console.log('finished');
			location.reload();
		});
}

function fetchDroplets() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/droplets', true);
	dropletList.innerHTML = '';
	xhr.onload = function() {
		// Request finished. Do processing here.
		var res = JSON.parse(xhr.response);
		var droplets = res.posts;

		if (!droplets.length) {
			$('#dropletList').append(
				'Nothing to see here. Add some Droplets above!'
			);
		}
		for (var i = 0; i < droplets.length; i++) {
			$('#dropletList').append(
				`<li class="border-bottom my-2 pb-2 d-flex justify-content-between align-items-center">${droplets[i]}<button class="btn btn-outline-danger" data-id="${i}" onclick="deleteDroplet(this)">Delete</button></li>`
			);
		}
		$('#dropletSpinner').hide();
	};

	xhr.send(null);
}

function deleteDroplet(e) {
	$.post('/delete/' + e.dataset.id, function() {
		console.log('sending');
	}).done(function() {
		console.log('success');
		location.reload();
	});
}

function deleteAllDroplets() {
	if (
		confirm(
			'Are you sure you want to delete all droplets? This cannot be undone.'
		)
	) {
		$.post('/deleteall/', function() {
			console.log('sending');
		})
			.done(function() {
				console.log('success');
			})
			.fail(function() {
				console.log('error');
			})
			.always(function() {
				console.log('finished');
				location.reload();
			});
	} else {
	}
}

$(function() {
	$('#dropletTextbox').val('');
	fetchDroplets();

	$('#addDropletForm').on('submit', () => {
		submitDroplet();
		return false;
	});
});
