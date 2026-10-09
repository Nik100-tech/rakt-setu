import { useState } from "react";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import DonorTab from "./tabs/DonorTab";
import RequestTab from "./tabs/RequestTab";
import AllTokensTab from "./tabs/AllTokensTab";

export default function App() {
  const [tab, setTab] = useState("donor");
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><HeartHandshake size={23}/></div>
          <div>
            <div className="brand-name">Rakt Setu</div>
            <div className="brand-sub">blood bridge · donor-request registry</div>
          </div>
        </div>
        <div className="secure"><ShieldCheck size={16}/> local registry</div>
      </header>

      <nav className="tabs" aria-label="Main navigation">
        <button className={tab==="donor"?"active":""} onClick={()=>setTab("donor")}>Donor</button>
        <button className={tab==="request"?"active":""} onClick={()=>setTab("request")}>Request Blood</button>
        <button className={tab==="all"?"active":""} onClick={()=>setTab("all")}>All Tokens</button>
      </nav>

      <main className="content">
        {tab==="donor" && <DonorTab onChanged={refresh}/>}
        {tab==="request" && <RequestTab onChanged={refresh}/>}
        {tab==="all" && <AllTokensTab refreshKey={refreshKey}/>}
      </main>

      <footer>Rakt Setu · a local blood donor-request registry</footer>
    </div>
  );
}
