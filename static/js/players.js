var NUM_ROUNDS;
var STOP_AUTOPLAY = 0;
var RUN_EM = 0;
var STARTING_BANKROLL = 500;
var SMALL_BLIND;
var BIG_BLIND;
var BG_HILITE = 'gold';
var global_speed = 1;
var HUMAN_WINS_AGAIN;
var HUMAN_GOES_ALL_IN;
var cards = new Array(52);
var players;
var board, deck_index, button_index, current_bettor_index, current_bet, current_min_raise;
var deckid = '';

function leave_pseudo_alert () {
  write_modal_box("");
}

function my_pseudo_alert (text) {
  var html = "<html><body topmargin=2 bottommargin=0 bgcolor=" +
             BG_HILITE + " onload='document.f.y.focus();'>" +
             "<font size=+2>" + text +
             "</font><form name=f><input name=y type=button value='  OK  ' onclick='parent.leave_pseudo_alert()'></form></body></html>";
  write_modal_box(html);
}

function player (name, bankroll, carda, cardb, status, total_bet, subtotal_bet) {
  this.name = name;
  this.bankroll = bankroll;
  this.carda = carda;
  this.cardb = cardb;
  this.status = status;
  this.total_bet = total_bet;
  this.subtotal_bet = subtotal_bet;
}

function init () {
  hide_poker_table();
  hide_log_window();
  hide_fold_call_raise_click();
  hide_guick_raise();
  hide_dealer_button();
  hide_game_response();
  make_deck();
  new_game();
}

function make_deck(){
  //console.log("imhere");
  var request = new XMLHttpRequest();
  request.open('GET',"https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",true);
  request.onload = function(){
    var data = JSON.parse(this.response);
    deckid = data["deck_id"];
    generate_cards(deckid);
    //console.log(deckid);
  }
  request.send();
}

function generate_cards(deck){
  var request = new XMLHttpRequest();
  request.open('GET',"https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=52",true);
  request.onload = function(){
    var data = JSON.parse(this.response);
    for(var i = 0; i < 52; i++){
      cards[i] = data['cards'][i];
    }
  }
  request.send();
}


function handle_how_many_reply (opponents) {
  write_modal_box("");
  new_game_continues(opponents);
  initialize_css();
  show_game_response();
}

function ask_how_many_opponents () {
  var quick_values = [1, 2, 3, 4, 5, 6, 7];
  var asking = "<b><br><br><br><font size=+4 color=FF0000>So, how many opponents do you want?</font></b><br>";
  for (var i = 0; i < 7; i++) {
    if (quick_values[i]) {
      asking += "<font size=+4><a href='javascript:parent.handle_how_many_reply(" + quick_values[i] + ")'>" + quick_values[i] + " </a></font>" + "&nbsp;&nbsp;&nbsp;";
    }
  }
  var html9 = "<td><table align=center><tr><td align=center>";
  var html10 = asking + "</td></tr></table></td></tr></table></body></html>";
  write_modal_box(html9 + html10);
}

function clear_player_cards () {
  hide_poker_table();
  hide_dealer_button();
  hide_fold_call_raise_click();
  show_poker_table();

  for (var pl = 0; pl < 8; ++pl) {
    set_player_cards("", "", pl);
    set_player_name("", pl);
    set_bet("", pl);
    set_bankroll("", pl);
  }
}

function new_game () {
  NUM_ROUNDS = 0;
  HUMAN_WINS_AGAIN = 0;
  clear_player_cards();
  ask_how_many_opponents();
}

function new_game_continues (req_no_opponents) {
  var my_players = [
                    new player("Bot1", 0, "", "", "", 0, 0),
                    new player("Bot2", 0, "", "", "", 0, 0),
                    new player("Bot3", 0, "", "", "", 0, 0),
                    new player("Bot4", 0, "", "", "", 0, 0),
                    new player("Bot5", 0, "", "", "", 0, 0),
                    new player("Bot6", 0, "", "", "", 0, 0),
                    new player("Bot7", 0, "", "", "", 0, 0)
                   ];

  players = new Array(req_no_opponents + 1);
  var player_name = getLocalStorage("playername");
  if (!player_name) {
    player_name = "You";
  }
  players[0] = new player(player_name, 0, "", "", "", 0, 0);
  var i;
  for (i = 1; i < players.length; i++) {
    players[i] = my_players[i - 1];
  }
  reset_player_statuses(0);
  clear_bets();
  for (i = 0; i < players.length; i++) {
    players[i].bankroll = STARTING_BANKROLL;
  }
  button_index = Math.floor(Math.random() * players.length);
  new_round();
}

