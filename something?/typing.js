async function main(){
	await sleep(4000);
	var x = document.getElementById("comms");
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>OOF, YOU'RE STUCK.</div>"
	await sleep(4000);
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>LET ME SORT THAT.</div>"
	await sleep(4000);
	var a = document.getElementById("continue");
	a.innerHTML = "<div class='link' id='clicklisten'>Continue</div>"
	var c = document.getElementById("clicklisten");
	c.addEventListener("click", function(){next1()})
	await sleep(2000);
	var x = document.getElementById("hint");
	if(!clickcheck){
		x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>CLICK THAT THERE.</div>"
	}
}

var clickcheck = false;

main();

async function next1(){
	clickcheck = true;
	var a = document.getElementById("comms");
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>IS THIS TOO EASY?</div>";
	var c = document.getElementById("continue");
	c.innerHTML = ""
	var x = document.getElementById("hint");
	x.innerHTML = ""
	await sleep(4000);
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>TRY THIS ONE OUT.</div>"
	await sleep(2500);
	c.innerHTML = "<div class='lockedlink' id='clicklisten'>Continue</div>"
	await sleep(2000);
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>OH I FORGOT THIS.</div>"
	await sleep(2500);
	var u = document.getElementById("unlocker");
	u.innerHTML = "<div class='link' id='unlock1'>Unlock</div>"
	u = document.getElementById("unlock1");
	u.addEventListener("click", function(){unlock1()});
}

function unlock1(){
	var x = document.getElementById("clicklisten");
	x.classList.remove("lockedlink");
	x.classList.add("link");
	x.addEventListener("click", function(){next2()});
}

function unlock2(){
	var x = document.getElementById("clicklisten");
	x.classList.remove("lockedlink");
	x.classList.add("link");
	x.addEventListener("click", function(){wipe()});
}

var boolarr = [false, false, false, false, false];

async function next2(){
	var a = document.getElementById("comms");
	var c = document.getElementById("continue");
	var x = document.getElementById("hint");
	var u = document.getElementById("unlocker");
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>STILL TOO SIMPLE?</div>";
	c.innerHTML = "";
	x.innerHTML = "";
	u.innerHTML = "";
	await sleep(4000);
	c.innerHTML = "<div class='lockedlink' id='clicklisten'>Continue</div>";
	u.innerHTML = "<div class='link' id='unlock2'>Unlock</div><br><br><div class='link' id='unlock3'>Unlock</div><br><br><div class='link' id='unlock1'>Unlock</div><br><br><div class='link' id='unlock5'>Unlock</div><br><br><div class='link' id='unlock4'>Unlock</div>"
	document.getElementById("unlock1").addEventListener("click", function(){unlock(1)})
	document.getElementById("unlock2").addEventListener("click", function(){unlock(2)})
	document.getElementById("unlock3").addEventListener("click", function(){unlock(3)})
	document.getElementById("unlock4").addEventListener("click", function(){unlock(4)})
	document.getElementById("unlock5").addEventListener("click", function(){if(unlock(5)){unlock2()}})
	await sleep(3000);
	a.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>TROUBLING, RIGHT?</div>"
	await sleep(4000);
	x.innerHTML = "<div style='color: #FFFFFF' class='typewriter center'>IT'S NOT ORDERED.</div>"
}

function unlock(n){
	n -= 1;
	for(var i = n; i >= 0; i--){
		if(!boolarr[i]){
			boolarr = [false, false, false, false, false];
			return false;
		}
	}
	return true;
}

function wipe(){
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
