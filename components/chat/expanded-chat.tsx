"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { Minimize2 } from "lucide-react"
import type { Message } from "@/components/chat/floating-chat"

interface ExpandedChatProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSendMessage: () => void
  handleSuggestedQuery: (query: string) => void
  suggestedQueries: string[]
  toggleExpand: () => void
  isTyping?: boolean
}

export function ExpandedChat({
  messages,
  input,
  handleInputChange,
  handleKeyDown,
  handleSendMessage,
  handleSuggestedQuery,
  suggestedQueries,
  toggleExpand,
  isTyping = false,
}: ExpandedChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isTyping])

  return (
    <main className="pt-16 p-4 sm:p-8">
      <div className="mb-6 sm:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-sm sm:text-md text-gray-600">Ask questions about your healthcare policies and data</p>
        </div>
        <button
          onClick={toggleExpand}
          className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Minimize chat"
        >
          <Minimize2 className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Messages area */}
        <div className="h-[calc(100vh-300px)] sm:h-[calc(95vh-400px)] overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {messages.length === 0 && !isTyping ? (
            <div className="flex h-full min-h-[250px] sm:min-h-[350px] items-center justify-center text-center text-sm text-slate-500">
              <div>
                <p>How can I help you today?</p>
                <p className="mt-1 text-xs">Ask me anything about your healthcare policies.</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`mb-4 sm:mb-6 ${index === 0 ? "mt-2" : ""} ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-2xl rounded-lg p-3 sm:p-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm sm:text-base">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-4 sm:mb-6 flex justify-start">
                  <div className="max-w-[90%] sm:max-w-2xl rounded-lg p-3 sm:p-4 bg-gray-200 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm sm:text-base">Nedl AI is writing</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input area */}
        <div className="p-4 sm:p-6 bg-white border-t border-gray-200">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type anything you want to ask our AI chat agent"
              className="w-full p-4 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none h-[80px] sm:h-[110px] text-sm sm:text-base"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="absolute bottom-4 right-4 bg-[#8B5CF6] text-white rounded-full p-2 sm:p-3 disabled:opacity-50 hover:bg-[#7C3AED] transition-colors"
              aria-label="Send message"
            >
              <Image src="/send-icon.svg" alt="Send" width={16} height={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Suggested queries */}
          {!isTyping && (
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 transition-colors"
                  disabled={isTyping}
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
