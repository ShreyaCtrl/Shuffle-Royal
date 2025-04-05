import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import "./GameDescription.css";

const GameDescription = () => {
    const game = {
      _id: "ObjectId",
      game_name: "Poker",
      description:
        "A classic card game where players bet based on the strength of their hands and try to win chips from opponents.",
      rules: {
        max_players: 10,
        min_players: 2,
        scoring:
          "Hand rankings decide the winner, with combinations like Royal Flush, Straight Flush, and Four of a Kind.",
      },
    };

  return (
    <div className="m-4 box-content rounded-3xl transition-shadow flex  items-center justify-center  scroll-auto">
      <div className="p-2 flex flex-col items-center justify-center box-content bg-white bg-shadow rounded-2xl">
        <Typography variant="h4" className="font-bold">
          {game.game_name}
        </Typography>

        <div className="mt-2 p-2 text-xl ">{game.description}</div>

        <Box className="mt-4 text-sm ">
          <p className="text-lg ">
            <strong className="font-bold">Min Players:</strong>{" "}
            {game.rules.min_players}
          </p>
          <p className="text-lg ">
            <strong className="font-bold">Max Players:</strong>{" "}
            {game.rules.max_players}
          </p>
          <p className="text-lg ">
            <strong className="font-bold">Scoring:</strong> {game.rules.scoring}
          </p>
        </Box>
        <button className="button">
          <p>Play Now</p>
        </button>
      </div>
    </div>
  );
}

export default GameDescription;
