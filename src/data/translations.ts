import type { Locale } from '@/context/LanguageContext';
import type { Game } from '@/data/games';
import type { Node } from '@/data/nodes';
import type { Project } from '@/data/projects';

type NodeCopy = Pick<Node, 'title' | 'text'> & Partial<Pick<Node, 'subtitle' | 'content'>>;

const NODE_EN: Record<string, NodeCopy> = {
  inicio: { title: 'Invisible Threads', text: 'Everything I am comes from a story that began before me.' },
  mapa: { title: 'Explore', text: 'Choose your path. There is no right order.' },
  tecnico: { title: 'The technical route', text: 'The short route: profile, code and games.' },
  esencia: {
    title: 'Essence', subtitle: 'Chapter 1',
    text: 'Before I knew I wanted to design, I was already designing.',
    content: 'I was never satisfied with what I found. I looked for pieces that stores did not carry - vintage, dark, and able to tell a story. When I could not find them, I went to my grandmother. She helped me bring them to life, or told me who could make them. Without realizing it, I was already creating.',
  },
  identidad: {
    title: 'Tatiana Alejandra', subtitle: 'Chapter 2',
    text: 'Beyond work and projects.',
    content: 'This chapter has no projects or deliverables.\n\nIt holds memories, places and people: the moments that do not belong in a portfolio, but still explain why I make what I make.\n\nAnd the times when I\'m not producing anything. I read a lot and watch plenty of anime, which gives me more than I admit: framing, color, ways of telling a story. I listen to jazz, metal or classical, depending on the day. And I love sitting down with a glass of wine or a beer without doing anything productive.\n\nMuch of what ends up in my work comes from there.',
  },
  perfil: {
    title: 'Profile', subtitle: 'Chapter 3',
    text: 'Systems engineer, fashion design technician and game developer.',
    content: 'I studied systems engineering and fashion design, and I love creating video games. I have spent years building web applications with React, TypeScript and Node - that remains my foundation as a frontend developer.\n\nBecause I love learning and have always enjoyed creating, I eventually wanted to make something with my hands and stepped into fashion. Without realizing it, that became a complement to game development, which is where I am focusing my career.\n\nI do not see them as separate paths. I use the same process everywhere: understand what is needed, test, adjust and try again until it works.',
  },
  herencia: {
    title: 'Legacy', subtitle: 'Chapter 4',
    text: 'My grandmothers sewed. A relative of mine made monuments.',
    content: 'My maternal grandmother supported her family with a basic sewing machine. My paternal grandmother made blankets to give to anyone who needed one.\n\nNeither of them called it design. To them, it was solving a problem or caring for someone. I think that is where I learned that making things by hand is always for someone.\n\nAnd they weren\'t the only ones. There are a lot of artists in my family. The best known is Rodrigo Arenas Betancourt, my maternal great-grandfather\'s cousin. A sculptor, one of Colombia\'s most important, the kind who made monuments. He lived from 1919 to 1995.\n\nI grew up hearing those names like you hear other people\'s stories. Art was their thing. Not mine.',
  },
  sonido: {
    title: 'Sound', subtitle: 'Chapter 5',
    text: 'Before I knew how to explain myself, I was already playing.',
    content: 'I have had the privilege of playing with the Metropolitan Philharmonic.\n\nThe saxophone taught me to breathe, keep time and, above all, stay quiet when the moment calls for it. In an orchestra, you cannot go your own way: you have to listen to what everyone else is doing and enter exactly where you belong. That has helped me in everything else I do.',
  },
  estructura: {
    title: 'Structure', subtitle: 'Chapter 6 · Systems engineering',
    text: 'Then I decided to build things that worked.',
    content: 'Engineering gave me a way of thinking that I use all the time: break something large into manageable pieces and understand how they fit together.\n\nThese are projects I built from beginning to end, each with open source code for anyone who wants to take a closer look.',
  },
  cuerpo: {
    title: 'Body', subtitle: 'Chapter 7',
    text: 'At some point, the body became part of the story too.',
    content: 'I started pole dance as a sport and it became something else. I competed and won a silver medal, but that is not what stayed with me most: it is the effort of repeating a movement until it works, and what it feels like when it finally does.\n\nMaking something with the body and making something with the hands are more alike than they seem.',
  },
  quiebre: {
    title: 'Turning Point', subtitle: 'Chapter 9',
    text: 'For a long time, I believed I was not a creative person.',
    content: 'I always thought I was bad at art. At school I didn\'t even try. And if I didn\'t show interest, nobody noticed I couldn\'t do it.\n\nI stuck with what I knew I could do: logic, right answers, things that add up. Funny, since I grew up surrounded by art and sewing.\n\nThen a few things happened almost at once. My dad had a stroke. I was living far from home, speaking a language that still didn\'t come easy. Some days you just can\'t find the words, in Spanish or in the other language.\n\nThat\'s when I went back to making things with my hands. It wasn\'t a plan. It was how I said what I couldn\'t say out loud. And it turns out I wasn\'t as bad as I thought.',
  },
  diseno: {
    title: 'Fashion Design', subtitle: 'Chapter 10',
    text: 'I returned to making things with my hands, this time seriously.',
    content: 'Moodboards, sketches, fabrics, patterns, runway shows. Studying fashion design meant giving myself permission to do something that had been circling me for years.\n\nI was surprised by how much it resembles programming: you start with a vague idea, make it concrete, test, make mistakes, undo the seams and begin again.',
  },
  mixto: {
    title: 'Connections', subtitle: 'Chapter 8',
    text: 'Pole and sax, in the same choreography.',
    content: 'I\'ve done performances where I bring both together. I do part of the choreography on the pole, then I stand up, grab the sax and play. And the whole thing tells a story.\n\nThe idea is that it doesn\'t feel like two separate acts: the movement leads me to the music, and the music takes me back to the pole.\n\nThese videos are from those moments.',
  },
  juego: {
    title: 'Video Games', subtitle: 'Chapter 11',
    text: 'Writing code that can also be played.',
    content: 'Small worlds made with Unity and C#, playable right here in the browser with no download required.\n\nMaking games forces me to think about the person on the other side: if they do not understand what to do in the first few seconds, they leave. More code does not fix that; testing with people does.',
  },
  fin: {
    title: 'Thank You', text: 'Thank you for exploring my story.',
    content: 'Every game, every application, every garment and every piece I create carries all these layers. Every decision comes from a process that did not begin in a workshop, but in a life.\n\nThis is not a portfolio of destinations. It is a map of what brought me here.\n\nThank you for walking through it for a while.',
  },
};

