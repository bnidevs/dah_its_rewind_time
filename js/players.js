

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
    players[0] = new player(player_name, 0, "", "", "", 0, 0);
    my_players.sort(compRan);
    var i;
    for(i = 1; i < players.length; i++){
	players[i] = my_players[i - 1];
    }
    reset_player_statuses(0);
    clear_bets();
    for(i = 0; i < players.length; i++) {
	players[i].bank = 1000;
    }
    button_index = Math.floor(Math.random() * players.length);
    new_round();
}

function new_round(){
    num_rounds++;
    hide_fold_call_raise_click();
    
    var num_playing = 0;
    var i;
    for(i = 0; i < players.length; i++){
	if(has_money(i)){
	    num_playing+=1;
	}
    }
    if(num_playing < 2){
	var html = "";
	write_modal_box(html);
	return;
    }
    reset_player_statuses(1);
    clear_bets();
    clear_pot();
    current_min_raise = 0;
    collect_cards();
    button_index = get_next_player_position(button_index, 1);
    for(i = 0; i < players.length; i++){
	write_player(i, 0, 0);
    }
    for(i = 0; i < boards.length; i++){
	if(i > 4){
	    continue;
	}
	board[i] = "";
	lay_board_card(i, board[i]);
    }
    var message = "";
    write_game_response(message);
    hide_quick_raise();
    shuffle();
    blinds_and_deal();
}
function blinds_and_deal(){
    small_blind = 5;
    big_blind = 10;
    var num_playing = 0;
    for(var i = 0; i < players.length; i++){
	if(has_money(i)){
	    num_playing += 1;
	}
    }
    if(num_playing == 3){
	small_blind = 10;
	big_blind = 20;
    } else if (num_playing < 3){
	small_blind = 25;
	big_blind = 50;
    }
    var small_blind_pos = get_next_play_position(button_index, 1);
    the_bet_function(small_blind_pos, small_blind);
    write_player(small_blind_pos, 0, 0);
    var big_blind_pos = get_next_play_position(button_index, 1);
    the_bet_function(big_blind_pos, big_blind);
    write_player(big_blind_pos, 0, 0);
    players[big_blind].status = "OPTION";
    current_bettor_index = get_next_player_position(big_blind, 1);
    deal_and_write_a();
}
function unroll_player(starting_player, player_pos, final_call){
    var next_player = get_next_player_position(player_pos, 1);
    write_player(player_pos, 0, 0);
    if(starting_player == next_player){
	setTimeout(final_call, 550 * global_speed);
    } else {
	setTimeout(unroll_player, 550 * global_speed, starting_player, next_player, final_call);
    }
}
function (){

}
