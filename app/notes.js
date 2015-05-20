'use strict';


localforage.config({
    driver      : localforage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
    name        : 'notesApp',
    version     : 1.0,
});

angular.module('myApp.notes', [])

.controller('NotesCtrl', ["$scope", function($scope) {

	$scope.notes = [];
	$scope.password = "";
	$scope.hasPassword = false;

	var password;

	$scope.load = function () {
		if ($scope.password.length < 8) {
			alert("please enter a password with at least 8 characters");
			$scope.password = "";

			return;
		}

		password = $scope.password;
		$scope.password = "";
		
		
		localforage.getItem("notes").then(function (savedNotes) {
			$scope.$apply(function () {
				if (savedNotes) {
					try {
						$scope.notes = JSON.parse(sjcl.decrypt(password, savedNotes));
						$scope.hasPassword = true;
					} catch (e) {
						alert("wrong password");
					}
				} else {
					$scope.notes = [];

					$scope.hasPassword = true;
				}
			});
		});
	};

	function save() {
		var encrypted = sjcl.encrypt(password, JSON.stringify($scope.notes));
		localforage.setItem('notes', encrypted);
	}

	$scope.newNote = "";

	$scope.remove = function (index) {
		$scope.notes.splice(index, 1);
		save();
	};

	$scope.add = function () {
		$scope.notes.push({
			text: $scope.newNote
		});
		$scope.newNote = "";
		save();
	};

}]);
