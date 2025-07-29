
export type Note = {
  id: number;
  title: string;
  content: string;
  position: { x: number; y: number };
};

export type AttackPatternType = 'shadow' | 'echo' | 'guardian';

export type Enemy = {
  id: number;
  name: string;
  position: { x: number; y: number };
  hp: number;
  maxHp: number;
  damage: number;
  attackPattern: AttackPatternType;
  isBoss?: boolean;
  dialogue: {
    check: string;
    talk: string;
    attack: string;
    spare: string;
    defeat: string;
  };
};

export type Tile = 'floor' | 'wall';

export type GameMap = {
  layout: Tile[][];
  notes: Note[];
  enemies: Enemy[];
  playerStart: { x: number; y: number };
};

const layout: Tile[][] = [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall'],
    ['wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall'],
    ['wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall'],
    ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall'],
    ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];


const notes: Note[] = [
  {
    id: 1,
    position: { x: 3, y: 3 },
    title: 'Первый отголосок',
    content: 'С днем рождения. Этот лабиринт — отражение твоей души. Не бойся его. Каждый коридор — это возможность узнать себя лучше, каждая найденная записка — подарок от твоего прошлого я',
  },
  {
    id: 2,
    position: { x: 10, y: 3 },
    title: 'Шепот прошлого',
    content: 'Тени, которых ты встречаешь — это не враги. Это заблудившиеся воспоминания. Поговори с ними, подбодри их, и они покажут тебе путь. Твоя доброта — ключ к выходу',
  },
  {
    id: 3,
    position: { x: 7, y: 7 },
    title: 'Напоминание',
    content: 'Помнишь, как в детстве ты мечтала о приключениях в свой день рождения? Это одно из них. Каждый шаг здесь наполнен магией твоего праздника. Наслаждайся моментом',
  },
  {
    id: 4,
    position: { x: 1, y: 9 },
    title: 'Письмо от друга',
    content: 'С Днем Рождения! Я знал, что ты пройдешь этот путь. Это путешествие — мой подарок тебе. Путь к самомой себе. Остался последний шаг. Найди Хранителя, и твоя награда ждет тебя.',
  },
   {
    id: 5,
    position: { x: 17, y: 9 },
    title: 'Секрет Хранителя',
    content: 'Хранитель — это не страж тьмы, а защитник твоих самых светлых воспоминаний. Он просто хочет убедиться, что ты готова их принять. Покажи ему свою решимость и доброе сердце',
  },
  {
    id: 6,
    position: { x: 17, y: 1 },
    title: 'Забытый подарок',
    content: 'В детстве ты верила, что в день рождения случаются чудеса. И ты была права. Это место — доказательство. Продолжай идти и главное чудо будет ждать тебя впереди.',
  },
  {
    id: 7,
    position: { x: 13, y: 7 },
    title: 'Осколок зеркала',
    content: 'Ты видишь в отражении свет своей прекрасной улыбки. Сила, которая ведет тебя — это твоя любовь к жизни. Не сомневайся в себе. Ты главный герой этого приключения',
  },
];

