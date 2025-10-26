import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import "./GameDescription.css";

const GameDesc = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className=" card-primary max-w-4xl p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1
          className="text-4xl font-bold text-center mb-4"
          style={{ color: "var(--theme-quest-purple)" }}
        >
          🃏 Veilbound: The Pact of Suits
        </h1>
        <p className="text-center text-lg text-muted mb-6">
          In the secretive world of{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--theme-quest-lavender)", fontWeight: "600" }}
          >
            Veilbound
          </span>
          , players are emissaries of ancient houses bound by magical pacts.
          Each suit represents a forgotten order—Hearts of Illusion, Spades of
          War, Diamonds of Greed, Clubs of Chaos. The cards you wield are not
          mere tools, but echoes of power. Predict wisely, play boldly, and bend
          fate to your will.
        </p>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            🎯 Objective
          </h2>
          <p className="">
            Outwit your rivals by accurately predicting and winning hands. The
            player with the highest cumulative score across all rounds becomes
            the{" "}
            <span
              style={{
                color: "var(--theme-quest-lavender)",
                fontWeight: "600",
              }}
            >
              Grand Pactmaster
            </span>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            👥 Player Setup
          </h2>
          <ul className="list-disc pl-6">
            <li>Players: 3 to 7</li>
            <li>
              Cards Dealt: Each player receives between 1 and N cards, where N
              is the number of players.
            </li>
            <li>
              Pact Suit (Trump): One card is revealed at the start to determine
              the dominant suit for that game. This suit overrides others in
              hand resolution.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            🃎 Game Components
          </h2>
          <ul className="list-disc pl-6">
            <li>A standard 52-card deck.</li>
            <li>No additional items required.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            🔄 Turn Structure
          </h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Prediction Phase:</strong> After cards are dealt, each
              player secretly decides how many hands they expect to win. All
              predictions are revealed simultaneously.
            </li>
            <li>
              <strong>Play Phase:</strong> The starting player plays one card
              face-up. Play proceeds anticlockwise. Players must follow the suit
              of the first card played if they have it; otherwise, they may play
              any card.
            </li>
            <li>
              <strong>Hand Resolution:</strong> The highest card of the leading
              suit wins the hand. If the trump suit is played, it overrides the
              leading suit unless multiple trump cards are present—then the
              highest trump wins.
            </li>
            <li>
              <strong>Next Round:</strong> The winner of the hand leads the next
              round. Repeat until all cards are played.
            </li>
          </ol>
        </section>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            📊 Scoring System
          </h2>
          <table className="w-full border text-center rounded-lg overflow-hidden shadow-md">
            <thead
              style={{
                backgroundColor: "var(--theme-space-midnight)",
                color: "white",
              }}
            >
              <tr>
                <th className="p-2 border">Prediction</th>
                <th className="p-2 border">Outcome</th>
                <th className="p-2 border">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Predicted x hands and won x</td>
                <td className="p-2 border">Success</td>
                <td className="p-2 border">10 + 2×x</td>
              </tr>
              <tr>
                <td className="p-2 border">Predicted x hands and won &lt; x</td>
                <td className="p-2 border">Underperformed</td>
                <td className="p-2 border">-2×x + 2×(hands won)</td>
              </tr>
              <tr>
                <td className="p-2 border">Predicted 0 hands and won 0</td>
                <td className="p-2 border">Perfect dodge</td>
                <td className="p-2 border">10</td>
              </tr>
              <tr>
                <td className="p-2 border">
                  Predicted 0 hands and won x &gt; 0
                </td>
                <td className="p-2 border">Unexpected wins</td>
                <td className="p-2 border">2×x</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3">
            Scores are tracked across multiple games. The player with the
            highest cumulative score becomes the{" "}
            <span
              style={{
                color: "var(--theme-quest-lavender)",
                fontWeight: "600",
              }}
            >
              Grand Pactmaster
            </span>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            🧠 Special Rules
          </h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Cumulative Play:</strong> All games contribute to a
              running total score, rewarding consistent strategy.
            </li>
            <li>
              <strong>Pact Suit:</strong> The revealed suit at the start of each
              game overrides others in tie-breaks.
            </li>
          </ul>
        </section>

        <section>
          <h2
            className="text-2xl text-bold mb-2"
            style={{ color: "var(--theme-quest-indigo)" }}
          >
            🕯️ Theme Flavor: The Orders of Veilbound
          </h2>
          <ul className="list-disc pl-6">
            <li>
              <span style={{ color: "var(--theme-arcade-pink)" }}>
                Hearts – Order of Illusion ♥️ :
              </span>{" "}
              Masters of deception and misdirection.
            </li>
            <li>
              <span style={{ color: "var(--theme-arcade-red)" }}>
                Spades – Order of War ♠️:
              </span>{" "}
              Ruthless tacticians and conquerors.
            </li>
            <li>
              <span style={{ color: "var(--theme-arcade-yellow)" }}>
                Diamonds – Order of Greed ♦️:
              </span>{" "}
              Traders of fate and fortune.
            </li>
            <li>
              <span style={{ color: "var(--theme-arcade-blue)" }}>
                Clubs – Order of Chaos ♣️:
              </span>{" "}
              Unpredictable agents of entropy.
            </li>
          </ul>
          <p className="text-muted mt-3">
            Players are bound by ancient pacts to these orders, and each hand is
            a battle for dominance in the hidden realm of{" "}
            <span
              style={{
                color: "var(--theme-quest-lavender)",
                fontWeight: "600",
              }}
            >
              Veilbound
            </span>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default GameDesc;
