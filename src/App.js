import React, { useState, useEffect } from "react";
import "./styles.css";
import Button from "./Button";
import {
  calculateHandValue,
  hasBlackjack,
  determineWinner
} from "./GameLogic.js";

export default function App() {
  const API_URL = "https://deckofcardsapi.com/api/deck";
  const [user1Cards, setUser1Cards] = useState([]);
  const [user2Cards, setUser2Cards] = useState([]);
  const [user3Cards, setUser3Cards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [deckId, setDeckId] = useState(null);
  const [game1Result, setGame1Result] = useState("");
  const [game2Result, setGame2Result] = useState("");
  const [game3Result, setGame3Result] = useState("");
  const [isDealerCardHidden, setIsDealerCardHidden] = useState(true);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(false);
  const [isPlayer2Turn, setIsPlayer2Turn] = useState(false);
  const [isPlayer3Turn, setIsPlayer3Turn] = useState(false);
  const [gameOngoing, setGameOngoing] = useState(false);
  const [gameJustStarting, setGameJustStarting] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [betStatusMessage, setBetStatusMessage] = useState("");
  const [playerChipCount, setPlayerChipCount] = useState(0);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [currentBet1, setCurrentBet1] = useState(null);
  const [currentBet2, setCurrentBet2] = useState(null);
  const [currentBet3, setCurrentBet3] = useState(null);
  const [outOfChips, setOutOfChips] = useState(false);

  useEffect(() => {
    console.log("game1 useeffect")
    if (isPlayer1Turn){
      if (
        user1Cards.length === 2 &&
        hasBlackjack(user1Cards) &&
        hasBlackjack(dealerCards)
      ) {
        setIsDealerCardHidden(false);
        gameEnd({
          result: "Both have Blackjack! 🤯 It's a tie!",
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      } else if (user1Cards.length === 2 && hasBlackjack(user1Cards)) {
        setIsDealerCardHidden(false);
        console.log("player has blackjack");
        gameEnd({
          result: "Player has Blackjack! Player wins!",
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      } else if (dealerCards.length === 2 && hasBlackjack(dealerCards)) {
        setIsDealerCardHidden(false);
        console.log("dealer has blackjack");
        gameEnd({
          result: "Dealer has Blackjack! Dealer wins!",
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      }
  
      if (calculateHandValue(user1Cards) > 21) {
        gameEnd({
          result: "Player busted, Dealer wins!",
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      } else if (
        calculateHandValue(user1Cards) === 21 &&
        !hasBlackjack(user1Cards)
      ) {
        stand(dealerCards);
      }
  
      if (calculateHandValue(dealerCards) > 21) {
        gameEnd({
          result: "Dealer busted, Player wins!",
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      } else if (calculateHandValue(dealerCards) >= 17 && !isPlayer1Turn) {
        gameEnd({
          currentUser1Cards: user1Cards,
          currentDealerCards: dealerCards,
          user: "user1"
        });
      }
    }
  }, [user1Cards, dealerCards, isPlayer1Turn]);

  useEffect(() => {
    console.log("game2 useeffect")
    if(isPlayer2Turn){
      if (
        user2Cards.length === 2 &&
        hasBlackjack(user2Cards) &&
        hasBlackjack(dealerCards)
      ) {
        setIsDealerCardHidden(false);
        gameEnd({
          result: "Both have Blackjack! 🤯 It's a tie!",
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      } else if (user2Cards.length === 2 && hasBlackjack(user2Cards)) {
        setIsDealerCardHidden(false);
        console.log("player has blackjack");
        gameEnd({
          result: "Player has Blackjack! Player wins!",
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      } else if (dealerCards.length === 2 && hasBlackjack(dealerCards)) {
        setIsDealerCardHidden(false);
        console.log("dealer has blackjack");
        gameEnd({
          result: "Dealer has Blackjack! Dealer wins!",
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      }
  
      if (calculateHandValue(user2Cards) > 21) {
        gameEnd({
          result: "Player busted, Dealer wins!",
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      } else if (
        calculateHandValue(user2Cards) === 21 &&
        !hasBlackjack(user2Cards)
      ) {
        stand(dealerCards);
      }
  
      if (calculateHandValue(dealerCards) > 21) {
        gameEnd({
          result: "Dealer busted, Player wins!",
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      } else if (calculateHandValue(dealerCards) >= 17 && !isPlayer2Turn) {
        gameEnd({
          currentUser2Cards: user2Cards,
          currentDealerCards: dealerCards,
          user: "user2"
        });
      }
    }
  }, [user2Cards, dealerCards, isPlayer2Turn]);

  useEffect(() => {
    console.log("game3 useeffect")
    if(isPlayer3Turn){
      if (
        user3Cards.length === 2 &&
        hasBlackjack(user3Cards) &&
        hasBlackjack(dealerCards)
      ) {
        setIsDealerCardHidden(false);
        gameEnd({
          result: "Both have Blackjack! 🤯 It's a tie!",
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      } else if (user3Cards.length === 2 && hasBlackjack(user3Cards)) {
        setIsDealerCardHidden(false);
        console.log("player has blackjack");
        gameEnd({
          result: "Player has Blackjack! Player wins!",
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      } else if (dealerCards.length === 2 && hasBlackjack(dealerCards)) {
        setIsDealerCardHidden(false);
        console.log("dealer has blackjack");
        gameEnd({
          result: "Dealer has Blackjack! Dealer wins!",
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      }
  
      if (calculateHandValue(user3Cards) > 21) {
        gameEnd({
          result: "Player busted, Dealer wins!",
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      } else if (
        calculateHandValue(user3Cards) === 21 &&
        !hasBlackjack(user3Cards)
      ) {
        stand(dealerCards);
      }
  
      if (calculateHandValue(dealerCards) > 21) {
        gameEnd({
          result: "Dealer busted, Player wins!",
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      } else if (calculateHandValue(dealerCards) >= 17 && !isPlayer3Turn) {
        gameEnd({
          currentUser3Cards: user3Cards,
          currentDealerCards: dealerCards,
          user: "user3"
        });
      }
    }
  }, [user3Cards, dealerCards, isPlayer3Turn]);

  useEffect(() => {
    console.log("bet payout useeffect game1")
    if (game1Result === "") {
      return;
    }
    if (game1Result.includes("Player has Blackjack")) {
      setPlayerChipCount((prevCount) => prevCount + 2.5 * currentBet1);
    } else if (game1Result.includes("Player wins")) {
      setPlayerChipCount((prevCount) => prevCount + 2 * currentBet1);
    } else if (game1Result.includes("tie")) {
      setPlayerChipCount((prevCount) => prevCount + currentBet1);
    }
  }, [game1Result, currentBet1]);

  useEffect(() => {
    console.log("bet payout useeffect game2")
    if (game2Result === "") {
      return;
    }
    if (game2Result.includes("Player has Blackjack")) {
      setPlayerChipCount((prevCount) => prevCount + 2.5 * currentBet2);
    } else if (game2Result.includes("Player wins")) {
      setPlayerChipCount((prevCount) => prevCount + 2 * currentBet2);
    } else if (game2Result.includes("tie")) {
      setPlayerChipCount((prevCount) => prevCount + currentBet2);
    }
  }, [game2Result, currentBet2]);

  useEffect(() => {
    console.log("bet payout useeffect game3")
    if (game3Result === "") {
      return;
    }
    if (game3Result.includes("Player has Blackjack")) {
      setPlayerChipCount((prevCount) => prevCount + 2.5 * currentBet3);
    } else if (game3Result.includes("Player wins")) {
      setPlayerChipCount((prevCount) => prevCount + 2 * currentBet3);
    } else if (game3Result.includes("tie")) {
      setPlayerChipCount((prevCount) => prevCount + currentBet3);
    }
  }, [game3Result, currentBet3]);

  async function shuffle() {
    clear();
    setGameJustStarting(false);
    setPlayerChipCount(1000);
    setOutOfChips(false);
    setGameOngoing(false);
    try {
      const response = await fetch(`${API_URL}/new/shuffle/?deck_count=6`);
      const data = await response.json();
      setDeckId(data.deck_id);
      setStatusMessage(`Shuffling deck ${data.deck_id}...`);
      setCardsRemaining(data.remaining)
      setTimeout(() => {
        setStatusMessage(`Playing with deck ${data.deck_id}`);
      }, 500);
    } catch (error) {
      console.error("Error fetching new deck:", error);
    }
  }

  async function drawCards(numCards, recipient) {
    if (!deckId) {
      console.error("No deck available. Please get a new deck first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${deckId}/draw/?count=${numCards}`
      );
      const data = await response.json();
      setCardsRemaining(data.remaining)
      const drawn = data.cards.map((card, index) => ({
        ...card,
        uniqueId: `${card.code}_${Date.now()}_${index}`
      }));

      if (recipient === "user1") {
        setUser1Cards((prevCards) => [...prevCards, ...drawn]);
      } else if (recipient === "user2") {
        setUser2Cards((prevCards) => [...prevCards, ...drawn]);
      } else if (recipient === "user3") {
        setUser3Cards((prevCards) => [...prevCards, ...drawn]);
      } else if (recipient === "dealer") {
        setDealerCards((prevCards) => [...prevCards, ...drawn]);
      }

      return drawn;
    } catch (error) {
      console.error("Error drawing cards:", error);
    }
  }

  function allIn(userNum) {
    switch(userNum){
      case 1:
        setCurrentBet1(playerChipCount)
        setCurrentBet2(0)
        setCurrentBet3(0)
        break
      case 2:
        setCurrentBet1(0)
        setCurrentBet2(playerChipCount)
        setCurrentBet3(0)
        break
      case 3:
        setCurrentBet1(0)
        setCurrentBet2(0)
        setCurrentBet3(playerChipCount)
        break
      default:
        break
    }
  }

  async function dealerDraw() {
    let currentDealerCards = [...dealerCards];
    while (calculateHandValue(currentDealerCards) < 17) {
      const drawnCards = await drawCards(1, "dealer");
      currentDealerCards = [...currentDealerCards, ...drawnCards];
      setDealerCards(currentDealerCards);
      console.log("delaying 1000");
      await delay(1000);
    }

    console.log("currentdealercards at dealerdraw:");
    currentDealerCards.forEach((card) => {
      console.log(`${card.value}${card.suit[0].toUpperCase()}`);
    });
    console.log("------------");
  }

  async function initializeCards() {
    if (currentBet1 <= 0 || currentBet2 <= 0 || currentBet3 <= 0 || currentBet1+currentBet2+currentBet3>playerChipCount || (!currentBet1&&!currentBet2&&!currentBet3) || currentBet1+currentBet2+currentBet3===0) {
      setBetStatusMessage("Invalid bet amount.");
      return;
    }

    setGameJustStarting(false);
    setBetStatusMessage("");
    setGameOngoing(true);
    setPlayerChipCount((prevCount) => prevCount - (currentBet1||0+currentBet2||0+currentBet3||0));

    console.log("Starting initialization...");
    if(currentBet1){
      setIsPlayer1Turn(true);
      await drawCards(1, "user1")
      console.log("Drew 1 card for user1.");
      await delay(500);
      if(currentBet2){
        await drawCards(1,"user2")
        console.log("Drew 1 card for user2.");
        await delay(500);
        if(currentBet3){
          await drawCards(1,"user3")
          console.log("Drew 1 card for user3.");
          await delay(500);
        }
      }
      await drawCards(1,"dealer")
      console.log("Drew 1 card for dealer.");
      await delay(500);

      await drawCards(1,"user1")
      console.log("Drew 1 card for user1.");
      await delay(500);
      if(currentBet2){
        await drawCards(1,"user2")
        console.log("Drew 1 card for user2.");
        await delay(500);
        if(currentBet3){
          await drawCards(1,"user3")
          console.log("Drew 1 card for user3.");
          await delay(500);
        }
      }
      console.log("Drew 1 card for dealer");

    }
  }

  async function hit(user) {
    console.log("==hit==");
    setBetStatusMessage("");
    const drawnCard = await drawCards(1, user);
    if (user==="user1"){
      const newCards = [...user1Cards, ...drawnCard];
      setUser1Cards(newCards);
    }
    if (user==="user2"){
      const newCards = [...user2Cards, ...drawnCard];
      setUser2Cards(newCards);
    }
    if (user==="user3"){
      const newCards = [...user3Cards, ...drawnCard];
      setUser3Cards(newCards);
    }
  }

  async function stand(user) {
    console.log("==stand==");
    if(user==="user1"){
      setIsPlayer1Turn(false)
      setIsPlayer2Turn(true)
    } else if(user==="user2"){
      setIsPlayer2Turn(false)
      setIsPlayer3Turn(true)
    } else if(user==="user3"){
      setIsPlayer3Turn(false)
    }
    setBetStatusMessage("");
    setIsDealerCardHidden(false);
    await dealerDraw();
  }

  async function double(user) {
    console.log("==double==");
    if(user==="user1"){
      if(currentBet1>playerChipCount){
        setBetStatusMessage("Not enough chips to double");
        return;
      }
      setCurrentBet1(currentBet1 * 2);
    } else if(user==="user2"){
      if(currentBet2>playerChipCount){
        setBetStatusMessage("Not enough chips to double");
        return;
      }
      setCurrentBet2(currentBet2 * 2);
    } else if(user==="user3"){
      if(currentBet3>playerChipCount){
        setBetStatusMessage("Not enough chips to double");
        return;
      }
      setCurrentBet3(currentBet3 * 2);
    }

    hit(user);
    stand(user);
  }

  function clear() {
    setUser1Cards([]);
    setUser2Cards([]);
    setUser3Cards([]);
    setDealerCards([]);
    setGame1Result("");
    setGame2Result("");
    setGame3Result("");
    setBetStatusMessage("");
    setIsDealerCardHidden(true);
    setGameOngoing(false);
    setCurrentBet1(null);
    setCurrentBet2(null);
    setCurrentBet3(null);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function gameEnd({ result, currentUserCards, currentDealerCards, user }) {
    console.log("==gameend==");
    setIsDealerCardHidden(false);
    let tempResult = "";
    if (!result) {
      tempResult = determineWinner(currentUserCards, currentDealerCards);
      if (tempResult.includes("Dealer wins") && playerChipCount === 0) {
        setOutOfChips(true);
      }

      if(user==="user1"){
        setGame1Result(tempResult);
        setIsPlayer1Turn(false)
        setIsPlayer2Turn(true)
      } else if(user==="user2"){
        setGame2Result(tempResult);
        setIsPlayer2Turn(false)
        setIsPlayer3Turn(true)
      } else if(user==="user3"){
        setGame3Result(tempResult);
        setIsPlayer3Turn(false)
      }
      
    } else {
      if (result.includes("Dealer wins") && playerChipCount === 0) {
        setOutOfChips(true);
      }
      if(user==="user1"){
        setGame1Result(result);
        setIsPlayer1Turn(false)
        setIsPlayer2Turn(true)
      } else if(user==="user2"){
        setGame2Result(result);
        setIsPlayer2Turn(false)
        setIsPlayer3Turn(true)
      } else if(user==="user3"){
        setGame3Result(result);
        setIsPlayer3Turn(false)
      }
    }
    setGameOngoing(false);
  }

  return (
    <div className="App" id="gameTable">
      <header>
        <h1>Blackjack Game</h1>
      </header>

      <p>{statusMessage}</p>
      <p>Cards Remaining: {cardsRemaining}</p>
      {/* {gameResult.includes("🤯") && <img src="https://i.ytimg.com/vi/RzCxKSpj98g/sddefault.jpg" width={250} height={250}/>} */}

      <div id="dealerZone">
        <h2>Dealer's Cards:</h2>
        <div className="card-container">
          <div className="cards">
            {dealerCards.map((card, index) => (
              <div key={card.code} className="card">
                {index === 0 && isDealerCardHidden ? (
                  <img
                    src="https://deckofcardsapi.com/static/img/back.png"
                    alt="Card Back"
                    style={{
                      width: "100px"
                    }}
                  />
                ) : (
                  <img src={card.image} alt={card.code} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="playerZone">
        <div className="player1Zone">
          <h2>Player 1's Cards:</h2>
          <div className="card-container">
            <div className="cards">
              {user1Cards.map((card) => (
                <div key={card.code} className="card">
                  <img src={card.image} alt={card.code} />
                </div>
              ))}
            </div>
          </div>
          <h4>Current Bet: {currentBet1}</h4>

          {!gameJustStarting && gameOngoing && isPlayer1Turn ? (
            <>
              {game1Result === "" && (
                <>
                  <Button action={() => hit("user1")} name="Hit" />
                  <Button action={() => stand("user1")} name="Stand" />
                  <Button action={() => double("user1")} name="Double" />
                </>
              )}
            </>
          ) : (
            <>
              <input
                type="number"
                value={currentBet1}
                onChange={(e) => setCurrentBet1(parseInt(e.target.value))}
                placeholder="Enter Bet Amount"
              />
              <Button action={allIn(1)} name="All In" />
              <Button action={initializeCards} name="Deal" />
            </>

          )}
        </div>

        <div className="player2Zone">
          <h2>Player 2's Cards:</h2>
          <div className="card-container">
            <div className="cards">
              {user2Cards.map((card) => (
                <div key={card.code} className="card">
                  <img src={card.image} alt={card.code} />
                </div>
              ))}
            </div>
          </div>
          <h4>Current Bet: {currentBet2}</h4>

          {!gameJustStarting && gameOngoing && isPlayer2Turn ? (
            <>
              {game2Result === "" && (
                <>
                  <Button action={() => hit("user2")} name="Hit" />
                  <Button action={() => stand("user2")} name="Stand" />
                  <Button action={() => double("user2")} name="Double" />
                </>
              )}
            </>
          ) : (
            <>
              <input
                type="number"
                value={currentBet2}
                onChange={(e) => setCurrentBet2(parseInt(e.target.value))}
                placeholder="Enter Bet Amount"
              />
              <Button action={allIn(2)} name="All In" />
            </>

          )}
        </div>

        <div className="player3Zone">
          <h2>Player 3's Cards:</h2>
          <div className="card-container">
            <div className="cards">
              {user3Cards.map((card) => (
                <div key={card.code} className="card">
                  <img src={card.image} alt={card.code} />
                </div>
              ))}
            </div>
          </div>
          <h4>Current Bet: {currentBet3}</h4>

          {!gameJustStarting && gameOngoing && isPlayer3Turn ? (
            <>
              {game3Result === "" && (
                <>
                  <Button action={() => hit("user3")} name="Hit" />
                  <Button action={() => stand("user3")} name="Stand" />
                  <Button action={() => double("user3")} name="Double" />
                </>
              )}
            </>
          ) : (
            <>
              <input
                type="number"
                value={currentBet3}
                onChange={(e) => setCurrentBet3(parseInt(e.target.value))}
                placeholder="Enter Bet Amount"
              />
              <Button action={allIn(3)} name="All In" />
            </>
          )}
        </div>
      </div>

      {!gameOngoing && <Button action={initializeCards} name="Deal" />}
      {((user1Cards&&game1Result) || (user2Cards&&game2Result) || (user3Cards&&game3Result)) && (
        <Button action={clear} name="Clear"/>
      )}
      
      {gameJustStarting && <Button action={shuffle} name="Shuffle" />}
      
      {outOfChips &&
        <>
          <p>You ran out of chips! Shuffle to restart.</p>
          <Button action={shuffle} name="Shuffle" />
        </>
      }


      <p>{betStatusMessage}</p>
      <h4>Chip Count: {playerChipCount}</h4>
    </div>
  );
}
