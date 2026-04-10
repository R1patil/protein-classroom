const viewerElement = document.getElementById('viewer');
const viewerTitle = document.getElementById('viewerTitle');
const viewerSubtitle = document.getElementById('viewerSubtitle');
const viewerFocus = document.getElementById('viewerFocus');
const briefTitle = document.getElementById('briefTitle');
const briefContent = document.getElementById('briefContent');
const promptOutput = document.getElementById('promptOutput');
const jsonOutput = document.getElementById('jsonOutput');
const proteinNameInput = document.getElementById('proteinName');
const proteinAccessionInput = document.getElementById('proteinAccession');
const statusElement = document.getElementById('status');
const entryLink = document.getElementById('entryLink');
const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.tab-panel')];
const presetButtons = [...document.querySelectorAll('.preset-chip')];
const form = document.getElementById('proteinForm');
const resetViewBtn = document.getElementById('resetViewBtn');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const loadDemoBtn = document.getElementById('loadDemoBtn');

const ALPHAFOLD_MODEL_VERSIONS = [6, 5, 4];

function alphaFoldModelUrlCandidates(accession) {
  const normalized = accession.toUpperCase();
  return ALPHAFOLD_MODEL_VERSIONS.map(
    (version) => `https://alphafold.ebi.ac.uk/files/AF-${normalized}-F1-model_v${version}.pdb`
  );
}

const alphaFoldEntryUrl = (accession) =>
  `https://alphafold.ebi.ac.uk/entry/${accession.toUpperCase()}`;

