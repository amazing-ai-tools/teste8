import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Building2, AlertTriangle, Users, Clock, 
  RefreshCw, Copy, CheckCircle, MapPin 
} from 'lucide-react';
import './styles.css';

type ProblemType = 'nid-de-poule' | 'feu-defectueux' | 'trottoir-bloque' | 'dechet-proprete';
type Impact = 'faible' | 'moyen' | 'eleve';
type Urgency = 'faible' | 'moyenne' | 'elevee';

interface ProblemOption {
  value: ProblemType;
  label: string;
  icon: any;
}

const problemTypes: ProblemOption[] = [
  { value: 'nid-de-poule', label: 'Nid-de-poule', icon: <MapPin size={18} /> },
  { value: 'feu-defectueux', label: 'Feu défectueux', icon: <AlertTriangle size={18} /> },
  { value: 'trottoir-bloque', label: 'Trottoir bloqué', icon: <Users size={18} /> },
  { value: 'dechet-proprete', label: 'Déchet / Propreté', icon: <MapPin size={18} /> },
];

const impacts = [
  { value: 'faible' as Impact, label: 'Faible' },
  { value: 'moyen' as Impact, label: 'Moyen' },
  { value: 'eleve' as Impact, label: 'Élevé' },
];

const urgencies = [
  { value: 'faible' as Urgency, label: 'Faible' },
  { value: 'moyenne' as Urgency, label: 'Moyenne' },
  { value: 'elevee' as Urgency, label: 'Élevée' },
];

// --- SCORING LOGIC (transparent and defensible for demo) ---
function calculateScore(
  problemType: ProblemType,
  impact: Impact,
  urgency: Urgency
): number {
  // Problem type weight (safety & disruption)
  const typeScore: Record<ProblemType, number> = {
    'feu-defectueux': 40,   // highest - public safety
    'trottoir-bloque': 32,  // mobility/access
    'nid-de-poule': 24,
    'dechet-proprete': 16,
  };

  // Citizen impact weight
  const impactScore: Record<Impact, number> = {
    'eleve': 36,
    'moyen': 24,
    'faible': 10,
  };

  // Urgency weight
  const urgencyScore: Record<Urgency, number> = {
    'elevee': 28,
    'moyenne': 18,
    'faible': 8,
  };

  const raw = typeScore[problemType] + impactScore[impact] + urgencyScore[urgency];
  // Normalize to 100 (max raw ≈ 104)
  const normalized = Math.round((raw / 104) * 100);
  return Math.min(100, Math.max(5, normalized));
}

function getLevel(score: number): 'Faible' | 'Moyen' | 'Critique' {
  if (score < 40) return 'Faible';
  if (score < 70) return 'Moyen';
  return 'Critique';
}

function getLevelClass(score: number): string {
  const level = getLevel(score);
  if (level === 'Faible') return 'level-faible';
  if (level === 'Moyen') return 'level-moyen';
  return 'level-critique';
}

function getScoreClass(score: number): string {
  const level = getLevel(score);
  if (level === 'Faible') return 'score-faible';
  if (level === 'Moyen') return 'score-moyen';
  return 'score-critique';
}

function getProgressColor(score: number): string {
  const level = getLevel(score);
  if (level === 'Faible') return '#166534';
  if (level === 'Moyen') return '#c2410c';
  return '#991b1b';
}

function getRecommendation(score: number, problemType: ProblemType): string {
  const level = getLevel(score);

  if (level === 'Critique') {
    return "Assigner une équipe aujourd’hui et informer les citoyens concernés. Intervention requise dans les prochaines 24 heures.";
  }
  if (level === 'Moyen') {
    return "Planifier une intervention sous 3 à 5 jours. Informer le citoyen et ajouter à la file d’attente des travaux.";
  }
  return "Intégrer à la planification de maintenance régulière. Traitement recommandé dans un délai de 10 à 15 jours.";
}

function getProposedStatus(score: number): string {
  const level = getLevel(score);
  if (level === 'Critique') return 'Ouvert — Priorité critique';
  if (level === 'Moyen') return 'Ouvert — À planifier';
  return 'Ouvert — Maintenance programmée';
}

