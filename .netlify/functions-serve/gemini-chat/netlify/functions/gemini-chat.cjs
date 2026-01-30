var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/gemini-chat.js
var gemini_chat_exports = {};
__export(gemini_chat_exports, {
  default: () => gemini_chat_default
});
module.exports = __toCommonJS(gemini_chat_exports);
var import_generative_ai = require("@google/generative-ai");
var gemini_chat_default = async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No API key in env");
    }
    const genAI = new import_generative_ai.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
      history: messages.filter((m) => m.role !== "system").map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }))
    });
    const lastUserMsg = messages[messages.length - 1]?.content;
    if (!lastUserMsg) {
      throw new Error("No message");
    }
    const result = await chat.sendMessage(lastUserMsg);
    const reply = result.response.text();
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvZ2VtaW5pLWNoYXQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIG5ldGxpZnkvZnVuY3Rpb25zL2dlbWluaS1jaGF0LmpzXG5pbXBvcnQgeyBHb29nbGVHZW5lcmF0aXZlQUkgfSBmcm9tIFwiQGdvb2dsZS9nZW5lcmF0aXZlLWFpXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChyZXEpID0+IHtcbiAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIk1ldGhvZCBOb3QgQWxsb3dlZFwiLCB7IHN0YXR1czogNDA1IH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IG1lc3NhZ2VzIH0gPSBhd2FpdCByZXEuanNvbigpO1xuXG4gICAgY29uc3QgYXBpS2V5ID0gcHJvY2Vzcy5lbnYuR0VNSU5JX0FQSV9LRVk7IC8vIFx1MjE5MCB0aGlzIGlzIHRoZSBrZXkhXG4gICAgaWYgKCFhcGlLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIEFQSSBrZXkgaW4gZW52XCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGdlbkFJID0gbmV3IEdvb2dsZUdlbmVyYXRpdmVBSShhcGlLZXkpO1xuICAgIGNvbnN0IG1vZGVsID0gZ2VuQUkuZ2V0R2VuZXJhdGl2ZU1vZGVsKHsgbW9kZWw6IFwiZ2VtaW5pLTIuNS1mbGFzaFwiIH0pO1xuXG4gICAgLy8gQ29udmVydCB5b3VyIGhpc3RvcnkgZm9ybWF0IHRvIEdlbWluaSdzIGV4cGVjdGVkIGZvcm1hdFxuICAgIGNvbnN0IGNoYXQgPSBtb2RlbC5zdGFydENoYXQoe1xuICAgICAgaGlzdG9yeTogbWVzc2FnZXNcbiAgICAgICAgLmZpbHRlcigobSkgPT4gbS5yb2xlICE9PSBcInN5c3RlbVwiKSAvLyBza2lwIHN5c3RlbSBpZiB5b3Ugc2VuZCBpdCBzZXBhcmF0ZWx5XG4gICAgICAgIC5tYXAoKG0pID0+ICh7XG4gICAgICAgICAgcm9sZTogbS5yb2xlID09PSBcInVzZXJcIiA/IFwidXNlclwiIDogXCJtb2RlbFwiLFxuICAgICAgICAgIHBhcnRzOiBbeyB0ZXh0OiBtLmNvbnRlbnQgfV0sXG4gICAgICAgIH0pKSxcbiAgICB9KTtcblxuICAgIC8vIElmIHlvdSB3YW50IHRvIGluamVjdCBzeXN0ZW0gcHJvbXB0IGV2ZXJ5IHRpbWUgKG9yIG9ubHkgYXQgc3RhcnQpXG4gICAgY29uc3QgbGFzdFVzZXJNc2cgPSBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXT8uY29udGVudDtcbiAgICBpZiAoIWxhc3RVc2VyTXNnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXNzYWdlXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNoYXQuc2VuZE1lc3NhZ2UobGFzdFVzZXJNc2cpO1xuICAgIGNvbnN0IHJlcGx5ID0gcmVzdWx0LnJlc3BvbnNlLnRleHQoKTtcblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyByZXBseSB9KSwge1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogZXJyLm1lc3NhZ2UgfHwgXCJTZXJ2ZXIgZXJyb3JcIiB9KSxcbiAgICAgIHsgc3RhdHVzOiA1MDAsIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSB9LFxuICAgICk7XG4gIH1cbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLDJCQUFtQztBQUVuQyxJQUFPLHNCQUFRLE9BQU8sUUFBUTtBQUM1QixNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFdBQU8sSUFBSSxTQUFTLHNCQUFzQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDM0Q7QUFFQSxNQUFJO0FBQ0YsVUFBTSxFQUFFLFNBQVMsSUFBSSxNQUFNLElBQUksS0FBSztBQUVwQyxVQUFNLFNBQVMsUUFBUSxJQUFJO0FBQzNCLFFBQUksQ0FBQyxRQUFRO0FBQ1gsWUFBTSxJQUFJLE1BQU0sbUJBQW1CO0FBQUEsSUFDckM7QUFFQSxVQUFNLFFBQVEsSUFBSSx3Q0FBbUIsTUFBTTtBQUMzQyxVQUFNLFFBQVEsTUFBTSxtQkFBbUIsRUFBRSxPQUFPLG1CQUFtQixDQUFDO0FBR3BFLFVBQU0sT0FBTyxNQUFNLFVBQVU7QUFBQSxNQUMzQixTQUFTLFNBQ04sT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLFFBQVEsRUFDakMsSUFBSSxDQUFDLE9BQU87QUFBQSxRQUNYLE1BQU0sRUFBRSxTQUFTLFNBQVMsU0FBUztBQUFBLFFBQ25DLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7QUFBQSxNQUM3QixFQUFFO0FBQUEsSUFDTixDQUFDO0FBR0QsVUFBTSxjQUFjLFNBQVMsU0FBUyxTQUFTLENBQUMsR0FBRztBQUNuRCxRQUFJLENBQUMsYUFBYTtBQUNoQixZQUFNLElBQUksTUFBTSxZQUFZO0FBQUEsSUFDOUI7QUFFQSxVQUFNLFNBQVMsTUFBTSxLQUFLLFlBQVksV0FBVztBQUNqRCxVQUFNLFFBQVEsT0FBTyxTQUFTLEtBQUs7QUFFbkMsV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFBQSxNQUM3QyxRQUFRO0FBQUEsTUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLElBQ2hELENBQUM7QUFBQSxFQUNILFNBQVMsS0FBSztBQUNaLFlBQVEsTUFBTSxHQUFHO0FBQ2pCLFdBQU8sSUFBSTtBQUFBLE1BQ1QsS0FBSyxVQUFVLEVBQUUsT0FBTyxJQUFJLFdBQVcsZUFBZSxDQUFDO0FBQUEsTUFDdkQsRUFBRSxRQUFRLEtBQUssU0FBUyxFQUFFLGdCQUFnQixtQkFBbUIsRUFBRTtBQUFBLElBQ2pFO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
