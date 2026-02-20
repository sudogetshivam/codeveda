import { Languages } from "lucide-react"
import axiosInstance from "./axios.js"

// The backend handles the translation to JDoodle's expected format.
const LANGUAGE_VERSION = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" }
}

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute 
 * @return {Promise<{success:boolean,output?:string,error?:string}>}
 */


function getExtensionName(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java"
    }
    return extensions[language] || "txt"
}

export async function executeCode(language, code) {
    try {
        const languageconfig = LANGUAGE_VERSION[language]
        if (!languageconfig) {
            return {
                success: false,
                error: `Unsupported Language : ${language}`
            }
        }

        // Use axiosInstance which has baseURL configured (e.g., http://localhost:3000/api)
        // So we just need to hit "/execute" endpoint
        const response = await axiosInstance.post("/execute", {
            language: language,
            code: code
        });

        const data = response.data;

        // Backend response format: { success: true, output: "..." }
        return {
            success: true,
            output: data.output || "No output"
        }

    } catch (error) {
        // Axios error handling
        const message = error.response?.data?.error || error.message || "Failed to execute code";
        return {
            success: false,
            error: message
        }

    }

}