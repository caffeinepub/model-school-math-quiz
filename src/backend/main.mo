import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Difficulty = { #Easy; #Medium; #Hard };

  module Difficulty {
    public func compare(d1 : Difficulty, d2 : Difficulty) : Order.Order {
      switch (d1, d2) {
        case (#Easy, #Easy) { #equal };
        case (#Easy, _) { #less };
        case (#Medium, #Easy) { #greater };
        case (#Medium, #Medium) { #equal };
        case (#Medium, #Hard) { #less };
        case (#Hard, #Hard) { #equal };
        case (#Hard, _) { #greater };
      };
    };
  };

  type QuizResult = {
    playerName : Text;
    score : Nat;
    difficulty : Difficulty;
    timestamp : Time.Time;
  };

  module QuizResult {
    public func compareByScore(a : QuizResult, b : QuizResult) : Order.Order {
      Nat.compare(b.score, a.score);
    };
  };

  let results = Map.empty<Difficulty, List.List<QuizResult>>();

  public shared ({ caller }) func submitScore(playerName : Text, score : Nat, difficulty : Difficulty) : async () {
    if (score > 10) { Runtime.trap("Score must be between 0 and 10") };

    let newResult : QuizResult = {
      playerName;
      score;
      difficulty;
      timestamp = Time.now();
    };

    let existingResults = switch (results.get(difficulty)) {
      case (null) { List.empty<QuizResult>() };
      case (?res) { res };
    };

    existingResults.add(newResult);
    results.add(difficulty, existingResults);
  };

  public query ({ caller }) func getLeaderboard(difficulty : Difficulty) : async [QuizResult] {
    switch (results.get(difficulty)) {
      case (null) { [] };
      case (?resultList) {
        let sortedArray = resultList.toArray().sort(QuizResult.compareByScore);
        sortedArray.sliceToArray(
          0,
          if (sortedArray.size() < 10) { sortedArray.size() } else { 10 }
        );
      };
    };
  };
};
