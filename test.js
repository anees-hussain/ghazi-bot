const fetch = require("node-fetch");
console.log("running");

let url = "https://www.instagram.com/anees__hussain/?__a=1";

let settings = { method: "Get" };

fetch(url, settings)
  .then((res) => res.json())
  .then((json) =>
    console.log(json)
  );

// console.log(`https://www.instagram.com/p/${recentPost}`);

/* db.ref("engagementRound/postURLs/" + id).set({
                      url: `https://www.instagram.com/p/${json.graphql.user.edge_owner_to_timeline_media.edges[0].node.shortcode}/`,
                    })
*/
