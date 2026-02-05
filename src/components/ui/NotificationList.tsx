import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Info } from "lucide-react";
import { useNotifications, type Notification } from "../../context/NotificationContext";

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-400" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-400" />;
  }
}

function getTypeStyles(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "border-green-500/30 bg-green-500/10";
    case "error":
      return "border-red-500/30 bg-red-500/10";
    case "info":
      return "border-blue-500/30 bg-blue-500/10";
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function NotificationList() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.05
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              x: 100,
              transition: { duration: 0.2 }
            }}
            className={`relative overflow-hidden rounded-xl border backdrop-blur-md shadow-lg ${getTypeStyles(notification.type)}`}
          >
            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
                notification.type === "success" ? "bg-green-500" :
                notification.type === "error" ? "bg-red-500" : "bg-blue-500"
              }`}
            />

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-zinc-500 flex-shrink-0">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
