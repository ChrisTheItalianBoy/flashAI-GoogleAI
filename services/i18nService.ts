
export type Language = 'en' | 'it' | 'es' | 'de' | 'fr';

export const languages: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
};

export const localizedUniversities: Record<Language, {name: string, domain: string}[]> = {
  en: [{ name: "MIT", domain: "mit.edu" }, { name: "Harvard", domain: "harvard.edu" }, { name: "Stanford", domain: "stanford.edu" }, { name: "Oxford", domain: "ox.ac.uk" }, { name: "Cambridge", domain: "cam.ac.uk" }],
  it: [{ name: "Politecnico di Milano", domain: "polimi.it" }, { name: "Sapienza", domain: "uniroma1.it" }, { name: "Bocconi", domain: "unibocconi.it" }, { name: "UniBologna", domain: "unibo.it" }, { name: "Luiss", domain: "luiss.it" }],
  es: [{ name: "UPV", domain: "upv.es" }, { name: "Univ. Barcelona", domain: "ub.edu" }, { name: "UNAM", domain: "unam.mx" }, { name: "Tec de Monterrey", domain: "tec.mx" }, { name: "Complutense", domain: "ucm.es" }],
  de: [{ name: "TU München", domain: "tum.de" }, { name: "ETH Zürich", domain: "ethz.ch" }, { name: "RWTH Aachen", domain: "rwth-aachen.de" }, { name: "LMU München", domain: "lmu.de" }, { name: "HU Berlin", domain: "hu-berlin.de" }],
  fr: [{ name: "Sorbonne", domain: "sorbonne-universite.fr" }, { name: "Polytechnique", domain: "polytechnique.edu" }, { name: "HEC Paris", domain: "hec.edu" }, { name: "Sciences Po", domain: "sciencespo.fr" }, { name: "ENS", domain: "ens.psl.eu" }]
};

export const localizedPricing: Record<Language, { symbol: string, value: string, subValue: string, planName: string, format: (v: string) => string }> = {
    en: { symbol: '$', value: '4.99', subValue: '7.99', planName: 'Pro', format: (v) => `$${v}` },
    it: { symbol: '€', value: '4,99', subValue: '7,99', planName: 'Pro', format: (v) => `${v} €` },
    es: { symbol: '€', value: '4,99', subValue: '7,99', planName: 'Pro', format: (v) => `${v} €` },
    de: { symbol: '€', value: '4,99', subValue: '7,99', planName: 'Pro', format: (v) => `${v} €` },
    fr: { symbol: '€', value: '4,99', subValue: '7,99', planName: 'Pro', format: (v) => `${v} €` },
};

export const detectLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0] as Language;
  if (languages[browserLang]) return browserLang;
  return 'en';
};

const en = {
    nav: {
        use_cases: "Use Cases",
        comparison: "Comparison",
        pricing: "Pricing",
        faq: "FAQ",
        mission: "Mission",
        login: "Log in",
        get_started: "Get Started Free",
        study_session: "Study Session"
    },
    hero: {
        new_badge: "New: Knowledge Graph 2.0",
        lead_magnet_badge: "🎁 Limited Time Offer",
        title_1: "Turn chaos into",
        title_2: "structured knowledge.",
        subtitle: "Upload 100+ pages of notes. Get exam-ready flashcards in seconds. The AI study partner that actually understands you.",
        email_placeholder: "Enter your email...",
        cta_free: "Get 25 Free Cards",
        motivational_1: "Don't just read.",
        motivational_a: "Master It.",
        motivational_2: "Stop forgetting what you learn.",
        trusted_by: "Trusted by top students at"
    },
    narrative: {
        problem_title: "Is Your Study Method Secretly Sabotaging Your GPA?",
        problem_sub: "You aren't just tired. You are burning precious cognitive energy on data entry.",
        agitation_bold: "The Hidden 'Study Tax'",
        agitation_text: "Let’s be honest about your Sunday night. You open a 400-slide PDF. You read. You highlight. You switch tabs. You copy. You paste. You format. Repeat 500 times. **That isn't studying.** That is manual data entry. You are wasting 3-5 hours every week just *preparing* to learn. By the time you're ready to actually memorize, your brain is fried. You are handing your 'A' grade to the student who spent that time learning, not typing.",
        solution_badge: "THE SHIFT",
        solution_title: "Reclaim 6 hours a week for the price of a coffee.",
        solution_text: "FlashAI is the definitive end to administrative study prep. We built an engine that digests dense lecture notes and textbook chapters instantly. It extracts the high-yield concepts, formats them into active recall drills, and sets up your Spaced Repetition schedule automatically. Reclaim 6 hours a week. Focus on deep work. Leave the busy work to the AI.",
        cta_urgent: "Get FlashAI Pro"
    },
    features: {
        title: "Intelligence, not just automation.",
        subtitle: "We don't just summarize. We deconstruct your materials into their atomic concepts and rebuild them for memory.",
        universal_input: "1. Structural Analysis",
        universal_desc: "We parse PDF vectors, not just text. Tables, diagrams, and document hierarchy are preserved.",
        instant: "2. Concept Extraction",
        instant_desc: "Our engine identifies 'high-yield' information versus fluff, ensuring 100% exam relevance.",
        srs: "3. Cognitive Scheduling",
        srs_desc: "The SRS algorithm adapts to your specific memory decay curve. You review only what is scientifically necessary.",
        insights: "4. Semantic Linking",
        insights_desc: "We map relationships between isolated cards to build a connected Knowledge Graph of understanding."
    },
    action: {
        badge: "Real World Power",
        title: "Built for the night before.",
        subtitle: "Whether you're cramming for Boards, the Bar, or Biology 101.",
        cases: [
            {
                icon: "🩺",
                role: "Med Students",
                input: "Anatomy_Ch4.pdf",
                question: "Wait, which nerve innervates the serratus anterior?",
                challenge: "700 pages of dense anatomy text to memorize by Friday.",
                solution: "FlashAI extracted 45 key nerve/muscle pairs.",
                items: ["Long Thoracic Nerve", "Serratus Anterior", "Winged Scapula"]
            },
            {
                icon: "⚖️",
                role: "Law Students",
                input: "Contracts_Case_Briefs.txt",
                question: "What was the holding in Hawkins v. McGee?",
                challenge: "Synthesizing 50 case briefs into actionable rules.",
                solution: "Generated rule statements and key facts for every case.",
                items: ["Hairy Hand Case", "Expectation Damages", "Assumpsit"]
            },
            {
                icon: "💻",
                role: "Developers",
                input: "AWS_Whitepaper.pdf",
                question: "Difference between S3 Standard and Intelligent-Tiering?",
                challenge: "Certification exam tomorrow. Need to spot nuances fast.",
                solution: "Created comparison cards for all service tiers.",
                items: ["S3 Standard", "Glacier Deep Archive", "99.999999999% Durability"]
            }
        ]
    },
    comparison: {
        title: "Stop wasting time on prep.",
        subtitle: "The old way is broken. See why students are switching.",
        best_value: "Best Value",
        cost: "Monthly Cost",
        workflow: "Workflow",
        smarts: "AI Intelligence",
        retention: "Retention Tech",
        manual: "Manual Entry",
        control: "Edit Control"
    },
    comparison_rows: {
        labels: {
            legacy: "Legacy Flashcards",
            chatbot: "Generic Chatbot",
            open_source: "Open Source",
            human: "Private Tutor"
        },
        features: {
            workflow: {
                1: "Manual Copy/Paste",
                2: "Manual Prompts",
                3: "Complex Setup",
                4: "Scheduling Only"
            },
            smarts: {
                1: "None",
                2: "Generic Conversation",
                3: "None",
                4: "Human Expertise"
            },
            retention: {
                1: "Basic Repeat",
                2: "None",
                3: "Complex Algorithms",
                4: "Guided Practice"
            },
            control: {
                free: "Auto-Generation Only",
                pro: "Manual Add & Specific Excerpts"
            }
        }
    },
    landing_faq: {
        title: "Common Questions",
        link: "View all FAQs"
    },
    cta_bottom: {
        badge: "Ready to Start?",
        title_pre: "Transform your next exam into a ",
        title_highlight: "success",
        title_post: ". GUARANTEED.",
        conviction_sub: "Already convinced? Skip the trial and get unlimited power immediately.",
        feat_1: "Start instantly, no card needed",
        feat_2: "3 free decks every single day",
        feat_3: "Full Pro access, zero risk",
        button: "Try us for 7 days",
        cancel: ""
    },
    pricing: {
        title: "Simple, student-friendly pricing.",
        subtitle: "Invest in your GPA for less than the price of a coffee.",
        free_plan: "Student Starter",
        free_sub: "Perfect for casual study.",
        pro_plan: "Honor Roll",
        pro_sub: "For serious academic weapons.",
        enterprise: "Institution",
        enterprise_sub: "For schools & departments.",
        custom: "Custom",
        month: "/mo",
        start_free: "Start for Free",
        upgrade: "Upgrade to Pro",
        contact: "Contact Sales",
        guarantee: "7-Day Money-Back Guarantee"
    },
    pricing_page: {
        core_features: "Core Features",
        advanced_tools: "Advanced Tools",
        table: {
            rows: {
                ai_gen: "AI Deck Generation",
                cards_deck: "Cards per Deck",
                srs: "Spaced Repetition (SRS)",
                knowledge_graph: "Knowledge Graph",
                upload_limit: "File Upload Limit",
                export: "Export Data"
            },
            values: {
                "3_decks": "3 Decks / Day",
                "unlimited": "Unlimited",
                "5_cards": "5 Cards (Preview)",
                "50_cards": "50 Cards (Deep Dive)",
                "custom": "Custom",
                "included": "Included",
                "unlimited_nodes": "Unlimited Nodes",
                "team_graph": "Team Graph",
                "2_mb": "2 MB",
                "10_mb": "10 MB",
                "500_mb": "500 MB",
                "text_only": "Text Only",
                "json_pdf": "JSON, PDF, CSV",
                "api_access": "API Access",
                "pro_only": "PRO ONLY"
            }
        },
        transparency: {
            title: "Where does your money go?",
            desc: "We believe in transparency. Your subscription directly funds the GPU compute needed to analyze your documents and generate high-quality reasoning.",
            items: [
                { cost: "65%", label: "LLM Compute (FlashAI Neural Engine)" },
                { cost: "20%", label: "Product Development" },
                { cost: "15%", label: "Server Costs & Hosting" },
            ],
            guarantee: "The 'A+' Guarantee",
            guarantee_text: "If FlashAI doesn't help you study better in your first week, we'll refund you. No questions asked."
        }
    },
    page_content: {
        use_cases: {
            badge: "Use Cases",
            title: "Who uses FlashAI?",
            subtitle: "From medical school to coding bootcamps, we help learners condense massive information loads.",
            cards: [
                { emoji: "🩺", title: "Medical & Nursing", desc: "Anatomy, Pharmacology, and Pathology. Turn thousands of textbook pages into active recall drills.", tags: ["Heavy Reading", "Memorization"] },
                { emoji: "⚖️", title: "Law School", desc: "Case briefs, statutes, and definitions. Quickly digest dense legal PDFs into rule-based flashcards.", tags: ["Structure", "Logic"] },
                { emoji: "🔬", title: "STEM & Engineering", desc: "Formulas, theorems, and processes. Our LaTeX support handles math beautifully.", tags: ["Math Support", "Formulas"] },
                { emoji: "🌍", title: "Language Learning", desc: "Vocabulary lists and grammar rules. Upload a story in your target language and get a vocab deck instantly.", tags: ["Vocab", "Grammar"] }
            ],
            deep_dives: "Deep Dive Scenarios",
            scenarios: {
                med: {
                    title: "The Med Student Grind",
                    quote: "I have 400 slides on the Cardiovascular System due tomorrow.",
                    list: ["Upload lecture PDF", "AI identifies key pathologies", "Generates symptom/diagnosis pairs"],
                    desc_title: "Focus on Diagnosis, not Data Entry",
                    desc_body: "Instead of spending 4 hours typing out cards from your lecture slides, drag and drop the PDF. FlashAI extracts the clinical pearls and creates scenario-based cards."
                },
                dev: {
                    title: "The AWS Certification",
                    quote: "I need to know the difference between every S3 storage class.",
                    list: ["Paste documentation text", "AI creates comparison tables", "Drills on specific limits"],
                    desc_title: "Pass the Exam Faster",
                    desc_body: "Technical documentation is dry. FlashAI turns documentation into a quiz, forcing you to actively recall the difference between 'Consistency' and 'Availability'."
                }
            },
            cta: {
                title: "Stop typing. Start learning.",
                sub: "Join thousands of students saving 10+ hours a week.",
                btn: "Try FlashAI Free"
            }
        },
        about: {
            mission_badge: "Our Mission",
            title_1: "Accelerating the world's",
            title_2: "learning curve.",
            desc: "We believe human potential is limited only by how fast we can learn. Our goal is to remove the friction between information and knowledge.",
            stats: {
                learners: "Active Learners",
                cards: "Cards Created",
                countries: "Countries",
                uptime: "Uptime"
            },
            origin_title: "Why we built this.",
            origin_text_1: "We were tired of the 'study tax'—the hours spent formatting bold text, copying definitions, and managing decks before you even start studying.",
            origin_text_2: "FlashAI was born in a dorm room during finals week. We wanted a tool that could look at a PDF and say, 'Here is what you need to know.'",
            origin_chart: {
                manual: "Manual Flashcard Creation",
                manual_time: "4 Hours",
                ai: "FlashAI Generation",
                ai_time: "30 Seconds"
            },
            tech: {
                badge: "The Technology",
                title: "Built on FlashAI Intelligence",
                desc: "We use our latest multimodal models to understand not just text, but the structure and context of your documents."
            },
            team: {
                title: "Join the movement.",
                desc: "We are a small, dedicated team building the future of education.",
                goal: "Help us kill rote memorization.",
                btn: "Start Studying Now"
            }
        },
        contact: {
            title: "Get in touch.",
            subtitle: "Questions? Enterprise inquiry? Just want to say hi?",
            info: {
                get_in_touch: "Contact Information",
                email_t: "Email Us",
                email_d: "For general inquiries and support.",
                hq_t: "Headquarters",
                agent_t: "Live Chat",
                agent_d: "Our AI agent Quantum is available 24/7."
            },
            form: {
                success_t: "Message Sent!",
                success_d: "We'll get back to you within 24 hours.",
                another: "Send another message",
                name: "Your Name",
                email: "Email Address",
                subject: "Subject",
                message: "Message",
                btn: "Send Message"
            }
        },
        footer: {
            tagline: "The AI-powered study assistant for the modern student.",
            headers: {
                product: "Product",
                company: "Company",
                support: "Support"
            },
            links: {
                pricing: "Pricing",
                use_cases: "Use Cases",
                features: "Features",
                mission: "Mission",
                careers: "Careers",
                legal: "Legal",
                faq: "FAQ",
                contact: "Contact",
                privacy: "Privacy Policy",
                terms: "Terms of Service"
            },
            copy: "© 2024 FlashAI Inc. All rights reserved."
        },
        faq_sub: "Everything you need to know about the product and billing."
    },
    auth: {
        login_title: "Welcome Back",
        signup_title: "Create Account",
        login_btn: "Log In",
        signup_btn: "Sign Up",
        email: "Email Address",
        password: "Password",
        password_req: "At least 8 chars, 1 number, 1 special char.",
        forgot: "Forgot Password?",
        reset: "Reset Password",
        bonus: "+15 Bonus Cards Unlocked!"
    },
    dashboard: {
        library: "My Library",
        welcome: "Welcome back",
        search: "Search decks...",
        grid_view: "Grid",
        graph_view: "Graph",
        new_deck: "New Deck",
        graph_active: "Knowledge Graph Active",
        graph_desc: "Visualizing connections between your study topics.",
        no_results: "No decks found matching",
        no_decks: "Your library is empty",
        empty_desc: "Get started by generating your first AI flashcard deck.",
        create_first: "Crea tu primer mazo",
        clear_search: "Borrar búsqueda",
        review: "Review Due"
    },
    deck: {
        card: "Card",
        of: "of",
        end: "End Session",
        exit: "Exit Review",
        start_over: "Start Over",
        question: "QUESTION",
        answer: "ANSWER",
        show_answer: "Show Answer",
        show_question: "Show Question",
        session_comp: "Session Complete!",
        review_comp: "Review Complete!",
        back: "Back to Dashboard",
        add_card: "Add Card"
    },
    upload: {
        drop: "Drop file here",
        drag: "Drag & drop your file",
        limit: "PDF or TXT",
        error_type: "Only PDF and TXT files are supported.",
        error_size: "File size exceeds limit."
    },
    settings: {
        title: "Settings",
        sub: "Manage your account preferences and subscription.",
        personal: "Personal Information",
        display_name: "Display Name",
        update_profile: "Update Profile",
        security: "Security",
        curr_pwd: "Current Password",
        forgot_pwd: "Forgot?",
        new_pwd: "New Password",
        confirm_pwd: "Confirm New Password",
        change_pwd: "Change Password",
        subscription: "Subscription",
        upgrade: "Upgrade Plan",
        refund: "Request Refund",
        cancel: "Cancel Subscription",
        payment: "Payment Methods",
        comms: "Communication",
        daily_email: "Daily Study Reminder",
        marketing: "Product Updates & Tips",
        save: "Save Preferences",
        data: "Data & Privacy",
        export: "Export Data",
        delete: "Delete Account"
    }
};

