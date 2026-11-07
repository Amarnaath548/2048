/**
 * Authentic, beautiful vector SVG food illustrations for South Indian Dishes.
 * Crafted specifically to replace generic emojis with mouthwatering South Indian delicacies.
 */

export const FOOD_SVG_MAP: Record<number, string> = {
  // Tier 1: Rice Grain (Ponni Rice Bowl with Steam)
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="riceBowl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
      <linearGradient id="riceMound" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>
    </defs>
    <!-- Shadow -->
    <ellipse cx="40" cy="68" rx="28" ry="6" fill="#000000" opacity="0.12"/>
    <!-- Bowl Base -->
    <path d="M 18 42 C 18 64 62 64 62 42 Z" fill="url(#riceBowl)" stroke="#cbd5e1" stroke-width="2"/>
    <ellipse cx="40" cy="42" rx="22" ry="5" fill="#f1f5f9"/>
    <!-- Rice Mound -->
    <path d="M 20 42 C 20 22 60 22 60 42 Z" fill="url(#riceMound)"/>
    <!-- Individual Rice Grains Texture -->
    <ellipse cx="34" cy="34" rx="4" ry="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(-20 34 34)"/>
    <ellipse cx="45" cy="32" rx="4" ry="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(25 45 32)"/>
    <ellipse cx="40" cy="38" rx="4.5" ry="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(5 40 38)"/>
    <ellipse cx="28" cy="39" rx="3.5" ry="1.8" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(40 28 39)"/>
    <ellipse cx="50" cy="38" rx="4" ry="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(-30 50 38)"/>
    <ellipse cx="38" cy="28" rx="4" ry="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" transform="rotate(-10 38 28)"/>
    <!-- Tiny Curry Leaf Garnish -->
    <path d="M 40 25 C 44 20 48 23 46 27 C 44 29 41 27 40 25 Z" fill="#16a34a"/>
    <path d="M 40 25 Q 43 25 46 27" stroke="#15803d" stroke-width="0.6" fill="none"/>
    <!-- Gentle Steam -->
    <path d="M 33 22 Q 31 16 34 11" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M 44 20 Q 47 15 44 9" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
  </svg>`,

  // Tier 2: Fluffy Steamed Idli with Chutney on Banana Leaf
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
      <linearGradient id="idli1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <!-- Banana Leaf Platter Base -->
    <path d="M 10 46 C 10 28 70 28 70 46 C 70 66 10 66 10 46 Z" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>
    <line x1="12" y1="46" x2="68" y2="46" stroke="#166534" stroke-width="1" stroke-dasharray="3,2" opacity="0.7"/>
    <!-- Idli 1 (Left Back) -->
    <ellipse cx="32" cy="42" rx="16" ry="12" fill="url(#idli1)" stroke="#cbd5e1" stroke-width="1.2"/>
    <ellipse cx="31" cy="40" rx="13" ry="9" fill="#ffffff" opacity="0.8"/>
    <!-- Idli 2 (Right Front) -->
    <ellipse cx="48" cy="46" rx="17" ry="13" fill="url(#idli1)" stroke="#cbd5e1" stroke-width="1.2"/>
    <ellipse cx="47" cy="44" rx="14" ry="10" fill="#ffffff" opacity="0.9"/>
    <!-- Idli Steam pores / dimples -->
    <circle cx="44" cy="43" r="1" fill="#cbd5e1"/>
    <circle cx="50" cy="45" r="1" fill="#cbd5e1"/>
    <circle cx="46" cy="48" r="0.9" fill="#cbd5e1"/>
    <!-- Red Tomato / Kara Chutney dollop -->
    <ellipse cx="22" cy="48" rx="8" ry="6" fill="#dc2626"/>
    <ellipse cx="21" cy="47" rx="6" ry="4" fill="#ef4444"/>
    <circle cx="21" cy="47" r="0.8" fill="#1e293b"/>
    <circle cx="24" cy="49" r="0.7" fill="#1e293b"/>
    <!-- White Coconut Chutney dollop -->
    <ellipse cx="60" cy="40" rx="7" ry="5.5" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.8"/>
    <circle cx="59" cy="39" r="0.7" fill="#15803d"/>
    <!-- Steaming Hot Arcs -->
    <path d="M 44 26 Q 42 20 46 15" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M 33 24 Q 35 18 32 13" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.7"/>
  </svg>`,

  // Tier 3: Golden Crispy Rolled Dosa with Chutney & Sambar
  3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="dosaCrust" x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="35%" stop-color="#f59e0b"/>
        <stop offset="70%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="dosaRoll" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
    </defs>
    <!-- Banana Leaf Plate -->
    <ellipse cx="40" cy="50" rx="34" ry="18" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/>
    <!-- Golden Roast Cylindrical Dosa -->
    <g transform="rotate(-16 40 46)">
      <!-- Dosa Outer Roll Body -->
      <rect x="12" y="38" width="56" height="15" rx="7.5" fill="url(#dosaCrust)" stroke="#78350f" stroke-width="1.2"/>
      <!-- Crispy Roast Streaks -->
      <path d="M 22 40 Q 25 46 23 51" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <path d="M 32 39 Q 36 45 33 52" stroke="#78350f" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <path d="M 44 39 Q 47 46 45 52" stroke="#78350f" stroke-width="2.2" stroke-linecap="round" opacity="0.75"/>
      <path d="M 54 40 Q 57 45 55 51" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <!-- Melted Ghee / Butter Pat -->
      <rect x="36" y="37" width="9" height="5" rx="2" fill="#fef08a" stroke="#facc15" stroke-width="1"/>
      <ellipse cx="40" cy="42" rx="7" ry="2" fill="#fde047" opacity="0.5"/>
    </g>
    <!-- Sambar Bowl (Top Right) -->
    <circle cx="60" cy="30" r="8" fill="#ea580c" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="60" cy="30" r="5.5" fill="#f97316"/>
    <!-- Coconut Chutney Bowl (Top Left) -->
    <circle cx="20" cy="32" r="7" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="20" cy="32" r="5" fill="#f8fafc"/>
    <circle cx="20" cy="31" r="0.8" fill="#166534"/>
  </svg>`,

  // Tier 4: Golden Crunchy Medu Vada with Hole & Peppercorns
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <radialGradient id="vadaGold" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="85%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#78350f"/>
      </radialGradient>
    </defs>
    <!-- Shadow -->
    <ellipse cx="40" cy="65" rx="26" ry="7" fill="#000000" opacity="0.14"/>
    <!-- Vada Outer Donut Body -->
    <path fill-rule="evenodd" d="M 40 16 C 56 16 68 28 68 44 C 68 60 56 68 40 68 C 24 68 12 60 12 44 C 12 28 24 16 40 16 Z M 40 34 C 34 34 30 38 30 44 C 30 50 34 54 40 54 C 46 54 50 50 50 44 C 50 38 46 34 40 34 Z" fill="url(#vadaGold)" stroke="#78350f" stroke-width="1.5"/>
    <!-- Crunchy Fried Highlights & Bubbles -->
    <path d="M 28 22 C 34 18 46 18 52 22" stroke="#fef08a" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8"/>
    <circle cx="24" cy="36" r="1.5" fill="#fef3c7" opacity="0.8"/>
    <circle cx="56" cy="34" r="1.6" fill="#fef3c7" opacity="0.8"/>
    <circle cx="26" cy="54" r="1.8" fill="#fef08a" opacity="0.7"/>
    <circle cx="52" cy="56" r="1.6" fill="#fef08a" opacity="0.7"/>
    <!-- Black Peppercorns & Cumin Specks -->
    <circle cx="33" cy="27" r="1.4" fill="#1e293b"/>
    <circle cx="48" cy="26" r="1.3" fill="#1e293b"/>
    <circle cx="58" cy="46" r="1.4" fill="#1e293b"/>
    <circle cx="22" cy="46" r="1.3" fill="#1e293b"/>
    <circle cx="36" cy="61" r="1.4" fill="#1e293b"/>
    <!-- Curry Leaf Bits -->
    <path d="M 44 23 Q 47 21 46 25 Z" fill="#15803d"/>
    <path d="M 23 40 Q 25 38 24 42 Z" fill="#15803d"/>
    <path d="M 45 59 Q 47 57 46 61 Z" fill="#15803d"/>
  </svg>`,

  // Tier 5: Rich Ven Pongal Pot with Roasted Cashews & Ghee
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="60%" stop-color="#c2410c"/>
        <stop offset="100%" stop-color="#7c2d12"/>
      </linearGradient>
      <linearGradient id="pongalMix" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#eab308"/>
      </linearGradient>
    </defs>
    <!-- Pot Body -->
    <ellipse cx="40" cy="68" rx="22" ry="5" fill="#000000" opacity="0.15"/>
    <path d="M 20 44 C 18 66 62 66 60 44 Z" fill="url(#potGrad)" stroke="#7c2d12" stroke-width="2"/>
    <ellipse cx="40" cy="44" rx="20" ry="6" fill="#9a3412"/>
    <!-- Mounded Hot Ven Pongal -->
    <ellipse cx="40" cy="42" rx="19" ry="12" fill="url(#pongalMix)"/>
    <!-- Glistening Ghee Layer -->
    <ellipse cx="40" cy="41" rx="14" ry="7" fill="#facc15" opacity="0.8"/>
    <!-- Golden Roasted Cashews (Kaju) -->
    <!-- Cashew 1 (Crescent) -->
    <path d="M 32 37 C 32 33 37 34 38 37 C 39 40 34 42 32 37 Z" fill="#fef3c7" stroke="#b45309" stroke-width="0.8"/>
    <!-- Cashew 2 (Crescent) -->
    <path d="M 44 39 C 45 35 50 36 49 40 C 48 43 44 43 44 39 Z" fill="#fef3c7" stroke="#b45309" stroke-width="0.8"/>
    <!-- Black Peppercorns (Milagu) -->
    <circle cx="28" cy="42" r="1.5" fill="#1e293b"/>
    <circle cx="39" cy="35" r="1.5" fill="#1e293b"/>
    <circle cx="42" cy="44" r="1.6" fill="#1e293b"/>
    <circle cx="51" cy="41" r="1.4" fill="#1e293b"/>
    <!-- Curry Leaf garnish -->
    <path d="M 38 31 C 42 27 45 30 43 34 Z" fill="#15803d"/>
    <!-- Steam -->
    <path d="M 34 24 Q 31 17 35 11" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M 45 22 Q 48 16 44 10" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
  </svg>`,

  // Tier 6: Hot Sambar Rice (Bisibelebath / சாம்பார் சாதம்)
  6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="bowlSteel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#64748b"/>
      </linearGradient>
      <linearGradient id="sambarRiceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f97316"/>
        <stop offset="50%" stop-color="#ea580c"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </linearGradient>
    </defs>
    <!-- Shadow -->
    <ellipse cx="40" cy="67" rx="26" ry="6" fill="#000000" opacity="0.14"/>
    <!-- Bowl Base -->
    <path d="M 16 42 C 16 66 64 66 64 42 Z" fill="url(#bowlSteel)" stroke="#475569" stroke-width="1.8"/>
    <ellipse cx="40" cy="42" rx="24" ry="6" fill="#94a3b8"/>
    <!-- Hot Sambar Rice Stew -->
    <ellipse cx="40" cy="41" rx="22" ry="11" fill="url(#sambarRiceGrad)"/>
    <!-- Rice Specks mixed in -->
    <ellipse cx="30" cy="38" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.85"/>
    <ellipse cx="48" cy="39" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.85"/>
    <ellipse cx="37" cy="44" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.85"/>
    <!-- Drumstick / Murungakkai piece -->
    <rect x="33" y="38" width="14" height="4.5" rx="2" fill="#15803d" stroke="#14532d" stroke-width="0.8" transform="rotate(-12 40 40)"/>
    <!-- Pearl Shallots / Sambar Vengayam -->
    <circle cx="27" cy="43" r="3" fill="#f43f5e" stroke="#be123c" stroke-width="0.6"/>
    <circle cx="50" cy="42" r="3.2" fill="#f43f5e" stroke="#be123c" stroke-width="0.6"/>
    <!-- Dollop of Pure Ghee in Center -->
    <circle cx="40" cy="38" r="4" fill="#fef08a" stroke="#facc15" stroke-width="1"/>
    <!-- Coriander Leaves -->
    <circle cx="44" cy="45" r="1.2" fill="#22c55e"/>
    <circle cx="34" cy="45" r="1.2" fill="#22c55e"/>
    <!-- Steam -->
    <path d="M 32 24 Q 30 18 33 12" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M 46 22 Q 49 16 45 10" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
  </svg>`,

  // Tier 7: Dindigul Biryani with Boiled Egg & Spices
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="biryaniRice" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="40%" stop-color="#f59e0b"/>
        <stop offset="80%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
    </defs>
    <!-- Plate / Handi -->
    <ellipse cx="40" cy="66" rx="28" ry="6" fill="#000000" opacity="0.14"/>
    <ellipse cx="40" cy="48" rx="30" ry="16" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="40" cy="46" rx="28" ry="14" fill="#9a3412"/>
    <!-- Mountain of Spiced Seeraga Samba Biryani Rice -->
    <path d="M 16 48 C 16 28 64 28 64 48 Z" fill="url(#biryaniRice)"/>
    <!-- Rice Grain Details -->
    <ellipse cx="28" cy="42" rx="3" ry="1.5" fill="#fef9c3" transform="rotate(20 28 42)"/>
    <ellipse cx="50" cy="44" rx="3" ry="1.5" fill="#fef9c3" transform="rotate(-30 50 44)"/>
    <ellipse cx="36" cy="46" rx="3" ry="1.5" fill="#fef9c3" transform="rotate(10 36 46)"/>
    <ellipse cx="42" cy="40" rx="3" ry="1.5" fill="#fef9c3" transform="rotate(-15 42 40)"/>
    <!-- Sliced Boiled Egg (Traditional Dindigul Biryani Crown) -->
    <ellipse cx="38" cy="34" rx="9" ry="6.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <ellipse cx="38" cy="34" rx="5" ry="4" fill="#f59e0b"/>
    <ellipse cx="37" cy="33" rx="4" ry="3" fill="#fbbf24"/>
    <!-- Star Anise (Whole Spice) -->
    <g transform="translate(52, 34) scale(0.6)">
      <path d="M0,-8 L2,-2 L8,-2 L3,2 L5,8 L0,4 L-5,8 L-3,2 L-8,-2 L-2,-2 Z" fill="#451a03"/>
    </g>
    <!-- Fresh Mint / Pudina Leaf -->
    <path d="M 26 34 C 23 30 28 29 29 33 Z" fill="#15803d"/>
    <path d="M 28 35 C 31 32 33 36 29 37 Z" fill="#16a34a"/>
    <!-- Fried Crispy Onions (Birista) -->
    <path d="M 22 45 Q 26 44 25 47" stroke="#451a03" stroke-width="1.2" fill="none"/>
    <path d="M 46 47 Q 50 46 48 49" stroke="#451a03" stroke-width="1.2" fill="none"/>
  </svg>`,

  // Tier 8: Special South Indian Thali Platter (சாப்பாடு தட்டு)
  8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="silverThali" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="40%" stop-color="#e2e8f0"/>
        <stop offset="80%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#64748b"/>
      </linearGradient>
    </defs>
    <!-- Outer Stainless Steel Platter -->
    <circle cx="40" cy="40" r="36" fill="url(#silverThali)" stroke="#475569" stroke-width="2"/>
    <circle cx="40" cy="40" r="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
    <!-- Center Rice with Dal & Ghee -->
    <circle cx="40" cy="40" r="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <circle cx="40" cy="40" r="7" fill="#facc15" opacity="0.9"/>
    <!-- Surrounding Katori Bowls -->
    <!-- 1. Sambar Bowl (Top) -->
    <circle cx="40" cy="16" r="6.5" fill="#ea580c" stroke="#64748b" stroke-width="1.2"/>
    <circle cx="40" cy="16" r="4.5" fill="#f97316"/>
    <!-- 2. Rasam Bowl (Top Right) -->
    <circle cx="58" cy="24" r="6.5" fill="#dc2626" stroke="#64748b" stroke-width="1.2"/>
    <circle cx="58" cy="24" r="4.5" fill="#ef4444"/>
    <!-- 3. Curd / Thayir Bowl (Bottom Right) -->
    <circle cx="60" cy="44" r="6.5" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
    <!-- 4. Payasam Bowl (Bottom) -->
    <circle cx="44" cy="62" r="6" fill="#fef08a" stroke="#64748b" stroke-width="1.2"/>
    <circle cx="44" cy="62" r="4" fill="#fde047"/>
    <!-- 5. Poriyal / Kootu (Top Left) -->
    <circle cx="22" cy="24" r="6.5" fill="#16a34a" stroke="#64748b" stroke-width="1.2"/>
    <!-- Crunchy Round Appalam / Papad (Left) -->
    <circle cx="20" cy="46" r="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
    <circle cx="18" cy="45" r="0.8" fill="#a16207"/>
    <circle cx="22" cy="48" r="0.8" fill="#a16207"/>
    <circle cx="20" cy="43" r="0.8" fill="#a16207"/>
  </svg>`,

  // Tier 9: Grand Banana-leaf Meal (வாழை இலை விருந்து)
  9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="bananaLeafGrad" x1="0" y1="0" x2="1" y2="0.8">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="50%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
    </defs>
    <!-- Shadow -->
    <ellipse cx="40" cy="68" rx="34" ry="6" fill="#000000" opacity="0.14"/>
    <!-- Emerald Plantain Leaf Spread -->
    <path d="M 6 40 C 6 20 74 20 74 40 C 74 62 6 62 6 40 Z" fill="url(#bananaLeafGrad)" stroke="#166534" stroke-width="2"/>
    <!-- Central Leaf Vein -->
    <line x1="8" y1="40" x2="72" y2="40" stroke="#166534" stroke-width="1.5"/>
    <path d="M 20 40 L 15 28 M 35 40 L 30 26 M 50 40 L 45 26 M 65 40 L 60 28" stroke="#166534" stroke-width="0.8" opacity="0.6"/>
    <path d="M 20 40 L 15 52 M 35 40 L 30 54 M 50 40 L 45 54 M 65 40 L 60 52" stroke="#166534" stroke-width="0.8" opacity="0.6"/>
    <!-- Central Steaming Mountain of Rice -->
    <ellipse cx="40" cy="44" rx="14" ry="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <!-- Golden Dal / Sambar flow on Rice -->
    <ellipse cx="40" cy="43" rx="7" ry="4.5" fill="#f59e0b"/>
    <circle cx="40" cy="42" r="2.5" fill="#facc15"/>
    <!-- Traditional Accompaniments along top edge of leaf -->
    <!-- Salt pinch -->
    <circle cx="16" cy="33" r="1.5" fill="#ffffff"/>
    <!-- Spicy Mango Pickle -->
    <circle cx="23" cy="31" r="3" fill="#dc2626"/>
    <!-- Poriyal (Beetroot/Carrot) -->
    <ellipse cx="32" cy="29" rx="4" ry="2.5" fill="#be123c"/>
    <!-- Kootu / Avial -->
    <ellipse cx="44" cy="28" rx="4.5" ry="3" fill="#eab308"/>
    <!-- Pachadi -->
    <ellipse cx="55" cy="30" rx="4" ry="2.5" fill="#f8fafc"/>
    <!-- Sweet Payasam cup -->
    <ellipse cx="65" cy="34" rx="3.5" ry="4" fill="#fef08a" stroke="#b45309" stroke-width="0.8"/>
    <!-- Crunchy Appalam (Bottom Left) -->
    <circle cx="22" cy="49" r="6" fill="#fde047" stroke="#ca8a04" stroke-width="0.8"/>
    <!-- Golden Medu Vada on Leaf (Bottom Right) -->
    <ellipse cx="58" cy="48" rx="6" ry="5" fill="#d97706" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="58" cy="48" r="1.5" fill="#166534"/>
  </svg>`,

  // Tier 10: Grand Festival Feast (திருவிழா விருந்து with Garland & Payasam)
  10: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="festiveGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>
    <!-- Auspicious Marigold Garland Border (Top) -->
    <circle cx="14" cy="16" r="4.5" fill="#f97316"/>
    <circle cx="22" cy="14" r="4.5" fill="#eab308"/>
    <circle cx="31" cy="13" r="5" fill="#f97316"/>
    <circle cx="40" cy="12" r="5.5" fill="#facc15"/>
    <circle cx="49" cy="13" r="5" fill="#f97316"/>
    <circle cx="58" cy="14" r="4.5" fill="#eab308"/>
    <circle cx="66" cy="16" r="4.5" fill="#f97316"/>
    <!-- Festive Brass / Silver Platter -->
    <ellipse cx="40" cy="50" rx="32" ry="18" fill="url(#festiveGold)" stroke="#78350f" stroke-width="1.8"/>
    <!-- Banana Leaf on Platter -->
    <ellipse cx="40" cy="49" rx="28" ry="14" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
    <!-- Feast Rice Mountain -->
    <ellipse cx="38" cy="48" rx="12" ry="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8"/>
    <ellipse cx="38" cy="47" rx="6" ry="3.5" fill="#ea580c"/>
    <!-- Crispy Golden Vadai -->
    <ellipse cx="22" cy="49" rx="6.5" ry="5.5" fill="#d97706" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="22" cy="49" r="1.5" fill="#22c55e"/>
    <!-- Sweet Poli / Sweet Platter -->
    <circle cx="56" cy="46" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="0.8"/>
    <!-- Traditional Silver Payasam Tumbler -->
    <path d="M 46 32 L 53 32 L 51 44 L 48 44 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
    <ellipse cx="49.5" cy="32" rx="3.5" ry="1.5" fill="#fef08a"/>
    <!-- Festive Diya / Lamp Glow -->
    <circle cx="40" cy="66" r="5" fill="#f97316"/>
    <path d="M 40 59 Q 43 63 40 66 Q 37 63 40 59 Z" fill="#fde047"/>
  </svg>`,

  // Tier 11: Ultimate Golden Feast (தங்க விருந்து / Royal 24K Culinary Crown)
  11: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <radialGradient id="royalGold" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="25%" stop-color="#fef08a"/>
        <stop offset="60%" stop-color="#f59e0b"/>
        <stop offset="85%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#78350f"/>
      </radialGradient>
      <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>
    <!-- Radiant Aura Rays -->
    <circle cx="40" cy="42" r="36" fill="#fef08a" opacity="0.3"/>
    <circle cx="40" cy="42" r="32" fill="#fde047" opacity="0.2"/>
    <!-- Royal 24K Golden Platter Base -->
    <ellipse cx="40" cy="52" rx="34" ry="18" fill="url(#royalGold)" stroke="#b45309" stroke-width="2.5"/>
    <ellipse cx="40" cy="50" rx="30" ry="15" fill="url(#goldShine)" stroke="#fef08a" stroke-width="1"/>
    <!-- Golden Saffron Rice with Gold Foil (Varak) -->
    <ellipse cx="40" cy="49" rx="14" ry="9" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
    <ellipse cx="40" cy="48" rx="8" ry="4.5" fill="#f59e0b"/>
    <!-- Royal Diamond Varaks / Sparkles on Rice -->
    <polygon points="38,45 40,43 42,45 40,47" fill="#ffffff"/>
    <polygon points="34,49 36,47 38,49 36,51" fill="#ffffff"/>
    <!-- Golden Delicacies Surrounding -->
    <circle cx="21" cy="48" r="5.5" fill="#f59e0b" stroke="#78350f" stroke-width="1"/>
    <circle cx="59" cy="48" r="5.5" fill="#f59e0b" stroke="#78350f" stroke-width="1"/>
    <!-- Golden Crown Crest on Top -->
    <path d="M 28 26 L 33 16 L 40 22 L 47 16 L 52 26 Z" fill="url(#royalGold)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="33" cy="15" r="2" fill="#ffffff" stroke="#f59e0b" stroke-width="0.8"/>
    <circle cx="40" cy="20" r="2.2" fill="#ef4444" stroke="#b91c1c" stroke-width="0.8"/>
    <circle cx="47" cy="15" r="2" fill="#ffffff" stroke="#f59e0b" stroke-width="0.8"/>
    <rect x="29" y="26" width="22" height="4" rx="1" fill="#b45309"/>
    <!-- Radiant Star Sparkles -->
    <path d="M 16 24 L 18 20 L 20 24 L 24 26 L 20 28 L 18 32 L 16 28 L 12 26 Z" fill="#ffffff"/>
    <path d="M 64 22 L 65.5 19 L 67 22 L 70 23.5 L 67 25 L 65.5 28 L 64 25 L 61 23.5 Z" fill="#ffffff"/>
  </svg>`
};

/**
 * Returns the SVG string for a given food tier (1-11).
 */
export function getFoodSvg(tier: number): string {
  return FOOD_SVG_MAP[tier] || FOOD_SVG_MAP[1];
}

/**
 * Pre-generates crisp canvas textures in Phaser for all 11 food tiers.
 */
export async function initFoodTextures(scene: Phaser.Scene): Promise<void> {
  const promises: Promise<void>[] = [];

  for (let tier = 1; tier <= 11; tier++) {
    const key = `food_tier_${tier}`;
    if (scene.textures.exists(key)) continue;

    const svgStr = FOOD_SVG_MAP[tier];
    if (!svgStr) continue;

    const p = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 80;
          canvas.height = 80;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 80, 80);
            if (scene.textures.exists(key)) {
              scene.textures.remove(key);
            }
            scene.textures.addCanvas(key, canvas);
          }
        } catch (err) {
          console.warn('Failed to register canvas texture for', key, err);
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    });

    promises.push(p);
  }

  await Promise.all(promises);
}