function new_round () {
  RUN_EM = 0;
  NUM_ROUNDS++;
  hide_fold_call_raise_click();

  var num_playing = 0;
  var i;
  for (i = 0; i < players.length; i++) {
    if (has_money(i)) {
      num_playing += 1;
    }
  }
  if (num_playing < 2) {
    var html = "<html><br><br><br><body topmargin=2 bottommargin=0 bgcolor=" +
               BG_HILITE + " onload='document.f.y.focus();'>" +
               "<font size=+2>Play again?</font><form name=f><input name=y type=button value='  Yes  ' onclick='parent.new_game()'><input type=button value='  No  ' onclick='parent.confirm_quit()'></form></body></html>";
    write_modal_box(html);
    return;
  }
  HUMAN_GOES_ALL_IN = 0;
  reset_player_statuses(1);
  clear_bets();
  clear_pot();
  current_min_raise = 0;
  collect_cards();
  button_index = get_next_player_position(button_index, 1);
  for (i = 0; i < players.length; i++) {
    write_player(i, 0, 0);
  }
  for (i = 0; i < board.length; i++) {
    if (i > 4) {
      continue;
    }
    board[i] = "";
    lay_board_card(i, board[i]);
  }
  var message = "<tr><td><font size=+2><b>New round</b></font>";
  write_game_response(message);
  hide_guick_raise();
  shuffle();
  blinds_and_deal();
}

function collect_cards () {
  board = new Array(6);
  for (var i = 0; i < players.length; i++) {
    players[i].carda = "";
    players[i].cardb = "";
  }
}

function shuffle () {
  deck_index = 0;
  cards.sort(compRan);
}

function blinds_and_deal () {
  SMALL_BLIND = 5;
  BIG_BLIND = 10;
  var num_playing = 0;
  for (var i = 0; i < players.length; i++) {
    if (has_money(i)) {
      num_playing += 1;
    }
  }
  if (num_playing == 3) {
    SMALL_BLIND = 10;
    BIG_BLIND = 20;
  } else if (num_playing < 3) {
    SMALL_BLIND = 25;
    BIG_BLIND = 50;
  }
  var small_blind = get_next_player_position(button_index, 1);
  the_bet_function(small_blind, SMALL_BLIND);
  write_player(small_blind, 0, 0);
  var big_blind = get_next_player_position(small_blind, 1);
  the_bet_function(big_blind, BIG_BLIND);
  write_player(big_blind, 0, 0);
  players[big_blind].status = "OPTION";
  current_bettor_index = get_next_player_position(big_blind, 1);
  deal_and_write_a();
}

function unroll_player (starting_player, player_pos, final_call) {
  var next_player = get_next_player_position(player_pos, 1);
  write_player(player_pos, 0, 0);
  if (starting_player == next_player) {
    setTimeout(final_call, 550 * global_speed);
  } else {
    setTimeout(unroll_player, 550 * global_speed, starting_player, next_player, final_call);
  }
}

function deal_and_write_a () {
  var current_player;
  var start_player;

  start_player = current_player = get_next_player_position(button_index, 1);
  do {
    players[current_player].carda = cards[deck_index++]['code'];
    current_player = get_next_player_position(current_player, 1);
  } while (current_player != start_player)
  current_player = get_next_player_position(button_index, 1);
  unroll_player(current_player, current_player, deal_and_write_b);
}

function deal_and_write_b () {
  var current_player = button_index;
  for (var i = 0; i < players.length; i++) {
    current_player = get_next_player_position(current_player, 1);
    if (players[current_player].cardb) {
      log_to_history("Player " + current_player + " already had an b card");
      break;
    }
    players[current_player].cardb = cards[deck_index++]['code'];
  }

  current_player = get_next_player_position(button_index, 1);
  unroll_player(current_player, current_player, main);
}

