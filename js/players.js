

function player (name, bank, carda, cardb, status, total_bet, subtotal_bet) {
  this.name = name;
  this.bank = bank;
  this.carda = carda;
  this.cardb = cardb;
  this.status = status;
  this.total_bet = total_bet;
  this.subtotal_bet = subtotal_bet;
}

function init(){
	hide_poker_table();
	hide_log_window();
	hide_setup_option_buttons();
	hide_fold_call_raise_click();
	hide_quick_raise();
	hide_dealer_button();
	hide_game_response();
	// make a new deck
	new_game();
}
function opponent_response(opponents){
	write_box("");
	settings_frame();
	new_game_continues(opponents);
	initialize_css();
	show_game_response();
}

function ask_num_opponents(){
	var quick_values = [1, 2, 3, 4, 5, 6, 7];
  	var asking = "<b><font size=+4 color=FF0000>So, how many opponents do you want?</font></b><br>";
  	for (var i = 0; i < 7; i++) {
	   	if (quick_values[i]) {
	    	asking += "<font size=+4><a href='javascript:parent.opponent_response(" + quick_values[i] + ")'>" + quick_values[i] + " </a></font>" + "&nbsp;&nbsp;&nbsp;";
	    }
	}
	var html9 = "<td><table align=center><tr><td align=center>";
	var html10 = asking + "</td></tr></table></td></tr></table></body></html>";
	gui_write_modal_box(html9 + html10);
}

function clear_cards(){
	hide_poker_table();
	hide_dealer_button();
	hide_fold_call_raise_click();
	show_poker_table();
	for (var people = 0; people < 8; people++){
		set_player_cards("","",people);
		set_player_name("",people);
		set_bet("",people);
		set_bank("",people)
	}
}

function new_game(){
	num_rounds = 0;
	clear_cards();
	ask_num_opponents();
}

function new_game_continues(num_opponents){
	var possible_players= [
				new player("BOT 1", 0, "", "", "",0,0),
				new player("BOT 2", 0, "", "", "",0,0),
				new player("BOT 3", 0, "", "", "",0,0),
				new player("BOT 4", 0, "", "", "",0,0),
				new player("BOT 5", 0, "", "", "",0,0),
				new player("BOT 6", 0, "", "", "",0,0),
				new player("BOT 7", 0, "", "", "",0,0)
				];
	players = new Array(num_opponents + 1);
	var player_name = getLocalStorage("playername");
	if (!player_name){
		player_name = "You";
	}
	
}