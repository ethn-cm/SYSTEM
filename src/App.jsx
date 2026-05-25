import { useState } from 'react';
import { quests } from './data/quests';
import Header from './components/Header';
import QuestList from './components/QuestList';
import QuestDetail from './components/QuestDetail';
import './App.css';

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedQuest = quests.find(q => q.id === selectedId) || null;
  const showDetail = selectedId !== null;

  return (
    <div className="app">
      <Header quests={quests} />
      <div className="app-body">
        <div className="grid">
          <div className={`app-panel-list ${showDetail ? 'hidden' : ''}`}>
            <QuestList
              quests={quests}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className={`app-panel-detail ${!showDetail ? 'hidden' : ''}`}>
            <QuestDetail
              quest={selectedQuest}
              onBack={() => setSelectedId(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
