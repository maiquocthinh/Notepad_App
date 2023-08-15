// TABS
const tabs = Array.from(document.querySelectorAll('.c-tab'));
const tabContents = Array.from(document.querySelectorAll('.c-tab-content'));

if (tabs.length > 0 && tabContents.length > 0) {
	let tabActive =
		tabs.find(function (tab) {
			return tab.classList.contains('active');
		}) || tabs[0];

	let tabContentActive =
		tabContents.find(function (tabContent) {
			return tabContent.classList.contains('active');
		}) || tabContents[0];

	tabs.forEach(function (tab, index) {
		tab.onclick = function () {
			if (tab === tabActive) return;

			tabActive.classList.remove('active');
			tabContentActive.classList.remove('active');
			tab.classList.add('active');
			tabContents[index].classList.add('active');

			tabActive = tab;
			tabContentActive = tabContents[index];

			saveTab(index);
		};
	});

	function saveTab(index) {
		const url = new URL(window.location.href);

		const searchParams = new URLSearchParams(url.search);
		searchParams.set('tab', index);

		url.search = searchParams.toString();

		window.history.pushState(null, '', url.toString());
	}

	function getTab() {
		const urlParams = new URLSearchParams(window.location.search);
		const tabIndex = parseInt(urlParams.get('tab'));
		return !isNaN(tabIndex) ? tabIndex : -1;
	}

	// auto load tab
	(function loadTab() {
		const tabIndex = getTab();

		if (tabIndex !== -1) {
			// change tab
			tabActive.classList.remove('active');
			tabs[tabIndex].classList.add('active');
			tabActive = tabs[tabIndex];

			// change content
			tabContentActive.classList.remove('active');
			tabContents[tabIndex].classList.add('active');
			tabContentActive = tabContents[tabIndex];
		}
	})();
}

// NOTE PASSWORD
function initEventPasswordModal(noteId, havePassword, modalId) {
	const removePasswordBtn = document.querySelector(`#${modalId} .remove-pass-btn`);
	const setPasswordBtn = document.querySelector(`#${modalId} .set-pass-btn`);
	const passwordInput = document.querySelector(`#${modalId} .password-input`);

	if (havePassword) {
		removePasswordBtn.onclick = function () {
			// fetch api to remove pass
			fetch('/api/note/set-password/' + noteId, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: '' }),
			}).then(function (response) {
				if (response.ok) {
					response.json().then(function (result) {
						alert(result.message);
					});
				} else {
					response.json().then(function (result) {
						alert(result.error);
					});
				}
				document.location.reload();
			});
		};
		setPasswordBtn.parentElement.classList.add('hidden-force');
		passwordInput.classList.add('hidden-force');
		removePasswordBtn.classList.remove('hidden-force');
	} else {
		setPasswordBtn.onclick = function () {
			if (!passwordInput.value) return toggleModal(modalId);

			// fetch api to remove pass
			fetch('/api/note/set-password/' + noteId, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: passwordInput.value }),
			}).then(function (response) {
				if (response.ok) {
					response.json().then(function (result) {
						alert(result.message);
					});
				} else {
					response.json().then(function (result) {
						alert(result.error);
					});
				}
				document.location.reload();
			});
		};
		removePasswordBtn.classList.add('hidden-force');
		passwordInput.classList.remove('hidden-force');
		setPasswordBtn.parentElement.classList.remove('hidden-force');
	}
}

// NOTE DELETE
function deleteNote(noteId, event) {
	if (!confirm('Are you sure delete this note?')) return;

	// fetch api to delete note
	fetch('/api/note/delete/' + noteId, { method: 'DELETE' }).then(function (response) {
		if (!response.ok) {
			response.json().then(function (result) {
				alert(result.error);
			});
		} else {
			// remove element
			const tr = event.target.closest('tr');
			tr.classList.add('bg-red-100');
			setTimeout(function () {
				tr.remove();
			}, 300);
		}
	});
}

// NOTE BACKUP
function backupNote(noteId) {
	// fetch api to backup note
	fetch('/api/note/backup/' + noteId, { method: 'POST' }).then(function (response) {
		if (response.ok) {
			response.json().then(function (result) {
				alert(result.message);
			});
		} else {
			response.json().then(function (result) {
				alert(result.error);
			});
		}
	});
}

// NOTE DOWNLOAD
function downloadNote(noteId) {
	window.open('/api/note/download/' + noteId, '_blank');
}

// BACKUP_NOTE DELETE
function deleteBackupNote(backupNoteId, event) {
	if (!confirm('Are you sure delete this note?')) return;

	// fetch api to delete note
	fetch('/api/backup-note/delete/' + backupNoteId, { method: 'DELETE' }).then(function (response) {
		if (!response.ok) {
			response.json().then(function (result) {
				alert(result.error);
			});
		}

		// remove element
		const tr = event.target.closest('tr');
		tr.classList.add('bg-red-100');
		setTimeout(function () {
			tr.remove();
		}, 300);
	});
}

// BACKUP_NOTE DOWNLOAD
function downloadBackupNote(backupNoteId) {
	window.open('/api/backup-note/download/' + backupNoteId, '_blank');
}

// REVOKE SESSION
function revokeSession(sessionId, event) {
	// fetch api to delete note
	fetch('/api/revoke-session/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sid: sessionId }),
	}).then(function (response) {
		if (!response.ok) {
			response.json().then(function (result) {
				alert(result.error);
			});
		} else {
			// remove element
			const li = event.target.closest('li');
			li.classList.add('bg-red-100');
			setTimeout(function () {
				li.remove();
			}, 300);
		}
	});
}

// UPDATE ACCOUNT INFO
function updateAccountInfo({ email, password, avatar }) {
	console.log({ email, password, avatar });

	if (!email && !password && !avatar) return alert('Change account info fail!');

	fetch('/account', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password, avatar }),
	})
		.then(function (res) {
			if (!res.ok) {
				res.json().then(function (result) {
					alert(result.errors.join('/n'));
				});
			} else document.location.reload();
		})
		.catch(function () {
			alert('Change account info fail!');
		});
}

function uploadImage(event) {
	const API_URL = 'https://tame-red-clownfish-tutu.cyclic.app/image';

	const file = event.target.files[0];
	if (!file) return;

	const formData = new FormData();
	formData.append('image', file);

	fetch(API_URL, {
		method: 'POST',
		body: formData,
	})
		.then(function (res) {
			if (!res.ok) alert('Change avatar fail!');
			else {
				res.json().then(function (result) {
					if (!result.success) return alert('Change avatar fail!');
					updateAccountInfo({ avatar: result.data.link });
				});
			}
		})
		.catch(function () {
			alert('Change avatar fail!');
		});
}

function updateGeneralInfo(event) {
	event.preventDefault();
	const email = document.getElementById('email').value;

	// validate email
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Email invalid!');

	updateAccountInfo({ email });
}

function updatePassword(event) {
	event.preventDefault();
	const password = document.getElementById('password').value;
	const confirmPassword = document.getElementById('cf_password').value;

	// compare password with confirm_password
	if (password !== confirmPassword) return alert('Password and Confirm Password not match!');

	updateAccountInfo({ password });
}