function go_to_betting () {
  if (get_num_betting() > 1) {
    setTimeout(main, 1000 * global_speed);
  } else {
    setTimeout(ready_for_next_card, 1000 * global_speed);
  }
}

function unroll_table (last_pos, current_pos, final_call) {
  lay_board_card(current_pos, board[current_pos]);

  if (current_pos == last_pos) {
    setTimeout(final_call, 150 * global_speed);
  } else {
    setTimeout(unroll_table, 150 * global_speed, last_pos, current_pos + 1, final_call);
  }
}

function deal_flop () {
  var message = "<tr><td><font size=+2><b>Dealing flop</b></font>";
  write_game_response(message);
  for (var i = 0; i < 3; i++) {
    board[i] = cards[deck_index++]['code'];
  }

  setTimeout(unroll_table, 1000, 2, 0, go_to_betting);
}

function deal_fourth () {
  var message = "<tr><td><font size=+2><b>Dealing turn</b></font>";
  write_game_response(message);
  board[3] = cards[deck_index++]['code'];

  setTimeout(unroll_table, 1000, 3, 3, go_to_betting);
}

function deal_fifth () {
  var message = "<tr><td><font size=+2><b>Dealing river</b></font>";
  write_game_response(message);
  board[4] = cards[deck_index++]['code'];

  setTimeout(unroll_table, 1000, 4, 4, go_to_betting);
}

function main () {
  hide_guick_raise();
  var increment_bettor_index = 0;
  if (players[current_bettor_index].status == "BUST" || players[current_bettor_index].status == "FOLD") {
    increment_bettor_index = 1;
  } else if (!has_money(current_bettor_index)) {
    players[current_bettor_index].status = "CALL";
    increment_bettor_index = 1;
  } else if (players[current_bettor_index].status == "CALL" && players[current_bettor_index].subtotal_bet == current_bet) {
    increment_bettor_index = 1;
  } else {
    players[current_bettor_index].status = "";
    if (current_bettor_index == 0) {
      var call_button_text = "Call";
      var fold_button_text = "Fold";
      var bet_button_text  = "Raise";
      var to_call = current_bet - players[0].subtotal_bet;
      if (to_call > players[0].bankroll) {
        to_call = players[0].bankroll;
      }
      if (to_call == 0) {
        call_button_text = "Check";
        fold_button_text = "";
        bet_button_text  = "Bet";
      }
      setup_fold_call_raise_click(fold_button_text, call_button_text, bet_button_text,human_fold, human_call, human_raise);

      var quick_values = new Array(6);
      if (to_call < players[0].bankroll) {
        quick_values[0] = current_min_raise;
      }
      var quick_start = quick_values[0];
      if (quick_start < 20) {
        quick_start = 20;
      } else {
        quick_start = current_min_raise + 20;
      }
      var i;
      for (i = 0; i < 5; i++) {
        if (quick_start + 20 * i < players[0].bankroll) {
          quick_values[i + 1] = quick_start + 20 * i;
        }
      }
      var bet_or_raise = "Bet";
      if (to_call > 0) {
        bet_or_raise = "Raise";
      }
      var quick_bets = "<b>Quick " + bet_or_raise + "s</b><br>";
      for (i = 0; i < 6; i++) {
        if (quick_values[i]) {
          quick_bets += "<a href='javascript:parent.handle_human_bet(" + quick_values[i] + ")'>" + quick_values[i] + "</a>" + "&nbsp;&nbsp;&nbsp;";
        }
      }
      quick_bets += "<a href='javascript:parent.handle_human_bet(" + players[0].bankroll + ")'>All In!</a>";
      var html9 = "<td><table align=center><tr><td align=center>";
      var html10 = quick_bets + "</td></tr></table></td></tr></table></body></html>";
      write_guick_raise(html9 + html10);

      var message = "<tr><td><font size=+2><b>Current raise: " + current_bet +
                    "</b><br> You need <font color=FF0000 size=+3>" + to_call +
                    "</font> more to call.</font></td></tr>";
      write_game_response(message);
      write_player(0, 1, 0);
      return;
    } else {
      write_player(current_bettor_index, 1, 0);
      setTimeout(bet_from_bot, 777 * global_speed, current_bettor_index);
      return;
    }
  }
  var can_break = true;
  for (var j = 0; j < players.length; j++) {
    var s = players[j].status;
    if (s == "OPTION") {
      can_break = false;
      break;
    }
    if (s != "BUST" && s != "FOLD") {
      if (has_money(j) && players[j].subtotal_bet < current_bet) {
        can_break = false;
        break;
      }
    }
  }
  if (increment_bettor_index) {
    current_bettor_index = get_next_player_position(current_bettor_index, 1);
  }
  if (can_break) {
    setTimeout(ready_for_next_card, 999 * global_speed);
  } else {
    setTimeout(main, 999 * global_speed);
  }
}