const PROTEIN_LIBRARY = {
  insulin: {
    id: 'insulin',
    name: 'Human Insulin',
    accession: 'P01308',
    subtitle: 'Endocrine signal that lowers plasma glucose and coordinates anabolic metabolism.',
    focusLabel: 'Disulfide-stabilized receptor-binding surface',
    focusNote:
      'Focus: the compact disulfide-linked fold keeps insulin in the shape needed for receptor docking.',
    viewerNote:
      'AlphaFold displays the insulin precursor, which is still useful for discussing disulfide-driven folding and hormone maturation.',
    medicalContext: {
      significance:
        'Insulin is the principal anabolic hormone released by pancreatic beta cells. It promotes glucose uptake, glycogen synthesis, lipid storage, and suppression of ketogenesis, so it anchors both physiology teaching and bedside management of hyperglycemia and hypoglycemia.',
      diseases: [
        'Type 1 diabetes mellitus',
        'Type 2 diabetes mellitus with relative insulin deficiency and resistance',
        'Gestational diabetes mellitus'
      ]
    },
    ayurvedicConnection: {
      explanation:
        'Insulin-mediated handling of post-prandial nutrients can be interpreted through the lens of Jatharagni and Dhatvagni, especially in the nourishment of Rasa, Mamsa, and Meda Dhatus. When glucose handling is inefficient, the picture resembles Agnimandya with Kapha-Meda predominance and later Vata involvement, a teaching bridge often used while discussing Madhumeha.',
      herbs: [
        'Guduchi (Tinospora cordifolia)',
        'Meshashringi / Gurmar (Gymnema sylvestre)'
      ]
    },
    structureFunctionLink: {
      region: 'The receptor-facing surface formed by the folded A and B chains',
      explanation:
        'At this surface, insulin docks onto the extracellular insulin receptor. The disulfide bonds hold the hormone in a compact 3D arrangement; if that fold becomes unstable, receptor affinity drops and downstream PI3K-Akt signaling becomes less effective.'
    },
    quiz: [
      {
        question:
          'Which structural feature is most important for preserving insulin in a receptor-binding conformation?',
        options: [
          'Glycosylation of the signal peptide',
          'Disulfide bonds linking the folded chains',
          'A heme pocket in the core',
          'A transmembrane alpha helix'
        ],
        answer: 'Disulfide bonds linking the folded chains',
        explanation:
          'Insulin depends on disulfide-stabilized folding to maintain the receptor-binding geometry required for signaling.'
      },
      {
        question:
          'A major acute clinical consequence of profound insulin deficiency is:',
        options: [
          'Respiratory alkalosis from hyperventilation alone',
          'Diabetic ketoacidosis with unchecked lipolysis',
          'Macrocytic anemia from folate trapping',
          'Nephrotic syndrome from albumin loss'
        ],
        answer: 'Diabetic ketoacidosis with unchecked lipolysis',
        explanation:
          'Without insulin, adipose lipolysis and hepatic ketogenesis accelerate, creating the metabolic emergency of DKA.'
      }
    ]
  },
  hemoglobin: {
    id: 'hemoglobin',
    name: 'Hemoglobin Beta',
    accession: 'P68871',
    subtitle: 'Oxygen-carrying globin chain with a heme pocket central to gas transport.',
    focusLabel: 'Heme pocket around the iron-coordinating histidines',
    focusNote:
      'Focus: residues around the heme pocket control oxygen binding, release, and the stability of the deoxygenated state.',
    viewerNote:
      'This AlphaFold model shows the beta chain alone, which is still excellent for teaching the heme pocket and disease-causing residue changes.',
    highlightResidues: '63,92',
    medicalContext: {
      significance:
        'The beta-globin chain helps hemoglobin transport oxygen, buffer carbon dioxide, and support acid-base balance. In MBBS teaching it bridges molecular genetics, hematology, cyanosis, tissue hypoxia, and transfusion medicine.',
      diseases: [
        'Sickle cell disease',
        'Beta-thalassemia',
        'Unstable hemoglobinopathies'
      ]
    },
    ayurvedicConnection: {
      explanation:
        'Its role aligns most naturally with Rakta Dhatu, Prana Vata, and the heat-transforming aspects of Pitta because it enables oxygen delivery and vitality in tissues. Disturbance in effective oxygen carriage can be discussed as impaired Rakta quality and reduced support to Dhatu poshana, while always noting that this is an interpretive bridge rather than a one-to-one molecular equivalence.',
      herbs: [
        'Amalaki (Emblica officinalis)',
        'Punarnava (Boerhavia diffusa)'
      ]
    },
    structureFunctionLink: {
      region: 'The heme pocket near proximal His92 and distal His63',
      explanation:
        'Inside this pocket, the heme iron is coordinated by the proximal histidine and stabilized for reversible oxygen handling by the distal histidine environment. Small structural disturbances here can alter oxygen affinity, redox behavior, or overall hemoglobin stability.'
    },
    quiz: [
      {
        question: 'Which part of beta-globin directly enables reversible oxygen carriage?',
        options: [
          'The N-terminal signal peptide',
          'The heme-binding pocket',
          'A catalytic serine active site',
          'A collagen-like triple helix'
        ],
        answer: 'The heme-binding pocket',
        explanation:
          'The heme pocket holds the iron atom that binds oxygen reversibly during pulmonary loading and tissue unloading.'
      },
      {
        question:
          'Which disease is classically caused by a pathogenic change in the beta-globin chain sequence?',
        options: [
          'Sickle cell disease',
          'Myasthenia gravis',
          'Acute pancreatitis',
          'Nephrogenic diabetes insipidus'
        ],
        answer: 'Sickle cell disease',
        explanation:
          'Sickle cell disease arises from a beta-globin mutation that changes hemoglobin behavior in the deoxygenated state.'
      }
    ]
  },
  albumin: {
    id: 'albumin',
    name: 'Human Serum Albumin',
    accession: 'P02768',
    subtitle: 'Major plasma carrier protein governing oncotic pressure and drug distribution.',
    focusLabel: 'Ligand-binding cleft in subdomain IIA',
    focusNote:
      'Focus: the Sudlow site I region helps explain why albumin is so important in pharmacology and plasma protein binding.',
    viewerNote:
      'Albumin is a strong teaching protein for volume physiology, edema, and drug-binding concepts that appear repeatedly in clinical pharmacology.',
    highlightResidues: '193-248',
    medicalContext: {
      significance:
        'Albumin is the dominant plasma protein responsible for colloid oncotic pressure and for carrying bilirubin, fatty acids, hormones, and many drugs. It is central to discussions on edema, liver failure, nephrotic syndrome, critical illness, and altered drug pharmacokinetics.',
      diseases: [
        'Hypoalbuminemia in chronic liver disease',
        'Nephrotic syndrome with urinary protein loss',
        'Congenital analbuminemia'
      ]
    },
    ayurvedicConnection: {
      explanation:
        'Albumin can be used as a teaching bridge for Rasa Dhatu stability, fluid distribution, and the containment of Jala Mahabhuta within the vascular compartment. Reduced albumin, with leakage of fluid into tissues, fits well with classroom discussions of Kapha-fluid imbalance and impaired Dhatu nourishment, while still respecting that Ayurveda and plasma biochemistry operate in different explanatory systems.',
      herbs: [
        'Punarnava (Boerhavia diffusa)',
        'Gokshura (Tribulus terrestris)'
      ]
    },
    structureFunctionLink: {
      region: 'Sudlow site I in subdomain IIA',
      explanation:
        'This pocket binds bulky endogenous ligands and several acidic drugs, including classic pharmacology examples such as warfarin. When the pocket is occupied or albumin concentration falls, the free fraction of highly bound drugs can rise and clinical effects may intensify.'
    },
    quiz: [
      {
        question:
          'The most clinically important physiological contribution of albumin to plasma is:',
        options: [
          'Initiating coagulation through thrombin cleavage',
          'Generating ATP by oxidative phosphorylation',
          'Maintaining oncotic pressure and carrying ligands',
          'Synthesizing bile acids inside hepatocytes'
        ],
        answer: 'Maintaining oncotic pressure and carrying ligands',
        explanation:
          'Albumin helps keep fluid intravascular and also transports many drugs and endogenous molecules.'
      },
      {
        question:
          'Why does a drug with high albumin binding become clinically more potent when albumin falls sharply?',
        options: [
          'Its hepatic metabolism stops completely',
          'Its free circulating fraction increases',
          'It can no longer cross membranes at all',
          'It is converted into insulin'
        ],
        answer: 'Its free circulating fraction increases',
        explanation:
          'Less albumin means less binding capacity, so a larger free fraction can be pharmacologically active.'
      }
    ]
  }
};

