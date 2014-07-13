/*
	The MIT License (MIT)
	
	Copyright (c) <year> <copyright holders>
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
 */

/*
 * Sample database structure:
 * 
 * {
 * 		"task1": "Label applied to button for task 1",
 * 		"task2": "Label applied to button for task 2",
 * 		"task3": "Label applied to button for task 3",
 * 		"31122014": {			// a record of the tasks completed on the 31st of December 2014
 * 			"task1": true		// true if this task was completed on this day
 * 			"task2": undefined 	// undefined tasks have not been completed
 * 			"task3": undefined 	// undefined tasks have not been completed
 * 		},
 * 		"03012015": {			// a record of the tasks completed on the 3rd of January 2015
 * 			"task1": true		// true if this task was completed on this day
 * 			"task2": undefined 	// undefined tasks have not been completed
 * 			"task3": undefined 	// undefined tasks have not been completed
 * 		}
 * }
 */

var DATABASE_LS_KEY = "database";
var TODAY_FORMAT = "DDMMYYYY";
var REPORT_DAYS = 7;

jQuery(showWelcomeMessage);
jQuery(updateDisplay);
jQuery(refreshDisplay(getToday()));

function showWelcomeMessage() {
	if (!hasDatabase()) {
		jQuery("#welcomeMessage").show();
	}
}

function refreshDisplay(date) {
	
	var now = getToday();
	
	if (date !== now) {
		updateDisplay();
	}
	
	window.setTimeout(function() {
		refreshDisplay(now);
	}, 1000);
}

function hasDatabase() {
	return localStorage.getItem(DATABASE_LS_KEY) !== null;
}

function getDatabase() {
	return JSON.parse(localStorage.getItem(DATABASE_LS_KEY)) || {};
}

function saveDatabase(database) {
	localStorage.setItem(DATABASE_LS_KEY, JSON.stringify(database));
}

function updateDisplay() {	
	updateButtonState();
	updateReport();
}

function getToday() {
	return moment().format(TODAY_FORMAT);
}

function setButtonAsNotCompleted(id) {
	jQuery("#" + id + "done").css("display", "none");
}

function setButtonAsCompleted(id) {
	jQuery("#" + id + "done").css("display", "initial");
}

function getNegDone(database, taskNum) {
	if (database[getToday()][taskNum]) {
		return undefined;
	} else {
		return true;
	}
}

function startEdit(taskNum) {
	_.each(["task1", "task2", "task3"], function(element) {
		jQuery("#" + element).show();
		jQuery("#" + element + "editstartbutton").show();
		jQuery("#" + element + "edit").hide();
		jQuery("#" + element + "editendbutton").hide();
	});
	
	jQuery("#" + taskNum).hide();
	jQuery("#" + taskNum + "editstartbutton").hide();
	jQuery("#" + taskNum + "edit").show();
	jQuery("#" + taskNum + "editendbutton").show();
	jQuery("#" + taskNum + "edit").focus();
}

function endEdit(taskNum) {
	var database = getDatabase();
	var val = jQuery("#" + taskNum + "edit").val().trim();
	if (val) {
		database[taskNum] = jQuery("#" + taskNum + "edit").val();	
		saveDatabase(database);
		updateDisplay();
	}
	
	jQuery("#" + taskNum).show();
	jQuery("#" + taskNum + "editstartbutton").show();
	jQuery("#" + taskNum + "edit").hide();
	jQuery("#" + taskNum + "editendbutton").hide();
}

function keypress(e, taskNum) {
	if (e.keyCode === 13) {
		endEdit(taskNum);
	}
	
	return true;
}

function toggleTask(taskNum) {
	var database = getDatabase();
	if (!database[getToday()]) {
		database[getToday()] = {};
	}

	database[getToday()][taskNum] = getNegDone(database, taskNum);

	saveDatabase(database);
	
	updateDisplay();
}

function updateButtonState() {
	_.each(["task1", "task2", "task3"], function(element) {
		setButtonAsNotCompleted(element);
	});
	
	var database = getDatabase();
	if (database[getToday()]) {
		
		_.each(["task1", "task2", "task3"], function(element) {
			if (database[getToday()][element]) {
				setButtonAsCompleted(element);
			}
			
			
		});
	}
	
	_.each(["task1", "task2", "task3"], function(element) {
		if (database[element]) {
			jQuery("#" + element + "contents").text(database[element]);
		} else {
			jQuery("#" + element + "contents").text("Edit With The Pencil Button");
		}
	});
}

function updateReport() {
	var database = getDatabase();
	var days = [];
	for (var day = 0; day < REPORT_DAYS; ++day) {
		days.push(moment().subtract(day, "days").format(TODAY_FORMAT));
	}
	var completedTasks = _.reduce(days, function(memo, dayElement) {
		var count = 0;
		if (database[dayElement]) {
			_.each(["task1", "task2", "task3"], function(element) {			
				if (database[dayElement][element]) {
					++count;
				}
			});
		}
		return count + memo;
	}, 0);
	
	jQuery("#report").text((completedTasks / (REPORT_DAYS * 3) * 100).toFixed(2) + "%");
}