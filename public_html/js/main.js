
function Undo(puzzlenumber)
{
	// then when they click undo we pop one off the stack,
	commandStack.pop(); 
	// clear the grid,
	ClearBoard(); 
	// load any saved game
	LoadSavedPuzzle(puzzlenumber);
	//r edo all the moves left in the stack
	if(commandStack.length > 0)
	{
		Redo();
	}
	else
	{
		document.getElementById("undo").style.display = "none";
	}
}

function Redo()
{
	for (var i = 0, len = commandStack.length; i < len; i++)
	{
		commandStack[i]();
	}
}

function changeMe(el)
{
var newClassName = "";

	if(el.className != undefined)
	{
		// if el is white set it to black
		if(el.className == "")
		{
			newClassName = "exed";
		}
		// if el is a black set to red 
		else if(el.className == "exed")
		{
			newClassName = "checked";
		}
		// if el is a red  set to white
		else if(el.className == "checked")
		{
			newClassName = "";
		}
	}
	else
		{
			// we start off exed out
			newClassName = "exed";
		}
		
	el.className = newClassName;	
	commandStack.push(function() {el.className = newClassName;}) // everytime the user clicks we add the move to stack
	document.getElementById("undo").style.display = "block";

}

function CheckSolution(puzzle)
{
var errorsFound = false;
for (var i = 0; i < 5; i++)
{
	if(puzzle.solution[i].c1 == document.getElementById("r" + i + "c1").value)
	{
		if(puzzle.solution[i].c2 == document.getElementById("r" + i + "c2").value)
		{
			if(puzzle.solution[i].c3 == document.getElementById("r" + i + "c3").value)
			continue;
		}
		else
		{
			errorsFound = true;
			break;
		}
	}
	else
	{
		errorsFound = true;
		break;
	}
}

if (errorsFound)
	window.location.href = "main.html#solvefailureModal";
else
	{
	SavethisPuzzle();
	window.location.href = "main.html#solvesuccessModal";
	}
	
}

function LoadSavedPuzzle(puzzlenumber)
{
	var sp = window.localStorage.getItem(puzzlenumber);
	if(sp != null)
	{
		var savedpuzzle = JSON.parse(sp);
		
		// set any extra hints visible
		for(var h = 1; h <= savedpuzzle.hints; h++)
		{
			document.getElementById("clue" + h).style.display = 'block';
		}
		
		for (var i = 0; i < savedpuzzle.savedgrid.length; i++)
		{
			document.getElementById(savedpuzzle.savedgrid[i].cellid).className = savedpuzzle.savedgrid[i].cellclassname;
		}
	
		for (var j = 0; j < savedpuzzle.savedsolution.length; j++)
		{
			document.getElementById("r" + j + "c1").value = savedpuzzle.savedsolution[j].c1;
			document.getElementById("r" + j + "c2").value = savedpuzzle.savedsolution[j].c2;
			document.getElementById("r" + j + "c3").value = savedpuzzle.savedsolution[j].c3;
		}
		for (var c = 0; c < savedpuzzle.savedclues.length; c++)
		{
			var cl = savedpuzzle.savedclues[c];
			document.getElementById("c" + cl + "text").style.display = "none"; // clue1text
			document.getElementById("clue" + cl).style.margin = "0px 10px"; // clue1
			document.getElementById("c" + cl + "chk").checked = true; // check its box, c1chk
		}
	}

}	

