import type React from 'react';

export type useStateDefinition<T> = React.Dispatch<React.SetStateAction<T>>;
export type useRefDefinition<T> = React.RefObject<T>;

//React.Dispatch<React.SetStateAction<boolean>>