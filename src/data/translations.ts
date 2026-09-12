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
    content: 'This chapter has no projects or deliverables.\n\nIt holds memories, places and people: the moments that do not belong in a portfolio, but still explain why I make what I make.',
  },
  perfil: {
    title: 'Profile', subtitle: 'Chapter 3',
    text: 'Systems engineer, fashion design technician and game developer.',
    content: 'I studied systems engineering and fashion design, and I love creating video games. I have spent years building web applications with React, TypeScript and Node - that remains my foundation as a frontend developer.\n\nBecause I love learning and have always enjoyed creating, I eventually wanted to make something with my hands and stepped into fashion. Without realizing it, that became a complement to game development, which is where I am focusing my career.\n\nI do not see them as separate paths. I use the same process everywhere: understand what is needed, test, adjust and try again until it works.',
  },
  herencia: {
    title: 'Legacy', subtitle: 'Chapter 4',
    text: 'Before me, there were already hands sewing to support others.',
    content: 'My maternal grandmother supported her family with a basic sewing machine. My paternal grandmother made blankets to give to anyone who needed one.\n\nNeither of them called it design. To them, it was solving a problem or caring for someone. I think that is where I learned that making things by hand is always for someone.',
  },
  arte: { title: 'Family Art', subtitle: 'Connection', text: 'I grew up surrounded by art, but never thought it was for me.' },
  sonido: {
    title: 'Sound', subtitle: 'Chapter 6',
    text: 'Before I knew how to explain myself, I was already playing.',
    content: 'I have had the privilege of playing with the Metropolitan Philharmonic.\n\nThe saxophone taught me to breathe, keep time and, above all, stay quiet when the moment calls for it. In an orchestra, you cannot go your own way: you have to listen to what everyone else is doing and enter exactly where you belong. That has helped me in everything else I do.',
  },
  estructura: {
    title: 'Structure', subtitle: 'Chapter 7 · Systems engineering',
    text: 'Then I decided to build things that worked.',
    content: 'Engineering gave me a way of thinking that I use all the time: break something large into manageable pieces and understand how they fit together.\n\nThese are projects I built from beginning to end, each with open source code for anyone who wants to take a closer look.',
  },
  cuerpo: {
    title: 'Body', subtitle: 'Chapter 8',
    text: 'At some point, the body became part of the story too.',
    content: 'I started pole dance as a sport and it became something else. I competed and won a silver medal, but that is not what stayed with me most: it is the effort of repeating a movement until it works, and what it feels like when it finally does.\n\nMaking something with the body and making something with the hands are more alike than they seem.',
  },
  quiebre: {
    title: 'Turning Point', subtitle: 'Chapter 9',
    text: 'For a long time, I believed I was not a creative person.',
    content: 'I learned to find value in logic, structure and correct answers.\n\nEven though I grew up surrounded by art, sewing and stories of creation, I never thought that world could belong to me too.\n\nLife eventually challenged that idea.\n\nMy father\'s stroke, living far from home and the difficulty of communicating in another language forced me to look at things from a different place.\n\nThat is when I understood something I had overlooked for years:\n\nthings made by hand are also a form of language.\n\nPerhaps creativity was never absent.\n\nPerhaps I had simply learned not to see it.',
  },
  diseno: {
    title: 'Fashion Design', subtitle: 'Chapter 10',
    text: 'I returned to making things with my hands, this time seriously.',
    content: 'Moodboards, sketches, fabrics, patterns, runway shows. Studying fashion design meant giving myself permission to do something that had been circling me for years.\n\nI was surprised by how much it resembles programming: you start with a vague idea, make it concrete, test, make mistakes, undo the seams and begin again.',
  },
  mixto: {
    title: 'Connections', subtitle: 'Chapter 11',
    text: 'Sometimes everything happens at once.',
    content: 'There are moments when I am not playing music, training or designing separately: I am simply making something, and all of those parts are there together.\n\nThese are those moments.',
  },
  juego: {
    title: 'Video Games', subtitle: 'Chapter 12',
    text: 'Writing code that can also be played.',
    content: 'Small worlds made with Unity and C#, playable right here in the browser with no download required.\n\nMaking games forces me to think about the person on the other side: if they do not understand what to do in the first few seconds, they leave. More code does not fix that; testing with people does.',
  },
  proceso: {
    title: 'Outside the Process', subtitle: 'Chapter 13',
    text: 'There are also times when I am not producing anything.',
    content: 'I read a lot and watch plenty of anime, which gives me more than I admit: framing, color and ways of telling a story.\n\nI listen to jazz, metal and classical music depending on the day. And I enjoy sitting down with a glass of wine or a beer without doing anything productive.\n\nMuch of what eventually appears in my work comes from there.',
  },
  fin: {
    title: 'Thank You', text: 'Thank you for exploring my story.',
    content: 'Every game, every application, every garment and every piece I create carries all these layers. Every decision comes from a process that did not begin in a workshop, but in a life.\n\nThis is not a portfolio of destinations. It is a map of what brought me here.\n\nThank you for walking through it for a while.',
  },
};

