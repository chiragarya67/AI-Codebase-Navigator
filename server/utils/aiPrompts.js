const explainFilePrompt = (fileName, fileContent) => {
  return `You are a helpful coding assistant. Explain the following code file in simple terms that a beginner developer can understand.

File name: ${fileName}

Code:
\`\`\`
${fileContent}
\`\`\`

Please provide:
1. **Purpose**: What does this file do? (1-2 sentences)
2. **Key Parts**: Explain the main functions/sections briefly
3. **How it fits**: How might this file connect to the rest of the project?

Keep your explanation short, clear, and beginner-friendly.`;
};

const explainStructurePrompt = (repoName, treeStructure) => {
  return `You are a helpful coding assistant. Look at this project's file/folder structure and explain what kind of project this is and how it's organized.

Repository: ${repoName}

File structure:
${treeStructure}

Please provide:
1. **Project Type**: What kind of project is this? (e.g., React app, Node.js API, etc.)
2. **Key Folders**: What are the important folders and what do they contain?
3. **Tech Stack**: What technologies does this project likely use?

Keep your explanation short, clear, and beginner-friendly.`;
};

const answerQuestionPrompt = (question, context) => {
  return `You are an expert code assistant that analyzes GitHub repositories. You have been given detailed information about a repository including its file structure, languages, and optionally the content of a file the user is currently viewing.

Your job is to answer the user's question with SPECIFIC, ACCURATE details based on the context provided. Do NOT give generic advice — reference actual files, folders, and patterns you can see in the project structure.

=== CODEBASE CONTEXT ===
${context}

=== USER QUESTION ===
${question}

=== INSTRUCTIONS ===
1. Analyze the file structure to understand the project architecture
2. Identify frameworks, libraries, and patterns from file names and structure
3. Reference specific files and folders in your answer (e.g., "The \`src/components/\` folder contains...")
4. If a file is currently being viewed, use its content to give precise answers
5. If you can identify the tech stack (React, Express, Next.js, etc.), mention it
6. Keep the answer focused, well-structured, and developer-friendly
7. Use markdown formatting: **bold** for emphasis, \`code\` for file names, and bullet points for lists
8. If you truly cannot answer from the given context, say what specific information would help

Provide a thorough but concise answer:`;
};

const getMockExplanation = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  const explanations = {
    js: `**${fileName}** is a JavaScript file. It likely contains application logic, functions, or module exports. JavaScript files are the backbone of web applications, handling everything from UI interactions to server-side processing.`,
    jsx: `**${fileName}** is a React component file (JSX). It contains a mix of JavaScript and HTML-like syntax that React uses to build user interfaces. This component likely renders some part of the application's UI.`,
    ts: `**${fileName}** is a TypeScript file. TypeScript adds type safety to JavaScript, helping catch errors early. This file contains typed application logic.`,
    tsx: `**${fileName}** is a React component written in TypeScript (TSX). It combines React's component syntax with TypeScript's type safety.`,
    css: `**${fileName}** is a CSS stylesheet. It defines the visual appearance (colors, layouts, fonts, spacing) of HTML elements in the application.`,
    json: `**${fileName}** is a JSON configuration file. It stores structured data like project settings, dependencies, or configuration values.`,
    md: `**${fileName}** is a Markdown file. It typically contains documentation, README instructions, or notes about the project.`,
    html: `**${fileName}** is an HTML file. It defines the structure and content of a web page using HTML tags.`,
    py: `**${fileName}** is a Python file. It contains Python code for application logic, scripts, or server-side processing.`,
  };

  return explanations[ext] || `**${fileName}** is a project file. It contributes to the overall functionality of the application.`;
};

const getMockAnswer = (question, context) => {
  const lowerQ = question.toLowerCase();
  
  const nameMatch = context?.match(/Name:\s*(.+)/);
  const filesMatch = context?.match(/Total Files:\s*(\d+)/);
  const foldersMatch = context?.match(/Total Folders:\s*(\d+)/);
  const repoName = nameMatch ? nameMatch[1].trim() : "this repository";
  const totalFiles = filesMatch ? filesMatch[1] : "unknown number of";
  const totalFolders = foldersMatch ? foldersMatch[1] : "unknown number of";

  const langSection = context?.match(/=== LANGUAGES ===([\s\S]*?)(?:===|$)/);
  const languages = langSection ? langSection[1].trim() : "";

  const treeSection = context?.match(/=== FILE STRUCTURE ===([\s\S]*?)(?:===|$)/);
  const fileTree = treeSection ? treeSection[1].trim() : "";

  if (lowerQ.includes("architecture") || lowerQ.includes("structure") || lowerQ.includes("organized") || lowerQ.includes("overview")) {
    let answer = `**${repoName}** contains **${totalFiles} files** across **${totalFolders} folders**.\n\n`;
    if (languages) answer += `**Languages used:**\n${languages}\n\n`;
    if (fileTree) {
      const topFolders = fileTree.split("\n").filter(l => l.startsWith("📁")).slice(0, 8).map(l => l.trim()).join("\n");
      if (topFolders) answer += `**Top-level structure:**\n${topFolders}\n\n`;
    }
    answer += `Click on individual files in the file tree to see detailed AI explanations of each file.`;
    return answer;
  }

  if (lowerQ.includes("what does") || lowerQ.includes("what is") || lowerQ.includes("about") || lowerQ.includes("purpose")) {
    let answer = `**${repoName}** is a project with **${totalFiles} files**.\n\n`;
    if (languages) answer += `It primarily uses:\n${languages}\n\n`;
    answer += `To get a deeper understanding, try clicking on key files like \`README.md\`, \`package.json\`, or entry point files in the file tree.`;
    return answer;
  }

  let answer = `Here's what I can tell you about **${repoName}**:\n\n`;
  answer += `- **${totalFiles}** files across **${totalFolders}** folders\n`;
  if (languages) answer += `- **Languages:** ${languages.split("\n").map(l => l.split(":")[0]).filter(Boolean).join(", ")}\n`;
  answer += `\nFor a more detailed answer, try enabling the Gemini AI API key in your server's \`.env\` file, or click on specific files to explore the codebase.\n\n`;
  answer += `**Tip:** The more files you explore, the better context the AI assistant has to answer your questions!`;
  return answer;
};

module.exports = {
  explainFilePrompt,
  explainStructurePrompt,
  answerQuestionPrompt,
  getMockExplanation,
  getMockAnswer,
};
