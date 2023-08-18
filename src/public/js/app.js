const textArea = document.getElementById('note_textarea');
if (textArea)
	textArea.onkeyup = function (event) {
		countWords(event.target.value);
		countChars(event.target.value);
	};

function countWords(value) {
	const wordCountElm = document.getElementById('word_count');

	const w = value.match(/\S+/g);

	wordCountElm.innerHTML = w !== null ? w.length : 0;
}

function countChars(value) {
	const charCountElm = document.getElementById('char_count');
	charCountElm.innerHTML = value ? value.length : 0;
}

// dropdown toggle
function toggleDropdown(event) {
	event.target.closest('.dropdown').querySelector('.dropdown_box').classList.toggle('hidden');
	event.target.closest('.dropdown').querySelector('.dropdown_overplay').classList.toggle('hidden');
}

// modal toggle
function toggleModal(idName) {
	const modal = document.getElementById(idName);

	function toggle() {
		document.querySelector(`#${idName} .modal_popup`).classList.toggle('hidden');
		document.querySelector(`#${idName} .modal_overplay`).classList.toggle('hidden');
	}

	if (!modal.dataset.init) {
		document.querySelectorAll(`#${idName} .modal_close`).forEach(function (elm) {
			elm.onclick = toggle;
		});

		modal.setAttribute('data-init', true);
	}

	return toggle();
}

// fullscreen toggle
function toggleFullscreen() {
	const mainArea = document.querySelector('.c-main-area');

	if (
		document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement
	) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			// Firefox
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			// Chrome, Safari and Opera
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			// Edge
			document.msExitFullscreen();
		}
	} else {
		if (mainArea.requestFullscreen) {
			mainArea.requestFullscreen();
		} else if (mainArea.mozRequestFullScreen) {
			// Firefox
			mainArea.mozRequestFullScreen();
		} else if (mainArea.webkitRequestFullscreen) {
			// Chrome, Safari and Opera
			mainArea.webkitRequestFullscreen();
		} else if (mainArea.msRequestFullscreen) {
			// Edge
			mainArea.msRequestFullscreen();
		}
	}
}

// increase fontsize
function increaseFontsize() {
	if (!textArea) return;
	const maxFontsize = 140;
	const currentFonsize = parseInt(window.getComputedStyle(textArea).fontSize);
	textArea.style.fontSize = (currentFonsize > maxFontsize ? maxFontsize : currentFonsize) + 4 + 'px';
}

// decrease fontsize
function decreaseFontsize() {
	const minFontsize = 12;
	if (!textArea) return;
	const currentFonsize = parseInt(window.getComputedStyle(textArea).fontSize);
	textArea.style.fontSize = (currentFonsize < minFontsize ? minFontsize : currentFonsize) - 2 + 'px';
}

// copy all
function copyAll(idName) {
	function selectElementContents(el) {
		var range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}

	selectElementContents(document.getElementById(idName));
	document.execCommand('copy');
}

// copy text to clipboard
function copyTextToClipboard(text) {
	const textArea = document.createElement('textarea');
	textArea.value = text;

	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.opacity = 0;

	document.body.appendChild(textArea);

	textArea.select();

	try {
		document.execCommand('copy');
		alert('Successfully copied: ' + text);
	} catch (err) {
		alert('Error when copying:', err);
	}

	document.body.removeChild(textArea);
}

// change slug of note
function changeSlug(event) {
	event.preventDefault();

	const inputSlug = event.target.querySelector('input[name="slug"]');

	fetch('/api/note/change-slug/' + NOTE_ID, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ slug: inputSlug.value }),
	}).then(function (response) {
		if (!response.ok) {
			response.json().then(function (result) {
				alert(result.error);
			});
		} else {
			window.location.href = '/' + inputSlug.value;
		}
	});
}

// set password of note
(function initEventPasswordModal(modalId) {
	const removePasswordBtn = document.querySelector(`#${modalId} .remove-pass-btn`);
	const noteLogoutBtn = document.querySelector(`#${modalId} .note-logout-btn`);
	const setPasswordBtn = document.querySelector(`#${modalId} .set-pass-btn`);
	const passwordInput = document.querySelector(`#${modalId} .password-input`);

	if (removePasswordBtn)
		removePasswordBtn.onclick = function () {
			// fetch api to remove pass
			fetch('/api/note/set-password/' + NOTE_ID, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: '' }),
			}).then(function (response) {
				if (response.ok) {
					removePasswordBtn.parentElement.classList.add('hidden-force');
					passwordInput.classList.remove('hidden-force');
					setPasswordBtn.parentElement.classList.remove('hidden-force');
					noteLogoutBtn.dispatchEvent(new Event('click'));
				} else {
					response.json().then(function (result) {
						alert(result.error);
					});
				}
				toggleModal(modalId);
			});
		};

	if (setPasswordBtn)
		setPasswordBtn.onclick = function () {
			if (!passwordInput.value) return toggleModal(modalId);

			// fetch api to remove pass
			fetch('/api/note/set-password/' + NOTE_ID, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: passwordInput.value }),
			}).then(function (response) {
				if (response.ok) {
					passwordInput.value = '';
					setPasswordBtn.parentElement.classList.add('hidden-force');
					passwordInput.classList.add('hidden-force');
					removePasswordBtn.parentElement.classList.remove('hidden-force');
				} else {
					response.json().then(function (result) {
						alert(result.error);
					});
				}
				toggleModal(modalId);
			});
		};

	if (noteLogoutBtn)
		noteLogoutBtn.onclick = function () {
			const NOTE_SLUG = window.location.href.match(/\/([^\/]+)$/)[1];

			fetch('/api/note/logout', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ slug: NOTE_SLUG }),
			}).then(function (response) {
				if (response.ok) {
					window.location.href = '/login/' + NOTE_SLUG;
				} else {
					response.json().then(function (result) {
						alert(result.error);
					});
				}
			});
		};
})('modal_password');
