import Navigo from "navigo";
import { capitalize } from "lodash";
import * as state from "./store";
import { Header, Nav, Main, Footer } from "./components";
import axios from "axios";
import "./env";
import "cors"

const router = new Navigo(window.location.origin);

router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)]),
  })
  .resolve();

function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;
  router.updatePageLinks();

  addEventListener(st);
  addNavEventListeners();
  addScoreEventListener(st);
  addPlayerEventListener(state.Lineup)


}

render(state.Home);




function addNavEventListeners() {
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-hockey-puck")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}

function addEventListener(view = {}) {

  if (view === state.Home) {
    document.getElementById('submitButton')
      .addEventListener("click", () => getData());
  }
}

function addScoreEventListener(view = {}) {
  if (view === state.Home) {
    document.getElementById('submitButton')
      .addEventListener("click", () => getScore());
  }
};





function getData() {


  const selectedHomeTeam = document.getElementById('chooseHome').value;
  // console.log(selectedHomeTeam);
  const selectedAwayTeam = document.getElementById('chooseAway').value;
  // console.log(selectedAwayTeam);
  const selectedDate = document.getElementById('game-date').value.split("-").join("");
  // console.log(selectedDate);
  const selectedSeason = document.getElementById('chooseSeason').value;
  // console.log(selectedSeason);

  axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nhl/${selectedSeason}/games/${selectedDate}-${selectedHomeTeam}-${selectedAwayTeam}/lineup.json`,
    {
      headers: {
        Authorization: `Basic ${process.env.MSFAPI}`
      },
      params: {
        position: 'Goalie-Starter'
      }
    }
  )
    .then(response => {
      // console.log(response.data)
      /// hide the error if request is valid
      const gameData = response.data;
      const homeGoalie = gameData.teamLineups[0].actual.lineupPositions[0].player;
      const homeGoalieRef = gameData.references.playerReferences[0]
      const awayGoalieRef = gameData.references.playerReferences[1]
      const awayGoalie = gameData.teamLineups[1].actual.lineupPositions[0].player;
      const homeTeamElement = document.getElementById('homeTeam');
      // console.log(homeTeamElement);
      const awayTeamElement = document.getElementById('awayTeam');
      const cardHome = document.createElement("div");
      const cardAway = document.createElement("div");
      homeTeamElement.innerHTML = '';
      awayTeamElement.innerHTML = '';
      cardHome.innerHTML = `
        <h2>Starting Home Goalie : ${homeGoalie.firstName} ${homeGoalie.lastName} </h2>
        <img
        src="${homeGoalieRef.officialImageSrc.split("https").join("http")}"
        alt="Daily"



        width="50"
        height="50"
      />

        <h3> Birthplace : ${homeGoalieRef.birthCity}, ${homeGoalieRef.birthCountry} </h3>
        <h3> Height : ${homeGoalieRef.height} </h3>
        <h3> Age : ${homeGoalieRef.age} </h3>
        <h3> Jersey Number : ${homeGoalieRef.jerseyNumber} </h3>

      `;
      homeTeamElement.appendChild(cardHome);

      cardAway.innerHTML = `<div>
        <h2>Starting Away Goalie : ${awayGoalie.firstName} ${awayGoalie.lastName} </h2>
        <img
        src="${awayGoalieRef.officialImageSrc.split("https").join("http")}"
        alt="Daily"



        width="50"
        height="50"
      />

        <h3> Birthplace : ${awayGoalieRef.birthCity}, ${awayGoalieRef.birthCountry} </h3>
        <h3> Height : ${awayGoalieRef.height} </h3>
        <h3> Age : ${awayGoalieRef.age} </h3>
        <h3> Jersey Number : ${awayGoalieRef.jerseyNumber} </h3>

        </div>`;
      awayTeamElement.appendChild(cardAway);
    }).catch(err => {
      console.log(err);
    })

}


function getScore() {
  const selectedHomeTeam = document.getElementById('chooseHome').value;
  // console.log(selectedHomeTeam);
  const selectedAwayTeam = document.getElementById('chooseAway').value;
  // console.log(selectedAwayTeam);
  const selectedDate = document.getElementById('game-date').value.split("-").join("");
  // console.log(selectedDate);
  const selectedSeason = document.getElementById('chooseSeason').value;
  // console.log(selectedSeason);

  axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nhl/${selectedSeason}/games/${selectedDate}-${selectedHomeTeam}-${selectedAwayTeam}/boxscore.json`,
    {
      headers: {
        Authorization: `Basic ${process.env.MSFAPI}`
      }
    })
    .then(response => {
      // console.log(response.data)
      /// hide the error if request is valid
      const scoreData = response.data;
      const homeScore = scoreData.scoring;
      const awayScore = scoreData.scoring;
      const homeStats = scoreData.stats.home
      const awayStats = scoreData.stats.away
      // console.log(homeScore, awayScore)
      const homeScoreElement = document.getElementById('sidebar');
      // console.log(homeScoreElement);
      const awayScoreElement = document.getElementById('sidebar');
      const scoreCardHome = document.createElement("div");
      const scoreCardAway = document.createElement("div");
      homeScoreElement.innerHTML = '';
      awayScoreElement.innerHTML = '';
      scoreCardHome.innerHTML = `
        <h2> Home Stats </h2>
        <h3> Goals : ${homeScore.homeScoreTotal}</h3>
        <h3> Shots : ${homeStats.teamStats[0].miscellaneous.shots} </h3>
        <h3> Hits : ${homeStats.teamStats[0].miscellaneous.hits} </h3>
        <h3> Blocks : ${homeStats.teamStats[0].miscellaneous.blockedShots} </h3>
        <h3> Faceoff Wins : ${homeStats.teamStats[0].faceoffs.faceoffWins} </h3>
        <h3> PP Goals : ${homeStats.teamStats[0].powerplay.powerplayGoals} </h3>
        <h3> PP Percent : ${homeStats.teamStats[0].powerplay.powerplayPercent} </h3>


            `;
      homeScoreElement.appendChild(scoreCardHome);

      scoreCardAway.innerHTML = `
        <h2> Away Stats </h2>
        <h3> Goals : ${awayScore.homeScoreTotal}</h3>
        <h3> Shots : ${awayStats.teamStats[0].miscellaneous.shots} </h3>
        <h3> Hits : ${awayStats.teamStats[0].miscellaneous.hits} </h3>
        <h3> Blocks : ${awayStats.teamStats[0].miscellaneous.blockedShots} </h3>
        <h3> Faceoff Wins : ${awayStats.teamStats[0].faceoffs.faceoffWins} </h3>
        <h3> PP Goals : ${awayStats.teamStats[0].powerplay.powerplayGoals} </h3>
        <h3> PP Percent : ${awayStats.teamStats[0].powerplay.powerplayPercent} </h3>

            `;
      awayScoreElement.appendChild(scoreCardAway);

    })
}





