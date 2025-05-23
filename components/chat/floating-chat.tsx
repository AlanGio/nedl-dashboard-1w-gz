"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { X, Maximize2 } from "lucide-react"
import Image from "next/image"

export type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Update the component definition to accept all the necessary props
export function FloatingChat({
  isOpen = false,
  toggleChat,
  toggleExpand,
  messages = [],
  input = "",
  handleInputChange,
  handleKeyDown,
  handleSendMessage,
  handleSuggestedQuery,
  suggestedQueries = [],
  isTyping = false,
}: {
  isOpen?: boolean
  toggleChat?: () => void
  toggleExpand?: () => void
  messages?: Message[]
  input?: string
  handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSendMessage?: () => void
  handleSuggestedQuery?: (query: string) => void
  suggestedQueries?: string[]
  isTyping?: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isOpen, isTyping])

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-6 px-4">
          <div className="relative w-full max-w-5xl mx-auto flex flex-col">
            {/* Chat container with gradient border */}
            <div
              className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg"
              style={{
                background: "linear-gradient(to right, #449CFB, #E85DF9)",
                padding: "3px",
                height: "60vh",
                maxHeight: "600px",
                minHeight: "400px",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Inner white container */}
              <div className="absolute inset-0 rounded-lg bg-white m-[3px] flex flex-col overflow-hidden">
                {/* Close and expand buttons stacked vertically */}
                <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                  <button
                    onClick={toggleChat}
                    className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={toggleExpand}
                    className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
                    aria-label="Expand chat"
                  >
                    <Maximize2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 pt-12 pr-12 bg-gray-50">
                  {messages.length === 0 && !isTyping ? (
                    <div className="flex h-full min-h-[200px] items-center justify-center text-center text-sm text-slate-500">
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
                          className={`mb-4 ${index === 0 ? "mt-2" : ""} ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-3/4 rounded-lg p-3 ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            <p className="text-sm sm:text-base">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
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
                        <div className="mb-4 flex justify-start">
                          <div className="max-w-[85%] sm:max-w-3/4 rounded-lg p-3 bg-gray-200 text-gray-800">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">Nedl AI is writing</span>
                              <div className="flex space-x-1">
                                <div
                                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
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
                <div className="p-4 bg-white border-t border-gray-200">
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
                          onClick={() => handleSuggestedQuery && handleSuggestedQuery(query)}
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
            </div>
          </div>
        </div>
      )}
    </>
  )
}
