
// FROM CLIENT: wmid
// const L_IDS = [1,2,3,4,5,6,7,8,9,10,41,42];
// const K_IDS = [11,12,13,14,15,16,17,18,19,20,43,44];
// const A_IDS = [21,22,23,24,25,26,27,28,29,30,45,46];
// const D_IDS = [31,32,33,34,35,36,37,38,39,40,47,48,101,102,103,104,105,106,107,108,109,110];

import { Save } from "../../../models/save.model";
import { ORMContext } from "../../../server";
import Savefiles, { getWMDefaultBase, getIWMDescentBase } from "../../../data/savefiles";
import { getXPosition, getYPosition } from "./world";
import { logging } from "../../../utils/logger";

const iwm_descent = [201,202,203,204,205,206,207];

export const getWildMonsterSave = (baseid: number, level: number = 10): Save => {
    const fork = ORMContext.em.fork();
    if (iwm_descent.includes(baseid)){
        //logging(baseid.toString());
        const defaultSave = getIWMDescentBase(baseid);
        const save = fork.create(Save, {
            ...defaultSave,
            basename: "",
        });
        save.type = "iwm";
        save.baseid = "0";
        save.basesaveid = baseid;
        save.level = iwm_descent.indexOf(baseid) + 1;
        //logging(JSON.stringify(save));
        return save;
    }
    const x = getXPosition(baseid);
    const y = getYPosition(baseid);
    const tribe = (x + y) % 4;
    const world_level = 10;
    const wmid = (tribe * 10) + 1

    const {save: defaultSave, level: wm_level} = getWMDefaultBase(tribe, level)
    const save = fork.create(Save, {
        ...defaultSave,
        basename: "",
        name: "",
        lastupdateAt: new Date(),
        createdAt: new Date(),
        homebase: [x.toString(), y.toString()],
    });
    save.basesaveid = baseid;
    save.baseid = baseid.toString();
    save.wmid = wmid;
    save.level = wm_level;

    return save;
}
