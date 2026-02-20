
import { ENV } from "../lib/env.js";

const JDOODLE_API = "https://api.jdoodle.com/v1/execute";

export const executeCode = async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, error: "Language and code are required" });
  }

  const languageMap = {
    javascript: { language: "nodejs", versionIndex: "4" }, // Node.js 18.15.0
    python: { language: "python3", versionIndex: "4" },    // Python 3.9.9
    java: { language: "java", versionIndex: "4" }          // JDK 17.0.1
  };

  const config = languageMap[language];

  if (!config) {
    return res.status(400).json({ success: false, error: "Unsupported language" });
  }

  try {
    const response = await fetch(JDOODLE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: ENV.JDOODLE_CLIENT_ID,
        clientSecret: ENV.JDOODLE_CLIENT_SECRET,
        script: code,
        language: config.language,
        versionIndex: config.versionIndex,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ success: false, error: `JDoodle API Error: ${errorText}` });
    }

    const data = await response.json();

    // Mapping JDoodle response to match Piston's format somewhat or just a standard format
    // JDoodle returns: { output: "...", statusCode: 200, memory: "...", cpuTime: "..." }
    
    // Check if the output contains query-time error or runtime error
    // JDoodle usually accepts 200 even for runtime errors, output contains the error trace.
    
    return res.status(200).json({
      success: true,
      output: data.output,
      // You can add more fields if needed
    });

  } catch (error) {
    console.error("Execution Code Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