const it = {
    nav: {
        use_cases: "Casi d'Uso",
        comparison: "Confronto",
        pricing: "Prezzi",
        faq: "FAQ",
        mission: "Missione",
        login: "Accedi",
        get_started: "Inizia Gratis",
        study_session: "Sessione Studio"
    },
    hero: {
        new_badge: "Novità: Knowledge Graph 2.0",
        lead_magnet_badge: "🎁 Offerta a Tempo Limitato",
        title_1: "Trasforma il caos in",
        title_2: "conoscenza strutturata.",
        subtitle: "Carica 100+ pagine di appunti. Ottieni flashcard pronte per l'esame in secondi. Il partner di studio AI che ti capisce davvero.",
        email_placeholder: "La tua email...",
        cta_free: "Ottieni 25 Carte Gratis",
        motivational_1: "Non limitarti a leggere.",
        motivational_a: "Domina.", 
        motivational_2: "Smetti di dimenticare ciò che impari.",
        trusted_by: "Scelto dai migliori studenti di"
    },
    narrative: {
        problem_title: "Il tuo metodo di studio sta sabotando i tuoi voti?",
        problem_sub: "Non sei solo stanco. Stai bruciando energia cognitiva preziosa in data entry.",
        agitation_bold: "La 'Tassa sullo Studio' Nascosta",
        agitation_text: "Siamo onesti sul tuo flusso di lavoro. Apri un PDF di 400 slide. Leggi. Evidenzi. Cambi scheda. Copi. Incolli. Formatti. Ripeti 500 volte. **Questo non è studiare.** Questo è lavoro amministrativo. Stai sprecando 3-5 ore ogni settimana solo per *prepararti* a imparare. Quando sei pronto per memorizzare davvero, il tuo cervello è esausto. Stai regalando il tuo 30 e lode a chi ha usato quel tempo per imparare, non per scrivere.",
        solution_badge: "LA SVOLTA",
        solution_title: "Recupera 6 ore a settimana al prezzo di un panino.",
        solution_text: "FlashAI è la fine della preparazione manuale. Abbiamo costruito un motore che digerisce istantaneamente appunti densi e libri di testo. Estrae i concetti ad alto rendimento, li formatta in esercizi di richiamo attivo e imposta automaticamente il tuo programma di Ripetizione Spaziata. Recupera 6 ore a settimana. Concentrati sul lavoro profondo. Lascia il lavoro noioso all'AI.",
        cta_urgent: "Ottieni FlashAI Pro"
    },
    features: {
        title: "Intelligenza, non solo automazione.",
        subtitle: "Non riassumiamo semplicemente. Decostruiamo i tuoi materiali in concetti atomici e li ricostruiamo per la memoria.",
        universal_input: "1. Analisi Strutturale",
        universal_desc: "Analizziamo i vettori PDF, non solo il testo. Tabelle, diagrammi e gerarchie dei documenti vengono preservati.",
        instant: "2. Estrazione Concettuale",
        instant_desc: "Il motore identifica le informazioni 'ad alto rendimento' rispetto al riempitivo, garantendo il 100% di rilevanza per l'esame.",
        srs: "3. Scheduling Cognitivo",
        srs_desc: "L'algoritmo SRS si adatta alla tua curva di oblio specifica. Ripassi solo ciò che è scientificamente necessario.",
        insights: "4. Collegamento Semantico",
        insights_desc: "Mappiamo le relazioni tra carte isolate per costruire un Knowledge Graph connesso di comprensione."
    },
    action: {
        badge: "Potere Reale",
        title: "Costruito per la notte prima.",
        subtitle: "Che tu stia studiando per Medicina, Giurisprudenza o Ingegneria.",
        cases: [
            {
                icon: "🩺",
                role: "Studenti Medicina",
                input: "Anatomia_Cap4.pdf",
                question: "Aspetta, quale nervo innerva il dentato anteriore?",
                challenge: "700 pagine di anatomia da memorizzare entro venerdì.",
                solution: "FlashAI ha estratto 45 coppie chiave nervo/muscolo.",
                items: ["Nervo Toracico Lungo", "Dentato Anteriore", "Scapola Alata"]
            },
            {
                icon: "⚖️",
                role: "Studenti Legge",
                input: "Diritto_Privato_Casi.txt",
                question: "Qual è la sentenza nel caso Hawkins v. McGee?",
                challenge: "Sintetizzare 50 casi in regole azionabili.",
                solution: "Generati principi di diritto e fatti chiave per ogni caso.",
                items: ["Responsabilità", "Danno Emergente", "Lucro Cessante"]
            },
            {
                icon: "💻",
                role: "Sviluppatori",
                input: "AWS_Whitepaper.pdf",
                question: "Differenza tra S3 Standard e Intelligent-Tiering?",
                challenge: "Esame di certificazione domani. Serve capire le sfumature.",
                solution: "Create tabelle di confronto per tutti i livelli di servizio.",
                items: ["S3 Standard", "Glacier Deep Archive", "99.99% Durabilità"]
            }
        ]
    },
    comparison: {
        title: "Smetti di perdere tempo.",
        subtitle: "Il vecchio metodo è rotto. Scopri perché gli studenti stanno cambiando.",
        best_value: "Miglior Valore",
        cost: "Costo Mensile",
        workflow: "Flusso di Lavoro",
        smarts: "Intelligenza AI",
        retention: "Tecnologia Ritenzione",
        manual: "Inserimento Manuale",
        control: "Controllo Modifiche"
    },
    comparison_rows: {
        labels: {
            legacy: "Flashcard Vecchia Scuola",
            chatbot: "Chatbot Generico",
            open_source: "Open Source",
            human: "Tutor Privato"
        },
        features: {
            workflow: {
                1: "Copia/Incolla Manuale",
                2: "Prompt Manuali",
                3: "Setup Complesso",
                4: "Solo Pianificazione"
            },
            smarts: {
                1: "Nessuna",
                2: "Conversazione Generica",
                3: "Nessuna",
                4: "Esperienza Umana"
            },
            retention: {
                1: "Ripetizione Base",
                2: "Nessuna",
                3: "Algoritmos Complessi",
                4: "Pratica Guidata"
            },
            control: {
                free: "Solo Generazione Auto",
                pro: "Aggiunta Manuale & Testo Specifico"
            }
        }
    },
    landing_faq: {
        title: "Domande Frequenti",
        link: "Vedi tutte le FAQ"
    },
    cta_bottom: {
        badge: "Pronto a iniziare?",
        title_pre: "Trasforma il tuo prossimo esame in un ",
        title_highlight: "successo",
        title_post: ". GARANTITO.",
        conviction_sub: "Già convinto? Salta la prova e sblocca subito il potere illimitato.",
        feat_1: "Inizia subito, nessuna carta richiesta",
        feat_2: "3 mazzi gratuiti ogni giorno",
        feat_3: "Accesso Pro completo, zero rischi",
        button: "Provaci per 7 giorni",
        cancel: ""
    },
    pricing: {
        title: "Prezzi semplici, a misura di studente.",
        subtitle: "Investi nella tua media voti per meno del prezzo di un caffè.",
        free_plan: "Starter Studente",
        free_sub: "Perfetto per lo studio occasionale.",
        pro_plan: "Lode & Bacio Accademico",
        pro_sub: "Per vere macchine da guerra accademiche.",
        enterprise: "Istituzione",
        enterprise_sub: "Per scuole e dipartimenti.",
        custom: "Su Misura",
        month: "/mese",
        start_free: "Inizia Gratis",
        upgrade: "Passa a Pro",
        contact: "Contatta Vendite",
        guarantee: "Garanzia 7 Giorni"
    },
    pricing_page: {
        core_features: "Funzionalità Base",
        advanced_tools: "Strumenti Avanzati",
        table: {
            rows: {
                ai_gen: "Generazione Mazzi AI",
                cards_deck: "Carte per Mazzo",
                srs: "Ripetizione Spaziata (SRS)",
                knowledge_graph: "Knowledge Graph",
                upload_limit: "Limite Upload File",
                export: "Esportazione Dati"
            },
            values: {
                "3_decks": "3 Mazzi / Giorno",
                "unlimited": "Illimitati",
                "5_cards": "5 Carte (Anteprima)",
                "50_cards": "50 Carte (Deep Dive)",
                "custom": "Su Misura",
                "included": "Incluso",
                "unlimited_nodes": "Nodi Illimitati",
                "team_graph": "Grafico Team",
                "2_mb": "2 MB",
                "10_mb": "10 MB",
                "500_mb": "500 MB",
                "text_only": "Solo Testo",
                "json_pdf": "JSON, PDF, CSV",
                "api_access": "Accesso API",
                "pro_only": "SOLO PRO"
            }
        },
        transparency: {
            title: "Dove vanno i tuoi soldi?",
            desc: "Crediamo nella trasparenza. Il tuo abbonamento finanzia direttamente la potenza di calcolo GPU necessaria per analizzare i tuoi documenti e generare ragionamenti di alta qualità.",
            items: [
                { cost: "65%", label: "Calcolo LLM (FlashAI Neural Engine)" },
                { cost: "20%", label: "Sviluppo Prodotto" },
                { cost: "15%", label: "Costi Server & Hosting" },
            ],
            guarantee: "La Garanzia '30 e Lode'",
            guarantee_text: "Se FlashAI non ti aiuta a studiare meglio nella prima settimana, ti rimborsiamo. Senza domande."
        }
    },
    page_content: {
        use_cases: {
            badge: "Casi d'Uso",
            title: "Chi usa FlashAI?",
            subtitle: "Dalla facoltà di medicina ai bootcamp di coding, aiutiamo gli studenti a condensare enormi carichi di informazioni.",
            cards: [
                { emoji: "🩺", title: "Medicina & Infermieristica", desc: "Anatomia, Farmacologia e Patologia. Trasforma migliaia di pagine di manuali in esercizi di richiamo attivo.", tags: ["Lettura Intensa", "Memorizzazione"] },
                { emoji: "⚖️", title: "Giurisprudenza", desc: "Sentenze, statuti e definizioni. Digerisci rapidamente densi PDF legali in flashcard basate su regole.", tags: ["Struttura", "Logica"] },
                { emoji: "🔬", title: "STEM & Ingegneria", desc: "Formule, teoremi e processi. Il nostro supporto LaTeX gestisce la matematica magnificamente.", tags: ["Supporto Math", "Formule"] },
                { emoji: "🌍", title: "Lingue", desc: "Liste vocaboli e regole grammaticali. Carica una storia nella tua lingua target e ottieni subito un mazzo vocaboli.", tags: ["Vocaboli", "Grammatica"] }
            ],
            deep_dives: "Scenari Approfonditi",
            scenarios: {
                med: {
                    title: "La Maratona di Medicina",
                    quote: "Ho 400 slide sul Sistema Cardiovascolare per domani.",
                    list: ["Carica PDF lezione", "AI identifica patologie chiave", "Genera coppie sintomo/diagnosi"],
                    desc_title: "Focus sulla Diagnosi, non sul Data Entry",
                    desc_body: "Invece di passare 4 ore a trascrivere carte dalle tue slide, trascina e rilascia il PDF. FlashAI estrae le perle cliniche e crea carte basate su scenari."
                },
                dev: {
                    title: "La Certification AWS",
                    quote: "Devo conoscere la differenza tra ogni classe di storage S3.",
                    list: ["Incolla testo documentazione", "AI crea tabelle comparative", "Esercizi su limiti specifici"],
                    desc_title: "Passa l'Esame più in Fretta",
                    desc_body: "La documentazione tecnica è arida. FlashAI la trasforma in un quiz, costringendoti a ricordare attivamente la differenza tra 'Consistenza' e 'Disponibilità'."
                }
            },
            cta: {
                title: "Smetti di scrivere. Inizia a imparare.",
                sub: "Unisciti a migliaia di studenti che risparmiano 10+ ore a settimana.",
                btn: "Prova FlashAI Gratis"
            }
        },
        about: {
            mission_badge: "La Nostra Missione",
            title_1: "Accelerare la curva di",
            title_2: "apprendimento globale.",
            desc: "Crediamo che il potenziale umano sia limitato solo da quanto velocemente possiamo imparare. Il nostro obiettivo è rimuovere l'attrito tra informazione e conoscenza.",
            stats: {
                learners: "Studenti Attivi",
                cards: "Carte Create",
                countries: "Paesi",
                uptime: "Uptime"
            },
            origin_title: "Perché l'abbiamo creato.",
            origin_text_1: "Eravamo stanchi della 'tassa sullo studio'—le ore spese a formattare testo in grassetto, copiare definizioni e gestire mazzi prima ancora di iniziare a studiare.",
            origin_text_2: "FlashAI è nato in una stanza di dormitorio durante la sessione d'esami. Volevamo uno strumento che potesse guardare un PDF e dire: 'Ecco cosa devi sapere.'",
            origin_chart: {
                manual: "Creazione Manuale",
                manual_time: "4 Ore",
                ai: "Generazione FlashAI",
                ai_time: "30 Secondi"
            },
            tech: {
                badge: "La Tecnologia",
                title: "Costruito su FlashAI-1.5",
                desc: "Usamos gli ultimi modelli multimodimodales per comprendere non solo il testo, ma la struttura e il contesto dei tuoi documenti."
            },
            team: {
                title: "Unisciti al movimento.",
                desc: "Siamo un piccolo team dedicato a costruire il futuro dell'istruzione.",
                goal: "Aiutaci a uccidere la memorizzazione meccanica.",
                btn: "Inizia a Studiare Ora"
            }
        },
        contact: {
            title: "Contattaci.",
            subtitle: "Domande? Richieste aziendali? Vuoi solo salutare?",
            info: {
                get_in_touch: "Informazioni di Contatto",
                email_t: "Scrivici",
                email_d: "Per richieste generali e supporto.",
                hq_t: "Sede Centrale",
                agent_t: "Live Chat",
                agent_d: "Il nostro agente AI Quantum è disponibile 24/7."
            },
            form: {
                success_t: "Messaggio Inviato!",
                success_d: "Ti risponderemo entro 24 ore.",
                another: "Invia un altro messaggio",
                name: "Il Tuo Nome",
                email: "Indirizzo Email",
                subject: "Oggetto",
                message: "Messaggio",
                btn: "Invia Messaggio"
            }
        },
        footer: {
            tagline: "L'assistente di studio AI per lo studente moderno.",
            headers: {
                product: "Prodotto",
                company: "Azienda",
                support: "Supporto"
            },
            links: {
                pricing: "Prezzi",
                use_cases: "Casi d'Uso",
                features: "Funzionalità",
                mission: "Missione",
                careers: "Carriere",
                legal: "Legale",
                faq: "FAQ",
                contact: "Contatti",
                privacy: "Politique de Confidentialité",
                terms: "Conditions d'Utilisation"
            },
            copy: "© 2024 FlashAI Inc. Tutti i diritti riservati."
        },
        faq_sub: "Tutto quello che devi sapere sul prodotto e la fatturazione."
    },
    auth: {
        login_title: "Bentornato",
        signup_title: "Crea Account",
        login_btn: "Accedi",
        signup_btn: "Registrati",
        email: "Indirizzo Email",
        password: "Password",
        password_req: "Almeno 8 caratteri, 1 numero, 1 carattere speciale.",
        forgot: "Password dimenticata?",
        reset: "Resetta Password",
        bonus: "+15 Carte Bonus Sbloccate!"
    },
    dashboard: {
        library: "La Mia Libreria",
        welcome: "Bentornato",
        search: "Cerca mazzi...",
        grid_view: "Griglia",
        graph_view: "Grafo",
        new_deck: "Nuovo Mazzo",
        graph_active: "Knowledge Graph Attivo",
        graph_desc: "Visualizzazione delle connessioni tra i tuoi argomenti di studio.",
        no_results: "Nessun mazzo trovato per",
        no_decks: "La tua libreria è vuota",
        empty_desc: "Inizia generando il tuo primo mazzo di flashcard AI.",
        create_first: "Crea il tuo primo mazzo",
        clear_search: "Cancella ricerca",
        review: "Ripasso Scaduto"
    },
    deck: {
        card: "Carta",
        of: "di",
        end: "Termina Sessione",
        exit: "Esci dal Ripasso",
        start_over: "Ricomincia",
        question: "DOMANDA",
        answer: "RISPOSTA",
        show_answer: "Mostra Risposta",
        show_question: "Mostra Domanda",
        session_comp: "Sessione Completata!",
        review_comp: "Ripasso Completato!",
        back: "Torna alla Dashboard",
        add_card: "Aggiungi Carta"
    },
    upload: {
        drop: "Rilascia file qui",
        drag: "Trascina il tuo file",
        limit: "PDF o TXT",
        error_type: "Solo file PDF e TXT sono supportati.",
        error_size: "Dimensione file eccessiva."
    },
    settings: {
        title: "Impostazioni",
        sub: "Gestisci le preferenze del tuo account e l'abbonamento.",
        personal: "Informazioni Personali",
        display_name: "Nome Visualizzato",
        update_profile: "Aggiorna Profilo",
        security: "Sicurezza",
        curr_pwd: "Password Attuale",
        forgot_pwd: "Dimenticata?",
        new_pwd: "Nuova Password",
        confirm_pwd: "Conferma Nuova Password",
        change_pwd: "Cambia Password",
        subscription: "Abbonamento",
        upgrade: "Passa al Piano Pro",
        refund: "Richiedi Rimborso",
        cancel: "Cancella Abbonamento",
        payment: "Metodi di Pagamento",
        comms: "Comunicazioni",
        daily_email: "Promemoria Studio Giornaliero",
        marketing: "Aggiornamenti Prodotto & Consigli",
        save: "Salva Preferenze",
        data: "Dati & Privacy",
        export: "Esporta Dati",
        delete: "Elimina Account"
    }
};

