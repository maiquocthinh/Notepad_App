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
