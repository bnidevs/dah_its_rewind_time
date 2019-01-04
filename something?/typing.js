async function runfirst(){
	await sleep(3000);
	donetyping1();
}

var clickcheck = false;

runfirst();

async function donetyping1(){
	var x = document.getElementById("comms");
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>OOF, YOU'RE STUCK.</div>"
	await sleep(4000);
	donetyping2();
}

async function donetyping2(){
	var x = document.getElementById("comms"); 
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>LET ME SORT THAT.</div>"
	await sleep(4000);
	next1();
}

function next1(){
	var x = document.getElementById("continue");
	x.innerHTML = "<div class='link' id='clicklisten'>Continue</div>"
	var c = document.getElementById("clicklisten");
	c.addEventListener("click", function(){wipe1()})
	hint1();
}

async function hint1(){
	await sleep(2000);
	var x = document.getElementById("hint"); 
	if(!clickcheck){
		x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>CLICK THAT THERE.</div>"
	}
}

async function wipe1(){
	clickcheck = true;
	var a = document.getElementById("comms"); 
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>IS THIS TOO EASY?</div>";
	var c = document.getElementById("continue");
	c.innerHTML = ""
	var x = document.getElementById("hint");
	x.innerHTML = ""
	await sleep(4000);
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>TRY THIS ONE OUT.</div>"
	c.innerHTML = "<div class='lockedlink' id='clicklisten'>Continue</div>"
	await sleep(2000);
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>OH I FORGOT THIS.</div>"
	await sleep(2000);
	var u = document.getElementById("unlocker");
	u.innerHTML = "<div class='link' id='unlocker'>Unlock</div>"
	u.addEventListener("click", function(){unlock1()});
}

function unlock1(){
	var x = document.getElementById("clicklisten");
	x.classList.remove("lockedlink");
	x.classList.add("link");
	x.addEventListener("click", function(){wipe2()});
}

function wipe2(){
	var a = document.getElementById("comms"); 
	var c = document.getElementById("continue");
	var x = document.getElementById("hint");
	var u = document.getElementById("unlocker");
	a.innerHTML = "";
	c.innerHTML = "";
	x.innerHTML = "";
	u.innerHTML = "";
}

function sleep(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
}