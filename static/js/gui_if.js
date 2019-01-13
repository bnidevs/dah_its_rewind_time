function get_a_class_named (curr, searched_name) {
  if (!curr) {
    log_to_history("get_a_class_named, no curr for " + searched_name);
  }
  var notes = null;
  for (var i = 0; i < curr.childNodes.length; i++) {
    if (curr.childNodes[i].className == searched_name) {
      notes = curr.childNodes[i];
      break;
    }
  }
  return notes;
}

function convertRanking (rank) {
  if (rank == 14) {
    rank = 'ace';
  } else if (rank == 13) {
    rank = 'king';
  } else if (rank == 12) {
    rank = 'queen';
  } else if (rank == 11) {
    rank = 'jack';
  }
  return rank;
}

function convertSuiting (suit) {
  if (suit == 'c') {
    suit = 'clubs';
  } else if (suit == 'd') {
    suit = 'diamonds';
  } else if (suit == 'h') {
    suit = 'hearts';
  } else if (suit == 's') {
    suit = 'spades';
  } else {
    alert('Unknown suit ' + suit);
  }

  return suit;
}


function GetCardImageUrl (card) {
  var suit = card.substring(0, 1);
  var rank = card.substring(1);
  rank = convertRanking(rank); 
  suit = convertSuiting(suit); 

  return "url('static/images/" + rank + '_of_' + suit + ".png')";
}

function setBackground (diva, image) {
  var komage = diva.style;
  komage['background-image'] = image;
}

function setCard (diva, card) {
  var image;
  if (typeof card == 'undefined' || card == "") {
    image = "url('static/images/outline.gif')";
  } else if (card == "blinded") {
    image = "url('static/images/cardback.png')";
  } else {
    image = GetCardImageUrl(card);
  }

  setBackground(diva, image);
}

function clickin_helper (button, button_text, func_on_click) {
  if (button_text == 0) {
    button.style.visibility = 'hidden';
  } else {
    button.style.visibility = 'visible';
    button.innerHTML = button_text;
    button.onclick = func_on_click;
  }
}
// GUI
function hide_poker_table () {
  var table = document.getElementById('poker_table');
  table.style.visibility = 'hidden';
}

function show_poker_table () {
  var table = document.getElementById('poker_table');
  table.style.visibility = 'visible';
}

function set_player_name (name, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = get_a_class_named(seatloc, 'name-chips');
  var namediv = get_a_class_named(chipsdiv, 'player-name');
  if (name == "") {
    seatloc.style.visibility = 'hidden';
  } else {
    seatloc.style.visibility = 'visible';
  }
  namediv.textContent = name;
}

function highlight_player (highlight_color, name_color, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = get_a_class_named(seatloc, 'name-chips');
  var namediv = get_a_class_named(chipsdiv, 'player-name');
  if (name_color == "") {
    namediv.style.color = chipsdiv.style.color;
  } else {
    namediv.style.color = name_color;
  }
  if (highlight_color == "") {
    namediv.style.backgroundColor = chipsdiv.style.backgroundColor;
  } else {
    namediv.style.backgroundColor = highlight_color;
  }
}

function set_bank (amount, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = get_a_class_named(seatloc, 'name-chips');
  var namediv = get_a_class_named(chipsdiv, 'chips');
  if (!isNaN(amount) && amount != "") {
    amount = "$" + amount;
  }
  else{
    amount - "$0"; 
  }
  namediv.textContent = amount;
}

function set_bet (bet, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var betdiv = get_a_class_named(seatloc, 'bet');

  betdiv.textContent = bet;
}

function set_player_cards (card_a, card_b, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var cardsdiv = get_a_class_named(seatloc, 'holecards');
  var card1 = get_a_class_named(cardsdiv, 'card holecard1');
  var card2 = get_a_class_named(cardsdiv, 'card holecard2');

  setCard(card1, card_a);
  setCard(card2, card_b);
}

function lay_board_card (n, the_card) {
  var current = '';
  if (n == 0) {
    current = 'flop1';
  } else if (n == 1) {
    current = 'flop2';
  } else if (n == 2) {
    current = 'flop3';
  } else if (n == 3) {
    current = 'turn';
  } else if (n == 4) {
    current = 'river';
  }

  var table = document.getElementById('poker_table');
  var seatloc = table.children.board;

  var cardsdiv = seatloc.children[current];
  setCard(cardsdiv, the_card);
}

