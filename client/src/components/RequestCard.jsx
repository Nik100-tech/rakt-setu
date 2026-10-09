import { MapPin, Phone, Droplets } from "lucide-react";

export default function RequestCard({ request }) {
  return (
    <article className="registry-card request-card">
      <div className="blood-badge">{request.bloodGroup}</div>
      <div className="registry-main">
        <div className="card-heading">
          <div><strong>{request.patientName}</strong><span className="token">{request.token}</span></div>
          <span className={`status ${request.status === "MATCHED" ? "available" : "offline"}`}>{request.status}</span>
        </div>
        <div className="meta"><MapPin size={15}/>{request.location}</div>
        <div className="meta"><Phone size={15}/>{request.contactPhone}</div>
        <div className="meta"><Droplets size={15}/>{request.unitsNeeded} unit{request.unitsNeeded > 1 ? "s" : ""} needed</div>
      </div>
    </article>
  );
}
