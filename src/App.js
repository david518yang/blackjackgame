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
  const [userCards, setUserCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [deckId, setDeckId] = useState(null);
  const [gameResult, setGameResult] = useState("");
  const [isDealerCardHidden, setIsDealerCardHidden] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOngoing, setGameOngoing] = useState(false);
  const [gameJustStarting, setGameJustStarting] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [betStatusMessage, setBetStatusMessage] = useState("");
  const [playerChipCount, setPlayerChipCount] = useState(0);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [currentBet, setCurrentBet] = useState(null);
  const [outOfChips, setOutOfChips] = useState(false);

  useEffect(() => {
    if (
      userCards.length === 2 &&
      hasBlackjack(userCards) &&
      hasBlackjack(dealerCards)
    ) {
      setIsDealerCardHidden(false);
      gameEnd({
        result: "Both have Blackjack! 🤯 It's a tie!",
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    } else if (userCards.length === 2 && hasBlackjack(userCards)) {
      setIsDealerCardHidden(false);
      console.log("player has blackjack");
      gameEnd({
        result: "Player has Blackjack! Player wins!",
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    } else if (dealerCards.length === 2 && hasBlackjack(dealerCards)) {
      setIsDealerCardHidden(false);
      console.log("dealer has blackjack");
      gameEnd({
        result: "Dealer has Blackjack! Dealer wins!",
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    }

    if (calculateHandValue(userCards) > 21) {
      gameEnd({
        result: "Player busted, Dealer wins!",
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    } else if (
      calculateHandValue(userCards) === 21 &&
      !hasBlackjack(userCards)
    ) {
      stand(dealerCards);
    }

    if (calculateHandValue(dealerCards) > 21) {
      gameEnd({
        result: "Dealer busted, Player wins!",
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    } else if (calculateHandValue(dealerCards) >= 17 && !isPlayerTurn) {
      gameEnd({
        currentUserCards: userCards,
        currentDealerCards: dealerCards
      });
    }
  }, [userCards, dealerCards, isPlayerTurn]);

  useEffect(() => {
    if (gameResult == "") {
      return;
    }
    if (gameResult.includes("Player has Blackjack")) {
      setPlayerChipCount((prevCount) => prevCount + 2.5 * currentBet);
    } else if (gameResult.includes("Player wins")) {
      setPlayerChipCount((prevCount) => prevCount + 2 * currentBet);
    } else if (gameResult.includes("tie")) {
      setPlayerChipCount((prevCount) => prevCount + currentBet);
    }
  }, [gameResult]);

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

      if (recipient === "user") {
        setUserCards((prevCards) => [...prevCards, ...drawn]);
      } else if (recipient === "dealer") {
        setDealerCards((prevCards) => [...prevCards, ...drawn]);
      }

      return drawn;
    } catch (error) {
      console.error("Error drawing cards:", error);
    }
  }

  function allIn() {
    setCurrentBet(playerChipCount);
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
    if (currentBet <= 0 || !currentBet) {
      setBetStatusMessage("Invalid bet amount! Must be greater than 0.");
      return;
    }

    if (currentBet > playerChipCount) {
      setBetStatusMessage("Bet size is larger than your current stack!");
      return;
    }
    setGameJustStarting(false);
    setBetStatusMessage("");
    setGameOngoing(true);
    setIsPlayerTurn(true);
    setPlayerChipCount((prevCount) => prevCount - currentBet);
    console.log("Starting initialization...");
    await drawCards(1, "user");
    console.log("Drew 1 card for user.");
    await delay(500);
    await drawCards(1, "dealer");
    console.log("Drew 1 card for dealer.");
    await delay(500);
    await drawCards(1, "user");
    console.log("Drew 1 more card for user.");
    await delay(500);
    await drawCards(1, "dealer");
    console.log("Drew 1 more card for dealer.");
  }

  async function hit() {
    console.log("==hit==");
    const drawnCard = await drawCards(1, "user");
    const newUserCards = [...userCards, ...drawnCard];
    setBetStatusMessage("");
    setUserCards(newUserCards);
  }

  async function stand() {
    console.log("==stand==");
    setIsPlayerTurn(false);
    setBetStatusMessage("");
    setIsDealerCardHidden(false);
    await dealerDraw();
  }

  async function double() {
    console.log("==double==");
    if (currentBet > playerChipCount) {
      setBetStatusMessage("Not enough chips to double");
      return;
    }
    setCurrentBet(currentBet * 2);
    hit();
    stand();
  }

  function clear() {
    setUserCards([]);
    setDealerCards([]);
    setGameResult("");
    setBetStatusMessage("");
    setIsDealerCardHidden(true);
    setGameOngoing(false);
    setCurrentBet(null);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function gameEnd({ result, currentUserCards, currentDealerCards }) {
    console.log("==gameend==");
    setIsDealerCardHidden(false);
    let tempResult = "";
    if (!result) {
      tempResult = determineWinner(currentUserCards, currentDealerCards);
      if (tempResult.includes("Dealer wins") && playerChipCount === 0) {
        setOutOfChips(true);
      }
      setGameResult(tempResult);
    } else {
      if (result.includes("Dealer wins") && playerChipCount === 0) {
        setOutOfChips(true);
      }
      setGameResult(result);
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
      <h2>Result: {gameResult}</h2>
      {gameResult.includes("🤯") && <img src="https://i.ytimg.com/vi/RzCxKSpj98g/sddefault.jpg" width={250} height={250}/>}

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

      <div id="playerZone">
        <h2>Player's Cards:</h2>
        <div className="card-container">
          <div className="cards">
            {userCards.map((card) => (
              <div key={card.code} className="card">
                <img src={card.image} alt={card.code} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <h4>Current Bet: {currentBet}</h4>
      {gameJustStarting && <Button action={shuffle} name="Shuffle" />}
      {!gameJustStarting && gameOngoing ? (
        <>
          {/* <Button action={shuffle} name="Shuffle" /> */}
          {gameResult === "" && (
            <>
              <Button action={hit} name="Hit" />
              <Button action={() => stand(dealerCards)} name="Stand" />
              <Button action={double} name="Double" />
            </>
          )}
        </>
      ) : gameResult ? (
        <Button action={clear} name="Clear" />
      ) : (
        <>
          {outOfChips ? (
            <p>You ran out of chips! Shuffle to restart.</p>
          ) : !gameJustStarting ? (
            <>
              <input
                type="number"
                value={currentBet}
                onChange={(e) => setCurrentBet(parseInt(e.target.value))}
                placeholder="Enter Bet Amount"
              />
              <Button action={allIn} name="All In" />
              <Button action={initializeCards} name="Deal" />
            </>
          ) : (
            <></>
          )}
          {outOfChips == true && <Button action={shuffle} name="Shuffle" />}
        </>
      )}
      <p>{betStatusMessage}</p>

      <h4>Chip Count: {playerChipCount}</h4>
    </div>
  );
}
