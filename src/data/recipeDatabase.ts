// AI-powered recipe database with detailed information
export interface Recipe {
  id: string;
  name: string;
  cuisine: 'Indian' | 'International' | 'Fusion';
  region?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: number; // in minutes
  servings: number;
  ingredients: string[];
  tags: string[];
  description: string;
  instructions?: string[];
}

export interface RecipeWithMatch extends Recipe {
  matchedIngredients?: string[];
  missingIngredients?: string[];
  matchPercentage: number;
}

export const recipeDatabase: Recipe[] = [
  // Simple 2-3 Ingredient Dishes
  {
    id: 'simple-1',
    name: 'Rice and Dal',
    cuisine: 'Indian',
    region: 'Universal',
    difficulty: 'Easy',
    cookingTime: 30,
    servings: 2,
    ingredients: ['rice', 'dal', 'turmeric', 'salt'],
    tags: ['comfort food', 'simple', 'nutritious'],
    description: 'Simple, nutritious combination of rice and lentils - perfect comfort food.',
    instructions: ['Cook rice and dal separately', 'Season with turmeric and salt', 'Serve hot together']
  },
  {
    id: 'simple-2',
    name: 'Bread Omelette',
    cuisine: 'International',
    difficulty: 'Easy',
    cookingTime: 10,
    servings: 1,
    ingredients: ['bread', 'eggs', 'salt', 'pepper'],
    tags: ['breakfast', 'quick', 'protein'],
    description: 'Quick and satisfying breakfast combining bread and eggs.',
    instructions: ['Beat eggs with salt and pepper', 'Dip bread in egg mixture', 'Cook on pan until golden']
  },
  {
    id: 'simple-3',
    name: 'Milk Tea',
    cuisine: 'Indian',
    difficulty: 'Easy',
    cookingTime: 5,
    servings: 1,
    ingredients: ['milk', 'tea', 'sugar', 'cardamom'],
    tags: ['beverage', 'morning', 'comforting'],
    description: 'Classic Indian chai - perfect way to start the day.',
    instructions: ['Boil milk with tea leaves', 'Add sugar and cardamom', 'Strain and serve hot']
  },
  {
    id: 'simple-4',
    name: 'Butter Rice',
    cuisine: 'International',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 2,
    ingredients: ['rice', 'butter', 'salt'],
    tags: ['simple', 'comfort food', 'side dish'],
    description: 'Simple buttered rice - goes with any curry or dish.',
    instructions: ['Cook rice until fluffy', 'Mix in butter and salt', 'Serve warm']
  },
  {
    id: 'simple-5',
    name: 'Scrambled Eggs',
    cuisine: 'International',
    difficulty: 'Easy',
    cookingTime: 5,
    servings: 1,
    ingredients: ['eggs', 'salt', 'pepper', 'butter'],
    tags: ['breakfast', 'protein', 'quick'],
    description: 'Fluffy scrambled eggs - a breakfast classic.',
    instructions: ['Beat eggs with salt and pepper', 'Cook in butter on low heat', 'Stir gently until set']
  },

  // North Indian Dishes
  {
    id: 'north-1',
    name: 'Dal Tadka',
    cuisine: 'Indian',
    region: 'North Indian',
    difficulty: 'Easy',
    cookingTime: 45,
    servings: 4,
    ingredients: ['toor dal', 'turmeric', 'cumin', 'onions', 'tomatoes', 'garlic', 'ginger', 'ghee', 'mustard seeds'],
    tags: ['comfort food', 'protein rich', 'vegetarian'],
    description: 'Classic North Indian lentil curry with aromatic tempering.',
    instructions: ['Cook dal with turmeric', 'Prepare tadka with cumin and mustard seeds', 'Add onions, tomatoes, ginger-garlic', 'Mix with cooked dal']
  },
  {
    id: 'north-2',
    name: 'Rajma (Kidney Bean Curry)',
    cuisine: 'Indian',
    region: 'North Indian',
    difficulty: 'Medium',
    cookingTime: 60,
    servings: 4,
    ingredients: ['kidney beans', 'onions', 'tomatoes', 'ginger', 'garlic', 'cumin', 'coriander', 'garam masala', 'ghee'],
    tags: ['protein rich', 'weekend special', 'comfort food'],
    description: 'Rich and hearty kidney bean curry from Punjab.',
    instructions: ['Soak and cook kidney beans', 'Make masala with onions and tomatoes', 'Add spices and simmer', 'Garnish with fresh coriander']
  },
  {
    id: 'north-3',
    name: 'Aloo Gobi',
    cuisine: 'Indian',
    region: 'North Indian',
    difficulty: 'Easy',
    cookingTime: 30,
    servings: 4,
    ingredients: ['potatoes', 'cauliflower', 'onions', 'turmeric', 'cumin', 'coriander', 'ginger', 'garlic', 'ghee'],
    tags: ['vegetarian', 'dry curry', 'popular'],
    description: 'Classic potato and cauliflower dry curry.',
    instructions: ['Cut vegetables into pieces', 'Cook with spices', 'Stir fry until tender', 'Garnish with coriander']
  },
  {
    id: 'north-4',
    name: 'Paneer Butter Masala',
    cuisine: 'Indian',
    region: 'North Indian',
    difficulty: 'Medium',
    cookingTime: 45,
    servings: 4,
    ingredients: ['paneer', 'tomatoes', 'cream', 'butter', 'onions', 'ginger', 'garlic', 'garam masala', 'fenugreek'],
    tags: ['restaurant style', 'rich', 'vegetarian'],
    description: 'Creamy and rich paneer curry in tomato-based gravy.',
    instructions: ['Make tomato puree', 'Cook with butter and cream', 'Add paneer cubes', 'Garnish with fenugreek leaves']
  },
  {
    id: 'north-5',
    name: 'Chole (Chickpea Curry)',
    cuisine: 'Indian',
    region: 'North Indian',
    difficulty: 'Medium',
    cookingTime: 50,
    servings: 4,
    ingredients: ['chickpeas', 'onions', 'tomatoes', 'ginger', 'garlic', 'cumin', 'coriander', 'garam masala', 'ghee'],
    tags: ['protein rich', 'spicy', 'popular'],
    description: 'Spicy and tangy chickpea curry from Punjab.',
    instructions: ['Soak and cook chickpeas', 'Make spiced masala', 'Simmer together', 'Serve with rice or bread']
  },

  // South Indian Dishes
  {
    id: 'south-1',
    name: 'Sambar',
    cuisine: 'Indian',
    region: 'South Indian',
    difficulty: 'Medium',
    cookingTime: 40,
    servings: 4,
    ingredients: ['toor dal', 'vegetables', 'tamarind', 'sambar powder', 'turmeric', 'curry leaves', 'mustard seeds', 'asafoetida'],
    tags: ['tangy', 'vegetarian', 'traditional'],
    description: 'Tangy lentil curry with vegetables - staple of South Indian cuisine.',
    instructions: ['Cook dal with turmeric', 'Add vegetables and tamarind', 'Season with sambar powder', 'Temper with mustard seeds and curry leaves']
  },
  {
    id: 'south-2',
    name: 'Rasam',
    cuisine: 'Indian',
    region: 'South Indian',
    difficulty: 'Easy',
    cookingTime: 25,
    servings: 4,
    ingredients: ['toor dal', 'tomatoes', 'tamarind', 'rasam powder', 'curry leaves', 'mustard seeds', 'asafoetida', 'coriander'],
    tags: ['comfort food', 'digestive', 'soup-like'],
    description: 'Tangy and spicy soup-like dish with digestive properties.',
    instructions: ['Extract tamarind juice', 'Cook with tomatoes and rasam powder', 'Add dal water', 'Temper with spices']
  },
  {
    id: 'south-3',
    name: 'Coconut Rice',
    cuisine: 'Indian',
    region: 'South Indian',
    difficulty: 'Easy',
    cookingTime: 25,
    servings: 4,
    ingredients: ['rice', 'coconut', 'curry leaves', 'mustard seeds', 'urad dal', 'ginger', 'green chili', 'ghee'],
    tags: ['fragrant', 'festive', 'coconut'],
    description: 'Aromatic rice dish with fresh coconut and South Indian tempering.',
    instructions: ['Cook rice separately', 'Grate fresh coconut', 'Temper with mustard seeds and curry leaves', 'Mix all together']
  },
  {
    id: 'south-4',
    name: 'Upma',
    cuisine: 'Indian',
    region: 'South Indian',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 4,
    ingredients: ['semolina', 'onions', 'curry leaves', 'mustard seeds', 'urad dal', 'ginger', 'green chili', 'ghee'],
    tags: ['breakfast', 'healthy', 'quick'],
    description: 'Healthy breakfast dish made with semolina and vegetables.',
    instructions: ['Roast semolina', 'Temper spices', 'Add vegetables', 'Cook with water until thick']
  },

  // Gujarati Dishes
  {
    id: 'gujarati-1',
    name: 'Dhokla',
    cuisine: 'Indian',
    region: 'Gujarati',
    difficulty: 'Medium',
    cookingTime: 30,
    servings: 4,
    ingredients: ['gram flour', 'yogurt', 'ginger', 'green chili', 'turmeric', 'mustard seeds', 'curry leaves', 'asafoetida'],
    tags: ['steamed', 'healthy', 'snack'],
    description: 'Soft and spongy steamed cake made from gram flour.',
    instructions: ['Make batter with gram flour and yogurt', 'Steam for 15-20 minutes', 'Temper with mustard seeds', 'Garnish with coriander']
  },
  {
    id: 'gujarati-2',
    name: 'Gujarati Khichdi',
    cuisine: 'Indian',
    region: 'Gujarati',
    difficulty: 'Easy',
    cookingTime: 35,
    servings: 4,
    ingredients: ['rice', 'moong dal', 'turmeric', 'cumin', 'asafoetida', 'ginger', 'ghee', 'vegetables'],
    tags: ['comfort food', 'one pot', 'nutritious'],
    description: 'Comforting one-pot meal with rice, lentils, and vegetables.',
    instructions: ['Cook rice and dal together', 'Add vegetables and spices', 'Season with ghee', 'Serve with yogurt']
  },
  {
    id: 'gujarati-3',
    name: 'Thepla',
    cuisine: 'Indian',
    region: 'Gujarati',
    difficulty: 'Medium',
    cookingTime: 30,
    servings: 4,
    ingredients: ['wheat flour', 'fenugreek leaves', 'turmeric', 'cumin', 'coriander', 'ginger', 'green chili', 'yogurt'],
    tags: ['flatbread', 'travel food', 'healthy'],
    description: 'Spiced flatbread with fenugreek leaves - perfect travel food.',
    instructions: ['Knead dough with fenugreek and spices', 'Roll into flatbreads', 'Cook on griddle', 'Serve with pickle']
  },

  // Bengali Dishes
  {
    id: 'bengali-1',
    name: 'Fish Curry (Macher Jhol)',
    cuisine: 'Indian',
    region: 'Bengali',
    difficulty: 'Medium',
    cookingTime: 45,
    servings: 4,
    ingredients: ['fish', 'potatoes', 'onions', 'tomatoes', 'ginger', 'garlic', 'turmeric', 'cumin', 'mustard oil'],
    tags: ['traditional', 'mustard oil', 'comfort food'],
    description: 'Traditional Bengali fish curry with potatoes in light gravy.',
    instructions: ['Marinate fish with turmeric', 'Fry lightly', 'Make gravy with onions and tomatoes', 'Simmer with fish and potatoes']
  },
  {
    id: 'bengali-2',
    name: 'Aloo Posto',
    cuisine: 'Indian',
    region: 'Bengali',
    difficulty: 'Easy',
    cookingTime: 25,
    servings: 4,
    ingredients: ['potatoes', 'poppy seeds', 'mustard oil', 'turmeric', 'salt', 'green chili'],
    tags: ['vegetarian', 'simple', 'traditional'],
    description: 'Simple Bengali potato curry with poppy seeds.',
    instructions: ['Grind poppy seeds', 'Cook potatoes with turmeric', 'Mix with poppy seed paste', 'Season with mustard oil']
  },

  // International Dishes
  {
    id: 'international-1',
    name: 'Classic Pasta Marinara',
    cuisine: 'International',
    region: 'Italian',
    difficulty: 'Easy',
    cookingTime: 25,
    servings: 4,
    ingredients: ['pasta', 'tomatoes', 'garlic', 'basil', 'olive oil', 'onions', 'oregano'],
    tags: ['italian', 'vegetarian', 'quick'],
    description: 'Classic Italian pasta with fresh tomato sauce.',
    instructions: ['Cook pasta al dente', 'Make tomato sauce with garlic and herbs', 'Toss pasta with sauce', 'Garnish with fresh basil']
  },
  {
    id: 'international-2',
    name: 'Caesar Salad',
    cuisine: 'International',
    region: 'American',
    difficulty: 'Easy',
    cookingTime: 15,
    servings: 4,
    ingredients: ['lettuce', 'parmesan', 'croutons', 'anchovy', 'olive oil', 'lemon', 'garlic'],
    tags: ['salad', 'fresh', 'classic'],
    description: 'Classic Caesar salad with crisp lettuce and parmesan.',
    instructions: ['Prepare lettuce', 'Make Caesar dressing', 'Toss with croutons and parmesan', 'Serve immediately']
  },
  {
    id: 'international-3',
    name: 'Avocado Toast',
    cuisine: 'International',
    region: 'Modern',
    difficulty: 'Easy',
    cookingTime: 10,
    servings: 2,
    ingredients: ['bread', 'avocado', 'salt', 'pepper', 'lemon', 'olive oil'],
    tags: ['healthy', 'breakfast', 'trendy'],
    description: 'Modern healthy breakfast with creamy avocado on toast.',
    instructions: ['Toast bread', 'Mash avocado with lemon', 'Season with salt and pepper', 'Drizzle with olive oil']
  },
  {
    id: 'international-4',
    name: 'Greek Salad',
    cuisine: 'International',
    region: 'Greek',
    difficulty: 'Easy',
    cookingTime: 15,
    servings: 4,
    ingredients: ['tomatoes', 'cucumbers', 'olives', 'feta cheese', 'olive oil', 'oregano', 'onions'],
    tags: ['fresh', 'mediterranean', 'healthy'],
    description: 'Fresh Mediterranean salad with feta and olives.',
    instructions: ['Chop vegetables', 'Add olives and feta', 'Dress with olive oil and oregano', 'Let flavors meld']
  },
  {
    id: 'international-5',
    name: 'Chicken Stir Fry',
    cuisine: 'International',
    region: 'Asian',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 4,
    ingredients: ['chicken', 'vegetables', 'soy sauce', 'garlic', 'ginger', 'oil', 'rice'],
    tags: ['quick', 'healthy', 'asian'],
    description: 'Quick and healthy chicken stir fry with vegetables.',
    instructions: ['Cut chicken and vegetables', 'Heat oil in wok', 'Stir fry chicken first', 'Add vegetables and seasonings']
  },
  {
    id: 'international-6',
    name: 'Pizza Margherita',
    cuisine: 'International',
    region: 'Italian',
    difficulty: 'Medium',
    cookingTime: 45,
    servings: 4,
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil'],
    tags: ['italian', 'classic', 'weekend project'],
    description: 'Classic Italian pizza with tomato, mozzarella, and fresh basil.',
    instructions: ['Roll out dough', 'Spread tomato sauce', 'Add mozzarella', 'Bake until crispy', 'Garnish with basil']
  },
  {
    id: 'international-7',
    name: 'Tacos',
    cuisine: 'International',
    region: 'Mexican',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 4,
    ingredients: ['tortillas', 'chicken', 'onions', 'cilantro', 'lime', 'cheese', 'tomatoes'],
    tags: ['mexican', 'street food', 'fun'],
    description: 'Mexican-style tacos with seasoned chicken and fresh toppings.',
    instructions: ['Cook seasoned chicken', 'Warm tortillas', 'Assemble with toppings', 'Serve with lime']
  },

  // Fusion Dishes
  {
    id: 'fusion-1',
    name: 'Masala Pasta',
    cuisine: 'Fusion',
    region: 'Indo-Italian',
    difficulty: 'Easy',
    cookingTime: 25,
    servings: 4,
    ingredients: ['pasta', 'onions', 'tomatoes', 'garam masala', 'turmeric', 'ginger', 'garlic', 'cream'],
    tags: ['fusion', 'spicy', 'creamy'],
    description: 'Indian-spiced pasta with creamy tomato sauce.',
    instructions: ['Cook pasta', 'Make spiced tomato sauce', 'Add cream', 'Toss with pasta']
  },
  {
    id: 'fusion-2',
    name: 'Curry Fried Rice',
    cuisine: 'Fusion',
    region: 'Indo-Chinese',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 4,
    ingredients: ['rice', 'vegetables', 'curry powder', 'soy sauce', 'ginger', 'garlic', 'eggs'],
    tags: ['fusion', 'leftover rice', 'spicy'],
    description: 'Indian-spiced fried rice with vegetables.',
    instructions: ['Use day-old rice', 'Stir fry with curry spices', 'Add vegetables and soy sauce', 'Scramble eggs into rice']
  }
];

