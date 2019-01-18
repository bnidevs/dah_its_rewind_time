//dah_its_rewind_time - Vincent Chi, Robin Han, Bill Ni, Simon Tsui


function make_deck(){
  //console.log("imhere");
  var request = new XMLHttpRequest();
  request.open('GET',"https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",true);
  request.onload = function(){
    var data = JSON.parse(this.response);
    deckid = data["deck_id"];
    generate_cards(deckid);
    //write("Testing");
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