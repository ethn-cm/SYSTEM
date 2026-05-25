import './QuestDetail.css';

export default function QuestDetail({ quest, onBack }) {
  if (!quest) {
    return (
      <div className="quest-detail">
        <div className="quest-detail-empty">Select a quest</div>
      </div>
    );
  }

  return (
    <div className="quest-detail">
      <button className="quest-detail-back" onClick={onBack}>
        ← Back
      </button>

      <div className="quest-detail-header">
        <div className={`quest-detail-status ${quest.status}`}>
          {quest.status}
        </div>
        <h1 className="quest-detail-title">{quest.title}</h1>
        <div className="quest-detail-meta">
          <div className="quest-detail-meta-row">
            <span className="quest-detail-meta-label">Type</span>
            <span className="quest-detail-meta-value">{quest.type}</span>
          </div>
          <div className="quest-detail-meta-row">
            <span className="quest-detail-meta-label">Location</span>
            <span className="quest-detail-meta-value">{quest.location}</span>
          </div>
          <div className="quest-detail-meta-row">
            <span className="quest-detail-meta-label">Objective</span>
            <span className="quest-detail-meta-value">{quest.objective}</span>
          </div>
        </div>
      </div>

      <div className="quest-detail-section">
        <div className="quest-detail-section-title">Details</div>
        <p className="quest-detail-description">{quest.details}</p>
      </div>

      <div className="quest-detail-section">
        <div className="quest-detail-section-title">
          Tasks — {quest.tasks.filter(t => t.done).length}/{quest.tasks.length}
        </div>
        <div className="quest-detail-tasks">
          {quest.tasks.map((task, i) => (
            <div key={i} className="quest-detail-task">
              <div className={`quest-detail-task-check ${task.done ? 'done' : ''}`} />
              <span className={`quest-detail-task-label ${task.done ? 'done' : ''}`}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
