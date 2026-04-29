import { useState } from 'react';
import { getScoreClass } from '../lib/helpers';
import { MONTHS, DAYS } from '../lib/constants';

export default function CalendarGrid({ emp, scoreMap }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState('all');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const cells = [];
  
  // Empty cells for first row
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = scoreMap[dateStr];
    const cellDate = new Date(year, month, d);
    const isFuture = cellDate > today;
    const isToday = cellDate.getTime() === today.getTime();

    let isVisible = true;
    if (filter === 'scored' && !entry) isVisible = false;
    if (filter === 'pos' && (!entry || entry.score <= 0)) isVisible = false;
    if (filter === 'neg' && (!entry || entry.score >= 0)) isVisible = false;

    if (!isVisible) {
      cells.push(<div key={`empty-d-${d}`} className="cal-day empty"></div>);
      continue;
    }

    let cls = `cal-day ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`;
    let scoreText = '';
    
    if (entry) {
      cls += ` has-score ${getScoreClass(entry.score)}`;
      scoreText = entry.score > 0 ? `+${entry.score}` : `${entry.score}`;
    }

    cells.push(
      <div key={d} className={cls} onClick={() => { /* Modal could go here */ }}>
        {entry && <div className="day-bg"></div>}
        <div className="day-num">{d}</div>
        {entry && <div className="day-score">{scoreText}</div>}
      </div>
    );
  }

  return (
    <div className="calendar-section">
      <div className="cal-controls">
        <div className="cal-month-nav">
          <button className="nav-btn" onClick={prevMonth}>←</button>
          <div className="cal-month-label">{MONTHS[month]} {year}</div>
          <button className="nav-btn" onClick={nextMonth}>→</button>
        </div>
        <div className="cal-filter">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL DAYS</button>
          <button className={`filter-btn ${filter === 'scored' ? 'active' : ''}`} onClick={() => setFilter('scored')}>SCORED</button>
          <button className={`filter-btn ${filter === 'pos' ? 'active' : ''}`} onClick={() => setFilter('pos')}>POSITIVE</button>
          <button className={`filter-btn ${filter === 'neg' ? 'active' : ''}`} onClick={() => setFilter('neg')}>NEGATIVE</button>
        </div>
      </div>

      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
        {cells}
      </div>
    </div>
  );
}
