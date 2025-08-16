import type { Breakpoint, MaybeResponsiveConditionalStyle, ViewProps } from "@shopify/ui-extensions-react/checkout";
import { Style } from "@shopify/ui-extensions-react/checkout";

type AtLeastOneRecord<K extends PropertyKey, T> = Partial<Record<K, T>> & { [P in K]-?: Required<Pick<Record<K, T>, P>> }[K];

const supportedBreakpoints = [
    "small",
    "medium",
    "large"
] as const satisfies readonly Breakpoint[];

type SupportedDisplayValues = Extract<ViewProps["display"],"auto"|"none">;

const conditionalViewDisplayMap: [ResponsiveBreakpoints, MaybeResponsiveConditionalStyle<SupportedDisplayValues>][] = [
    ["small",Style.default("auto").when({viewportInlineSize: {min: 'small'}}, "none")],
    ["medium",Style.default("none").when({viewportInlineSize: {min: 'small'}}, "auto").when({viewportInlineSize: {min: 'medium'}}, "none")],
    ["large",Style.default("none").when({viewportInlineSize: {min: 'medium'}}, "auto")]
];

type ConditionalViewDisplayMapFallback = [null, SupportedDisplayValues][]

type ResponsiveValue<T> = T | ResponsiveSizes<T>;

type ResponsiveBreakpoints = Extract<Breakpoint, typeof supportedBreakpoints[number]>;

type ResponsiveSizes<T> = AtLeastOneRecord<ResponsiveBreakpoints, T>;

function isResponsiveObject<T>(input: ResponsiveValue<T>): input is ResponsiveSizes<T> {
    return (
        typeof input === "object" &&
        input !== null &&
        supportedBreakpoints.some((bp) => bp in (input as object))
    );
}

function getResponsiveValue<T>(input:ResponsiveValue<T>|T, resp_size:ResponsiveBreakpoints, fallback?: T):T|undefined {
    return (isResponsiveObject(input) ? input[resp_size] : input) || fallback;
}

type ResponsiveConditionalStyleFn<T> = (value: ResponsiveValue<T>, resp_size:ResponsiveBreakpoints, fallback?:T, ...args:unknown[]) => T;

function prepareResponsiveConditionalStyle<T>(fn:ResponsiveConditionalStyleFn<T>, value: ResponsiveValue<T>, fallback?: T): MaybeResponsiveConditionalStyle<T> {
    return Style.default(fn(value, "small" , fallback))
    .when({viewportInlineSize: {min: 'small'}}, fn(value, "medium" , fallback))
    .when({viewportInlineSize: {min: 'medium'}}, fn(value, "large" , fallback))
}

function getMaybeResponsiveConditionalStyle<T> (value: ResponsiveValue<T>, fallback: T): MaybeResponsiveConditionalStyle<T> {
    return isResponsiveObject(value) ? prepareResponsiveConditionalStyle(getResponsiveValue, value, fallback):(value || fallback);
}

export {
    conditionalViewDisplayMap, ConditionalViewDisplayMapFallback, getMaybeResponsiveConditionalStyle, getResponsiveValue, isResponsiveObject, prepareResponsiveConditionalStyle, ResponsiveBreakpoints, ResponsiveSizes, ResponsiveValue, supportedBreakpoints, SupportedDisplayValues, AtLeastOneRecord
};

