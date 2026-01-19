import React, { useState, useEffect, useRef } from 'react';

const GoalsWidget = () => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('system-pulse-goals');
        return saved ? JSON.parse(saved) : [];
    });
    const [newGoal, setNewGoal] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const editInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('system-pulse-goals', JSON.stringify(goals));
    }, [goals]);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    const addGoal = (e) => {
        e.preventDefault();
        if (newGoal.trim() && goals.length < 10) {
            setGoals([...goals, { id: Date.now(), text: newGoal.trim(), completed: false }]);
            setNewGoal('');
        }
    };

    const toggleGoal = (id) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const startEditing = (goal) => {
        setEditingId(goal.id);
        setEditText(goal.text);
    };

    const saveEdit = (id) => {
        if (editText.trim()) {
            setGoals(goals.map(goal =>
                goal.id === id ? { ...goal, text: editText.trim() } : goal
            ));
            setEditingId(null);
        }
    };

    const clearCompleted = () => {
        setGoals(goals.filter(g => !g.completed));
    };

    const completedCount = goals.filter(g => g.completed).length;
    const isAllCompleted = goals.length > 0 && completedCount === goals.length;
    const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

    return (
        <div style={{
            padding: '1rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isAllCompleted ? '0 0 30px rgba(74, 222, 128, 0.2)' : 'none',
            border: isAllCompleted ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid transparent',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: isAllCompleted ? '#4ade80' : 'var(--text-primary)', transition: 'color 0.3s' }}>Daily Goals</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {completedCount > 0 && (
                        <button
                            onClick={clearCompleted}
                            style={{
                                background: 'rgba(248, 113, 113, 0.1)',
                                border: '1px solid rgba(248, 113, 113, 0.2)',
                                color: '#f87171',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="hover-bright"
                        >
                            Clear Done
                        </button>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {completedCount}/{goals.length}
                    </span>
                </div>
            </div>

            <form onSubmit={addGoal} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder={goals.length >= 10 ? "Limit reached" : "Add a goal..."}
                    disabled={goals.length >= 10}
                    style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={goals.length >= 10 || !newGoal.trim()}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--accent-color)',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: (goals.length >= 10 || !newGoal.trim()) ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    +
                </button>
            </form>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                position: 'relative',
                zIndex: 1
            }}>
                {goals.map(goal => (
                    <div
                        key={goal.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: goal.completed ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '10px',
                            border: goal.completed ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid transparent',
                            transition: 'all 0.3s ease',
                            group: true
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={() => toggleGoal(goal.id)}
                            style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer',
                                accentColor: '#4ade80'
                            }}
                        />
                        {editingId === goal.id ? (
                            <input
                                ref={editInputRef}
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={() => saveEdit(goal.id)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(goal.id)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    padding: '2px 4px',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        ) : (
                            <span
                                onClick={() => startEditing(goal)}
                                style={{
                                    flex: 1,
                                    textDecoration: goal.completed ? 'line-through' : 'none',
                                    color: goal.completed ? 'rgba(255,255,255,0.4)' : 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    cursor: 'text',
                                    userSelect: 'none'
                                }}
                            >
                                {goal.text}
                            </span>
                        )}
                        <button
                            onClick={() => deleteGoal(goal.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#f87171',
                                cursor: 'pointer',
                                padding: '4px',
                                opacity: 0.4,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {isAllCompleted && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        animation: 'fadeInScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                    }}>
                        <img
                            src="https://raw.githubusercontent.com/veereshvuyyuri/SystemPulse/main/assets/goals_completion_stars.png"
                            alt="Achievement"
                            style={{ width: '120px', height: '120px', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))' }}
                            onError={(e) => {
                                // Fallback since the GitHub URL might not be ready/reachable immediately
                                // Using a CSS-based representation of 3 stars if image fails
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div style="font-size: 3rem; display: flex; gap: 0.5rem; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))">
                                        ⭐ ⭐ ⭐
                                    </div>
                                    <div style="color: #4ade80; font-weight: bold; margin-top: 1rem; text-transform: uppercase; letter-spacing: 2px;">Perfect Day!</div>
                                `;
                            }}
                        />
                    </div>
                )}

                {goals.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem' }}>
                        No goals set for today.
                    </div>
                )}
            </div>

            <div style={{ marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    <span>Progress</span>
                    <span style={{ color: isAllCompleted ? '#4ade80' : 'var(--text-secondary)', fontWeight: isAllCompleted ? 'bold' : 'normal' }}>
                        {Math.round(progress)}%
                    </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: progress === 100 ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'var(--accent-color)',
                        boxShadow: progress === 100 ? '0 0 10px rgba(74, 222, 128, 0.5)' : 'none',
                        transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
                    }} />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: translate(-50%, -40%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                .hover-bright:hover {
                    filter: brightness(1.2);
                    background: rgba(248, 113, 113, 0.2) !important;
                }
            `}} />
        </div>
    );
};

export default GoalsWidget;
