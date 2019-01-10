
var tests = ["straight_flush", "four_of_a_kind", "full_house", "flush", "straight", "three_of_a_kind", "two_pair", "one_pair", "high_card"];
////////////////////////////////////////////
//Helper Functions

function high_card(player) {
  var my_cards = group_cards(player);
  var working_cards = new Array(my_cards.length);
  for (var i = 0; i < working_cards.length; i++)
    working_cards[i] = get_rank(my_cards[i]);
  for (var i = 0; i < working_cards.length; i++)
    if (working_cards[i] == null)
      working_cards[i] = -1;
  working_cards.sort(compNum);
  var arr = {};
  for (var i = 0; i < 5; i++) {
    if (!working_cards[i])
      working_cards[i] = "";
    arr["high_card_" + i] = working_cards[i];
  }
  arr["num_needed"] = 0;
  arr["hand_name"] = "high Card";

  return arr;
}

function compare_high_card(a, b) {
  for (var i = 0; i < 5; i++) {
    var high_a = a["high_card_" + i];
    var high_b = b["high_card_" + i];
    if (high_a > high_b) {
      return "a";
    }
    else if (high_b > high_a) {
      return "b";
    }
  }
  return "c";
}

function get_suit(card) {
  if (card) 
    return card.substring(0, 1);
  else return "";
}

function get_rank(card) {
  if (card) 
    return card.substring(1) - 0;
  else return "";
}

function get_predominant_suit(my_cards) {
  var suit_count = [0, 0, 0, 0];
  for (var i = 0; i < my_cards.length; i++) 
  {
    var s = get_suit(my_cards[i]);
    if (s == "C") {
      suit_count[0]++;
    }
    else if (s == "S") {
      suit_count[1]++;
    }
    else if (s == "H") {
      suit_count[2]++;
    }
    else if (s == "D") {
      suit_count[3]++;
    }
  }
  var suit_index = 0;
  if (suit_count[1] > suit_count[suit_index]) {
    suit_index = 1;
  }
  if (suit_count[2] > suit_count[suit_index]) {
    suit_index = 2;
  }
  if (suit_count[3] > suit_count[suit_index]) {
    suit_index = 3;
  }
  if (suit_index == 0){
    return "C";
  }
  else if (suit_index == 1) {
    return "S";
  }
  else if (suit_index == 2) {
    return "H";
  }
  else if (suit_index == 3) {
    return "D";
  }
  return "";
}

function group_cards(player) {
  var c = new Array(7);
  for (var i = 0; i < 5; i++){
    c[i] = board[i];
  }
  c[5] = player.carda;
  c[6] = player.cardb;
  return c;
}

function compNum(a, b) {
  return b - a;
}



function get_winners(players) {
  var winners;
  for (var i = 0; i < tests.length; i++) {
    winners = winners_helper(players, tests[i]);
    if (winners) {
      break;
    }
  }
  return winners;
}

function execute_test(string, player) {
  if (string === 'straight_flush') {
    return straight_flush(player);
  }
  if (string === 'four_of_a_kind') {
    return four_of_a_kind(player);
  }
  if (string === 'full_house') {
    return full_house(player);
  }
  if (string === 'flush') {
    return flush(player);
  }
  if (string === 'straight') {
    return straight(player);
  }
  if (string === 'three_of_a_kind') {
    return three_of_a_kind(player);
  }
  if (string === 'two_pair') {
    return two_pair(player);
  }
  if (string === 'one_pair') {
    return one_pair(player);
  }
  if (string === 'high_card') {
    return high_card(player);
  }
  ET_calling_home(string);
}


function execute_compare(string, hand_in, best_hand) {
  if (string === 'compare_straight_flush') {
    return compare_straight_flush(hand_in, best_hand);
  }
  if (string === 'compare_four_of_a_kind') {
    return compare_four_of_a_kind(hand_in, best_hand);
  }
  if (string === 'compare_full_house') {
    return compare_full_house(hand_in, best_hand);
  }
  if (string === 'compare_flush') {
    return compare_flush(hand_in, best_hand);
  }
  if (string === 'compare_straight') {
    return compare_straight(hand_in, best_hand);
  }
  if (string === 'compare_three_of_a_kind') {
    return compare_three_of_a_kind(hand_in, best_hand);
  }
  if (string === 'compare_two_pair') {
    return compare_two_pair(hand_in, best_hand);
  }
  if (string === 'compare_one_pair') {
    return compare_one_pair(hand_in, best_hand);
  }
  if (string === 'compare_high_card') {
    return compare_high_card(hand_in, best_hand);
  }
  ET_calling_home(string);
}