const es = {
    nav: {
        use_cases: "Casos de Uso",
        comparison: "Comparación",
        pricing: "Precios",
        faq: "FAQ",
        mission: "Misión",
        login: "Iniciar Sesión",
        get_started: "Empezar Gratis",
        study_session: "Sesión de Estudio"
    },
    hero: {
        new_badge: "Nuevo: Knowledge Graph 2.0",
        lead_magnet_badge: "🎁 Oferta Limitada",
        title_1: "Convierte el caos en",
        title_2: "conocimiento estructurado.",
        subtitle: "Sube más de 100 páginas de apuntes. Obtén tarjetas de estudio listas para el examen en segundos. El compañero de estudio con IA que realmente te entiende.",
        email_placeholder: "Tu correo electrónico...",
        cta_free: "Obtén 25 Tarjetas Gratis",
        motivational_1: "No solo leas.",
        motivational_a: "Domínalo.",
        motivational_2: "Deja de olvidar lo que aprendes.",
        trusted_by: "Elegido por los mejores estudiantes de"
    },
    narrative: {
        problem_title: "¿Tu método de estudio está saboteando tus notas?",
        problem_sub: "No estás solo cansado. Estás quemando energía cognitiva preciosa en entrada de datos.",
        agitation_bold: "El 'Impuesto al Estudio' Oculto",
        agitation_text: "Seamos honestos sobre tu domingo por la noche. Abres un PDF de 400 diapositivas. Lees. Resaltas. Cambias de pestaña. Copias. Pegas. Formateas. Repites 500 veces. **Eso no es estudiar.** Eso es trabajo administrativo. Estás desperdiciando 3-5 horas cada semana solo para *prepararte* para aprender. Cuando estás listo para memorizar de verdad, tu cerebro está frito. Le estás regalando tu 'A' al estudiante que pasó ese tiempo aprendiendo, no escribiendo.",
        solution_badge: "EL CAMBIO",
        solution_title: "Recupera 6 horas a la semana por el precio de un bocadillo.",
        solution_text: "FlashAI es el fin de la preparación manual de estudio. Hemos construido un motor que digiere notas densas y libros de texto al instante. Extrae los conceptos de alto rendimiento, los formatea en ejercicios de recuerdo activo y configura tu horario de Repetición Espaciada automáticamente. Recupera 6 horas a la semana. Enfócate en el trabajo profundo. Deja el trabajo pesado a la IA.",
        cta_urgent: "Obtén FlashAI Pro"
    },
    features: {
        title: "Inteligencia, no solo automatización.",
        subtitle: "No nos limitamos a resumir. Deconstruimos tus materiales en sus conceptos atómicos y los reconstruimos para la memoria.",
        universal_input: "1. Análisis Estructural",
        universal_desc: "Analizamos vectores PDF, no solo texto. Las tablas, diagramas y jerarquías de documentos se preservan.",
        instant: "2. Extracción de Conceptos",
        instant_desc: "Nuestro motor identifica información de 'alto rendimiento' frente a la paja, asegurando 100% relevancia para el examen.",
        srs: "3. Programación Cognitiva",
        srs_desc: "El algoritmo SRS se adapta a tu curva de olvido específica. Repasas solo lo que es científicamente necesario.",
        insights: "4. Enlace Semántico",
        insights_desc: "Mapeamos relaciones entre tarjetas aisladas para construir un Knowledge Graph conectado de comprensión."
    },
    action: {
        badge: "Poder Real",
        title: "Construido para la noche anterior.",
        subtitle: "Ya sea que estés estudiando para Medicina, Derecho o Ingeniería.",
        cases: [
            {
                icon: "🩺",
                role: "Estudiantes Medicina",
                input: "Anatomia_Cap4.pdf",
                question: "Espera, ¿qué nervio inerva el serrato anterior?",
                challenge: "700 páginas de anatomía para memorizar antes del viernes.",
                solution: "FlashAI extrajo 45 pares clave nervio/músculo.",
                items: ["Nervio Torácico Largo", "Serrato Anterior", "Escápula Alada"]
            },
            {
                icon: "⚖️",
                role: "Estudiantes Derecho",
                input: "Derecho_Civil_Casos.txt",
                question: "¿Cuál es el fallo en el caso Hawkins v. McGee?",
                challenge: "Sintetizar 50 casos en reglas accionables.",
                solution: "Principios de derecho y hechos clave generados para cada caso.",
                items: ["Responsabilidad", "Daño Emergente", "Lucro Cesante"]
            },
            {
                icon: "💻",
                role: "Desarrolladores",
                input: "AWS_Whitepaper.pdf",
                question: "¿Diferencia entre S3 Standard e Intelligent-Tiering?",
                challenge: "Examen de certificación mañana. Necesito entender los matices.",
                solution: "Tablas comparativas creadas para todos los niveles de servicio.",
                items: ["S3 Standard", "Glacier Deep Archive", "99.99% Durabilidad"]
            }
        ]
    },
    comparison: {
        title: "Deja de perder tiempo.",
        subtitle: "El método antiguo está roto. Descubre por qué los estudiantes están cambiando.",
        best_value: "Mejor Valor",
        cost: "Costo Mensual",
        workflow: "Flujo de Trabajo",
        smarts: "Inteligencia IA",
        retention: "Tecnología Retención",
        manual: "Entrada Manual",
        control: "Control de Edición"
    },
    comparison_rows: {
        labels: {
            legacy: "Tarjetas Tradicionales",
            chatbot: "Chatbot Genérico",
            open_source: "Open Source",
            human: "Tutor Privado"
        },
        features: {
            workflow: {
                1: "Copiar/Pegar Manual",
                2: "Copiar/Pegar Manual",
                3: "Configuración Compleja",
                4: "Solo Planificación"
            },
            smarts: {
                1: "Ninguna",
                2: "Conversación Genérica",
                3: "Ninguna",
                4: "Experiencia Humana"
            },
            retention: {
                1: "Repetición Básica",
                2: "Ninguna",
                3: "Algoritmos Complejos",
                4: "Práctica Guiada"
            },
            control: {
                free: "Solo Generación Auto",
                pro: "Añadir Manual y Extractos"
            }
        }
    },
    landing_faq: {
        title: "Preguntas Frecuentes",
        link: "Ver todas las FAQ"
    },
    cta_bottom: {
        badge: "¿Listo para empezar?",
        title_pre: "Transforma tu próximo examen en un ",
        title_highlight: "éxito",
        title_post: ". GARANTIZADO.",
        conviction_sub: "¿Ya estás convencido? Sáltate la prueba y desbloquea poder ilimitado.",
        feat_1: "Empieza ya sin tarjeta",
        feat_2: "3 mazos gratis al día",
        feat_3: "Acceso total sin riesgos",
        button: "Pruébanos por 7 días",
        cancel: ""
    },
    pricing: {
        title: "Precios simples, pensados para estudiantes.",
        subtitle: "Invierte en tu promedio por menos de lo que cuesta un café.",
        free_plan: "Starter Estudiante",
        free_sub: "Perfecto para el estudio casual.",
        pro_plan: "Cuadro de Honor",
        pro_sub: "Para verdaderas máquinas académicas.",
        enterprise: "Institution",
        enterprise_sub: "Para escuelas y departamentos.",
        custom: "A Medida",
        month: "/mes",
        start_free: "Empieza Gratis",
        upgrade: "Pásate a Pro",
        contact: "Contactar Ventas",
        guarantee: "Garantía de 7 Días"
    },
    pricing_page: {
        core_features: "Características Básicas",
        advanced_tools: "Herramientas Avanzadas",
        table: {
            rows: {
                ai_gen: "Generación de Mazos con IA",
                cards_deck: "Tarjetas por Mazo",
                srs: "Repetición Espaciada (SRS)",
                knowledge_graph: "Knowledge Graph",
                upload_limit: "Límite Subida Archivos",
                export: "Exportación de Datos"
            },
            values: {
                "3_decks": "3 Mazos / Día",
                "unlimited": "Ilimitados",
                "5_cards": "5 Tarjetas (Vista Previa)",
                "50_cards": "50 Tarjetas (Profundo)",
                "custom": "A Medida",
                "included": "Incluido",
                "unlimited_nodes": "Nodos Ilimitados",
                "team_graph": "Gráfico de Equipo",
                "2_mb": "2 MB",
                "10_mb": "10 MB",
                "500_mb": "500 MB",
                "text_only": "Solo Texto",
                "json_pdf": "JSON, PDF, CSV",
                "api_access": "Acceso API",
                "pro_only": "SOLO PRO"
            }
        },
        transparency: {
            title: "¿A dónde va tu dinero?",
            desc: "Creemos en la transparencia. Tu suscripción financia directamente el poder de cómputo GPU necesario para analizar tus documentos y generar razonamientos de alta calidad.",
            items: [
                { cost: "65%", label: "Cómputo LLM (FlashAI Neural Engine)" },
                { cost: "20%", label: "Desarrollo de Producto" },
                { cost: "15%", label: "Costos de Servidor y Hosting" },
            ],
            guarantee: "La Garantía 'Sobresaliente'",
            guarantee_text: "Si FlashAI no te ayuda a estudiar mejor en tu primera semana, te devolvemos el dinero. Sin preguntas."
        }
    },
    page_content: {
        use_cases: {
            badge: "Casos de Uso",
            title: "¿Quién usa FlashAI?",
            subtitle: "Desde la facultad de medicina hasta los bootcamps de programación, ayudamos a los estudiantes a condensare enormi cargas de información.",
            cards: [
                { emoji: "🩺", title: "Medicina y Enfermería", desc: "Anatomía, Farmacologia y Patología. Convierte miles de páginas de manuali en ejercicios de recuerdo activo.", tags: ["Lectura Intensa", "Memorización"] },
                { emoji: "⚖️", title: "Derecho", desc: "Sentencias, estatutos y definiciones. Digiere rápidamente densos PDFs legales en tarjetas basadas en reglas.", tags: ["Estructura", "Lógica"] },
                { emoji: "🔬", title: "STEM e Ingeniería", desc: "Fórmulas, teoremas y procesos. Nuestro soporte LaTeX maneja las matemáticas maravillosamente.", tags: ["Support Math", "Formulas"] },
                { emoji: "🌍", title: "Idiomas", desc: "Listas de vocabulario y reglas gramaticales. Sube una historia en tu idioma objetivo y obtén un mazo de vocabulario al instante.", tags: ["Vocabulario", "Gramática"] }
            ],
            deep_dives: "Escenarios Profundos",
            scenarios: {
                med: {
                    title: "El Maratón de Medicina",
                    quote: "Tengo 400 diapositivas sobre el Sistema Cardiovascular para mañana.",
                    list: ["Sube PDF de clase", "IA identifica patologías clave", "Genera pares síntoma/diagnóstico"],
                    desc_title: "Enfócate en el Diagnóstico, no en los Datos",
                    desc_body: "En lugar de pasar 4 horas transcribiendo tarjetas de tus diapositivas, arrastra y suelta el PDF. FlashAI extrae las perlas clínicas y crea tarjetas basadas en escenarios."
                },
                dev: {
                    title: "La Certification AWS",
                    quote: "Je dois conocer la diferencia entre cada clase de almacenamiento S3.",
                    list: ["Pega texto documentación", "IA crea tablas comparativas", "Ejercicios sobre límites específicos"],
                    desc_title: "Aprueba el Examen más Rápido",
                    desc_body: "La documentación técnica es árida. FlashAI la convierte en un cuestionario, obligándote a recordar activamente la diferencia entre 'Consistencia' y 'Disponibilidad'."
                }
            },
            cta: {
                title: "Deja de escribir. Empieza a aprender.",
                sub: "Únete a miles de estudiantes que ahorran más de 10 horas a la semana.",
                btn: "Prueba FlashAI Gratis"
            }
        },
        about: {
            mission_badge: "Nuestra Misión",
            title_1: "Acelerando la curva di",
            title_2: "aprendizaje global.",
            desc: "Creemos que el potencial humano solo está limitado por lo rápido que podemos aprender. Nuestro objetivo es eliminar la fricción entre información y conocimiento.",
            stats: {
                learners: "Estudiantes Activos",
                cards: "Tarjetas Creadas",
                countries: "Países",
                uptime: "Disponibilité"
            },
            origin_title: "Por qué construimos esto.",
            origin_text_1: "Estábamos cansados del 'impuesto al estudio'—las horas gastadas formateando texto en negrita, copiando definiciones y gestionando mazos antes de siquiera empezar a estudiar.",
            origin_text_2: "FlashAI nació en una habitación de residencia durante la semana de exámenes. Queríamos una herramienta que pudiera mirar un PDF y decir: 'Esto es lo que necesitas saber.'",
            origin_chart: {
                manual: "Creación Manual",
                manual_time: "4 Horas",
                ai: "Generación FlashAI",
                ai_time: "30 Segundos"
            },
            tech: {
                badge: "La Tecnología",
                title: "Construido sobre FlashAI Neural Engine",
                desc: "Usamos los últimos modelos multimodimodales para entender no solo el texto, sino la estructura y el contexto de tus documentos."
            },
            team: {
                title: "Únete al movimiento.",
                desc: "Somos un pequeño equipo dedicado a construir el futuro de la educación.",
                goal: "Ayúdanos a matar la memorización mecánica.",
                btn: "Empieza a Estudiar Ahora"
            }
        },
        contact: {
            title: "Contáctanos.",
            subtitle: "¿Preguntas? ¿Consultas empresariales? ¿Solo quieres saludar?",
            info: {
                get_in_touch: "Información de Contacto",
                email_t: "Escríbenos",
                email_d: "Para consultas generales y soporte.",
                hq_t: "Sede Central",
                agent_t: "Chat en Vivo",
                agent_d: "Nuestro agente de IA Quantum está disponible 24/7."
            },
            form: {
                success_t: "¡Mensaje Enviado!",
                success_d: "Te responderemos en 24 horas.",
                another: "Enviar otro mensaje",
                name: "Tu Nombre",
                email: "Correo Electrónico",
                subject: "Asunto",
                message: "Mensaje",
                btn: "Enviar Mensaje"
            }
        },
        footer: {
            tagline: "El asistente de estudio con IA para el estudiante moderno.",
            headers: {
                product: "Producto",
                company: "Compañía",
                support: "Soporte"
            },
            links: {
                pricing: "Precios",
                use_cases: "Casos de Uso",
                features: "Características",
                mission: "Misión",
                careers: "Carreras",
                legal: "Rechtliches",
                faq: "FAQ",
                contact: "Contacto",
                privacy: "Datenschutz",
                terms: "Nutzungsbedingungen"
            },
            copy: "© 2024 FlashAI Inc. Todos los derechos reservados."
        },
        faq_sub: "Todo lo que necesitas saber sobre el producto y la facturación."
    },
    auth: {
        login_title: "Bienvenido de nuevo",
        signup_title: "Crear Cuenta",
        login_btn: "Iniciar Sesión",
        signup_btn: "Registrarse",
        email: "Correo Electrónico",
        password: "Contraseña",
        password_req: "Al menos 8 caracteres, 1 número, 1 carácter especial.",
        forgot: "¿Olvidaste la contraseña?",
        reset: "Restablecer Contraseña",
        bonus: "¡+15 Tarjetas Extra Desbloqueadas!"
    },
    dashboard: {
        library: "Mi Biblioteca",
        welcome: "Bienvenido de nuevo",
        search: "Buscar mazos...",
        grid_view: "Cuadrícula",
        graph_view: "Gráfico",
        new_deck: "Nuevo Mazo",
        graph_active: "Knowledge Graph Activo",
        graph_desc: "Visualizando conexiones entre tus temas de estudio.",
        no_results: "No se encontraron mazos para",
        no_decks: "Tu biblioteca está vacía",
        empty_desc: "Empieza generando tu primer mazo de tarjetas con IA.",
        create_first: "Crea tu primer mazo",
        clear_search: "Borrar búsqueda",
        review: "Repaso Pendiente"
    },
    deck: {
        card: "Tarjeta",
        of: "de",
        end: "Terminar Sesión",
        exit: "Salir del Repaso",
        start_over: "Empezar de Nuevo",
        question: "PREGUNTA",
        answer: "RESPUESTA",
        show_answer: "Mostrar Respuesta",
        show_question: "Mostrar Pregunta",
        session_comp: "¡Sesión Completada!",
        review_comp: "¡Repaso Completado!",
        back: "Volver al Dashboard",
        add_card: "Añadir Tarjeta"
    },
    upload: {
        drop: "Suelta el archivo aquí",
        drag: "Arrastra y suelta tu archivo",
        limit: "PDF o TXT",
        error_type: "Solo se admiten archivos PDF y TXT.",
        error_size: "Dateigröße überschreitet das Limit."
    },
    settings: {
        title: "Configuración",
        sub: "Gestiona las preferencias de tu cuenta y tu suscripción.",
        personal: "Información Personal",
        display_name: "Nombre Visible",
        update_profile: "Actualizar Perfil",
        security: "Seguridad",
        curr_pwd: "Contraseña Actual",
        forgot_pwd: "¿Olvidaste?",
        new_pwd: "Nueva Contraseña",
        confirm_pwd: "Confirmar Nueva Contraseña",
        change_pwd: "Cambiar Contraseña",
        subscription: "Suscripción",
        upgrade: "Mejorar Plan",
        refund: "Solicitar Reembolso",
        cancel: "Cancelar Suscripción",
        payment: "Métodos de Pago",
        comms: "Comunicaciones",
        daily_email: "Recordatorio Diario de Estudio",
        marketing: "Actualizaciones de Producto y Consejos",
        save: "Guardar Preferencias",
        data: "Datos y Privacidad",
        export: "Exportar Datos",
        delete: "Eliminar Cuenta"
    }
};

