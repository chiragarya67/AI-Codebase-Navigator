
const axios = require("axios");


const parseGitHubUrl = (url) => {
  try {
  
    const cleanUrl = url.replace(/\/+$/, "").replace(/\.git$/, "");

    // Extract owner and repo from the URL
    // Example: https://github.com/facebook/react → owner: facebook, repo: react
    const parts = cleanUrl.split("/");
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    if (!owner || !repo) {
      return null;
    }

    return { owner, repo };
  } catch (error) {
    return null;
  }
};


const buildFileTree = (items) => {
  const tree = [];

  items.forEach((item) => {
    // Split the path into parts (e.g., "src/components/App.js" → ["src", "components", "App.js"])
    const parts = item.path.split("/");

    let currentLevel = tree;

    parts.forEach((part, index) => {
      // Check if this part already exists at the current level
      const existing = currentLevel.find((node) => node.name === part);

      if (existing) {
        // If it exists and is a folder, go deeper
        currentLevel = existing.children || [];
      } else {
        // Create a new node
        const isLastPart = index === parts.length - 1;
        const newNode = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: isLastPart ? item.type : "tree", // "tree" = folder, "blob" = file
        };

        // If it's a folder, add a children array
        if (newNode.type === "tree") {
          newNode.children = [];
        }

        // If it's a file, add the size and download URL
        if (newNode.type === "blob") {
          newNode.size = item.size;
          newNode.url = item.url; // GitHub API URL to fetch file content
        }

        currentLevel.push(newNode);

        // If it's a folder, move into its children for the next iteration
        if (newNode.type === "tree") {
          currentLevel = newNode.children;
        }
      }
    });
  });

  return tree;
};

// ========================
// Analyze Repo Controller
// ========================
// POST /api/repo/analyze
// Accepts a GitHub repo URL and returns the file/folder structure
const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    // Step 1: Validate the URL
    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide a GitHub repository URL",
      });
    }

    // Step 2: Parse the URL to get owner and repo name
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL. Use format: https://github.com/owner/repo",
      });
    }

    const { owner, repo } = parsed;

    // Step 3: Fetch the repo tree from GitHub API
    // We use the "recursive" option to get ALL files, not just the top level
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // First, get the default branch
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    const defaultBranch = repoResponse.data.default_branch;

    // Then, get the full file tree
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    // Step 4: Build a clean file tree from the response
    const fileTree = buildFileTree(treeResponse.data.tree);

    // Step 5: Send back the result
    res.status(200).json({
      success: true,
      data: {
        repoName: repo,
        owner: owner,
        branch: defaultBranch,
        totalFiles: treeResponse.data.tree.filter((i) => i.type === "blob").length,
        totalFolders: treeResponse.data.tree.filter((i) => i.type === "tree").length,
        tree: fileTree,
      },
    });
  } catch (error) {
    console.error("Repo Analysis Error:", error.message);

    // Handle specific GitHub API errors
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Repository not found. Make sure the URL is correct and the repo is public.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to analyze repository",
    });
  }
};

// ========================
// Get File Content Controller
// ========================
// POST /api/repo/file-content
// Fetches the content of a specific file from the repo
const getFileContent = async (req, res) => {
  try {
    const { owner, repo, path } = req.body;

    // Validate inputs
    if (!owner || !repo || !path) {
      return res.status(400).json({
        success: false,
        message: "Please provide owner, repo, and file path",
      });
    }

    // Fetch file content from GitHub API
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    // GitHub returns file content as base64 encoded
    // We decode it to get the actual text
    const content = Buffer.from(response.data.content, "base64").toString("utf-8");

    res.status(200).json({
      success: true,
      data: {
        fileName: response.data.name,
        path: response.data.path,
        size: response.data.size,
        content: content,
      },
    });
  } catch (error) {
    console.error("File Content Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch file content",
    });
  }
};

module.exports = { analyzeRepo, getFileContent };
