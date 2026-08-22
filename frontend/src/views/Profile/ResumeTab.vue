<template>
  <div class="resume-tab-content">
    <div class="cards-grid">
      <!-- Resume Document & Actions Card -->
      <div class="section-card full-width document-card">
        <div class="doc-left">
          <div class="doc-icon">📑</div>
          <div>
            <h3 class="doc-title">Curriculum Vitae / Resume</h3>
            <p class="doc-meta">
              <span>{{ resumeFileName }}</span> • <span>PDF Format (2.4 MB)</span> • <span class="updated-tag">Updated Recently</span>
            </p>
          </div>
        </div>

        <div class="doc-actions">
          <!-- Hidden file input for upload -->
          <input 
            type="file" 
            ref="fileInputRef" 
            accept=".pdf,.doc,.docx" 
            style="display: none" 
            @change="handleFileUpload" 
          />
          
          <button class="btn-action outline" @click="triggerUpload">
            📤 Upload New Resume
          </button>
          <button class="btn-action preview-btn" @click="showPreview = true">
            👁️ Preview Resume
          </button>
          <button class="btn-action primary" @click="downloadResume">
            📥 Download PDF
          </button>
        </div>
      </div>

      <!-- Professional Summary -->
      <div class="section-card full-width">
        <div class="card-header">
          <h3>Professional Summary</h3>
        </div>
        <p class="summary-text">
          Results-driven Software Engineer with 4+ years of expertise in architecting scalable web applications, RESTful microservices, and reactive user interfaces. Proven track record in improving system reliability, optimizing cloud infrastructure, and mentoring cross-functional product teams in Agile environments.
        </p>
      </div>

      <!-- Skills & Expertise -->
      <div class="section-card">
        <div class="card-header">
          <h3>Skills & Competencies</h3>
        </div>
        <div class="skills-wrap">
          <span v-for="skill in skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Education & Certifications -->
      <div class="section-card">
        <div class="card-header">
          <h3>Education & Certifications</h3>
        </div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>B.Tech in Computer Science & Engineering</h4>
              <p class="institution">Indian Institute of Technology (IIT) • 2016 - 2020</p>
              <p class="grade">First Class with Distinction (8.9 CGPA)</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>AWS Certified Solutions Architect</h4>
              <p class="institution">Amazon Web Services • Issued 2023</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Experience -->
      <div class="section-card full-width">
        <div class="card-header">
          <h3>Work Experience</h3>
        </div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot active"></div>
            <div class="timeline-content">
              <div class="role-header">
                <h4>Senior Software Engineer</h4>
                <span class="period">2023 - Present (Current)</span>
              </div>
              <p class="company-name">{{ employee.companyName || 'Dayflow Global' }} • Full-time</p>
              <ul class="duties-list">
                <li>Spearheaded core architectural redesign resulting in 40% latency reduction for API endpoints.</li>
                <li>Built real-time payroll and employee management modules serving 1,000+ daily enterprise users.</li>
                <li>Collaborated with product designers to implement responsive, accessible frontend experiences in Vue 3.</li>
              </ul>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="role-header">
                <h4>Software Engineer</h4>
                <span class="period">2020 - 2023</span>
              </div>
              <p class="company-name">Apex Digital Systems • Full-time</p>
              <ul class="duties-list">
                <li>Developed modular frontend features and reusable component libraries.</li>
                <li>Created automated test suites boosting test coverage from 60% to 92%.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resume Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
      <div class="preview-modal">
        <div class="preview-modal-header">
          <h3>Resume Preview: {{ resumeFileName }}</h3>
          <button class="modal-close" @click="showPreview = false">✕</button>
        </div>
        <div class="preview-doc-body">
          <div class="resume-sheet">
            <div class="sheet-header">
              <h2>{{ employee.firstName || 'Jane' }} {{ employee.lastName || 'Doe' }}</h2>
              <p class="sheet-sub">{{ employee.designation || 'Associate' }} | {{ employee.email || 'employee@dayflow.com' }} | {{ employee.phone || '9988776655' }}</p>
            </div>
            <hr class="sheet-divider" />
            <div class="sheet-section">
              <h4>PROFILE SUMMARY</h4>
              <p>Passionate software engineer experienced in building resilient enterprise systems with modern tech stacks, automated testing pipelines, and reactive client dashboards.</p>
            </div>
            <div class="sheet-section">
              <h4>TECHNICAL SKILLS</h4>
              <p>Vue.js, JavaScript (ES6+), Node.js, Express, MongoDB, RESTful APIs, Git, Docker, Modern CSS.</p>
            </div>
            <div class="sheet-section">
              <h4>EXPERIENCE</h4>
              <p><strong>Senior Software Engineer</strong> — {{ employee.companyName || 'Dayflow Global' }} (2023–Present)</p>
              <p>Architected backend microservices and responsive web client applications.</p>
            </div>
            <div class="sheet-section">
              <h4>EDUCATION</h4>
              <p><strong>B.Tech in Computer Science</strong> — Indian Institute of Technology (2016–2020)</p>
            </div>
          </div>
        </div>
        <div class="preview-modal-footer">
          <button class="btn-action primary" @click="downloadResume">📥 Download Resume</button>
          <button class="btn-action outline" @click="showPreview = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  employee: {
    type: Object,
    default: () => ({})
  }
});