function handle_end_of_round () {
  var candidates = new Array(players.length);
  var allocations = new Array(players.length);
  var winning_hands = new Array(players.length);
  var my_total_bets_per_player = new Array(players.length);

  var i;
  for (i = 0; i < candidates.length; i++) {
    allocations[i] = 0;
    my_total_bets_per_player[i] = players[i].total_bet;
    if (players[i].status != "FOLD" && players[i].status != "BUST") {
      candidates[i] = players[i];
    }
  }

  var my_total_pot_size = get_pot_size();
  var my_best_hand_name = "";
  var best_hand_players;
  while (my_total_pot_size > 0.01) {
    var winners = get_winners(candidates);
    if (!best_hand_players) {
      best_hand_players = winners;
    }
    if (!winners) {
      my_pseudo_alert("No winners for the pot");
      return;
    }

    var lowest_winner_bet = my_total_pot_size * 2;
    var num_winners = 0;
    for (i = 0; i < winners.length; i++) {
      if (!winners[i]) {
        continue;
      }
      if (!my_best_hand_name) {
        my_best_hand_name = winners[i]["hand_name"];
      }
      num_winners++;
      if (my_total_bets_per_player[i] < lowest_winner_bet) {
        lowest_winner_bet = my_total_bets_per_player[i];
      }
    }
    var current_pot_to_split = 0;
    for (i = 0; i < players.length; i++) {
      if (lowest_winner_bet >= my_total_bets_per_player[i]) {
        current_pot_to_split += my_total_bets_per_player[i];
        my_total_bets_per_player[i] = 0;
      } else {
        current_pot_to_split += lowest_winner_bet;
        my_total_bets_per_player[i] -= lowest_winner_bet;
      }
    }

    var share = current_pot_to_split / num_winners;
    for (i = 0; i < winners.length; i++) {
      if (my_total_bets_per_player[i] < 0.01) {
        candidates[i] = null;
      }
      if (!winners[i]) {
        continue;
      }
      my_total_pot_size -= share;
      allocations[i] += share;
      winning_hands[i] = winners[i].hand_name;
    }
  }

  var winner_text = "";
  var human_loses = 0;
  for (i = 0; i < allocations.length; i++) {
    if (allocations[i] > 0) {
      var a_string = "" + allocations[i];
      var dot_index = a_string.indexOf(".");
      if (dot_index > 0) {
        a_string = "" + a_string + "00";
        allocations[i] = a_string.substring(0, dot_index + 3) - 0;
      }
      winner_text += winning_hands[i] + " gives " + allocations[i] + " to " + players[i].name + ". ";
      players[i].bankroll += allocations[i];
      if (best_hand_players[i]) {
        write_player(i, 2, 1);
      } else {
        write_player(i, 1, 1);
      }
    } else {
      if (!has_money(i) && players[i].status != "BUST") {
        players[i].status = "BUST";
        if (i == 0) {
          human_loses = 1;
        }
      }
      if (players[i].status != "FOLD") {
        write_player(i, 0, 1);
      }
    }
  }
  if (allocations[0] > 5) {
    HUMAN_WINS_AGAIN++;
  } else {
    HUMAN_WINS_AGAIN = 0;
  }

  var detail = "";
  for (i = 0; i < players.length; i++) {
    if (players[i].total_bet == 0 && players[i].status == "BUST") {
      continue;  // Skip busted players
    }
    detail += players[i].name + " bet " + players[i].total_bet + " & got " + allocations[i] + ".\\n";
  }
  detail = " (<a href='javascript:alert(\"" + detail + "\")'>details</a>)";

  var hilite_a = " name=c";
  var hilite_b = "";
  if (human_loses) {
    hilite_a = "";
    hilite_b = " name=c";
  }
  var the_buttons = "<input" + hilite_a + " type=button value='Continue Game' onclick='parent.new_round()'><input" + hilite_b + " type=button value='Restart Game' onclick='parent.confirm_new()'>";
  if (players[0].status == "BUST" && !human_loses) {
    the_buttons = "<input name=c type=button value='Restart Game' onclick='parent.STOP_AUTOPLAY=1'>";
    setTimeout(autoplay_new_round, 1500 + 1100 * global_speed);
  }

  var html = "<html><body topmargin=2 bottommargin=0 bgcolor=" + BG_HILITE +
    " onload='document.f.c.focus();'><table><tr><td>" + get_pot_size_html() +
    "</td></tr></table><br><font size=+2 color=FF0000><b>Winning: " +
    winner_text + "</b></font>" + detail + "<br>" +
    "<form name=f>" + the_buttons + "</form></body></html>";
  write_game_response(html);

  hide_fold_call_raise_click();


  if (human_loses == 1) {
    my_pseudo_alert("Sorry, you busted " + players[0].name + ".\n\n");
  } else {
    var num_playing = 0;
    for (i = 0; i < players.length; i++) {
      if (has_money(i)) {
        num_playing += 1;
      }
    }
    if (num_playing < 2) {
      var end_msg = "GAME OVER!";
      if (has_money(0)) {
        end_msg += "\n\nYOU WIN " + players[0].name.toUpperCase() + "!!!";
      } else {
        end_msg += "\n\nSorry you lost.";
      }
      my_pseudo_alert(end_msg);
    }
  }
}

