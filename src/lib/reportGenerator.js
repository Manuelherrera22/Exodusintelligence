// src/lib/reportGenerator.js — Generates a printable migration report

/**
 * Opens a styled report in a new window and triggers print (Save as PDF).
 * Zero friction — no login, no registration, instant download.
 */
export function generateReport({ profile, score, destinations, diagnosis, tasks }, lang = 'es') {
  const isEn = lang?.startsWith('en');
  const top3 = destinations?.slice(0, 3) || [];
  const top3Tasks = tasks?.slice(0, 5) || [];
  
  const scoreColor = score >= 70 ? '#34d399' : score >= 45 ? '#fbbf24' : '#f87171';
  const scoreLabel = score >= 70
    ? (isEn ? 'High Readiness' : 'Alta Preparación')
    : score >= 45
      ? (isEn ? 'Moderate Readiness' : 'Preparación Moderada')
      : (isEn ? 'Needs Improvement' : 'Necesita Mejoras');

  const now = new Date();
  const dateStr = now.toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'es'}">
<head>
  <meta charset="UTF-8">
  <title>${isEn ? 'Migration Readiness Report' : 'Informe de Preparación Migratoria'} — Exodus Intelligence</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #0d0b1a;
      color: #e8e4f0;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @media print {
      body { background: white; color: #1e1b4b; }
      .page { box-shadow: none; max-width: 100%; }
      .no-print { display: none !important; }
      .score-ring { border-color: ${scoreColor} !important; }
      .section { border-color: #e5e7eb !important; background: #f9fafb !important; }
      .task-item { background: #f3f4f6 !important; border-color: #e5e7eb !important; }
      .header-gradient { background: linear-gradient(135deg, #7c3aed, #06b6d4) !important; }
    }
    
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }

    .header-gradient {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      padding: 48px 40px;
      position: relative;
      overflow: hidden;
    }

    .header-gradient::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }

    .header-gradient h1 {
      font-size: 28px;
      font-weight: 800;
      color: white;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }

    .header-gradient .subtitle {
      font-size: 14px;
      color: rgba(255,255,255,0.7);
    }

    .header-gradient .date {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      margin-top: 8px;
    }

    .header-gradient .logo {
      position: absolute;
      top: 24px;
      right: 40px;
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .content { padding: 40px; }

    /* Score Section */
    .score-section {
      display: flex;
      align-items: center;
      gap: 32px;
      margin-bottom: 40px;
      padding: 32px;
      background: rgba(139,92,246,0.06);
      border-radius: 20px;
      border: 1px solid rgba(139,92,246,0.12);
    }

    .score-ring {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 6px solid ${scoreColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .score-ring .number {
      font-size: 42px;
      font-weight: 800;
      color: ${scoreColor};
      line-height: 1;
    }

    .score-ring .label {
      font-size: 9px;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 4px;
    }

    .score-info h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
      color: ${scoreColor};
    }

    .score-info p {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      line-height: 1.5;
    }

    .section {
      margin-bottom: 28px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(139,92,246,0.7);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Destinations */
    .destination {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 8px;
      border-radius: 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .destination .medal { font-size: 20px; }
    .destination .name { font-weight: 600; font-size: 14px; flex: 1; }
    .destination .program { font-size: 11px; color: rgba(255,255,255,0.35); }
    .destination .score-badge {
      font-size: 14px;
      font-weight: 700;
      color: rgba(139,92,246,0.8);
    }

    /* CRS */
    .crs-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .crs-bar .label {
      font-size: 12px;
      width: 100px;
      color: rgba(255,255,255,0.4);
    }

    .crs-bar .bar {
      flex: 1;
      height: 8px;
      background: rgba(255,255,255,0.06);
      border-radius: 4px;
      overflow: hidden;
    }

    .crs-bar .bar .fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #8b5cf6, #06b6d4);
    }

    .crs-bar .value {
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      width: 50px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* Tasks */
    .task-item {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      margin-bottom: 6px;
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.04);
    }

    .task-number {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid rgba(139,92,246,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: rgba(139,92,246,0.6);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .task-title { font-size: 13px; font-weight: 500; }
    .task-meta { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; }

    /* Footer */
    .footer {
      padding: 24px 40px;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer .brand {
      font-size: 11px;
      color: rgba(255,255,255,0.2);
      letter-spacing: 1px;
    }

    .footer .disclaimer {
      font-size: 9px;
      color: rgba(255,255,255,0.15);
      max-width: 400px;
      text-align: right;
    }

    .download-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(13,11,26,0.95);
      backdrop-filter: blur(20px);
      padding: 16px 40px;
      display: flex;
      justify-content: center;
      gap: 12px;
      border-top: 1px solid rgba(139,92,246,0.15);
      z-index: 100;
    }

    .btn-download {
      padding: 12px 32px;
      border-radius: 12px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      color: white;
      box-shadow: 0 0 25px rgba(139,92,246,0.3);
    }

    .btn-primary:hover { box-shadow: 0 0 40px rgba(139,92,246,0.5); }

    @media print {
      .score-section { background: #f5f3ff; border-color: #e9d5ff; }
      .score-ring .label { color: #9ca3af; }
      .score-info p { color: #6b7280; }
      .section-title { color: #7c3aed; }
      .destination { background: #f9fafb; border-color: #e5e7eb; }
      .destination .program { color: #9ca3af; }
      .destination .score-badge { color: #7c3aed; }
      .crs-bar .label { color: #6b7280; }
      .crs-bar .value { color: #6b7280; }
      .task-title { color: #1e1b4b; }
      .task-meta { color: #9ca3af; }
      .footer .brand { color: #9ca3af; }
      .footer .disclaimer { color: #d1d5db; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header-gradient">
      <div class="logo">Exodus Intelligence</div>
      <h1>${isEn ? 'Migration Readiness Report' : 'Informe de Preparación Migratoria'}</h1>
      <div class="subtitle">${isEn ? 'Personalized AI Analysis by KAI Coach' : 'Análisis Personalizado con IA por KAI Coach'}</div>
      <div class="date">${dateStr}</div>
    </div>

    <div class="content">
      <!-- Score -->
      <div class="score-section">
        <div class="score-ring">
          <div class="number">${score}</div>
          <div class="label">${isEn ? 'of 100' : 'de 100'}</div>
        </div>
        <div class="score-info">
          <h2>${scoreLabel}</h2>
          <p>${diagnosis?.summary || ''}</p>
        </div>
      </div>

      ${diagnosis?.crs ? `
      <!-- CRS Breakdown -->
      <div class="section">
        <div class="section-title">📊 CRS ${isEn ? 'Canada' : 'Canadá'} — ${diagnosis.crs.total}/600</div>
        ${[
          { label: isEn ? 'Age' : 'Edad', val: diagnosis.crs.age, max: 110 },
          { label: isEn ? 'Education' : 'Educación', val: diagnosis.crs.education, max: 150 },
          { label: isEn ? 'Language' : 'Idioma', val: diagnosis.crs.language, max: 136 },
          { label: isEn ? 'Experience' : 'Experiencia', val: diagnosis.crs.experience, max: 80 },
          { label: 'Transferability', val: diagnosis.crs.transferability, max: 50 },
        ].map(item => `
          <div class="crs-bar">
            <span class="label">${item.label}</span>
            <div class="bar"><div class="fill" style="width:${Math.round(item.val/item.max*100)}%"></div></div>
            <span class="value">${item.val}/${item.max}</span>
          </div>
        `).join('')}
        ${diagnosis.crsGap > 0 ? `<p style="font-size:11px;color:#fbbf24;margin-top:12px;">⚠️ ${isEn ? `${diagnosis.crsGap} points needed for Express Entry cutoff (520)` : `Faltan ${diagnosis.crsGap} puntos para el corte de Express Entry (520)`}</p>` : ''}
      </div>
      ` : ''}

      <!-- Top Destinations -->
      <div class="section">
        <div class="section-title">🎯 ${isEn ? 'Best Destinations For You' : 'Mejores Destinos Para Ti'}</div>
        ${top3.map((d, i) => `
          <div class="destination">
            <span class="medal">${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
            <div style="flex:1">
              <div class="name">${d.country}</div>
              <div class="program">${d.bestProgram?.name || ''}</div>
            </div>
            <span class="score-badge">${d.score}%</span>
          </div>
        `).join('')}
      </div>

      <!-- Action Plan -->
      <div class="section">
        <div class="section-title">✅ ${isEn ? 'Your Personalized Action Plan' : 'Tu Plan de Acción Personalizado'}</div>
        ${top3Tasks.map((task, i) => `
          <div class="task-item">
            <div class="task-number">${i + 1}</div>
            <div>
              <div class="task-title">${task.title}</div>
              <div class="task-meta">${task.duration || ''} · +${task.points || 0} pts</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Profile Summary -->
      <div class="section">
        <div class="section-title">👤 ${isEn ? 'Profile Summary' : 'Resumen del Perfil'}</div>
        <table style="width:100%;font-size:13px;">
          ${[
            [isEn ? 'Country' : 'País', profile?.country || '—'],
            [isEn ? 'Age' : 'Edad', profile?.age || '—'],
            [isEn ? 'Education' : 'Educación', profile?.education || '—'],
            [isEn ? 'Field' : 'Área', profile?.field || '—'],
            [isEn ? 'English Level' : 'Nivel de Inglés', profile?.englishLevel || '—'],
            [isEn ? 'Work Experience' : 'Experiencia', profile?.workYears ? (profile.workYears + (isEn ? ' years' : ' años')) : '—'],
          ].map(([label, value]) => `
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.35);width:150px;">${label}</td>
              <td style="padding:6px 0;font-weight:500;">${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>

    <div class="footer">
      <div class="brand">EXODUS INTELLIGENCE · KAI COACH</div>
      <div class="disclaimer">${isEn
        ? 'This report is an AI-generated preliminary analysis. It does not constitute legal advice. Consult a certified immigration attorney for your specific case.'
        : 'Este informe es un análisis preliminar generado por IA. No constituye asesoría legal. Consulte a un abogado de inmigración certificado para su caso específico.'
      }</div>
    </div>
  </div>

  <div class="download-bar no-print">
    <button class="btn-download btn-primary" onclick="window.print()">
      📄 ${isEn ? 'Save as PDF' : 'Guardar como PDF'}
    </button>
  </div>
</body>
</html>`;

  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(html);
    reportWindow.document.close();
  }
}
