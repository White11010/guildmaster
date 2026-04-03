export enum LogEventTypes {
    NEW_MERCENARY,
    NEW_CONTRACT
}

export interface LogEvent {
    id: string;
    text: string;
    type: LogEventTypes
}