const YAML = require("yaml");
const scriptID = "cplayer-script";

function cplayer(args, content) {
  const targetID = "cplayer-" + Math.random().toString(10).substring(2);

  let autoplay = false;
  let parser = "yaml";

  args.forEach((arg) => {
    switch (arg.trim()) {
      case "autoplay":
        autoplay = true;
        break;
      case "yaml":
        parser = "yaml";
        break;
      case "json":
        parser = "json";
        break;
      default:
        break;
    }
  });

  const playlist = (function (parser) {
    switch (parser) {
      case "json":
        return JSON.parse(content);
      case "yaml":
        return YAML.parse(content);
    }
  })(parser);

  return `
      <div id='${targetID}'></div>
      <script>
        (function(){
          function loadCplayer() {
            if (typeof window.cplayerList === 'undefined') window.cplayerList = {};
            if (typeof window.cplayerList['${targetID}'] !== 'undefined') return;

            window.cplayerList['${targetID}'] = new cplayer({
              element: document.getElementById('${targetID}'),
              playlist: ${JSON.stringify(playlist)},
              generateBeforeElement: true,
              deleteElementAfterGenerate: true,
              autoplay: ${autoplay}
            });
          }

          if (typeof window.cplayer === 'undefined' && !document.getElementById('${scriptID}')) {
            var js = document.createElement("script");
            js.id = ${JSON.stringify(scriptID)};
            js.src = 'https://cdnjs.cloudflare.com/ajax/libs/cplayer/3.2.1/cplayer.js';
            js.addEventListener("load", loadCplayer);
            document.body.appendChild(js);
          } else {
            window.addEventListener("load", loadCplayer);
          }
        })()
      </script>
      `;
}

hexo.extend.tag.register("cplayer", cplayer, { ends: true, async: true });
