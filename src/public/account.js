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
