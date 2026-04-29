export const DEFAULT_EMPLOYEES = [
  "Payal Dulhani","Konica Dalal","Nafees Ansari","Zulfekhar Khan",
  "Rukhsar Ansari","Mohtashim Bux","Zubair Ansari","Tausif Ansari",
  "Priyanshi Konduwala","Bismillah Mohammad","Sameer Ahmed","Izhar Ansari",
  "Zeeshan Husain","Yunus Khan","Naba Naaz","Unnati Yawar",
  "Mubeen Syed","Tushar Choudhary","Haris Bilal","Tarannum Khan",
  "Himanshu Soni","Imtiyaz Hanif","Sheetal Padme"
];

export const AVATAR_COLORS = [
  ['#1e3a5f','#2d7aed'],['#3d1f00','#f0a500'],['#1a3d2b','#16a34a'],
  ['#3d0f1f','#dc2626'],['#1f1a3d','#7c3aed'],['#003d3d','#0891b2'],
  ['#3d2d00','#d97706'],['#002a3d','#0369a1'],['#3d1f3d','#a855f7'],
  ['#003d1a','#15803d'],['#3d0000','#b91c1c'],['#1a3d3d','#0e7490'],
  ['#2d2d00','#ca8a04'],['#00213d','#1d4ed8'],['#3d1a00','#c2410c'],
  ['#003d2d','#059669'],['#2d003d','#9333ea'],['#3d3d00','#a16207'],
  ['#001a3d','#1e40af'],['#3d0029','#be185d'],['#003d3d','#0f766e'],
  ['#1a003d','#6d28d9'],['#1e1e1e','#4b5563']
];

export const DEFAULT_DESIGNATIONS = {
  "Payal Dulhani"      : "L1",
  "Konica Dalal"       : "L1",
  "Nafees Ansari"      : "L1",
  "Zulfekhar Khan"     : "L2",
  "Rukhsar Ansari"     : "L2",
  "Mohtashim Bux"      : "L2",
  "Zubair Ansari"      : "L2",
  "Tausif Ansari"      : "L2",
  "Priyanshi Konduwala": "L2",
  "Bismillah Mohammad" : "L2",
  "Sameer Ahmed"       : "L3",
  "Izhar Ansari"       : "L4",
  "Zeeshan Husain"     : "L3",
  "Yunus Khan"         : "L3",
  "Naba Naaz"          : "L3",
  "Unnati Yawar"       : "L3",
  "Mubeen Syed"        : "L3",
  "Tushar Choudhary"   : "L3",
  "Haris Bilal"        : "L3",
  "Tarannum Khan"      : "L3",
  "Himanshu Soni"      : "L3",
  "Imtiyaz Hanif"      : "L3",
  "Sheetal Padme"      : "L4",
};

export const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const TIER_LEVELS = ['L1','L2','L3','L4'];
export const TIER_META = {
  'L1': { color:'#0891b2', glow:'rgba(8,145,178,0.18)', label:'L1 · Foundation', icon:'◆' },
  'L2': { color:'#2d7aed', glow:'rgba(45,122,237,0.18)', label:'L2 · Core',      icon:'◈' },
  'L3': { color:'#f0a500', glow:'rgba(240,165,0,0.18)',  label:'L3 · Senior',    icon:'◉' },
  'L4': { color:'#16a34a', glow:'rgba(22,163,74,0.18)',  label:'L4 · Lead',      icon:'★' },
};

export const SCORE_LABELS = {
  1:    { label: 'Exceptional (+1)',      cls: 'text-p1',  bgCls: 'bg-p1'  },
  0.5:  { label: 'Stretch (+0.5)',        cls: 'text-p05', bgCls: 'bg-p05' },
  0:    { label: 'Baseline (0)',          cls: 'text-zero',bgCls: 'bg-zero'},
  '-0.5':{ label: 'Process Miss (-0.5)', cls: 'text-n05', bgCls: 'bg-n05' },
  '-1': { label: 'Serious Breach (-1)',   cls: 'text-n1',  bgCls: 'bg-n1'  },
};
