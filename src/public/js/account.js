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
		};
	});
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
		setPasswordBtn.parentElement.classList.add('hidden');
		passwordInput.classList.add('hidden');
		removePasswordBtn.classList.remove('hidden');
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
		removePasswordBtn.classList.add('hidden');
		passwordInput.classList.remove('hidden');
		setPasswordBtn.parentElement.classList.remove('hidden');
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
		}

		// remove element
		const tr = event.target.closest('tr');
		tr.classList.add('bg-red-100');
		setTimeout(function () {
			tr.remove();
		}, 300);
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
