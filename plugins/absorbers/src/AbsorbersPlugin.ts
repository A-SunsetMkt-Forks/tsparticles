import type { AbsorberOptions, IAbsorberOptions } from "./types.js";
import {
    type Engine,
    type IOptions,
    type IPlugin,
    type RecursivePartial,
    executeOnSingleOrMultiple,
    isArray,
    isInArray,
} from "@tsparticles/engine";
import { Absorber } from "./Options/Classes/Absorber.js";
import { AbsorberClickMode } from "./Enums/AbsorberClickMode.js";
import type { AbsorberContainer } from "./AbsorberContainer.js";
import { Absorbers } from "./Absorbers.js";

/**
 */
export class AbsorbersPlugin implements IPlugin {
    readonly id;

    private readonly _engine;

    constructor(engine: Engine) {
        this.id = "absorbers";
        this._engine = engine;
    }

    async getPlugin(container: AbsorberContainer): Promise<Absorbers> {
        return Promise.resolve(new Absorbers(container, this._engine));
    }

    loadOptions(options: AbsorberOptions, source?: RecursivePartial<IAbsorberOptions>): void {
        if (!this.needsPlugin(options) && !this.needsPlugin(source)) {
            return;
        }

        if (source?.absorbers) {
            options.absorbers = executeOnSingleOrMultiple(source.absorbers, absorber => {
                const tmp = new Absorber();

                tmp.load(absorber);

                return tmp;
            });
        }

        options.interactivity.modes.absorbers = executeOnSingleOrMultiple(
            source?.interactivity?.modes?.absorbers,
            absorber => {
                const tmp = new Absorber();

                tmp.load(absorber);

                return tmp;
            },
        );
    }

    needsPlugin(options?: RecursivePartial<IOptions & IAbsorberOptions>): boolean {
        if (!options) {
            return false;
        }

        const absorbers = options.absorbers;

        if (isArray(absorbers)) {
            return !!absorbers.length;
        } else if (absorbers) {
            return true;
        } else if (
            options.interactivity?.events?.onClick?.mode &&
            isInArray(AbsorberClickMode.absorber, options.interactivity.events.onClick.mode)
        ) {
            return true;
        }

        return false;
    }
}