export const findRecipesByIngredients = (availableIngredients: string[]): RecipeWithMatch[] => {
  return recipeDatabase.map(recipe => {
    const normalizedAvailable = availableIngredients.map(ing => ing.toLowerCase().trim());
    const normalizedRequired = recipe.ingredients.map(ing => ing.toLowerCase().trim());
    
    const matchedIngredients = normalizedRequired.filter(required =>
      normalizedAvailable.some(available => 
        available.includes(required) || 
        required.includes(available) ||
        // Check for common aliases
        (required === 'dal' && available.includes('lentil')) ||
        (required === 'lentil' && available.includes('dal')) ||
        (required === 'atta' && available.includes('wheat flour')) ||
        (required === 'wheat flour' && available.includes('atta'))
      )
    );
    
    const missingIngredients = normalizedRequired.filter(required =>
      !normalizedAvailable.some(available => 
        available.includes(required) || 
        required.includes(available) ||
        (required === 'dal' && available.includes('lentil')) ||
        (required === 'lentil' && available.includes('dal')) ||
        (required === 'atta' && available.includes('wheat flour')) ||
        (required === 'wheat flour' && available.includes('atta'))
      )
    );
    
    const matchPercentage = (matchedIngredients.length / normalizedRequired.length) * 100;
    
    return {
      ...recipe,
      matchedIngredients,
      missingIngredients,
      matchPercentage
    };
  });
};

export const getRecipesByDifficulty = (difficulty: string): Recipe[] => {
  return recipeDatabase.filter(recipe => recipe.difficulty === difficulty);
};

export const getRecipesByCuisine = (cuisine: string): Recipe[] => {
  return recipeDatabase.filter(recipe => recipe.cuisine === cuisine);
};

export const getRecipesByTag = (tag: string): Recipe[] => {
  return recipeDatabase.filter(recipe => recipe.tags.includes(tag));
};