function autoplay_new_round () {
  if (STOP_AUTOPLAY > 0) {
    STOP_AUTOPLAY = 0;
    new_game();
  } else {
    new_round();
  }
}

function ready_for_next_card () {
  var num_betting = get_num_betting();
  var i;
  for (i = 0; i < players.length; i++) {
    players[i].total_bet += players[i].subtotal_bet;
  }
  clear_bets();
  if (board[4]) {
    handle_end_of_round();
    return;
  }
  current_min_raise = BIG_BLIND;
  reset_player_statuses(2);
  if (players[button_index].status == "FOLD") {
    players[get_next_player_position(button_index, -1)].status = "OPTION";
  } else {
    players[button_index].status = "OPTION";
  }
  current_bettor_index = get_next_player_position(button_index, 1);
  var show_cards = 0;
  if (num_betting < 2) {
    show_cards = 1;
  }

  if (!RUN_EM) {
    for (i = 0; i < players.length; i++) {
      if (players[i].status != "BUST" && players[i].status != "FOLD") write_player(i, 0, show_cards);
    }
  }

  if (num_betting < 2) {
    RUN_EM = 1;
  }
  if (!board[0]) {
    deal_flop();
  } else if (!board[3]) {
    deal_fourth();
  } else if (!board[4]) {
    deal_fifth();
  }
}

function the_bet_function (player_index, bet_amount) {
  if (players[player_index].status == "FOLD") {
    return 0;
  } else if (bet_amount >= players[player_index].bankroll) {
    bet_amount = players[player_index].bankroll;

    var old_current_bet = current_bet;

    if (players[player_index].subtotal_bet + bet_amount > current_bet) {
      current_bet = players[player_index].subtotal_bet + bet_amount;
    }

    var new_current_min_raise = current_bet - old_current_bet;
    if (new_current_min_raise > current_min_raise) {
      current_min_raise = new_current_min_raise;
    }
    players[player_index].status = "CALL";
  } else if (bet_amount + players[player_index].subtotal_bet == current_bet) {
    players[player_index].status = "CALL";
  } else if (current_bet > players[player_index].subtotal_bet + bet_amount) {

    if (player_index == 0) {
      my_pseudo_alert("The current bet to match is " + current_bet + "." +
            "\nYou must bet a total of at least " + (current_bet - players[player_index].subtotal_bet) + " or fold.");
    }
    return 0;
  } else if (bet_amount + players[player_index].subtotal_bet > current_bet &&
             get_pot_size() > 0 &&
             bet_amount + players[player_index].subtotal_bet - current_bet < current_min_raise) {
    if (player_index == 0) {
      my_pseudo_alert("Minimum raise is currently " + current_min_raise + ".");
    }
    return 0;
  } else {
    players[player_index].status = "CALL";

    old_current_bet = current_bet;
    current_bet = players[player_index].subtotal_bet + bet_amount;

    if (get_pot_size() > 0) {
      current_min_raise = current_bet - old_current_bet;
      if (current_min_raise < BIG_BLIND) {
        current_min_raise = BIG_BLIND;
      }
    }
  }
  players[player_index].subtotal_bet += bet_amount;
  players[player_index].bankroll -= bet_amount;
  var current_pot_size = get_pot_size();
  write_basic_general(current_pot_size);
  return 1;
}

