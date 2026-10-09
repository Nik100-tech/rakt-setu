import { Download, Search, UserRound, MapPin, Phone, CalendarDays, Droplets } from "lucide-react";
import { api } from "../api";

export default function TokenDetails({ data, onClose }) {
  if (!data) return null;
  const { donor, matches = [] } = data;
  return (
    <div className="panel token-details">
      <div className="details-head">
        <div>
          <div className="eyebrow">DONOR TOKEN</div>
          <h2>{donor.token}</h2>
        </div>
        <button className="icon-btn" onClick={onClose}>×</button>
      </div>
      <div className="detail-grid">
        <div><UserRound size={17}/><span><small>NAME</small><b>{donor.fullName}</b></span></div>
        <div><Droplets size={17}/><span><small>BLOOD GROUP</small><b className="red-text">{donor.bloodGroup}</b></span></div>
        <div><MapPin size={17}/><span><small>LOCATION</small><b>{donor.location}</b></span></div>
        <div><Phone size={17}/><span><small>PHONE</small><b>{donor.phone}</b></span></div>
        <div><CalendarDays size={17}/><span><small>REGISTERED</small><b>{new Date(donor.createdAt).toLocaleDateString()}</b></span></div>
        <div><Droplets size={17}/><span><small>DONATIONS</small><b>{donor.donationCount}</b></span></div>
      </div>
      <div className="detail-actions">
        <a className="primary-btn" href={api.idCardUrl(donor.token)} download><Download size={17}/> Download ID card</a>
      </div>
      <div className="match-box">
        <div className="section-title"><span>Matched requests</span><span className="muted">{matches.length}</span></div>
        {matches.length ? matches.map(m => (
          <div className="match-row" key={m.id}><b>{m.request.token}</b><span>{m.request.bloodGroup} · {m.request.location}</span><span>{m.status}</span></div>
        )) : <div className="empty">No matched requests yet.</div>}
      </div>
    </div>
  );
}