const CATEGORY_EN: Record<string, string> = {
  esencia: 'Essence', herencia: 'Roots', expresion: 'Expression',
  transformacion: 'Transformation', mixto: "What's next",
};

const SEASON_EN: Record<string, string> = {
  esencia: 'Season 1: Essence', identidad: 'Season 1: Essence', perfil: 'Season 1: Essence',
  herencia: 'Season 2: Roots',
  sonido: 'Season 3: Expression', estructura: 'Season 3: Expression', cuerpo: 'Season 3: Expression',
  quiebre: 'Season 4: Transformation', diseno: 'Season 4: Transformation',
  mixto: 'Season 3: Expression', juego: "Season 5: What's next", fin: "Season 5: What's next",
};

const CAPTIONS_EN: Record<string, string[]> = {
  estructura: ['My grandmother made my graduation dress. I wanted a 1950s style.'],
  herencia: [
    'My maternal grandmother and her sewing machine',
    'The hands that supported the family',
    'Sewing as a living legacy',
    'From generation to generation',
  ],
  diseno: [
    'Designs proposed for the first semester',
    'Casual universe exercise: transforming a garment',
    'Designs proposed for the urban universe',
    'Designs proposed for the intimate apparel universe',
    'Level 3 work for technical sheets and concept development',
    'Swimsuit made in the Level 3 garment construction class',
    'Sometimes I crochet too', '', '',
    'Scraps from my family\'s clothes that I wanted to transform',
  ],
};