function SavePuzzle(puzzlenumber, puzzletitle, hintscount)
{
	// need to build a JSON from the grid and solution table and save to local storage
	var jsObj = null;
	var savedgrid = [];
	var savedsolution = [];
	var savedclues = [];
	jsObj = {title: puzzletitle, puzzlenumber: puzzlenumber, hints: hintscount};
	var startrow = 0;
	var maxrow = 0;
	var maxcell = 0;
	
	// savedgrid
	for (var b = 1; b <= 3; b++) // savedgrid - the grid has a total of 3 blocks
	{
		switch(b)
		{
			case 1: // block 1 0-4 rows 0-14 cells
				startrow = 0;
				maxrow = 4;
				maxcell = 15;
		    	break;
		    case 2: // block 2 5-9 rows 0-9 cells
        		startrow = 5;
        		maxrow = 9;
        		maxcell = 10;
        		break;
        	case 3: // block 3 10-14 rows 0-4 cells
        		startrow = 10;
        		maxrow = 14;
        		maxcell = 5;
        		break;
        	default:
        		break;
        }
    
        for (var i = startrow; i <= maxrow; i++) // rows
			{
     			for (var j=0; j < maxcell; j++) //cells
     			{
     				var ci = "r" + i + "cell" + j;
	     			var ccn = document.getElementById(ci).className;
	     			if (ccn != "") // classname is !blank
	     			{
	     				savedgrid.push({cellid: ci, cellclassname: ccn});
		     		}
		     	}
		    }
		    jsObj.savedgrid = savedgrid;
	}

	// savedsolution
	for (var s = 0; s < 5; s++)
	{
			savedsolution.push({c1: document.getElementById("r" + s + "c1").value
			,c2: document.getElementById("r" + s + "c2").value
			,c3: document.getElementById("r" + s + "c3").value});
	}
	
	jsObj.savedsolution = savedsolution;
	
	// savedCluesState
	for(var c = 1; c <= hintscount; c++)
	{
		if(document.getElementById("c" + c + "chk").checked == true) // check if it was collapsed
		{
			savedclues.push(c);
		}	
	}
	
	jsObj.savedclues = savedclues;
	
	
	window.localStorage.setItem(puzzlenumber, JSON.stringify(jsObj));
}	

function ClearBoard()
{
	// clear all the classnames from the board
	var startrow = 0;
	var maxrow = 0;
	var maxcell = 0;
	
	// grid
	for (var b = 1; b <= 3; b++) // the grid has a total of 3 blocks
	{
		switch(b)
		{
			case 1: // block 1 0-4 rows 0-14 cells
				startrow = 0;
				maxrow = 4;
				maxcell = 15;
		    	break;
		    case 2: // block 2 5-9 rows 0-9 cells
        		startrow = 5;
        		maxrow = 9;
        		maxcell = 10;
        		break;
        	case 3: // block 3 10-14 rows 0-4 cells
        		startrow = 10;
        		maxrow = 14;
        		maxcell = 5;
        		break;
        	default:
        		break;
        }
    
        for (var i = startrow; i <= maxrow; i++) // rows
			{
     			for (var j=0; j < maxcell; j++) //cells
     			{
     				var ci = "r" + i + "cell" + j;
	     			var ccn = document.getElementById(ci).className;
	     			if (ccn != "") // classname is !blank
	     			{
	     				document.getElementById(ci).className = "";
		     		}
		     	}
		    }
	}
	window.location.href = "main.html#close";
}

function ClearSolution()
{
// set solution items r0c1
	for (var i = 0; i < 5; i++) // rows
	{
		for (var j = 1; j <= 3; j++) // cells
		{
			document.getElementById("r" + i + "c" + j).selectedIndex = 0;
		}
	}
	window.location.href = "main.html#close";
}