const enemies: Enemy[] = [
  { 
    id: 1, name: "Робкая Тень", 
    position: { x: 5, y: 1 }, 
    hp: 3, maxHp: 3, damage: 1, 
    attackPattern: 'shadow',
    dialogue: {
      check: "* Робкая Тень - УР 1, АТК 1, ЗАЩ 1. \n* Она выглядит немного напуганной. Кажется, она не хочет драться.",
      talk: "* Ты говоришь тени несколько ободряющих слов. Она с любопытством смотрит на тебя.",
      attack: "* Робкая Тень неловко бросает в тебя сгустки тьмы.",
      spare: "* Ты улыбаешься тени. Она радостно машет тебе и исчезает.",
      defeat: "* Тень благодарно кивает тебе и растворяется в свете. Ты помогла ей найти покой."
    }
  },
  { 
    id: 2, name: "Забытое Эхо", 
    position: { x: 8, y: 5 }, 
    hp: 4, maxHp: 4, damage: 1, 
    attackPattern: 'echo',
    dialogue: {
      check: "* Забытое Эхо - УР 1, АТК 1, ЗАЩ 2. \n* Оно тихо напевает какую-то мелодию. Кажется, оно очень одиноко.",
      talk: "* Ты начинаешь напевать вместе с ним. Эхо выглядит удивленным и счастливым.",
      attack: "* Эхо атакует звуковыми волнами, которые похожи на грустную песню.",
      spare: "* Ты даришь Эху свое тепло. Оно растворяется, оставляя после себя чувство легкой ностальгии.",
      defeat: "* Эхо находит свою мелодию. Воспоминание обрело гармонию благодаря тебе."
    }
  },
  { 
    id: 3, name: "Робкая Тень", 
    position: { x: 3, y: 8 }, 
    hp: 3, maxHp: 3, damage: 1, 
    attackPattern: 'shadow',
    dialogue: {
      check: "* Робкая Тень - УР 1, АТК 1, ЗАЩ 1. \n* Еще одно воспоминание. Оно сжимается от страха",
      talk: "* Твои слова успокаивают тень. Она перестает дрожать.",
      attack: "* Робкая Тень пытается защититься",
      spare: "* Твоя доброта помогает тени найти покой. Она исчезает",
      defeat: "* Ты протягиваешь руку, и тень доверчиво касается ее, прежде чем исчезнуть. Еще один страх развеян"
    }
  },
  { 
    id: 4, name: "Хранитель Воспоминаний", 
    position: { x: 17, y: 8 }, 
    hp: 10, maxHp: 10, isBoss: true, damage: 3,
    attackPattern: 'guardian',
    dialogue: {
      check: "* Хранитель Воспоминаний - УР ??, АТК ??, ЗАЩ ??. \n* Он страж твоих самых дорогих моментов. Он хочет проверить, достойна ли ты их.",
      talk: "* Ты говоришь Хранителю, что готова принять свое прошлое. Он кивает, но его взгляд остается серьезным.",
      attack: "* Хранитель устраивает тебе испытание!",
      spare: "* Ты показываешь Хранителю свою решимость. Он видит твою доброту и уступает дорогу.",
      defeat: "* Хранитель склоняет голову. Ты доказала, что готова принять свой дар. Путь открыт."
    }
  },
  { 
    id: 5, name: "Забытое Эхо", 
    position: { x: 15, y: 3 }, 
    hp: 4, maxHp: 4, damage: 1,
    attackPattern: 'echo',
    dialogue: {
      check: "* Забытое Эхо - УР 1, АТК 1, ЗАЩ 2. \n* Оно выглядит потерянным. Ему нужна помощь.",
      talk: "* Ты рассказываешь Эху, что оно не одно. Кажется, это помогает. Оно выглядит спокойнее.",
      attack: "* Эхо плачет светлыми слезами, которые превращаются в пули.",
      spare: "* Ты обнимаешь Эхо, и оно исчезает с благодарностью.",
      defeat: "* Печальная мелодия сменяется радостной. Ты помогла этому воспоминанию снова зазвучать"
    }
  },
  { 
    id: 6, name: "Робкая Тень", 
    position: { x: 14, y: 9 }, 
    hp: 3, maxHp: 3, damage: 1, 
    attackPattern: 'shadow',
    dialogue: {
      check: "* Робкая Тень - УР 1, АТК 1, ЗАЩ 1. \n* Она боится сделать первый шаг.",
      talk: "* Ты говоришь, что веришь в нее. Тень колеблется. Может это сработает?",
      attack: "* Тень пытается быть храброй и атакует",
      spare: "* Твоя уверенность вдохновляет Тень. Она улыбается и исчезает.",
      defeat: "* Тень расправляет плечи и уверенно шагает в свет. Ты вселила в нее храбрость."
    }
  },
];

export const gameMap: GameMap = {
  layout,
  notes,
  enemies,
  playerStart: { x: 1, y: 1 },
};