const PROJECT_EN: Record<string, Partial<Omit<Project, 'preview'>> & { preview?: Partial<Project['preview']> }> = {
  verse: {
    desc: 'The online store for my intimate apparel brand. I designed the interface and developed the experience: a box that opens into the catalogue, product details, cart and order flow, with a visual system of night and silk and a Wompi payment integration.',
    preview: { alt: 'Saved homepage of Versé Intimates' },
  },
  'tirame-un-poemita': {
    desc: 'I designed and developed the frontend for discovering random poems, searching by meaning and listening to them. The interface draws on a typewriter, with letter-by-letter text, synthesized Web Audio sounds and a reel-style audio player. It connects to the poetry service for authors, search and audio.',
    preview: { alt: 'Typographic cover of Tírame un Poemita, not an application screenshot', note: 'Project presentation; the interface is available in the frontend repository.' },
  },
  gyg: {
    desc: 'I manage and update the GYG Empaquetaduras website, originally created by 20S Agencia. My work includes updating images and prices, adjusting the payment flow, and improving responsiveness and visibility on mobile and desktop, following the client’s requests.',
    preview: { alt: 'KC036 gasket kit photograph from the GYG catalogue', note: 'A sample from the catalogue I maintain.' },
  },
  portafolio: {
    desc: 'This very site. I designed and developed an experience built around connected chapters, music, draggable collages and an interactive backdrop. A place to experiment with animation, interaction and canvas rendering.',
    preview: { alt: 'Cutout portrait used in Hilos Invisibles', detailAlt: 'A collage element from Hilos Invisibles', note: 'Composition using visual assets from the portfolio.' },
  },
  venux: {
    title: 'Venux — Mobile app',
    desc: 'I developed the mobile application from a supplied Figma design. I implemented registration, profiles, swipe gestures, matches and chat, with authentication and data in Supabase.',
    preview: { alt: 'Venux identity shown on the web login screen', note: 'Visual reference from the web version, not a screenshot of the mobile app.' },
  },
  'venux-web': {
    title: 'Venux — Web version',
    desc: 'I developed the browser version from a supplied Figma design. It shares accounts and a database with the mobile app and brings authentication and application flows to the web.',
    preview: { alt: 'Saved login screen of Venux for the web' },
  },
  mivaquita: {
    desc: 'For group outings when nobody remembers who paid for what. I designed the interface and developed a React application and an Express API to create groups, record expenses and calculate who owes whom.',
    preview: { alt: 'Saved login screen of Mi Vaquita' },
  },
  hotel: {
    title: 'Hotel booking',
    desc: 'I implemented a supplied Figma design: hotel search, filters, details and reservations. I used atomic design to organize reusable buttons, cards and sections, and adapted the interface to different screen sizes.',
    preview: { alt: 'Saved homepage of the hotel booking app' },
  },
  posticks: {
    desc: 'A post-it style notes app for creating, editing, searching and deleting notes. Deleted notes can be restored individually or removed permanently. Notes are stored in the browser and remain there when you return.',
    preview: { alt: 'Saved notes interface of Posticks' },
  },
};

const PROJECT_LINK_EN: Record<string, string> = {
  'Ver en línea': 'Live site',
  'Ver versión web': 'Web version',
  'Código': 'Code',
  'Código frontend': 'Frontend code',
};