function human_call () {
  hide_fold_call_raise_click();
  players[0].status = "CALL";
  current_bettor_index = get_next_player_position(0, 1);
  the_bet_function(0, current_bet - players[0].subtotal_bet);
  write_player(0, 0, 0);
  main();
}

function human_raise () {
  var to_call = current_bet - players[0].subtotal_bet;
  var prompt_text = "Minimum raise is " + current_min_raise + ". How much do you raise? DON'T include the " + to_call + " needed to call.";
  if (to_call == 0) prompt_text = "The minimum bet is " + current_min_raise + ". How much you wanna bet?";
  var bet_amount = "";
  while (!bet_amount || bet_amount == null || bet_amount == "") {
    bet_amount = prompt(prompt_text, "");
  }
  handle_human_bet(bet_amount);
}

function handle_human_bet (bet_amount) {
  hide_fold_call_raise_click();
  bet_amount = "" + bet_amount;
  var m = "";
  for (var i = 0; i < bet_amount.length; i++) {
    var c = bet_amount.substring(i, i + 1);
    if (c == "0" || c > 0) m += "" + c;
  }
  if (m == "") {
    hide_guick_raise();
    return;
  }
  bet_amount = m - 0;
  if (bet_amount < 0 || isNaN(bet_amount)) bet_amount = 0;
  var to_call = current_bet - players[0].subtotal_bet;
  bet_amount += to_call;
  var is_ok_bet = the_bet_function(0, bet_amount);
  if (is_ok_bet) {
    players[0].status = "CALL";
    current_bettor_index = get_next_player_position(0, 1);
    write_player(0, 0, 0);
    main();
    hide_guick_raise();
  } else {
  }
}

function human_fold () {
  players[0].status = "FOLD";
  hide_fold_call_raise_click();
  current_bettor_index = get_next_player_position(0, 1);
  write_player(0, 0, 0);
  var current_pot_size = get_pot_size();
  write_basic_general(current_pot_size);
  main();
}

function bet_from_bot (x) {
  var b = 0;
  var n = current_bet - players[x].subtotal_bet;
  if (!board[0]) b = bot_get_preflop_bet();
  else b = bot_get_postflop_bet();
  if (b >= players[x].bankroll) {
    players[x].status = "";
  } else if (b < n) {
    b = 0;
    players[x].status = "FOLD";
  } else if (b == n) {
    players[x].status = "CALL";
  } else if (b > n) {
    if (b - n < current_min_raise) {
      b = n;
      players[x].status = "CALL";
    } else {
      players[x].status = "";
    }
  }
  if (the_bet_function(x, b) == 0) {
    players[x].status = "FOLD";
    the_bet_function(x, 0);
  }
  write_player(current_bettor_index, 0, 0);
  current_bettor_index = get_next_player_position(current_bettor_index, 1);
  main();
}

