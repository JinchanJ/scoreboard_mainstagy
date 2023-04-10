(($) => {
  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".anim_container_outer"],
      {
        duration: 0.5,
        y: "-130px",
        ease: "power2.Out",
      },
      1
    )
    .from(
      [".p1 .inner_container"],
      {
        duration: 0.83,
        x: "181px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p2 .inner_container"],
      {
        duration: 0.83,
        x: "-181px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p1 .sponsor_container"],
      {
        duration: 0.83,
        x: "-181px",
        ease: "power2.Out",
      },
      "<"
    )

    .from(
      [".p2 .sponsor_container"],
      {
        duration: 0.83,
        x: "181px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p1 .name_container"],
      {
        duration: 0.75,
        x: "200px",
        ease: "power2.Out",
      },
      "<50%"
    )
    .from(
      [".p2 .name_container"],
      {
        duration: 0.75,
        x: "-200px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p1 .flags_container"],
      {
        duration: 0.75,
        x: "200px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p2 .flags_container"],
      {
        duration: 0.75,
        x: "-200px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p1 .losers_container"],
      {
        duration: 0.75,
        x: "270px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p2 .losers_container"],
      {
        duration: 0.75,
        x: "-270px",
        ease: "power2.Out",
      },
      "<"
    )
    .from(
      [".p1.twitter"],
      {
        duration: 0.75,
        x: "-373px",
        ease: "power2.Out",
      },
      "<25%"
    )
    .from(
      [".p2.twitter"],
      {
        duration: 0.75,
        x: "373px",
        ease: "power2.Out",
      },
      "<"
    );

  function Start() {
    startingAnimation.restart();
  }

  var data = {};
  var oldData = {};

  async function Update() {
    oldData = data;
    data = await getData();

    [data.score.team["1"], data.score.team["2"]].forEach((team, t) => {
      [team.player["1"]].forEach((player, p) => {
        if (player) {
          const playerLosers = document.querySelector(
            `.p${t + 1} .losers_container`
          );

          if (team.losers) {
            playerLosers.classList.add("unhidden");
            playerLosers.classList.remove("hidden");
          } else {
            playerLosers.classList.add("hidden");
            playerLosers.classList.remove("unhidden");
          }

          SetInnerHtml(
            $(`.p${t + 1}.container .name`),
            `
              ${player.name ? player.name.toUpperCase() : ""}
            `
          );

          SetInnerHtml(
            $(`.p${t + 1} .losers_container`),
            `${team.losers ? "<span class='losers'>[L]</span>" : ""}`
          );

          let score = [data.score.score_left, data.score.score_right];

          SetInnerHtml($(`.p${t + 1} .score`), String(team.score));

          SetInnerHtml(
            $(`.p${t + 1} .sponsor_container`),
            `<div class='sponsor_logo' style='background-image: url(../../${player.sponsor_logo})'></div>`
          );
        }
      });
    });
  }

  async function UpdateFlagSponsor() {
    oldData = data;
    data = await getData();

    [data.score.team["1"], data.score.team["2"]].forEach((team, t) => {
      [team.player["1"]].forEach((player, p) => {
        if (player) {
          if (!player.country.asset && !player.sponsor_logo) {
            SetInnerHtml($(`.p${t + 1}.container .flagcountry`), "");
          } else if (player.country.asset && player.sponsor_logo) {
            SetInnerHtml(
              $(`.p${t + 1}.container .flagcountry`),
              `<div class='flag' style='background-image: url(../../${player.country.asset.toLowerCase()})'></div>`
            );
            SetInnerHtml(
              $(`.p${t + 1}.container .flagcountry`),
              `<div class='flag' style='background-image: url(../../${player.sponsor_logo})'></div>`
            );
          } else if (player.country.asset && !player.sponsor_logo) {
            SetInnerHtml(
              $(`.p${t + 1}.container .flagcountry`),
              `<div class='flag' style='background-image: url(../../${player.country.asset.toLowerCase()})'></div>`
            );
          } else if (!player.country.asset && player.sponsor_logo) {
            SetInnerHtml(
              $(`.p${t + 1}.container .flagcountry`),
              `<div class='flag' style='background-image: url(../../${player.sponsor_logo})'></div>`
            );
          }
        }
      });
    });
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  async function UpdateMatch() {
    oldData = data;
    data = await getData();

    const tournamentContainer = document.querySelector(".tournament_container");

    if (
      data.score.best_of == 0 &&
      (data.score.match == undefined || String(data.score.match) == "")
    ) {
      tournamentContainer.classList.add("hidden");
      tournamentContainer.classList.remove("unhidden");
    } else {
      tournamentContainer.classList.add("unhidden");
      tournamentContainer.classList.remove("hidden");

      if (
        data.score.best_of == 0 &&
        !(data.score.match == undefined || String(data.score.match) == "")
      ) {
        SetInnerHtml($(".match"), data.score.match.toUpperCase());
      } else if (
        data.score.best_of > 0 &&
        (data.score.match == undefined || String(data.score.match) == "")
      ) {
        SetInnerHtml($(".match"), "BEST OF " + data.score.best_of);
      } else {
        SetInnerHtml($(".match"), "BEST OF " + data.score.best_of);
        SetInnerHtml($(".match"), data.score.match.toUpperCase());
      }
    }
  }

  Update();
  $(window).on("load", () => {
    $("body").fadeTo(1, 1, async () => {
      Start();
      setInterval(Update, 100);
      UpdateMatch();
      setInterval(UpdateMatch, 9000);
      UpdateFlagSponsor();
      setInterval(UpdateFlagSponsor, 9000);
    });
  });
})(jQuery);