const CATEGORY_EN: Record<string, string> = {
  esencia: 'Essence', herencia: 'Roots', expresion: 'Expression',
  transformacion: 'Transformation', mixto: 'Connections',
};

const SEASON_EN: Record<string, string> = {
  esencia: 'Season 1: Essence', identidad: 'Season 1: Essence', perfil: 'Season 1: Essence',
  herencia: 'Season 2: Roots', arte: 'Season 2: Roots',
  sonido: 'Season 3: Expression', estructura: 'Season 3: Expression', cuerpo: 'Season 3: Expression',
  quiebre: 'Season 4: Transformation', diseno: 'Season 4: Transformation',
  mixto: 'Season 5: Connections', juego: 'Season 5: Connections', proceso: 'Season 5: Connections', fin: 'Season 5: Connections',
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

const PROJECT_EN: Record<string, Partial<Project>> = {
  verse: {
    title: 'Versé Intimates',
    desc: 'The online store for my intimate apparel brand. The experience begins as a closed box that opens into the catalogue, product details, cart and order flow. I built its two-world visual system - night and silk - a centralized catalogue and a secure Wompi integration that calculates and signs payments on the server.',
    links: [{ label: 'Code', url: 'https://github.com/tatyajh/verse' }],
  },
  'tirame-un-poemita': {
    title: 'Tírame un Poemita',
    desc: 'An interface for discovering random poems, searching them by meaning and listening to them. I designed it as a typewriter: text appears letter by letter with sounds synthesized through Web Audio, while the audio player takes the shape of a reel-to-reel tape. It includes routes for poems, authors and semantic search.',
    links: [{ label: 'Frontend code', url: 'https://github.com/tatyajh/tirame-un-poemita-frontend' }],
  },
  portafolio: {
    desc: 'This very site. Instead of a project list, I wanted an experience to move through: connected chapters, background music, draggable collages and a playful interactive backdrop. It is where I experiment with animation, interaction and canvas rendering, so it is always evolving.',
    links: [{ label: 'Code', url: 'https://github.com/tatyajh/portafolio' }],
  },
  venux: {
    title: 'Venux - Mobile app',
    desc: 'A mobile dating app with the complete flow: registration, profile, swiping, matching and chat. Thirteen connected screens built in JavaScript, with PostgreSQL in Supabase storing users, matches and messages and handling authentication. The biggest lesson was designing for the thumb: gestures, screen-to-screen navigation and making it feel fluid on a real phone.',
  },
  'venux-web': {
    title: 'Venux - Web version',
    desc: 'The same dating app, built for the browser so it can be used without installing anything. It shares its database and accounts with the mobile version, but the interface is designed for large screens, mouse and keyboard rather than the thumb.',
  },
  mivaquita: {
    desc: 'For group outings when nobody remembers who paid for what. Create a group, record expenses, and the app calculates how much each person contributed and who owes whom. I built it end to end: a React interface and an Express API split into routes, logic and data layers so new features do not require changing everything else.',
  },
  hotel: {
    title: 'Hotel booking',
    desc: 'A hotel search and booking interface: filter, browse hotel cards and open the details. I built it with atomic design, organizing the interface from its smallest pieces to complete pages, so changing one button does not require reviewing half the application.',
    links: [
      { label: 'Live site', url: 'https://hotel-react-reto4.vercel.app' },
      { label: 'Code', url: 'https://github.com/tatyajh/hotel-react-reto4' },
    ],
  },
  posticks: {
    desc: 'A post-it style notes app for creating, editing, searching and deleting notes. My favorite problem was the trash: deleted notes stay recoverable until the user chooses to restore them individually or empty everything. Notes are stored in the browser and remain there when you return.',
    links: [{ label: 'Code', url: 'https://github.com/tatyajh/posticks' }],
  },
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
  return locale === 'en' && PROJECT_EN[project.id] ? { ...project, ...PROJECT_EN[project.id] } : project;
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