function write_basic_general (pot_size) {
  var table = document.getElementById('poker_table');
  var pot_div = table.children.pot;
  var total_div = pot_div.children['total-pot'];

  var the_pot = 'Total pot: ' + pot_size;
  total_div.innerHTML = the_pot;
}

function write_basic_general_text (text) {
  var table = document.getElementById('poker_table');
  var pot_div = table.children.pot;
  var total_div = pot_div.children['total-pot'];
  total_div.style.visibility = 'visible';
  total_div.innerHTML = text;
}

var log_text = [];
var log_index = 0;

function log_to_history (text_to_write) {
  for (var idx = log_index; idx > 0; --idx) {
    log_text[idx] = log_text[idx - 1];
  }

  log_text[0] = text_to_write;
  if (log_index < 40) {
    log_index = log_index + 1;
  }
  var text_to_output = '<br><b>' + log_text[0] + '</b>';
  for (idx = 1; idx < log_index; ++idx) {
    text_to_output += '<br>' + log_text[idx];
  }
  var history = document.getElementById('history');
  history.innerHTML = text_to_output;
}

function hide_log_window () {
  var history = document.getElementById('history');
  history.style.display = 'none';
}

function place_dealer_button (seat) {
  var table_seat = seat;
  var button = document.getElementById('button');
  if (seat < 0) {
    button.style.visibility = 'hidden';
  } else {
    button.style.visibility = 'visible';
  }
  button.className = 'seat' + table_seat + '-button';
}

function hide_dealer_button () {
  place_dealer_button(-3);
}

function hide_fold_call_raise_click () {
  var buttons = document.getElementById('action-options');
  var fold = buttons.children['fold-button'];
  clickin_helper(fold, 0, 0);

  var call = buttons.children['call-button'];
  clickin_helper(call, 0, 0);

  var raise = buttons.children['raise-button'];
  clickin_helper(raise, 0, 0);
}

function setup_fold_call_raise_click (show_fold, call_text, raise_text,
  fold_func, call_func, raise_func) {
  var buttons = document.getElementById('action-options');
  var fold = buttons.children['fold-button'];
  clickin_helper(fold, show_fold, fold_func);

  var call = buttons.children['call-button'];
  clickin_helper(call, call_text, call_func);

  var raise = buttons.children['raise-button'];
  clickin_helper(raise, raise_text, raise_func);
}

function curry_in_speedfunction (speed_func) {
  var call_back = speed_func;

  var ret_func = function () {
    var buttons = document.getElementById('setup-options');
    var speed = buttons.children['speed-button'];
    var selector = speed.children['speed-selector'];
    var qqq = selector.children['speed-options'];
    var index = qqq.value;
    var value = qqq[index].text;

    call_back(value);
  }
  return ret_func;
}

function set_selected_speed_option (index) {
  var buttons = document.getElementById('setup-options');
  var speed = buttons.children['speed-button'];
  var selector = speed.children['speed-selector'];
  var qqq = selector.children['speed-options'];
  qqq.value = index;
}

function le_button (buttons, button_name, button_func) {
  var le_button = buttons.children[button_name];
  le_button.style.visibility = 'visible';
  le_button.onclick = button_func;
}



function hide_le_button (buttons, button_name, button_func) {
  var le_button = buttons.children[button_name];
  le_button.style.visibility = 'hidden';
}

function hide_setup_option_buttons (name_func, speed_func, help_func, check_func) {
  var buttons = document.getElementById('setup-options');

  hide_le_button(buttons, 'name-button');
  hide_le_button(buttons, 'speed-button');
  hide_le_button(buttons, 'help-button');
  hide_le_button(buttons, 'check-button');
}

function hide_game_response () {
  var response = document.getElementById('game-response');
  response.style.visibility = 'hidden';
}

function show_game_response () {
  var response = document.getElementById('game-response');
  response.style.visibility = 'visible';
}

function write_game_response (text) {
  var response = document.getElementById('game-response');
  response.innerHTML = text;
}

function write_guick_raise (text) {
  var response = document.getElementById('quick-raises');
  if (text == "") {
    response.style.visibility = 'hidden';
  } else {
    response.style.visibility = 'visible';
    response.innerHTML = text;
  }
}

function hide_guick_raise () {
  write_guick_raise("");
}

function write_modal_box (text) {
  var modal = document.getElementById('modal-box');
  if (text == "") {
    modal.style.display = "none";
  } else {
    modal.innerHTML = text;
    modal.style.display = "block";
  }
}

function initialize_css () {
  var image;
  var item;
  item = document.getElementById('poker_table');
  image = "url('static/images/poker_table.png')";
  setBackground(item, image);
}