const GAME_EN: Record<string, Partial<Game>> = {
  'blighted-blossoms': {
    statusLabel: 'Latest adventure',
    context: { label: 'Final project', nombre: 'Generation Colombia · Cohort 12', url: 'https://itch.io/c/8040884/generation-colombia-ch12' },
    desc: 'A multiplayer combat game set in a dark fantasy world: six guardians face one another beneath the shadow of the Primordial Trees as corruption consumes the world. The prototype supports online 1v1, 2v2 and 3v3 matches, plus a Training mode against an AI opponent.',
    rol: 'Gameplay, combat, multiplayer and VFX', genero: 'Arena MOBA / PvP',
    architecture: [
      { label: 'Online combat', detail: 'Player, attack and ability synchronization for 1v1, 2v2 and 3v3 matches with Photon Fusion.' },
      { label: 'Six guardians', detail: 'A character roster with basic attacks and ultimate abilities, each with its own range, damage, cooldowns and effects.' },
      { label: 'AI training', detail: 'A local mode against an AI-controlled opponent for testing the game without waiting for another player.' },
      { label: 'Tactical clarity', detail: 'MOBA camera, nearest-opponent lock-on, combat HUD and alerts that make health and ability timings easy to read.' },
      { label: 'Living arena', detail: 'Power-ups, rewards and magical effects that communicate hits, danger zones and each character\'s powers.' },
      { label: 'Audio and options', detail: 'Music by scene, interface and ability sound effects, an audio mixer and volume controls.' },
    ],
  },
  whackamole: {
    desc: 'A mole digs downward, step by step, and the deeper it goes, the harder the game becomes. Built as a team during the Generation Game Jam around the theme “Deeper and Deeper”.',
    rol: 'Programmer - levels, power-ups and obstacles', genero: 'Arcade / game jam',
    architecture: [
      { label: 'Level progression', detail: 'A LevelManager rebuilds each level in place and shapes difficulty with uniform, alternating and compressed patterns.' },
      { label: 'Varied platforms', detail: 'A pool of platforms with edge gaps and advanced hard-soil variants, plus a sinking effect when falling into a hole.' },
      { label: 'Pickaxe power-up', detail: 'Stored in the inventory and activated with the space bar to temporarily increase mining speed.' },
      { label: 'Lives and continue', detail: 'When lives remain, the run continues on the same level instead of returning to the first one.' },
      { label: 'Spikes', detail: 'A lethal obstacle that only appears in safe cells, never on a mining hole or below the previous platform\'s gap.' },
      { label: 'Item spawning', detail: 'Randomized per level, with a guaranteed extra life after several levels without one.' },
    ],
  },
  drunkdriver: {
    desc: 'Drinking and driving are things you should never mix. Or should you? A chaotic racing game made as a team for a jam about combining things that do not belong together. I handled everything you hear, much of what you feel during collisions, and the layer around each run: menu, pause and game over.',
    rol: 'Audio, visual effects and game flow', genero: 'Racing',
    architecture: [
      { label: 'Audio system', detail: 'Music and sound effects for the complete game.' },
      { label: 'Impact effects', detail: 'Camera shake, blood, smoke and sparks during collisions - what makes hitting something feel physical.' },
      { label: 'Game flow', detail: 'A GameFlowManager with menu, gameplay, pause and game-over states, triggered by vehicle health and the character\'s blood alcohol level.' },
      { label: 'Menus', detail: 'Menu, pause and game-over screens built in code and connected to Unity\'s new Input System.' },
      { label: 'Drunk post-processing', detail: 'Vignette, chromatic aberration and distortion that intensify with the character\'s blood alcohol level.' },
      { label: 'HUD fixes', detail: 'The health and alcohol bars were invisible on screen; I restored their behavior.' },
    ],
  },
  quemasparcero: {
    desc: 'A character from Medellín runs across neighborhood rooftops, dodging jumping beans and collecting empanadas. Jump, spend mana on a super jump, recover health with potions and hold on: the farther you go, the faster everything moves. Built for the Ubicua course.',
    rol: 'Programmer', genero: '2D runner',
    architecture: [
      { label: 'Procedural level', detail: 'Prefab blocks are instantiated and destroyed dynamically as the player advances.' },
      { label: 'State machine', detail: 'Menu, gameplay and game over controlled by a singleton GameManager.' },
      { label: '2D physics', detail: 'Rigidbody2D, raycasts for ground detection and collision layers.' },
      { label: 'Health and mana', detail: 'UI bars for health and mana; the super jump consumes mana.' },
      { label: 'Persistence', detail: 'The high score is saved with PlayerPrefs.' },
      { label: 'Camera', detail: 'Smooth player tracking with SmoothDamp.' },
    ],
  },
};

export function localizeNode(node: Node, locale: Locale): Node {
  return locale === 'en' && NODE_EN[node.id] ? { ...node, ...NODE_EN[node.id] } : node;
}

export function localizeProject(project: Project, locale: Locale): Project {
  if (locale !== 'en') return project;
  const copy = PROJECT_EN[project.id];
  return {
    ...project,
    ...copy,
    preview: { ...project.preview, ...copy?.preview },
    links: project.links.map(link => ({ ...link, label: PROJECT_LINK_EN[link.label] ?? link.label })),
  };
}

export function localizeGame(game: Game, locale: Locale): Game {
  return locale === 'en' && GAME_EN[game.id] ? { ...game, ...GAME_EN[game.id] } : game;
}

export function getCategoryLabel(category: string, label: string, locale: Locale) {
  return locale === 'en' ? CATEGORY_EN[category] ?? label : label;
}

export function getSeasonName(nodeId: string, spanishName: string, locale: Locale) {
  return locale === 'en' ? SEASON_EN[nodeId] ?? spanishName : spanishName;
}

export function getImageCaptions(nodeId: string, spanish: string[], locale: Locale) {
  return locale === 'en' ? CAPTIONS_EN[nodeId] ?? spanish : spanish;
}

export function selectCopy<T>(locale: Locale, spanish: T, english: T): T {
  return locale === 'en' ? english : spanish;
}
