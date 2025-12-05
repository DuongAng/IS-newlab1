

export interface RowData {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: Date;
    genre: Genre;
    numberOfParticipants: number;
    singlesCount: number;
    description: string;
    bestAlbum: BestAlbum;
    albumsCount: number;
    studio: Studio;
    studioAddress: string;
    createdBy: number;
}

export enum Genre {
    PROGRESSIVE_ROCK = 'PROGRESSIVE_ROCK',
    PSYCHEDELIC_ROCK = 'PSYCHEDELIC_ROCK',
    HIP_HOP = 'HIP_HOP',
    SOUL = 'SOUL',
    BRIT_POP = 'BRIT_POP'

}

export interface Coordinates {
    id: number;
    x: number;
    y: number;
}

export interface BestAlbum {
    id: number;
    name: string;
    tracks: number;

}

export interface Studio {
    id: number,
    name: string,
    address: string,
    createdBy: number
}


export enum AccessRights {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface RegisterData {
    username: string;
    password: string;
    roles: AccessRights[]
}

export interface importHistoryData {
    id: number,
    status: string
    userId: number,
    objectsCount: number,
    fileName: string
}