function InitBoard(puzzle)
{
	// set the title
	document.getElementById("title").innerHTML = puzzle.puzzlenumber + "." + puzzle.title;
	
	// set puzzle description
	document.getElementById("pDesc").innerHTML = puzzle.puzzledescription;

	// set headers
	document.getElementById("Cat1Top").innerHTML = puzzle.category[1].categoryheader;
	document.getElementById("Cat2Top").innerHTML = puzzle.category[2].categoryheader;
	document.getElementById("Cat3Top").innerHTML = puzzle.category[3].categoryheader;
	document.getElementById("Cat4Side").innerHTML = puzzle.category[4].categoryheader;
	document.getElementById("Cat3Side").innerHTML = puzzle.category[3].categoryheader;
	document.getElementById("Cat2Side").innerHTML = puzzle.category[2].categoryheader;
	document.getElementById("Cat1Sol").innerHTML = puzzle.category[1].categoryheader;
	document.getElementById("Cat2Sol").innerHTML = puzzle.category[2].categoryheader;
	document.getElementById("Cat3Sol").innerHTML = puzzle.category[3].categoryheader;
	document.getElementById("Cat4Sol").innerHTML = puzzle.category[4].categoryheader;
	document.getElementById("Cat1Sur").innerHTML = puzzle.category[1].categoryheader;
	document.getElementById("Cat2Sur").innerHTML = puzzle.category[2].categoryheader;
	document.getElementById("Cat3Sur").innerHTML = puzzle.category[3].categoryheader;
	document.getElementById("Cat4Sur").innerHTML = puzzle.category[4].categoryheader;
	
	// set top items
	for (var i = 1; i <= 3; i++) // each category
	{
		for ( var j = 1; j <= 5; j++) // each item
		{
			document.getElementById("Cat" + i + "TopItem" + j).innerHTML = puzzle.category[i].categorylist[j];
		}
	}
	// set side items
	for (var i = 2; i <= 4; i++) // each category
	{
		for ( var j = 1; j <= 5; j++) // each item
		{
			document.getElementById("Cat" + i + "SideItem" + j).innerHTML = puzzle.category[i].categorylist[j];
		}
	}
	// set solution items r0c1
	for (var i = 0; i < 5; i++) // rows
	{
		for (var j = 1; j <= 3; j++) // cells
		{
				var select = document.getElementById("r" + i + "c" + j);

				for(var k = 0; k <= 5; k++)
				{
					select.options[k] = new Option(puzzle.category[j].categorylist[k], puzzle.category[j].categorylist[k]);
				}
		}
	}
	
	// set solution items for cat4
	for(var m = 1; m <= 5; m++)
	{
		document.getElementById("Cat4SolItem" + m).innerHTML = puzzle.category[4].categorylist[m];
		document.getElementById("Cat4SurItem" + m).innerHTML = puzzle.category[4].categorylist[m];

	}
	
	// set clues
	for (var c = 1; c <= 10; c++)
	{
		document.getElementById("c" + c).innerHTML = "Clue " + puzzle.clues[c].cluenumber;
		document.getElementById("c" + c + "text").innerHTML = puzzle.clues[c].cluetext;
	}
	// set visible clues
	for(var h = 1; h <= puzzle.hints; h++)
	{
		document.getElementById("clue" + h).style.display = 'block';
	}
	// fill in surrendersolution
	for (var j = 0; j < puzzle.solution.length; j++)
	{
		document.getElementById("sr" + j + "c1").innerHTML = puzzle.solution[j].c1;
		document.getElementById("sr" + j + "c2").innerHTML = puzzle.solution[j].c2;
		document.getElementById("sr" + j + "c3").innerHTML = puzzle.solution[j].c3;
	}
}

function UndoMistakes()
{
	var startrow = 0;
	var maxrow = 0;
	var maxcell = 0;

	for (var b = 1; b <= 3; b++) // grid - the grid has a total of 3 blocks
	{
		switch(b)
		{
			case 1: // block 1 0-4 rows 0-14 cells
				startrow = 0;
				maxrow = 4;
				maxcell = 15;
		    	break;
		    case 2: // block 2 5-9 rows 0-9 cells
        		startrow = 5;
        		maxrow = 9;
        		maxcell = 10;
        		break;
        	case 3: // block 3 10-14 rows 0-4 cells
        		startrow = 10;
        		maxrow = 14;
        		maxcell = 5;
        		break;
        	default:
        		break;
        }
    
        for (var i = startrow; i <= maxrow; i++) // rows
			{
     			for (var j=0; j < maxcell; j++) //cells
     			{
     				var ci = "r" + i + "cell" + j;
	     			var ccn = document.getElementById(ci).className;
	     			if (ccn != "") // classname is !blank
	     			{
		     			// try to find it in the puzzle object
		     			var found = false;
		     			for(var pa = 0; pa < 30; pa++)
		     			{
			     			if(puzzle.grid[pa].cellid == ci) // if it is in the puzzle then compare it to the grid
			     			{
			     				if(ccn != "checked") // check if it is checked,
			     				{
			     					document.getElementById(ci).className = "";  //no, clear the box
				     			}
				     			found = true;
				     			break;
			     			}
		     			}
		     			if(!found)
		     			{
			     			if(ccn != "exed") // if not found in the puzzle object then it is supposed to be an x
			     			{
			     				document.getElementById(ci).className = "";  //no, clear the box
				     		}
		     			}
		     		}
		     	}
		    }
	}
	
	window.location.href = "main.html#close";

}

function ShowHide(el, cluecontainer, cluetext)
{
	if(el.checked)
	{
		document.getElementById(cluetext).style.display = 'none';
		document.getElementById(cluecontainer).style.margin = "0px 10px";
	}
	else
	{
		document.getElementById(cluetext).style.display = 'block';
		document.getElementById(cluecontainer).style.margin = "10px 10px";
	}
}