const de = {
    nav: {
        use_cases: "Anwendungsfälle",
        comparison: "Vergleich",
        pricing: "Preise",
        faq: "FAQ",
        mission: "Mission",
        login: "Anmelden",
        get_started: "Kostenlos starten",
        study_session: "Lernsitzung"
    },
    hero: {
        new_badge: "Neu: Knowledge Graph 2.0",
        lead_magnet_badge: "🎁 Zeitlich begrenztes Angebot",
        title_1: "Verwandle Chaos in",
        title_2: "strukturiertes Wissen.",
        subtitle: "Lade 100+ Seiten Notizen hoch. Erhalte prüfungsreife Karteikarten in Sekunden. Der KI-Lernpartner, der dich wirklich versteht.",
        email_placeholder: "Deine E-Mail...",
        cta_free: "Hol dir 25 gratis Karten",
        motivational_1: "Lies nicht nur.",
        motivational_a: "Meistere es.",
        motivational_2: "Hör auf zu vergessen, was du lernst.",
        trusted_by: "Vertraut von Top-Studenten der"
    },
    narrative: {
        problem_title: "Sabotiert deine Lernmethode heimlich deinen Notenschnitt?",
        problem_sub: "Du bist nicht nur müde. Du verbrennst wertvolle kognitive Energie mit Dateneingabe.",
        agitation_bold: "Die versteckte 'Lernsteuer'",
        agitation_text: "Seien wir ehrlich über deinen Sonntagabend. Du öffnest ein PDF mit 400 Folien. Du liest. Du markierst. Du wechselst Tabs. Du kopierst. Du fügst ein. Du formatierst. 500 Mal. **Das ist kein Lernen.** Das ist manuelle Dateneingabe. Du verschwendest jede Woche 3-5 Stunden nur damit, dich auf das Lernen *vorzubereiten*. Wenn du bereit bist, tatsächlich zu memorieren, ist dein Gehirn frittiert. Du schenkst deine '1,0' dem Studenten, der diese Zeit zum Lernen genutzt hat, nicht zum Tippen.",
        solution_badge: "DER WANDEL",
        solution_title: "Hol dir 6 Stunden pro Woche zurück – für den Preis eines Döners.",
        solution_text: "FlashAI ist das definitive Ende der administrativen Lernvorbereitung. Wir haben eine Engine gebaut, die dichte Vorlesungsnotizen und Lehrbuchkapitel sofort verdaut. Sie extrahiert die ertragreichen Konzepte, formatiert sie in aktive Abrufübungen und richtet deinen Zeitplan für die verteilte Wiederholung automatisch ein. Hol dir 6 Stunden pro Woche zurück. Konzentriere dich auf Deep Work. Überlasse die Fleißarbeit der KI.",
        cta_urgent: "Hol dir FlashAI Pro"
    },
    features: {
        title: "Intelligenz, nicht nur Automatisierung.",
        subtitle: "Wir fassen nicht nur zusammen. Wir zerlegen deine Materialien in ihre atomaren Konzepte und bauen sie für das Gedächtnis wieder auf.",
        universal_input: "1. Strukturanalyse",
        universal_desc: "Wir analysieren PDF-Vektoren, nicht nur Text. Tabellen, Diagramme und Dokumenthierarchien bleiben erhalten.",
        instant: "2. Konzeptextraktion",
        instant_desc: "Unsere Engine identifiziert 'ertragreiche' Informationen gegenüber Füllmaterial und garantiert 100% Prüfungsrelevanz.",
        srs: "3. Kognitive Zeitplanung",
        srs_desc: "Der SRS-Algorithmus passt sich deiner spezifischen Vergessenskurve an. Du wiederholst nur das, was wissenschaftlich notwendig ist.",
        insights: "4. Semantische Verknüpfung",
        insights_desc: "Wir bilden Beziehungen zwischen isolierten Karten ab, um einen verbundenen Wissensgraphen des Verstehens aufzubauen."
    },
    action: {
        badge: "Echte Power",
        title: "Gebaut für die Nacht davor.",
        subtitle: "Egal ob du für das Staatsexamen, das Bar Exam oder Biologie 101 lernst.",
        cases: [
            {
                icon: "🩺",
                role: "Medizinstudenten",
                input: "Anatomie_Kap4.pdf",
                question: "Warte, welcher Nerv innervaert den Musculus serratus anterior?",
                challenge: "700 Seiten dichter Anatomietext bis Freitag memorieren.",
                solution: "FlashAI extrahierte 45 wichtige Nerv/Muskel-Paare.",
                items: ["Nervus thoracicus longus", "Serratus Anterior", "Scapula alata"]
            },
            {
                icon: "⚖️",
                role: "Jurastudenten",
                input: "Vertragsrecht_Fälle.txt",
                question: "Was war die Entscheidung im Fall Hawkins v. McGee?",
                challenge: "Synthese von 50 Fallzusammenfassungen in umsetzbare Regeln.",
                solution: "Generierte Rechtsgrundsätze und Schlüsselfakten für jeden Fall.",
                items: ["Hairy Hand Case", "Schadenersatz", "Versprechen"]
            },
            {
                icon: "💻",
                role: "Entwickler",
                input: "AWS_Whitepaper.pdf",
                question: "Unterschied zwischen S3 Standard und Intelligent-Tiering?",
                challenge: "Zertifizierungsprüfung morgen. Muss Nuancen schnell erkennen.",
                solution: "Erstellte Vergleichstabellen für alle Service-Level.",
                items: ["S3 Standard", "Glacier Deep Archive", "99.999999999% Haltbarkeit"]
            }
        ]
    },
    comparison: {
        title: "Hör auf, Zeit mit Vorbereitung zu verschwenden.",
        subtitle: "Der alte Weg ist kaputt. Sieh, warum Studenten wechseln.",
        best_value: "Bester Wert",
        cost: "Monatliche Kosten",
        workflow: "Workflow",
        smarts: "KI-Intelligenz",
        retention: "Merk-Technologie",
        manual: "Manuelle Eingabe",
        control: "Bearbeitungskontrolle"
    },
    comparison_rows: {
        labels: {
            legacy: "Altmodische Karteikarten",
            chatbot: "Generischer Chatbot",
            open_source: "Open Source",
            human: "Privatlehrer"
        },
        features: {
            workflow: {
                1: "Manuelles Copy/Paste",
                2: "Manuelle Prompts",
                3: "Kompliziertes Setup",
                4: "Nur Planung"
            },
            smarts: {
                1: "Keine",
                2: "Generische Konversation",
                3: "Keine",
                4: "Menschliche Expertise"
            },
            retention: {
                1: "Einfache Wiederholung",
                2: "Keine",
                3: "Komplexe Algorithmen",
                4: "Geführte Praxis"
            },
            control: {
                free: "Nur automatische Generierung",
                pro: "Manuelles Hinzufügen & Auszüge"
            }
        }
    },
    landing_faq: {
        title: "Häufig gestellte Fragen",
        link: "Alle FAQs ansehen"
    },
    cta_bottom: {
        badge: "Bereit zu starten?",
        title_pre: "Verwandle deine nächste Prüfung in einen ",
        title_highlight: "Erfolg",
        title_post: ". GARANTIERT.",
        conviction_sub: "Schon überzeugt? Überspringe den Test und schalte unbegrenzte Power frei.",
        feat_1: "Sofortstart ohne Karte",
        feat_2: "3 kostenlose Decks pro Tag",
        feat_3: "Voller Pro-Zugang, null Risiko",
        button: "Teste uns 7 Tage lang",
        cancel: ""
    },
    pricing: {
        title: "Einfache, studentenfreundliche Preise.",
        subtitle: "Investiere in deinen Notenschnitt für weniger als den Preis eines Kaffees.",
        free_plan: "Studenten Starter",
        free_sub: "Perfekt für gelegentliches Lernen.",
        pro_plan: "Ehrentafel",
        pro_sub: "Für echte akademische Waffen.",
        enterprise: "Institution",
        enterprise_sub: "Für Schulen & Fachbereiche.",
        custom: "Individuell",
        month: "/Monat",
        start_free: "Kostenlos starten",
        upgrade: "Upgrade auf Pro",
        contact: "Vertrieb kontaktieren",
        guarantee: "7-Tage Garantie"
    },
    pricing_page: {
        core_features: "Kernfunktionen",
        advanced_tools: "Erweiterte Tools",
        table: {
            rows: {
                ai_gen: "KI-Deck-Generierung",
                cards_deck: "Karten pro Deck",
                srs: "Spaced Repetition (SRS)",
                knowledge_graph: "Knowledge Graph",
                upload_limit: "Datei-Upload-Limit",
                export: "Datenexport"
            },
            values: {
                "3_decks": "3 Decks / Tag",
                "unlimited": "Unbegrenzt",
                "5_cards": "5 Karten (Vorschau)",
                "50_cards": "50 Karten (Deep Dive)",
                "custom": "Individuell",
                "included": "Inklusive",
                "unlimited_nodes": "Unbegrenzte Knoten",
                "team_graph": "Team-Graph",
                "2_mb": "2 MB",
                "10_mb": "10 MB",
                "500_mb": "500 MB",
                "text_only": "Nur Text",
                "json_pdf": "JSON, PDF, CSV",
                "api_access": "API-Zugriff",
                "pro_only": "NUR PRO"
            }
        },
        transparency: {
            title: "Wohin geht dein Geld?",
            desc: "Wir glauben an Transparenz. Dein Abonnement finanziert direkt die GPU-Rechenleistung, die benötigt wird, um deine Dokumente zu analysieren und hochwertige Schlussfolgerungen zu generieren.",
            items: [
                { cost: "65%", label: "LLM-Berechnung (FlashAI Neural Engine)" },
                { cost: "20%", label: "Produktentwicklung" },
                { cost: "15%", label: "Serverkosten & Hosting" },
            ],
            guarantee: "Die '1,0' Garantie",
            guarantee_text: "Wenn FlashAI dir in der ersten Woche nicht hilft, besser zu lernen, erstatten wir dir das Geld. Keine Fragen."
        }
    },
    page_content: {
        use_cases: {
            badge: "Anwendungsfälle",
            title: "Wer nutzt FlashAI?",
            subtitle: "Vom Medizinstudium bis zum Coding-Bootcamp helfen wir Lernenden, riesige Informationsmengen zu komprimieren.",
            cards: [
                { emoji: "🩺", title: "Medizin & Pflege", desc: "Anatomie, Pharmakologie und Pathologie. Verwandle tausende Lehrbuchseiten in aktive Abrufübungen.", tags: ["Viel Lesen", "Memorieren"] },
                { emoji: "⚖️", title: "Jura", desc: "Fallbriefe, Gesetze und Definitionen. Verarbeite schnell dichte juristische PDFs in regelbasierte Karteikarten.", tags: ["Struktur", "Logik"] },
                { emoji: "🔬", title: "MINT & Ingenieurwesen", desc: "Formeln, Theoreme und Prozesse. Unser LaTeX-Support handhabt Mathematik wunderbar.", tags: ["Mathe-Support", "Formeln"] },
                { emoji: "🌍", title: "Sprachenlernen", desc: "Vokabellisten und Grammatikregeln. Lade eine Geschichte in deiner Zielsprache hoch und erhalte sofort ein Vokabeldeck.", tags: ["Vokabeln", "Grammatik"] }
            ],
            deep_dives: "Deep Dive Szenarien",
            scenarios: {
                med: {
                    title: "Der Medizin-Marathon",
                    quote: "Ich habe 400 Folien über das Herz-Kreislauf-System bis morgen.",
                    list: ["Vorlesungs-PDF hochladen", "KI identifiziert Schlüsselpathologien", "Generiert Symptom/Diagnose-Paare"],
                    desc_title: "Fokus auf Diagnose, nicht Dateneingabe",
                    desc_body: "Anstatt 4 Stunden damit zu verbringen, Karten von deinen Folien abzutippen, ziehe das PDF einfach per Drag & Drop. FlashAI extrahiert die klinischen Perlen und erstellt szenariobasierte Karten."
                },
                dev: {
                    title: "Die AWS-Zertifizierung",
                    quote: "Ich muss den Unterschied zwischen jeder S3-Speicherklasse kennen.",
                    list: ["Dokumentationstext einfügen", "KI erstellt Vergleichstabellen", "Übungen zu spezifischen Limits"],
                    desc_title: "Bestelle die Prüfung schneller",
                    desc_body: "Technische Dokumentation ist trocken. FlashAI verwandelt sie in ein Quiz und zwingt dich, den Unterschied zwischen 'Konsistenz' und 'Verfügbarkeit' aktiv abzurufen."
                }
            },
            cta: {
                title: "Hör auf zu tippen. Fang an zu lernen.",
                sub: "Schließe dich tausenden Studenten an, die 10+ Stunden pro Woche sparen.",
                btn: "FlashAI kostenlos testen"
            }
        },
        about: {
            mission_badge: "Unsere Mission",
            title_1: "Beschleunigung der weltweiten",
            title_2: "Lernkurve.",
            desc: "Wir glauben, dass das menschliche Potenzial nur dadurch begrenzt ist, wie schnell wir lernen können. Unser Ziel ist es, die Reibung zwischen Information und Wissen zu beseitigen.",
            stats: {
                learners: "Aktive Lerner",
                cards: "Erstellte Karten",
                countries: "Länder",
                uptime: "Verfügbarkeit"
            },
            origin_title: "Warum wir das gebaut haben.",
            origin_text_1: "Wir waren müde von der 'Lernsteuer' – den Stunden, die mit dem Formatieren von fettgedrucktem Text, dem Kopieren von Definitionen und dem Verwalten von Decks verbracht wurden, bevor man überhaupt anfängt zu lernen.",
            origin_text_2: "FlashAI wurde in einem Studentenwohnheim während der Prüfungswoche geboren. Wir wollten ein Werkzeug, das ein PDF ansehen und sagen kann: 'Hier ist, was du wissen musst.'",
            origin_chart: {
                manual: "Manuelle Erstellung",
                manual_time: "4 Stunden",
                ai: "FlashAI Generierung",
                ai_time: "30 Sekunden"
            },
            tech: {
                badge: "Die Technologie",
                title: "Gebaut auf FlashAI Intelligence",
                desc: "Wir nutzen unsere neuesten multimodalen Modelle, um nicht nur Text, sondern auch Struktur und Kontext deiner Dokumente zu verstehen."
            },
            team: {
                title: "Schließe dich der Bewegung an.",
                desc: "Wir sind ein kleines Team, das sich dem Aufbau der Zukunft der Bildung widmet.",
                goal: "Hilf uns, das sture Auswendiglernen zu töten.",
                btn: "Jetzt anfangen zu lernen"
            }
        },
        contact: {
            title: "Kontaktieren Sie uns.",
            subtitle: "Fragen? Unternehmensanfrage? Einfach nur Hallo sagen?",
            info: {
                get_in_touch: "Kontaktinformationen",
                email_t: "Schreib uns",
                email_d: "Für allgemeine Anfragen und Support.",
                hq_t: "Hauptsitz",
                agent_t: "Live Chat",
                agent_d: "Unser KI-Agent Quantum ist 24/7 verfügbar."
            },
            form: {
                success_t: "Nachricht gesendet!",
                success_d: "Wir melden uns innerhalb von 24 Stunden bei dir.",
                another: "Eine weitere Nachricht senden",
                name: "Dein Name",
                email: "E-Mail-Adresse",
                subject: "Betreff",
                message: "Nachricht",
                btn: "Nachricht senden"
            }
        },
        footer: {
            tagline: "Der KI-gestützte Lernassistent für den modernen Studenten.",
            headers: {
                product: "Produkt",
                company: "Unternehmen",
                support: "Support"
            },
            links: {
                pricing: "Preise",
                use_cases: "Anwendungsfälle",
                features: "Funktionen",
                mission: "Mission",
                careers: "Karriere",
                legal: "Rechtliches",
                faq: "FAQ",
                contact: "Kontakt",
                privacy: "Datenschutz",
                terms: "Nutzungsbedingungen"
            },
            copy: "© 2024 FlashAI Inc. Alle Rechte vorbehalten."
        },
        faq_sub: "Alles, was du über das Produkt und die Abrechnung wissen musst."
    },
    auth: {
        login_title: "Willkommen zurück",
        signup_title: "Konto erstellen",
        login_btn: "Einloggen",
        signup_btn: "Registrieren",
        email: "E-Mail-Adresse",
        password: "Passwort",
        password_req: "Mindestens 8 Zeichen, 1 Zahl, 1 Sonderzeichen.",
        forgot: "Passwort vergessen?",
        reset: "Passwort zurücksetzen",
        bonus: "+15 Bonus-Karten freigeschaltet!"
    },
    dashboard: {
        library: "Meine Bibliothek",
        welcome: "Willkommen zurück",
        search: "Decks suchen...",
        grid_view: "Raster",
        graph_view: "Graph",
        new_deck: "Neues Deck",
        graph_active: "Knowledge Graph Aktiv",
        graph_desc: "Visualisierung der Verbindungen zwischen deinen Lernthemen.",
        no_results: "Keine Decks gefunden für",
        no_decks: "Deine Bibliothek ist leer",
        empty_desc: "Beginne mit der Generierung deines ersten KI-Karteikartendecks.",
        create_first: "Erstelle dein erstes Deck",
        clear_search: "Suche löschen",
        review: "Wiederholung fällig"
    },
    deck: {
        card: "Karte",
        of: "von",
        end: "Sitzung beenden",
        exit: "Wiederholung beenden",
        start_over: "Neu starten",
        question: "FRAGE",
        answer: "ANTWORT",
        show_answer: "Antwort zeigen",
        show_question: "Frage zeigen",
        session_comp: "Sitzung abgeschlossen!",
        review_comp: "Wiederholung abgeschlossen!",
        back: "Zurück zum Dashboard",
        add_card: "Karte hinzufügen"
    },
    upload: {
        drop: "Datei hier ablegen",
        drag: "Ziehe deine Datei hierher",
        limit: "PDF oder TXT",
        error_type: "Nur PDF- und TXT-Dateien werden unterstützt.",
        error_size: "Dateigröße überschreitet das Limit."
    },
    settings: {
        title: "Einstellungen",
        sub: "Verwalte deine Kontoeinstellungen und dein Abonnement.",
        personal: "Persönliche Informationen",
        display_name: "Anzeigename",
        update_profile: "Profil aktualisieren",
        security: "Sicherheit",
        curr_pwd: "Aktuelles Passwort",
        forgot_pwd: "Vergessen?",
        new_pwd: "Neues Passwort",
        confirm_pwd: "Neues Passwort bestätigen",
        change_pwd: "Passwort ändern",
        subscription: "Abonnement",
        upgrade: "Plan upgraden",
        refund: "Rückerstattung anfordern",
        cancel: "Abonnement kündigen",
        payment: "Zahlungsmethoden",
        comms: "Kommunikation",
        daily_email: "Tägliche Lernerinnerung",
        marketing: "Produkt-Updates & Tipps",
        save: "Einstellungen speichern",
        data: "Daten & Datenschutz",
        export: "Daten exportieren",
        delete: "Konto löschen"
    }
};

