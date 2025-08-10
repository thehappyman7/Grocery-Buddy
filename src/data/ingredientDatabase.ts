// Comprehensive ingredient database for AI-powered recipe matching
export interface Ingredient {
  name: string;
  category: string;
  origin: 'Indian' | 'International' | 'Universal';
  aliases: string[];
  commonPairings: string[];
}

export const ingredientDatabase: Ingredient[] = [
  // Indian Spices & Seasonings
  { name: 'turmeric', category: 'spices', origin: 'Indian', aliases: ['haldi'], commonPairings: ['cumin', 'coriander', 'ginger'] },
  { name: 'cumin', category: 'spices', origin: 'Indian', aliases: ['jeera'], commonPairings: ['coriander', 'turmeric', 'garam masala'] },
  { name: 'coriander', category: 'spices', origin: 'Indian', aliases: ['dhania'], commonPairings: ['cumin', 'turmeric', 'ginger'] },
  { name: 'garam masala', category: 'spices', origin: 'Indian', aliases: [], commonPairings: ['onions', 'tomatoes', 'ginger'] },
  { name: 'mustard seeds', category: 'spices', origin: 'Indian', aliases: ['rai'], commonPairings: ['curry leaves', 'dal', 'vegetables'] },
  { name: 'curry leaves', category: 'herbs', origin: 'Indian', aliases: ['kadi patta'], commonPairings: ['mustard seeds', 'dal', 'coconut'] },
  { name: 'asafoetida', category: 'spices', origin: 'Indian', aliases: ['hing'], commonPairings: ['dal', 'vegetables', 'cumin'] },
  { name: 'cardamom', category: 'spices', origin: 'Indian', aliases: ['elaichi'], commonPairings: ['milk', 'rice', 'tea'] },
  { name: 'cinnamon', category: 'spices', origin: 'Indian', aliases: ['dalchini'], commonPairings: ['cardamom', 'cloves', 'tea'] },
  { name: 'cloves', category: 'spices', origin: 'Indian', aliases: ['laung'], commonPairings: ['cinnamon', 'cardamom', 'garam masala'] },
  { name: 'fenugreek', category: 'spices', origin: 'Indian', aliases: ['methi'], commonPairings: ['vegetables', 'dal', 'chapati'] },
  { name: 'carom seeds', category: 'spices', origin: 'Indian', aliases: ['ajwain'], commonPairings: ['bread', 'vegetables', 'deep frying'] },

  // Indian Lentils & Pulses
  { name: 'toor dal', category: 'pulses', origin: 'Indian', aliases: ['arhar dal', 'pigeon peas'], commonPairings: ['turmeric', 'sambar powder', 'vegetables'] },
  { name: 'moong dal', category: 'pulses', origin: 'Indian', aliases: ['mung dal', 'green gram'], commonPairings: ['turmeric', 'ginger', 'cumin'] },
  { name: 'chana dal', category: 'pulses', origin: 'Indian', aliases: ['bengal gram'], commonPairings: ['turmeric', 'ginger', 'vegetables'] },
  { name: 'masoor dal', category: 'pulses', origin: 'Indian', aliases: ['red lentils'], commonPairings: ['turmeric', 'onions', 'tomatoes'] },
  { name: 'urad dal', category: 'pulses', origin: 'Indian', aliases: ['black gram'], commonPairings: ['ginger', 'asafoetida', 'curry leaves'] },
  { name: 'kidney beans', category: 'pulses', origin: 'Indian', aliases: ['rajma'], commonPairings: ['onions', 'tomatoes', 'garam masala'] },
  { name: 'chickpeas', category: 'pulses', origin: 'Indian', aliases: ['chole', 'garbanzo beans'], commonPairings: ['onions', 'tomatoes', 'garam masala'] },
  { name: 'black beans', category: 'pulses', origin: 'Indian', aliases: ['kala chana'], commonPairings: ['ginger', 'tamarind', 'coconut'] },

  // Indian Flours & Grains
  { name: 'wheat flour', category: 'grains', origin: 'Indian', aliases: ['atta', 'chapati flour'], commonPairings: ['ghee', 'salt', 'water'] },
  { name: 'all purpose flour', category: 'grains', origin: 'Indian', aliases: ['maida'], commonPairings: ['baking powder', 'yogurt', 'oil'] },
  { name: 'gram flour', category: 'grains', origin: 'Indian', aliases: ['besan', 'chickpea flour'], commonPairings: ['turmeric', 'ginger', 'vegetables'] },
  { name: 'rice flour', category: 'grains', origin: 'Indian', aliases: [], commonPairings: ['coconut', 'jaggery', 'cardamom'] },
  { name: 'semolina', category: 'grains', origin: 'Indian', aliases: ['suji', 'rava'], commonPairings: ['vegetables', 'curry leaves', 'mustard seeds'] },
  { name: 'basmati rice', category: 'grains', origin: 'Indian', aliases: ['rice'], commonPairings: ['ghee', 'cumin', 'saffron'] },
  { name: 'poha', category: 'grains', origin: 'Indian', aliases: ['flattened rice'], commonPairings: ['curry leaves', 'mustard seeds', 'turmeric'] },
  { name: 'sabudana', category: 'grains', origin: 'Indian', aliases: ['tapioca pearls'], commonPairings: ['peanuts', 'cumin', 'green chili'] },

  // Indian Dairy & Fats
  { name: 'paneer', category: 'dairy', origin: 'Indian', aliases: ['cottage cheese'], commonPairings: ['tomatoes', 'spinach', 'cream'] },
  { name: 'ghee', category: 'fats', origin: 'Indian', aliases: ['clarified butter'], commonPairings: ['rice', 'dal', 'vegetables'] },
  { name: 'yogurt', category: 'dairy', origin: 'Indian', aliases: ['curd', 'dahi'], commonPairings: ['cucumber', 'mint', 'cumin'] },
  { name: 'buttermilk', category: 'dairy', origin: 'Indian', aliases: ['chaas'], commonPairings: ['ginger', 'curry leaves', 'salt'] },

  // Indian Vegetables
  { name: 'okra', category: 'vegetables', origin: 'Indian', aliases: ['bhindi', 'ladies finger'], commonPairings: ['onions', 'tomatoes', 'turmeric'] },
  { name: 'bottle gourd', category: 'vegetables', origin: 'Indian', aliases: ['lauki', 'doodhi'], commonPairings: ['ginger', 'cumin', 'dal'] },
  { name: 'bitter gourd', category: 'vegetables', origin: 'Indian', aliases: ['karela'], commonPairings: ['onions', 'turmeric', 'jaggery'] },
  { name: 'eggplant', category: 'vegetables', origin: 'Indian', aliases: ['baingan', 'brinjal'], commonPairings: ['onions', 'tomatoes', 'tamarind'] },
  { name: 'drumsticks', category: 'vegetables', origin: 'Indian', aliases: ['moringa'], commonPairings: ['sambar', 'coconut', 'dal'] },
  { name: 'snake gourd', category: 'vegetables', origin: 'Indian', aliases: [], commonPairings: ['coconut', 'curry leaves', 'mustard seeds'] },
  { name: 'ridge gourd', category: 'vegetables', origin: 'Indian', aliases: ['turai'], commonPairings: ['onions', 'turmeric', 'cumin'] },

  // Indian Condiments & Sweeteners
  { name: 'tamarind', category: 'condiments', origin: 'Indian', aliases: ['imli'], commonPairings: ['jaggery', 'dal', 'sambar'] },
  { name: 'jaggery', category: 'sweeteners', origin: 'Indian', aliases: ['gur'], commonPairings: ['tamarind', 'coconut', 'sesame'] },
  { name: 'coconut', category: 'nuts', origin: 'Indian', aliases: ['nariyal'], commonPairings: ['curry leaves', 'mustard seeds', 'rice'] },
  { name: 'sesame oil', category: 'oils', origin: 'Indian', aliases: ['til oil'], commonPairings: ['vegetables', 'dal', 'rice'] },
  { name: 'mustard oil', category: 'oils', origin: 'Indian', aliases: [], commonPairings: ['fish', 'vegetables', 'pickles'] },

  // International Vegetables
  { name: 'avocado', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['lime', 'salt', 'tomatoes'] },
  { name: 'broccoli', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['garlic', 'olive oil', 'lemon'] },
  { name: 'zucchini', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['garlic', 'olive oil', 'herbs'] },
  { name: 'bell peppers', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['onions', 'garlic', 'olive oil'] },
  { name: 'asparagus', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['garlic', 'lemon', 'parmesan'] },
  { name: 'artichoke', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['lemon', 'garlic', 'olive oil'] },
  { name: 'brussels sprouts', category: 'vegetables', origin: 'International', aliases: [], commonPairings: ['bacon', 'garlic', 'balsamic'] },

  // International Cheese & Dairy
  { name: 'mozzarella', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['tomatoes', 'basil', 'olive oil'] },
  { name: 'parmesan', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['pasta', 'garlic', 'black pepper'] },
  { name: 'cheddar', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['bread', 'butter', 'crackers'] },
  { name: 'feta cheese', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['olives', 'tomatoes', 'olive oil'] },
  { name: 'cream cheese', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['bagels', 'salmon', 'herbs'] },
  { name: 'sour cream', category: 'dairy', origin: 'International', aliases: [], commonPairings: ['potatoes', 'chives', 'tacos'] },

  // International Herbs & Spices
  { name: 'oregano', category: 'herbs', origin: 'International', aliases: [], commonPairings: ['tomatoes', 'garlic', 'olive oil'] },
  { name: 'thyme', category: 'herbs', origin: 'International', aliases: [], commonPairings: ['garlic', 'lemon', 'chicken'] },
  { name: 'rosemary', category: 'herbs', origin: 'International', aliases: [], commonPairings: ['potatoes', 'lamb', 'olive oil'] },
  { name: 'basil', category: 'herbs', origin: 'International', aliases: [], commonPairings: ['tomatoes', 'mozzarella', 'garlic'] },
  { name: 'paprika', category: 'spices', origin: 'International', aliases: [], commonPairings: ['chicken', 'potatoes', 'cream'] },
  { name: 'black pepper', category: 'spices', origin: 'International', aliases: [], commonPairings: ['salt', 'garlic', 'lemon'] },

  // International Condiments & Sauces
  { name: 'soy sauce', category: 'condiments', origin: 'International', aliases: [], commonPairings: ['garlic', 'ginger', 'rice'] },
  { name: 'sriracha', category: 'condiments', origin: 'International', aliases: [], commonPairings: ['mayo', 'noodles', 'eggs'] },
  { name: 'mustard', category: 'condiments', origin: 'International', aliases: [], commonPairings: ['bread', 'meat', 'cheese'] },
  { name: 'mayonnaise', category: 'condiments', origin: 'International', aliases: ['mayo'], commonPairings: ['bread', 'salad', 'sandwiches'] },
  { name: 'olive oil', category: 'oils', origin: 'International', aliases: [], commonPairings: ['garlic', 'herbs', 'vegetables'] },
  { name: 'balsamic vinegar', category: 'condiments', origin: 'International', aliases: [], commonPairings: ['olive oil', 'salad', 'tomatoes'] },

  // International Grains & Pasta
  { name: 'pasta', category: 'grains', origin: 'International', aliases: [], commonPairings: ['tomato sauce', 'garlic', 'cheese'] },
  { name: 'quinoa', category: 'grains', origin: 'International', aliases: [], commonPairings: ['vegetables', 'herbs', 'lemon'] },
  { name: 'couscous', category: 'grains', origin: 'International', aliases: [], commonPairings: ['vegetables', 'herbs', 'olive oil'] },
  { name: 'tortillas', category: 'grains', origin: 'International', aliases: [], commonPairings: ['beans', 'cheese', 'salsa'] },
  { name: 'bread', category: 'grains', origin: 'International', aliases: [], commonPairings: ['butter', 'cheese', 'jam'] },

  // International Nuts & Seeds
  { name: 'almonds', category: 'nuts', origin: 'International', aliases: [], commonPairings: ['honey', 'chocolate', 'milk'] },
  { name: 'walnuts', category: 'nuts', origin: 'International', aliases: [], commonPairings: ['salad', 'cheese', 'honey'] },
  { name: 'pine nuts', category: 'nuts', origin: 'International', aliases: [], commonPairings: ['pesto', 'salad', 'pasta'] },
  { name: 'sunflower seeds', category: 'nuts', origin: 'International', aliases: [], commonPairings: ['salad', 'bread', 'snacks'] },

  // Universal Ingredients
  { name: 'onions', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['garlic', 'tomatoes', 'ginger'] },
  { name: 'tomatoes', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['onions', 'garlic', 'basil'] },
  { name: 'garlic', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['onions', 'ginger', 'olive oil'] },
  { name: 'ginger', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['garlic', 'green chili', 'cumin'] },
  { name: 'potatoes', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['onions', 'cumin', 'turmeric'] },
  { name: 'carrots', category: 'vegetables', origin: 'Universal', aliases: [], commonPairings: ['onions', 'celery', 'peas'] },
  { name: 'eggs', category: 'protein', origin: 'Universal', aliases: [], commonPairings: ['onions', 'tomatoes', 'cheese'] },
  { name: 'chicken', category: 'protein', origin: 'Universal', aliases: [], commonPairings: ['onions', 'garlic', 'ginger'] },
  { name: 'fish', category: 'protein', origin: 'Universal', aliases: [], commonPairings: ['lemon', 'garlic', 'herbs'] },
  { name: 'milk', category: 'dairy', origin: 'Universal', aliases: [], commonPairings: ['tea', 'coffee', 'cereal'] },
  { name: 'butter', category: 'dairy', origin: 'Universal', aliases: [], commonPairings: ['bread', 'garlic', 'herbs'] },
  { name: 'salt', category: 'seasonings', origin: 'Universal', aliases: [], commonPairings: ['pepper', 'garlic', 'lemon'] },
  { name: 'sugar', category: 'sweeteners', origin: 'Universal', aliases: [], commonPairings: ['tea', 'coffee', 'milk'] },
  { name: 'lemon', category: 'fruits', origin: 'Universal', aliases: [], commonPairings: ['garlic', 'herbs', 'olive oil'] },
  { name: 'lime', category: 'fruits', origin: 'Universal', aliases: [], commonPairings: ['cilantro', 'chili', 'salt'] }
];

export const findIngredientMatches = (searchTerm: string): Ingredient[] => {
  const term = searchTerm.toLowerCase().trim();
  return ingredientDatabase.filter(ingredient => 
    ingredient.name.toLowerCase().includes(term) ||
    ingredient.aliases.some(alias => alias.toLowerCase().includes(term)) ||
    term.includes(ingredient.name.toLowerCase())
  );
};

export const getIngredientsByCategory = (category: string): Ingredient[] => {
  return ingredientDatabase.filter(ingredient => ingredient.category === category);
};

export const getIngredientsByOrigin = (origin: string): Ingredient[] => {
  return ingredientDatabase.filter(ingredient => ingredient.origin === origin);
};