let viewer;
let currentProtein = PROTEIN_LIBRARY.insulin;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setStatus(message, tone = 'normal') {
  statusElement.textContent = message;
  statusElement.style.color = tone === 'error' ? '#ffb0a7' : 'var(--muted)';
}

function formatBriefForJson(protein) {
  return {
    proteinName: protein.name,
    accession: protein.accession,
    medicalContextMbbs: {
      clinicalSignificance: protein.medicalContext.significance,
      commonAssociatedDiseases: protein.medicalContext.diseases
    },
    ayurvedicConnectionBams: {
      interpretation: protein.ayurvedicConnection.explanation,
      suggestedHerbs: protein.ayurvedicConnection.herbs
    },
    structureFunctionLink: {
      hotspot: protein.structureFunctionLink.region,
      explanation: protein.structureFunctionLink.explanation
    },
    studentQuiz: protein.quiz.map((item, index) => ({
      id: index + 1,
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation
    }))
  };
}

function createPrompt(protein) {
  return `Role: You are an expert Medical Educator specializing in Biochemistry and Pharmacology. I am building a 3D protein visualization app for MBBS and BAMS students using AlphaFold data.

Task: Please create a detailed "Educational Brief" for the protein: ${protein.name} (UniProt accession: ${protein.accession}).

Please provide the information in the following JSON-style sections:

1. Medical Context (MBBS)
- Explain the clinical significance of this protein.
- List 3 common diseases associated with its malfunction or dysregulation.

2. Ayurvedic Connection (BAMS)
- Relate this protein's function to Ayurvedic concepts such as Agni, Dhatus, or Doshas.
- If the link is interpretive rather than experimentally proven, say so clearly.
- Suggest 1-2 medicinal herbs traditionally discussed in relation to this biological pathway.

3. Structure-Function Link
- Describe one specific part of the protein's 3D shape, such as an active site, binding pocket, or structural hotspot.
- Explain what happens at that exact spot and why it matters clinically.

4. Student Quiz
- Provide 2 multiple-choice questions that a medical student should be able to answer after viewing this 3D model.
- Include the correct answer and a one-sentence explanation for each question.

Tone: Academic yet encouraging. Use standard medical terminology but explain complex concepts clearly.

How I will use this in the app:
- I will place the output beside a live AlphaFold 3D viewer.
- Keep the response concise enough for a sidebar, but rich enough for medical teaching.
- Return valid JSON-style content with clear keys and no filler text.`;
}

