require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_EMPLOYEES = [
  "Payal Dulhani","Konica Dalal","Nafees Ansari","Zulfekhar Khan",
  "Rukhsar Ansari","Mohtashim Bux","Zubair Ansari","Tausif Ansari",
  "Priyanshi Konduwala","Bismillah Mohammad","Sameer Ahmed","Izhar Ansari",
  "Zeeshan Husain","Yunus Khan","Naba Naaz","Unnati Yawar",
  "Mubeen Syed","Tushar Choudhary","Haris Bilal","Tarannum Khan",
  "Himanshu Soni","Imtiyaz Hanif","Sheetal Padme"
];

const DEFAULT_DESIGNATIONS = {
  "Payal Dulhani"      : "L1", "Konica Dalal"       : "L1", "Nafees Ansari"      : "L1",
  "Zulfekhar Khan"     : "L2", "Rukhsar Ansari"     : "L2", "Mohtashim Bux"      : "L2",
  "Zubair Ansari"      : "L2", "Tausif Ansari"      : "L2", "Priyanshi Konduwala": "L2",
  "Bismillah Mohammad" : "L2", "Sameer Ahmed"       : "L3", "Izhar Ansari"       : "L4",
  "Zeeshan Husain"     : "L3", "Yunus Khan"         : "L3", "Naba Naaz"          : "L3",
  "Unnati Yawar"       : "L3", "Mubeen Syed"        : "L3", "Tushar Choudhary"   : "L3",
  "Haris Bilal"        : "L3", "Tarannum Khan"      : "L3", "Himanshu Soni"      : "L3",
  "Imtiyaz Hanif"      : "L3", "Sheetal Padme"      : "L4",
};

async function seed() {
  console.log('Seeding Supabase...');
  
  // Note: For a brand new Supabase instance, the tables need to be created first.
  // The SQL for table creation is in implementation_plan.md.
  // This script assumes the tables 'members' and 'score_entries' exist.
  
  const membersToInsert = DEFAULT_EMPLOYEES.map(name => ({
    name,
    designation: DEFAULT_DESIGNATIONS[name] || 'L3'
  }));
  
  const { data, error } = await supabase
    .from('members')
    .upsert(membersToInsert, { onConflict: 'name' });
    
  if (error) {
    console.error('Error seeding members:', error);
  } else {
    console.log('Successfully seeded members!');
  }
}

seed();
