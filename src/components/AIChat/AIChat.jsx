// import React from "react";
// import "./AIChat.css";

// const API_URL = import.meta.env.VITE_AI_API_URL || "http://127.0.0.1:8000";

// export default function AIChat() {
//   const [open, setOpen] = React.useState(false);
//   const [input, setInput] = React.useState("");
//   const [messages, setMessages] = React.useState([
//     {
//       role: "assistant",
//       content: "Hello! I'm SmartSurround AI. How can I help you?",
//     },
//   ]);
//   const [loading, setLoading] = React.useState(false);

//   const sendMessage = async () => {
//     const text = input.trim();

//     if (!text || loading) return;

//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: text,
//       },
//     ]);

//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: text,
//           conversation_id: null,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }

//       const data = await response.json();

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: data.answer || "I couldn't generate a response.",
//         },
//       ]);
//     } catch (error) {
//       console.error("SmartSurround AI error:", error);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "Sorry, I couldn't connect to the SmartSurround AI server.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {open && (
//         <div className="ai-chat-window">
//           <div className="ai-chat-header">
//             <div>
//               <strong>SmartSurround AI</strong>
//               <span>AI Assistant</span>
//             </div>

//             <button
//               className="ai-chat-close"
//               onClick={() => setOpen(false)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="ai-chat-messages">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`ai-message ${message.role}`}
//               >
//                 {message.content}
//               </div>
//             ))}

//             {loading && (
//               <div className="ai-message assistant">
//                 Thinking...
//               </div>
//             )}
//           </div>

//           <div className="ai-chat-input-area">
//             <input
//               type="text"
//               value={input}
//               placeholder="Ask SmartSurround AI..."
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   sendMessage();
//                 }
//               }}
//             />

//             <button
//               className="ai-send-button"
//               onClick={sendMessage}
//               disabled={loading}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}

//       <button
//         className="ai-chat-button"
//         onClick={() => setOpen((prev) => !prev)}
//         aria-label="Open SmartSurround AI"
//       >
//         🤖
//       </button>
//     </>
//   );
// }

import { useState } from "react";
import { Client } from "@gradio/client";
import "./AIChat.css";

const SPACE_ID = "ArmanXLangchain/smartsurround-chatbot";

let clientPromise = null;

async function getClient() {
  if (!clientPromise) {
    clientPromise = Client.connect(SPACE_ID);
  }

  const client = await clientPromise;
  console.log("HF API:", await client.view_api());
  return client;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm SmartSurround AI. How can I help you?Besi message korbi na keu limit sesh hoye jabe",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const message = text.trim();

    if (!message || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setText("");
    setLoading(true);

    try {
      const client = await getClient();

      const result = await client.predict("/chat", [message]);

      let answer = "";

      if (result?.data) {
        answer = result.data[0];
      }

      if (
        typeof answer === "object" &&
        answer !== null
      ) {
        answer =
          answer.content ||
          answer.text ||
          JSON.stringify(answer);
      }

      answer = String(answer || "").trim();

      if (!answer) {
        answer = "Sorry, I could not generate a response.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("Hugging Face AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to SmartSurround AI right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div>
              <strong>SmartSurround AI</strong>
              <span>AI Assistant</span>
            </div>

            <button
              className="ai-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${message.role}`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="ai-message assistant">
                Thinking...
              </div>
            )}
          </div>

          <div className="ai-chat-input-area">
            <input
              type="text"
              value={text}
              placeholder="Ask SmartSurround AI..."
              disabled={loading}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  send();
                }
              }}
            />

            <button
              onClick={send}
              disabled={loading || !text.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        className="ai-chat-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open SmartSurround AI"
      >
        🤖
      </button>
    </>
  );
}