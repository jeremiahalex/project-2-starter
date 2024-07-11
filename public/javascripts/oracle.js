// Note: See the bottom on how a hexagram from the yarrow stalk oracle is obtained

// Data Structure for the Divination Record
var divination = {
	query: String,
	date: Date,
	data: {
		raw: {
			line1: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			},
			line2: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			},
			line3: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			},
			line4: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			},
			line5: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			},
			line6: {
				split1: { left: Number, right: Number },
				split2: { left: Number, right: Number },
				split3: { left: Number, right: Number }
			}
		},
		hexagram: {
			// name: String,
			// number: Number,
			array: [Number, Number, Number, Number, Number, Number],
			string: String,
			object: {
				line1: Number, line2: Number, line3: Number,
				line4: Number, line5: Number, line6: Number
			}
		}
	}
}

class Hexagram {
	constructor(array) {
		this.array = array;
		this.line1 = array[0];
		this.line2 = array[1];
		this.line3 = array[2];
		this.line4 = array[3];
		this.line5 = array[4];
		this.line6 = array[5];
	}
	string() {
		let string = this.array.join("");
		return string;
	}
	object() {
		let object = {
			line1: this.line1,
			line2: this.line2,
			line3: this.line3,
			line4: this.line4,
			line5: this.line5,
			line6: this.line6
		};

		return object;
	}
	name() {
		let name;
		for (let key in dictionary) {
			if (this.string() == key) {
				number = dictionary[key].name;
			}
		}
		return name;
	}
	number() {
		let number;
		for (let key in dictionary) {
			if (this.string() == key) {
				number = dictionary[key].number;
			}
		}
		return number;
	}
	binary() {
		let array = this.array.map(function(line) {
			switch (line) {
				case 6:
				case 8:
				return 2;
				case 7:
				case 9:
				return 1;
			}
		});
		let string = array.join("");
		return string;
	}
}