function buildFallbackProtein(name, accession) {
  const safeName = name || 'Selected Protein';
  const safeAccession = accession || 'UNSPECIFIED';

  return {
    id: 'custom',
    name: safeName,
    accession: safeAccession.toUpperCase(),
    subtitle:
      'Custom AlphaFold model loaded. Use the prompt lab to generate a protein-specific teaching brief for production use.',
    focusLabel: 'Pick the main structural hotspot from annotations or literature',
    focusNote:
      'Focus: inspect major pockets, catalytic grooves, flexible loops, or disulfide-rich regions and map the most teachable hotspot.',
    viewerNote:
      'No local teaching brief exists for this protein yet, so the app is showing a scaffold and a ready-to-copy prompt.',
    medicalContext: {
      significance:
        `${safeName} has been loaded successfully, but this project does not yet ship a curated MBBS teaching brief for this protein. Use the Prompt Lab tab to generate one, then paste the returned content into your production sidebar.`,
      diseases: [
        `Identify three clinically relevant disorders linked to ${safeName} or its pathway.`,
        'Confirm whether dysfunction is caused by mutation, deficiency, overactivity, or dysregulated signaling.',
        'Prefer diseases that are common enough to be meaningful for MBBS teaching.'
      ]
    },
    ayurvedicConnection: {
      explanation:
        `Map ${safeName} to Ayurvedic teaching concepts only after verifying the dominant physiology involved, such as digestion, transport, tissue nourishment, inflammation, or detoxification. Mark the bridge as interpretive when there is no direct experimental correlation.`,
      herbs: [
        'Choose herbs only after pathway review',
        'Document the evidence level before classroom use'
      ]
    },
    structureFunctionLink: {
      region: 'Most relevant active site, pocket, or conformational hinge',
      explanation:
        'Use AlphaFold plus reference annotations to select the single 3D hotspot most worth pointing out to students, then describe what happens at that exact spot.'
    },
    quiz: [
      {
        question: `Which region of ${safeName} appears most likely to control function when viewed in 3D?`,
        options: [
          'Its most annotated pocket or catalytic cleft',
          'Any random surface loop',
          'Only the N-terminus regardless of annotations',
          'The darkest part of the background'
        ],
        answer: 'Its most annotated pocket or catalytic cleft',
        explanation:
          'When building a teaching brief, the highest-yield hotspot is usually the best-annotated functional pocket or conformational control region.'
      },
      {
        question:
          'What is the next best step after loading a custom protein without a local brief?',
        options: [
          'Assume any disease association is acceptable',
          'Use the Prompt Lab to generate a protein-specific educational brief',
          'Ignore the molecular function entirely',
          'Replace the accession with albumin'
        ],
        answer: 'Use the Prompt Lab to generate a protein-specific educational brief',
        explanation:
          'The built-in prompt is there to create safe, structured educational content for proteins outside the curated starter set.'
      }
    ]
  };
}

