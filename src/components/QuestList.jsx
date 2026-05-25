import { QUEST_STATUS } from '../data/quests';
import './QuestList.css';

export default function QuestList({ quests, selectedId, onSelect }) {
  const active = quests.filter(q => q.status === QUEST_STATUS.ACTIVE);
  const completed = quests.filter(q => q.status === QUEST_STATUS.COMPLETED);
  const failed = quests.filter(q => q.status === QUEST_STATUS.FAILED);

  const sections = [
    { label: 'Active', items: active },
    { label: 'Completed', items: completed },
    { label: 'Failed', items: failed },
  ].filter(s => s.items.length > 0);

  return (
    <nav className="quest-list">
      {sections.map(section => (
        <div key={section.label} className="quest-list-section">
          <div className="quest-list-section-header">
            {section.label}
            <span className="quest-list-section-count">{section.items.length}</span>
          </div>
          <div className="quest-list-items">
            {section.items.map(quest => (
              <button
                key={quest.id}
                className={`quest-list-item ${quest.status} ${selectedId === quest.id ? 'selected' : ''}`}
                onClick={() => onSelect(quest.id)}
              >
                <div className={`quest-list-item-indicator ${quest.status}`} />
                <span className="quest-list-item-title">{quest.title}</span>
                <span className="quest-list-item-type">{quest.type}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
