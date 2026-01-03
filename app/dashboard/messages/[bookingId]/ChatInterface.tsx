"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Send, ArrowLeft, Calendar, MapPin, Loader2 } from "lucide-react";
import Container from "@/components/Container";

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface BookingDetails {
  id: string;
  propertyTitle: string;
  propertyImage: string | null;
  propertyLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  currency: string;
  guest: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  host: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  role: "guest" | "host";
}

interface ChatInterfaceProps {
  bookingId: string;
  booking: BookingDetails;
  currentUserId: string;
}

export default function ChatInterface({
  bookingId,
  booking,
  currentUserId,
}: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParty = booking.role === "guest" ? booking.host : booking.guest;

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/bookings/${bookingId}/messages`);

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();
      setMessages(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [bookingId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          content: newMessage.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/messages")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Messages</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>

              {/* Property Image */}
              {booking.propertyImage && (
                <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-200 mb-4">
                  <img
                    src={booking.propertyImage}
                    alt={booking.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Property Title */}
              <h3 className="font-semibold text-gray-900 mb-2">
                {booking.propertyTitle}
              </h3>

              {/* Location */}
              {booking.propertyLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin size={16} />
                  <span>{booking.propertyLocation}</span>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar size={16} />
                <span>
                  {format(new Date(booking.startDate), "MMM d")} -{" "}
                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "COMPLETED"
                      ? "bg-gray-100 text-gray-800"
                      : booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-xl font-semibold text-gray-900">
                  {booking.currency} {booking.totalPrice.toLocaleString()}
                </p>
              </div>

              {/* Other Party */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {booking.role === "guest" ? "Host" : "Guest"}
                </p>
                <div className="flex items-center gap-3">
                  {otherParty.image ? (
                    <img
                      src={otherParty.image}
                      alt={otherParty.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {(otherParty.name || otherParty.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {otherParty.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">{otherParty.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-200 rounded-lg flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversation with {otherParty.name || "Unknown"}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {format(new Date(message.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSending}
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
