$(function () {
	function codes() {
		var network = NEJ.P("nej.j"),
			oldAjax = network.KH;

		network.KH = function (url, data) {
			// alert(url);
			data = data || {};
			data.headers = data.headers || {};
			
			data.headers['X-Real-IP'] = '118.88.88.88';
			
			return oldAjax.call(this, url, data);
		};

		window.undoInject = function () {
			network.KH = oldAjax;
			window.undoInject = undefined;
		};

		alert('代码已注入。\n\n若代码无效或发生问题请访问 https://jixun.moe/ 报告');
	}

	function updatePort () {
		var url = 'http://127.0.0.1:' + $('#port').val().trim() + '/json';
		$('#backup-url').attr('href', url);
		$('#debug-frame').attr('src', url);
	}

	$('#port')
		.change(updatePort)
		.keyup(function (e) {
			if (e.keyCode == 13) {
				updatePort();
				e.preventDefault();
			}
		});

	$('#inject').click(function () {
		runInShell(codes);
	});

	$('#un-inject').click(function () {
		runInShell(function () {
			window.undoInject();
		});
	});

	function runInShell (code) {
		var shell = new WebSocket($('#webSocketDebuggerUrl').val());
		shell.onopen = function () {
			shell.send(JSON.stringify({
				"id": 0,
				"method": "Runtime.evaluate",
				"params": {
					"expression": '(' + code.toString() + ')();'
				}
			}));
			shell.close();
		};

	}
});