function write_player (n, hilite, show_cards) {
  var carda = "";
  var cardb = "";
  var name_background_color = "";
  var name_font_color = "";
  if (hilite == 1) {
    name_background_color = BG_HILITE;
    name_font_color = 'black';
  } else if (hilite == 2) {
    name_background_color = 'red';
  }
  if (players[n].status == "FOLD") {
    name_font_color = 'black';
    name_background_color = 'gray';
  }
  if (players[n].status == "BUST") {
    name_font_color = 'white';
    name_background_color = 'black';
  }
  hilite_player(name_background_color, name_font_color, n);

  if (players[0].status == "BUST" || players[0].status == "FOLD") {
    show_cards = 1;
  }
  if (players[n].carda) {
    carda = "blinded";
    if (n == 0 || (show_cards && players[n].status != "FOLD")) {
      carda = players[n].carda;
    }
  }
  if (players[n].cardb) {
    cardb = "blinded";
    if (n == 0 || (show_cards && players[n].status != "FOLD")) {
      cardb = players[n].cardb;
    }
  }
  if (n == button_index) {
    place_dealer_button(n);
  }
  var bet_text = "TO BE OVERWRITTEN";
  var allin = "Bet:";

  if (players[n].status == "FOLD") {
    bet_text = "FOLDED (" + (players[n].subtotal_bet + players[n].total_bet) + ")";
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 0;
    }
  } else if (players[n].status == "BUST") {
    bet_text = "BUSTED";
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 0;
    }
  } else if (!has_money(n)) {
    bet_text = "ALL IN (" + (players[n].subtotal_bet + players[n].total_bet) + ")";
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 1;
    }
  } else {
    bet_text = allin + "$" + players[n].subtotal_bet + " (" + (players[n].subtotal_bet + players[n].total_bet) + ")";
  }

  set_player_name(players[n].name, n);
  set_bet(bet_text, n);
  set_bankroll(players[n].bankroll, n);
  set_player_cards(carda, cardb, n);
}

function make_readable_rank (r) {
  if (r < 11) {
    return r;
  } else if (r == 11) {
    return "J";
  } else if (r == 12) {
    return "Q";
  } else if (r == 13) {
    return "K";
  } else if (r == 14) {
    return "A";
  }
}

function get_pot_size () {
  var p = 0;
  for (var i = 0; i < players.length; i++) {
    p += players[i].total_bet + players[i].subtotal_bet;
  }
  return p;
}

function get_pot_size_html () {
  return "<font size=+4><b>TOTAL POT: " + get_pot_size() + "</b></font>";
}

function clear_bets () {
  for (var i = 0; i < players.length; i++) {
    players[i].subtotal_bet = 0;
  }
  current_bet = 0;
}

function clear_pot () {
  for (var i = 0; i < players.length; i++) {
    players[i].total_bet = 0;
  }
}

function reset_player_statuses (type) {
  for (var i = 0; i < players.length; i++) {
    if (type == 0) {
      players[i].status = "";
    } else if (type == 1 && players[i].status != "BUST") {
      players[i].status = "";
    } else if (type == 2 && players[i].status != "FOLD" && players[i].status != "BUST") {
      players[i].status = "";
    }
  }
}

function get_num_betting () {
  var n = 0;
  for (var i = 0; i < players.length; i++) {
    if (players[i].status != "FOLD" && players[i].status != "BUST" && has_money(i)) {
      n++;
    }
  }
  return n;
}


function get_next_player_position (i, delta) {
  var j = 0;
  var step = 1;
  if (delta < 0) step = -1;

  var loop_on = 0;
  do {
    i += step;
    if (i >= players.length) {
      i = 0;
    } else {
      if (i < 0) {
        i = players.length - 1;
      }
    }

    loop_on = 0;
    if (players[i].status == "BUST") loop_on = 1;
    if (players[i].status == "FOLD") loop_on = 1;
    if (++j < delta) loop_on = 1;
  } while (loop_on);

  return i;
}

function getLocalStorage (key) {
  if (!localStorage) {
    if (typeof getLocalStorage.count == 'undefined') {
      getLocalStorage.count = 0;
      my_pseudo_alert("Your browser do not support localStorage");
    }
    return null;
  }
  return localStorage.getItem(key);
}

function setLocalStorage (key, value) {
  if (!localStorage) {
    return "";
  }
  return localStorage.setItem(key, value);
}

function has_money (i) {
  if (players[i].bankroll >= 0.01) {
    return true;
  }
  return false;
}

function confirm_new () {
  if (confirm("Are you sure that you want to restart the entire game?")) {
    new_game();
  }
}

function confirm_quit () {
  if (confirm("Are you sure that you want to quit?")) {
    close();
  }
}
function compRan () {
  return 0.5 - Math.random();
}