$(document).ready(function() {

	// Event listener to trigger smooth scroll to Step Two after pressing "Start" in Step One
	$('a').on('click', function(event) {
		// Make sure this.hash has a value before overriding default behavior
		if (this.hash !== '') {
			// Prevent default anchor click behavior
			event.preventDefault();

			// Store hash
			let hash = this.hash;

			setTimeout(function() {
				if (document.body.scrollHeight > window.innerHeight) {
					// Use jQuery's animate() method to add smooth page scroll
					// 800 specifies the number of milliseconds it takes to scroll to the specified area
					$('html, body').animate(
						{ scrollTop: $(hash).offset().top - ($('#navbar').height() * 0.9) }, 800, function(){
						// Add hash (#) to URL when done scrolling (default click behavior)
						// window.location.hash = hash;
					});
				}
			}, 50)
		}
	});


	// Sets where the data from splitting the stalks will be recorded
	var rawData = divination.data.raw;


	class Stalks {
		// The Book of Changes states, "The number (of stalks) that represents the totality of development is fifty." Hence, even though only up to 49 stalks is used, the constant is declared below as a nod to tradition.
		static total() { return 50; }
		// The Book of Changes continues, "…of which forty-nine are used". So one is taken out from fifty and the rest are used.
		static inUse() { return Stalks.total() - 1; }

		constructor() {
			// This is the stalks left after the completion of each round and passed to the next. It is initialized as forty-nine for the first round.
			this.remainingStalks = Stalks.inUse();
			// This sets the maximum number stalks available for spliting. Two is taken out because the right pile must always have at least two stalks, one to represent Earth and one Mankind.
			this.stalksToSplit = this.remainingStalks - 2;
			// This sets the starting position of the gap in the stalks and the slider handle
			this.gapPosition = Math.floor(this.remainingStalks / 2);
		}
	}


	// Tracks the progress of divination.
	class Progress {
		constructor() {
			this.current = {
				// Both starts from 1.
				round: 1,
				line: 1
			}
		}
		nextRound() {
			// Increases `currentRound` by 1 spliting and recording.
			this.current.round++
			// Checks if all three rounds to obtain a line are completed.
		}
		nextLine() {
			if (this.current.round == 4) {
				// Reset `currentRound` to 1
				this.current.round = 1;
				// Increase `currentLine` by 1 to continue to the next line
				this.current.line++;
				// If `currentLine` is 7, the hexagram is completed.
				if (this.current.line == 7) {
					// Reset `currentLine` to 1
					this.current.line = 1;
					$('#stalks-container').off();
					$('#is-submit-prompt').removeClass('is-invisible');
					$('#is-split-button').prop('disabled', true);
					$('#is-submit-button').prop('disabled', false);
					// Smooth scroll to Step Three
					$('html, body').animate(
						{ scrollTop: $('#step-three').offset().top - 24 }, 800, function(){
						// Add hash (#) to URL when done scrolling (default click behavior)
						// window.location.hash = '#step-three';
					});
				}
			}
		}
	}


	function createOneStalkNode(stalkNumber) {
		let template = document.querySelector('#stalk');
		let stalkClone = document.importNode(template.content, true);

		// Individual `div` node containing stalk image and CSS `padding-top`.
		let divElement = document.createElement('div');
		divElement.classList.add('stalk-position');
		divElement.id = 'position-' + stalkNumber;
		// Generate random number for CSS `padding-top` to be inserted to each `div` containing the yarrow stalk image.
		let stalkPadding = Math.floor(Math.random() * 20);
		divElement.style.paddingTop = stalkPadding + 'px';

		// Append `imgElement` into `divElement`
		divElement.appendChild(stalkClone);

		return divElement;
	}

	// 1. Load yarrow stalks from the previous round, if any.
	// 2. For the first round of each hexagram line, it's simply `Stalks.inUse`, i.e. 49.
	function initializeStalks(stalksLastRound) {
		let stalksContainer = document.getElementById('stalks-container');
		let newStalkNodes = document.createDocumentFragment();
		for (let stalk = 1; stalk <= stalksLastRound; stalk++) {
			let stalkNode = createOneStalkNode(stalk);
			// Append individual stalk node `stalkDisplay` to document fragment `newStalkNodes`.
			newStalkNodes.appendChild(stalkNode);
			// Insert a gap at where the slider's default position will be to prevent the stalks on the right of the gap from closing the gap when the user is sliding or hovering over the stalks.
			if (stalk == round.gapPosition) {
				let gapDiv = document.createElement('div');
				gapDiv.id = 'gap-'+ round.gapPosition;
				gapDiv.classList.add('gap');
				newStalkNodes.appendChild(gapDiv);
			}
		}
		// Append 49 yarrow stalks with randomized CSS `padding-top`.
		stalksContainer.appendChild(newStalkNodes);
	}


	// Ensures a constant number of elements (i.e., row stalks plus one gap) and hence smoother "animation" and better capture of `hover` and `click` events.
	function maintainTheGap(newGapPosition) {
		// If gap exists gap among the stalks, remove old gap before inserting new gap.
		let doesGapExist = ($('#stalks-container').has(".gap").length);
		if (doesGapExist == 1) {
			// Removes old gap from the prior position.
			$('.gap').remove();
		}
		// Inserts a new gap at the new position hovered over.
		$('#position-' + newGapPosition).after('<div id="gap-'+ newGapPosition + '" class="gap"></div>');
		// Set new slider handle position from new gap.
		document.getElementById('slider-bar').noUiSlider.set(newGapPosition);
	}


	function detectHover() {
		let stalks = document.getElementsByTagName('svg')
		let stalkPositionDivElements = document.getElementsByClassName('stalk-position')

		for (let stalk of stalks) {
			stalk.addEventListener(
				'mouseover',
				event => {
					// Grabs the `id` number of the stalk that is hovered over.
					// let hoveredStalk = event.target.id.split('-')[1];
					let hoveredStalkPositionDivElement = $(event.srcElement).closest('div', stalkPositionDivElements)[0];
					let hoveredStalk = hoveredStalkPositionDivElement.id.split('-')[1];
					/*
						1. Prevents a gap from being added to the last and last second stalk on the right side.
						2. This is because the right pile must have at least 2 stalks as one of it will be set aside, leaving only one to form the right pile.
					*/
					if (hoveredStalk != round.remainingStalks && hoveredStalk != round.remainingStalks - 1) {
						maintainTheGap(hoveredStalk);
					}
				}
			)
		}
		// TODO: Remove when event listener on inline SVG is robust
		// $('.stalk-position').hover(function(event) {
		// 	// Grabs the `id` number of the stalk that is hovered over.
		// 	let hoveredStalk = event.target.id.split('-')[1];
		// 	/*
		// 	1. Prevents a gap from being added to the last and last second stalk on the right side.
		// 	2. This is because the right pile must have at least 2 stalks as one of it will be set aside, leaving only one to form the right pile.
		// 	*/
		// 	if (hoveredStalk != round.remainingStalks && hoveredStalk != round.remainingStalks - 1) {
		// 		maintainTheGap(hoveredStalk);
		// 	}
		// });
	}


	// Initializes and appends the slider below the yarrow stalks
	function initializeSlider(maximumValue, handlePositon) {
		$('#has-slider-bar').append('<div id="slider-bar"></div>');
		noUiSlider.create(document.getElementById('slider-bar'), {
			start: handlePositon,
			range: {
				'min': 1,
				'max': maximumValue
			},
			step: 1,
			// behaviour: 'tap',
			animate: true,
			animationDuration: 150
		});

		document.getElementById('slider-bar').noUiSlider.on('slide', function() {
			let gapFromSlider = Number(document.getElementById('slider-bar').noUiSlider.get());
			maintainTheGap(gapFromSlider);
		});
	}


	function captureSplit() {
		let splitHere;

		function getHandlePosition(event) {
			// Prevents page from default reloading behavior
			event.preventDefault();
			// Get value from slider handle position
			let handlePosition = document.getElementById('slider-bar').noUiSlider.get()
			// Get and value of the slider handle.
			splitHere = handlePosition;
			splitAndSort(splitHere);
		}

		// Event listener for click on `Split` button
		$('#is-split-button').on('click', getHandlePosition)

		function getGapPosition(event) {
			// Get `id` attribute of what was clicked in the stalks.
			let clickedElement = event.target.id;
			// Checks that the user is clicking on the gap.
			if (clickedElement.split('-')[0] == 'gap'){
				// If so, get the number portion of the `id` attribute and convert to `Number`.
				splitHere = Number(clickedElement.split('-')[1]);
				splitAndSort(splitHere);
			} else {
				// Otherwise, do nothing and return.
				return;
			}
		}

		// Event listener for click on gap between left and right pile
		$('#stalks-container').on('click', getGapPosition);
	}


	function splitIntoPiles(splitPosition, progress, record) {
		// Left pile, representing Heaven, is stalks on the left of the split.
		let leftPile = Number(splitPosition);
		// Right pile, representing Earth, is stalks on the right of the split. One stalk will be taken out later, representing Mankind, before sorting into fours.
		let rightPile = Number(round.remainingStalks - splitPosition);

		// Record result to `divination.data.raw`
		record['line' + progress.current.line]['split' + progress.current.round].left = leftPile;
		record['line' + progress.current.line]['split' + progress.current.round].right = rightPile;

		let twoPiles = {
			left: leftPile,
			right: rightPile
		};

		return twoPiles;
	}


	function determineRemainder(twoPiles) {
		let leftRemainder, rightRemainder;

		leftRemainder = (twoPiles.left % 4) == 0 ? leftRemainder = 4 : leftRemainder = (twoPiles.left % 4);
		rightRemainder= ((twoPiles.right - 1) % 4) == 0 ? rightRemainder = 4 : rightRemainder = ((twoPiles.right - 1) % 4);

		let twoRemainders = {
			left: leftRemainder,
			right: rightRemainder
		};

		return twoRemainders;
	}


	function sortIntoFours(twoPiles, twoRemainders) {
		let leftSetsOfFours = (twoPiles.left - twoRemainders.left) / 4;
		let rightSetsOfFours = ((twoPiles.right - 1) - twoRemainders.right) / 4;

		let setsOfFour = {
			left: leftSetsOfFours,
			right: rightSetsOfFours,
			total: leftSetsOfFours + rightSetsOfFours
		}

		return setsOfFour;
	}


	function endOfRound(twoRemainders, setsOfFour, progress) {
		let stalksTakenOut = twoRemainders.left + twoRemainders.right + 1;
		let remainingStalks = round.remainingStalks - stalksTakenOut;
		let line;

		if (progress.current.round == 3) {
			line = setsOfFour.total;
			console.log('Obtained line ' + line);
			divination.data.hexagram.array[progress.current.line - 1] = line;
			console.log(divination.data.hexagram.array);
		}

		let data = {
			stalks: {
				remaining: remainingStalks,
				takenOut: stalksTakenOut
			},
			line: line
		}

		return data;
	}


	function prepareNextRound(result, progress) {
		let currentGapPosition= Number(document.getElementsByClassName('gap')[0].getAttribute('id').split('-')[1]);

		if (progress.current.round == 4) {
			round = new Stalks()
			if (!(progress.current.line == 6)) {
			// Replenish stalks unless it is after round three of line 6
				addStalks(result.stalks.remaining, result.stalks.takenOut);
			}
		} else {
			round.remainingStalks = result.stalks.remaining;
			round.stalksToSplit = round.remainingStalks - 2;
			round.gapPosition = Math.floor(round.remainingStalks / 2);
			removeStalks(round.remainingStalks, result.stalks.takenOut, round.gapPosition);
		}

		if (currentGapPosition < round.stalksToSplit) {
			// If `currentGapPosition` is within remaining stalks less two, keep the gap at the current position.
			// console.log('Maintaining current gap position…')
			// console.log('currentGapPosition: ', currentGapPosition)
			// console.log('round.stalksToSplit:',round.stalksToSplit)
			maintainTheGap(currentGapPosition);
			document.getElementById('slider-bar').noUiSlider.destroy() ;
			initializeSlider(round.stalksToSplit, currentGapPosition);
		} else {
			// If `currentGapPosition` is beyond the remaining stalks less two, recenter gap among the remaining stalks.
			// console.log('Recentering gap position…')
			// console.log('currentGapPosition: ', currentGapPosition)
			// console.log('round.stalksToSplit: ',round.stalksToSplit)
			maintainTheGap(round.gapPosition);
			document.getElementById('slider-bar').noUiSlider.destroy() ;
			initializeSlider(round.stalksToSplit, round.gapPosition);
		}

		detectHover();
	}


	function splitAndSort(split) {
		// console.log('Progress', progress);
		var piles = splitIntoPiles(split, progress, rawData);
		var remainders = determineRemainder(piles);
		var fours = sortIntoFours(piles,remainders);
		var result = endOfRound(remainders, fours, progress);
		updateTable(progress, piles, result);
		progress.nextRound();
		prepareNextRound(result, progress);
		progress.nextLine();
		// console.log('Left and Right Piles');
		// console.log(piles);
		// console.log('Left and Right Remainders');
		// console.log(remainders);
		// console.log('Left and Right Sets of Fours');
		// console.log(fours);
		// console.log('Result at End of Round');
		// console.log(result);
		// console.log('Updated Progress');
		// console.log(progress);
	}


	function removeStalks(remainingStalks, stalksTakenOut, recenteredGap) {
		let lastStalkPosition = remainingStalks + stalksTakenOut;
		// let lastStalkPosition = Number($('.stalk-position').last().attr('id').split('-')[1]);

		// Remove the stalk one by one from the last stalk on the right until only the stalks for the next round are left
		for (let stalk = lastStalkPosition; stalk > remainingStalks; stalk--) {
			// $('#position-' + stalk).remove();
			document.getElementById('position-' + stalk).remove();
		}
	}


	function addStalks(stalksRemaining, stalksTakenOut) {
		// Disable event listeners to capture the split while stalks are replenished
		$('#stalks-container').off();
		$('#is-split-button').off();
		// Disable split button while stalks are replenished
		$('#is-split-button').prop('disabled', true);

		let stalksContainer = document.getElementById('stalks-container');
		let lastStalkPosition = stalksRemaining + stalksTakenOut;
		// let lastStalkPosition = Number($('.stalk-position').last().attr('id').split('-')[1]);
		let nextStalkPosition = lastStalkPosition + 1;
		let stalksToAdd = Stalks.inUse() - lastStalkPosition;
		let newStalkNodes = document.createDocumentFragment();

		for (let stalk = nextStalkPosition; stalk <= Stalks.inUse(); stalk++) {
			let stalkNode = createOneStalkNode(stalk);
			// Append individual stalk node `stalkDisplay` to document fragment `newStalkNodes`.
			newStalkNodes.appendChild(stalkNode);
		}
		// Append new stalks nodes `newStalkNodes` needed to replenish stalks to 49.
		stalksContainer.appendChild(newStalkNodes);

		setTimeout(function() {
			// Re-enable Split button after stalks are replenished
			$('#is-split-button').prop('disabled', false);
			// Re-enable event listeners for both the stalks and slider after stalks are replenished
			captureSplit();
		}, 200);
	}


	function updateTable(progress, piles, result) {
		let line = progress.current.line;
		let round = progress.current.round;
		let left = piles.left;
		let right = piles.right;
		let value = result.line;
		// console.log(line)
		// console.log(round)
		$('#L' + line + '-S' + round + '-L').val(left);
		$('#L' + line + '-S' + round + '-R').val(right);

		if (round == 3) {
			$('#Line-' + line).val(value);
		}
	}


	function startQuery(){
		// If query field is empty, insert `?`
		if (!$('#query-field').val()) {
			$('#query-field').val('?');
		}

		let query = $('#query-field').val();
		// Hide input form and Start button
		$('#contains-query-field').hide();
		// Render user's query as the title in the hero object
		$('#insert-query-here').append('<div id="contains-query" class="tile is-parent is-vertical"><p class="subtitle is-size-2 has-text-weight-light has-text-centered">' + query + '</p></div>')

		// Enable Split button
		$('#is-split-button').prop('disabled', false);
		// Enable event listeners for both the stalks and slider
		captureSplit();
	}

	// Start with the stalks and Split button disabled until user presses Start button
	$('#stalks-container').off();
	$('#start-divination').click(startQuery);

	// Initialize progress tracker and stalks
	var progress = new Progress();
	var round = new Stalks();
	initializeStalks(round.remainingStalks);

	// Detect hover over the stalks
	detectHover();

	// Initialize slider
	initializeSlider(round.stalksToSplit, round.gapPosition);
});

/*

# Hexagram Routine

1. Go through three rounds of Line Routine to obtain a line.
	- Only stalks sorted in fours are used for the next round.
2. Obtain six lines to form a hexagram.

# Line Routine

Do this routine thrice to obtain a line in the hexagram.

1. Split into two piles.

2. Take one out from right pile.

3. (a) Sort each pile into fours and set aside the remainder.
   (b) If the pile can be sorted into fours without leftovers, then remainder is 4.

4. (a) Add up and set aside the following:
		- remainder from left pile,
		- remainder from right pile, and
		- the one taken out in step 2.

   (b) They should add up to:
		- 9 or 5 in the first round, or
		- 8 or 4 in the second and round.

Gather the sorted fours and use them for the next round.

## After three rounds of Line Routine

1. (a) Count the sets of sorted fours remaining to get determine the line obtained.
   (b) There should be 6, 7, 8 or 9 sets of sorted fours.

2. Check that stalks aside from all three rounds and the sorted fours add up to 49 stalks.

*/
