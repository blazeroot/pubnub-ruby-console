export interface Envelope {
    id: string;
    response: string;
    parsedResponse: string;
    status: number;
    channel: string;
    message: string;
    payload: string;
    service: string;
    timetoken: string;
    responseMessage: string;
    error: boolean;
    action: string;
    uuid: string;
    uuids: string[];
    group: string;
    wildcardChannel: string;
}