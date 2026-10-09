import { useState } from "react";
import { api } from "../api";

const groups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function RequestTab({ onChanged }) {
  const [form, setForm] = useState({ patientName:"", contactPhone:"", bloodGroup:"", location:"", unitsNeeded:1 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(""); setResult(null); setBusy(true);
    try { setResult(await api.createRequest(form)); setForm({ patientName:"", contactPhone:"", bloodGroup:"", location:"", unitsNeeded:1 }); onChanged(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="tab-stack">
      <section className="hero-copy">
        <div className="eyebrow">BLOOD REQUEST</div>
        <h1>Request blood</h1>
        <p>Hospitals or patients — enter details and we'll match compatible donors right away.</p>
      </section>

      <form className="panel form-panel" onSubmit={submit}>
        <label>Patient / hospital name<input required value={form.patientName} onChange={e=>setForm({...form,patientName:e.target.value})} placeholder="e.g. Civil Hospital, Rohan"/></label>
        <label>Contact phone<input required inputMode="numeric" maxLength="10" value={form.contactPhone} onChange={e=>setForm({...form,contactPhone:e.target.value.replace(/\D/g,"")})} placeholder="9876543210"/></label>
        <label>Blood group needed<select required value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}><option value="">Select blood group</option>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
        <label>Location<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Nashik Road"/></label>
        <label>Units needed<input required type="number" min="1" max="20" value={form.unitsNeeded} onChange={e=>setForm({...form,unitsNeeded:e.target.value})}/></label>
        <button className="primary-btn" disabled={busy}>{busy ? "Finding..." : "Find matching donors"}</button>
      </form>

      {error && <div className="error">{error}</div>}
      {result && (
        <section className="panel result-panel">
          <div className="result-header">
            <div><div className="eyebrow">REQUEST TOKEN</div><h2>{result.request.token}</h2></div>
            <span className={`status ${result.matches.length ? "available" : "offline"}`}>{result.matches.length ? "MATCHED" : "OPEN"}</span>
          </div>
          <p className="helper">{result.matches.length} compatible donor{result.matches.length === 1 ? "" : "s"} found. Location matches are prioritized.</p>
          {result.matches.map(d => (
            <div className="match-row" key={d.id}><b>{d.fullName}</b><span>{d.bloodGroup} · {d.location}</span><span>{d.locationScore > 0 ? "Nearby" : "Compatible"}</span></div>
          ))}
        </section>
      )}
    </div>
  );
}
