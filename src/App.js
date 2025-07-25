import React, { useState } from 'react';
import { Plus, Trash2, BarChart3, User, Save, Settings } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('setup');
  const [rubricCriteria, setRubricCriteria] = useState([
    { id: 1, name: 'Content Organization', weight: 25, maxScore: 10 },
    { id: 2, name: 'Delivery & Speaking', weight: 25, maxScore: 10 },
    { id: 3, name: 'Visual Aids', weight: 20, maxScore: 10 },
    { id: 4, name: 'Audience Engagement', weight: 20, maxScore: 10 },
    { id: 5, name: 'Time Management', weight: 10, maxScore: 10 }
  ]);
  
  const [currentPresenter, setCurrentPresenter] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [currentScores, setCurrentScores] = useState({});

  // Sample data for demonstration
  const [sampleData, setSampleData] = useState([
    {
      presenter: 'Alice Johnson',
      scores: { 1: 8, 2: 9, 3: 7, 4: 8, 5: 9 },
      totalScore: 8.2,
      feedback: 'Excellent delivery, could improve visual design',
      timestamp: new Date('2024-03-15T10:30:00')
    },
    {
      presenter: 'Bob Smith',
      scores: { 1: 7, 2: 6, 3: 8, 4: 7, 5: 8 },
      totalScore: 7.2,
      feedback: 'Good content, work on speaking confidence',
      timestamp: new Date('2024-03-15T10:45:00')
    },
    {
      presenter: 'Carol Davis',
      scores: { 1: 9, 2: 8, 3: 9, 4: 9, 5: 7 },
      totalScore: 8.4,
      feedback: 'Outstanding presentation overall',
      timestamp: new Date('2024-03-15T11:00:00')
    }
  ]);

  const addCriterion = () => {
    const newId = Math.max(...rubricCriteria.map(c => c.id), 0) + 1;
    setRubricCriteria([...rubricCriteria, {
      id: newId,
      name: 'New Criterion',
      weight: 10,
      maxScore: 10
    }]);
  };

  const updateCriterion = (id, field, value) => {
    setRubricCriteria(prev => prev.map(criterion => 
      criterion.id === id ? { ...criterion, [field]: value } : criterion
    ));
  };

  const removeCriterion = (id) => {
    setRubricCriteria(prev => prev.filter(criterion => criterion.id !== id));
  };

  const handleScoreChange = (criterionId, score) => {
    setCurrentScores(prev => ({
      ...prev,
      [criterionId]: parseInt(score) || 0
    }));
  };

  const calculateWeightedScore = (scores) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    rubricCriteria.forEach(criterion => {
      if (scores[criterion.id] !== undefined) {
        totalWeightedScore += (scores[criterion.id] / criterion.maxScore) * criterion.weight;
        totalWeight += criterion.weight;
      }
    });
    
    return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 10 : 0;
  };

  const submitEvaluation = () => {
    if (!currentPresenter || Object.keys(currentScores).length === 0) {
      alert('Please enter presenter name and at least one score');
      return;
    }

    const newEvaluation = {
      presenter: currentPresenter,
      scores: { ...currentScores },
      totalScore: calculateWeightedScore(currentScores),
      feedback: '',
      timestamp: new Date()
    };

    setEvaluations(prev => [...prev, newEvaluation]);
    setSampleData(prev => [...prev, newEvaluation]);
    setCurrentPresenter('');
    setCurrentScores({});
    alert('Evaluation submitted successfully!');
  };

  // Data for charts
  const chartData = sampleData.map(evaluation => ({
    name: evaluation.presenter,
    score: Math.round(evaluation.totalScore * 10) / 10,
    ...rubricCriteria.reduce((acc, criterion) => {
      acc[criterion.name] = evaluation.scores[criterion.id] || 0;
      return acc;
    }, {})
  }));

  const avgScoreByCategory = rubricCriteria.map(criterion => ({
    category: criterion.name,
    average: Math.round(
      (sampleData.reduce((sum, evaluation) => sum + (evaluation.scores[criterion.id] || 0), 0) / sampleData.length) * 10
    ) / 10
  }));

  const radarData = rubricCriteria.map(criterion => ({
    subject: criterion.name,
    average: Math.round(
      (sampleData.reduce((sum, evaluation) => sum + (evaluation.scores[criterion.id] || 0), 0) / sampleData.length) * 10
    ) / 10,
    fullMark: criterion.maxScore
  }));

  const totalWeight = rubricCriteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="header">
        <div className="container">
          <div className="header-content">
            <h1>Presentation Scoring System</h1>
            <nav className="nav">
              {[
                { id: 'setup', label: 'Rubric Setup', icon: Settings },
                { id: 'evaluate', label: 'Evaluate', icon: User },
                { id: 'results', label: 'View Results', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className={`nav-button ${activeView === id ? 'active' : ''}`}
                  type="button"
                >
                  <Icon className="nav-icon" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="main-content">
          {activeView === 'setup' && (
            <div className="card">
              <div className="card-header">
                <h2>Customizable Rubric Setup</h2>
                <button onClick={addCriterion} className="btn btn-primary" type="button">
                  <Plus />
                  Add Criterion
                </button>
              </div>

              <div className="space-y-4">
                {rubricCriteria.map(criterion => (
                  <div key={criterion.id} className="criterion-item">
                    <div className="criterion-name">
                      <input
                        type="text"
                        value={criterion.name}
                        onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                        className="input"
                        placeholder="Criterion name"
                      />
                    </div>
                    <div className="criterion-controls">
                      <div className="criterion-field">
                        <label className="label">Weight %</label>
                        <input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value) || 0)}
                          className="number-input input-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="criterion-field">
                        <label className="label">Max Score</label>
                        <input
                          type="number"
                          value={criterion.maxScore}
                          onChange={(e) => updateCriterion(criterion.id, 'maxScore', parseInt(e.target.value) || 1)}
                          className="number-input input-sm"
                          min="1"
                        />
                      </div>
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="btn btn-icon"
                        type="button"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="weight-warning">
                <p>
                  Total Weight: {totalWeight}%
                  {totalWeight !== 100 && (
                    <span className="weight-error">⚠ Should equal 100%</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeView === 'evaluate' && (
            <div className="card">
              <h2>Evaluate Presentation</h2>
              
              <div className="form-group">
                <label className="label">
                  Presenter Name
                </label>
                <input
                  type="text"
                  value={currentPresenter}
                  onChange={(e) => setCurrentPresenter(e.target.value)}
                  className="input input-md"
                  placeholder="Enter presenter's name"
                />
              </div>

              <div className="eval-grid">
                {rubricCriteria.map(criterion => (
                  <div key={criterion.id} className="eval-card">
                    <div className="eval-header">
                      <h3>{criterion.name}</h3>
                      <span className="eval-weight">{criterion.weight}% weight</span>
                    </div>
                    
                    <div className="score-input">
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Score:</span>
                      <input
                        type="range"
                        min="0"
                        max={criterion.maxScore}
                        value={currentScores[criterion.id] || 0}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                        className="slider"
                      />
                      <span className="score-display">
                        {currentScores[criterion.id] || 0}/{criterion.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(currentScores).length > 0 && (
                <div className="preview-score">
                  <h3>Preview Score</h3>
                  <p className="preview-value">
                    {Math.round(calculateWeightedScore(currentScores) * 10) / 10}/10.0
                  </p>
                </div>
              )}

              <div className="submit-container">
                <button onClick={submitEvaluation} className="btn btn-success" type="button">
                  <Save />
                  Submit Evaluation
                </button>
              </div>
            </div>
          )}

          {activeView === 'results' && (
            <div>
              <div className="card">
                <h2>Presentation Scores Overview</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="results-grid">
                <div className="card">
                  <h3>Average Scores by Category</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={avgScoreByCategory} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="category" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <h3>Class Performance Radar</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar
                          name="Average Score"
                          dataKey="average"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Recent Evaluations</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Presenter</th>
                        <th>Total Score</th>
                        <th>Timestamp</th>
                        <th>Breakdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.slice(-5).reverse().map((evaluation, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 500 }}>{evaluation.presenter}</td>
                          <td>
                            <span className="score-badge">
                              {Math.round(evaluation.totalScore * 10) / 10}/10.0
                            </span>
                          </td>
                          <td className="timestamp">
                            {evaluation.timestamp.toLocaleString()}
                          </td>
                          <td>
                            <div className="breakdown-tags">
                              {rubricCriteria.map(criterion => (
                                <span key={criterion.id} className="breakdown-tag">
                                  {criterion.name}: {evaluation.scores[criterion.id] || 0}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Class Average</h4>
                  <p className="stat-value blue">
                    {Math.round((sampleData.reduce((sum, evaluation) => sum + evaluation.totalScore, 0) / sampleData.length) * 10) / 10}/10.0
                  </p>
                </div>
                <div className="stat-card">
                  <h4>Total Presentations</h4>
                  <p className="stat-value green">{sampleData.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Highest Score</h4>
                  <p className="stat-value purple">
                    {Math.round(Math.max(...sampleData.map(evaluation => evaluation.totalScore)) * 10) / 10}/10.0
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;