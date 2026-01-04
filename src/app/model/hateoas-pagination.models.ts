
export interface Link {
    href: string;
}

export interface PageMetadata {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

//  Genérico para poder paginar emprendimientos, viandas, etc.
export interface PagedResponse<T> {
    _embedded?: {
        [key: string]: T[]; 
    };
    _links: {
        first: Link;
        prev?: Link;
        self: Link;
        next?: Link;
        last: Link;
    };
    page: PageMetadata;
}