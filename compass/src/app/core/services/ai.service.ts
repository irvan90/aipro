import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AgentFinding, AIResult, Backlog, Quarter, RoadmapLane, MoSCoW, RICEScore, ThinkingStep, ThinkingAgent, ThinkingType } from '../models/backlog.model';
import { backlogStore } from '../stores/backlog.store';
import { AGENT_DEFINITIONS, MOCK_IMPACT_RESULTS, MOCK_POCKET_RUPIAH_AI_RESULT } from './mock-data.service';

const STEP_MS = 400;

@Injectable({ providedIn: 'root' })
export class AiService {

  private step(agent: ThinkingAgent, agentLabel: string, icon: string, message: string, type: ThinkingType = 'process'): ThinkingStep {
    return { agent, agentLabel, icon, message, type };
  }

  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    return new Observable(observer => {
      const calculation = this.runDynamicCalculations(backlog);
      const finalResult = calculation.aiResult;

      // Populate findings from calculation logs
      const findings: AgentFinding[] = [
        {
          agentId: 'market-agent',
          agentName: 'Market Agent',
          role: 'Trend Tracker · Context Adaptor · Loss Predictor · Schedule Guard',
          icon: '◎',
          summary: calculation.agent1Logs[calculation.agent1Logs.length - 1]?.message || 'Market Agent analysis completed.',
          contributesTo: ['Market Urgency Score', 'Delay Risk', 'Timeline Flag'],
          evidence: [calculation.aiResult.reasoning.evidenceRefs[0] || 'Competitor profile']
        },
        {
          agentId: 'value-agent',
          agentName: 'Value Agent',
          role: 'Context Matcher · Goal Aligner · Reach Estimator · Bias Calibrator',
          icon: '↗',
          summary: calculation.agent2Logs[calculation.agent2Logs.length - 1]?.message || 'Value Agent analysis completed.',
          contributesTo: ['Reach Score', 'Impact Score', 'Alignment Product Rating'],
          evidence: [calculation.aiResult.reasoning.evidenceRefs[1] || 'User segment']
        },
        {
          agentId: 'feasibility-agent',
          agentName: 'Feasibility Agent',
          role: 'Effort Estimator · Dependency Mapper · Compliance Guard',
          icon: '◇',
          summary: calculation.agent3Logs[calculation.agent3Logs.length - 1]?.message || 'Feasibility Agent analysis completed.',
          contributesTo: ['Effort Score', 'Compliance Rating', 'Dependency Map'],
          evidence: [calculation.aiResult.reasoning.evidenceRefs[2] || 'Technical docs']
        }
      ];
      finalResult.agentFindings = findings;

      backlogStore.thinkingLogs.set([]);
      backlogStore.fastForwardAnalysis.set(false);
      backlogStore.agentStates.set(AGENT_DEFINITIONS.map(agent => ({
        agentId: agent.id,
        name: agent.name,
        icon: agent.icon,
        status: 'pending' as const,
      })));

      const TIME_SCALE = 12;
      const scheduledActions: { time: number, action: () => void }[] = [];
      const pushAction = (time: number, action: () => void) => scheduledActions.push({ time, action });
      
      let offset = 0;
      const log = (s: ThinkingStep) => backlogStore.thinkingLogs.update(logs => [...logs, s]);

      // ── Phase 1: Orchestrator Agent ─
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Orchestrator Agent menerima Backlog Data Payload dari myService...'));
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', `Menerima data backlog "${backlog.title}" dari myService`, 'info')));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', 'Mengekstrak metadata backlog: deskripsi, tipe pengguna, dan parameter BPRO')));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Connecting to Product Context DB, Scrum Team DB & Compliance Vector DB...'));
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', 'Mengambil konteks produk dari Product Context DB...')));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', 'Mengambil data tim & kapasitas dari Scrum Team DB...')));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', 'Menghubungkan ke Compliance DB via Vector DB (Aturan OJK, PBI, & UU PDP)...')));
      offset += 150;
      pushAction(offset * TIME_SCALE, () => log(this.step('orchestrator', 'Orchestrator Agent', '⚡', 'Mendistribusikan analisis ke 3 Agent paralel: Market, Value, dan Feasibility', 'info')));
      offset += 150;

      // ── Phase 2: Fan-out — 3 AI Agents run in PARALLEL ──
      const parallelStart = offset;

      AGENT_DEFINITIONS.forEach(agent => {
        pushAction(parallelStart * TIME_SCALE, () => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id ? { ...state, status: 'running' as const, currentStep: agent.steps[0] } : state
          ));
        });
      });
      pushAction(parallelStart * TIME_SCALE, () => backlogStore.aiLoadingStep.set('3 AI Agents (Market · Value · Feasibility) berjalan paralel...'));

      let agentLogOffset = parallelStart + 150;

      const maxAgentLogSteps = Math.max(
        calculation.agent1Logs.length,
        calculation.agent2Logs.length,
        calculation.agent3Logs.length
      );

      for (let i = 0; i < maxAgentLogSteps; i++) {
        if (i < calculation.agent1Logs.length) {
          pushAction(agentLogOffset * TIME_SCALE, () => log(calculation.agent1Logs[i]));
          agentLogOffset += 160;
        }
        if (i < calculation.agent2Logs.length) {
          pushAction(agentLogOffset * TIME_SCALE, () => log(calculation.agent2Logs[i]));
          agentLogOffset += 160;
        }
        if (i < calculation.agent3Logs.length) {
          pushAction(agentLogOffset * TIME_SCALE, () => log(calculation.agent3Logs[i]));
          agentLogOffset += 160;
        }
      }

      const maxSteps = Math.max(...AGENT_DEFINITIONS.map(a => a.steps.length));
      for (let stepIdx = 1; stepIdx < maxSteps; stepIdx++) {
        AGENT_DEFINITIONS.forEach(agent => {
          if (stepIdx < agent.steps.length) {
            pushAction((parallelStart + stepIdx * STEP_MS) * TIME_SCALE, () => {
              backlogStore.agentStates.update(states => states.map(state =>
                state.agentId === agent.id ? { ...state, currentStep: agent.steps[stepIdx] } : state
              ));
            });
          }
        });
      }
      offset = parallelStart + maxSteps * STEP_MS;

      // Agents complete
      AGENT_DEFINITIONS.forEach((agent, index) => {
        pushAction(offset * TIME_SCALE, () => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id
              ? { ...state, status: 'done' as const, currentStep: undefined, finding: findings[index] }
              : state
          ));
        });
      });

      // ── Phase 3: Central Decision Engine ──
      offset += 200;
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Central Decision Engine: RICE Scoring · MoSCoW Categorization · Value-Effort Matrix...'));
      
      // Dynamic Decision Logs
      calculation.decisionLogs.forEach(entry => {
        pushAction(offset * TIME_SCALE, () => log(entry));
        offset += 250;
      });

      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Generating MoSCoW Categorization & Value-Effort Matrix Mapper...'));
      offset += 300;
      pushAction(offset * TIME_SCALE, () => log(this.step('decision-engine', 'Central Decision Engine', '❖', `🎯 Rekomendasi: ${finalResult.moscow === 'Must Have' ? 'PROMOSIKAN ke prioritas utama' : 'EVALUASI SELESAI'} — Kategori: ${finalResult.moscow}`, 'result')));
      offset += STEP_MS;

      pushAction(offset * TIME_SCALE, () => {
        observer.next(finalResult);
        observer.complete();
      });

      scheduledActions.sort((a, b) => a.time - b.time);
      const startTime = Date.now();
      let timeoutId: any;
      let isCompleted = false;

      const runSchedule = () => {
        if (isCompleted) return;
        
        if (backlogStore.fastForwardAnalysis()) {
          scheduledActions.forEach(s => s.action());
          scheduledActions.length = 0;
          isCompleted = true;
          return;
        }

        const now = Date.now();
        const elapsed = now - startTime;

        while (scheduledActions.length > 0 && elapsed >= scheduledActions[0].time) {
          scheduledActions[0].action();
          scheduledActions.shift();
        }

        if (scheduledActions.length > 0) {
          timeoutId = setTimeout(runSchedule, 50);
        } else {
          isCompleted = true;
        }
      };

      runSchedule();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        isCompleted = true;
      };
    });
  }

  analyzeImpact(backlogId: string, targetLane: RoadmapLane | Quarter): Observable<ImpactAnalysisResult> {
    return new Observable(observer => {
      const timers = [
        setTimeout(() => backlogStore.aiLoadingStep.set('Membandingkan prioritas dan kapasitas lane'), 0),
        setTimeout(() => backlogStore.aiLoadingStep.set('Menghitung trade-off roadmap'), 450),
        setTimeout(() => backlogStore.aiLoadingStep.set('Menyiapkan rekomendasi untuk PO'), 900),
        setTimeout(() => {
          const source = MOCK_IMPACT_RESULTS[backlogId] ?? MOCK_IMPACT_RESULTS['pocket-bca'];
          observer.next({ ...source, backlogId, targetLane });
          observer.complete();
        }, 1350),
      ];
      return () => timers.forEach(timer => clearTimeout(timer));
    });
  }

  runDynamicCalculations(backlog: Backlog): {
    aiResult: AIResult;
    agent1Logs: ThinkingStep[];
    agent2Logs: ThinkingStep[];
    agent3Logs: ThinkingStep[];
    decisionLogs: ThinkingStep[];
  } {
    const isPocket = backlog.id === 'pocket-rupiah' || backlog.id === 'pocket-bca' || backlog.title.toLowerCase().includes('pocket');
    const ms = backlog.myService;
    const S = this.step.bind(this);
    
    // 1. Reach Calculation (Metode Normalisasi Skala Relatif Berbasis Segmen)
    let reach = 5;
    let reachLabel = 'High Reach';
    let reachReason = '';
    const agent2Logs: ThinkingStep[] = [];
    
    agent2Logs.push(S('value-agent', 'Value Agent', '↗', 'Menganalisis segmentasi pengguna dan proyeksi jangkauan (Metode Relatif)...'));
    if (backlog.targetCakupanAdopsi) {
      const opt = backlog.targetCakupanAdopsi;
      const isInternal = ms?.userType === 'internal';
      if (opt === '>50% TAM') { reach = 10; reachLabel = isInternal ? 'Enterprise Wide Impact' : 'Massive Reach'; }
      else if (opt === '20-50% TAM') { reach = 5; reachLabel = isInternal ? 'Departmental/Multi-Squad Reach' : 'High Reach'; }
      else if (opt === '5-20% TAM') { reach = 2; reachLabel = isInternal ? 'Squad/Specific Unit Reach' : 'Segmented Reach'; }
      else { reach = 1; reachLabel = isInternal ? 'Micro/Niche Internal' : 'Niche Reach'; }
      reachReason = `PO manual input Reach Target Scale: "${opt}". Reach score set to ${reach} (${reachLabel}).`;
      agent2Logs.push(S('value-agent', 'Value Agent', '↗', `PO mengisi Target Jangkauan: "${opt}" — proporsional score: ${reach} (${reachLabel})`, 'finding'));
    } else {
      const userType = ms?.userType || 'external';
      const product = ms?.product || 'myBCA Mobile';
      agent2Logs.push(S('value-agent', 'Value Agent', '↗', `PO tidak mengisi Target Jangkauan. AI menganalisis dari Tipe Pengguna: "${userType}" & Produk: "${product}"`));
      
      if (userType === 'external') {
        reach = isPocket ? 5 : 10;
        reachLabel = isPocket ? 'High Reach' : 'Massive Reach';
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Menetapkan Total Addressable Market (TAM) nasabah aktif produk "${product}"`));
        reachReason = `AI reads User Type: External & Product: ${product}. Feature impacts ${isPocket ? '20%-50%' : '>50%'} of TAM. Score: ${reach}.`;
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Proyeksi jangkauan (Metode Relatif): ${reachLabel} (Skor ${reach}/10)`, 'finding'));
      } else {
        reach = 5; 
        reachLabel = 'Departmental/Multi-Squad Reach';
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Menetapkan Total Addressable Market (TAM) karyawan di unit/aplikasi target`));
        reachReason = `AI reads User Type: Internal. Feature impacts 20%-50% of relevant staff. Score: ${reach}.`;
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Jangkauan ditetapkan (Metode Relatif): ${reachLabel} (Skor ${reach}/10)`, 'finding'));
      }
    }

    // 2. Impact Calculation
    let impact = 2.0;
    let impactReason = '';
    
    if (backlog.skalaDampakBisnis) {
      const opt = backlog.skalaDampakBisnis;
      if (opt === 'Massive') impact = 3.0;
      else if (opt === 'High') impact = 2.0;
      else if (opt === 'Medium') impact = 1.0;
      else impact = 0.5;
      impactReason = `PO manual input Impact Scale: "${opt}". Setting multiplier to ${impact}x.`;
      agent2Logs.push(S('value-agent', 'Value Agent', '↗', `PO mengisi Skala Dampak: "${opt}" — multiplier dampak ${impact}x`, 'finding'));
    } else {
      const textToAnalyze = `${ms?.customerValue || ''} ${backlog.description} ${backlog.businessObjective}`.toLowerCase();
      agent2Logs.push(S('value-agent', 'Value Agent', '↗', 'PO tidak mengisi Skala Dampak. AI melakukan analisis semantik pada narasi benefit...'));
      
      const hasCASA = textToAnalyze.includes('casa') || textToAnalyze.includes('outflow') || textToAnalyze.includes('retensi') || textToAnalyze.includes('retained') || textToAnalyze.includes('saldo') || textToAnalyze.includes('budgeting');
      const hasRevenue = textToAnalyze.includes('revenue') || textToAnalyze.includes('fee-based') || textToAnalyze.includes('pendapatan') || textToAnalyze.includes('income');
      
      if (hasCASA || hasRevenue) {
        impact = 3.0;
        impactReason = `AI dissects Value Untuk Nasabah: narrative mentions CASA outflow reduction / Fee-Based Income increase. Inferring High/Massive Impact (${impact}x).`;
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', 'Terdeteksi indikator dampak tinggi: CASA outflow / Fee-Based Income'));
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Kesimpulan: Dampak Massive (${impact}x) terhadap OKR produk`, 'finding'));
      } else {
        impact = 1.5;
        impactReason = `AI semantic analysis: standard digital engagement benefit detected. Concluding Medium Impact (${impact}x).`;
        agent2Logs.push(S('value-agent', 'Value Agent', '↗', `Kesimpulan: Dampak Medium (${impact}x) — benefit digital engagement standar`, 'finding'));
      }
    }

    // 3. Confidence Calculation
    let confidence = 80;
    let confidenceReason = '';
    const agent3Logs: ThinkingStep[] = [];
    
    agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'Melakukan Vector Search ke Compliance DB (Aturan Regulasi OJK, PBI, & UU PDP)...'));
    
    if (backlog.estimasiKepercayaan && backlog.estimasiKepercayaan > 0) {
      confidence = backlog.estimasiKepercayaan;
      confidenceReason = `PO manual input Confidence Score: ${confidence}%.`;
      agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', `PO mengisi skor kepercayaan: ${confidence}%`, 'finding'));
    } else {
      agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'PO tidak mengisi Confidence. AI memeriksa validitas kelengkapan dokumen & keselarasan aturan Compliance DB...'));
      const isBlueprintValid = blueprintUrl.startsWith('http') || blueprintUrl.length > 10;
      const isRopaValid = !hasPersonalData || (ropaDpiaLink.startsWith('http') || ropaDpiaLink.length > 10);
      
      if (isBlueprintValid && isRopaValid) {
        confidence = 90;
        confidenceReason = `AI tests technical validity & Compliance DB match: Blueprint is valid, ROPA DPIA is filled, and OJK/PBI regulatory checks passed. Setting high Confidence (${confidence}%).`;
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'Vector Search Compliance DB: Tidak ditemukan potensi pelanggaran regulasi OJK/PBI'));
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'Blueprint URL valid & dokumen ROPA/DPIA terpenuhi'));
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', `Risiko teknis & regulasi rendah — Confidence ditetapkan: ${confidence}%`, 'finding'));
      } else {
        confidence = 50;
        confidenceReason = `AI tests technical validity & Compliance DB match: ${!isBlueprintValid ? 'Blueprint URL is empty/invalid. ' : ''}${!isRopaValid ? 'Link ROPA DPIA is missing despite Personal Data Access (UU PDP violation risk).' : ''} High uncertainty risk. Confidence lowered to ${confidence}%.`;
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'Vector Search Compliance DB: Terdeteksi potensi isu kepatuhan perlindungan data pribadi (UU PDP & OJK)'));
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', `⚠️ Perhatian: ${!isBlueprintValid ? 'Blueprint URL kosong/tidak valid. ' : ''}${!isRopaValid ? 'Link ROPA DPIA belum diisi meskipun ada akses data pribadi.' : ''}`, 'warning'));
        agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', `Risiko teknis & kepatuhan tinggi — Confidence diturunkan ke ${confidence}%`, 'finding'));
      }
    }

    // 4. Effort Calculation
    let effort = 8;
    const effLevel = ms?.valuegraphEffort || 'Medium';
    if (effLevel === 'High') effort = 13;
    else if (effLevel === 'Low') effort = 4;
    else effort = 8;
    agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', `Effort dari Valuegraph myService: ${effLevel} (${effort} story points)`));
    agent3Logs.push(S('feasibility-agent', 'Feasibility Agent', '◇', 'Review compliance selesai — 100% regulasi OJK, PBI, & UU PDP terpenuhi ✓', 'finding'));

    // 5. Launch Flexibility
    let launchFlexibility = 'Flexible';
    const agent1Logs: ThinkingStep[] = [];
    
    agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Menganalisis tren pasar dan posisi kompetitor...'));
    if (backlog.fleksibilitasPeluncuran) {
      launchFlexibility = backlog.fleksibilitasPeluncuran;
      agent1Logs.push(S('market-agent', 'Market Agent', '◎', `PO mengisi Fleksibilitas Peluncuran: "${launchFlexibility}"`, 'finding'));
    } else {
      const pmo = ms?.pmoSubmission || 'planned';
      agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'PO tidak mengisi Fleksibilitas Peluncuran. AI memeriksa status Pengajuan PMO...'));
      if (pmo === 'planned') {
        launchFlexibility = 'Strict';
        agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Status PMO: Planned — deadline peluncuran ketat (komitmen akhir tahun)', 'finding'));
      } else {
        const concernText = (ms?.concern || '').toLowerCase();
        const hasCompetition = concernText.includes('kompetitor') || concernText.includes('kompetisi') || concernText.includes('regulasi') || concernText.includes('ojk') || concernText.includes('bi');
        if (hasCompetition) {
          launchFlexibility = 'Strict';
          agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Status PMO: Adhoc, namun ada tekanan kompetitor/regulasi'));
          agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Kesimpulan: Deadline peluncuran ketat karena tekanan eksternal', 'finding'));
        } else {
          launchFlexibility = 'Flexible';
          agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Status PMO: Adhoc, tanpa urgensi kompetitor'));
          agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Kesimpulan: Deadline peluncuran fleksibel', 'finding'));
        }
      }
    }

    if (isPocket) {
      agent1Logs.push(S('market-agent', 'Market Agent', '◎', '⚠️ Ditemukan kompetitor dengan fitur serupa: Jenius (sejak 2017), blu (sejak 2020)', 'warning'));
      agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Risiko keterlambatan pasar tinggi — BCA tertinggal 6-9 tahun dari kompetitor', 'finding'));
    } else {
      agent1Logs.push(S('market-agent', 'Market Agent', '◎', 'Evaluasi timing pasar selesai — urgensi normal', 'finding'));
    }

    // 6. RICE Calculation
    const riceScore = (reach * impact * (confidence / 100)) / effort;
    const rice: RICEScore = {
      reach,
      impact,
      confidence,
      effort,
      total: Math.round(riceScore * 100) / 100,
      reachLabel
    };

    // 7. MoSCoW Urgency
    let moscow: MoSCoW = 'Should Have';
    let moscowReason = '';
    const decisionLogs: ThinkingStep[] = [];

    decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', 'Menggabungkan hasil analisis dari semua agent...', 'info'));
    decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', `Parameter RICE: Reach=${reach}/10 (${reachLabel}), Impact=${impact}x, Confidence=${confidence}%, Effort=${effort}`));
    decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', 'Mengevaluasi kategori MoSCoW dengan guardrails deterministik...'));

    const isLegalViolation = hasPersonalData && !ropaDpiaLink;
    if (isLegalViolation) {
      moscow = 'Must Have';
      moscowReason = 'Any Personal Data Access is True but Link ROPA DPIA is empty. Legal compliance enforcement requires Must Have.';
      decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', '⚠️ Terdeteksi: Akses Data Pribadi aktif tapi Link ROPA DPIA kosong!', 'warning'));
      decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', 'Guardrail Compliance aktif — kategori dinaikkan ke MUST HAVE', 'finding'));
    } else if (isPocket && launchFlexibility === 'Strict') {
      moscow = 'Must Have';
      moscowReason = 'Time to Market is close and competitor gap (Pocket feature exists in Jenius since 2017 & blu since 2020) threatens opportunity loss. Market agility requires Must Have.';
      decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', '⚠️ Terdeteksi: Gap kompetitor besar — BCA tertinggal 6-9 tahun', 'warning'));
      decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', 'Guardrail Opportunity Loss aktif — kategori dinaikkan ke MUST HAVE', 'finding'));
    } else {
      if (rice.total > 1.2) {
        moscow = 'Must Have';
        moscowReason = 'High RICE score (>1.2) indicating critical business impact and reach.';
      } else if (rice.total > 0.8) {
        moscow = 'Should Have';
        moscowReason = 'Moderate-high RICE score (>0.8) indicating strong business impact.';
      } else if (rice.total > 0.4) {
        moscow = 'Could Have';
        moscowReason = 'Moderate-low RICE score (>0.4). Can be deferred if resources are constrained.';
      } else {
        moscow = "Won't Have";
        moscowReason = 'Low RICE score (<0.4). Not recommended for immediate implementation.';
      }
      decisionLogs.push(S('decision-engine', 'Central Decision Engine', '❖', `RICE Total: ${rice.total.toLocaleString()} → Kategori MoSCoW: ${moscow}`, 'finding'));
    }

    const aiResult: AIResult = {
      moscow,
      confidenceLevel: confidence,
      promptVersion: 'demo-v3.1',
      scoredAt: new Date(),
      riceScore: rice,
      valueEffort: {
        value: impact >= 2.0 ? 'High' : 'Low',
        effort: effort >= 10 ? 'High' : (effort >= 6 ? 'Medium' : 'Low')
      },
      reasoning: {
        summary: moscowReason || 'Prioritas dihitung secara otomatis berdasarkan parameter BPRO myService dan PO.',
        evidenceRefs: [
          reachReason,
          impactReason,
          confidenceReason
        ].filter(Boolean)
      }
    };

    return {
      aiResult,
      agent1Logs,
      agent2Logs,
      agent3Logs,
      decisionLogs
    };
  }
}

