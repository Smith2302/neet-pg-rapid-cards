import { useEffect, useMemo, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.js?url";
import Tesseract from "tesseract.js";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const subjects = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Pharmacology",
  "Microbiology",
  "Forensic Medicine",
  "Community Medicine",
  "ENT",
  "Ophthalmology",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "General Medicine",
  "General Surgery",
  "Orthopedics",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Toxicology",
  "Emergency Medicine",
];

const STORAGE_KEYS = {
  library: "rapidCardsLibrary",
  imports: "rapidCardsRecentImports",
  selectedSubject: "rapidCardsSelectedSubject",
  bookmarks: "rapidCardsBookmarks",
  mistakes: "rapidCardsMistakes",
  progress: "rapidCardsProgress",
};

const FILTER_TAGS = [
  "Antidotes",
  "Drug of Choice",
  "Syndromes",
  "Investigations",
  "One-liners",
  "Images",
  "Emergencies",
];

const REVISION_MODES = [
  { id: "toxicology", label: "Toxicology Rapid 20", predicate: (card) => card.subject === "Toxicology" || card.tags?.includes("Toxicology") },
  { id: "antidotes", label: "Antidotes", predicate: (card) => card.tags?.includes("Antidotes") },
  { id: "emergencies", label: "Emergencies", predicate: (card) => card.tags?.includes("Emergencies") },
  { id: "one-liners", label: "One-liners", predicate: (card) => card.tags?.includes("One-liners") },
  { id: "last-day", label: "Last day revision", predicate: (card) => card.tags?.includes("Rapid Revision") || card.tags?.includes("High Yield") },
];