function addPlayerEventListener(view = {}) {
  if (view === state.Lineup && document.readyState === "complete") {
    document.getElementById('lineupButton')
      .addEventListener("click", () => getPlayerStats());
  }
}




function getPlayerStats() {

  const selectedPlayer = document.getElementById('choosePlayer').value;
  console.log(selectedPlayer);
  axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nhl/2019-2020-regular/player_stats_totals.json`,
    {
      headers: {
        Authorization: `Basic ${process.env.MSFAPI}`
      },
      params: {
        player: `${selectedPlayer}`
      }
    }
  )
    .then(response => {
      const statsData = response.data;
      // console.log(statsData);
      const playerStats = statsData.playerStatsTotals[0].stats
      // console.log(playerStats);
      const playerRef = statsData.references.playerReferences[0]
      // console.log(playerRef)
      const playerStatElement = document.getElementById('lineupCard')
      const playerCard = document.createElement("div");
      playerStatElement.innerHTML = '';
      playerCard.innerHTML = `<h2> Seasonal Player Stats </h2>
     <img
        src="${playerRef.officialImageSrc.split("https").join("http")}"
        alt="Daily"



        width="50"
        height="50"
      />
     <h2> ${playerRef.firstName} ${playerRef.lastName}</h2>
     <h3> Games Played : ${playerStats.gamesPlayed}
     <h3> Goals : ${playerStats.scoring.goals}</h3>
     <h3> Assists : ${playerStats.scoring.assists}</h3>
     <h3> SOG: ${playerStats.skating.shots}</h3>
     <h3> Hits : ${playerStats.skating.hits}</h3>
     <h3> Blocks : ${playerStats.skating.blockedShots}</h3>
     <h3> PIM : ${playerStats.penalties.penaltyMinutes}</h3>
    `;
      playerStatElement.appendChild(playerCard);


    })
}

;
let x = new Date();
let y = x.getFullYear().toString();
let m = (x.getMonth() + 1).toString();
let d = x.getDate().toString();
(d.length == 1) && (d = '0' + d);
(m.length == 1) && (m = '0' + m);
let yyyymmdd = y + m + d;


function getGameScores(view = {}) {

  axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nhl/2021-regular/date/${yyyymmdd}/games.json?current`,
    {
      headers: {
        Authorization: `Basic ${process.env.MSFAPI}`
      }
    }
  )
    .then(response => {
      const boxScoreData = response.data;
      // console.log(boxScoreData);
      const homeBoxScore = boxScoreData.games.score
      const boxScoreElement = document.getElementById('boxScoreDiv')
      boxScoreData.games.forEach((game) => {
        var boxScoreCard = document.createElement("div");
        boxScoreCard.innerHTML = `
  <h7> ${game.schedule.homeTeam.abbreviation}  vs ${game.schedule.awayTeam.abbreviation} </h7>
  <br>
  <h8> ${game.score.homeScoreTotal} - ${game.score.awayScoreTotal}  </h8>
  <br>
  <h8> ${game.score.homeShotsTotal} SOG ${game.score.awayShotsTotal} </h8>


    `
        boxScoreElement.appendChild(boxScoreCard);
      })
    })
}
getGameScores();








// axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nhl/2021-playoff/player_stats_totals_projections.json`,
//   {
//     headers: {
//       Authorization: `Basic ${process.env.MSFAPI}`
//     }
//   }
// )
//   .then(response => {
//     let projections = response.data;
//     console.log(projections);
//   });



















