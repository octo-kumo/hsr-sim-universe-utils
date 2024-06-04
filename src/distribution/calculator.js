// Function to calculate Base DMG
function calculateBaseDMG(skillMultiplier, extraMultiplier, scalingAttribute, extraDMG) {
  return (skillMultiplier + extraMultiplier) * scalingAttribute + extraDMG;
}

// Function to calculate DMG% Multiplier
function calculateDMGMultiplier(elementalDMGPercent, allTypeDMGPercent, doTDMGPercent) {
  return 1 + elementalDMGPercent + allTypeDMGPercent + doTDMGPercent;
}

// Function to calculate DEF Multiplier
function calculateDEFMultiplier(defenderLevel, attackerLevel, defPercent, defReduction, defIgnore) {
  const DEF = Math.max(0, (200 + 10 * defenderLevel) * (1 + defPercent - (defReduction + defIgnore)));
  return 1 - (DEF / (DEF + 200 + 10 * attackerLevel));
}

// Function to calculate RES Multiplier
function calculateRESMultiplier(resPercent = 0.2, resPenPercent = 0) {
  const res = Math.min(Math.max(resPercent - resPenPercent, -1), 0.9);
  return 1 - res;
}

// Function to calculate DMG Taken Multiplier
function calculateDMGTakenMultiplier(elementalDMGTakenPercent = 0, allTypeDMGTakenPercent = 0) {
  return 1 + elementalDMGTakenPercent + allTypeDMGTakenPercent;
}

// Function to calculate Universal DMG Reduction Multiplier
function calculateDMGReductionMultiplier(dmgReductions = []) {
  let reductionMultiplier = 1;
  for (let reduction of dmgReductions) {
    reductionMultiplier *= (1 - reduction);
  }
  return reductionMultiplier;
}

// Function to calculate Weaken Multiplier
function calculateWeakenMultiplier(weakenPercent = 0) {
  return 1 - weakenPercent;
}

export function calculateDMG() {
  const attacker = {
    lv: 80,
    atk: 1094 + 3245,
    dmgAdd: {
      all: 0.1267,
      dot: 0,
      quantum: 0.632,
    },
    resPen: 0,
    defIgnore: 24,
  };
  const attack = {
    stat: 'atk',
    element: 'quantum',
    dot: false,
    mult: 2.64,
    extraMultiplier: 0,
    extraDMG: 0,
  };
  const defender = {
    lv: 82,
    res: {
      quantum: 0.2,
    },
    defReduction: 0,
    dmgTakenAdd: {},
    dmgReduction: [],
    weakened: 0,
    broken: false,
  };
  const baseDMG = calculateBaseDMG(attack.mult, attack.extraMultiplier ?? 0, attacker[attack.stat], attack.extraDMG ?? 0);
  const dmgMultiplier = calculateDMGMultiplier(
    attacker.dmgAdd[attack.element] ?? 0,
    attacker.dmgAdd.all ?? 0,
    attack.dot ? attacker.dmgAdd.dot ?? 0 : 0);
  const defMultiplier = calculateDEFMultiplier(defender.lv, attacker.lv, 0, defender.defReduction, attacker.defIgnore);
  const resMultiplier = calculateRESMultiplier(defender.res[attack.element] ?? 0, attacker.resPen ?? 0);
  const dmgTakenMultiplier = calculateDMGTakenMultiplier(defender.dmgTakenAdd[attack.element] ?? 0, defender.dmgTakenAdd.all ?? 0);
  const DMGReductionMultiplier = calculateDMGReductionMultiplier(defender.dmgReduction ?? []);
  const weakenMultiplier = calculateWeakenMultiplier(defender.weakened ?? 0);
  const brokenMultiplier = defender.broken ? 1 : 0.9;
  return baseDMG * dmgMultiplier * defMultiplier * resMultiplier * dmgTakenMultiplier * DMGReductionMultiplier * weakenMultiplier * brokenMultiplier;
}

console.log(calculateDMG());
console.log(calculateDMG() * 381.9 / 100);
