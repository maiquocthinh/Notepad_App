function debounce(func, timeout = 300) {
	let timer;

	return function (...args) {
		if (timer) clearTimeout(timer);

		const _this = this;

		timer = setTimeout(function () {
			func.apply(_this, args);
		}, timeout);
	};
}

const socket = io(`ws://${location.host}`);

socket.emit('joinRoom', NOTE_ID);

textArea.addEventListener(
	'keyup',
	debounce(function (event) {
		const data = {
			roomId: NOTE_ID,
			content: event.target.value,
			cursorLocation: event.target.selectionStart,
		};
		socket.emit('editing', data);
	}, 800),
);

socket.on('update', function (data) {
	textArea.value = data.content;
	textArea.selectionStart = data.cursorLocation;
	textArea.selectionEnd = data.cursorLocation;
	textArea.focus();
});
