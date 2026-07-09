import { CreditCard, ShieldCheck, PiggyBank, TrendingUp } from "lucide-react";

export default function CrossSellCard({ customer }) {
  const opportunities = [];

  if (customer.cibil_score > 720) {
    opportunities.push({
      icon: <CreditCard size={20} />,
      title: "Premium Credit Card",
      reason: "Strong credit profile",
    });
  }

  if (customer.monthly_income > 60000) {
    opportunities.push({
      icon: <ShieldCheck size={20} />,
      title: "Insurance Plan",
      reason: "Good income stability",
    });
  }

  if (customer.avg_monthly_balance > 50000) {
    opportunities.push({
      icon: <PiggyBank size={20} />,
      title: "Fixed Deposit",
      reason: "Healthy account balance",
    });
  }

  if (customer.investment_amount > 20000) {
    opportunities.push({
      icon: <TrendingUp size={20} />,
      title: "Mutual Fund Advisory",
      reason: "Existing investment behavior",
    });
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">Cross-sell Opportunities</h2>

      {opportunities.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-slate-600">
          No strong cross-sell signals detected yet for this customer.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-4 flex gap-3">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
