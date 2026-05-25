import { QUEST_STATUS } from '../data/quests';
import './Header.css';

export default function Header({ quests }) {
  const active = quests.filter(q => q.status === QUEST_STATUS.ACTIVE).length;
  const completed = quests.filter(q => q.status === QUEST_STATUS.COMPLETED).length;
  const total = quests.length;

  return (
    <header className="header">
      <div className="header-title">System</div>
      <div className="header-stats">
        <div className="header-stat">
          Active <span>{active}</span>
        </div>
        <div className="header-stat">
          Done <span>{completed}</span>
        </div>
        <div className="header-stat">
          Total <span>{total}</span>
        </div>
      </div>
    </header>
  );
}
