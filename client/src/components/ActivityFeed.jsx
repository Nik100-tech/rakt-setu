import { Clock3 } from "lucide-react";

export default function ActivityFeed({ items }) {
  return (
    <section className="panel activity-panel">
      <div className="section-title"><span>Activity feed</span><span className="muted">live registry events</span></div>
      {items.length === 0 ? <div className="empty">No activity yet.</div> : (
        <div className="activity-list">
          {items.map(item => (
            <div className="activity-item" key={item.id}>
              <div className="activity-dot" />
              <div className="activity-copy">
                <div>{item.message}</div>
                <small><Clock3 size={13}/> {new Date(item.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
