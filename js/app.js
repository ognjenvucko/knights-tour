var cnt = 1;
var MAX_ROWS = 4;
var MAX_COLS = 8;

var cache = [];
var rnd = [];

function getCoords(x, y) {
	return [
		[x+2, y+1], [x+2, y-1], [x-2, y+1], [x-2, y-1],
		[x+1, y+2], [x+1, y-2], [x-1, y+2], [x-1, y-2]
	];
}

function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function getCandidates() {
	while(rnd.length < 8){
	var randomnumber = Math.ceil(Math.random()*16)
	var found = false;
		for(var i = 0; i<rnd.length; i++){
			if(rnd[i] == randomnumber){
				found = true;
				break;
			}
		}
	if(!found) rnd[rnd.length] = randomnumber;
}
}

function containsPosition(array, position) {
	for(i = 0; i<array.length; i++) {
		if(array[i][0] == position[0] && array[i][1] == position[1]) {
			return true;
		}
	}
	return false;
}

function discoverAccessibleFields() {
	result = [];
	getCandidates();
	for(m = 1; m<=MAX_ROWS; m++) {
		for(n = 1; n<=MAX_COLS; n++) {
			cache[""+m+n] = [];
			coords = getCoords(m, n);
			for(i = 0; i<coords.length; i++) {
				var coord = coords[i];
				if(coord[0] >= 1 && coord[0] <= MAX_ROWS && coord[1] >= 1 && coord[1] <= MAX_COLS) {
					cache[""+m+n].push(coord);
				}
			}
			if(rnd.indexOf((m-1)*MAX_COLS + n) != -1) {
				cache[""+m+n] = shuffle(cache[""+m+n]);
			}
		}
	}
}

function solve(position, visited) {

	var accessible = [];

	if(MAX_ROWS*MAX_COLS == visited.length) {
		visited.push(position);
		return true;
	}

	if(containsPosition(visited, position)) return false;

	var key = "" + position[0] + position[1];
	if(typeof cache[key] === 'undefined') {
		discoverAccessibleFields();
	}
	accessible = cache[key];

	if(accessible.length > 0) {
		visited.push(position);
		for(var i = 0; i<accessible.length; i++) {
			if(solve(accessible[i], visited)) return true;
		}
		visited.pop();
	}
	return false;
}

function highlightOptions(x, y) {

	if(false == $(".x-" + x + ".y-" + y).hasClass('option')) return;

	$('.has-horse').removeClass('has-horse').addClass('visited');
	$('.option').removeClass('option');

	coords = getCoords(x, y);

	for(i=0; i<coords.length; i++) {
		if(coords[i][0] > 0 && coords[i][0] <=8 && coords[i][1] > 0 && coords[i][1] <=8) {
			selector = $(".x-" + coords[i][0] + ".y-" + coords[i][1]);
			if(false == selector.hasClass('visited')) selector.addClass('option');
		}
	}

	$('.result').text(cnt);
	$(".x-" + x + ".y-" + y).removeClass('option').addClass('has-horse').text(cnt++).show(400);
}

function nooo() {
	document.getElementById('nooo').play();
	$('.game-area').hide();
	$('.lol').show();
}

function hideHorses() {
	$("[class^='field']").addClass('num-visible');
	$("[class^='field']").removeClass('option').removeClass('has-horse').removeClass('visited');
}

function refresh() {
	cnt = 1;
	hideHorses();
	$("[class^='field']").removeClass('num-visible');
	$("[class^='field']").text('');
	$('.result').text(0);
	$(".x-1.y-1").addClass('option');
}

function playSolution (i, delay) {
	setTimeout(function () {
		highlightOptions(path[i][0], path[i][1]);
		i++;                     
		if (i < path.length) playSolution(i, delay);
	}, delay);
}

$(document).ready(function () {

	$("[class^='field']").click(function() {
		var classes = $(this).attr('class').split(' ');
		var x = parseInt(classes[1].substr(2,3));
		var y = parseInt(classes[2].substr(2.3));
		highlightOptions(x, y);
	});

	$(".action-ponovo").click(function() {
		refresh();
		$('.game-area').show();
		$('.lol').hide();
	});

	$(".action-nooo").click(function() {
		nooo();
	});

	$(".action-clear").click(function() {
		hideHorses();
	});

	$(".action-solve").click(function() {
		refresh();
		$('.game-area').show();
		$('.lol').hide();
		$("#loader").show();
		path = [];
		solve([1, 1], path);
		setTimeout(function() {
			playSolution(0, 300);
			$("#loader").hide();
		}, 1000);
	});

});