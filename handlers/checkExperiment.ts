import type { Analytics } from "@shopify/ui-extensions/src/surfaces/checkout/api/standard/standard";
import type { ResponsiveBreakpoints } from "../ui/reponsiveness";
import type { IErrorCollector } from "./errorCollector";

interface IExperimentGenericConfig {
  isVisible?: boolean;
  debug?: boolean;
  hideAt?: ResponsiveBreakpoints[];
}

function uuidv4(): string {return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c:string) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16))};

async function checkExperiment<T>(
  uuid:string,
  experiment_id:string,
  analytics:Analytics,
  errorCollector:IErrorCollector,
  deployConfig:T
  ):Promise<T|undefined> {
    return deployConfig;
}

export {checkExperiment,uuidv4,IExperimentGenericConfig};