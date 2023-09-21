const calculateHandValue = (cards) => {
    console.log("==calculatehandvalue==");
    console.log("cards:");
    cards.forEach((card) => {
      console.log(card.code);
    });
    let total = 0;
    let acesCount = 0;
  
    for (let card of cards) {
      if (card.value === "ACE") {
        total += 11;
        acesCount++;
      } else if (
        card.value === "KING" ||
        card.value === "QUEEN" ||
        card.value === "JACK"
      ) {
        total += 10;
      } else {
        total += parseInt(card.value, 10);
      }
    }
  
    while (total > 21 && acesCount > 0) {
      total -= 10;
      acesCount--;
    }
    console.log("total: " + total);
    console.log("-----------------");
    return total;
  };
  
  const hasBlackjack = (cards) => {
    console.log("==hasblackjack==");
    return cards.length === 2 && calculateHandValue(cards) === 21;
  };
  
  const determineWinner = (userCards, dealerCards) => {
    console.log("==determinewinner==");
    const userScore = calculateHandValue(userCards);
    const dealerScore = calculateHandValue(dealerCards);
  
    if (userScore > 21) return "Player busted, Dealer wins!";
    if (dealerScore > 21) return "Dealer busted, Player wins!";
    if (userScore > dealerScore) return "Player wins!";
    if (dealerScore > userScore) return "Dealer wins!";
    return "It's a tie!";
  };
  
  export { calculateHandValue, hasBlackjack, determineWinner };
  