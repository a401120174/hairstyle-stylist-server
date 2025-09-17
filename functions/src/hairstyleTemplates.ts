import { HairstyleTemplate } from "./types";
import { HAIRSTYLE_FILE_MAP } from "./config";
import { getPublicUrl } from "./services/storageService";

/**
 * Complete hairstyle templates data
 */
export const HAIRSTYLE_TEMPLATES = {
  "male_hairstyles": [
    {
      "key": "male_korean_wolf_cut",
      "name": "韓系碎蓋頭",
      "prompt": "a Korean wolf cut, featuring layered and textured hair with a longer back and shorter sides."
    },
    {
      "key": "male_taper_fade",
      "name": "漸層油頭",
      "prompt": "a taper fade haircut, characterized by hair that gradually shortens from the top to the bottom, creating a seamless gradient effect."
    },
    {
      "key": "male_buzz_cut",
      "name": "美式寸頭",
      "prompt": "a buzz cut, a very short haircut of uniform length all over the head."
    },
    {
      "key": "male_american_curls",
      "name": "美式捲髮",
      "prompt": "an American-style curly haircut, with defined and textured curls on top and clean sides."
    },
    {
      "key": "male_middle_part_bob",
      "name": "中分短髮",
      "prompt": "a middle part bob haircut, with hair parted down the center and falling just below the ears."
    },
    {
      "key": "male_longer_wolf_cut",
      "name": "中長髮狼剪",
      "prompt": "a longer wolf cut, featuring choppy, layered hair with a shaggy texture and bangs."
    },
    {
      "key": "male_pompadour",
      "name": "飛機頭",
      "prompt": "a pompadour haircut, with a large volume of hair swept up from the face and worn high over the forehead."
    },
    {
      "key": "male_slicked_back_undercut",
      "name": "後梳Undercut",
      "prompt": "a slicked back undercut, with the sides and back of the head shaved or faded and the top hair combed straight back."
    },
    {
      "key": "male_teddy_bear_perm",
      "name": "泰迪捲",
      "prompt": "a teddy bear perm, featuring fluffy, voluminous, and loose curls that frame the face."
    },
    {
      "key": "male_samurai_bun",
      "name": "武士頭",
      "prompt": "a samurai bun, where the top section of the hair is tied into a bun at the crown while the rest hangs loose."
    }
  ],
  "female_hairstyles": [
    {
      "key": "female_hime_cut",
      "name": "公主切",
      "prompt": "a hime cut, a Japanese hairstyle with straight, cheek-length side locks and a blunt, straight fringe."
    },
    {
      "key": "female_high_layered_lob",
      "name": "高層次鎖骨髮",
      "prompt": "a high-layered lob, a shoulder-length bob with layers to create movement and volume."
    },
    {
      "key": "female_japanese_wool_perm",
      "name": "日系羊毛捲",
      "prompt": "a Japanese wool perm, featuring fluffy, soft, and naturally voluminous curls."
    },
    {
      "key": "female_korean_layered_short_hair",
      "name": "韓系層次短髮",
      "prompt": "a Korean-style layered short hair, with soft layers and texture that frames the face."
    },
    {
      "key": "female_french_wave_mid_length_hair",
      "name": "法式波浪中長髮",
      "prompt": "a French wave hairstyle, featuring loose, effortless waves on mid-length hair."
    },
    {
      "key": "female_hidden_earlobe_dye",
      "name": "耳圈染",
      "prompt": "a hidden earlobe dye, with a different color of hair dyed on the inner strands near the ears."
    },
    {
      "key": "female_manga_bangs",
      "name": "漫畫瀏海",
      "prompt": "a manga bangs, a thick, straight, and blunt fringe that frames the eyes."
    },
    {
      "key": "female_shoulder_length_flip_out",
      "name": "齊肩外翹短髮",
      "prompt": "a shoulder-length bob, where the ends are styled to flip outwards."
    },
    {
      "key": "female_lazy_curls",
      "name": "慵懶捲髮",
      "prompt": "a lazy curls hairstyle, featuring loose, casual, and slightly messy curls that give an effortless look."
    },
    {
      "key": "female_collarbone_hime_cut",
      "name": "鎖骨公主切",
      "prompt": "a collarbone-length hime cut, with side sections reaching the collarbone and a blunt fringe."
    }
  ]
} as const;

/**
 * Get all hairstyle templates as a flat array
 */
export function getAllHairstyleTemplates(): HairstyleTemplate[] {
  return [
    ...HAIRSTYLE_TEMPLATES.male_hairstyles,
    ...HAIRSTYLE_TEMPLATES.female_hairstyles
  ].map(hairstyle => {
    const fileName = HAIRSTYLE_FILE_MAP[hairstyle.key];
    const imageUrl = getPublicUrl(`hairstyles/${fileName}`)
    
    return {
      key: hairstyle.key,
      name: hairstyle.name,
      prompt: hairstyle.prompt,
      imageUrl,
      available: true
    };
  });
}

/**
 * Get all valid hairstyle keys
 */
export function getAllHairstyleKeys(): string[] {
  return [
    ...HAIRSTYLE_TEMPLATES.male_hairstyles.map(h => h.key),
    ...HAIRSTYLE_TEMPLATES.female_hairstyles.map(h => h.key)
  ];
}

/**
 * Check if a hairstyle key is valid
 */
export function isValidHairstyleKey(key: string): boolean {
  const allKeys = getAllHairstyleKeys();
  return allKeys.includes(key);
}

/**
 * Get hairstyle template by key
 */
export function getHairstyleByKey(key: string): HairstyleTemplate | undefined {
  const allTemplates = getAllHairstyleTemplates();
  return allTemplates.find(template => template.key === key);
}