function App() {
  const [problemType, setProblemType] = useState<ProblemType>('feu-defectueux');
  const [impact, setImpact] = useState<Impact>('eleve');
  const [urgency, setUrgency] = useState<Urgency>('elevee');

  const [toast, setToast] = useState<string | null>(null);

  const score = calculateScore(problemType, impact, urgency);
  const level = getLevel(score);
  const recommendation = getRecommendation(score, problemType);
  const status = getProposedStatus(score);

  // Quick preset buttons for live demo
  const loadPreset = (type: ProblemType, imp: Impact, urg: Urgency) => {
    setProblemType(type);
    setImpact(imp);
    setUrgency(urg);
  };

  const resetForm = () => {
    setProblemType('nid-de-poule');
    setImpact('moyen');
    setUrgency('moyenne');
  };

  const copyReport = async () => {
    const report = `Assistant de priorisation municipale
------------------------------------
Type de problème : ${problemTypes.find(p => p.value === problemType)?.label}
Niveau d’impact : ${impacts.find(i => i.value === impact)?.label}
Urgence : ${urgencies.find(u => u.value === urgency)?.label}

Score de priorité : ${score}/100 — ${level}
Recommandation : ${recommendation}
Statut proposé : ${status}
`;
    try {
      await navigator.clipboard.writeText(report);
      showToast('Rapport copié dans le presse-papiers');
    } catch {
      showToast('Impossible de copier automatiquement');
    }
  };

  const simulateRegister = () => {
    showToast('Signalement enregistré (simulation)');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  };

  const progressWidth = `${score}%`;
  const progressColor = getProgressColor(score);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="municipal-icon">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">Municipalité</div>
            <div className="text-xs text-slate-500 -mt-0.5">Service des travaux publics</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="title">Assistant de priorisation municipale</h1>
          <p className="subtitle">
            Remplissez le formulaire — le score de priorité est calculé instantanément.
          </p>

          <div className="demo-grid">
            {/* FORM - LEFT */}
            <div className="form-card">
              <h2>
                <MapPin size={19} />
                Caractéristiques du signalement
              </h2>

              {/* Type de problème */}
              <div className="form-group">
                <label className="form-label">Type de problème</label>
                <select
                  className="form-select"
                  value={problemType}
                  onChange={(e: any) => setProblemType(e.target.value as ProblemType)}
                >
                  {problemTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Impact citoyen */}
              <div className="form-group">
                <label className="form-label">Niveau d’impact citoyen</label>
                <select
                  className="form-select"
                  value={impact}
                  onChange={(e: any) => setImpact(e.target.value as Impact)}
                >
                  {impacts.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgence */}
              <div className="form-group">
                <label className="form-label">Urgence</label>
                <select
                  className="form-select"
                  value={urgency}
                  onChange={(e: any) => setUrgency(e.target.value as Urgency)}
                >
                  {urgencies.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Presets for live presentation */}
              <div className="presets">
                <button 
                  className="preset-btn critique" 
                  onClick={() => loadPreset('feu-defectueux', 'eleve', 'elevee')}
                >
                  Exemple critique
                </button>
                <button 
                  className="preset-btn moyen" 
                  onClick={() => loadPreset('trottoir-bloque', 'moyen', 'moyenne')}
                >
                  Exemple moyen
                </button>
                <button 
                  className="preset-btn faible" 
                  onClick={() => loadPreset('dechet-proprete', 'faible', 'faible')}
                >
                  Exemple faible
                </button>
              </div>

              <div className="helper-text">
                Le score est mis à jour en temps réel selon une grille pondérée (sécurité, impact, urgence).
              </div>
            </div>

            {/* RESULT - RIGHT */}
            <div className="result-card">
              <div className="result-header">Résultat de l’analyse</div>

              <div className="score-container">
                <div className={`score-value ${getScoreClass(score)}`}>
                  {score}
                  <span className="text-3xl font-semibold align-super text-slate-400">/100</span>
                </div>
                <div className="score-label">Score de priorité</div>

                <div className={`level-badge ${getLevelClass(score)}`}>
                  {level}
                </div>

                {/* Visual progress bar */}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: progressWidth, backgroundColor: progressColor }} 
                  />
                </div>
              </div>

              <div className="divider" />

              <div className="recommendation-box">
                <div className="recommendation-label">Recommandation d’action</div>
                <div className="recommendation-text">{recommendation}</div>
              </div>

              <div className="status-row">
                <div className="status-label">Statut proposé</div>
                <div className="status-value">{status}</div>
              </div>

              {/* Action buttons */}
              <div className="result-actions">
                <button onClick={copyReport} className="action-btn secondary">
                  <Copy size={16} /> Copier le rapport
                </button>
                <button onClick={simulateRegister} className="action-btn primary">
                  <CheckCircle size={16} /> Enregistrer
                </button>
              </div>

              <button onClick={resetForm} className="reset-btn">
                <span className="inline-flex items-center justify-center gap-1.5">
                  <RefreshCw size={15} /> Réinitialiser
                </span>
              </button>
            </div>
          </div>

          {/* Small footer note */}
          <div className="mt-8 text-center text-xs text-slate-400 max-w-md mx-auto">
            Démo interactive — Les calculs reposent sur une grille pondérée interne utilisée par les services techniques.
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="toast">
          <CheckCircle size={18} /> {toast}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
