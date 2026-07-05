import {
  Bell,
  CheckCircle,
  FileSpreadsheet,
  Bot,
  FileText,
} from "lucide-react";

const notifications = [
  {
    icon: <Bot size={18} />,
    title: "AI completed daily analysis",
    time: "2 mins ago",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: <FileSpreadsheet size={18} />,
    title: "Customer CSV uploaded successfully",
    time: "15 mins ago",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: <FileText size={18} />,
    title: "Customer PDF report generated",
    time: "1 hour ago",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: <CheckCircle size={18} />,
    title: "Prospect scoring completed",
    time: "Today",
    color: "bg-orange-50 text-orange-700",
  },
];

export default function NotificationPanel() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Bell className="text-blue-600" />
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0"
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              {item.icon}
            </div>

            <div className="flex-1">
              <p className="font-medium text-slate-900">
                {item.title}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
