import { Download, MapPin, Phone, Droplets } from "lucide-react";
import { api } from "../api";

export default function DonorCard({ donor, onStatus }) {
  return (
    <article className="registry-card">
      <div className="blood-badge">{donor.bloodGroup}</div>
      <div className="registry-main">
        <div className="card-heading">
          <div><strong>{donor.fullName}</strong><span className="token">{donor.token}</span></div>
          <span className={`status ${donor.status === "AVAILABLE" ? "available" : "offline"}`}>
            {donor.status === "AVAILABLE" ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="meta"><MapPin size={15}/>{donor.location}</div>
        <div className="meta"><Phone size={15}/>{donor.phone}</div>
        <div className="card-actions">
          <button className="ghost" onClick={() => onStatus(donor.token, donor.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE")}>
            {donor.status === "AVAILABLE" ? "Mark unavailable" : "Make available"}
          </button>
          <a className="ghost link-btn" href={api.idCardUrl(donor.token)} download>
            <Download size={15}/> ID card
          </a>
        </div>
      </div>
    </article>
  );
}