const fr = {
    nav: {
        use_cases: "Cas d'usage",
        comparison: "Comparaison",
        pricing: "Tarifs",
        faq: "FAQ",
        mission: "Mission",
        login: "Connexion",
        get_started: "Commencer",
        study_session: "Session d'étude"
    },
    hero: {
        new_badge: "Nouveau : Knowledge Graph 2.0",
        lead_magnet_badge: "🎁 Offre Limitée",
        title_1: "Transformez le chaos en",
        title_2: "connaissances structurées.",
        subtitle: "Téléchargez 100+ pages de notes. Obtenez des cartes prêtes pour l'examen en quelques secondes. Le partenaire d'étude IA qui vous comprend vraiment.",
        email_placeholder: "Votre email...",
        cta_free: "Obtenez 25 Cartes Gratuites",
        motivational_1: "Ne vous contentez pas de lire.",
        motivational_a: "Maîtrisez-le.",
        motivational_2: "Arrêtez d'oublier ce que vous apprenez.",
        trusted_by: "Approuvé par les meilleurs étudiants de"
    },
    narrative: {
        problem_title: "Votre méthode d'étude sabote-t-elle secrètement votre moyenne ?",
        problem_sub: "Vous n'êtes pas seulement fatigué. Vous brûlez une précieuse énergie cognitive dans la saisie de données.",
        agitation_bold: "La 'Taxe d'Étude' Cachée",
        agitation_text: "Soyons honnêtes à propos de votre dimanche soir. Vous ouvrez un PDF de 400 diapositives. Vous lisez. Vous surlignez. Vous changez d'onglet. Vous copiez. Vous collez. Vous formatez. Répétez 500 fois. **Ce n'est pas étudier.** C'est de la saisie de données manuelle. Vous perdez 3 à 5 heures chaque semaine juste pour vous *préparer* à apprendre. Au moment où vous êtes prêt à mémoriser réellement, votre cerveau est frit. Vous offrez votre 'A' à l'étudiant qui a passé ce temps à apprendre, pas à taper.",
        solution_badge: "LE CHANGEMENT",
        solution_title: "Récupérez 6 heures par semaine pour le prix d'un petit sandwich.",
        solution_text: "FlashAI est la fin définitive de la préparation administrative des études. Nous avons construit un moteur qui digère instantanément les notes de cours denses et les chapitres de manuels. Il extrait les concepts à haut rendement, les formate en exercices de rappel actif et configure automatiquement votre programme de Répétition Espacée. Récupérez 6 heures par semaine. Concentrez-vous sur le travail profond. Laissez le travail fastidieux à l'IA.",
        cta_urgent: "Obtenir FlashAI Pro"
    },
    features: {
        title: "Intelligence, pas seulement automatisation.",
        subtitle: "Nous ne nous contentons pas de résumer. Nous déconstruisons vos matériaux en leurs concepts atomiques et les reconstruisons pour la mémoire.",
        universal_input: "1. Analyse Structurelle",
        universal_desc: "Nous analysons les vecteurs PDF, pas seulement le texte. Tableaux, diagrammes et hiérarchie du document sont préservés.",
        instant: "2. Extraction de Concepts",
        instant_desc: "Notre moteur identifie les informations 'à haut rendement' par rapport au remplissage, assurant 100% de pertinence pour l'examen.",
        srs: "3. Planification Cognitive",
        srs_desc: "L'algorithme SRS s'adapte à votre courbe d'oubli spécifique. Vous ne révisez que ce qui est scientifiquement nécessaire.",
        insights: "4. Liaison Sémantique",
        insights_desc: "Nous cartographions les relations entre les cartes isolées pour construire un Knowledge Graph connecté de compréhension."
    },
    action: {
        badge: "Puissance Réelle",
        title: "Construit pour la nuit d'avant.",
        subtitle: "Que vous révisiez pour la médecine, le droit ou la biologie 101.",
        cases: [
            {
                icon: "🩺",
                role: "Étudiants en Médecine",
                input: "Anatomie_Ch4.pdf",
                question: "Attends, quel nerf innerve le dentelé antérieur ?",
                challenge: "700 pages de texte d'anatomie dense à mémoriser pour vendredi.",
                solution: "FlashAI a extrait 45 paires clés nerf/muscle.",
                items: ["Nerf Thoracique Long", "Dentelé Antérieur", "Scapula Ailée"]
            },
            {
                icon: "⚖️",
                role: "Étudiants en Droit",
                input: "Droit_Contrats_Cas.txt",
                question: "Quelle était la décision dans l'affaire Hawkins c. McGee ?",
                challenge: "Synthétiser 50 résumés de cas en règles applicables.",
                solution: "Génération de principes de droit et de faits clés pour chaque cas.",
                items: ["Affaire de la Main Velue", "Dommages-Intérêts", "Promesse"]
            },
            {
                icon: "💻",
                role: "Développeurs",
                input: "AWS_Whitepaper.pdf",
                question: "Différence entre S3 Standard et Intelligent-Tiering ?",
                challenge: "Examen de certification demain. Besoin de repérer les nuances rapidement.",
                solution: "Création de tableaux comparatifs pour tous les niveaux de service.",
                items: ["S3 Standard", "Glacier Deep Archive", "99.999999999% Durabilité"]
            }
        ]
    },
    comparison: {
        title: "Arrêtez de perdre du temps en préparation.",
        subtitle: "L'ancienne méthode est cassée. Voyez pourquoi les étudiants changent.",
        best_value: "Meilleure Valeur",
        cost: "Coût Mensuel",
        workflow: "Flux de travail",
        smarts: "Intelligence IA",
        retention: "Technologie Rétention",
        manual: "Saisie Manuelle",
        control: "Contrôle d'Édition"
    },
    comparison_rows: {
        labels: {
            legacy: "Flashcards Old School",
            chatbot: "Chatbot Générique",
            open_source: "Open Source",
            human: "Tuteur Privé"
        },
        features: {
            workflow: {
                1: "Copier/Coller Manuel",
                2: "Prompts Manuels",
                3: "Configuration Complexe",
                4: "Planification Uniquement"
            },
            smarts: {
                1: "Aucune",
                2: "Conversation Générique",
                3: "Aucune",
                4: "Expertise Humaine"
            },
            retention: {
                1: "Répétition Basique",
                2: "Aucune",
                3: "Algorithmes Complexes",
                4: "Pratique Guidée"
            },
            control: {
                free: "Génération Auto Uniquement",
                pro: "Ajout Manuel & Extraits"
            }
        }
    },
    landing_faq: {
        title: "Questions Fréquentes",
        link: "Voir toutes les FAQ"
    },
    cta_bottom: {
        badge: "Prêt à commencer ?",
        title_pre: "Transformez votre prochain examen en un ",
        title_highlight: "succès",
        title_post: ". GARANTI.",
        conviction_sub: "Déjà convaincu ? Sautez l'essai et débloquez une puissance illimitée.",
        feat_1: "Commencez sans carte bancaire",
        feat_2: "3 decks gratuits par jour",
        feat_3: "Accès Pro complet, zéro risque",
        button: "Essayez pendant 7 jours",
        cancel: ""
    },
    pricing: {
        title: "Tarifs simples, adaptés aux étudiants.",
        subtitle: "Investissez dans votre moyenne pour moins que le prix d'un café.",
        free_plan: "Starter Étudiant",
        free_sub: "Parfait pour l'étude occasionnelle.",
        pro_plan: "Tableau d'Honneur",
        pro_sub: "Pour les véritables armes académiques.",
        enterprise: "Institution",
        enterprise_sub: "Pour les écoles et départements.",
        custom: "Sur Mesure",
        month: "/mois",
        start_free: "Commencer Gratuitement",
        upgrade: "Passer à Pro",
        contact: "Contacter les Ventes",
        guarantee: "Garantie 7 Jours"
    },
    pricing_page: {
        core_features: "Fonctionnalités de Base",
        advanced_tools: "Outils Avancés",
        table: {
            rows: {
                ai_gen: "Génération de Decks IA",
                cards_deck: "Cartes par Deck",
                srs: "Répétition Espacée (SRS)",
                knowledge_graph: "Knowledge Graph",
                upload_limit: "Limite de Téléchargement",
                export: "Exportation de Données"
            },
            values: {
                "3_decks": "3 Decks / Jour",
                "unlimited": "Illimité",
                "5_cards": "5 Cartes (Aperçu)",
                "50_cards": "50 Cartes (Approfondi)",
                "custom": "Sur Mesure",
                "included": "Inclus",
                "unlimited_nodes": "Nœuds Illimités",
                "team_graph": "Graphique d'Équipe",
                "2_mb": "2 Mo",
                "10_mb": "10 Mo",
                "500_mb": "500 Mo",
                "text_only": "Texte Uniquement",
                "json_pdf": "JSON, PDF, CSV",
                "api_access": "Accès API",
                "pro_only": "PRO UNIQUEMENT"
            }
        },
        transparency: {
            title: "Où va votre argent ?",
            desc: "Nous croyons en la transparence. Votre abonnement finance directement la puissance de calcul GPU nécessaire pour analyser vos documents et générer un raisonnement de haute qualité.",
            items: [
                { cost: "65%", label: "Calcul LLM (FlashAI Neural Engine)" },
                { cost: "20%", label: "Développement Produit" },
                { cost: "15%", label: "Coûts Serveur & Hébergement" },
            ],
            guarantee: "La Garantie 'A+'",
            guarantee_text: "Si FlashAI ne vous aide pas à mieux étudier dès votre première semaine, nous vous remboursons. Sans poser de questions."
        }
    },
    page_content: {
        use_cases: {
            badge: "Cas d'Usage",
            title: "Qui utilise FlashAI ?",
            subtitle: "De l'école de médecine aux bootcamps de codage, nous aidons les apprenants à condenser des charges d'informations massives.",
            cards: [
                { emoji: "🩺", title: "Médecine & Soins", desc: "Anatomie, Pharmacologie et Pathologie. Transformez des milliers de pages de manuels en exercices de rappel actif.", tags: ["Lecture Intense", "Mémorisation"] },
                { emoji: "⚖️", title: "Droit", desc: "Résumés de cas, statuts et définitions. Digérez rapidement des PDF juridiques denses en flashcards basées sur des règles.", tags: ["Structure", "Logique"] },
                { emoji: "🔬", title: "STEM & Ingénierie", desc: "Formules, théorèmes et processus. Notre support LaTeX gère les mathématiques à merveille.", tags: ["Support Math", "Formules"] },
                { emoji: "🌍", title: "Apprentissage des Langues", desc: "Listes de vocabulaire et règles de grammaire. Téléchargez une histoire dans votre langue cible et obtenez instantanément un deck de vocabulaire.", tags: ["Vocabulaire", "Grammaire"] }
            ],
            deep_dives: "Scénarios Approfonditi",
            scenarios: {
                med: {
                    title: "Le Marathon Médical",
                    quote: "J'ai 400 diapositives sur le Système Cardiovasculaire pour demain.",
                    list: ["Télécharger PDF cours", "IA identifie pathologies clés", "Génère paires symptôme/diagnostic"],
                    desc_title: "Focus sur le Diagnostic, pas la Saisie",
                    desc_body: "Au lieu de passer 4 heures à taper des cartes à partir de vos diapositives, glissez-déposez le PDF. FlashAI extrait les perles cliniques et crée des cartes basées sur des scénarios."
                },
                dev: {
                    title: "La Certification AWS",
                    quote: "Je dois connaître la différence entre chaque classe de stockage S3.",
                    list: ["Coller texte documentation", "IA crée tableaux comparatifs", "Exercices sur limites spécifiques"],
                    desc_title: "Réussissez l'Examen plus Vite",
                    desc_body: "La documentation technique est aride. FlashAI la transforme en quiz, vous forçant à rappeler activement la différence entre 'Cohérence' et 'Disponibilité'."
                }
            },
            cta: {
                title: "Arrêtez d'écrire. Commencez à apprendre.",
                sub: "Rejoignez des milliers d'étudiants qui économisent 10+ heures par semaine.",
                btn: "Essayer FlashAI Gratuitement"
            }
        },
        about: {
            mission_badge: "Notre Mission",
            title_1: "Accélérer la courbe d'",
            title_2: "apprentissage mondiale.",
            desc: "Nous croyons que le potentiel humain n'est limité que par la vitesse à laquelle nous pouvons apprendre. Notre objectif est de supprimer la friction entre l'information et la connaissance.",
            stats: {
                learners: "Apprenants Actifs",
                cards: "Cartes Créées",
                countries: "Pays",
                uptime: "Disponibilité"
            },
            origin_title: "Pourquoi nous avons construit ceci.",
            origin_text_1: "Nous étions fatigués de la 'taxe d'étude'—les heures passées à formater du texte en gras, copier des définitions et gérer des decks avant même de commencer à étudier.",
            origin_text_2: "FlashAI est né dans une chambre de résidence pendant la semaine d'examens. Nous voulions un outil capable de regarder un PDF et de dire : 'Voici ce que tu dois savoir.'",
            origin_chart: {
                manual: "Création Manuelle",
                manual_time: "4 Heures",
                ai: "Génération FlashAI",
                ai_time: "30 Secondes"
            },
            tech: {
                badge: "La Technologie",
                title: "Construit sur FlashAI Neural Engine",
                desc: "Nous utilisons les derniers modèles multimodimodales pour comprendre non seulement le texte, mais aussi la structure et le contexte de vos documents."
            },
            team: {
                title: "Rejoignez le mouvement.",
                desc: "Nous sommes une petite équipe dédiée à construire le futur de l'éducation.",
                goal: "Aidez-nous à tuer la mémorisation par cœur.",
                btn: "Commencer à Étudier Maintenant"
            }
        },
        contact: {
            title: "Contactez-nous.",
            subtitle: "Des questions ? Demande entreprise ? Juste envie de dire bonjour ?",
            info: {
                get_in_touch: "Informations de Contact",
                email_t: "Écrivez-nous",
                email_d: "Pour les demandes générales et le support.",
                hq_t: "Siège Social",
                agent_t: "Chat En Direct",
                agent_d: "Notre agent IA Quantum est disponible 24/7."
            },
            form: {
                success_t: "Message Envoyé !",
                success_d: "Nous vous répondrons dans les 24 heures.",
                another: "Envoyer un autre message",
                name: "Votre Nom",
                email: "Adresse Email",
                subject: "Sujet",
                message: "Message",
                btn: "Envoyer le Message"
            }
        },
        footer: {
            tagline: "L'assistant d'étude IA pour l'étudiant moderne.",
            headers: {
                product: "Produit",
                company: "Entreprise",
                support: "Support"
            },
            links: {
                pricing: "Tarifs",
                use_cases: "Cas d'Usage",
                features: "Fonctionnalités",
                mission: "Mission",
                careers: "Carrières",
                legal: "Légal",
                faq: "FAQ",
                contact: "Contact",
                privacy: "Politique de Confidentialité",
                terms: "Conditions d'Utilisation"
            },
            copy: "© 2024 FlashAI Inc. Tous droits réservés."
        },
        faq_sub: "Tout ce que vous devez savoir sur le produit et la facturation."
    },
    auth: {
        login_title: "Bon retour",
        signup_title: "Créer un Compte",
        login_btn: "Connexion",
        signup_btn: "S'inscrire",
        email: "Adresse Email",
        password: "Mot de passe",
        password_req: "Au moins 8 caractères, 1 chiffre, 1 caractère spécial.",
        forgot: "Mot de passe oublié ?",
        reset: "Réinitialiser Mot de passe",
        bonus: "+15 Cartes Bonus Débloquées !"
    },
    dashboard: {
        library: "Ma Bibliothèque",
        welcome: "Bon retour",
        search: "Rechercher des decks...",
        grid_view: "Grille",
        graph_view: "Graphe",
        new_deck: "Nouveau Deck",
        graph_active: "Knowledge Graph Actif",
        graph_desc: "Visualisation des connexions entre vos sujets d'étude.",
        no_results: "Aucun deck trouvé pour",
        no_decks: "Votre bibliothèque est vide",
        empty_desc: "Commencez par générer votre premier deck de flashcards IA.",
        create_first: "Créez votre premier deck",
        clear_search: "Effacer recherche",
        review: "Révision Due"
    },
    deck: {
        card: "Carte",
        of: "sur",
        end: "Terminer Session",
        exit: "Quitter Révision",
        start_over: "Recommencer",
        question: "QUESTION",
        answer: "RÉPONSE",
        show_answer: "Voir Réponse",
        show_question: "Voir Question",
        session_comp: "Session Terminée !",
        review_comp: "Révision Terminée !",
        back: "Retour au Tableau de Bord",
        add_card: "Ajouter Carte"
    },
    upload: {
        drop: "Déposer le fichier ici",
        drag: "Glissez & déposez votre fichier",
        limit: "PDF ou TXT",
        error_type: "Seuls les fichiers PDF et TXT sont supportés.",
        error_size: "La taille du fichier dépasse la limite."
    },
    settings: {
        title: "Paramètres",
        sub: "Gérez vos préférences de compte et votre abonnement.",
        personal: "Informations Personnelles",
        display_name: "Nom d'Affichage",
        update_profile: "Mettre à jour le Profil",
        security: "Sécurité",
        curr_pwd: "Mot de passe Actuel",
        forgot_pwd: "Oublié ?",
        new_pwd: "Nouveau Mot de passe",
        confirm_pwd: "Confirmer Nouveau Mot de passe",
        change_pwd: "Changer Mot de passe",
        subscription: "Abonnement",
        upgrade: "Mettre à niveau Plan",
        refund: "Demander Remboursement",
        cancel: "Annuler Abonnement",
        payment: "Méthodes de Paiement",
        comms: "Communication",
        daily_email: "Rappel d'Étude Quotidien",
        marketing: "Mises à jour Produit & Astuces",
        save: "Enregistrer Préférences",
        data: "Données & Confidentialité",
        export: "Exporter Données",
        delete: "Supprimer Compte"
    }
};

export const translations = { en, it, es, de, fr };