function renderBrief(protein) {
  const diseaseItems = protein.medicalContext.diseases
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const herbItems = protein.ayurvedicConnection.herbs
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const quizItems = protein.quiz
    .map(
      (item, index) => `
        <article class="quiz-item">
          <p><strong>Q${index + 1}.</strong> ${escapeHtml(item.question)}</p>
          <div class="quiz-options">
            ${item.options
              .map((option, optionIndex) => {
                const label = String.fromCharCode(65 + optionIndex);
                return `<span>${label}. ${escapeHtml(option)}</span>`;
              })
              .join('')}
          </div>
          <details>
            <summary class="quiz-answer">Show answer</summary>
            <p><strong>Answer:</strong> ${escapeHtml(item.answer)}</p>
            <p>${escapeHtml(item.explanation)}</p>
          </details>
        </article>
      `
    )
    .join('');

  briefTitle.textContent = protein.name;
  briefContent.innerHTML = `
    <section class="section-card">
      <div class="json-badge">"medicalContextMbbs"</div>
      <h3>Medical Context (MBBS)</h3>
      <p>${escapeHtml(protein.medicalContext.significance)}</p>
      <ul>${diseaseItems}</ul>
    </section>

    <section class="section-card">
      <div class="json-badge">"ayurvedicConnectionBams"</div>
      <h3>Ayurvedic Connection (BAMS)</h3>
      <p>${escapeHtml(protein.ayurvedicConnection.explanation)}</p>
      <ul>${herbItems}</ul>
    </section>

    <section class="section-card">
      <div class="json-badge">"structureFunctionLink"</div>
      <h3>Structure-Function Link</h3>
      <p><strong>3D hotspot:</strong> ${escapeHtml(protein.structureFunctionLink.region)}</p>
      <p>${escapeHtml(protein.structureFunctionLink.explanation)}</p>
    </section>

    <section class="section-card">
      <div class="json-badge">"studentQuiz"</div>
      <h3>Student Quiz</h3>
      ${quizItems}
    </section>
  `;
}

function renderPrompt(protein) {
  promptOutput.value = createPrompt(protein);
}

function renderJson(protein) {
  jsonOutput.textContent = JSON.stringify(formatBriefForJson(protein), null, 2);
}

function syncHeader(protein) {
  viewerTitle.textContent = protein.name;
  viewerSubtitle.textContent = protein.subtitle;
  viewerFocus.textContent = protein.focusNote;
  proteinNameInput.value = protein.name;
  proteinAccessionInput.value = protein.accession;
  entryLink.href = alphaFoldEntryUrl(protein.accession);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (error) {
    setStatus('Clipboard access was blocked by the browser.', 'error');
  }
}

function setActivePreset(id) {
  presetButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.preset === id);
  });
}

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === tabName);
  });
}

function normalizeResidueSelection(selection) {
  if (!selection) {
    return undefined;
  }

  if (Array.isArray(selection)) {
    return selection;
  }

  if (selection.includes('-')) {
    const [start, end] = selection.split('-').map((value) => Number(value.trim()));
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  return selection.split(',').map((value) => Number(value.trim()));
}

function initialiseViewer() {
  if (!window.$3Dmol) {
    throw new Error('3Dmol.js did not load.');
  }

  viewer = window.$3Dmol.createViewer(viewerElement, {
    backgroundColor: '#07121e'
  });
}

function applyModelStyle(protein) {
  const residueSelection = normalizeResidueSelection(protein.highlightResidues);

  viewer.setStyle(
    {},
    {
      cartoon: {
        colorscheme: {
          prop: 'b',
          gradient: 'roygb',
          min: 50,
          max: 100
        }
      }
    }
  );

  if (residueSelection) {
    viewer.addStyle(
      { resi: residueSelection },
      {
        stick: {
          radius: 0.2,
          color: '#ffc869'
        }
      }
    );
    viewer.addStyle(
      { resi: residueSelection },
      {
        sphere: {
          scale: 0.26,
          color: '#61d0c8'
        }
      }
    );
  }
}

async function loadModel(protein) {
  setStatus(`Loading ${protein.name} from AlphaFold DB...`);

  const candidates = alphaFoldModelUrlCandidates(protein.accession);
  let pdbText;
  let resolvedUrl;
  let lastError = '';

  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        lastError = `HTTP ${response.status} when fetching ${url}`;
        continue;
      }

      pdbText = await response.text();
      resolvedUrl = url;
      break;
    } catch (error) {
      lastError = error && error.message ? error.message : String(error);
    }
  }

  if (!pdbText) {
    throw new Error(
      `Could not fetch an AlphaFold model for accession ${protein.accession}. ${lastError}`
    );
  }

  viewer.clear();
  viewer.addModel(pdbText, 'pdb');
  applyModelStyle(protein);
  viewer.zoomTo();
  viewer.render();

  if (!resolvedUrl) {
    return { resolvedUrl: undefined, resolvedVersion: undefined };
  }

  const versionMatch = resolvedUrl.match(/model_v(\d+)\.pdb$/);
  const resolvedVersion = versionMatch ? versionMatch[1] : undefined;
  return { resolvedUrl, resolvedVersion };
}

