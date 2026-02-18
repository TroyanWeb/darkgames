import { applyResidentEvil4 } from './game_effects/Resident-Evil-4.js';
import { applyWatchDogsLegion } from './game_effects/Watch-Dogs-Legion.js';
import { applyDyingLight2 } from './game_effects/Dying-Light-2.js';
//import {applyCyberpunk2077} from "./game_effects/Cyberpunk-2077";

document.addEventListener('DOMContentLoaded', function() {
    applyResidentEvil4();
    applyWatchDogsLegion();
    applyDyingLight2();
    //applyCyberpunk2077();
});