const fileInputRef = ref(null);
const resumeFileName = ref(props.employee.firstName ? `${props.employee.firstName}_Resume.pdf` : 'Jane_Doe_Resume.pdf');
const showPreview = ref(false);

const skills = ref([
  'Vue.js (v3 & Composition API)',
  'JavaScript (ES6+)',
  'Node.js & Express',
  'MongoDB & Mongoose',
  'TypeScript',
  'RESTful APIs',
  'Docker & CI/CD',
  'Git & GitHub Workflow',
  'TailwindCSS & Modern UI',
  'Microservices Architecture'
]);

const triggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    resumeFileName.value = file.name;
    alert(`✅ Resume uploaded successfully: "${file.name}"`);
  }
};

const downloadResume = () => {
  const link = document.createElement('a');
  link.href = '#';
  link.setAttribute('download', resumeFileName.value);
  document.body.appendChild(link);
  alert(`📥 Downloading ${resumeFileName.value}...`);
  document.body.removeChild(link);
};
</script>

<style scoped>
.resume-tab-content {
  color: #0f172a;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.full-width {
  grid-column: span 2;
}

.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

/* Document Top Card */
.document-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
}

.doc-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.doc-icon {
  font-size: 2.2rem;
  background: #ffffff;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(107, 33, 168, 0.08);
}

.doc-title {
  font-size: 1.2rem;
  margin: 0 0 0.25rem 0;
  color: #0f172a;
}

.doc-meta {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.updated-tag {
  color: #059669;
  font-weight: 600;
}

.doc-actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-action.primary {
  background-color: #4c1d95;
  color: white;
}
.btn-action.primary:hover {
  background-color: #3b0764;
}

.btn-action.preview-btn {
  background-color: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #d8b4fe;
}
.btn-action.preview-btn:hover {
  background-color: #e9d5ff;
}

.btn-action.outline {
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
}
.btn-action.outline:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
}

.card-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.summary-text {
  color: #334155;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0;
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #e9d5ff;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  padding-left: 1.25rem;
}

.timeline-item {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -1.25rem;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  border: 2px solid #ffffff;
}

.timeline-dot.active {
  background: #7e22ce;
  box-shadow: 0 0 6px rgba(126, 34, 206, 0.4);
}

.timeline-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
  font-weight: 700;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.period {
  font-size: 0.8rem;
  color: #6b21a8;
  background: #f3e8ff;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.company-name, .institution {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.grade {
  color: #059669;
  font-size: 0.85rem;
  margin: 0.25rem 0;
  font-weight: 600;
}

.duties-list {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.5;
}

.duties-list li {
  margin-bottom: 0.35rem;
}

/* Modal Preview Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.preview-modal {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 650px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.preview-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.preview-modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.modal-close {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
}

.preview-doc-body {
  padding: 1.5rem;
  overflow-y: auto;
  background: #f8fafc;
}

.resume-sheet {
  background: #ffffff;
  color: #1e293b;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  font-family: serif;
  border: 1px solid #e2e8f0;
}

.sheet-header h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  color: #0f172a;
}

.sheet-sub {
  color: #475569;
  font-size: 0.85rem;
  margin: 0;
  font-family: sans-serif;
}

.sheet-divider {
  border: none;
  border-top: 2px solid #0f172a;
  margin: 1rem 0;
}

.sheet-section {
  margin-bottom: 1rem;
}

.sheet-section h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  color: #0f172a;
  font-family: sans-serif;
}

.sheet-section p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #334155;
}

.preview-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
