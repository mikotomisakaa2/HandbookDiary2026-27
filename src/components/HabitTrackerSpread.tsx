import React, { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { HighlightStroke, MonthData, PageItem } from '../types/diary';
import { LinedMonthPage } from './LinedMonthPage';
import { PageCanvasOverlay } from './PageCanvasOverlay';
import { HighlighterLayer } from './HighlighterLayer';

interface HabitTrackerSpreadProps {
  monthData: MonthData;
  monthName: string;
  year: number;
  daysInMonth: number;
  accentColor: string;
  page3Id: string;
  page4Id: string;
  page3Items: PageItem[];
  page4Items: PageItem[];
  page3Highlights: HighlightStroke[];
  page4Highlights: HighlightStroke[];
  isHighlightMode: boolean;
  highlighterColor: string;
  onAddHighlight: (pageId: string, stroke: HighlightStroke) => void;
  onUpdateMonth: (patch: Partial<MonthData>) => void;
  onUpdateItem: (pageId: string, item: PageItem) => void;
  onDeleteItem: (pageId: string, itemId: string) => void;
  onSelectPageForAdd: (pageId: string) => void;
  selectedPageForAdd: string;
}

export const HabitTrackerSpread: React.FC<HabitTrackerSpreadProps> = ({
  monthData,
  monthName,
  year,
  daysInMonth,
  accentColor,
  page3Id,
  page4Id,
  page3Items,
  page4Items,
  page3Highlights,
  page4Highlights,
  isHighlightMode,
  highlighterColor,
  onAddHighlight,
  onUpdateMonth,
  onUpdateItem,
  onDeleteItem,
  onSelectPageForAdd,
  selectedPageForAdd,
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newScheduleNote, setNewScheduleNote] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const totalHabits = Math.max(1, monthData.habits.length);
  const startDay = Math.max(1, Math.min(daysInMonth, monthData.startDay || 1));
  const graphStyle = monthData.graphStyle || 'columns';

  // Daily stats: days before startDay are 0 (flat baseline)
  const dailyStats = useMemo(() => {
    return days.map((day) => {
      if (day < startDay) {
        return { day, count: 0, ratio: 0, beforeStart: true };
      }
      let count = 0;
      for (const h of monthData.habits) {
        if (monthData.checks[`${day}-${h.id}`]) count += 1;
      }
      return {
        day,
        count,
        ratio: count / totalHabits,
        beforeStart: false,
      };
    });
  }, [days, startDay, monthData.habits, monthData.checks, totalHabits]);

  // Weekly stats (W1..W5)
  const weeklyStats = useMemo(() => {
    const weeks: {
      weekIndex: number;
      start: number;
      end: number;
      avgRatio: number;
      totalChecks: number;
      beforeStart: boolean;
    }[] = [];

    for (let w = 0; w < 5; w++) {
      const wStart = w * 7 + 1;
      if (wStart > daysInMonth) break;
      const wEnd = Math.min(daysInMonth, wStart + 6);
      const slice = dailyStats.slice(wStart - 1, wEnd);
      const activeDays = slice.filter((d) => !d.beforeStart);
      if (activeDays.length === 0) {
        weeks.push({
          weekIndex: w + 1,
          start: wStart,
          end: wEnd,
          avgRatio: 0,
          totalChecks: 0,
          beforeStart: true,
        });
      } else {
        const sumRatio = activeDays.reduce((acc, d) => acc + d.ratio, 0);
        const totalChecks = activeDays.reduce((acc, d) => acc + d.count, 0);
        weeks.push({
          weekIndex: w + 1,
          start: wStart,
          end: wEnd,
          avgRatio: sumRatio / activeDays.length,
          totalChecks,
          beforeStart: false,
        });
      }
    }
    return weeks;
  }, [dailyStats, daysInMonth]);

  const toggleCheck = (day: number, habitId: string) => {
    const key = `${day}-${habitId}`;
    const nextChecks = { ...monthData.checks, [key]: !monthData.checks[key] };
    onUpdateMonth({ checks: nextChecks });
  };

  const handleAddHabit = () => {
    const trimmed = newHabitName.trim();
    if (!trimmed || monthData.habits.length >= 10) return;
    onUpdateMonth({
      habits: [
        ...monthData.habits,
        {
          id: `h-${Date.now()}`,
          name: trimmed,
          scheduleNote: newScheduleNote.trim() || 'Daily',
        },
      ],
    });
    setNewHabitName('');
    setNewScheduleNote('');
    setShowAddHabit(false);
  };

  const handleSetColumnCount = (targetCount: number) => {
    const clamped = Math.max(1, Math.min(10, targetCount));
    const current = monthData.habits;
    if (clamped === current.length) return;
    if (clamped < current.length) {
      onUpdateMonth({ habits: current.slice(0, clamped) });
    } else {
      const extra = Array.from({ length: clamped - current.length }, (_, i) => ({
        id: `h-${Date.now()}-${i}`,
        name: `Plan ${current.length + i + 1}`,
        scheduleNote: 'Time / Note',
      }));
      onUpdateMonth({ habits: [...current, ...extra] });
    }
  };

  const handleRenameHabit = (id: string, name: string) => {
    onUpdateMonth({
      habits: monthData.habits.map((h) => (h.id === id ? { ...h, name } : h)),
    });
  };

  const handleChangeScheduleNote = (id: string, scheduleNote: string) => {
    onUpdateMonth({
      habits: monthData.habits.map((h) =>
        h.id === id ? { ...h, scheduleNote } : h
      ),
    });
  };

  const handleRemoveHabit = (id: string) => {
    if (monthData.habits.length <= 1) return;
    onUpdateMonth({
      habits: monthData.habits.filter((h) => h.id !== id),
    });
  };

  // SVG coordinates for vertical graph aligned with the date rows
  const graphWidth = 152;
  const rowHeight = 20;
  const topPad = 14;
  const svgHeight = topPad + daysInMonth * rowHeight + 12;
  const xMin = 24;
  const xMax = graphWidth - 12;

  const dayPoints = dailyStats.map((d, idx) => {
    const y = topPad + idx * rowHeight + rowHeight / 2;
    const x = xMin + d.ratio * (xMax - xMin);
    return { ...d, x, y };
  });

  const dayPolyline = dayPoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const weekPoints = weeklyStats.map((w) => {
    const midRow = (w.start + w.end) / 2 - 1;
    const y = topPad + midRow * rowHeight + rowHeight / 2;
    const x = xMin + w.avgRatio * (xMax - xMin);
    return { ...w, x, y };
  });

  const weekPolyline = weekPoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const totalMonthChecks = dailyStats.reduce((s, d) => s + d.count, 0);

  return (
    <>
      {/* PAGE 3 (LEFT): Month header + Motto + Subtitle + Numbered lines 1..daysInMonth */}
      <LinedMonthPage
        pageId={page3Id}
        side="left"
        pageNumberLabel="Page 3 · Daily Learning Log"
        monthName={monthName}
        year={year}
        daysInMonth={daysInMonth}
        headerTitle={monthData.motto}
        subtitle={monthData.subtitle}
        editableHeader
        onChangeMotto={(val) => onUpdateMonth({ motto: val })}
        onChangeSubtitle={(val) => onUpdateMonth({ subtitle: val })}
        lines={monthData.page3Lines}
        onChangeLine={(day, value) =>
          onUpdateMonth({
            page3Lines: { ...monthData.page3Lines, [day]: value },
          })
        }
        items={page3Items}
        highlights={page3Highlights}
        isHighlightMode={isHighlightMode}
        highlighterColor={highlighterColor}
        onAddHighlight={onAddHighlight}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
        onSelectPageForAdd={onSelectPageForAdd}
        isSelectedForAdd={selectedPageForAdd === page3Id}
      />

      {/* PAGE 4 (RIGHT): Graph of Successful Days (Columns or X-Line) + Schedule Table (1 extra write row + date rows) */}
      <div
        className={`diary-page diary-page-right habit-tracker-page ${
          selectedPageForAdd === page4Id ? 'page-active-target' : ''
        }`}
        onClick={() => onSelectPageForAdd(page4Id)}
      >
        <div className="habit-page-topbar" onClick={(e) => e.stopPropagation()}>
          <div className="habit-toggle-group">
            <button
              type="button"
              className={monthData.graphMode === 'day' ? 'active' : ''}
              onClick={() => onUpdateMonth({ graphMode: 'day' })}
            >
              Per Day
            </button>
            <button
              type="button"
              className={monthData.graphMode === 'week' ? 'active' : ''}
              onClick={() => onUpdateMonth({ graphMode: 'week' })}
            >
              Per Week
            </button>
          </div>

          <div className="habit-toggle-group">
            <button
              type="button"
              className={graphStyle === 'columns' ? 'active' : ''}
              onClick={() => onUpdateMonth({ graphStyle: 'columns' })}
            >
              Columns
            </button>
            <button
              type="button"
              className={graphStyle === 'x-line' ? 'active' : ''}
              onClick={() => onUpdateMonth({ graphStyle: 'x-line' })}
            >
              × Line
            </button>
          </div>

          <label className="start-day-control">
            <span>Start:</span>
            <select
              value={startDay}
              onChange={(e) =>
                onUpdateMonth({ startDay: Number(e.target.value) })
              }
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d} {monthName.slice(0, 3)}
                </option>
              ))}
            </select>
          </label>

          <label className="start-day-control" title="Number of schedule columns">
            <span>Cols:</span>
            <select
              value={monthData.habits.length}
              onChange={(e) => handleSetColumnCount(Number(e.target.value))}
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <span className="checks-total-pill">{totalMonthChecks} ×</span>
        </div>

        {/* Exact 2-column layout from sketch */}
        <div className="habit-sketch-split">
          {/* LEFT PANEL: Graph of successful Days I worked */}
          <div className="habit-graph-panel">
            <div className="graph-panel-title">
              Graph of successful Days I worked
            </div>
            <div className="graph-scale-legend">
              <span>0</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            <div className="graph-svg-wrap">
              <svg
                viewBox={`0 0 ${graphWidth} ${svgHeight}`}
                className="habit-graph-svg"
                preserveAspectRatio="none"
              >
                {/* Guide lines */}
                <line
                  x1={xMin}
                  y1={topPad}
                  x2={xMin}
                  y2={svgHeight - 10}
                  stroke="rgba(78, 56, 38, 0.35)"
                  strokeWidth="1.2"
                />
                <line
                  x1={(xMin + xMax) / 2}
                  y1={topPad}
                  x2={(xMin + xMax) / 2}
                  y2={svgHeight - 10}
                  stroke="rgba(78, 56, 38, 0.16)"
                  strokeDasharray="3 3"
                />
                <line
                  x1={xMax}
                  y1={topPad}
                  x2={xMax}
                  y2={svgHeight - 10}
                  stroke="rgba(78, 56, 38, 0.16)"
                  strokeDasharray="3 3"
                />

                {/* Horizontal date faint lines + date ticks */}
                {dayPoints.map((p) => (
                  <g key={`tick-${p.day}`}>
                    <line
                      x1={xMin}
                      y1={p.y}
                      x2={xMax}
                      y2={p.y}
                      stroke="rgba(78, 56, 38, 0.08)"
                      strokeWidth="1"
                    />
                    {(p.day === 1 ||
                      p.day === startDay ||
                      p.day % 5 === 0 ||
                      p.day === daysInMonth) && (
                      <text
                        x={xMin - 5}
                        y={p.y + 3.5}
                        textAnchor="end"
                        className="graph-axis-text"
                      >
                        {p.day}
                      </text>
                    )}
                  </g>
                ))}

                {/* Start-date marker line */}
                {startDay > 1 && (
                  <line
                    x1={xMin - 2}
                    y1={topPad + (startDay - 1) * rowHeight}
                    x2={xMax}
                    y2={topPad + (startDay - 1) * rowHeight}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    opacity="0.65"
                  />
                )}

                {monthData.graphMode === 'day' ? (
                  <>
                    {/* Column/Bar Graph bars + handwritten × tips */}
                    {graphStyle === 'columns' &&
                      dayPoints.map((p) =>
                        !p.beforeStart && p.count > 0 ? (
                          <g key={`bar-${p.day}`}>
                            <rect
                              x={xMin + 1}
                              y={p.y - 6}
                              width={Math.max(4, p.x - xMin)}
                              height={12}
                              rx={2.5}
                              fill={accentColor}
                              opacity={0.72}
                            />
                            <text
                              x={Math.min(xMax - 2, p.x + 5)}
                              y={p.y + 3.5}
                              className="graph-week-label"
                            >
                              ×
                            </text>
                          </g>
                        ) : null
                      )}

                    {/* Hand-drawn X-Line Graph */}
                    {graphStyle === 'x-line' && (
                      <>
                        <polyline
                          points={dayPolyline}
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {dayPoints.map((p) =>
                          p.beforeStart ? (
                            <circle
                              key={`pt-${p.day}`}
                              cx={p.x}
                              cy={p.y}
                              r="1.7"
                              fill="rgba(90, 68, 48, 0.35)"
                            />
                          ) : (
                            <g
                              key={`pt-${p.day}`}
                              transform={`translate(${p.x}, ${p.y})`}
                            >
                              <line
                                x1="-3.5"
                                y1="-3.5"
                                x2="3.5"
                                y2="3.5"
                                stroke={
                                  p.count > 0
                                    ? accentColor
                                    : 'rgba(90, 68, 48, 0.45)'
                                }
                                strokeWidth="1.9"
                                strokeLinecap="round"
                              />
                              <line
                                x1="3.5"
                                y1="-3.5"
                                x2="-3.5"
                                y2="3.5"
                                stroke={
                                  p.count > 0
                                    ? accentColor
                                    : 'rgba(90, 68, 48, 0.45)'
                                }
                                strokeWidth="1.9"
                                strokeLinecap="round"
                              />
                            </g>
                          )
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Per Week: Columns or X-Line */}
                    {graphStyle === 'columns' ? (
                      weekPoints.map((w) => (
                        <g key={`wkbar-${w.weekIndex}`}>
                          <rect
                            x={xMin + 1}
                            y={w.y - 12}
                            width={Math.max(w.beforeStart ? 0 : 4, w.x - xMin)}
                            height={24}
                            rx={3}
                            fill={accentColor}
                            opacity={0.78}
                          />
                          <text
                            x={Math.min(xMax - 14, w.x + 6)}
                            y={w.y + 4}
                            className="graph-week-label"
                          >
                            W{w.weekIndex}
                          </text>
                        </g>
                      ))
                    ) : (
                      <>
                        <polyline
                          points={weekPolyline}
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {weekPoints.map((w) => (
                          <g key={`wk-${w.weekIndex}`}>
                            <g transform={`translate(${w.x}, ${w.y})`}>
                              <line
                                x1="-4.5"
                                y1="-4.5"
                                x2="4.5"
                                y2="4.5"
                                stroke={accentColor}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                              />
                              <line
                                x1="4.5"
                                y1="-4.5"
                                x2="-4.5"
                                y2="4.5"
                                stroke={accentColor}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                              />
                            </g>
                            <text
                              x={Math.min(xMax - 2, w.x + 8)}
                              y={w.y + 4}
                              className="graph-week-label"
                            >
                              W{w.weekIndex}
                            </text>
                          </g>
                        ))}
                      </>
                    )}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* RIGHT PANEL: Schedule Table — Header + 1 Extra Schedule Write Row + Date Rows 1..daysInMonth */}
          <div className="habit-grid-panel" onClick={(e) => e.stopPropagation()}>
            <div className="habit-grid-header-row">
              <div className="habit-date-corner">
                <span>Plan</span>
                {monthData.habits.length < 10 && (
                  <button
                    type="button"
                    className="add-habit-mini-btn"
                    title="Add schedule column"
                    onClick={() => setShowAddHabit((v) => !v)}
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {monthData.habits.map((h) => (
                <div key={h.id} className="habit-col-header">
                  <input
                    type="text"
                    className="habit-col-title-input"
                    value={h.name}
                    onChange={(e) => handleRenameHabit(h.id, e.target.value)}
                    title={h.name}
                  />
                  {monthData.habits.length > 1 && (
                    <button
                      type="button"
                      className="habit-col-del"
                      title="Remove column"
                      onClick={() => handleRemoveHabit(h.id)}
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Extra top row for schedule write (time / routine note per column) */}
            <div className="habit-schedule-write-row">
              <div className="habit-schedule-label">Sched</div>
              {monthData.habits.map((h) => (
                <input
                  key={`sched-${h.id}`}
                  type="text"
                  className="habit-schedule-cell-input"
                  value={h.scheduleNote || ''}
                  onChange={(e) =>
                    handleChangeScheduleNote(h.id, e.target.value)
                  }
                  placeholder="Write..."
                  title="Schedule note for this column"
                />
              ))}
            </div>

            {showAddHabit && (
              <div className="add-habit-inline-bar">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                  placeholder="Plan name..."
                  autoFocus
                />
                <input
                  type="text"
                  value={newScheduleNote}
                  onChange={(e) => setNewScheduleNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                  placeholder="Schedule (e.g. 8 PM)"
                />
                <button type="button" onClick={handleAddHabit}>
                  Add
                </button>
              </div>
            )}

            <div className="habit-grid-rows">
              {days.map((day) => {
                const isBeforeStart = day < startDay;
                return (
                  <div
                    key={day}
                    className={`habit-grid-row ${
                      isBeforeStart ? 'before-start-row' : ''
                    }`}
                  >
                    <div className="habit-row-date">{day}</div>
                    {monthData.habits.map((h) => {
                      const checked = Boolean(monthData.checks[`${day}-${h.id}`]);
                      return (
                        <button
                          key={h.id}
                          type="button"
                          className={`habit-cell ${checked ? 'is-checked' : ''}`}
                          onClick={() => toggleCheck(day, h.id)}
                          aria-label={`Day ${day} ${h.name}`}
                          style={checked ? { color: accentColor } : undefined}
                        >
                          {checked ? '×' : ''}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <HighlighterLayer
          pageId={page4Id}
          strokes={page4Highlights}
          isHighlightMode={isHighlightMode}
          highlighterColor={highlighterColor}
          onAddStroke={onAddHighlight}
        />

        <PageCanvasOverlay
          pageId={page4Id}
          items={page4Items}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />

        <div className="page-footer-bar">
          <span>Page 4 · Schedule Table &amp; Column Graph</span>
          <span>Click any box for ×</span>
        </div>
      </div>
    </>
  );
};
