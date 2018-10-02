//Holds and keeps track of what cells are full or empty
var holder;
var newHolder;
var yMax = 10;
var xMax = 10;
var fullColor = "#F26430";
var emptyColor = "#F6F7EB";
var speedSlider;
var speedOutput;
var widthSlider;
var widthOutput;
var heightSlider;
var heightOutput;
var speed;
var playId;

$("document").ready(function(){
	
	//Get values for slider and output
	//https://www.w3schools.com/howto/howto_js_rangeslider.asp
	speedSlider = document.getElementById("speed");
	speedOutput = document.getElementById("speedDisplay");
	speed = speedSlider.value;
	speedOutput.innerHTML = speedSlider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	speedSlider.oninput = function() {
		speedOutput.innerHTML = this.value;
		speed = this.value;
		if(playId){
			clearInterval(playId);
			Play();
		}
	}
	
	widthSlider = document.getElementById("width");
	widthOutput = document.getElementById("widthDisplay");
	xMax = widthSlider.value;
	widthOutput.innerHTML = widthSlider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	widthSlider.oninput = function() {
		widthOutput.innerHTML = this.value;
		xMax = this.value;
		$("#main").html(MakeTable(yMax,xMax));
		if(playId){
			clearInterval(playId);
		}
		setUptdClick();
	}
	
	heightSlider = document.getElementById("height");
	heightOutput = document.getElementById("heightDisplay");
	yMax = heightSlider.value;
	heightOutput.innerHTML = heightSlider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	heightSlider.oninput = function() {
		heightOutput.innerHTML = this.value;
		yMax = this.value;
		$("#main").html(MakeTable(yMax,xMax));
		if(playId){
			clearInterval(playId);
		}
		setUptdClick();
	}
	
	//Will make a table 
    $("#main").html(MakeTable(yMax,xMax));
	
	setUptdClick();
	
});
/*

	GAME RUNNING FUNCTIONS

*/

//Will check what to do with a cell
function GetAmountNearAndAssign(y,x){
	
	var totalNear=0;
	//Three cells above
	if(CheckCell(y-1,x-1)) totalNear++;
	if(CheckCell(y-1,x)) totalNear++;
	if(CheckCell(y-1,x+1)) totalNear++;
	//Two next to it
	if(CheckCell(y,x-1)) totalNear++;
	if(CheckCell(y,x+1)) totalNear++;
	//Three cells below
	if(CheckCell(y+1,x-1)) totalNear++;
	if(CheckCell(y+1,x)) totalNear++;
	if(CheckCell(y+1,x+1)) totalNear++;
	
	/*
		From https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
		Situation 1.Any live cell with fewer than two live neighbors dies, as if by under population.
		Situation 2.Any live cell with two or three live neighbors lives on to the next generation.
		Situation 3.Any live cell with more than three live neighbors dies, as if by overpopulation.
		Situation 4.Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
	*/
	
	//Assgin new values to new holder(can't assign to holder as would mess up other cell calculations)
	if(holder[y][x]){
		if(totalNear<2){
			//Situation 1
			newHolder[y][x] = false;
			$(`td[data-y=${y}][data-x=${x}]`).css("background-color", emptyColor);
		}else if(totalNear>3){
			//Situation 3
			newHolder[y][x] = false;
			$(`td[data-y=${y}][data-x=${x}]`).css("background-color", emptyColor);			
		}else{
			//Situation 2
			newHolder[y][x] = true;	
			$(`td[data-y=${y}][data-x=${x}]`).css("background-color", fullColor);			
		}
		
	}else{
		if(totalNear === 3){
			//Situation 4
			newHolder[y][x] = true;	
			$(`td[data-y=${y}][data-x=${x}]`).css("background-color", fullColor);		
		}
	}	
	
}

function CheckCell(y,x){
	//Make sure it's in bounds of the table, if not wrap arround to other side effectivly making a toroidal array
	if(y<0){
		y=yMax-1;
	}else if(y>=yMax){
		y=0;
	}
	if(x<0){
		x=xMax-1;
	}else if(x>=xMax){
		x=0;
	}
	return holder[y][x];
}

/*

	PLAY FUNCTIONS

*/

function Update(){
	newHolder = MakeEmptyArray();
	for(var y = 0; y<yMax; y++){
		for(var x = 0; x<xMax; x++){
			GetAmountNearAndAssign(y,x);
		}
	}
	holder = newHolder;
}

//Will run through the 
function Play(){
	$('#play').attr("disabled", true);
	$('#stop').attr("disabled", false);
	playId = setInterval(function(){
	  Update();
	}, 1000/speed);
}

function Stop(){	
	$('#play').attr("disabled", false);
	$('#stop').attr("disabled", true);
	if(playId){
		clearInterval(playId);
		playId = false;
	}
}

function Clear(){
	$("#main").html(MakeTable(yMax,xMax));
	if(playId){
		clearInterval(playId);
	}
	setUptdClick();
}

/*

	SET-UP FUNCTIONS

*/


//Resets the holder and calls make rows to create rows.
function MakeTable(rows,cells){
	holder = MakeEmptyArray();
	return MakeRows(rows, cells);
}			

//Will push arrays to the holder for each row and create table rows with cells from MakeCells()		
function MakeRows(rows, cells) {
	var html = "";
	for(let i=0; i<rows; i++){
		html+="<tr>"+MakeCells(cells, i)+"</tr>";
	}
	return html;		
}
	
//Will make cells
function MakeCells(amount, y) {
	var html = "";
	for(let i=0; i<amount; i++){
		//Data attributes so I can refference them with Jquery
		html+="<td data-x='"+i+"' data-y='"+y+"'></td>";
	}
	return html;
}

/*

	OTHER FUNCTIONS

*/

function setUptdClick(){
	//Will change the background colour of the clicked cell and update the holder
	$("td").click(function(){
		if(holder[$(this).attr( "data-y" )][$(this).attr( "data-x" )]){
			$(this).css("background-color", emptyColor);
			holder[$(this).attr( "data-y" )][$(this).attr( "data-x" )] = false;
		}else{
			$(this).css("background-color", fullColor);
			holder[$(this).attr( "data-y" )][$(this).attr( "data-x" )] = true;
		}
	});
}


function MakeEmptyArray(){
	var arr = new Array();
	for(let i=0; i<yMax; i++){
		arr.push(new Array(xMax).fill(false));
	}	
	return arr;
}