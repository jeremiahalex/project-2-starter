'use strict';

// ===============================================
// The following implementation was borrowed from:
// - https://bulma.io/lib/main.js?v=201712281510
// ===============================================

document.addEventListener('DOMContentLoaded', function () {

	var rootEl = document.documentElement;

	// ===============================================
	// # START: Navigation Bar Burger
	// 
	// This makes the navigation bar burger functional
	// ===============================================

	// Get all "navbar-burger" elements
	var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {

		// Add a click event on each of them
		$navbarBurgers.forEach(function ($el) {
			$el.addEventListener('click', function () {

				// Get the target from the "data-target" attribute
				var target = $el.dataset.target;
				var $target = document.getElementById(target);

				// Toggle the class on both the "navbar-burger" and the "navbar-menu"
				$el.classList.toggle('is-active');
				$target.classList.toggle('is-active');

			});
		});
	}
	// ============================
	// # END: Navigation Bar Burger
	// ============================

	// ==============================================
	// # START: Navigation Bar Scrolling Effect
	//
	// When user scrolls down the page:
	// - Navigation bar slides up to conceal itself
	// 
	// When user scrolls up the page:
	// - Navigation bar slides down to reveal itself
	// - Adds a subtle shadow beneath while scrolling
	// - Shadow disappears upon hitting the top
	// ==============================================

	var navbarEl = document.getElementById('navbar');
	var navbarBurger = document.getElementById('navbarBurger');
	var specialShadow = document.getElementById('specialShadow');
	var NAVBAR_HEIGHT = 52;
	var THRESHOLD = 160;
	var navbarOpen = false;
	var horizon = NAVBAR_HEIGHT;
	var whereYouStoppedScrolling = 0;
	var scrollFactor = 0;
	var currentTranslate = 0;

	navbarBurger.addEventListener('click', function (el) {
		navbarOpen = !navbarOpen;

		if (navbarOpen) {
			rootEl.classList.add('bd-is-clipped-touch');
		} else {
			rootEl.classList.remove('bd-is-clipped-touch');
		}
	});

	function upOrDown(lastY, currentY) {
		if (currentY >= lastY) {
			return goingDown(currentY);
		}
		return goingUp(currentY);
	}

	function goingDown(currentY) {
		var trigger = NAVBAR_HEIGHT;
		whereYouStoppedScrolling = currentY;

		if (currentY > horizon) {
			horizon = currentY;
		}

		translateHeader(currentY, false);
	}

	function goingUp(currentY) {
		var trigger = 0;

		if (currentY < whereYouStoppedScrolling - NAVBAR_HEIGHT) {
			horizon = currentY + NAVBAR_HEIGHT;
		}

		translateHeader(currentY, true);
	}

	function constrainDelta(delta) {
		return Math.max(0, Math.min(delta, NAVBAR_HEIGHT));
	}

	function translateHeader(currentY, upwards) {
		// let topTranslateValue;
		var translateValue = void 0;

		if (upwards && currentTranslate == 0) {
			translateValue = 0;
		} else if (currentY <= NAVBAR_HEIGHT) {
			translateValue = currentY * -1;
		} else {
			var delta = constrainDelta(Math.abs(currentY - horizon));
			translateValue = delta - NAVBAR_HEIGHT;
		}

		if (translateValue != currentTranslate) {
			var navbarStyle = '\n        transform: translateY(' + translateValue + 'px);\n      ';
			currentTranslate = translateValue;
			navbarEl.setAttribute('style', navbarStyle);
		}

		if (currentY > THRESHOLD * 2) {
			scrollFactor = 1;
		} else if (currentY > THRESHOLD) {
			scrollFactor = (currentY - THRESHOLD) / THRESHOLD;
		} else {
			scrollFactor = 0;
		}

		var translateFactor = 1 + translateValue / NAVBAR_HEIGHT;
		specialShadow.style.opacity = scrollFactor;
		specialShadow.style.transform = 'scaleY(' + translateFactor + ')';
	}

	translateHeader(window.scrollY, false);

	var ticking = false;
	var lastY = 0;

	window.addEventListener('scroll', function () {
		var currentY = window.scrollY;

		if (!ticking) {
			window.requestAnimationFrame(function () {
				upOrDown(lastY, currentY);
				ticking = false;
				lastY = currentY;
			});
		}

		ticking = true;
	});

	// ======================================
	// # END: Navigation Bar Scrolling Effect
	// ======================================

	// ===============
	// # START: Modals
	// ===============

	// Functions

	function getAll(selector) {
		return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
	}


	var $dropdowns = getAll('.dropdown:not(.is-hoverable)');
	function closeDropdowns() {
		$dropdowns.forEach(function ($el) {
			$el.classList.remove('is-active');
		});
	}

	// Modals

	var $modals = getAll('.modal');
	var $modalButtons = getAll('.modal-button');
	var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

	if ($modalButtons.length > 0) {
		$modalButtons.forEach(function ($el) {
			$el.addEventListener('click', function () {
				var target = $el.dataset.target;
				var $target = document.getElementById(target);
				rootEl.classList.add('is-clipped');
				$target.classList.add('is-active');
				activateFirstTextField(target); // Customization
			});
		});
	}

	if ($modalCloses.length > 0) {
		$modalCloses.forEach(function ($el) {
			$el.addEventListener('click', function () {
				closeModals();
			});
		});
	}

	document.addEventListener('keydown', function (event) {
		var e = event || window.event;
		if (e.keyCode === 27) {
			closeModals();
			closeDropdowns();
		}
	});

	function closeModals() {
		rootEl.classList.remove('is-clipped');
		$modals.forEach(function ($el) {
			$el.classList.remove('is-active');
		});
	}

	// =============
	// # END: Modals
	// =============

	// =======================================================
	// My custom extensions from the above code 
	// 
	// - Bottom link of sign up modal toggles the sign in form
	// - Bottom link of sign in modal toggles the sign up form 
	// =======================================================

	var $toggleOtherForm = getAll('.toggle-other-form');

	if ($toggleOtherForm.length > 0) {
		$toggleOtherForm.forEach(function($el) {
			$el.addEventListener('click', function() {
				var target = $el.dataset.target;
				var $target = document.getElementById(target);
				closeModals();
				rootEl.classList.add('is-clipped');
				$target.classList.add('is-active');
				activateFirstTextField(target);
			});
		});
	}

	// ==============================================
	// Set focus on the first text field in each form
	// ==============================================

	function activateFirstTextField(target){
		$('#' + target).find('.first-field').focus();
	}

	// if ($firstTextField.length > 0) {
	// 	$firstTextField.forEach(function($el) {
	// 		$el.addEventListener
	// 	});
	// }

	// ==============================================================
	// Load sign up or sign in modal if relevant hash is found in URL
	// ==============================================================

	function loadModalFromURL() {
		// Remove `#` from the hash string
		let hash = window.location.hash.substring(1);

		// Check if `hash` has a value, i.e., URL has hash
		if (hash) {
			// Toggle the modal called by the hash
			$('#' + hash).addClass('is-active');
			// Set the focus on the first text field in the form modal
			activateFirstTextField(hash);
			//  Remove `#signup` or `signin` from after adding `.is-active` CSS class
			removeHashFromURL();
		}

	}

	loadModalFromURL();

	// ====================================
	// Remove substrings after `#` from URL
	// ====================================

	function removeHashFromURL() {
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}
});