const seedCardsBySubject = {
  Anatomy: [
    {
      question: "Which nerve supplies the levator palpebrae superioris muscle?",
      answer: "The oculomotor nerve (CN III).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the content of the carpal tunnel?",
      answer: "Flexor digitorum superficialis and profundus tendons, flexor pollicis longus tendon, and median nerve.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vessel forms the anterior cerebral circulation circle?",
      answer: "The anterior communicating artery connects the two anterior cerebral arteries.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the functional role of the transverse processes of vertebrae?",
      answer: "They provide attachment for muscles and ligaments involved in movement and stability.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which nerve is most likely injured in a mid-shaft humeral fracture?",
      answer: "The radial nerve.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Erb's palsy involves?",
      answer: "C5-C6 roots.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Klumpke's palsy involves?",
      answer: "C8-T1 roots.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sciatic nerve from?",
      answer: "L4-S3.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Femoral nerve from?",
      answer: "L2-L4.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Obturator nerve from?",
      answer: "L2-L4.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tibial nerve from?",
      answer: "L4-S3.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Common peroneal nerve from?",
      answer: "L4-S2.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Axillary nerve from?",
      answer: "C5-C6.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Musculocutaneous nerve from?",
      answer: "C5-C7.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Median nerve from?",
      answer: "C6-T1.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Ulnar nerve from?",
      answer: "C8-T1.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Phrenic nerve from?",
      answer: "C3-C5.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Vagus nerve is?",
      answer: "Cranial nerve X.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Facial nerve is?",
      answer: "Cranial nerve VII.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Trigeminal nerve is?",
      answer: "Cranial nerve V.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Optic nerve is?",
      answer: "Cranial nerve II.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Oculomotor nerve is?",
      answer: "Cranial nerve III.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Trochlear nerve is?",
      answer: "Cranial nerve IV.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Abducens nerve is?",
      answer: "Cranial nerve VI.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Accessory nerve is?",
      answer: "Cranial nerve XI.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hypoglossal nerve is?",
      answer: "Cranial nerve XII.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Brachial plexus components?",
      answer: "Roots, trunks, divisions, cords, branches.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Lumbosacral plexus from?",
      answer: "L1-S1.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cervical plexus from?",
      answer: "C1-C4.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sacral plexus from?",
      answer: "L4-S4.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Physiology: [
    {
      question: "What is the primary action of aldosterone on the kidney?",
      answer: "It increases sodium reabsorption and potassium excretion in the distal tubule.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What hormone increases glucose uptake in muscle and adipose tissue?",
      answer: "Insulin.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the Frank-Starling law of the heart?",
      answer: "Stroke volume increases in response to increased venous return and end-diastolic volume.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What change occurs to the oxyhemoglobin dissociation curve in acidosis?",
      answer: "It shifts to the right.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which mechanism causes a drop in blood pressure on standing?",
      answer: "A transient decrease in venous return and cardiac output.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cardiac output formula?",
      answer: "CO = HR × SV.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Stroke volume determinants?",
      answer: "Preload, afterload, contractility.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Frank-Starling law?",
      answer: "Increased preload increases SV.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mean arterial pressure?",
      answer: "MAP = CO × TPR.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "GFR formula?",
      answer: "GFR = Kf × (Pgc - Pbc - πgc + πbc).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tubular reabsorption?",
      answer: "99% of filtrate reabsorbed.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ADH action?",
      answer: "Increases water reabsorption in collecting ducts.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Aldosterone action?",
      answer: "Increases Na reabsorption in distal tubule.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Insulin action?",
      answer: "Increases glucose uptake in muscles and fat.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Glucagon action?",
      answer: "Increases glycogenolysis and gluconeogenesis.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Biochemistry: [
    {
      question: "What is the rate-limiting enzyme in glycolysis?",
      answer: "Phosphofructokinase-1 (PFK-1).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vitamin is required for collagen synthesis?",
      answer: "Vitamin C (ascorbic acid).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the function of glutathione peroxidase?",
      answer: "It reduces hydrogen peroxide and organic peroxides using glutathione.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which amino acid is ketogenic only?",
      answer: "Leucine.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the coenzyme for pyruvate dehydrogenase?",
      answer: "Thiamine pyrophosphate (TPP).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Krebs cycle produces how many ATP?",
      answer: "2 ATP per turn (via substrate-level phosphorylation).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Beta-oxidation occurs in?",
      answer: "Mitochondrial matrix.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "HMG-CoA reductase inhibited by?",
      answer: "Statins.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Glycogen synthase activated by?",
      answer: "Insulin.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "PKU caused by deficiency of?",
      answer: "Phenylalanine hydroxylase.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pathology: [
    {
      question: "What is the most common cause of acute pancreatitis?",
      answer: "Gallstones and alcohol abuse.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which tumor marker is elevated in hepatocellular carcinoma?",
      answer: "Alpha-fetoprotein (AFP).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the characteristic histological feature of rheumatoid arthritis?",
      answer: "Pannus formation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which virus is associated with Burkitt's lymphoma?",
      answer: "Epstein-Barr virus (EBV).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the pathogenesis of acute rheumatic fever?",
      answer: "Molecular mimicry between streptococcal antigens and heart tissue.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Amyloidosis stained by?",
      answer: "Congo red.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Aschoff bodies seen in?",
      answer: "Rheumatic heart disease.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Reed-Sternberg cells in?",
      answer: "Hodgkin's lymphoma.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Psammoma bodies in?",
      answer: "Papillary thyroid carcinoma.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Russell bodies are?",
      answer: "Intracellular immunoglobulin accumulation.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pharmacology: [
    {
      question: "What is the mechanism of action of aspirin?",
      answer: "Irreversible inhibition of cyclooxygenase (COX) enzymes.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which drug is used as an antidote for organophosphate poisoning?",
      answer: "Atropine and pralidoxime.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "What is the first-line treatment for hypertension?",
      answer: "ACE inhibitors or ARBs.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which antibiotic is contraindicated in pregnancy?",
      answer: "Tetracyclines.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the antidote for heparin overdose?",
      answer: "Protamine sulfate.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Warfarin acts by inhibiting?",
      answer: "Vitamin K epoxide reductase.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Morphine side effects?",
      answer: "Respiratory depression, constipation, miosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Digoxin toxicity treated with?",
      answer: "Digoxin-specific Fab fragments.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Beta-blockers contraindicated in?",
      answer: "Asthma and heart block.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Statins side effect?",
      answer: "Myopathy and hepatotoxicity.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Microbiology: [
    {
      question: "Which bacteria causes cholera?",
      answer: "Vibrio cholerae.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for tuberculosis?",
      answer: "RIPE regimen: Rifampicin, Isoniazid, Pyrazinamide, Ethambutol.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which virus causes chickenpox?",
      answer: "Varicella-zoster virus (VZV).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common cause of UTI?",
      answer: "Escherichia coli.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which fungus causes candidiasis?",
      answer: "Candida albicans.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "HIV reverse transcriptase inhibited by?",
      answer: "Nucleoside reverse transcriptase inhibitors (NRTIs).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tetanus caused by?",
      answer: "Clostridium tetani.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Gas gangrene caused by?",
      answer: "Clostridium perfringens.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Leprosy caused by?",
      answer: "Mycobacterium leprae.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Malaria caused by?",
      answer: "Plasmodium species.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Forensic Medicine": [
    {
      question: "What is the postmortem interval estimation based on?",
      answer: "Body temperature, rigor mortis, lividity, and decomposition changes.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which poison causes garlic odor in breath?",
      answer: "Arsenic.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the legal age of consent in India?",
      answer: "18 years.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which injury is characteristic of hanging?",
      answer: "Oblique ligature mark above thyroid cartilage.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for cyanide poisoning?",
      answer: "Hydroxocobalamin or sodium thiosulfate.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Diatoms found in?",
      answer: "Drowning cases.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Chop wound caused by?",
      answer: "Heavy sharp weapon.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Defense wounds seen in?",
      answer: "Homicidal assaults.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rigor mortis starts from?",
      answer: "Jaw muscles.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Community Medicine": [
    {
      question: "What is the incubation period of chickenpox?",
      answer: "10-21 days.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vaccine is given at birth in India?",
      answer: "BCG and OPV.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the normal BMI range?",
      answer: "18.5-24.9 kg/m².",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which disease is eradicated in India?",
      answer: "Smallpox.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the Expanded Program on Immunization (EPI)?",
      answer: "National immunization program providing vaccines to all children.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Oral rehydration solution contains?",
      answer: "Sodium, potassium, glucose, and water.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DPT vaccine protects against?",
      answer: "Diphtheria, pertussis, tetanus.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "MMR vaccine protects against?",
      answer: "Measles, mumps, rubella.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cold chain maintained for?",
      answer: "Vaccine storage.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "General Medicine": [
    {
      question: "What is the most common cause of community-acquired pneumonia?",
      answer: "Streptococcus pneumoniae.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which drug is used for acute myocardial infarction?",
      answer: "Aspirin, heparin, and reperfusion therapy.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the diagnostic criteria for diabetes mellitus?",
      answer: "Fasting blood glucose ≥126 mg/dL or HbA1c ≥6.5%.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which electrolyte imbalance causes tetany?",
      answer: "Hypocalcemia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for pulmonary embolism?",
      answer: "Anticoagulation with heparin followed by warfarin.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Beck's triad in cardiac tamponade?",
      answer: "Hypotension, muffled heart sounds, distended neck veins.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Kussmaul's sign seen in?",
      answer: "Constrictive pericarditis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hamman's sign is?",
      answer: "Mediastinal crunch in pneumomediastinum.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Murphy's sign positive in?",
      answer: "Acute cholecystitis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cullen's sign seen in?",
      answer: "Acute pancreatitis.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "General Surgery": [
    {
      question: "What is the most common cause of acute appendicitis?",
      answer: "Fecalith obstruction.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which hernia has the highest risk of strangulation?",
      answer: "Femoral hernia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for acute cholecystitis?",
      answer: "Cholecystectomy.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vessel is ligated in hemorrhoidectomy?",
      answer: "Superior rectal artery.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common complication of thyroidectomy?",
      answer: "Hypocalcemia due to parathyroid damage.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "McBurney's point is?",
      answer: "Location of maximum tenderness in appendicitis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Carcinoma of gallbladder associated with?",
      answer: "Gallstones.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Intussusception common in?",
      answer: "Children 6-18 months.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Volvulus common site?",
      answer: "Sigmoid colon.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acute mesenteric ischemia due to?",
      answer: "Superior mesenteric artery thrombosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Orthopedics: [
    {
      question: "What is the most common site of osteoporosis fracture?",
      answer: "Vertebral bodies.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which test is used to diagnose anterior cruciate ligament tear?",
      answer: "Lachman test.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for scaphoid fracture?",
      answer: "Cast immobilization for 6-8 weeks.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which bone is most commonly fractured in children?",
      answer: "Clavicle.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the complication of femoral neck fracture?",
      answer: "Avascular necrosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Ottawa ankle rules for?",
      answer: "Ankle radiography.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Garden classification for?",
      answer: "Femoral neck fractures.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Smith's fracture is?",
      answer: "Reverse Colles' fracture.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Monteggia's fracture involves?",
      answer: "Ulna fracture with radial head dislocation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Galeazzi fracture involves?",
      answer: "Radius fracture with distal radioulnar joint dislocation.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pediatrics: [
    {
      question: "What is the most common congenital heart defect?",
      answer: "Ventricular septal defect (VSD).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vaccine is contraindicated in immunocompromised children?",
      answer: "Live vaccines (MMR, varicella, oral polio).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for croup?",
      answer: "Humidified oxygen and dexamethasone.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which condition causes blueberry muffin lesions?",
      answer: "Congenital rubella syndrome.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common cause of neonatal jaundice?",
      answer: "Physiological jaundice.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "APGAR score assesses?",
      answer: "Newborn condition at 1 and 5 minutes.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Kernicterus due to?",
      answer: "Unconjugated bilirubin toxicity.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tetralogy of Fallot components?",
      answer: "VSD, pulmonary stenosis, overriding aorta, right ventricular hypertrophy.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Meconium ileus seen in?",
      answer: "Cystic fibrosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Necrotizing enterocolitis risk factors?",
      answer: "Prematurity and formula feeding.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Obstetrics & Gynecology": [
    {
      question: "What is the normal gestational period?",
      answer: "37-42 weeks.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which hormone maintains pregnancy?",
      answer: "Progesterone.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common cause of postpartum hemorrhage?",
      answer: "Uterine atony.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which condition is characterized by preeclampsia + seizures?",
      answer: "Eclampsia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for ectopic pregnancy?",
      answer: "Methotrexate or surgical removal.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bishop score assesses?",
      answer: "Cervical readiness for induction.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Placenta previa types?",
      answer: "Total, partial, marginal, low-lying.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "HELLP syndrome associated with?",
      answer: "Severe preeclampsia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rh incompatibility leads to?",
      answer: "Hemolytic disease of newborn.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cervical cancer screening?",
      answer: "Pap smear every 3 years.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  ENT: [
    {
      question: "What is the most common cause of conductive hearing loss?",
      answer: "Otitis media.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which nerve is tested in Rinne test?",
      answer: "Auditory nerve function.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for acute otitis media?",
      answer: "Amoxicillin.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which condition causes sensorineural hearing loss?",
      answer: "Meniere's disease.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common nasal polyp?",
      answer: "Antrochoanal polyp.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tympanic membrane perforation causes?",
      answer: "Conductive hearing loss.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Stapedectomy for?",
      answer: "Otosclerosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Facial nerve palsy treatment?",
      answer: "Prednisone and acyclovir.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tonsillectomy indicated for?",
      answer: "Recurrent tonsillitis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Epistaxis common site?",
      answer: "Little's area (Kiesselbach's plexus).",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Ophthalmology: [
    {
      question: "What is the most common cause of blindness worldwide?",
      answer: "Cataract.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which condition causes cupping of optic disc?",
      answer: "Glaucoma.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for bacterial conjunctivitis?",
      answer: "Topical antibiotics.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which vitamin deficiency causes night blindness?",
      answer: "Vitamin A.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common intraocular malignancy?",
      answer: "Uveal melanoma.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Diabetic retinopathy screening?",
      answer: "Annual fundus examination.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Amblyopia treatment?",
      answer: "Patching of good eye.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Retinoblastoma presents as?",
      answer: "White pupillary reflex (cat's eye reflex).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Chalazion vs Hordeolum?",
      answer: "Chalazion: meibomian gland; Hordeolum: eyelash follicle.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Corneal ulcer caused by?",
      answer: "Pseudomonas aeruginosa.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Dermatology: [
    {
      question: "What is the most common skin cancer?",
      answer: "Basal cell carcinoma.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which condition causes silvery scales?",
      answer: "Psoriasis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for acne vulgaris?",
      answer: "Topical retinoids and antibiotics.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which virus causes warts?",
      answer: "Human papillomavirus (HPV).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the most common fungal infection?",
      answer: "Tinea pedis (athlete's foot).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Nikolsky's sign positive in?",
      answer: "Pemphigus vulgaris.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Auspitz sign seen in?",
      answer: "Psoriasis.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Koebner phenomenon in?",
      answer: "Psoriasis and lichen planus.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Vitiligo treatment?",
      answer: "Topical corticosteroids and phototherapy.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acne scarring treated with?",
      answer: "Laser resurfacing.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Psychiatry: [
    {
      question: "First-line medication for Major Depressive Disorder?",
      answer: "SSRIs (Selective Serotonin Reuptake Inhibitors).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line antipsychotic for acute psychosis?",
      answer: "Atypical antipsychotics (risperidone, olanzapine).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DSM-5 criteria for Major Depressive Disorder duration?",
      answer: "Symptoms must be present for at least 2 weeks.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the first-line treatment for Generalized Anxiety Disorder?",
      answer: "SSRIs or SNRIs.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Neuroleptic Malignant Syndrome is associated with?",
      answer: "Antipsychotic use, presenting with fever, rigidity, altered mental status, and elevated CPK.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common type of anxiety disorder?",
      answer: "Generalized Anxiety Disorder (GAD).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bipolar Disorder Type I vs Type II difference?",
      answer: "Type I: at least one manic episode. Type II: hypomanic and depressive episodes only.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line mood stabilizer for Bipolar Disorder?",
      answer: "Lithium.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Lithium therapeutic level?",
      answer: "0.6-1.2 mEq/L.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is SIADH as a side effect of SSRI use?",
      answer: "Syndrome of Inappropriate Antidiuretic Hormone secretion causing hyponatremia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line treatment for Panic Disorder?",
      answer: "SSRIs with cognitive behavioral therapy (CBT).",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the key feature of Obsessive-Compulsive Disorder?",
      answer: "Presence of both obsessions and compulsions causing distress and functional impairment.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tardive Dyskinesia is a side effect of which class of drugs?",
      answer: "First-generation antipsychotics.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Management of Tardive Dyskinesia?",
      answer: "Switch to second-generation antipsychotics or add benztropine.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line treatment for Post-Traumatic Stress Disorder (PTSD)?",
      answer: "SSRIs or SNRIs with trauma-focused CBT.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Radiology: [
    {
      question: "What is the most common chest X-ray finding in pneumonia?",
      answer: "Airspace consolidation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which imaging is best for acute stroke?",
      answer: "CT brain without contrast.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What does MRI stand for?",
      answer: "Magnetic Resonance Imaging.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which contrast is used for CT angiography?",
      answer: "Iodinated contrast.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the radiation dose comparison: CT chest vs CXR?",
      answer: "CT chest = 100-200 CXR doses.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pneumothorax on CXR shows?",
      answer: "Visceral pleural line and absent lung markings.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cardiomegaly on CXR defined as?",
      answer: "Cardiothoracic ratio >0.5.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sail sign seen in?",
      answer: "Left upper lobe collapse.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Ground glass opacity in?",
      answer: "Pulmonary edema, hemorrhage, or early pneumonia.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Honeycombing seen in?",
      answer: "Idiopathic pulmonary fibrosis.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Anesthesiology: [
    {
      question: "What is the MAC of isoflurane?",
      answer: "1.15%.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which drug reverses neuromuscular blockade?",
      answer: "Neostigmine.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the normal ETCO2 range?",
      answer: "35-45 mmHg.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which local anesthetic has the longest duration?",
      answer: "Bupivacaine.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the treatment for malignant hyperthermia?",
      answer: "Dantrolene and cooling.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Succinylcholine contraindicated in?",
      answer: "Burns, trauma, neuromuscular disorders.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "LMA sizes based on?",
      answer: "Patient weight.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rapid sequence induction includes?",
      answer: "Cricoid pressure, succinylcholine, intubation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Post-dural puncture headache treated with?",
      answer: "Epidural blood patch.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ASA classification I is?",
      answer: "Healthy patient.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Toxicology: [
    {
      question: "Antidote for paracetamol overdose?",
      answer: "N-acetylcysteine (NAC).",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for opioid overdose?",
      answer: "Naloxone.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for benzodiazepine overdose?",
      answer: "Flumazenil.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for beta-blocker overdose?",
      answer: "Glucagon.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for calcium channel blocker overdose?",
      answer: "Calcium gluconate and insulin.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for methanol and ethylene glycol?",
      answer: "Fomepizole.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for cyanide poisoning?",
      answer: "Hydroxocobalamin or sodium thiosulfate.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for iron overdose?",
      answer: "Deferoxamine.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for warfarin overdose?",
      answer: "Vitamin K and fresh frozen plasma.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for heparin overdose?",
      answer: "Protamine sulfate.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for lead poisoning?",
      answer: "Dimercaprol (BAL) or EDTA.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for arsenic poisoning?",
      answer: "Dimercaprol (BAL).",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for mercury poisoning?",
      answer: "Dimercaprol (BAL) or succimer.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for organophosphate poisoning?",
      answer: "Atropine and pralidoxime.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for carbamate poisoning?",
      answer: "Atropine.",
      tags: ["Antidotes", "High Yield", "Rapid Revision"],
    },
  ],
  "Emergency Medicine": [
    {
      question: "What is the first step in the ABCDE approach?",
      answer: "Airway assessment.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the immediate treatment for anaphylaxis?",
      answer: "Intramuscular epinephrine.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which burn depth involves full-thickness skin loss?",
      answer: "Third-degree burns.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the primary goal of trauma resuscitation?",
      answer: "Restore airway, breathing, and circulation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Which arrhythmia is treated with immediate defibrillation?",
      answer: "Ventricular fibrillation.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tension pneumothorax treatment?",
      answer: "Needle decompression followed by chest tube.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cardiac arrest algorithm starts with?",
      answer: "CPR and defibrillation if shockable rhythm.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acute coronary syndrome treatment?",
      answer: "Aspirin, nitroglycerin, morphine, oxygen.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Status epilepticus treatment?",
      answer: "Benzodiazepines followed by phenytoin.",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hypovolemic shock treatment?",
      answer: "Fluid resuscitation with crystalloids.",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pathology: [
    {
      question: "Caseous necrosis is seen in which disease?",
      answer: "Tuberculosis.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Reed-Sternberg cells are seen in?",
      answer: "Hodgkin lymphoma.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Amyloid shows which color with Congo red?",
      answer: "Apple-green birefringence under polarized light.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Chronic inflammation is characterized by which cell type?",
      answer: "Macrophages.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Koilocytes are seen in infection by?",
      answer: "Human papillomavirus.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Dysplasia indicates what change?",
      answer: "Disordered cell growth with pleomorphism.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pseudomembrane in diphtheria is due to?",
      answer: "Exotoxin-mediated necrosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bronze diabetes is seen in?",
      answer: "Hemochromatosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Auer rods are seen in?",
      answer: "Acute myeloid leukemia.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Malignant tumor of epithelium is called?",
      answer: "Carcinoma.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common benign breast tumor?",
      answer: "Fibroadenoma.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Oligodendroglioma cells have what appearance?",
      answer: "Fried egg appearance.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Granulomas with giant cells are common in?",
      answer: "Sarcoidosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acute inflammation hallmark?",
      answer: "Neutrophil infiltration.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of hemorrhagic stroke?",
      answer: "Hypertension.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Liquefactive necrosis seen in?",
      answer: "Brain infarction.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Coagulative necrosis seen in?",
      answer: "Myocardial infarction.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Fat necrosis seen in?",
      answer: "Acute pancreatitis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Fibrinoid necrosis seen in?",
      answer: "Vasculitides.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Dysplastic changes indicate?",
      answer: "Precancerous lesion.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Metaplasia example?",
      answer: "Barrett's esophagus.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hyperplasia example?",
      answer: "Endometrial hyperplasia.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hypertrophy example?",
      answer: "Left ventricular hypertrophy.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Atrophy example?",
      answer: "Disuse atrophy.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Amyloid deposition in?",
      answer: "Alzheimer's disease.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hyaline change in?",
      answer: "Arteriosclerosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mucoid change in?",
      answer: "Myxedema.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Dystrophic calcification in?",
      answer: "Atherosclerosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Metastatic calcification in?",
      answer: "Hyperparathyroidism.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pigmentation in?",
      answer: "Hemochromatosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Granulomatous inflammation in?",
      answer: "Tuberculosis.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Abscess formation in?",
      answer: "Bacterial infection.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Embolism example?",
      answer: "Pulmonary thromboembolism.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thrombosis example?",
      answer: "Deep vein thrombosis.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Infarction example?",
      answer: "Myocardial infarction.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hemorrhage example?",
      answer: "Epistaxis.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Edema in?",
      answer: "Congestive heart failure.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Inflammation chronic hallmark?",
      answer: "Lymphocytes and macrophages.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Neoplasia benign example?",
      answer: "Lipoma.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Neoplasia malignant example?",
      answer: "Carcinoma.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "General Medicine": [
    {
      question: "SIRS criteria?",
      answer: "Temp >38 or <36, HR >90, RR >20, WBC >12k or <4k.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sepsis definition?",
      answer: "SIRS + infection.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Septic shock?",
      answer: "Sepsis + hypotension despite fluids.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "MODS stands for?",
      answer: "Multiple organ dysfunction syndrome.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ARDS criteria?",
      answer: "Acute onset, bilateral infiltrates, PaO2/FiO2 <200, no heart failure.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "COPD GOLD stages?",
      answer: "1-4 based on FEV1.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Asthma severity?",
      answer: "Intermittent, mild persistent, moderate persistent, severe persistent.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Diabetes mellitus types?",
      answer: "Type 1, Type 2.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "HbA1c normal range?",
      answer: "<5.7%.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hypertension stages?",
      answer: "Normal, prehypertension, stage 1, stage 2.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "CKD stages?",
      answer: "1-5 based on GFR.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acute coronary syndrome?",
      answer: "Unstable angina, NSTEMI, STEMI.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Heart failure NYHA classes?",
      answer: "I-IV.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Stroke types?",
      answer: "Ischemic, hemorrhagic.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pneumonia severity score?",
      answer: "CURB-65.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "UTI diagnosis?",
      answer: ">10^5 CFU/ml.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Anemia types?",
      answer: "Microcytic, normocytic, macrocytic.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thrombocytopenia causes?",
      answer: "Decreased production, increased destruction.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DIC features?",
      answer: "Bleeding, thrombosis, low platelets, prolonged PT/PTT.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thyroid function tests?",
      answer: "T3, T4, TSH.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Adrenal insufficiency?",
      answer: "Addison's disease.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cushing's syndrome?",
      answer: "Excess cortisol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pheochromocytoma?",
      answer: "Excess catecholamines.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "MEN syndromes?",
      answer: "Type 1, 2A, 2B.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rheumatoid arthritis criteria?",
      answer: "ACR/EULAR.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pharmacology: [
    {
      question: "Antidote for heparin?",
      answer: "Protamine sulfate.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for anaphylaxis?",
      answer: "Adrenaline.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for absence seizure?",
      answer: "Ethosuximide.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing gingival hyperplasia?",
      answer: "Phenytoin.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing red man syndrome?",
      answer: "Vancomycin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing gray baby syndrome?",
      answer: "Chloramphenicol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Reversal agent for warfarin?",
      answer: "Vitamin K.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Treatment for opioid overdose?",
      answer: "Naloxone.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing dry cough?",
      answer: "ACE inhibitors.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mechanism of loop diuretics?",
      answer: "Inhibit the Na-K-2Cl cotransporter in the thick ascending limb.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Autonomic drug for bradycardia?",
      answer: "Atropine.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic for Pseudomonas infection?",
      answer: "Piperacillin-tazobactam.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Side effect of amiodarone?",
      answer: "Pulmonary fibrosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "CYP inducer used in epilepsy?",
      answer: "Phenytoin.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "CYP inducer used in tuberculosis?",
      answer: "Rifampicin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "CYP inhibitor that raises warfarin levels?",
      answer: "Amiodarone.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for organophosphate poisoning?",
      answer: "Atropine plus pralidoxime.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for methanol poisoning?",
      answer: "Fomepizole.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for cyanide poisoning?",
      answer: "Hydroxocobalamin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic causing C. difficile colitis?",
      answer: "Clindamycin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic causing tendon rupture?",
      answer: "Fluoroquinolones.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug of choice for status epilepticus?",
      answer: "Lorazepam.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing drug-induced lupus?",
      answer: "Hydralazine.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing ototoxicity?",
      answer: "Aminoglycosides.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antiplatelet used in acute coronary syndrome?",
      answer: "Aspirin.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Beta blocker used for SVT?",
      answer: "Propranolol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing hyperprolactinemia?",
      answer: "Risperidone.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mechanism of metformin?",
      answer: "Decreases hepatic gluconeogenesis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Therapy for type I diabetes?",
      answer: "Insulin.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for hypothyroidism?",
      answer: "Levothyroxine.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing photosensitivity?",
      answer: "Tetracyclines.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Side effect of spironolactone?",
      answer: "Gynecomastia.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for benzodiazepine overdose?",
      answer: "Flumazenil.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic inhibiting cell wall synthesis?",
      answer: "Beta-lactams.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mechanism of sulfonylureas?",
      answer: "Stimulate insulin release from pancreatic beta cells.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic associated with serotonin syndrome?",
      answer: "Linezolid.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing fluid retention?",
      answer: "Thiazolidinediones.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Autonomic drug used in glaucoma?",
      answer: "Timolol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for acetaminophen poisoning?",
      answer: "N-acetylcysteine.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug of choice for diabetic nephropathy?",
      answer: "ACE inhibitors.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing hyperkalemia?",
      answer: "Spironolactone.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cardiovascular drug reducing post-MI mortality?",
      answer: "Beta blockers.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rate control in atrial fibrillation?",
      answer: "Diltiazem.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ACE inhibitors contraindicated in which state?",
      answer: "Pregnancy.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing pyridoxine deficiency?",
      answer: "Isoniazid.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antibiotic of choice for MSSA?",
      answer: "Nafcillin.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug causing hypoglycemia in insulinoma?",
      answer: "Sulfonylureas.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Autonomic drug for acute asthma relief?",
      answer: "Salbutamol.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thiazide diuretic adverse effect?",
      answer: "Hypokalemia.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rapid revision fact: ACE inhibitors in pregnancy?",
      answer: "Contraindicated.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for bacterial meningitis?",
      answer: "Ceftriaxone.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for viral meningitis?",
      answer: "Acyclovir.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for fungal meningitis?",
      answer: "Amphotericin B.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for TB meningitis?",
      answer: "Anti-TB drugs.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for Parkinson's?",
      answer: "Levodopa.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for Alzheimer's?",
      answer: "Donepezil.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for gout?",
      answer: "Allopurinol.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for rheumatoid arthritis?",
      answer: "Methotrexate.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for osteoarthritis?",
      answer: "NSAIDs.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for migraine?",
      answer: "Sumatriptan.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for GERD?",
      answer: "Omeprazole.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for IBD?",
      answer: "Mesalazine.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for Crohn's?",
      answer: "Infliximab.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for ulcerative colitis?",
      answer: "Sulfasalazine.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for hepatitis C?",
      answer: "Sofosbuvir.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for HIV?",
      answer: "Tenofovir.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for malaria?",
      answer: "Artemether.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for filariasis?",
      answer: "Diethylcarbamazine.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for leprosy?",
      answer: "Dapsone.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for kala-azar?",
      answer: "Liposomal amphotericin.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for amoebiasis?",
      answer: "Metronidazole.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for giardiasis?",
      answer: "Metronidazole.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for trichomoniasis?",
      answer: "Metronidazole.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for toxoplasmosis?",
      answer: "Pyrimethamine.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "DOC for pneumocystis?",
      answer: "Trimethoprim-sulfamethoxazole.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Microbiology: [
    {
      question: "Which organism is most commonly associated with community-acquired pneumonia?",
      answer: "Streptococcus pneumoniae.",
      difficulty: "Easy",
    },
    {
      question: "What is the diagnostic test for latent tuberculosis infection?",
      answer: "Interferon gamma release assay or Mantoux tuberculin skin test.",
      difficulty: "Medium",
    },
    {
      question: "Which virus is responsible for shingles?",
      answer: "Varicella-zoster virus.",
      difficulty: "Easy",
    },
    {
      question: "Which bacterium is oxidase-positive and can cause swimmer's ear?",
      answer: "Pseudomonas aeruginosa.",
      difficulty: "Medium",
    },
    {
      question: "Which organism causes neonatal conjunctivitis and is an obligate intracellular pathogen?",
      answer: "Chlamydia trachomatis.",
      difficulty: "Medium",
    },
    {
      question: "Most common cause of nosocomial pneumonia?",
      answer: "Pseudomonas aeruginosa.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of hospital-acquired UTI?",
      answer: "Escherichia coli.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of neonatal sepsis?",
      answer: "Group B Streptococcus.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of food poisoning?",
      answer: "Staphylococcus aureus.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of botulism?",
      answer: "Clostridium botulinum.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of anthrax?",
      answer: "Bacillus anthracis.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of plague?",
      answer: "Yersinia pestis.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of tularemia?",
      answer: "Francisella tularensis.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of brucellosis?",
      answer: "Brucella.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of Q fever?",
      answer: "Coxiella burnetii.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of Lyme disease?",
      answer: "Borrelia burgdorferi.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of syphilis?",
      answer: "Treponema pallidum.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of gonorrhea?",
      answer: "Neisseria gonorrhoeae.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of meningococcal meningitis?",
      answer: "Neisseria meningitidis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of pertussis?",
      answer: "Bordetella pertussis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of diphtheria?",
      answer: "Corynebacterium diphtheriae.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of tetanus?",
      answer: "Clostridium tetani.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of gas gangrene?",
      answer: "Clostridium perfringens.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of pseudomembranous colitis?",
      answer: "Clostridium difficile.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of tuberculosis?",
      answer: "Mycobacterium tuberculosis.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of leprosy?",
      answer: "Mycobacterium leprae.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of atypical mycobacteria?",
      answer: "Mycobacterium avium complex.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of viral hepatitis?",
      answer: "Hepatitis B virus.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of herpes simplex?",
      answer: "HSV-1.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of varicella-zoster?",
      answer: "VZV.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Forensic Medicine": [
    {
      question: "What are the four manners of death?",
      answer: "Natural, accidental, suicidal, and homicidal.",
      difficulty: "Easy",
    },
    {
      question: "Which sign suggests a prolonged interval between death and discovery?",
      answer: "Rigor mortis followed by decomposition changes.",
      difficulty: "Medium",
    },
    {
      question: "What is the legal term for negligence resulting in death?",
      answer: "Culpable homicide not amounting to murder.",
      difficulty: "Hard",
    },
    {
      question: "What is the most important factor in determining the cause of death?",
      answer: "The underlying disease or injury that initiated the fatal sequence.",
      difficulty: "Medium",
    },
    {
      question: "How is antemortem injury distinguished from postmortem injury?",
      answer: "Antemortem injuries show vital reactions such as bleeding and inflammation.",
      difficulty: "Easy",
    },
    {
      question: "Lucid interval classically seen in?",
      answer: "Epidural hematoma.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Manner of death: Natural, accidental, suicidal, homicidal?",
      answer: "Classification of death circumstances.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cause of death vs manner of death?",
      answer: "Cause is medical reason; manner is how it occurred.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Postmortem lividity?",
      answer: "Dependent pooling of blood.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rigor mortis?",
      answer: "Stiffening of muscles after death.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Algor mortis?",
      answer: "Cooling of body after death.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Autopsy types?",
      answer: "Medico-legal, clinical.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Injury types?",
      answer: "Abrasion, contusion, laceration.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Firearm wounds?",
      answer: "Entry, exit, contact.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drowning signs?",
      answer: "Washerwoman's hands, frothy sputum.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Strangulation marks?",
      answer: "Ligature mark.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sexual assault evidence?",
      answer: "Semen analysis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Poisoning signs?",
      answer: "Odor, stains.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Infanticide signs?",
      answer: "Hydrostatic test.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Age determination?",
      answer: "Dental eruption, ossification centers.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Community Medicine": [
    {
      question: "What is herd immunity?",
      answer: "Population-level protection that occurs when a sufficient proportion is immune.",
      difficulty: "Medium",
    },
    {
      question: "What is the difference between incidence and prevalence?",
      answer: "Incidence measures new cases; prevalence measures all existing cases.",
      difficulty: "Easy",
    },
    {
      question: "Which vaccine is given at birth in India?",
      answer: "BCG.",
      difficulty: "Easy",
    },
    {
      question: "What is the epidemiologic triad?",
      answer: "Agent, host, and environment.",
      difficulty: "Easy",
    },
    {
      question: "What is the primary goal of a health survey?",
      answer: "To gather data on health status and risk factors in a population.",
      difficulty: "Medium",
    },
    {
      question: "Couple protection rate formula?",
      answer: "Eligible couples effectively protected ÷ total eligible couples ×100.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Infant mortality rate?",
      answer: "Deaths <1 year per 1000 live births.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Maternal mortality rate?",
      answer: "Deaths due to pregnancy per 100,000 live births.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Crude birth rate?",
      answer: "Births per 1000 population.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Crude death rate?",
      answer: "Deaths per 1000 population.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Life expectancy?",
      answer: "Average years of life.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Epidemiological triad?",
      answer: "Agent, host, environment.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Primary prevention?",
      answer: "Vaccination.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Secondary prevention?",
      answer: "Screening.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tertiary prevention?",
      answer: "Rehabilitation.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Herd immunity?",
      answer: "Protection of population.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Endemic vs epidemic?",
      answer: "Endemic is constant; epidemic is increased.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pandemic?",
      answer: "Worldwide epidemic.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Surveillance?",
      answer: "Continuous monitoring.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Health indicators?",
      answer: "IMR, MMR, etc.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  ENT: [
    {
      question: "What is the classic triad of Meniere's disease?",
      answer: "Vertigo, tinnitus, and hearing loss.",
      difficulty: "Medium",
    },
    {
      question: "Which nerve supplies sensation to the anterior two-thirds of the tongue?",
      answer: "The lingual nerve (branch of V3).",
      difficulty: "Easy",
    },
    {
      question: "What is the most common cause of conductive hearing loss in adults?",
      answer: "Otitis media with effusion or tympanic membrane perforation.",
      difficulty: "Medium",
    },
    {
      question: "Which pathological lesion is associated with nasal polyps?",
      answer: "Chronic rhinosinusitis.",
      difficulty: "Medium",
    },
    {
      question: "What is a typical feature of acute suppurative otitis media?",
      answer: "Middle ear effusion with pus and a bulging tympanic membrane.",
      difficulty: "Easy",
    },
    {
      question: "Little's area is located in?",
      answer: "Anterior nasal septum.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common nasal polyp?",
      answer: "Ethmoidal polyp.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Otitis media types?",
      answer: "Acute, chronic, serous.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mastoiditis complication?",
      answer: "Intracranial abscess.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tonsillitis cause?",
      answer: "Streptococcus pyogenes.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Laryngeal cancer risk?",
      answer: "Smoking.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Vocal cord paralysis?",
      answer: "Recurrent laryngeal nerve.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sinusitis types?",
      answer: "Acute, chronic.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Epistaxis causes?",
      answer: "Trauma, hypertension.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hearing loss types?",
      answer: "Conductive, sensorineural.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Weber test?",
      answer: "Lateralizes to better ear.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rinne test?",
      answer: "Air > bone conduction.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Meniere's disease?",
      answer: "Vertigo, tinnitus, hearing loss.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acoustic neuroma?",
      answer: "Vestibular schwannoma.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Foreign body in ear?",
      answer: "Remove with forceps.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Ophthalmology: [
    {
      question: "What is the most common cause of treatable blindness worldwide?",
      answer: "Cataract.",
      difficulty: "Easy",
    },
    {
      question: "Which disease is characterized by increased intraocular pressure and optic nerve damage?",
      answer: "Glaucoma.",
      difficulty: "Medium",
    },
    {
      question: "What sign is seen in papilledema?",
      answer: "Blurring of the optic disc margins.",
      difficulty: "Medium",
    },
    {
      question: "Which condition causes sudden, painful vision loss with a red eye?",
      answer: "Acute angle-closure glaucoma.",
      difficulty: "Hard",
    },
    {
      question: "What is the common cause of central vision loss in older adults?",
      answer: "Age-related macular degeneration.",
      difficulty: "Medium",
    },
    {
      question: "Most common cataract?",
      answer: "Senile cataract.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Glaucoma types?",
      answer: "Open angle, closed angle.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Diabetic retinopathy stages?",
      answer: "Non-proliferative, proliferative.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Retinitis pigmentosa?",
      answer: "Night blindness.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Macular degeneration?",
      answer: "Age-related.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Retinal detachment?",
      answer: "Separation of retina.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cataract surgery?",
      answer: "Phacoemulsification.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Corneal ulcer cause?",
      answer: "Pseudomonas.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Conjunctivitis types?",
      answer: "Bacterial, viral, allergic.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pterygium?",
      answer: "Growth on cornea.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Chalazion?",
      answer: "Meibomian gland cyst.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hordeolum?",
      answer: "Stye.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Amblyopia?",
      answer: "Lazy eye.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Strabismus?",
      answer: "Squint.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Color blindness?",
      answer: "X-linked recessive.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Dermatology: [
    {
      question: "Which chronic skin disease is characterized by well-demarcated, scaly plaques?",
      answer: "Psoriasis.",
      difficulty: "Easy",
    },
    {
      question: "What dermatologic feature is typical of tinea corporis?",
      answer: "Annular, scaly lesions with central clearing.",
      difficulty: "Medium",
    },
    {
      question: "Which autoimmune blistering disorder has tense bullae?",
      answer: "Bullous pemphigoid.",
      difficulty: "Medium",
    },
    {
      question: "What is the hallmark lesion of fixed drug eruption?",
      answer: "A recurring, well-demarcated pigmented patch at the same site after drug exposure.",
      difficulty: "Medium",
    },
    {
      question: "Which organism causes acne vulgaris?",
      answer: "Propionibacterium acnes (Cutibacterium acnes).",
      difficulty: "Easy",
    },
    {
      question: "Nikolsky sign positive in?",
      answer: "Pemphigus vulgaris.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Acne vulgaris cause?",
      answer: "Seborrhea, comedones.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Psoriasis features?",
      answer: "Silvery scales.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Eczema types?",
      answer: "Atopic, contact.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Vitiligo?",
      answer: "Depigmentation.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Alopecia areata?",
      answer: "Autoimmune hair loss.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Scabies cause?",
      answer: "Sarcoptes scabiei.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Ringworm?",
      answer: "Tinea.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Impetigo cause?",
      answer: "Staphylococcus.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cellulitis?",
      answer: "Skin infection.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Herpes zoster?",
      answer: "Shingles.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Molluscum contagiosum?",
      answer: "Poxvirus.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Warts?",
      answer: "HPV.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Basal cell carcinoma?",
      answer: "Most common skin cancer.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Melanoma?",
      answer: "Malignant melanoma.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Radiology: [
    {
      question: "What imaging modality is best for evaluating soft tissue contrast?",
      answer: "MRI.",
      difficulty: "Medium",
    },
    {
      question: "What is the primary advantage of CT scanning?",
      answer: "Excellent bone and acute hemorrhage detail.",
      difficulty: "Easy",
    },
    {
      question: "Which artifact on ultrasound is caused by reflection from a strong interface?",
      answer: "Reverberation artifact.",
      difficulty: "Hard",
    },
    {
      question: "What is the first-line imaging test for suspected pneumothorax?",
      answer: "Chest X-ray.",
      difficulty: "Easy",
    },
    {
      question: "What finding suggests a fracture on plain radiography?",
      answer: "A break in cortical continuity.",
      difficulty: "Medium",
    },
    {
      question: "Investigation of choice for pulmonary embolism?",
      answer: "CT pulmonary angiography.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Chest X-ray for pneumonia?",
      answer: "Consolidation.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Abdominal ultrasound for?",
      answer: "Gallstones.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "CT brain for?",
      answer: "Stroke.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "MRI brain for?",
      answer: "Multiple sclerosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mammography for?",
      answer: "Breast cancer.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bone scan for?",
      answer: "Metastases.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "IVP for?",
      answer: "Renal stones.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ERCP for?",
      answer: "Biliary obstruction.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Angiography for?",
      answer: "Aneurysm.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Echocardiography for?",
      answer: "Cardiac function.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Doppler ultrasound for?",
      answer: "DVT.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "PET scan for?",
      answer: "Cancer staging.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "X-ray skull for?",
      answer: "Fracture.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Anesthesiology: [
    {
      question: "What is the preferred induction agent for rapid sequence induction?",
      answer: "Ketamine or propofol with succinylcholine.",
      difficulty: "Medium",
    },
    {
      question: "Which condition is associated with a risk of malignant hyperthermia?",
      answer: "Succinylcholine or volatile anesthetic administration.",
      difficulty: "Hard",
    },
    {
      question: "What is the mechanism of action of local anesthetics?",
      answer: "They block voltage-gated sodium channels.",
      difficulty: "Medium",
    },
    {
      question: "How is the Mallampati score used?",
      answer: "To predict difficult airway management.",
      difficulty: "Easy",
    },
    {
      question: "Which drug is used to reverse opioid-induced respiratory depression?",
      answer: "Naloxone.",
      difficulty: "Easy",
    },
    {
      question: "What is the dose of succinylcholine?",
      answer: "1-1.5 mg/kg IV for intubation.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Rocuronium duration of action?",
      answer: "30-40 minutes.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line agent for post-operative nausea and vomiting (PONV)?",
      answer: "Ondansetron.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Maximum dose of lidocaine with epinephrine?",
      answer: "7 mg/kg.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mechanism of malignant hyperthermia?",
      answer: "Abnormal calcium release from sarcoplasmic reticulum in muscle.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Dantrolene dose for malignant hyperthermia?",
      answer: "2.5 mg/kg IV, repeat every 5 minutes up to 10 mg/kg.",
      difficulty: "Hard",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "RSI drugs combination?",
      answer: "Induction agent (propofol/etomidate) + neuromuscular blocker (succinylcholine/rocuronium).",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "General Medicine": [
    {
      question: "SIRS criteria?",
      answer: "Temperature, pulse, respiratory rate, and WBC abnormalities.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "First-line therapy for diabetic ketoacidosis?",
      answer: "IV insulin.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of community-acquired pneumonia?",
      answer: "Streptococcus pneumoniae.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First step in hyperkalemia management?",
      answer: "IV calcium gluconate.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Findings in SIADH?",
      answer: "Hyponatremia with concentrated urine.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Best initial test for DVT?",
      answer: "Doppler ultrasound.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Drug of choice for hypertension in pregnancy?",
      answer: "Methyldopa.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of acute pancreatitis?",
      answer: "Gallstones and alcohol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Classic triad of diabetic ketoacidosis?",
      answer: "Hyperglycemia, ketosis, and metabolic acidosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of nephrotic syndrome in adults?",
      answer: "Membranous nephropathy.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Presentation of acute rheumatic fever?",
      answer: "Migratory polyarthritis and carditis.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of hemolytic anemia in India?",
      answer: "G6PD deficiency.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Best initial management for acute coronary syndrome?",
      answer: "MONA: morphine, oxygen, nitrates, aspirin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Metabolic acidosis with anion gap indicates?",
      answer: "Increased anion gap.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Key symptom of pulmonary embolism?",
      answer: "Sudden onset dyspnea.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Malignant hyperthermia treatment?",
      answer: "Dantrolene.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "General anesthesia stages?",
      answer: "Induction, maintenance, emergence.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Local anesthesia types?",
      answer: "Topical, infiltration, nerve block.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Spinal anesthesia level?",
      answer: "L3-L4.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Epidural anesthesia?",
      answer: "Catheter in epidural space.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Endotracheal intubation?",
      answer: "Airway management.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "LMA?",
      answer: "Laryngeal mask airway.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pre-op assessment?",
      answer: "History, physical, labs.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ASA classification?",
      answer: "Physical status.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Monitoring?",
      answer: "ECG, BP, SpO2.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Complications?",
      answer: "Aspiration, hypotension.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pain management?",
      answer: "Opioids, NSAIDs.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Regional blocks?",
      answer: "Brachial plexus, femoral.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sedation levels?",
      answer: "Minimal, moderate, deep.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Reversal agents?",
      answer: "Naloxone, flumazenil.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "General Surgery": [
    {
      question: "Most common cause of acute appendicitis?",
      answer: "Obstruction of the appendiceal lumen.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Best investigation for suspected perforated viscus?",
      answer: "Chest X-ray with free air under diaphragm.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Parkland formula for burns?",
      answer: "4 ml × body weight × %TBSA in first 24 hours.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common site of peptic ulcer perforation?",
      answer: "Anterior duodenum.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Indication for cholecystectomy?",
      answer: "Symptomatic gallstones.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sentinel loop on X-ray indicates?",
      answer: "Localized ileus.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First aid for snake bite?",
      answer: "Immobilize limb and avoid tourniquets.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most commonly injured organ in blunt abdominal trauma?",
      answer: "Spleen.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Prophylaxis for clean-contaminated surgery?",
      answer: "Cefazolin.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Typical presentation of peritonitis?",
      answer: "Acute abdominal pain with guarding and rigidity.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Indirect inguinal hernia passes through?",
      answer: "Deep inguinal ring and superficial inguinal ring.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common primary liver tumor?",
      answer: "Hepatocellular carcinoma.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mallampati classification predicts?",
      answer: "Difficult airway.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Initial management of acute pancreatitis?",
      answer: "NPO, IV fluids, and analgesia.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Urgent surgical indication in peptic ulcer disease?",
      answer: "Perforation or uncontrolled bleeding.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Appendicitis signs?",
      answer: "McBurney's point tenderness.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cholelithiasis?",
      answer: "Gallstones.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hernia types?",
      answer: "Inguinal, femoral.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bowel obstruction?",
      answer: "Small vs large.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Peritonitis?",
      answer: "Inflammation of peritoneum.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Abscess drainage?",
      answer: "Incision and drainage.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Wound healing?",
      answer: "Primary, secondary.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Burns classification?",
      answer: "First, second, third degree.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thyroidectomy?",
      answer: "For goiter.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Mastectomy?",
      answer: "For breast cancer.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Colorectal cancer?",
      answer: "Most common GI cancer.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Pancreatic cancer?",
      answer: "Poor prognosis.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Liver cirrhosis?",
      answer: "Portal hypertension.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Splenectomy?",
      answer: "For trauma.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Vascular surgery?",
      answer: "Bypass grafts.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Orthopedics: [
    {
      question: "What is the most common cause of osteoporotic fracture?",
      answer: "Vertebral compression fractures.",
      difficulty: "Medium",
    },
    {
      question: "What are the signs of compartment syndrome?",
      answer: "Pain out of proportion, paresthesia, pallor, pulselessness, and paralysis.",
      difficulty: "Hard",
    },
    {
      question: "How is a Colles fracture described?",
      answer: "Distal radius fracture with dorsal displacement.",
      difficulty: "Medium",
    },
    {
      question: "Which joint is affected in osteoarthritis first?",
      answer: "The distal interphalangeal joints in the hand.",
      difficulty: "Easy",
    },
    {
      question: "What is the Gold standard investigation for spinal tuberculosis?",
      answer: "MRI of the spine.",
      difficulty: "Hard",
    },
    {
      question: "Fracture healing?",
      answer: "Callus formation.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Osteoarthritis?",
      answer: "Joint degeneration.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rheumatoid arthritis?",
      answer: "Autoimmune.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Osteoporosis?",
      answer: "Low bone density.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Fracture types?",
      answer: "Simple, compound.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Dislocation?",
      answer: "Joint displacement.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sprain vs strain?",
      answer: "Ligament vs muscle.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Meniscus tear?",
      answer: "Knee injury.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "ACL tear?",
      answer: "Anterior cruciate ligament.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Rotator cuff tear?",
      answer: "Shoulder.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Hip fracture?",
      answer: "Femoral neck.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Spinal fractures?",
      answer: "Compression.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bone tumors?",
      answer: "Osteosarcoma.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Clubfoot?",
      answer: "Talipes equinovarus.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Scoliosis?",
      answer: "Spinal curvature.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Pediatrics: [
    {
      question: "Which vaccine is given at 6 weeks in the Indian schedule?",
      answer: "DPT and OPV.",
      difficulty: "Easy",
    },
    {
      question: "What is the common cause of neonatal jaundice in the first week?",
      answer: "Physiological jaundice.",
      difficulty: "Easy",
    },
    {
      question: "What is the first-line treatment for acute gastroenteritis dehydration?",
      answer: "Oral rehydration solution.",
      difficulty: "Easy",
    },
    {
      question: "Which sign indicates congenital heart disease in an infant?",
      answer: "Failure to thrive and tachypnea.",
      difficulty: "Medium",
    },
    {
      question: "What is the cause of respiratory distress syndrome in preterm infants?",
      answer: "Surfactant deficiency.",
      difficulty: "Medium",
    },
    {
      question: "APGAR score components?",
      answer: "Appearance, Pulse, Grimace, Activity, Respiration.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Neonatal jaundice?",
      answer: "Physiological.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Respiratory distress syndrome?",
      answer: "Surfactant deficiency.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Meconium aspiration?",
      answer: "Fetal distress.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Congenital heart defects?",
      answer: "VSD, ASD.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Down syndrome?",
      answer: "Trisomy 21.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cystic fibrosis?",
      answer: "CFTR mutation.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Sickle cell anemia?",
      answer: "Hemoglobin S.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Thalassemia?",
      answer: "Beta thalassemia.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Immunizations?",
      answer: "BCG, DPT, MMR.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Growth charts?",
      answer: "Height, weight.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Failure to thrive?",
      answer: "Poor growth.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Febrile seizures?",
      answer: "Benign.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Meningitis in children?",
      answer: "H. influenzae.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Gastroenteritis?",
      answer: "Rotavirus.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  "Obstetrics & Gynecology": [
    {
      question: "What is the diagnostic triad of preeclampsia?",
      answer: "Hypertension, proteinuria, and edema after 20 weeks.",
      difficulty: "Medium",
    },
    {
      question: "Which contraceptive method is effective immediately after insertion?",
      answer: "Copper IUD.",
      difficulty: "Medium",
    },
    {
      question: "What is the most common site of ectopic pregnancy?",
      answer: "The fallopian tube.",
      difficulty: "Easy",
    },
    {
      question: "What are the stages of labor?",
      answer: "First: dilation, second: expulsion, third: placental delivery.",
      difficulty: "Easy",
    },
    {
      question: "Which sign suggests Placenta previa?",
      answer: "Painless vaginal bleeding in the third trimester.",
      difficulty: "Hard",
    },
    {
      question: "Blood pressure criteria for gestational hypertension?",
      answer: "SBP ≥140 mmHg or DBP ≥90 mmHg on two occasions after 20 weeks.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "First-line drug for eclampsia?",
      answer: "Magnesium sulfate.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Duration of magnesium sulfate prophylaxis in preeclampsia?",
      answer: "12-24 hours postpartum.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Human chorionic gonadotropin (hCG) doubling time in early pregnancy?",
      answer: "Every 48-72 hours in the first 4 weeks.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Beta-hCG level at which gestational sac is visible on ultrasound?",
      answer: "1500-2000 mIU/mL.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Shoulder dystocia management - McRoberts maneuver?",
      answer: "Hyperflexion of maternal thighs against the abdomen.",
      difficulty: "Hard",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "FIGO classification of placental abruption grading?",
      answer: "Grade 0: no clinical sign; Grade 1: minor; Grade 2: moderate; Grade 3: severe.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line treatment for postpartum hemorrhage?",
      answer: "IV oxytocin (10 units IV or IM).",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "TORCH infections affecting pregnancy?",
      answer: "Toxoplasmosis, Other, Rubella, Cytomegalovirus, Herpes simplex.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Most common cause of recurrent pregnancy loss?",
      answer: "Antiphospholipid syndrome.",
      difficulty: "Hard",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
  ],
  Toxicology: [
    {
      question: "Best antidote for lead poisoning?",
      answer: "Calcium disodium EDTA.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Mee's lines are seen in which poisoning?",
      answer: "Arsenic poisoning.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Organophosphorus antidote?",
      answer: "Atropine plus pralidoxime.",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Methanol poisoning antidote?",
      answer: "Fomepizole or ethanol.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Carbon monoxide poisoning feature?",
      answer: "Cherry red skin.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Primary toxin type in viper bites?",
      answer: "Hemotoxins.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Primary toxin type in cobra bites?",
      answer: "Neurotoxins.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Arsenic poisoning odour?",
      answer: "Garlic odour.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Organophosphate toxidrome includes?",
      answer: "SLUDGE signs.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Carbon monoxide binds hemoglobin with what affinity?",
      answer: "About 250 times that of oxygen.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Arsenic poisoning skin finding?",
      answer: "Garlic odour and hyperkeratosis.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Cyanide poisoning sign?",
      answer: "Bitter almond odour.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First aid for snake bite?",
      answer: "Immobilize the limb and evacuate quickly.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Antidote for methanol and ethylene glycol?",
      answer: "Fomepizole.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Anticholinergic toxidrome key features?",
      answer: "Hot, dry, red, blind, mad, and full bladder.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
  ],
  Psychiatry: [
    {
      question: "First-line medication for Major Depressive Disorder?",
      answer: "SSRIs (Selective Serotonin Reuptake Inhibitors).",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "First-line antipsychotic for acute psychosis?",
      answer: "Atypical antipsychotics (risperidone, olanzapine).",
      difficulty: "Easy",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "DSM-5 criteria for Major Depressive Disorder duration?",
      answer: "Symptoms must be present for at least 2 weeks.",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the first-line treatment for Generalized Anxiety Disorder?",
      answer: "SSRIs or SNRIs.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Neuroleptic Malignant Syndrome is associated with?",
      answer: "Antipsychotic use, presenting with fever, rigidity, altered mental status, and elevated CPK.",
      difficulty: "Hard",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "Most common type of anxiety disorder?",
      answer: "Generalized Anxiety Disorder (GAD).",
      difficulty: "Easy",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Bipolar Disorder Type I vs Type II difference?",
      answer: "Type I: at least one manic episode. Type II: hypomanic and depressive episodes only.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
    {
      question: "First-line mood stabilizer for Bipolar Disorder?",
      answer: "Lithium.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Lithium therapeutic level?",
      answer: "0.6-1.2 mEq/L.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is SIADH as a side effect of SSRI use?",
      answer: "Syndrome of Inappropriate Antidiuretic Hormone secretion causing hyponatremia.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line treatment for Panic Disorder?",
      answer: "SSRIs with cognitive behavioral therapy (CBT).",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "What is the key feature of Obsessive-Compulsive Disorder?",
      answer: "Presence of both obsessions and compulsions causing distress and functional impairment.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Tardive Dyskinesia is a side effect of which class of drugs?",
      answer: "First-generation antipsychotics.",
      difficulty: "Medium",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "Management of Tardive Dyskinesia?",
      answer: "Switch to second-generation antipsychotics or add benztropine.",
      difficulty: "Hard",
      tags: ["High Yield", "Rapid Revision"],
    },
    {
      question: "First-line treatment for Post-Traumatic Stress Disorder (PTSD)?",
      answer: "SSRIs or SNRIs with trauma-focused CBT.",
      difficulty: "Medium",
      tags: ["PYQ", "High Yield", "Rapid Revision"],
    },
  ],
  "Emergency Medicine": [
    {
      question: "What is the first step in the ABCDE approach?",
      answer: "Airway assessment.",
      difficulty: "Easy",
    },
    {
      question: "What is the immediate treatment for anaphylaxis?",
      answer: "Intramuscular epinephrine.",
      difficulty: "Easy",
    },
    {
      question: "Which burn depth involves full-thickness skin loss?",
      answer: "Third-degree burns.",
      difficulty: "Medium",
    },
    {
      question: "What is the primary goal of trauma resuscitation?",
      answer: "Restore airway, breathing, and circulation.",
      difficulty: "Easy",
    },
    {
      question: "Which arrhythmia is treated with immediate defibrillation?",
      answer: "Ventricular fibrillation.",
      difficulty: "Hard",
    },
  ],
};

const makeDefaultCards = (subject, seedCards) => {
  return seedCards.map((seed, index) => ({
    id: `pre-${subject.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase()}-${index + 1}`,
    subject,
    question: seed.question,
    answer: seed.answer,
    tags: seed.tags || ["PYQ", "High Yield", "Rapid Revision"],
    difficulty: seed.difficulty || "Medium",
    source: "Prebuilt topic",
    importedAt: new Date().toISOString(),
  }));
};

const defaultCardLibrary = subjects.reduce((acc, subject) => {
  acc[subject] = makeDefaultCards(subject, seedCardsBySubject[subject] || []);
  return acc;
}, {});

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [noteText, setNoteText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [subjectView, setSubjectView] = useState(subjects[0]);
  const [cardLibrary, setCardLibrary] = useState({});
  const [recentImports, setRecentImports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCards, setSearchCards] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState([]);
  const [revisionMode, setRevisionMode] = useState("");
  const [bookmarks, setBookmarks] = useState({});
  const [mistakes, setMistakes] = useState({ skipped: {}, incorrect: {}, bookmarks: {} });
  const [progress, setProgress] = useState({});
  const [screen, setScreen] = useState("subjects");
  const [notification, setNotification] = useState("");
  const [extractedTextPreview, setExtractedTextPreview] = useState("");
  const [extractionPreviewUrl, setExtractionPreviewUrl] = useState("");
  const [extractedSourceName, setExtractedSourceName] = useState("");

  useEffect(() => {
    const savedLibrary = safeParse(localStorage.getItem(STORAGE_KEYS.library), {});
    const savedImports = safeParse(localStorage.getItem(STORAGE_KEYS.imports), []);
    const savedSubject = localStorage.getItem(STORAGE_KEYS.selectedSubject);
    const savedBookmarks = safeParse(localStorage.getItem(STORAGE_KEYS.bookmarks), {});
    const savedMistakes = safeParse(localStorage.getItem(STORAGE_KEYS.mistakes), { skipped: {}, incorrect: {}, bookmarks: {} });
    const savedProgress = safeParse(localStorage.getItem(STORAGE_KEYS.progress), {});

    setCardLibrary(Object.keys(savedLibrary).length ? savedLibrary : defaultCardLibrary);
    setRecentImports(savedImports);
    setBookmarks(savedBookmarks);
    setMistakes(savedMistakes);
    setProgress(savedProgress);

    if (savedSubject && subjects.includes(savedSubject)) {
      setSelectedSubject(savedSubject);
      setSubjectView(savedSubject);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(cardLibrary));
  }, [cardLibrary]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.imports, JSON.stringify(recentImports));
  }, [recentImports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedSubject, selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
  }, [progress]);

  const currentDeck = subjectView && revisionMode === "" ? cardLibrary[subjectView] || [] : [];


  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    const query = searchTerm.toLowerCase();
    return subjects.filter((subject) => {
      const subjectMatch = subject.toLowerCase().includes(query);
      const cards = cardLibrary[subject] || [];
      const cardMatch = cards.some(
        (card) =>
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query)
      );
      return subjectMatch || cardMatch;
    });
  }, [searchTerm, cardLibrary]);

  const filteredCards = useMemo(() => {
    let cards = currentDeck;

    if (revisionMode) {
      const mode = REVISION_MODES.find(m => m.id === revisionMode);
      if (mode) {
        cards = Object.values(cardLibrary).flat().filter(mode.predicate);
      }
    }

    if (!searchCards.trim() && activeFilters.length === 0) return cards;

    const query = searchCards.toLowerCase();
    return cards.filter((card) => {
      const searchMatch = !query || card.question.toLowerCase().includes(query) || card.answer.toLowerCase().includes(query);
      const filterMatch = activeFilters.length === 0 || activeFilters.some(filter => card.tags?.includes(filter));
      return searchMatch && filterMatch;
    });
  }, [searchCards, currentDeck, activeFilters, revisionMode, cardLibrary]);

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0] || null;

  const createOcrWorker = async () => {
    const worker = Tesseract.createWorker({ logger: () => {} });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    return worker;
  };

  const preprocessImageForOCR = async (source) => {
    const image = source instanceof HTMLCanvasElement ? source : await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    const maxWidth = 1800;
    const ratio = Math.min(1, maxWidth / image.width);
    canvas.width = Math.max(800, image.width * ratio);
    canvas.height = Math.max(800, image.height * ratio);
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.4 + 128));
      data[i] = data[i + 1] = data[i + 2] = enhanced;
    }
    context.putImageData(imageData, 0, 0);
    return canvas;
  };

  const recognizeImageText = async (source) => {
    const worker = await createOcrWorker();
    const preprocessed = await preprocessImageForOCR(source);
    const input = preprocessed.toDataURL("image/png");
    const {
      data: { text },
    } = await worker.recognize(input);
    await worker.terminate();
    return text.trim();
  };

  const extractPdfText = async (arrayBuffer) => {
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const pageCount = Math.min(pdf.numPages, 3);
    const textParts = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ").trim();

      if (pageText) {
        textParts.push(pageText);
        continue;
      }

      const viewport = page.getViewport({ scale: 3 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const ocrText = await recognizeImageText(canvas);
      if (ocrText) {
        textParts.push(ocrText);
      }
    }

    pdf.destroy();
    return textParts.join("\n\n");
  };

  const createCard = ({ question, answer, source }) => {
    const newCard = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      question,
      answer,
      subject: selectedSubject,
      difficulty: "",
      source,
      importedAt: new Date().toISOString(),
    };

    setCardLibrary((prev) => {
      const existing = prev[selectedSubject] || [];
      return {
        ...prev,
        [selectedSubject]: [newCard, ...existing],
      };
    });

    setRecentImports((prev) => [
      {
        id: newCard.id,
        subject: selectedSubject,
        fileName: source,
        fileType: fileType || "notes",
        importedAt: newCard.importedAt,
      },
      ...prev.slice(0, 4),
    ]);

    setFileName("");
    setFileType("");
    setNoteText("");
    setExtractedTextPreview("");
    setExtractionPreviewUrl("");
    setExtractedSourceName("");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type || "file");
    setExtractedSourceName(file.name);
    setExtractionPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : "");
    setExtractedTextPreview("");

    let extractedText = "";

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      extractedText = await extractPdfText(arrayBuffer);
    } else if (file.type.startsWith("image/")) {
      extractedText = await recognizeImageText(file);
    } else if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
      extractedText = await file.text();
    }

    setExtractedTextPreview(extractedText.trim());
    setNotification("Text extracted. Review the preview and generate flashcards.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSaveNotes = () => {
    if (!noteText.trim()) return;
    const cards = generateFlashcardsFromText(noteText.trim(), selectedSubject);
    if (cards.length > 0) {
      createMultipleCards(cards);
      setNotification(`${cards.length} flashcards generated`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    createCard({
      question: `Review saved notes for ${selectedSubject}`,
      answer: noteText.trim(),
      source: "Handwritten note",
      subject: selectedSubject,
    });
  };

  const handleGenerateExtractedPreview = () => {
    const sourceText = extractedTextPreview.trim();
    if (!sourceText && !extractionPreviewUrl) {
      setNotification("No extracted text or image preview available to generate flashcards.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    if (!sourceText && extractionPreviewUrl) {
      const imageCard = {
        question: `Review the ${selectedSubject} image`,
        answer: `Interpret the image findings in the context of ${selectedSubject}.`,
        subject: selectedSubject,
        tags: ["Image", "High Yield"],
        imageSrc: extractionPreviewUrl,
      };
      createMultipleCards([imageCard]);
      setNotification("Image flashcard created.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    const generatedCards = generateFlashcardsFromText(sourceText, selectedSubject);
    if (generatedCards.length > 0) {
      createMultipleCards(generatedCards);
      setNotification(`${generatedCards.length} flashcards generated`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    createCard({
      question: `Review imported ${selectedSubject} content`,
      answer: sourceText,
      source: extractedSourceName || "Imported content",
      subject: selectedSubject,
    });
  };

  const handleLinkImport = async () => {
    if (!linkUrl.trim()) return;
    try {
      // In a real implementation, this would fetch content from the URL
      // For now, we'll create a placeholder card
      createCard({
        question: `Review content from ${selectedSubject} link`,
        answer: `Content from: ${linkUrl}\n\n[AI would extract and summarize content here]`,
        source: linkUrl,
      });
      setLinkUrl("");
      setNotification("Link processed (AI generation coming soon)");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      setNotification("Failed to process link");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const generateFlashcardsFromText = (text, subject) => {
    const normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/ +/g, " ")
      .trim();

    const rawLines = normalized
      .split(/\n+/)
      .flatMap((line) => line.split(/(?<=\.)\s+/))
      .map((line) => line.trim())
      .filter((line) => line.length > 20 && !/^(page|chapter|figure|table|references|index|refernces|summary|contents)/i.test(line));

    const uniqueLines = [...new Set(rawLines)];
    const cards = [];
    const seen = new Set();

    const addCard = (question, answer, tags = []) => {
      const key = `${question}||${answer}`;
      if (seen.has(key) || cards.length >= 8) return;
      seen.add(key);
      cards.push({
        question,
        answer,
        subject,
        tags: ["Generated", "High Yield", ...new Set(tags)].filter(Boolean),
      });
    };

    const createQuestionAnswer = (line) => {
      const [left, right] = line.split(/[:\-–—]+/).map((part) => part.trim());
      if (right && left && right.length > 10) {
        const question = left.endsWith("?") ? left : `${left.replace(/\b(is|are|causes|presents|indicates|manifests)\b/i, "$&")}?`;
        return { question, answer: right };
      }

      if (/antidote/i.test(line)) {
        return {
          question: line.endsWith("?") ? line : `What is the antidote for ${line.replace(/.*antidote for/i, "").replace(/\.$/, "")}?`,
          answer: line.replace(/.*antidote for/i, "").replace(/\.$/, ""),
        };
      }

      if (/drug of choice/i.test(line)) {
        return {
          question: line.endsWith("?") ? line : `What is the drug of choice for ${line.replace(/.*drug of choice for/i, "").replace(/\.$/, "")}?`,
          answer: line.replace(/.*drug of choice.*for/i, "").replace(/\.$/, ""),
        };
      }

      if (/(?:investigation|diagnosis|diagnostic|test)/i.test(line)) {
        return {
          question: line.endsWith("?") ? line : `Which investigation is indicated for ${line.replace(/.*for /i, "").replace(/\.$/, "")}?`,
          answer: line,
        };
      }

      if (/(?:emergency|acute|urgent|shock|arrest|anaphylaxis|coma)/i.test(line)) {
        return {
          question: line.endsWith("?") ? line : `What is the key point about this emergency: ${line.slice(0, 60).replace(/\.$/, "")}...?`,
          answer: line,
        };
      }

      if (/(?:is|are|causes|presents|manifests)/i.test(line)) {
        return {
          question: line.endsWith("?") ? line : `What does this statement mean: ${line.slice(0, 60).replace(/\.$/, "")}...?`,
          answer: line,
        };
      }

      return null;
    };

    uniqueLines.forEach((line) => {
      const excerpt = line.replace(/\s+/g, " ").trim();
      if (!excerpt || excerpt.length < 35) return;
      const qa = createQuestionAnswer(excerpt);
      if (qa) {
        const tags = [];
        if (/antidote|poisoning|toxidrome/i.test(excerpt)) tags.push("Toxicology");
        if (/drug of choice|treatment|management/i.test(excerpt)) tags.push("Therapy");
        if (/investigation|diagnosis|diagnostic|test/i.test(excerpt)) tags.push("Investigation");
        if (/emergency|acute|urgent/i.test(excerpt)) tags.push("Emergency");
        addCard(qa.question, qa.answer, tags);
      }
    });

    if (cards.length === 0) {
      uniqueLines.slice(0, 5).forEach((line) => {
        const words = line.split(" ");
        if (words.length >= 8) {
          const question = `What is the main point about: ${words.slice(0, 5).join(" ")}...?`;
          addCard(question, line, ["Generated"]);
        }
      });
    }

    return cards;
  };

  const createMultipleCards = (cards) => {
    const newCards = cards.map(card => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...card,
      importedAt: new Date().toISOString(),
    }));

    setCardLibrary((prev) => {
      const existing = prev[selectedSubject] || [];
      return {
        ...prev,
        [selectedSubject]: [...newCards, ...existing],
      };
    });

    setRecentImports((prev) => [
      {
        id: newCards[0].id,
        subject: selectedSubject,
        fileName: `Generated ${newCards.length} cards`,
        fileType: "generated",
        importedAt: newCards[0].importedAt,
      },
      ...prev.slice(0, 4),
    ]);

    setFileName("");
    setFileType("");
    setNoteText("");
    setExtractedTextPreview("");
    setExtractionPreviewUrl("");
    setExtractedSourceName("");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const setCardDifficulty = (difficulty) => {
    if (!currentCard) return;
    setCardLibrary((prev) => {
      const cards = prev[subjectView] || [];
      return {
        ...prev,
        [subjectView]: cards.map((card) =>
          card.id === currentCard.id ? { ...card, difficulty } : card
        ),
      };
    });
  };

  const toggleBookmark = () => {
    if (!currentCard) return;
    setBookmarks(prev => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id]
    }));
    setNotification(bookmarks[currentCard.id] ? "Bookmark removed" : "Card bookmarked");
    setTimeout(() => setNotification(""), 2000);
  };

  const shuffleDeck = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCardLibrary(prev => ({
      ...prev,
      [subjectView]: shuffled
    }));
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setNotification("Deck shuffled");
    setTimeout(() => setNotification(""), 2000);
  };

  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSubjectView(subject);
    setSelectedSubject(subject);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setScreen("flashcards");
    setRevisionMode("");
    setActiveFilters([]);
  };

  const handleRevisionModeClick = (modeId) => {
    setRevisionMode(modeId);
    setScreen("flashcards");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const explainCard = () => {
    if (!currentCard) return;
    // This would integrate with AI API in real implementation
    setNotification("Explanation feature coming soon!");
    setTimeout(() => setNotification(""), 3000);
  };

  const getSubjectStats = (subject) => {
    const cards = cardLibrary[subject] || [];
    const total = cards.length;
    const bookmarked = cards.filter(card => bookmarks[card.id]).length;
    const recent = cards.filter(card => {
      const imported = new Date(card.importedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return imported > weekAgo;
    }).length;
    return { total, bookmarked, recent };
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      {notification && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          zIndex: 1000
        }}>
          {notification}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#ffffff" }}>
          🧠 NEET PG Rapid Cards
        </h1>

        {screen === "subjects" && (
          <>
            <div style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px",
              textAlign: "center"
            }}>
              🔥 Streak: 7 days | 🎯 Due today: 20 cards | ⭐ Weak topics: 12
            </div>

            <div style={{ marginBottom: "30px" }}>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subjects..."
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "12px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  fontSize: "16px",
                  marginBottom: "20px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginBottom: "40px"
            }}>
              {filteredSubjects.map((subject) => {
                const stats = getSubjectStats(subject);
                return (
                  <div
                    key={subject}
                    onClick={() => handleSubjectClick(subject)}
                    style={{
                      backgroundColor: "#2a2a2a",
                      border: "2px solid #444",
                      borderRadius: "15px",
                      padding: "20px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-5px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    <h3 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>
                      📘 {subject}
                    </h3>
                    <div style={{ fontSize: "14px", color: "#cccccc" }}>
                      {stats.total} cards • {stats.bookmarked} bookmarked • {stats.recent} recent
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px"
            }}>
              <h2 style={{ marginTop: 0, color: "#ffffff" }}>🚀 Rapid Revision Modes</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {REVISION_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleRevisionModeClick(mode.id)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px"
            }}>
              <h2 style={{ marginTop: 0, color: "#ffffff" }}>📄 AI Study Assistant</h2>
              <div style={{ marginBottom: "15px" }}>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #444",
                    marginRight: "10px",
                    width: "200px"
                  }}
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                <input
                  type="file"
                  accept=".pdf,image/*,text/plain"
                  onChange={handleFileChange}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #444",
                    padding: "8px",
                    borderRadius: "8px"
                  }}
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste YouTube/article link"
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #444"
                  }}
                />
                <button
                  onClick={handleLinkImport}
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Process Link
                </button>
              </div>

              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Or paste notes, screenshots, or text to generate flashcards"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  border: "1px solid #444",
                  resize: "vertical"
                }}
              />
              <button
                onClick={handleSaveNotes}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Generate Flashcards
              </button>

              {(extractedTextPreview || extractionPreviewUrl) && (
                <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #444" }}>
                  <div style={{ marginBottom: "10px", color: "#ffffff", fontWeight: "600" }}>
                    Extracted preview from {extractedSourceName || "uploaded file"}
                  </div>
                  {extractionPreviewUrl && (
                    <div style={{ marginBottom: "15px", textAlign: "center" }}>
                      <img
                        src={extractionPreviewUrl}
                        alt="Uploaded preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "240px",
                          borderRadius: "12px",
                          border: "1px solid #333"
                        }}
                      />
                    </div>
                  )}
                  <pre style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: "240px",
                    overflowY: "auto",
                    backgroundColor: "#111",
                    color: "#eee",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #333"
                  }}>
                    {extractedTextPreview || "No text was detected in this upload. Tap generate to create an image-based flashcard."}
                  </pre>
                  <button
                    onClick={handleGenerateExtractedPreview}
                    style={{
                      marginTop: "15px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Generate Flashcards from Preview
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {screen === "flashcards" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <button
                onClick={() => setScreen("subjects")}
                style={{
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                ← Back to Subjects
              </button>
              <div style={{ color: "#ffffff", fontSize: "18px" }}>
                {revisionMode ? REVISION_MODES.find(m => m.id === revisionMode)?.label : subjectView}
              </div>
              <div style={{ color: "#cccccc" }}>
                Card {currentCardIndex + 1} of {filteredCards.length}
              </div>
            </div>

            {currentCard ? (
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: "20px",
                  padding: "40px",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  transition: "transform 0.3s ease",
                  marginBottom: "30px"
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                {currentCard.imageSrc ? (
                  <>
                    <img
                      src={currentCard.imageSrc}
                      alt="Flashcard visual"
                      style={{
                        width: "100%",
                        maxWidth: "560px",
                        maxHeight: "320px",
                        objectFit: "contain",
                        borderRadius: "18px",
                        marginBottom: "20px",
                        border: "1px solid #333"
                      }}
                    />
                    <div style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: "16px"
                    }}>
                      {currentCard.question}
                    </div>
                    {showAnswer && (
                      <div style={{ fontSize: "18px", color: "#cccccc", maxWidth: "760px" }}>
                        {currentCard.answer}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginBottom: "20px"
                    }}>
                      {showAnswer ? currentCard.answer : currentCard.question}
                    </div>
                    {currentCard.tags && (
                      <div style={{ fontSize: "14px", color: "#888" }}>
                        {currentCard.tags.join(" • ")}
                      </div>
                    )}
                  </>
                )}
                <div style={{
                  marginTop: "20px",
                  fontSize: "16px",
                  color: "#cccccc"
                }}>
                  {showAnswer ? "Tap to hide answer" : "Tap to reveal answer"}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                color: "#cccccc"
              }}>
                No cards available. Go back and select a different subject or add more cards.
              </div>
            )}

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "30px"
            }}>
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                style={{
                  backgroundColor: currentCardIndex === 0 ? "#444" : "#666",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: currentCardIndex === 0 ? "not-allowed" : "pointer",
                  fontSize: "16px"
                }}
              >
                ⬅️ Previous
              </button>

              <button
                onClick={toggleBookmark}
                style={{
                  backgroundColor: bookmarks[currentCard?.id] ? "#FF5722" : "#666",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                {bookmarks[currentCard?.id] ? "❤️ Bookmarked" : "🤍 Bookmark"}
              </button>

              <button
                onClick={shuffleDeck}
                style={{
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                🔀 Shuffle
              </button>

              <button
                onClick={explainCard}
                style={{
                  backgroundColor: "#00BCD4",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                💡 Explain
              </button>

              <button
                onClick={nextCard}
                disabled={currentCardIndex >= filteredCards.length - 1}
                style={{
                  backgroundColor: currentCardIndex >= filteredCards.length - 1 ? "#444" : "#666",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: currentCardIndex >= filteredCards.length - 1 ? "not-allowed" : "pointer",
                  fontSize: "16px"
                }}
              >
                Next ➡️
              </button>
            </div>

            <div style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px"
            }}>
              <h3 style={{ marginTop: 0, color: "#ffffff" }}>🔍 Filters & Search</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                {FILTER_TAGS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    style={{
                      backgroundColor: activeFilters.includes(filter) ? "#4CAF50" : "#444",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={searchCards}
                onChange={(e) => {
                  setSearchCards(e.target.value);
                  setCurrentCardIndex(0);
                }}
                placeholder="Search within current deck..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  border: "1px solid #444"
                }}
              />
            </div>

            <div style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "15px"
            }}>
              <h3 style={{ marginTop: 0, color: "#ffffff" }}>📊 Progress & Weak Topics</h3>
              <div style={{ color: "#cccccc" }}>
                Bookmarked: {Object.keys(bookmarks).length} cards<br/>
                Weak topics: {Object.keys(mistakes.incorrect).length} areas to review<br/>
                Recent activity: {Object.keys(mistakes.bookmarks).length} bookmarked items
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
