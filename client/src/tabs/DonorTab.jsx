import { useState } from "react";
import { api } from "../api";
import TokenDetails from "../components/TokenDetails";

const groups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function DonorTab({ onChanged }) {
  const [form, setForm] = useState({ fullName:"", phone:"", bloodGroup:"", location:"" });
  const [lookup, setLookup] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      const r = await api.createDonor(form);
      setMessage(`Registered successfully. Your donor token is ${r.donor.token}. Save it.`);
      setForm({ fullName:"", phone:"", bloodGroup:"", location:"" });
      setLookup(r.donor.token);
      setData(await api.getDonor(r.donor.token));
      onChanged();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const find = async e => {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try { setData(await api.getDonor(lookup.trim())); }
    catch (e) { setData(null); setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="tab-stack">
      <section className="hero-copy">
        <div className="eyebrow">DONOR REGISTRY</div>
        <h1>Register as a donor</h1>
        <p>You'll get a token — save it, it's how you check your matches later.</p>
      </section>

      <form className="panel form-panel" onSubmit={submit}>
        <label>Full name<input required value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} placeholder="e.g. Asha Patil"/></label>
        <label>Phone<input required inputMode="numeric" maxLength="10" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,"")})} placeholder="9876543210"/></label>
        <label>Blood group<select required value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}><option value="">Select blood group</option>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
        <label>Location<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Nashik Road"/></label>
        <button className="primary-btn" disabled={busy}>{busy ? "Saving..." : "Get my token"}</button>
      </form>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <section className="panel lookup-panel">
        <div className="section-title"><span>Look up my token</span><span className="muted">Donor history & matches</span></div>
        <p className="helper">Enter your token to see matched requests, your status, and history.</p>
        <form className="lookup-row" onSubmit={find}>
          <input value={lookup} onChange={e=>setLookup(e.target.value.toUpperCase())} placeholder="e.g. BD1001"/>
          <button className="primary-btn"><span>Look up</span></button>
        </form>
      </section>

      <TokenDetails data={data} onClose={()=>setData(null)} />
    </div>
  );
}
