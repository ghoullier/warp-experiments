// import WarpJS
import { defaultWarper as warper } from "@warpjs/warp";
import engine from "@warpjs/engine";

// init WarpJS
engine.init({ config: { logging: "info" } });

engine.setErrorHandler(function(error) {
  console.error(error.name + ": " + error.message);
});

const screenshot = async (
  url = "http://whatsmyuseragent.org/",
  browserTypes = ["chromium", "firefox", "webkit"]
) => {
  "warp +server -client";
  const fs = require("fs");
  const path = require("path");
  const playwright = require("playwright");
  const screenshots = {};
  for (const browserType of browserTypes) {
    try {
      const browser = await playwright[browserType].launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
      const filePath = path.join(`example-${browserType}.png`);
      await page.screenshot({ path: filePath });
      const b64string = fs.readFileSync(filePath, { encoding: "base64" });
      await browser.close();
      screenshots[browserType] = b64string;
    } catch (e) {
      screenshots[browserType] = e;
    }
  }
  return screenshots;
};

document.querySelector("form").addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const browserTypes = data.getAll("browserTypes");
  const url = data.get("url");
  const requestId = `screenshot-${browserTypes.join("_")}:${url}`;
  console.time(requestId);
  const screenshots = await warper.call(screenshot, url, browserTypes);
  console.log("screenshots", screenshots);
  const html = Object.entries(screenshots)
    .map(
      ([browserType, base64]) =>
        `<label>${browserType}<img title="Screenshot ${browserType}" src="data:image/png;base64,${base64}" /></label>`
    )
    .join("");
  document.getElementById("result").innerHTML = html;
  console.timeEnd(requestId);
});