async function activateProtein(protein) {
  currentProtein = protein;
  syncHeader(protein);
  renderBrief(protein);
  renderPrompt(protein);
  renderJson(protein);

  if (!viewer) {
    setActivePreset(protein.id in PROTEIN_LIBRARY ? protein.id : 'custom');
    setStatus('Teaching brief updated, but the 3D viewer is unavailable until the viewer library loads.', 'error');
    return;
  }

  try {
    const { resolvedVersion } = await loadModel(protein);
    setActivePreset(protein.id in PROTEIN_LIBRARY ? protein.id : 'custom');
    const versionNote = resolvedVersion ? ` (AlphaFold model v${resolvedVersion})` : '';
    setStatus(`${protein.name}${versionNote} loaded. ${protein.viewerNote}`);
  } catch (error) {
    viewer.clear();
    viewer.render();
    setActivePreset(protein.id in PROTEIN_LIBRARY ? protein.id : 'custom');
    setStatus(
      `${protein.name} brief is ready, but the AlphaFold model could not be fetched. Check the accession and internet connection.`,
      'error'
    );
  }
}

function resolveProtein(name, accession) {
  const trimmedName = name.trim();
  const trimmedAccession = accession.trim();
  const normalizedName = trimmedName.toLowerCase();
  const normalizedAccession = trimmedAccession.toUpperCase();

  if (!trimmedName && !trimmedAccession) {
    return currentProtein;
  }

  const preset = Object.values(PROTEIN_LIBRARY).find(
    (protein) =>
      protein.accession === normalizedAccession ||
      protein.name.toLowerCase() === normalizedName
  );

  if (preset) {
    return preset;
  }

  return buildFallbackProtein(trimmedName || `Protein ${normalizedAccession || 'Preview'}`, normalizedAccession || currentProtein.accession);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    setActiveTab(tab.dataset.tab);
  });
});

presetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const protein = PROTEIN_LIBRARY[button.dataset.preset];
    activateProtein(protein);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const protein = resolveProtein(proteinNameInput.value, proteinAccessionInput.value);
  activateProtein(protein);
});

resetViewBtn.addEventListener('click', () => {
  if (!viewer) {
    return;
  }

  viewer.zoomTo();
  viewer.render();
});

copyPromptBtn.addEventListener('click', () => {
  copyText(promptOutput.value, 'Prompt copied to clipboard.');
});

copyJsonBtn.addEventListener('click', () => {
  copyText(jsonOutput.textContent, 'JSON copied to clipboard.');
});

loadDemoBtn.addEventListener('click', () => {
  setActiveTab('brief');
  activateProtein(PROTEIN_LIBRARY.hemoglobin);
});

function boot() {
  syncHeader(currentProtein);
  renderBrief(currentProtein);
  renderPrompt(currentProtein);
  renderJson(currentProtein);

  try {
    initialiseViewer();
    activateProtein(currentProtein);
  } catch (error) {
    setStatus('The 3D viewer library did not initialize. Refresh the page after checking internet access.', 'error');
  }
}

boot();