function winners_helper(players, test) {
  var best;
  var winners = new Array(players.length);
  for (var i = 0; i < players.length; i++) {
    if (!players[i]) 
      continue;
    var a = execute_test("" + test, players[i]);
    var num_needed = a["num_needed"];
    if (num_needed > 0 || (num_needed == 0 && num_needed != "0")){
      continue;
    }
    if (typeof(best) == 'undefined') {
      best = a;
      winners = new Array(players.length);
      winners[i] = a;
    } else {
      var comp = execute_compare("compare_" + test, a, best);
      if (comp == "a") { 
        best = a;
        winners = new Array(players.length); 
        winners[i] = a;
      } 
      else if (comp == "b") { 
      } 
      else if (comp == "c") { 
        winners[i] = a;
      }
    }
  }
  for (var i = 0; i < winners.length; i++) {
    if (winners[i])
      return winners;
  }
  return null;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Checking hands

function straight_flush(player) {
  var my_cards = group_cards(player);
  var the_suit = get_predominant_suit(my_cards);
  var working_cards = new Array(8);
  var working_index = 0;
  for (var i = 0; i < 7; i++) {
    if (get_suit(my_cards[i]) == the_suit) {
      var my_rank = get_rank(my_cards[i]);
      working_cards[working_index++] = my_rank;
      if (my_rank == 14) {
        working_cards[7] = 1;
      }
    }
  }
  for (var i = 0; i < working_cards.length; i++){
    if (working_cards[i] == null) {
      working_cards[i] = -1;
    }
  }
  working_cards.sort(compNum);
  var absolute_longest_stretch = 0;
  var absolute_high_card = 0;
  var current_longest_stretch = 1;
  var current_high_card = 0;
  for (var i = 0; i < 8; i++) {
    var a = working_cards[i];
    var b = working_cards[i + 1];
    if (a && b && a - b == 1) {
      current_longest_stretch++;
      if (current_high_card < 1) {
        current_high_card = a;
      }
    } else if (a) {
      if (current_longest_stretch > absolute_longest_stretch) {
        absolute_longest_stretch = current_longest_stretch;
        if (current_high_card < 1) current_high_card = a;
        absolute_high_card = current_high_card;
      }
      current_longest_stretch = 1;
      current_high_card = 0;
    }
  }
  var num_mine = 0;
  for (var i = 0; i < absolute_longest_stretch; i++) {
    if (the_suit + (absolute_high_card - i) == player.carda || the_suit + (absolute_high_card - i) == player.cardb) num_mine++;
  }
  var arr = {};
  arr["straight_high"] = absolute_high_card;
  arr["num_needed"] = 5 - absolute_longest_stretch;
  arr["num_mine"] = num_mine;
  arr["hand_name"] = "Straight Flush";

  return arr;
}



function four_of_a_kind(player) {
  var my_cards = group_cards(player);
  var ranks = new Array(13);
  for (var i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (var i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  var four = "", kicker = "";
  for (var i = 0; i < 13; i++) {
    if (ranks[i] == 4) {
      four = i + 2;
    }
    else if (ranks[i] > 0) {
      kicker = i + 2;
    }
  }
  var num_mine = 0;
  if (get_rank(player.carda) == four) {
    num_mine++;
  }
  if (get_rank(player.cardb) == four) {
    num_mine++;
  }
  var num_needed = 4;
  if (four) num_needed = 0;

  var arr = {};
  arr["rank"] = four;
  arr["kicker"] = kicker;
  arr["num_needed"] = num_needed;
  arr["num_mine"] = num_mine;
  arr["hand_name"] = "Four of a Kind";

  return arr;
}


function full_house(player) {
  var my_cards = group_cards(player);
  var ranks = new Array(13);
  for (var i = 0; i < 13; i++){
    ranks[i] = 0;
  }
  for (var i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  var three = "";
  var two = "";
  for (var i = 0; i < 13; i++) {
    if (ranks[i] == 3) {
      if (three > two) {
        two = three;
      }
      three = i + 2;
    } 
    else if (ranks[i] == 2){ 
    }    two = i + 2;
  }
  var num_needed = 5;
  var major_rank = "";
  var num_mine_major = 0;
  if (three) {
    num_needed -= 3;
    major_rank = three;
    if (get_rank(player.carda) == three) {
      num_mine_major += 1;
    }
    if (get_rank(player.cardb) == three) {
      num_mine_major += 1;
    }
  }
  var arr = {};
  arr["major_rank"] = major_rank;
  arr["num_mine_major"] = num_mine_major;

  var minor_rank = "";
  var num_mine_minor = 0;
  if (two) {
    num_needed -= 2;
    minor_rank = two;
    if (get_rank(player.carda) == two) {
      num_mine_minor += 1;
    }
    if (get_rank(player.cardb) == two) {
      num_mine_minor += 1;
    }
  }
  arr["minor_rank"] = minor_rank;
  arr["num_mine_minor"] = num_mine_minor;
  arr["num_mine"] = num_mine_minor + num_mine_major;
  arr["num_needed"] = num_needed;
  arr["hand_name"] = "Full House";

  return arr;
}



function flush(player) {
  var my_cards = group_cards(player);
  var the_suit = get_predominant_suit(my_cards);
  var working_cards = new Array(7);
  var working_index = 0;
  var num_in_flush = 0;
  for (var i = 0; i < my_cards.length; i++) {
    if (get_suit(my_cards[i]) == the_suit) {
      num_in_flush++;
      working_cards[working_index++] = get_rank(my_cards[i]);
    }
  }
  for (var i = 0; i < working_cards.length; i++){
    if (working_cards[i] == null){
      working_cards[i] = -1;
    }
  }
  working_cards.sort(compNum);
  var arr = {};

  var num_mine = 0;
  for (var i = 0; i < 5; i++) {
    var s = working_cards[i];
    if (!s) {
      s = "";
    }
    arr["flush_" + i] = s;
    if (the_suit + working_cards[i] == player.carda || the_suit + working_cards[i] == player.cardb){ 
      num_mine++;
    }
  }
  arr["num_needed"] = 5 - num_in_flush;
  arr["num_mine"] = num_mine;
  arr["suit"] = the_suit;
  arr["hand_name"] = "Flush";

  return arr;
}


function straight(player) {
  var my_cards = group_cards(player);
  var working_cards = new Array(8);
  var ranks = new Array(13);
  for (var i = 0; i < 7; i++) {
    var my_rank = get_rank(my_cards[i]);
    if (ranks[my_rank - 2]) {
      continue;
    }
    else {
      ranks[my_rank - 2] = 1;
    }
    working_cards[i] = my_rank;
    if (my_rank == 14){
     working_cards[7] = 1; 
    }
  }
  for (var i = 0; i < working_cards.length; i++) {
    if (working_cards[i] == null) {
      working_cards[i] = -1;
    }
  }
  working_cards.sort(compNum);
  var absolute_longest_stretch = 0;
  var absolute_high_card = 0;
  var current_longest_stretch = 1;
  var current_high_card = 0;
  for (var i = 0; i < 8; i++) {
    var a = working_cards[i];
    var b = working_cards[i + 1];
    if (a && b && a - b == 1) {
      current_longest_stretch++;
      if (current_high_card < 1){
       current_high_card = a;
      }
    } else if (a) {
      if (current_longest_stretch > absolute_longest_stretch) {
        absolute_longest_stretch = current_longest_stretch;
        if (current_high_card < 1) {
          current_high_card = a;
        }
        absolute_high_card = current_high_card;
      }
      current_longest_stretch = 1;
      current_high_card = 0;
    }
  }
  var num_mine = 0;
  for (var i = 0; i < absolute_longest_stretch; i++) {
    if (absolute_high_card - i == get_rank(player.carda) || absolute_high_card - i == get_rank(player.cardb)) {
      num_mine++;
    }
  }
  var arr = {};
  arr["straight_high"] = absolute_high_card;
  arr["num_needed"] = 5 - absolute_longest_stretch;
  arr["num_mine"] = num_mine;
  arr["hand_name"] = "Straight";

  return arr;
}


function three_of_a_kind(player) {
  var my_cards = group_cards(player);
  var ranks = new Array(13);
  for (var i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (var i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  var three = "",kicker_1 = "",kicker_2 = "";
  for (var i = 0; i < 13; i++) {
    if (ranks[i] == 3) {
      three = i + 2;
    }
    else if (ranks[i] == 1) {
      kicker_2 = kicker_1;
      kicker_1 = i + 2;
    } else if (ranks[i] > 1) {
      kicker_1 = i + 2;
      kicker_2 = i + 2;
    }
  }
  var num_mine = 0;
  if (get_rank(player.carda) == three) {
    num_mine++;
  }
  if (get_rank(player.cardb) == three) {
    num_mine++;
  }
  var num_needed = 3;
  if (three) {
    num_needed = 0;
  }
  var arr = {};
  arr["rank"] = three;
  arr["num_needed"] = num_needed;
  arr["num_mine"] = num_mine;
  arr["kicker_1"] = kicker_1;
  arr["kicker_2"] = kicker_2;
  arr["hand_name"] = "Three of a Kind";

  return arr;
}



function two_pair(player) {
  var my_cards = group_cards(player);
  var ranks = new Array(13);
  for (var i = 0; i < 13; i++) {
    ranks[i] = 0;
  }
  for (var i = 0; i < my_cards.length; i++) {
    ranks[get_rank(my_cards[i]) - 2]++;
  }
  var first = "",second = "",kicker = "";
  for (var i = 12; i > -1; i--) {
    if (ranks[i] == 2) {
      if (!first) first = i + 2;
      else if (!second) {
        second = i + 2;
      }
      else if (!kicker) {
        kicker = i + 2;
      }
      else break;
    } else if (!kicker && ranks[i] > 0) kicker = i + 2;
  }
  var num_mine = 0;
  if (get_rank(player.carda) == first || get_rank(player.carda) == second) {
    num_mine++;
  }
  if (get_rank(player.cardb) == first || get_rank(player.cardb) == second) {
    num_mine++;
  }
  var num_needed = 2;
  if (second) {
    num_needed = 0;
  }
  else if (first) {
    num_needed = 1;
  }
  else {
    num_needed = 2;
  }
  var arr = {};
  arr["rank_1"] = first;
  arr["rank_2"] = second;
  arr["num_needed"] = num_needed;
  arr["num_mine"] = num_mine;
  arr["kicker"] = kicker;
  arr["hand_name"] = "Two Pair";

  return arr;
}



function one_pair(player) {
  var my_cards = group_cards(player);
  var ranks = new Array(13);
  for (var i = 0; i < 13; i++) ranks[i] = 0;
  for (var i = 0; i < my_cards.length; i++) ranks[get_rank(my_cards[i]) - 2]++;
  var pair = 0,
    kicker_1 = "",
    kicker_2 = "",
    kicker_3 = "";
  for (var i = 0; i < 13; i++) {
    if (ranks[i] == 2) pair = i + 2;
    else if (ranks[i] == 1) {
      kicker_3 = kicker_2;
      kicker_2 = kicker_1;
      kicker_1 = i + 2;
    } else if (ranks[i] > 2) {
      kicker_1 = i + 2;
      kicker_2 = i + 2;
      kicker_3 = i + 2;
    }
  }
  var num_mine = 0;
  if (get_rank(player.carda) == pair) num_mine++;
  if (get_rank(player.cardb) == pair) num_mine++;
  var num_needed = 1;
  if (pair) num_needed = 0;
  var arr = {};
  arr["rank"] = pair;
  arr["num_needed"] = num_needed;
  arr["num_mine"] = num_mine;
  arr["kicker_1"] = kicker_1;
  arr["kicker_2"] = kicker_2;
  arr["kicker_3"] = kicker_3;
  arr["hand_name"] = "One Pair";

  return arr;
}



///////////////////////////////////////////////////////////////////////
// Compare levels

function compare_one_pair(a, b) {
  var rank_a = a["rank"];
  var rank_b = b["rank"];
  if (rank_a > rank_b) {
    return "a";
  } else if (rank_b > rank_a) {
    return "b";
  } else {
    var kicker_a = a["kicker_1"];
    var kicker_b = b["kicker_1"];
    if (kicker_a > kicker_b) {
      return "a";
    } else if (kicker_b > kicker_a) {
      return "b";
    } else {
      kicker_a = a["kicker_2"];
      kicker_b = b["kicker_2"];
      if (kicker_a > kicker_b) {
        return "a";
      } else if (kicker_b > kicker_a) {
        return "b";
      } else {
        kicker_a = a["kicker_3"];
        kicker_b = b["kicker_3"];
        if (kicker_a > kicker_b) {
          return "a";
        } else if (kicker_b > kicker_a) {
          return "b";
        } else {
          return "c";
        }
      }
    }
  }
}

function compare_two_pair(a, b) {
  var rank_a = a["rank_1"];
  var rank_b = b["rank_1"];
  if (rank_a > rank_b) {
    return "a";
  }
  else if (rank_b > rank_a) {
    return "b";
  }
  else {
    rank_a = a["rank_2"];
    rank_b = b["rank_2"];
    if (rank_a > rank_b) {
      return "a";
    }
    else if (rank_b > rank_a) {
      return "b";
    }
    else {
      var kicker_a = a["kicker"];
      var kicker_b = b["kicker"];
      if (kicker_a > kicker_b) {
        return "a";
      }
      else if (kicker_b > kicker_a) {
        return "b";
      }
      else {
        return "c";
      }
    }
  }
}

function compare_three_of_a_kind(a, b) {
  var rank_a = a["rank"];
  var rank_b = b["rank"];
  if (rank_a > rank_b) {
    return "a";
  }
  else if (rank_b > rank_a) {
    return "b";
  }
  else {
    var kicker_a = a["kicker_1"];
    var kicker_b = b["kicker_1"];
    if (kicker_a > kicker_b) {
      return "a";
    }
    else if (kicker_b > kicker_a) {
      return "b";
    }
    else {
      kicker_a = a["kicker_2"];
      kicker_b = b["kicker_2"];
      if (kicker_a > kicker_b) {
        return "a";
      }
      else if (kicker_b > kicker_a) {
        return "b";
      }
      else {
        return "c";
      }
    }
  }
}

function compare_straight(a, b) {
  var high_a = a["straight_high"];
  var high_b = b["straight_high"];
  if (high_a > high_b) {
    return "a";
  }
  else if (high_b > high_a) {
    return "b";
  }
  else {
    return "c";
  }
}

function compare_full_house(a, b) {
  var major_a = a["major_rank"];
  var major_b = b["major_rank"];
  if (major_a > major_b) {
    return "a";
  }
  else if (major_b > major_a) { 
    return "b";
  }
  else {
    var minor_a = a["minor_rank"];
    var minor_b = b["minor_rank"];
    if (minor_a > minor_b) {
      return "a";
    }
    else if (minor_b > minor_a) {
      return "b";
    }
    else {
      return "c";
    }
  }
}


function compare_four_of_a_kind(a, b) {
  var rank_a = a["rank"];
  var rank_b = b["rank"];
  if (rank_a > rank_b) {
    return "a";
  }
  else if (rank_b > rank_a) {
    return "b";
  }
  else {
    var kicker_a = a["kicker"];
    var kicker_b = b["kicker"];
    if (kicker_a > kicker_b){
     return "a";
    }
    else if (kicker_b > kicker_a){
     return "b";
    }
    else {
      return "c";
    }
  }
}

function compare_flush(a, b) {
  for (var i = 0; i < 5; i++) {
    var flush_a = a["flush_" + i];
    var flush_b = b["flush_" + i];
    if (flush_a > flush_b) {
      return "a";
    }
    else if (flush_b > flush_a) {
      return "b";
    }
  }
  return "c";
}

function compare_straight_flush(a, b) {
  return compare_straight(a, b);
}