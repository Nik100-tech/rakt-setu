import { useEffect, useState } from "react";
import { api } from "../api";
import StatCard from "../components/StatCard";
import DonorCard from "../components/DonorCard";
import RequestCard from "../components/RequestCard";
import ActivityFeed from "../components/ActivityFeed";

export default function AllTokensTab({ refreshKey }) {
  const [stats, setStats] = useState({totalDonors:0,availableNow:0,openRequests:0});
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activity, setActivity] = useState([]);
  const [view, setView] = useState("donors");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s,d,r,a] = await Promise.all([api.getStats(), api.getDonors(), api.getRequests(), api.getActivity()]);
      setStats(s); setDonors(d); setRequests(r); setActivity(a); setError("");
    } catch (e) { setError(e.message); }
  };

  useEffect(()=>{ load(); }, [refreshKey]);

  const status = async (token, value) => {
    await api.setDonorStatus(token, value);
    load();
  };

  return (
    <div className="tab-stack">
      <section className="hero-copy">
        <div className="eyebrow">LIVE REGISTRY</div>
        <h1>All tokens</h1>
        <p>A live view of registered donors, active requests, and recent registry activity.</p>
      </section>

      <div className="stats-grid">
        <StatCard label="Total donors" value={stats.totalDonors}/>
        <StatCard label="Available now" value={stats.availableNow}/>
        <StatCard label="Open requests" value={stats.openRequests}/>
      </div>

      <section className="panel registry-panel">
        <div className="section-title">
          <div className="segmented">
            <button className={view==="donors"?"active":""} onClick={()=>setView("donors")}>Donors</button>
            <button className={view==="requests"?"active":""} onClick={()=>setView("requests")}>Requests</button>
          </div>
          <span className="muted">{view==="donors" ? donors.length : requests.length} records</span>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="registry-list">
          {view==="donors"
            ? donors.map(d=><DonorCard key={d.id} donor={d} onStatus={status}/>)
            : requests.map(r=><RequestCard key={r.id} request={r}/>)
          }
          {((view==="donors" && !donors.length) || (view==="requests" && !requests.length)) && <div className="empty">No records yet.</div>}
        </div>
      </section>

      <ActivityFeed items={activity}/>
    </div>
  );
}
