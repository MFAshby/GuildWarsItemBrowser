// Utility methods for splitting/combining prices

var prices = {
  // Split total val into gold, silver & copper
  split_price: function (price) {
    var ncopper = price % 100;
    var nsilver = Math.floor(price / 100) % 100;
    var ngold = Math.floor((price / 10000));
    return {ngold:ngold, nsilver:nsilver, ncopper: ncopper};
  },

  // Turn gold, silver and copper into total cost
  unsplit_price: function (gold, silver, copper) {
    return (10000 * parseInt(gold)) + (100 * parseInt(silver)) + parseInt(copper);
  },

  // Format prices using the coin icons
  format_price: function (price){
    var price_obj = this.split_price(price);
    var $price_description = $('<span></span>');
    if (price_obj.ngold > 0) {
      $price_description.append('<span style="color:#fdc84e">' + price_obj.ngold + '</span>');
      $price_description.append($('<img src="images/Gold_coin.png"/>'));
    }
    if (price_obj.nsilver > 0) {
      $price_description.append('<span style="color:#cbcbcb">' + price_obj.nsilver + '</span>');
      $price_description.append($('<img src="images/Silver_coin.png"/>'));
    }
    if (price_obj.ncopper > 0) {
      $price_description.append('<span style="color:#d47f46">' + price_obj.ncopper + '</span>');
      $price_description.append($('<img src="images/Copper_coin.png"/>'));
    }
    if ($price_description.text() === "") {
      $price_description.text('No cost!');
    }
    return $price_description;
  }
};
