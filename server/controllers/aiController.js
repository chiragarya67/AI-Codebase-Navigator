const axios = require("axios");
const {
  explainFilePrompt,
  explainStructurePrompt,
  answerQuestionPrompt,
  getMockExplanation,
  getMockAnswer,
} = require("../utils/aiPrompts");

const callGeminiAI = async (prompt, userApiKey = null) => {
  const API_KEY = userApiKey || process.env.AI_API_KEY;

  if (!API_KEY) {
    return { text: null, error: "no_key" };
  }

  const model = "gemini-2.0-flash";
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        { timeout: 30000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, error: null };
      }
    } catch (error) {
      const status = error.response?.status;
      const errMsg = error.response?.data?.error?.message || error.message;
      console.error(`AI Error [attempt ${attempt + 1}]: Status ${status} — ${errMsg}`);

      if (status === 429) {
        const retryMatch = errMsg.match(/retry in (\d+)/i);
        const waitSec = retryMatch ? Math.min(parseInt(retryMatch[1]), 10) : 5;

        if (attempt < maxRetries) {
          console.log(`AI: Rate limited, retrying in ${waitSec}s...`);
          await new Promise((r) => setTimeout(r, waitSec * 1000));
          continue;
        }
        return { text: null, error: "quota_exceeded" };
      }

      if (status === 400 || status === 403) {
        return { text: null, error: "invalid_key" };
      }

      return { text: null, error: "api_error" };
    }
  }

  return { text: null, error: "all_failed" };
};

const getAIStatusInfo = (error) => {
  switch (error) {
    case "no_key":
      return { isAI: false, aiStatus: "no_key", aiMessage: "No AI API key configured. Add your Gemini API key in Settings for AI-powered answers." };
    case "quota_exceeded":
      return { isAI: false, aiStatus: "quota_exceeded", aiMessage: "AI quota exceeded. Add your own Gemini API key in Settings to avoid shared limits." };
    case "invalid_key":
      return { isAI: false, aiStatus: "invalid_key", aiMessage: "AI API key is invalid or expired. Please update your key in Settings." };
    case "api_error":
    case "all_failed":
      return { isAI: false, aiStatus: "error", aiMessage: "AI service is temporarily unavailable. Please try again in a moment." };
    default:
      return { isAI: true, aiStatus: "ok", aiMessage: null };
  }
};

const explain = async (req, res) => {
  try {
    const { type, fileName, fileContent, repoName, treeStructure } = req.body;

    const userApiKey = req.headers["x-ai-api-key"] || null;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Please specify 'type' as 'file' or 'structure'",
      });
    }

    let explanation = "";
    let aiResult;

    if (type === "file") {
      if (!fileName || !fileContent) {
        return res.status(400).json({
          success: false,
          message: "Please provide fileName and fileContent",
        });
      }

      const prompt = explainFilePrompt(fileName, fileContent);
      aiResult = await callGeminiAI(prompt, userApiKey);
      explanation = aiResult.text || getMockExplanation(fileName);
    } else if (type === "structure") {
      if (!repoName || !treeStructure) {
        return res.status(400).json({
          success: false,
          message: "Please provide repoName and treeStructure",
        });
      }

      const prompt = explainStructurePrompt(repoName, treeStructure);
      aiResult = await callGeminiAI(prompt, userApiKey);
      explanation =
        aiResult.text ||
        `**${repoName}** is a software project. Check the file tree on the left to explore individual files and understand the codebase structure.`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'file' or 'structure'",
      });
    }

    const statusInfo = getAIStatusInfo(aiResult.error);

    res.status(200).json({
      success: true,
      data: {
        explanation,
        ...statusInfo,
      },
    });
  } catch (error) {
    console.error("Explain Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
    });
  }
};

const question = async (req, res) => {
  try {
    const { question: userQuestion, context } = req.body;

    const userApiKey = req.headers["x-ai-api-key"] || null;

    if (!userQuestion) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question",
      });
    }

    const contextStr = context || "No specific codebase context provided.";

    const prompt = answerQuestionPrompt(userQuestion, contextStr);
    const aiResult = await callGeminiAI(prompt, userApiKey);

    const answer = aiResult.text || getMockAnswer(userQuestion, contextStr);
    const statusInfo = getAIStatusInfo(aiResult.error);

    res.status(200).json({
      success: true,
      data: {
        answer,
        ...statusInfo,
      },
    });
  } catch (error) {
    console.error("Question Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to answer question",
    });
  }
};

module.exports = { explain, question };
